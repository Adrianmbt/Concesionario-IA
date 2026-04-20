# 🚗 Concesionario IA

Plataforma web para concesionario con inventario inteligente, chatbot RAG y panel administrativo.

![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Tailwind-blue)
![Stack](https://img.shields.io/badge/Backend-FastAPI-green)
![Stack](https://img.shields.io/badge/DB-Supabase-black)
![Stack](https://img.shields.io/badge/AI-LangChain%20%2B%20Ollama-orange)

---

## ✨ Funcionalidades

- 🏪 Catálogo de autos, motos y accesorios con SEO optimizado
- 🤖 Chatbot con RAG conectado al inventario en tiempo real
- 📊 Panel administrativo para gestión de inventario y vendedores
- 🖼️ Procesamiento automático de imágenes a WebP
- 🔥 Scoring de leads y alertas a vendedores
- 📱 Diseño responsive con animaciones Framer Motion

---

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Tailwind CSS + Framer Motion |
| Backend | FastAPI (Python 3.13) |
| Base de datos | Supabase (PostgreSQL + pgvector) |
| IA / RAG | LangChain + Ollama (llama3.2) |
| Storage | Supabase Storage |

---

## 🚀 Instalación desde cero

### Requisitos previos
- Python 3.11+
- Node.js 18+
- Git
- Cuenta en [Supabase](https://supabase.com)
- [Ollama](https://ollama.com) (opcional, para el chatbot IA)

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/Adrianmbt/Concesionario-IA.git
cd Concesionario-IA
```

---

### 2. Configurar el Backend

```bash
# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Mac/Linux)
source venv/bin/activate

# Instalar dependencias
pip install -r backend/requirements.txt
```

#### Variables de entorno

```bash
# Copiar el archivo de ejemplo
copy backend\.env.example backend\.env   # Windows
cp backend/.env.example backend/.env     # Mac/Linux
```

Editar `backend/.env` con tus credenciales:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=eyJ...tu-anon-key...

OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

#### Base de datos Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Abre el **SQL Editor**
3. Ejecuta el contenido de `backend/supabase/schema.sql`
4. Ve a **Storage** → crea un bucket público llamado `imagenes`

#### Iniciar el backend

```bash
cd backend
uvicorn app.main:app --reload
```

El backend corre en `http://localhost:8000`
Documentación interactiva: `http://localhost:8000/docs`

---

### 3. Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173`

---

### 4. Chatbot IA (opcional)

```bash
# Instalar Ollama desde https://ollama.com
# Luego descargar el modelo
ollama pull llama3.2:1b
```

Sin Ollama, el chatbot funciona en modo básico con respuestas de fallback.

---

## 📁 Estructura del proyecto

```
concesionario/
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints (inventory, chat, leads, sellers, images)
│   │   ├── rag/          # Motor RAG (LangChain + vectorstore)
│   │   └── services/     # Lead scorer
│   ├── supabase/
│   │   └── schema.sql    # Schema de la base de datos
│   ├── .env.example
│   └── requirements.txt
└── frontend/
    └── src/
        ├── components/   # Navbar, ChatBot
        └── pages/
            ├── admin/    # Panel administrativo
            ├── Home.jsx
            ├── Inventory.jsx
            └── VehicleDetail.jsx
```

---

## 🔐 Variables de entorno requeridas

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | URL de tu proyecto Supabase |
| `SUPABASE_ANON_KEY` | Anon key (JWT) de Supabase |
| `OLLAMA_BASE_URL` | URL de Ollama (default: http://localhost:11434) |
| `OLLAMA_MODEL` | Modelo a usar (default: llama3.2) |

> ⚠️ **Nunca subas el archivo `.env` a GitHub.** Ya está en `.gitignore`.

---

## 🗺️ Roadmap

- [ ] Autenticación de vendedores
- [ ] Dashboard con estadísticas en tiempo real
- [ ] Integración con WhatsApp Business API
- [ ] SEO avanzado con meta-tags dinámicos
- [ ] Modo producción con OpenAI/Groq

---

## 📄 Licencia

MIT — Proyecto en desarrollo activo.
