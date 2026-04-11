"""
Breed metadata endpoints.
GET /breeds       - List all breeds
GET /breeds/{name} - Get breed details
"""

from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional

from backend.app.schemas.breed import BreedDetail, BreedListItem, BreedsListResponse
from backend.app.services.breed_info import breed_info_service
from backend.app.database import get_db
from backend.app.services.breed_details import (
    get_breed_summary, get_breed_diet,
    get_breed_diseases, get_breed_full
)

router = APIRouter(prefix="/breeds", tags=["Breeds"])


@router.get("", response_model=BreedsListResponse)
async def list_breeds(
    animal_type: Optional[str] = Query(None, description="Filter by animal type (Cow/Buffalo)"),
    search: Optional[str] = Query(None, description="Search by breed name"),
):
    """List all breeds with optional filtering."""
    breeds = breed_info_service.get_all()

    if animal_type:
        breeds = [b for b in breeds if b['animal_type'].lower() == animal_type.lower()]

    if search:
        search_lower = search.lower()
        breeds = [b for b in breeds if search_lower in b['breed_name'].lower()]

    items = [
        BreedListItem(
            breed_id=b['breed_id'],
            breed_name=b['breed_name'],
            animal_type=b['animal_type'],
            region=b['region'],
            primary_use=b['primary_use'],
        )
        for b in breeds
    ]

    return BreedsListResponse(total=len(items), breeds=items)


@router.get("/{breed_name}", response_model=BreedDetail)
async def get_breed(breed_name: str):
    """Get detailed info for a specific breed."""
    info = breed_info_service.get_breed(breed_name)
    if info is None:
        # Try case-insensitive search
        results = breed_info_service.search(breed_name)
        if results:
            info = results[0]
        else:
            raise HTTPException(status_code=404, detail=f"Breed not found: {breed_name}")

    return BreedDetail(**info)


@router.get("/{breed_name}/summary")
def breed_summary(breed_name: str, db=Depends(get_db)):
    data = get_breed_summary(db, breed_name)
    if not data:
        raise HTTPException(status_code=404, detail="Breed not found")
    return data

@router.get("/{breed_name}/diet")
def breed_diet(breed_name: str, db=Depends(get_db)):
    data = get_breed_diet(db, breed_name)
    if not data:
        raise HTTPException(status_code=404, detail="Breed not found")
    return data

@router.get("/{breed_name}/diseases")
def breed_diseases(breed_name: str, db=Depends(get_db)):
    return get_breed_diseases(db, breed_name)

@router.get("/{breed_name}/full")
def breed_full(breed_name: str, db=Depends(get_db)):
    return get_breed_full(db, breed_name)
