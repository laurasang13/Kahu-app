from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from langchain_core.messages import HumanMessage, AIMessage
from app.agent.graph import kahu_graph

router = APIRouter()

class ChatRequest(BaseModel):
    mascota_id: str
    mensaje: str
    historial: list[dict] = []
    usuario_email: str = ""
    nombre_perro: str = "" 

class ChatResponse(BaseModel):
    respuesta: str

def parse_historial(historial: list[dict]):
    messages = []
    for msg in historial:
        if msg["rol"] == "user":
            messages.append(HumanMessage(content=msg["mensaje"]))
        elif msg["rol"] == "assistant":
            messages.append(AIMessage(content=msg["mensaje"]))
    return messages

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        messages = parse_historial(request.historial)
        messages.append(HumanMessage(content=request.mensaje))

        result = await kahu_graph.ainvoke({"messages": messages, "mascota_id": request.mascota_id, "usuario_email": request.usuario_email, "nombre_perro": request.nombre_perro})

        last_message = result["messages"][-1]
        return ChatResponse(respuesta=last_message.content)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/history/{mascota_id}")
async def get_history(mascota_id: str):
    # El historial se obtiene del backend Node, FastAPI solo lo recibe como contexto
    # Este endpoint es un proxy opcional
    import httpx
    import os
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{os.getenv('NODE_BACKEND_URL')}/api/chat/history/{mascota_id}"
        )
        return response.json()

