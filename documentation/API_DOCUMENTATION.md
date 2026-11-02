# BirdVision AI — API Specification

The BirdVision AI backend provides high-performance RESTful endpoints for real-time bird species identification, multi-scale ensemble classification, and taxonomic metadata exploration.

**Base URL:** `http://localhost:8000`  
**Interactive Swagger UI:** `http://localhost:8000/docs`  
**OpenAPI Specification:** `http://localhost:8000/openapi.json`

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Response Time |
|---|---|---|:---:|
| `GET` | `/` | API status and available route catalog | < 5 ms |
| `GET` | `/health` | Engine health check, active provider, species count | < 5 ms |
| `GET` | `/model-info` | Complete neural architecture specs and verified benchmarks | < 10 ms |
| `GET` | `/samples` | Curated sample birds for UI demonstration | < 5 ms |
| `GET` | `/species` | Searchable, paginated directory of all 1,486 species | < 15 ms |
| `GET` | `/species/{id}` | Detailed taxonomy for an individual bird species | < 10 ms |
| `POST` | `/predict` | High-throughput single-model ONNX bird identification | ~25–40 ms (GPU) / ~350 ms (CPU) |
| `POST` | `/predict/ensemble` | Maximum-accuracy Tri-Scale Ensemble identification | ~110–130 ms (GPU) |
| `POST` | `/predict/sample/{id}` | 1-click classification of a pre-loaded sample bird | Same as `/predict` |

---

## 2. Detailed Endpoint Documentation

### 2.1 Health Check
- **Endpoint:** `GET /health`
- **Description:** Verifies that the inference engine is pre-loaded and reports hardware execution provider status.
- **Example Response (200 OK):**
```json
{
  "status": "healthy",
  "app_name": "BirdVision AI API",
  "version": "2.2.0",
  "model": "vit_base_patch14_dinov2_448",
  "supported_species": 1486,
  "onnx_active_provider": "CPUExecutionProvider",
  "onnx_available_providers": [
    "CPUExecutionProvider"
  ],
  "device": "CPU"
}
```

---

### 2.2 Model Architecture & Benchmarks
- **Endpoint:** `GET /model-info`
- **Description:** Returns the neural architecture parameters, input resolutions, training history, and empirical validation comparisons.
- **Example Response (200 OK):**
```json
{
  "application_name": "BirdVision AI",
  "model_name": "DINOv2 ViT-Base/14 Fine-Tuned (High-Resolution 448px)",
  "architecture": {
    "family": "Vision Transformer (ViT)",
    "backbone": "vit_base_patch14_dinov2",
    "patch_size": "14x14",
    "hidden_dimension": 768,
    "transformer_layers": 12,
    "attention_heads": 12,
    "total_parameters": "87,722,446 (87.7M)",
    "input_resolution": "448 x 448 pixels",
    "patch_tokens_at_448px": "1,024 vision tokens (32 x 32 grid)"
  },
  "dataset": {
    "name": "iNaturalist 2021 Mini (Aves subset)",
    "total_species": 1486,
    "training_images": 74300,
    "validation_images": 14860
  },
  "benchmarks_comparison": [
    {
      "model": "DINOv2 448px Production ONNX",
      "resolution": "448x448",
      "top1_accuracy": "79.60%",
      "top5_accuracy": "91.12%",
      "macro_f1": "79.58%"
    },
    {
      "model": "DINOv2 Tri-Scale Ensemble",
      "resolution": "Multi-Scale",
      "top1_accuracy": "80.03%",
      "top5_accuracy": "91.22%",
      "macro_f1": "80.02%"
    }
  ]
}
```

---

