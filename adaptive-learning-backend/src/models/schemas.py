from pydantic import BaseModel
from typing import List, Optional

class StudentAnswer(BaseModel):
    student_id: str
    question_id: str
    answer: str

class ActionResponse(BaseModel):
    action: str
    explanation: Optional[str] = None
    practice_questions: Optional[List[str]] = None
    mastery_update: Optional[bool] = None

class PracticeQuestion(BaseModel):
    question_id: str
    question_text: str
    difficulty: str

class MasteryUpdate(BaseModel):
    student_id: str
    concept_id: str
    mastered: bool

class ReviewSchedule(BaseModel):
    student_id: str
    concept_id: str
    review_date: str