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
from typing import List
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.services.breed_details import (
    get_breed_summary, get_breed_diet,
    get_breed_diseases, get_breed_full,
    get_all_symptoms, check_symptoms
)
from backend.app.services.chatbot import get_chat_response

class SymptomCheckRequest(BaseModel):
    symptoms: List[str]

class ChatRequest(BaseModel):
    message: str
    history: list = []

router = APIRouter(tags=["Breeds"])


@router.get("/breeds", response_model=BreedsListResponse)
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


@router.get("/breeds/{breed_name}", response_model=BreedDetail)
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


@router.get("/breeds/{breed_name}/summary")
def breed_summary(breed_name: str, db=Depends(get_db)):
    data = get_breed_summary(db, breed_name)
    if not data:
        raise HTTPException(status_code=404, detail="Breed not found")
    return data

@router.get("/breeds/{breed_name}/diet")
def breed_diet(breed_name: str, db=Depends(get_db)):
    data = get_breed_diet(db, breed_name)
    if not data:
        raise HTTPException(status_code=404, detail="Breed not found")
    return data

@router.get("/breeds/{breed_name}/diseases")
def breed_diseases(breed_name: str, db=Depends(get_db)):
    return get_breed_diseases(db, breed_name)

@router.get("/breeds/{breed_name}/full")
def breed_full(breed_name: str, db=Depends(get_db)):
    return get_breed_full(db, breed_name)

# Use the global API router instead of the prefix one for /symptoms routes to match the requested paths
@router.get("/symptoms")
def get_symptoms_list(db=Depends(get_db)):
    return get_all_symptoms(db)

@router.post("/symptoms/check")
def post_symptoms_check(request: SymptomCheckRequest, db=Depends(get_db)):
    return check_symptoms(db, request.symptoms)

@router.get("/breeds/{breed_name}/seasonal-diet")
async def get_diet(breed_name: str, season: str, db: Session = Depends(get_db)):
    from backend.app.services.breed_details import get_seasonal_diet
    diet = get_seasonal_diet(db, breed_name, season.lower())
    if not diet:
        raise HTTPException(status_code=404, detail=f"Seasonal diet not found for breed {breed_name} in season {season}")
    return diet

@router.post("/chat")
def chat_endpoint(request: ChatRequest):
    try:
        response_text = get_chat_response(request.message, request.history)
        return {"response": response_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
