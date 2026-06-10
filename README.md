# 🐾 Kahu — Nutrición canina con IA

> App web fullstack para dueños de perros que siguen dieta BARF o dieta casera cocinada. El usuario registra su mascota y chatea con un agente IA que calcula recetas y porciones personalizadas según peso, raza, edad, alergias y número de tomas.

![Kahu](./frontend/public/Kahu_Logo_transparente.png)

---

## 📋 Descripción

Kahu es una aplicación fullstack que combina:
- **Agente LangGraph** con RAG (Retrieval-Augmented Generation) para responder preguntas sobre nutrición canina basándose en documentos especializados
- **Backend Node.js** para gestión de usuarios, mascotas, autenticación JWT y persistencia de datos
- **Frontend React** con diseño mobile-first inspirado en el tema "Huerta" — cálido, orgánico y accesible

---

## 🏗️ Arquitectura

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend  │────▶│  Backend Node   │────▶│   PostgreSQL     │
│  React+Vite │     │  Express+Prisma │     │   (Neon/Local)   │
└──────┬──────┘     └─────────────────┘     └──────────────────┘
       │                                              
       │            ┌─────────────────┐     ┌──────────────────┐
       └───────────▶│  Backend IA     │────▶│   ChromaDB       │
                    │  FastAPI+       │     │   (vectorstore)  │
                    │  LangGraph+RAG  │     └──────────────────┘
                    └─────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Groq API     │
                    │ llama-3.3-70b  │
                    └────────────────┘
```

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite + React Router v6 + Context API |
| Backend BD/Auth | Node.js + Express + Prisma + JWT |
| Backend IA | FastAPI + LangGraph + LangChain + ChromaDB |
| Base de datos | PostgreSQL |
| LLM | Groq (llama-3.3-70b-versatile) |
| Embeddings | HuggingFace (paraphrase-multilingual-MiniLM-L12-v2) |
| Automatización | N8N |
| Deploy | Render (backends) + Vercel (frontend) + Neon (DB) |

---

## 📁 Estructura del proyecto

```
kahu-app/
├── backend-ai/          # FastAPI + LangGraph + RAG
│   ├── app/
│   │   ├── agent/       # Grafo LangGraph, tools, prompts
│   │   ├── rag/         # ChromaDB, loaders, embeddings
│   │   └── api/         # Endpoints FastAPI
│   ├── docs/            # 5 documentos RAG indexados
│   ├── ingest.py        # Script de indexación
│   └── requirements.txt
├── backend-node/        # Node.js + Prisma + JWT
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── schemas/
│   └── prisma/
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.js
├── frontend/            # React 18 + Vite
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       └── services/
├── n8n/                 # Workflow PDF + Email
├── API.md               # Documentación de endpoints
└── kahu-api.postman_collection.json
```

---

## 🚀 Instalación y arranque local

### Requisitos previos
- Node.js v18+
- Python 3.11+
- PostgreSQL 14+
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/laurasang13/kahu-app.git
cd kahu-app
```

### 2. Backend Node

```bash
cd backend-node
npm install
cp .env.example .env
# Edita .env con tus credenciales
npx prisma migrate dev
npx prisma db seed
npm run dev
```

El servidor arranca en `http://localhost:3001`

### 3. Backend IA

```bash
cd backend-ai
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edita .env con tu GROQ_API_KEY
python ingest.py        # Indexar documentos RAG (solo primera vez)
uvicorn app.main:app --reload --port 8000
```

El servidor arranca en `http://localhost:8000`

### 4. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

La app arranca en `http://localhost:5173`

---

## 🌱 Variables de entorno

### backend-node/.env
```
DATABASE_URL="postgresql://usuario:password@localhost:5432/kahu_db"
JWT_SECRET=tu_jwt_secret
PORT=3001
FASTAPI_URL=http://localhost:8000
INTERNAL_SERVICE_TOKEN=token_interno_seguro
FRONTEND_URL=http://localhost:5173
```

### backend-ai/.env
```
GROQ_API_KEY=tu_groq_api_key
GROQ_SECOND_API_KEY=tu_segunda_groq_api_key
NODE_BACKEND_URL=http://localhost:3001
CHROMA_PERSIST_DIR=./chroma
INTERNAL_SERVICE_TOKEN=token_interno_seguro
FRONTEND_URL=http://localhost:5173
```

