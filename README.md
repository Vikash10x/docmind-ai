# DocMind AI — Production-Ready RAG PDF Chatbot

A full-stack **Retrieval-Augmented Generation (RAG)** chatbot that lets you upload PDF documents and have intelligent, document-grounded conversations powered by **Google Gemini** and **MongoDB Atlas Vector Search**.

---

## What is RAG?

RAG (Retrieval-Augmented Generation) improves AI responses by fetching relevant content from your own documents **before** generating an answer. Instead of relying solely on the AI model's training data, the model is given specific, relevant passages from your document as context, producing accurate, citation-backed answers.

```
Your Question
     ↓
Embedding (Gemini text-embedding-004)
     ↓
MongoDB Atlas Vector Search  ← searches your documents
     ↓
Top-K Relevant Passages
     ↓
Gemini Generation Model  ← uses passages as context
     ↓
Accurate Answer + Source Citations
```

---

## Features

- **Authentication** — Secure signup/login with JWT and bcrypt
- **PDF Upload** — Drag-and-drop, file validation, size limits
- **Text Extraction** — Page-aware extraction with pdfjs-dist
- **Smart Chunking** — Paragraph/sentence-aware chunking with configurable overlap
- **Vector Embeddings** — Gemini `text-embedding-004` (768-dim)
- **MongoDB Atlas Vector Search** — Real semantic similarity search
- **RAG Pipeline** — Grounded answers with strict no-hallucination prompt
- **Source Citations** — Every answer shows which document + page it came from
- **Chat History** — Persistent conversation history per document
- **Modern UI** — Dark-themed, responsive, ChatGPT-like interface
- **Security** — Helmet, rate limiting, JWT auth, user isolation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3, React Router v6 |
| Backend | Node.js, Express.js, JWT, bcryptjs, Multer, Helmet |
| Database | MongoDB Atlas |
| Vector Search | MongoDB Atlas Vector Search |
| PDF Parsing | pdfjs-dist v3.x (legacy/Node.js build) |
| AI Embeddings | Gemini `text-embedding-004` (768-dim) |
| AI Generation | Gemini `gemini-2.0-flash` (configurable) |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| Markdown | react-markdown + remark-gfm |

---

## Project Structure

```
ai-pdf-rag/
├── backend/
│   ├── config/db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # signup, signin, getMe
│   │   ├── documentController.js     # upload, list, delete (+ processing pipeline)
│   │   └── chatController.js         # ask question, history, clear
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT verification
│   │   └── errorMiddleware.js        # 404 + global error handler
│   ├── models/
│   │   ├── User.js                   # User with bcrypt
│   │   ├── Document.js               # Upload metadata + status
│   │   ├── DocumentChunk.js          # Text chunks + embeddings
│   │   └── Chat.js                   # Chat history
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── documentRoutes.js
│   │   └── chatRoutes.js
│   ├── services/
│   │   ├── pdfService.js             # PDF text extraction (pdfjs-dist)
│   │   ├── embeddingService.js       # Gemini embeddings
│   │   ├── vectorSearchService.js    # Atlas $vectorSearch
│   │   └── ragService.js             # Full RAG pipeline
│   ├── utils/
│   │   ├── chunkText.js              # Paragraph-aware chunker
│   │   └── validators.js             # Input validators
│   ├── uploads/                      # Temporary PDF storage (gitignored)
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatMessage.jsx       # Message bubble + sources + markdown
│   │   │   ├── DocumentCard.jsx      # Document grid card
│   │   │   ├── LoadingDots.jsx       # Typing indicator
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── SourceCard.jsx        # Citation badge
│   │   │   └── UploadZone.jsx        # Drag-and-drop upload
│   │   ├── context/AuthContext.jsx   # JWT + user state
│   │   ├── hooks/useAuth.js
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/api.js           # Centralized Axios
│   │   └── utils/formatters.js
│   └── .env.example
└── README.md
```

---

## Installation

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (free tier works)
- Google AI Studio API key

### 1. Clone / navigate to project

```bash
cd "ai-pdf-rag"
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
cp .env.example .env
# VITE_API_URL is already set correctly for local development
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for signing JWTs — use a long random string | `supersecret123` |
| `JWT_EXPIRES_IN` | JWT expiry | `7d` |
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIza...` |
| `GEMINI_EMBEDDING_MODEL` | Embedding model name | `text-embedding-004` |
| `GEMINI_GENERATION_MODEL` | Generation model name | `gemini-2.0-flash` |
| `CHUNK_SIZE` | Target chars per chunk | `1000` |
| `CHUNK_OVERLAP` | Overlap chars between chunks | `200` |
| `TOP_K` | Chunks retrieved per query | `5` |
| `MAX_FILE_SIZE_MB` | Max PDF upload size | `10` |
| `VECTOR_INDEX_NAME` | Atlas vector index name | `vector_index` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: `/api` via Vite proxy) |

---

## MongoDB Atlas Setup

### 1. Create a cluster
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Add your IP to the allowlist (or use `0.0.0.0/0` for development)
4. Create a database user
5. Copy the connection string to `MONGO_URI`

### 2. Create the Vector Search Index

> **This is required before vector search will work.**

