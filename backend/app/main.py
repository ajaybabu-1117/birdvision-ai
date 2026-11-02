import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .services.inference_service import inference_service
from .routes import predict, species, model_info, samples

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Preload model and metadata at startup
    print(f"[{settings.APP_NAME}] Starting up and preloading model...", flush=True)
    inference_service.initialize()
    yield
    print(f"[{settings.APP_NAME}] Shutting down cleanly.", flush=True)

app = FastAPI(
    title=settings.APP_NAME,
    description="Full-stack AI bird species classification platform powered by fine-tuned DINOv2 (1,486 species).",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount sample bird images
if settings.SAMPLE_BIRDS_DIR.exists():
    app.mount(
        "/static/samples",
        StaticFiles(directory=str(settings.SAMPLE_BIRDS_DIR)),
        name="sample_birds"
    )

# Include Routers
app.include_router(predict.router)
app.include_router(species.router)
app.include_router(model_info.router)
app.include_router(samples.router)

@app.get("/", tags=["Root"])
def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "supported_species": len(inference_service.classes) if inference_service.classes else 1486,
        "docs_url": "/docs",
        "health_url": "/health",
        "endpoints": {
            "predict_single_onnx": "POST /predict",
            "predict_ensemble": "POST /predict/ensemble",
            "sample_prediction": "POST /predict/sample/{sample_id}",
            "species_directory": "GET /species",
            "model_benchmarks": "GET /model-info",
            "sample_birds": "GET /samples"
        }
    }