### frontend/.env
```
VITE_API_NODE_URL=http://localhost:3001
VITE_API_AI_URL=http://localhost:8000
```

---

## 👥 Usuarios de prueba (seed)

| Nombre | Email | Password | Rol |
|--------|-------|----------|-----|
| KahuAdmin | admin@kahu.com | admin123 | ADMIN |
| Patricia | patricia@test.com | test123 | USER |
| Carlos | carlos@test.com | test123 | USER |
| Ana | ana@test.com | test123 | USER |
| Miguel | miguel@test.com | test123 | USER |
| Sara | sara@test.com | test123 | USER |

### Mascotas de prueba

| ID | Nombre | Raza | Dueño |
|----|--------|------|-------|
| seed-mascota-0001 | Luna | Border Collie | Patricia |
| seed-mascota-0002 | Rocky | Labrador | Carlos |
| seed-mascota-0003 | Nala | Golden Retriever | Ana |
| seed-mascota-0004 | Thor | Pastor Alemán | Miguel |
| seed-mascota-0005 | Mia | Beagle | Sara |

---

## 🤖 Agente IA

El agente usa **LangGraph** con el siguiente flujo:

```
Usuario → Webhook → [Tiene datos?] → Generar HTML → PDF → Email
                         ↓ No
                    Respuesta Error
```

### Tools disponibles
- `registrar_receta` → guarda el plan en tabla `PlanNutricional`
- `actualizar_registro_vet` → guarda eventos en `HistorialVeterinario`

### Documentos RAG indexados
1. `doc1_alimentos_maestro.md` — tabla maestra de alimentos permitidos
2. `doc2_porciones_y_calculos.md` — cálculo de raciones BARF
3. `doc3_guia_barf_completa.md` — guía completa BARF vs dieta cocinada
4. `doc4_cuidados_por_etapa.md` — cuidados por etapa de vida
5. `doc5_adiestramiento_positivo.md` — adiestramiento en positivo

---

## 📊 Base de datos

```
USUARIOS ──< MASCOTAS ──< PLAN_NUTRICIONAL
                     ──< HISTORIAL_VETERINARIO
                     ──< CHAT_HISTORIAL
                     ──< REGISTRO_PESO
```

---

## 🔄 Workflow N8N

El workflow `n8n/kahu-workflow.json` se activa cuando el agente genera un plan nutricional:

1. **Webhook** recibe los datos del plan
2. **Condicional** verifica que tiene ingredientes
3. **Genera HTML** con el plan formateado
4. **Convierte a PDF**
5. **Envía email** al usuario con el PDF adjunto

Para importarlo: N8N → Workflows → Import from file

---

## 📡 API

Ver `API.md` para documentación completa de endpoints.
Ver `kahu-api.postman_collection.json` para colección Postman.

### Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/login` | Login |
| GET | `/api/mascotas` | Mascotas del usuario |
| POST | `/api/chat` (FastAPI) | Chat con agente IA |

---

## Diseño

El diseño sigue el tema **"Huerta"** — orgánico, cálido y natural:
- Fondo crema/ocre (`oklch(0.957 0.018 86)`)
- Verde oliva como color principal
- Tipografía: Bricolage Grotesque (display) + Hanken Grotesk (body)
- Mobile-first con navbar flotante
- Soporte bilingüe (ES/EN)

---

## Roadmap

### MVP entregado 
- Agente LangGraph con 2 tools + RAG con ChromaDB
- Perfil de mascota con validación
- Chat con historial persistido en PostgreSQL
- Workflow N8N: plan → PDF → email
- React 18 + Vite + React Router v6
- Context API para usuario autenticado
- JWT: registro, login, rutas protegidas

### Mejoras futuras 
- Chat diferenciado (nutrición vs cuidados)
- Historial veterinario completo en UI
- Notificaciones y recordatorios
- Modo offline con PWA
- Dashboard admin
- Olvidar contraseña

---

## Autora

**Laura Sang** — Proyecto final Fullstack Bootcamp @ Ironhack Las Palmas 2026

---

