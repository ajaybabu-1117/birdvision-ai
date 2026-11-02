import io
from typing import Tuple
import numpy as np
from PIL import Image, ImageOps
from fastapi import HTTPException
from ..config import settings

MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32).reshape(1, 1, 3)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32).reshape(1, 1, 3)

def validate_and_load_image(contents: bytes, content_type: str = "") -> Image.Image:
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"Image size exceeds the maximum limit of {settings.MAX_UPLOAD_SIZE_MB} MB."
        )

    if content_type and not content_type.startswith("image/"):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{content_type}'. Please upload a valid image (JPG, PNG, WEBP)."
        )

    try:
        image = Image.open(io.BytesIO(contents))
        image.load()
        image = ImageOps.exif_transpose(image).convert("RGB")
        
        w, h = image.size
        if w < 10 or h < 10:
            raise ValueError(f"Image dimensions ({w}x{h}) are too small for bird identification.")
        return image
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Corrupted or invalid image file: {exc}"
        ) from exc


def preprocess_for_onnx(image: Image.Image, image_size: int = 448, resize_size: int = 512) -> np.ndarray:
    """Preprocesses a PIL Image into an ONNX-compatible NCHW float32 tensor."""
    width, height = image.size
    scale = resize_size / min(width, height)
    new_width = round(width * scale)
    new_height = round(height * scale)

    image_resized = image.resize((new_width, new_height), Image.Resampling.BILINEAR)

    left = (new_width - image_size) // 2
    top = (new_height - image_size) // 2
    image_cropped = image_resized.crop((left, top, left + image_size, top + image_size))

    arr = np.asarray(image_cropped, dtype=np.float32) / 255.0
    arr = (arr - MEAN) / STD
    arr = np.transpose(arr, (2, 0, 1))  # HWC to CHW
    return np.expand_dims(arr, axis=0).astype(np.float32)  # Add batch dim -> NCHW


def softmax(logits: np.ndarray) -> np.ndarray:
    """Stable softmax calculation."""
    logits = logits - np.max(logits)
    exp_vals = np.exp(logits)
    return exp_vals / np.sum(exp_vals)
