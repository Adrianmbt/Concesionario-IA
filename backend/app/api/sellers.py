from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import supabase
import asyncio

router = APIRouter()

class Seller(BaseModel):
    nombre_completo: str
    rol: Optional[str] = "vendedor"
    telefono: Optional[str] = None

@router.get("/")
async def list_sellers():
    def _q():
        return supabase.table("perfiles").select("*").execute().data
    return await asyncio.to_thread(_q)

@router.post("/")
async def create_seller(seller: Seller):
    def _q():
        return supabase.table("perfiles").insert(seller.model_dump()).execute().data[0]
    return await asyncio.to_thread(_q)

@router.patch("/{seller_id}")
async def update_seller(seller_id: str, updates: dict):
    def _q():
        return supabase.table("perfiles").update(updates).eq("id", seller_id).execute().data[0]
    return await asyncio.to_thread(_q)

@router.delete("/{seller_id}")
async def delete_seller(seller_id: str):
    def _q():
        supabase.table("perfiles").delete().eq("id", seller_id).execute()
        return {"deleted": True}
    return await asyncio.to_thread(_q)
