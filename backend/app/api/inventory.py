from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db import supabase
import asyncio

router = APIRouter()

class Vehicle(BaseModel):
    tipo_vehiculo: Optional[str] = None
    marca: str
    modelo: str
    ano: int
    precio: float
    kilometraje: Optional[int] = 0
    combustible: Optional[str] = None
    transmision: Optional[str] = None
    estado: Optional[str] = None
    descripcion_comercial: Optional[str] = None
    imagen_url: Optional[str] = None
    disponible: bool = True

@router.get("/")
async def list_vehicles(limit: int = 20, offset: int = 0):
    def _query():
        return supabase.table("vehiculos").select("*").eq("disponible", True).range(offset, offset + limit - 1).execute().data
    return await asyncio.to_thread(_query)

@router.get("/{vehicle_id}")
async def get_vehicle(vehicle_id: str):
    def _query():
        return supabase.table("vehiculos").select("*").eq("id", vehicle_id).single().execute().data
    data = await asyncio.to_thread(_query)
    if not data:
        raise HTTPException(status_code=404, detail="Vehículo no encontrado")
    return data

@router.post("/")
async def create_vehicle(vehicle: Vehicle):
    def _query():
        return supabase.table("vehiculos").insert(vehicle.model_dump()).execute().data[0]
    return await asyncio.to_thread(_query)
