import os
from pathlib import Path

class Settings:
    APP_NAME: str = "BirdVision AI API"
    APP_VERSION: str = "2.2.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # CORS origins: Allow environment override as comma-separated string
    env_origins = os.getenv("ALLOWED_ORIGINS", "")
    if env_origins:
        ALLOWED_ORIGINS: list = [o.strip() for o in env_origins.split(",") if o.strip()]
    else:
        ALLOWED_ORIGINS: list = [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "*"
        ]

    # Application directory
    APP_DIR: Path = Path(__file__).resolve().parent
    SPECIES_METADATA_PATH: Path = APP_DIR / "data" / "species_metadata.json"
    SAMPLE_BIRDS_DIR: Path = APP_DIR / "data" / "sample_birds"

    # Model and metadata paths
    PROJECT_ROOT: Path = Path(os.getenv("PROJECT_ROOT", r"C:\Bird Species Detection"))
    
    # Priority for classes.json: Explicit ENV -> Local app/data -> Root project
    env_classes = os.getenv("CLASSES_PATH")
    if env_classes and Path(env_classes).exists():
        CLASSES_PATH: Path = Path(env_classes)
    elif (APP_DIR / "data" / "classes.json").exists():
        CLASSES_PATH: Path = APP_DIR / "data" / "classes.json"
    else:
        CLASSES_PATH: Path = PROJECT_ROOT / "classes.json"

    # Priority for ONNX model: Explicit ENV -> Local app/models -> Root exports -> Fallback download destination
    env_model = os.getenv("ONNX_MODEL_PATH")
    if env_model and Path(env_model).exists():
        ONNX_MODEL_PATH: Path = Path(env_model)
    elif (PROJECT_ROOT / "exports" / "dinov2_448_birds.onnx").exists():
        ONNX_MODEL_PATH: Path = PROJECT_ROOT / "exports" / "dinov2_448_birds.onnx"
    elif (APP_DIR / "models" / "dinov2_448_birds.onnx").exists():
        ONNX_MODEL_PATH: Path = APP_DIR / "models" / "dinov2_448_birds.onnx"
    else:
        ONNX_MODEL_PATH: Path = APP_DIR / "models" / "dinov2_448_birds.onnx"

    # Optional remote model download configuration
    MODEL_DOWNLOAD_URL: str = os.getenv("MODEL_DOWNLOAD_URL", "")
    HF_MODEL_REPO: str = os.getenv("HF_MODEL_REPO", "")

    # Preprocessing constants
    IMAGE_SIZE: int = 448
    RESIZE_SIZE: int = 512
    MAX_UPLOAD_SIZE_MB: int = 20

settings = Settings()
