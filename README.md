# RAG Portfolio Chatbot

Chatbot con IA que responde preguntas sobre mi perfil profesional usando **Retrieval-Augmented Generation (RAG)**.

## ¿Qué es RAG?

En lugar de depender solo del conocimiento del modelo de IA, RAG busca información relevante en una base de datos vectorial y se la entrega como contexto al modelo antes de responder. Esto permite respuestas precisas basadas en datos reales.

## Flujo del sistema

Texto del CV → chunks → embeddings (Gemini) → PostgreSQL + pgvector
Pregunta del usuario
→ embedding de la pregunta
→ búsqueda por similitud coseno en pgvector
→ chunks relevantes como contexto
→ prompt a Gemini
→ respuesta en lenguaje natural

## Stack

**Backend**
- NestJS + TypeScript
- PostgreSQL con extensión pgvector (búsqueda vectorial)
- Prisma ORM
- Docker
- Gemini API (embeddings + generación de texto)

**Frontend**
- React + TypeScript
- Vite

## Estructura

rag-portfolio/
├── backend/
│   ├── src/
│   │   ├── ingest/   # Chunking + embeddings + guardado en BD
│   │   ├── chat/     # Búsqueda vectorial + generación de respuesta
│   │   └── prisma/   # Conexión a PostgreSQL
│   └── prisma/
│       └── schema.prisma
└── frontend/

## Cómo correr el proyecto

### Requisitos
- Node.js 20+
- Docker Desktop

### Backend

```bash
cd backend
cp .env.example .env
# Completa GEMINI_API_KEY y DATABASE_URL en .env
docker compose up -d
npx prisma migrate dev
npm run start:dev
```

### Ingestar el CV

POST http://localhost:3000/ingest
Content-Type: application/json
{ "text": "tu CV en texto plano aquí" }

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`

## Autor

**Pablo Pareja** — Desarrollador Fullstack  
[LinkedIn](https://www.linkedin.com/in/ppareja/) · [GitHub](https://github.com/pipareja)