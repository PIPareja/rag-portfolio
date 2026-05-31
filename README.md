# 🤖 RAG Portfolio Chatbot

> Chatbot con IA que responde preguntas sobre mi perfil profesional usando **Retrieval-Augmented Generation (RAG)** — construido con NestJS, pgvector y Gemini API.

![Stack](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Stack](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Stack](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Stack](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Stack](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## ¿Qué es RAG?

**RAG (Retrieval-Augmented Generation)** es una técnica que combina búsqueda semántica con generación de texto. En lugar de depender solo del conocimiento del modelo, el sistema busca información relevante en una base de datos vectorial y se la entrega como contexto antes de generar la respuesta.

---

## 🎥 Demo

[![Demo RAG Portfolio](https://img.youtube.com/vi/MMvURJdY_ig/maxresdefault.jpg)](https://youtu.be/MMvURJdY_ig)

---

## 🔄 Flujo del sistema

**Ingest (indexación del CV):**
1. 📄 Texto del CV
2. ✂️ Chunking — división en fragmentos de ~500 caracteres
3. 🔢 Embeddings via Gemini API — cada chunk se convierte en un vector de 3072 dimensiones
4. 🗄️ Almacenamiento en PostgreSQL + pgvector

**Chat (respuesta a preguntas):**
1. 💬 Pregunta del usuario
2. 🔢 Embedding de la pregunta
3. 🔍 Búsqueda por similitud coseno (`<=>`) — top 3 chunks más relevantes
4. 📝 Prompt enriquecido enviado a Gemini
5. 💡 Respuesta en lenguaje natural

---

## 🛠️ Stack

### Backend
| Tecnología | Uso |
|---|---|
| NestJS + TypeScript | API REST modular |
| PostgreSQL + pgvector | Almacenamiento y búsqueda vectorial |
| Prisma ORM | Queries tipadas y migraciones |
| Docker | Contenedorización de la BD |
| Gemini API | Embeddings + generación de texto |

### Frontend
| Tecnología | Uso |
|---|---|
| React + TypeScript | Interfaz de chat |
| Vite | Build tool |
| Axios | Comunicación con la API |

---

## 📁 Estructura

```
rag-portfolio/
├── backend/
│   ├── src/
│   │   ├── ingest/        # Chunking + embeddings + guardado en BD
│   │   ├── chat/          # Búsqueda vectorial + generación de respuesta
│   │   └── prisma/        # Conexión a PostgreSQL
│   ├── prisma/
│   │   └── schema.prisma
│   └── docker-compose.yml
└── frontend/
    └── src/
        └── App.tsx         # Interfaz de chat
```

---

## 🚀 Cómo correr el proyecto

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

```bash
POST http://localhost:3000/ingest
Content-Type: application/json

{ "text": "tu CV en texto plano aquí" }
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`

---

## 👨‍💻 Autor

**Pablo Pareja** — Desarrollador Fullstack con 3+ años de experiencia

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ppareja/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pipareja)