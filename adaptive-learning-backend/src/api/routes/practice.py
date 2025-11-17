from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from src.services.mastery_service import MasteryService
from src.services.gemini_service import GeminiService
from src.rl.action_executor import ActionExecutor

router = APIRouter()

class PracticeQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class PracticeResponse(BaseModel):
    questions: List[PracticeQuestion]
    message: str

@router.post("/practice/initiate", response_model=PracticeResponse)
async def initiate_practice(student_id: str):
    try:
        action_executor = ActionExecutor()
        questions = await action_executor.generate_practice_questions(student_id)
        return PracticeResponse(questions=questions, message="Practice mode initiated.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/practice/questions", response_model=PracticeResponse)
async def get_practice_questions(student_id: str, difficulty: str):
    try:
        action_executor = ActionExecutor()
        questions = await action_executor.generate_practice_questions(student_id, difficulty)
        return PracticeResponse(questions=questions, message="Practice questions retrieved.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))