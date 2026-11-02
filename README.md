# BirdVision AI — Avian Species Classification Web Application

> **Discover the World of Birds with Artificial Intelligence**  
> Powered by Meta DINOv2 Vision Transformer (ViT-Base/14, 448×448 px, 1,486 Species).

[![GitHub Repository](https://img.shields.io/badge/GitHub-ajaybabu--1117%2Fbirdvision--ai-blue?logo=github)](https://github.com/ajaybabu-1117/birdvision-ai)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-teal.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.143-009688.svg)](https://fastapi.tiangolo.com/)

---

## Highlights

- **Repository:** [https://github.com/ajaybabu-1117/birdvision-ai](https://github.com/ajaybabu-1117/birdvision-ai)
- **Classification Coverage:** 1,486 global bird species from the iNaturalist 2021 Mini dataset.
- **Verified Benchmark Accuracy:**
  - **Single-Model ONNX:** **79.60% Top-1** | **91.12% Top-5** (~25–35 ms on GPU / ~350 ms on CPU)
  - **Tri-Scale Ensemble:** **80.03% Top-1** | **91.22% Top-5** (~115 ms on GPU)
- **Decoupled Modern Stack:**
  - **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts.
  - **Backend:** FastAPI, Uvicorn, ONNX Runtime, PyTorch.
- **1-Click Localhost Launch:** Single batch script launches both frontend and backend on Windows.
- **Global Deployment Ready:** Vercel edge deployment configuration for frontend, Render/Docker configuration for backend.

---

## Quickstart (Windows Localhost)

### 1-Click Launch
Double-click `start_all.bat` inside `web_application`:
```cmd
start_all.bat
```
This launches:
- **Frontend UI:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`
- **Swagger Docs:** `http://localhost:8000/docs`

---

## Manual Launch

### Backend
```powershell
cd web_application/backend
& "..\..\venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```powershell
cd web_application/frontend
npm run dev
```

---

## Public Cloud Deployment (Vercel + Render)

### 1. Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import the Git repository: `ajaybabu-1117/birdvision-ai`.
3. Set **Root Directory** to `frontend`.
4. Build settings: Framework **Vite**, Build command `npm run build`, Output directory `dist`.
5. Set Environment Variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`.

### 2. Backend on Render
1. Go to [Render Dashboard](https://dashboard.render.com/select-repo?type=web).
2. Connect `ajaybabu-1117/birdvision-ai`.
3. Select **Docker** or **Python** environment with **Root Directory** set to `backend`.
4. Instance Sizing: **Starter Plan (2 GB RAM)**.  
   *(Note: The 351 MB DINOv2 ONNX model requires ~1.2 GB of RAM during inference. Render's 512 MB Free Tier will encounter out-of-memory errors).*
5. Set Environment Variables:
   - `ENVIRONMENT=production`
   - `ALLOWED_ORIGINS=https://birdvision-ai.vercel.app,http://localhost:5173`
   - `MODEL_DOWNLOAD_URL`: URL pointing to hosted `dinov2_448_birds.onnx` (e.g. GitHub Release or Hugging Face Hub).

---

## Directory Structure

```
web_application/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application bootstrap & lifespan
│   │   ├── config.py                   # Environment configuration & paths
│   │   ├── routes/                     # Predict, Species, Model Info, Samples
│   │   ├── services/                   # ONNX Runtime & PyTorch inference service
│   │   ├── schemas/                    # Pydantic request/response models
│   │   ├── utils/                      # Image validation, EXIF, and preprocessing
│   │   └── data/                       # Taxonomy metadata & sample bird images
│   ├── requirements.txt                # Python backend dependencies
│   ├── Dockerfile                      # Production backend container spec
│   ├── .env.example                    # Backend environment template
│   └── test_backend_api.py             # Automated backend integration test suite
├── frontend/
│   ├── src/
│   │   ├── components/                 # Navbar, Hero, Uploader, Cards, Directory, Charts
│   │   ├── services/api.ts             # Typed REST API client
│   │   ├── types.ts                    # TypeScript interface definitions
│   │   ├── App.tsx                     # Main application layout & tab state
│   │   └── main.tsx                    # React DOM entrypoint
│   ├── package.json                    # Node dependencies & build scripts
│   ├── vite.config.ts                  # Vite bundler configuration
│   ├── tailwind.config.js              # Wildlife theme styling configuration
│   ├── Dockerfile                      # Production frontend Nginx container spec
│   ├── vercel.json                     # Vercel SPA routing & build rules
│   └── .env.example                    # Frontend environment template
├── documentation/
│   ├── PROJECT_REPORT.md               # Complete academic/industrial project report
│   ├── SYSTEM_ARCHITECTURE.md          # Architecture & Mermaid sequence diagrams
│   ├── API_DOCUMENTATION.md            # Endpoint reference with cURL examples
│   ├── LOCAL_SETUP.md                  # Localhost installation & troubleshooting
│   ├── DEPLOYMENT.md                   # Cloud hosting (Vercel, Render, Docker)
│   └── PROJECT_PRESENTATION.md         # Slide-by-slide viva defense presentation
├── docker-compose.yml                  # Unified multi-container deployment
├── render.yaml                         # Blueprint for Render deployment
├── start_all.bat                       # 1-Click launcher for both services
├── start_backend.bat                   # Standalone backend launcher
├── start_frontend.bat                  # Standalone frontend launcher
└── README.md                           # Project quickstart guide
```

---

## Documentation

Full technical documentation is located in `web_application/documentation/`:
- [`PROJECT_REPORT.md`](documentation/PROJECT_REPORT.md)
- [`SYSTEM_ARCHITECTURE.md`](documentation/SYSTEM_ARCHITECTURE.md)
- [`API_DOCUMENTATION.md`](documentation/API_DOCUMENTATION.md)
- [`LOCAL_SETUP.md`](documentation/LOCAL_SETUP.md)
- [`DEPLOYMENT.md`](documentation/DEPLOYMENT.md)
- [`PROJECT_PRESENTATION.md`](documentation/PROJECT_PRESENTATION.md)