1. In Atlas, go to your cluster → **Search** tab → **Create Search Index**
2. Select **Atlas Vector Search** (not Atlas Search)
3. Choose your database and the `documentchunks` collection
4. Use **JSON Editor** and paste this configuration:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 768,
      "similarity": "cosine"
    },
    {
      "type": "filter",
      "path": "userId"
    },
    {
      "type": "filter",
      "path": "documentId"
    }
  ]
}
```

5. Set the index name to: **`vector_index`** (must match `VECTOR_INDEX_NAME` in .env)
6. Click **Create Index** and wait for it to become Active (~1-2 minutes)

> **Why 768 dimensions?** The `text-embedding-004` model produces 768-dimensional vectors. This must match exactly.
>
> **Why filter fields?** The `userId` and `documentId` filter fields allow pre-filtering within the vector search to enforce user isolation without post-filtering.

---

## Gemini API Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API Key** → **Create API key**
3. Copy the key to `GEMINI_API_KEY` in `.env`
4. The default models (`text-embedding-004` and `gemini-2.0-flash`) are free tier eligible

---

## Running Locally

### Backend

```bash
cd backend
npm run dev     # starts nodemon on port 5000
```

### Frontend

```bash
cd frontend
npm run dev     # starts Vite on port 5173
```

Open: [http://localhost:5173](http://localhost:5173)

> The Vite dev server proxies `/api` requests to `http://localhost:5000`, so no CORS issues.

---

## API Documentation

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/signup` | Create account | No |
| `POST` | `/api/auth/signin` | Sign in | No |
| `GET` | `/api/auth/me` | Get current user | Yes |

**Signup body:**
```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "mypassword" }
```

**Signin body:**
```json
{ "email": "jane@example.com", "password": "mypassword" }
```

**Response (both):**
```json
{ "success": true, "token": "eyJ...", "user": { "id": "...", "name": "Jane", "email": "..." } }
```

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/documents/upload` | Upload PDF (multipart/form-data, field: `file`) |
| `GET` | `/api/documents` | List user's documents |
| `GET` | `/api/documents/:id` | Get document details |
| `GET` | `/api/documents/:id/status` | Poll processing status |
| `DELETE` | `/api/documents/:id` | Delete document + chunks + file |

**Upload response:**
```json
{
  "success": true,
  "message": "Document uploaded. Processing started.",
  "document": { "id": "...", "name": "policy.pdf", "status": "processing" }
}
```

**Status values:** `processing` → `completed` or `failed`

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Ask a question |
| `GET` | `/api/chat/:documentId` | Get chat history |
| `DELETE` | `/api/chat/:documentId` | Clear chat history |

**Ask question body:**
```json
{ "documentId": "6...", "question": "What is the leave policy?" }
```

**Response:**
```json
{
  "success": true,
  "answer": "Employees receive 20 paid leave days per year...",
  "sources": [
    { "documentId": "...", "fileName": "policy.pdf", "pageNumber": 5, "score": 0.912 }
  ],
  "retrievedChunks": 5
}
```

---

## RAG Architecture Explained

### 1. Ingestion (upload time)
```
PDF File
  → pdfjs-dist extracts text page by page
  → Paragraph-aware chunker splits into ~1000 char chunks with 200 char overlap
  → Gemini text-embedding-004 generates 768-dim vector per chunk
  → DocumentChunk stored in MongoDB with text + embedding + pageNumber
```

### 2. Retrieval (query time)
```
User question
  → Gemini text-embedding-004 generates question vector
  → MongoDB $vectorSearch finds top-K chunks by cosine similarity
     (filtered by userId + documentId for security)
  → Chunks sorted by relevance score
```

### 3. Generation
```
Top-K chunks concatenated as context
  → Strong system prompt: "Answer using ONLY the context provided"
  → Gemini generates grounded answer
  → Sources extracted from chunk metadata
  → Answer + sources returned to user
```

---

## Testing

### End-to-End Test Checklist

1. **Signup** — Create a new account at `/signup`
2. **Login** — Sign in at `/login`
3. **Upload** — Upload a real PDF (with text) at the dashboard
4. **Wait** — Document status changes to "Ready" (takes 30-120s for embeddings)
5. **Chat** — Click "Chat with PDF" → ask a question
6. **Verify sources** — Sources should show file name + page number
7. **History** — Refresh page → chat history persists
8. **User isolation** — Create second account → cannot see first user's documents

### RAG Quality Tests

Upload a real document and test:

| Test | Expected |
|------|----------|
| Ask about content clearly in the doc | Accurate answer with source citations |
| Ask about content on a specific page | Correct page cited |
| Ask about something NOT in the doc | "Could not find information in the document" |
| Ask using different words than in doc | Still retrieves correct chunks (semantic) |
| Ask vague/ambiguous question | Best-effort answer with appropriate caveats |

---

## Deployment (Production)

### Backend (e.g., Railway, Render, Fly.io)

1. Set all environment variables in the platform's dashboard
2. Set `NODE_ENV=production`
3. Change `CLIENT_ORIGIN` to your frontend URL
4. The `uploads/` directory needs persistent storage (or switch to S3/GCS)

### Frontend (e.g., Vercel, Netlify)

1. Set `VITE_API_URL` to your backend URL (e.g., `https://your-api.railway.app/api`)
2. Remove the Vite proxy (not needed in production)

---

## Future Improvements

| Feature | Description |
|---------|-------------|
| **OCR** | Support for scanned/image PDFs using Tesseract |
| **Streaming** | Stream AI responses token-by-token |
| **Multi-document chat** | Query across multiple PDFs at once |
| **Hybrid search** | Combine vector + keyword (BM25) search |
| **Reranking** | Re-rank retrieved chunks with a cross-encoder |
| **Background jobs** | Bull/BullMQ for async PDF processing queue |
| **Cloud storage** | Store PDFs in S3/GCS instead of local disk |
| **Redis caching** | Cache embeddings for repeated questions |
| **Chunk preview** | Show the actual retrieved text in the UI |
| **PDF viewer** | In-browser PDF viewer with highlighted pages |

---

## License

MIT
