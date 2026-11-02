from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from PIL import Image
from ..services.inference_service import inference_service
from ..utils.image_processing import validate_and_load_image
from ..schemas.prediction import PredictionResponse
from ..config import settings

router = APIRouter(tags=["Prediction"])

@router.post("/predict", response_model=PredictionResponse)
async def predict_bird_image(file: UploadFile = File(...)):
    """
    Classify a bird image using the high-throughput 448x448 DINOv2 Vision Transformer ONNX model.
    Verified benchmark accuracy: 79.60% Top-1, 91.12% Top-5.
    """
    contents = await file.read()
    image = validate_and_load_image(contents, file.content_type or "")
    await file.close()

    result = inference_service.predict_single(image, top_k=5)
    return result


@router.post("/predict/ensemble", response_model=PredictionResponse)
async def predict_bird_ensemble(file: UploadFile = File(...)):
    """
    Classify a bird image using the multi-scale DINOv2 Tri-Scale Ensemble (448px, 392px, 336px).
    Verified benchmark accuracy: 80.03% Top-1, 91.22% Top-5, 80.02% Macro F1.
    """
    contents = await file.read()
    image = validate_and_load_image(contents, file.content_type or "")
    await file.close()

    result = inference_service.predict_ensemble(image, top_k=5)
    return result


@router.post("/predict/sample/{sample_id}", response_model=PredictionResponse)
async def predict_sample_bird(sample_id: str, use_ensemble: bool = Query(False)):
    """
    Runs prediction directly on one of the pre-loaded sample bird images for 1-click demonstration.
    """
    sample_file = settings.SAMPLE_BIRDS_DIR / f"{sample_id}.jpg"
    if not sample_file.exists():
        raise HTTPException(status_code=404, detail=f"Sample bird '{sample_id}' not found.")

    with open(sample_file, "rb") as f:
        contents = f.read()

    image = validate_and_load_image(contents, "image/jpeg")
    if use_ensemble:
        return inference_service.predict_ensemble(image, top_k=5)
    return inference_service.predict_single(image, top_k=5)
