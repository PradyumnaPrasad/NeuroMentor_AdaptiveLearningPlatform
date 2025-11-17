from pydantic import BaseModel, constr, conint, validator

class StudentAnswer(BaseModel):
    student_id: constr(min_length=1)
    question_id: constr(min_length=1)
    answer: constr(min_length=1)
    
    @validator('student_id', 'question_id', 'answer')
    def validate_non_empty(cls, value):
        if not value.strip():
            raise ValueError('Field cannot be empty')
        return value

class MasteryUpdate(BaseModel):
    student_id: constr(min_length=1)
    concept_id: constr(min_length=1)
    mastered: bool

class PracticeRequest(BaseModel):
    student_id: constr(min_length=1)
    difficulty: conint(ge=1, le=5)  # Assuming difficulty is rated from 1 to 5

class PracticeResponse(BaseModel):
    question_id: str
    question_text: str
    options: list

class ActionResponse(BaseModel):
    action: str
    data: dict  # This can hold various types of data depending on the action
