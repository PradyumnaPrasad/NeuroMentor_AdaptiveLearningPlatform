from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from src.rl.adaptive_q_network import AdaptiveQNetwork
from src.models.schemas import StudentAnswer, ActionResponse
from src.services.mastery_service import MasteryService
from src.services.persistence_service import PersistenceService
from src.config import settings

router = APIRouter()

# Initialize RL components with proper sizes
# State size: student features (10) + question features (10) = 20
# Action size: 7 actions (next_question, show_explanation, generate_easy, generate_medium, generate_hard, mark_mastered, schedule_review)
STATE_SIZE = 20
ACTION_SIZE = 7

adaptive_q_network = AdaptiveQNetwork(
    state_size=STATE_SIZE,
    action_size=ACTION_SIZE,
    learning_rate=settings.learning_rate,
    replay_buffer_size=settings.replay_buffer_size,
    batch_size=settings.batch_size
)
mastery_service = MasteryService(
    db_url=settings.mongodb_url,
    db_name=settings.mongodb_db
)
persistence_service = PersistenceService()

class AnswerSubmission(BaseModel):
    student_id: str
    question_id: str
    answer: Any

@router.post("/submit-answer", response_model=ActionResponse)
async def submit_answer(submission: AnswerSubmission):
    try:
        # Process the student's answer
        correctness = await mastery_service.check_answer(submission.student_id, submission.question_id, submission.answer)
        
        # Update mastery state
        mastery_service.update_mastery(submission.student_id, submission.question_id, correctness)
        
        # Get the next action from the RL agent
        action = adaptive_q_network.get_action(submission.student_id, submission.question_id, correctness)
        
        return ActionResponse(action=action)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/initiate-practice", response_model=Dict[str, Any])
async def initiate_practice(student_id: str):
    try:
        # Initialize practice mode and generate an easy practice question
        practice_question = await adaptive_q_network.start_practice(student_id)
        return {"question": practice_question}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))