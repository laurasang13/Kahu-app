# 🐾 Kahu — Nutrición canina con IA

App web fullstack para dueños de perros que siguen dieta BARF.  
El usuario registra su mascota y chatea con un agente IA que calcula recetas y porciones personalizadas.

## Stack

- **Backend IA:** FastAPI + LangGraph + RAG con ChromaDB
- **Backend BD/Auth:** Node.js + Prisma + JWT
- **Base de datos:** PostgreSQL
- **Frontend:** React 18 + Vite + React Router v6
- **Automatización:** N8N

## Estructura

\`\`\`
kahu-app/
├── backend-ai/      → Agente LangGraph + RAG
├── backend-node/    → API REST + Auth JWT + Prisma
├── frontend/        → React 18 + Vite
└── n8n/             → Workflows exportados
\`\`\`

## Instalación

Ver README individual de cada carpeta.
