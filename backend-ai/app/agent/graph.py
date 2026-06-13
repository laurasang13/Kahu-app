from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from typing import TypedDict, Annotated
import operator
import os
from dotenv import load_dotenv

SOURCE_NAMES = {
    "doc1_alimentos_maestro.md": "Guía de alimentos (permitidos/prohibidos)",
    "doc2_porciones_y_calculos.md": "Porciones y cálculos de ración",
    "doc3_guia_barf_completa.md": "Guía BARF completa",
    "doc4_cuidados_por_etapa.md": "Cuidados por etapa de vida",
    "doc5_adiestramiento_positivo.md": "Adiestramiento en positivo",
}

from app.agent.tools import registrar_receta, actualizar_registro_vet
from app.agent.prompts import SYSTEM_PROMPT
from app.rag.retriever import get_retriever
from datetime import date


load_dotenv()

TOOLS = [registrar_receta, actualizar_registro_vet]

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    mascota_id: str
    usuario_email: str
    nombre_perro: str

def get_llm(use_second_key=False):
    api_key = os.getenv("GROQ_SECOND_API_KEY") if use_second_key else os.getenv("GROQ_API_KEY")
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        api_key=api_key
    ).bind_tools(TOOLS)

def agent_node(state: AgentState):
    retriever = get_retriever()
    last_message = state["messages"][-1].content

    # RAG: recuperar contexto relevante con metadatos de fuente
    # Eliminar el prefijo [Contexto: ...] para que el retriever busque solo la pregunta real
    import re
    clean_query = re.sub(r'^\[Contexto:[^\]]*\]\s*', '', last_message)
    docs = retriever.invoke(clean_query or last_message)
    context_parts = []
    for d in docs:
        filename = os.path.basename(d.metadata.get("source", ""))
        source_label = SOURCE_NAMES.get(filename, filename)
        context_parts.append(f"[Fuente: {source_label}]\n{d.page_content}")
    context = "\n\n".join(context_parts)

    system = SystemMessage(content=f"{SYSTEM_PROMPT}\n\nContexto relevante de los documentos:\n{context}\n\nID de mascota activa: {state['mascota_id']}\nEmail del usuario: {state['usuario_email']}\nNombre del perro: {state['nombre_perro']}\nUsa SIEMPRE estos datos exactos al llamar a las tools.\nFecha de hoy: {date.today().isoformat()}")
    messages = [system] + state["messages"]

    try:
        llm = get_llm()
        response = llm.invoke(messages)
    except Exception as e:
        print(f"Error tipo: {type(e).__name__}, mensaje: {str(e)[:100]}")
        if "rate_limit" in str(e).lower() or "429" in str(e) or "RateLimitError" in type(e).__name__:
            print("Usando segunda key...")
            llm = get_llm(use_second_key=True)
            response = llm.invoke(messages)
        else:
            raise

    return {"messages": [response]}

def should_continue(state: AgentState):
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return END

def build_graph():
    graph = StateGraph(AgentState)

    graph.add_node("agent", agent_node)
    graph.add_node("tools", ToolNode(TOOLS))

    graph.set_entry_point("agent")
    graph.add_conditional_edges("agent", should_continue)
    graph.add_edge("tools", "agent")

    return graph.compile()

kahu_graph = build_graph()