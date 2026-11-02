@echo off
title BirdVision AI - Launcher
echo ==============================================================
echo          STARTING BIRDVISION AI FULL APPLICATION
echo ==============================================================
echo Starting Backend (FastAPI on Port 8000)...
start "BirdVision AI - Backend API" cmd /k "%~dp0start_backend.bat"

echo Waiting 3 seconds for Backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Frontend (Vite on Port 5173)...
start "BirdVision AI - Frontend UI" cmd /k "%~dp0start_frontend.bat"

echo.
echo ==============================================================
echo Application launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8000
echo - Swagger:  http://localhost:8000/docs
echo ==============================================================
