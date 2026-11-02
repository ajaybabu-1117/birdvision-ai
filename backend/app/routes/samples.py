from typing import List
from fastapi import APIRouter
from ..services.inference_service import inference_service
from ..schemas.species import SampleBird

router = APIRouter(prefix="/samples", tags=["Sample Birds"])

@router.get("", response_model=List[SampleBird])
def get_sample_birds():
    """
    Returns pre-curated sample birds for instant 1-click prediction demonstrations in the UI.
    """
    inference_service.initialize()
    return inference_service.sample_birds
