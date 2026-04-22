from fastapi import APIRouter
from app.db import supabase
import asyncio
from datetime import datetime, timedelta

router = APIRouter()

def _run(fn):
    return asyncio.to_thread(fn)

@router.post("/pageview")
async def track_pageview(data: dict):
    def _q():
        supabase.table("page_views").insert({
            "page": data.get("page"),
            "vehicle_id": data.get("vehicle_id"),
            "session_id": data.get("session_id"),
        }).execute()
        return {"ok": True}
    return await asyncio.to_thread(_q)

@router.get("/summary")
async def get_summary():
    def _q():
        now = datetime.utcnow()
        month_start = now.replace(day=1, hour=0, minute=0, second=0).isoformat()
        week_ago = (now - timedelta(days=7)).isoformat()
        today = now.replace(hour=0, minute=0, second=0).isoformat()

        vehicles = supabase.table("vehiculos").select("id", count="exact").eq("disponible", True).execute()
        sellers = supabase.table("perfiles").select("id", count="exact").execute()
        leads_week = supabase.table("negociaciones").select("id", count="exact").gte("created_at", week_ago).execute()
        leads_today = supabase.table("negociaciones").select("id", count="exact").gte("created_at", today).execute()
        views_week = supabase.table("page_views").select("id", count="exact").gte("created_at", week_ago).execute()
        ventas_mes = supabase.table("ventas").select("precio_final").gte("created_at", month_start).execute()
        ventas_count = supabase.table("ventas").select("id", count="exact").gte("created_at", month_start).execute()

        ingreso_mes = sum(float(v["precio_final"]) for v in (ventas_mes.data or []))

        return {
            "vehiculos_activos": vehicles.count or 0,
            "vendedores": sellers.count or 0,
            "leads_semana": leads_week.count or 0,
            "leads_hoy": leads_today.count or 0,
            "visitas_semana": views_week.count or 0,
            "ventas_mes": ventas_count.count or 0,
            "ingreso_mes": ingreso_mes,
        }
    return await asyncio.to_thread(_q)

@router.get("/top-productos")
async def get_top_productos():
    def _q():
        return supabase.table("top_productos").select("*").execute().data
    return await asyncio.to_thread(_q)

@router.get("/leads-chart")
async def get_leads_chart():
    def _q():
        return supabase.table("leads_por_dia").select("*").limit(30).execute().data
    return await asyncio.to_thread(_q)

@router.get("/valoraciones")
async def get_valoraciones():
    def _q():
        data = supabase.table("valoraciones").select("*").order("created_at", desc=True).limit(20).execute().data
        avg_ia = supabase.table("valoraciones").select("rating").eq("tipo", "atencion_ia").execute().data
        avg_vendedor = supabase.table("valoraciones").select("rating").eq("tipo", "atencion_vendedor").execute().data
        avg_producto = supabase.table("valoraciones").select("rating").eq("tipo", "producto").execute().data

        def avg(lst): return round(sum(x["rating"] for x in lst) / len(lst), 1) if lst else 0

        return {
            "recientes": data,
            "promedio_ia": avg(avg_ia),
            "promedio_vendedor": avg(avg_vendedor),
            "promedio_producto": avg(avg_producto),
        }
    return await asyncio.to_thread(_q)

@router.post("/valoracion")
async def crear_valoracion(data: dict):
    def _q():
        return supabase.table("valoraciones").insert({
            "vehicle_id": data.get("vehicle_id"),
            "tipo": data.get("tipo", "producto"),
            "rating": data.get("rating"),
            "comentario": data.get("comentario"),
            "session_id": data.get("session_id"),
            "vendedor_id": data.get("vendedor_id"),
        }).execute().data[0]
    return await asyncio.to_thread(_q)

@router.get("/ventas-recientes")
async def get_ventas_recientes():
    def _q():
        return supabase.table("ventas").select("*, vehiculos(marca, modelo), perfiles(nombre_completo)").order("created_at", desc=True).limit(10).execute().data
    return await asyncio.to_thread(_q)

@router.post("/venta")
async def registrar_venta(data: dict):
    def _q():
        # Marcar vehículo como no disponible
        if data.get("vehicle_id"):
            supabase.table("vehiculos").update({"disponible": False}).eq("id", data["vehicle_id"]).execute()
        return supabase.table("ventas").insert({
            "vehicle_id": data.get("vehicle_id"),
            "vendedor_id": data.get("vendedor_id"),
            "cliente_nombre": data.get("cliente_nombre"),
            "precio_final": data.get("precio_final"),
            "origen": data.get("origen", "directo"),
        }).execute().data[0]
    return await asyncio.to_thread(_q)
