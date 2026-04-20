# Backend - FastAPI

## Setup

```bash
# Crear entorno virtual
python -m venv venv
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Copiar y llenar variables de entorno
copy .env.example .env

# Correr servidor
uvicorn app.main:app --reload
```

## Supabase
Ejecutar `supabase/schema.sql` en el SQL Editor de tu proyecto Supabase.

## Ollama (LLM local gratuito)
1. Descargar: https://ollama.com
2. `ollama pull llama3`
3. Ollama corre en http://localhost:11434 automáticamente
