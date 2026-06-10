import httpx
import os
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:3001")

@tool
async def registrar_receta(
    mascota_id: str,
    fecha: str,
    ingredientes: str,
    proporciones: str,
    calorias_total: str,
    notas_ia: str
) -> str:
    """
    Guarda un plan nutricional generado por el agente en la base de datos.
    Úsala cuando el usuario pida una receta o plan semanal completo.
    fecha formato: YYYY-MM-DD
    calorias_total DEBE ser un número entero o decimal, NUNCA un string. Ejemplo: 1350 (no "1350")
    """
    try:
        calorias_float = float(calorias_total)
    except (ValueError, TypeError):
        calorias_float = 0.0

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{NODE_BACKEND_URL}/api/planes",
            json={
                "mascota_id": mascota_id,
                "fecha": fecha,
                "ingredientes": ingredientes,
                "proporciones": proporciones,
                "calorias_total": calorias_float,
                "notas_ia": notas_ia
            },
            headers={"Authorization": f"Bearer {os.getenv('INTERNAL_SERVICE_TOKEN')}"}
        )
        if response.status_code == 201:
            return "✅ Plan nutricional guardado correctamente."
        return f"❌ Error al guardar el plan: {response.text}"

@tool
async def actualizar_registro_vet(
    mascota_id: str,
    fecha_visita: str,
    motivo: str,
    descripcion: str,
    tratamiento: str,
    proxima_cita: str = None
) -> str:
    """
    Guarda un evento veterinario en el historial de la mascota.
    Úsala cuando el usuario mencione una visita al veterinario o evento de salud.
    fechas formato: YYYY-MM-DD
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{NODE_BACKEND_URL}/api/historial-vet",
            json={
                "mascota_id": mascota_id,
                "fecha_visita": fecha_visita,
                "motivo": motivo,
                "descripcion": descripcion,
                "tratamiento": tratamiento,
                "proxima_cita": proxima_cita
            },
            headers={"Authorization": f"Bearer {os.getenv('INTERNAL_SERVICE_TOKEN')}"}
        )
        if response.status_code == 201:
            return "✅ Registro veterinario guardado correctamente."
        return f"❌ Error al guardar el registro: {response.text}"