### 2.3 Single-Model Bird Classification
- **Endpoint:** `POST /predict`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `file`: Binary image file (JPEG, PNG, WEBP; max 20 MB).
- **Example cURL Request:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@rough_legged_hawk.jpg"
```
- **Example Response (200 OK):**
```json
{
  "success": true,
  "model": "vit_base_patch14_dinov2_448",
  "inference_type": "single_model_onnx",
  "predicted_species": {
    "class_id": 165,
    "scientific_name": "Buteo lagopus",
    "common_name": "Rough-legged Hawk",
    "genus": "Buteo",
    "family": "Accipitridae",
    "order": "Accipitriformes",
    "inaturalist_id": 5212,
    "confidence_percent": 80.61
  },
  "top_5_predictions": [
    {
      "rank": 1,
      "class_id": 165,
      "scientific_name": "Buteo lagopus",
      "common_name": "Rough-legged Hawk",
      "family": "Accipitridae",
      "genus": "Buteo",
      "confidence_percent": 80.61
    },
    {
      "rank": 2,
      "class_id": 166,
      "scientific_name": "Buteo regalis",
      "common_name": "Ferruginous Hawk",
      "family": "Accipitridae",
      "genus": "Buteo",
      "confidence_percent": 11.45
    },
    {
      "rank": 3,
      "class_id": 163,
      "scientific_name": "Buteo jamaicensis",
      "common_name": "Red-tailed Hawk",
      "family": "Accipitridae",
      "genus": "Buteo",
      "confidence_percent": 3.20
    },
    {
      "rank": 4,
      "class_id": 168,
      "scientific_name": "Buteo swainsoni",
      "common_name": "Swainson's Hawk",
      "family": "Accipitridae",
      "genus": "Buteo",
      "confidence_percent": 1.85
    },
    {
      "rank": 5,
      "class_id": 162,
      "scientific_name": "Buteo hemilasius",
      "common_name": "Upland Buzzard",
      "family": "Accipitridae",
      "genus": "Buteo",
      "confidence_percent": 0.92
    }
  ],
  "latency_ms": 28.45,
  "resolution": "448x448",
  "benchmark_accuracy": {
    "top1_validation_accuracy": "79.60%",
    "top5_validation_accuracy": "91.12%",
    "macro_f1": "79.58%",
    "note": "Ultra-fast direct Vision Transformer inference via ONNX Runtime engine."
  }
}
```

---

### 2.4 Tri-Scale Ensemble Bird Classification
- **Endpoint:** `POST /predict/ensemble`
- **Content-Type:** `multipart/form-data`
- **Parameters:**
  - `file`: Binary image file (JPEG, PNG, WEBP; max 20 MB).
- **Description:** Evaluates the input across a multi-resolution pyramid (448px, 392px, 336px) with horizontal-flip Test-Time Augmentation (TTA). Delivers **80.03% Top-1** accuracy.
- **Example Response (200 OK):**
```json
{
  "success": true,
  "model": "vit_base_patch14_dinov2_triscale_ensemble",
  "inference_type": "triscale_ensemble",
  "predicted_species": {
    "class_id": 165,
    "scientific_name": "Buteo lagopus",
    "common_name": "Rough-legged Hawk",
    "genus": "Buteo",
    "family": "Accipitridae",
    "order": "Accipitriformes",
    "inaturalist_id": 5212,
    "confidence_percent": 82.00
  },
  "top_5_predictions": [ ... ],
  "latency_ms": 118.20,
  "resolution": "Multi-Scale (448px, 392px, 336px)",
  "benchmark_accuracy": {
    "top1_validation_accuracy": "80.03%",
    "top5_validation_accuracy": "91.22%",
    "macro_f1": "80.02%",
    "note": "Highest-accuracy multi-scale ensemble pyramid."
  },
  "ensemble_weights": {
    "448px": 0.70,
    "392px": 0.15,
    "336px": 0.15
  }
}
```

---

### 2.5 Species Directory & Search
- **Endpoint:** `GET /species`
- **Query Parameters:**
  - `q` (string, optional): Search query by common name, scientific name, or genus.
  - `family` (string, optional): Filter by taxonomic family (e.g. `Accipitridae`, `Trochilidae`).
  - `page` (int, default: 1): Page number.
  - `page_size` (int, default: 24, max: 100): Results per page.
- **Example Request:** `GET /species?q=Hawk&page=1&page_size=2`
- **Example Response (200 OK):**
```json
{
  "total": 29,
  "page": 1,
  "page_size": 2,
  "total_pages": 15,
  "species": [
    {
      "class_id": 160,
      "scientific_name": "Buteo albonotatus",
      "common_name": "Zone-tailed Hawk",
      "genus": "Buteo",
      "family": "Accipitridae",
      "order": "Accipitriformes",
      "inaturalist_id": 5200
    },
    {
      "class_id": 161,
      "scientific_name": "Buteo brachyurus",
      "common_name": "Short-tailed Hawk",
      "genus": "Buteo",
      "family": "Accipitridae",
      "order": "Accipitriformes",
      "inaturalist_id": 5202
    }
  ]
}
```

---

## 3. Error Codes & Handling

| HTTP Code | Error Reason | Example Error Response |
|---|---|---|
| `400 Bad Request` | Empty file payload or unreadable image bytes | `{"detail": "Uploaded file is empty."}` |
| `400 Bad Request` | Image dimensions too small (< 10×10 px) | `{"detail": "Image dimensions (5x5) are too small for bird identification."}` |
| `404 Not Found` | Unknown species ID or sample bird name | `{"detail": "Species with class ID 9999 not found."}` |
| `413 Payload Too Large` | Image file size exceeds 20 MB | `{"detail": "Image size exceeds the maximum limit of 20 MB."}` |
| `415 Unsupported Media` | File is not an image (e.g. text/pdf) | `{"detail": "Unsupported file type 'application/pdf'. Please upload a valid image."}` |
