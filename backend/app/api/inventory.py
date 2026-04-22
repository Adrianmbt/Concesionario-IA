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
        response = supabase.table("vehiculos").select("*").range(offset, offset + limit - 1).execute()
        return response.data if response.data else []
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

@router.put("/{vehicle_id}")
async def update_vehicle(vehicle_id: str, vehicle: Vehicle):
    def _query():
        return supabase.table("vehiculos").update(vehicle.model_dump()).eq("id", vehicle_id).execute().data[0]
    return await asyncio.to_thread(_query)

@router.delete("/{vehicle_id}")
async def delete_vehicle(vehicle_id: str):
    def _query():
        return supabase.table("vehiculos").delete().eq("id", vehicle_id).execute().data
    return await asyncio.to_thread(_query)

@router.post("/generate-description")
async def generate_description(vehicle: Vehicle):
    # Prompt con validación de coherencia integrada
    prompt = (
        f"Actúa como un experto validador y redactor automotriz. "
        f"TAREA 1: Verifica si es coherente que un '{vehicle.marca} {vehicle.modelo}' sea categorizado como '{vehicle.tipo_vehiculo}'. "
        f"Si detectas una incoherencia total (ej: un auto Toyota Corolla marcado como 'moto'), responde exclusivamente con: "
        f"'ERROR_COHERENCIA: El {vehicle.marca} {vehicle.modelo} no coincide con la categoría {vehicle.tipo_vehiculo}. Por favor, verifica los datos.' "
        f"TAREA 2: Si los datos son coherentes, escribe una descripción comercial premium de máximo 400 caracteres. "
        f"Datos: {vehicle.tipo_vehiculo}, {vehicle.marca} {vehicle.modelo}, año {vehicle.ano}, transmisión {vehicle.transmision}, combustible {vehicle.combustible}. "
        f"Evita redundancias y sé elegante."
    )
    
    try:
        from langchain_ollama import OllamaLLM
        import os
        llm = OllamaLLM(
            base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
            model=os.getenv("OLLAMA_MODEL", "llama3")
        )
        response = await asyncio.to_thread(lambda: llm.invoke(prompt))
        
        # Validar si la IA detectó el error de coherencia
        if "ERROR_COHERENCIA" in response:
            raise HTTPException(status_code=400, detail=response.replace('ERROR_COHERENCIA:', '').strip())
            
        return {"description": response.strip()}
    except HTTPException as e:
        raise e
    except Exception:
        # Fallback con validación básica manual decorativa
        is_toyota_moto = vehicle.marca.lower() == "toyota" and vehicle.tipo_vehiculo == "moto"
        if is_toyota_moto:
             raise HTTPException(status_code=400, detail="Toyota no fabrica motocicletas comerciales de este tipo. Por favor verifica la marca o categoría.")
             
        adj = "Impecable" if vehicle.estado == "nuevo" else "Distinguido"
        return {"description": f"{adj}. Experimenta la perfección con este {vehicle.marca} {vehicle.modelo} {vehicle.ano}. Una unidad {vehicle.estado} con transmisión {vehicle.transmision}."}
