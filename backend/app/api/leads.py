from fastapi import APIRouter
from pydantic import BaseModel
from app.db import supabase
import asyncio

router = APIRouter()

class Lead(BaseModel):
    session_id: str
    customer_name: str | None = None
    customer_contact: str | None = None
    conversation_summary: str
    score: int
    vehicle_interest: str | None = None

@router.get("/")
async def list_leads():
    def _query():
        return supabase.table("negociaciones").select("*").order("created_at", desc=True).execute().data
    return await asyncio.to_thread(_query)

@router.post("/")
async def create_lead(lead: Lead):
    def _query():
        return supabase.table("negociaciones").insert(lead.model_dump()).execute().data[0]
    return await asyncio.to_thread(_query)
