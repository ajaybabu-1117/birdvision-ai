# BirdVision AI — Localhost Development & Setup Guide

This guide provides step-by-step instructions for running the **BirdVision AI** full-stack application on a Windows local machine.

---

## 1. System Requirements

- **Operating System:** Windows 10 or 11 (64-bit)
- **Node.js:** v18.0.0 or later (v24.14 installed and verified)
- **npm:** v9.0.0 or later (v11.11 installed and verified)
- **Python:** 3.10, 3.11, or 3.12 (using project virtual environment `C:\Bird Species Detection\venv`)
- **GPU (Optional but recommended):** NVIDIA RTX GPU with CUDA support for sub-40ms inference. CPU inference is supported automatically via ONNX Runtime fallback.

---

## 2. Directory Layout & Key Assets

Ensure the following model assets exist in `C:\Bird Species Detection`:
- `exports/dinov2_448_birds.onnx` (High-resolution ONNX model, 351 MB)
- `classes.json` (List of 1,486 bird species)
- `exports/dinov2_448_birds_metadata.json` (Preprocessing metadata)
- `checkpoints/dinov2_448_regularized_best.pth` (V2 Best Checkpoint)
- `checkpoints/dinov2_336_regularized_best.pth` (V2 336px Checkpoint)

---

## 3. Quick Start (1-Click Launch on Windows)

We provide pre-configured batch scripts in `C:\Bird Species Detection\web_application`:

### Option A: Launch Both Services Simultaneously
Double-click:
```
C:\Bird Species Detection\web_application\start_all.bat
```
This script automatically spawns two dedicated command prompt windows:
1. **Window 1:** Starts the FastAPI Backend on `http://localhost:8000`.
2. **Window 2:** Starts the React Frontend (Vite) on `http://localhost:5173`.

---

## 4. Manual Setup & Individual Service Launch

### Step 1: Start the FastAPI Backend
Open a terminal (PowerShell or Command Prompt):
```powershell
cd "C:\Bird Species Detection\web_application\backend"

# Launch Uvicorn using the project virtualenv
& "..\..\venv\Scripts\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API will be accessible at: `http://localhost:8000`
- Interactive Swagger docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Step 2: Start the React Frontend
Open a second terminal:
```powershell
cd "C:\Bird Species Detection\web_application\frontend"

# Start the Vite development server
npm run dev
```
- Open your browser to: `http://localhost:5173`

---

## 5. Verification & Testing

To run the automated backend test suite verifying all routes, real model predictions, and error handling:
```powershell
cd "C:\Bird Species Detection\web_application\backend"
& "..\..\venv\Scripts\python.exe" test_backend_api.py
```
Expected output:
```
ALL BACKEND API TESTS PASSED SUCCESSFULLY!
```

To verify the frontend production build:
```powershell
cd "C:\Bird Species Detection\web_application\frontend"
npm run build
```
Expected output:
```
✓ built in ~14s (0 TypeScript errors)
```

---

## 6. Troubleshooting Common Issues

### Issue 1: Port 8000 or 5173 Already in Use
- Check for lingering processes:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess
  ```
- Or change the port in `web_application/backend/.env` or `start_backend.bat`.

### Issue 2: CORS Issues When Calling Backend
- Verify that `ALLOWED_ORIGINS` in `web_application/backend/app/config.py` includes `http://localhost:5173`.
- Ensure `web_application/frontend/.env` contains `VITE_API_BASE_URL=http://localhost:8000`.

### Issue 3: Missing Model File Error
- Ensure `C:\Bird Species Detection\exports\dinov2_448_birds.onnx` is present on disk. The ONNX model is 351 MB and is loaded at server startup.
