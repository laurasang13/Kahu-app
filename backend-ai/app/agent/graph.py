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

def get_llm():
    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        api_key=os.getenv("GROQ_API_KEY")
    ).bind_tools(TOOLS)

def agent_node(state: AgentState):
    retriever = get_retriever()
    last_message = state["messages"][-1].content

    # RAG: recuperar contexto relevante
    docs = retriever.invoke(last_message)
    context = "\n\n".join([d.page_content for d in docs])

    system = SystemMessage(content=f"{SYSTEM_PROMPT}\n\nContexto relevante de los documentos:\n{context}")
    messages = [system] + state["messages"]

    llm = get_llm()
    response = llm.invoke(messages)
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