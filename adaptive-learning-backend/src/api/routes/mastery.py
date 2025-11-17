from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from src.services.mastery_service import MasteryService

router = APIRouter()

class MasteryUpdateRequest(BaseModel):
    student_id: str
    concept_id: str
    mastered: bool

class ReviewScheduleRequest(BaseModel):
    student_id: str
    concept_id: str
    review_date: str

@router.post("/update-mastery")
async def update_mastery(request: MasteryUpdateRequest, mastery_service: MasteryService = Depends()):
    try:
        await mastery_service.update_mastery(request.student_id, request.concept_id, request.mastered)
        return {"message": "Mastery level updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/schedule-review")
async def schedule_review(request: ReviewScheduleRequest, mastery_service: MasteryService = Depends()):
    try:
        await mastery_service.schedule_review(request.student_id, request.concept_id, request.review_date)
        return {"message": "Review scheduled successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))