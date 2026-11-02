from typing import List, Optional
from pydantic import BaseModel

class SpeciesDetail(BaseModel):
    class_id: int
    scientific_name: str
    common_name: str
    genus: str
    family: str
    order: str
    inaturalist_id: Optional[int] = None
    sample_image_url: Optional[str] = None

class SpeciesListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    species: List[SpeciesDetail]

class SampleBird(BaseModel):
    id: str
    scientific_name: str
    common_name: str
    family: str
    filename: str
    url: str
