from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from ..services.inference_service import inference_service
from ..schemas.species import SpeciesListResponse, SpeciesDetail

router = APIRouter(prefix="/species", tags=["Species Directory"])

@router.get("", response_model=SpeciesListResponse)
def list_species(
    q: Optional[str] = Query(None, description="Search query by common or scientific name or genus"),
    family: Optional[str] = Query(None, description="Filter by taxonomic family"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(24, ge=1, le=100, description="Items per page"),
):
    """
    Search and paginate through the 1,486 supported bird species.
    """
    inference_service.initialize()
    items = inference_service.species_list

    if q:
        query = q.lower().strip()
        items = [
            sp for sp in items
            if query in sp["scientific_name"].lower()
            or query in sp["common_name"].lower()
            or query in sp["genus"].lower()
            or query in sp["family"].lower()
        ]

    if family:
        fam_query = family.lower().strip()
        items = [sp for sp in items if fam_query == sp["family"].lower()]

    total = len(items)
    total_pages = max(1, (total + page_size - 1) // page_size)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paged_items = items[start_idx:end_idx]

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "species": paged_items,
    }


@router.get("/{identifier}", response_model=SpeciesDetail)
def get_species_detail(identifier: str):
    """
    Get detailed taxonomy for a species by its scientific name or class ID.
    """
    inference_service.initialize()

    # Try numeric class_id
    if identifier.isdigit():
        idx = int(identifier)
        if 0 <= idx < len(inference_service.classes):
            sp_name = inference_service.classes[idx]
            return inference_service.species_meta_by_name.get(sp_name, {
                "class_id": idx,
                "scientific_name": sp_name,
                "common_name": sp_name,
                "genus": sp_name.split()[0],
                "family": "Unknown",
                "order": "Aves"
            })
        raise HTTPException(status_code=404, detail=f"Species with class ID {idx} not found.")

    # Try scientific name
    normalized_name = identifier.replace("_", " ")
    if normalized_name in inference_service.species_meta_by_name:
        return inference_service.species_meta_by_name[normalized_name]

    # Case-insensitive lookup
    for name, data in inference_service.species_meta_by_name.items():
        if name.lower() == normalized_name.lower():
            return data

    raise HTTPException(status_code=404, detail=f"Species '{identifier}' not found.")
