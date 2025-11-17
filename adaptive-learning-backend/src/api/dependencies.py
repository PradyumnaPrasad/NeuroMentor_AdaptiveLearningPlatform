from fastapi import Depends, HTTPException
from pydantic import BaseModel
from .models.schemas import StudentAnswer, MasteryUpdate
from .services.mastery_service import MasteryService
from .services.cache_service import CacheService

# Dependency to validate student answers
async def validate_student_answer(answer: StudentAnswer):
    if not answer.is_valid():
        raise HTTPException(status_code=400, detail="Invalid answer format")
    return answer

# Dependency to manage mastery updates
async def get_mastery_service() -> MasteryService:
    return MasteryService()

# Dependency to manage caching
async def get_cache_service() -> CacheService:
    return CacheService()