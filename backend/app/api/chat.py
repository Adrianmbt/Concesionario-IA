from fastapi import APIRouter
from pydantic import BaseModel
from app.services.lead_scorer import score_lead
import asyncio

router = APIRouter()

class ChatMessage(BaseModel):
    session_id: str
    message: str

async def _get_response(session_id: str, message: str) -> str:
    try:
        from app.rag.engine import get_rag_response
        return await get_rag_response(session_id, message)
    except Exception:
        # Ollama no disponible — fallback hasta que se instale
        return "Hola, soy el asistente de AutoPrime. Por el momento estoy en modo básico. ¿En qué puedo ayudarte?"

@router.post("/")
async def chat(payload: ChatMessage):
    response = await _get_response(payload.session_id, payload.message)
    lead_score = score_lead(payload.message)
    return {
        "response": response,
        "lead_score": lead_score,
        "hot_lead": lead_score >= 7
    }
