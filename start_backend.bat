@echo off
title BirdVision AI - FastAPI Backend Server
cd /d "%~dp0backend"
echo ==============================================================
echo          BIRDVISION AI - FASTAPI BACKEND SERVER
echo ==============================================================
echo Environment: Localhost (Python venv)
echo API Port:    http://localhost:8000
echo Swagger:     http://localhost:8000/docs
echo Model:       DINOv2 ViT-Base/14 (448x448 ONNX / 1,486 Classes)
echo ==============================================================

if exist "..\..\venv\Scripts\python.exe" (
    "..\..\venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
) else (
    echo [ERROR] Virtual environment python.exe not found at ..\..\venv\Scripts\python.exe
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
)
pause
