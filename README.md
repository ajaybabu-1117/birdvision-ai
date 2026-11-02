# BirdVision AI — Avian Species Classification Web Application

> **Discover the World of Birds with Artificial Intelligence**  
> Powered by Meta DINOv2 Vision Transformer (ViT-Base/14, 448×448 px, 1,486 Species).

---

## Highlights

- **Classification Coverage:** 1,486 global bird species from the iNaturalist 2021 Mini dataset.
- **Verified Benchmark Accuracy:**
  - **Single-Model ONNX:** **79.60% Top-1** | **91.12% Top-5** (~25–35 ms on GPU)
  - **Tri-Scale Ensemble:** **80.03% Top-1** | **91.22% Top-5** (~115 ms on GPU)
- **Decoupled Modern Stack:**
  - **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts.
  - **Backend:** FastAPI, Uvicorn, ONNX Runtime, PyTorch.
- **1-Click Localhost Launch:** Single batch script launches both frontend and backend on Windows.
- **Global Deployment Ready:** Docker, Docker Compose, and environment configs prepared for Vercel and cloud containers.

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
│   └── .env.example                    # Frontend environment template
├── documentation/
│   ├── PROJECT_REPORT.md               # Complete academic/industrial project report
│   ├── SYSTEM_ARCHITECTURE.md          # Architecture & Mermaid sequence diagrams
│   ├── API_DOCUMENTATION.md            # Endpoint reference with cURL examples
│   ├── LOCAL_SETUP.md                  # Localhost installation & troubleshooting
│   ├── DEPLOYMENT.md                   # Cloud hosting (Vercel, Render, Docker)
│   └── PROJECT_PRESENTATION.md         # Slide-by-slide viva defense presentation
├── docker-compose.yml                  # Unified multi-container deployment
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
