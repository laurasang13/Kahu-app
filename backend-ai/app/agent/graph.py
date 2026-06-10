from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from typing import TypedDict, Annotated
import operator
import os
from dotenv import load_dotenv

from app.agent.tools import registrar_receta, actualizar_registro_vet
from app.agent.prompts import SYSTEM_PROMPT
from app.rag.retriever import get_retriever

load_dotenv()

TOOLS = [registrar_receta, actualizar_registro_vet]

class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    mascota_id: str

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

    # RAG: recuperar contexto relevante
    docs = retriever.invoke(last_message)
    context = "\n\n".join([d.page_content for d in docs])

    system = SystemMessage(content=f"{SYSTEM_PROMPT}\n\nContexto relevante de los documentos:\n{context}\n\nID de mascota activa: {state['mascota_id']}\nUsa SIEMPRE este ID exacto al llamar a las tools.")
    messages = [system] + state["messages"]

    try:
        llm = get_llm()
        response = llm.invoke(messages)
    except Exception as e:
        if "rate_limit" in str(e).lower() or "429" in str(e):
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