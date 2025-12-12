from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from src.rl.adaptive_q_network import AdaptiveQNetwork
from src.rl.action_executor import ActionExecutor
from src.rl.state_builder import StateBuilder
from src.rl.reward_calculator import RewardCalculator
from src.services.mastery_service import MasteryService
from src.services.gemini_service import GeminiService
from src.services.persistence_service import PersistenceService
from src.config import settings
import random

router = APIRouter()

# Initialize services
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

gemini_service = GeminiService()
action_executor = ActionExecutor(gemini_service=gemini_service, mastery_service=mastery_service)
state_builder = StateBuilder(max_length=STATE_SIZE)
reward_calculator = RewardCalculator()
persistence_service = PersistenceService()

# Request/Response Models
class Option(BaseModel):
    text: str
    emoji: Optional[str] = None
    correct: bool

class QuestionData(BaseModel):
    id: int
    question: str
    options: List[Option]
    difficulty: Optional[str] = "medium"
    explanation: Optional[str] = None
    conceptTags: Optional[List[str]] = []

class LearningState(BaseModel):
    classLevel: int
    consecutiveCorrect: int
    consecutiveWrong: int
    currentDifficulty: str = "medium"
    isInAdaptiveMode: bool = False
    recentPerformance: List[bool] = []
    conceptTags: Optional[List[str]] = []
    questionType: Optional[str] = None
    timeSpent: Optional[int] = 0
    hintsUsed: Optional[int] = 0

class ProcessAnswerRequest(BaseModel):
    studentId: int
    questionId: int
    selectedAnswer: int
    isCorrect: bool
    currentState: LearningState
    questionData: QuestionData

class AIExplanation(BaseModel):
    encouragement: str
    explanation: str
    example: str
    tip: str

class ProcessAnswerResponse(BaseModel):
    action: str
    data: Dict[str, Any]
    reward: float
    nextState: LearningState

class GenerateQuestionRequest(BaseModel):
    originalQuestion: str
    correctAnswer: str
    conceptTags: List[str]
    difficulty: str
    classLevel: int
    questionId: Optional[int] = None
    mode: Optional[str] = "practice"  # "quiz" or "practice"


@router.post("/process-answer")
async def process_answer(request: Dict[str, Any]):
    """Process student's answer and return next action with hint if wrong"""
    try:
        print(f"Received raw request: {request}")
        
        # Extract data from request
        student_id = str(request.get("studentId"))
        question_id = str(request.get("questionId"))
        is_correct = request.get("isCorrect")
        selected_answer = request.get("selectedAnswer")
        current_state_data = request.get("currentState", {})
        question_data = request.get("questionData", {})
        
        # Extract data from request
        student_id = str(request.get("studentId"))
        question_id = str(request.get("questionId"))
        is_correct = request.get("isCorrect")
        selected_answer = request.get("selectedAnswer")
        current_state_data = request.get("currentState", {})
        question_data = request.get("questionData", {})
        
        # Build state vector
        student_features = [
            current_state_data.get("classLevel", 5) / 12.0,
            current_state_data.get("consecutiveCorrect", 0) / 10.0,
            current_state_data.get("consecutiveWrong", 0) / 10.0,
            1.0 if current_state_data.get("isInAdaptiveMode", False) else 0.0,
            len(current_state_data.get("recentPerformance", [])) / 10.0,
            sum(current_state_data.get("recentPerformance", [])) / max(len(current_state_data.get("recentPerformance", [])), 1),
            current_state_data.get("timeSpent", 0) / 300.0,  # Normalize to 5 min
            current_state_data.get("hintsUsed", 0) / 5.0,
            1.0 if current_state_data.get("currentDifficulty") == "easy" else (0.5 if current_state_data.get("currentDifficulty") == "medium" else 0.0),
            random.random()  # Add some randomness
        ]
        
        question_features = [
            1.0 if question_data.get("difficulty") == "easy" else (0.5 if question_data.get("difficulty") == "medium" else 0.0),
            len(question_data.get("options", [])) / 4.0,
            len(question_data.get("conceptTags", [])) / 5.0,
            random.random(),
            0.5, 0.5, 0.5, 0.5, 0.5, 0.5  # Padding
        ]
        
        state = state_builder.build_state_vector(student_features, question_features)
        
        # Select action from RL agent
        action_index = adaptive_q_network.select_action(state)
        
        # Map action index to action name
        action_map = {
            0: "next_question",
            1: "show_explanation",
            2: "generate_easy",
            3: "generate_medium",
            4: "generate_hard",
            5: "mark_mastered",
            6: "schedule_review"
        }
        action = action_map.get(action_index, "next_question")
        
        # Calculate reward
        reward = reward_calculator.calculate_reward(
            correctness=is_correct,
            action_type=action,
            adaptive_mode=current_state_data.get("isInAdaptiveMode", False),
            consecutive_fails=current_state_data.get("consecutiveWrong", 0)
        )
        
        # Update state
        next_state = current_state_data.copy()
        if is_correct:
            next_state["consecutiveCorrect"] = next_state.get("consecutiveCorrect", 0) + 1
            next_state["consecutiveWrong"] = 0
        else:
            next_state["consecutiveWrong"] = next_state.get("consecutiveWrong", 0) + 1
            next_state["consecutiveCorrect"] = 0
        
        recent_perf = next_state.get("recentPerformance", [])
        recent_perf.append(is_correct)
        if len(recent_perf) > 10:
            recent_perf = recent_perf[-10:]
        next_state["recentPerformance"] = recent_perf
        
        # Prepare response data
        response_data = {}
        
        # Generate hint/explanation for wrong answers
        if not is_correct:
            print(f"Wrong answer detected for student {student_id}, question {question_id}")
            
            # Generate AI explanation with hint using Gemini
            options = question_data.get("options", [])
            correct_option = next((opt for opt in options if opt.get("correct")), None)
            correct_answer = correct_option.get("text", "Unknown") if correct_option else "Unknown"
            student_answer = options[selected_answer].get("text", "Unknown") if selected_answer < len(options) else "Unknown"
            
            # Use Gemini API for better explanations
            explanation_data = await gemini_service.generate_explanation(
                question=question_data.get("question", ""),
                correct_answer=correct_answer,
                student_answer=student_answer,
                concept_tags=question_data.get("conceptTags", [])
            )
            
            print(f"Generated AI explanation: {explanation_data}")
            
            response_data["explanation"] = {
                "encouragement": explanation_data.get("encouragement", "Great effort!"),
                "explanation": explanation_data.get("explanation", f"The correct answer is {correct_answer}."),
                "example": explanation_data.get("example", "Think about real-world applications!"),
                "tip": explanation_data.get("tip", "Take your time to think through each option.")
            }
            response_data["correctAnswer"] = correct_answer
            response_data["hint"] = explanation_data.get("tip", "Take your time!")
            
            # Always force show_explanation action for wrong answers
            action = "show_explanation"
            
            # Offer practice if multiple consecutive wrong answers
            if next_state.get("consecutiveWrong", 0) >= 2:
                response_data["offerPractice"] = True
                print(f"Offering practice mode after {next_state.get('consecutiveWrong', 0)} consecutive wrong answers")
        else:
            response_data["message"] = "Correct! Great job!"
            response_data["moveToNext"] = True
            
            # Check if concept is mastered
            if next_state.get("consecutiveCorrect", 0) >= 3:
                response_data["showCelebration"] = True
                response_data["conceptsMastered"] = question_data.get("conceptTags", [])
                action = "mark_mastered"
        
        # Update mastery in database
        mastery_service.update_mastery_level(
            student_id=student_id,
            concept_id=",".join(question_data.get("conceptTags", ["general"])),
            level=1 if is_correct else 0
        )
        
        # Store experience for training
        adaptive_q_network.store_experience((state, action_index, reward, state, not is_correct))
        
        # Train the network if enough experiences
        adaptive_q_network.train()
        
        print(f"Returning response - Action: {action}, Has explanation: {'explanation' in response_data}, Has hint: {'hint' in response_data}")
        
        return {
            "action": action,
            "data": response_data,
            "reward": reward,
            "nextState": next_state
        }
        
    except Exception as e:
        print(f"Error processing answer: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-question", response_model=QuestionData)
async def generate_question(request: GenerateQuestionRequest):
    """Generate a new practice question at specified difficulty"""
    try:
        # Use action_executor for quiz questions to apply difficulty mapping
        # For now, assume this is for quiz mode - later we can add a mode parameter
        action_result = await action_executor.generate_question(request.difficulty, request.classLevel, request.conceptTags)
        question_data = action_result["question"]
        
        return QuestionData(**question_data)
        
    except Exception as e:
        print(f"Error generating question: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-quiz-batch")
async def generate_quiz_batch(request: Dict[str, Any]):
    """Generate all 5 quiz questions in a single batch call for better performance"""
    try:
        print(f"Generating quiz batch with request: {request}")
        
        concept_tags = request.get("conceptTags", [])
        class_level = request.get("classLevel", 5)
        subject_type = request.get("subjectType", "math")  # 'math' or 'science'
        topic = " ".join(concept_tags) if concept_tags else "general"
        
        print(f"📚 Subject Type: {subject_type.upper()} - Using {'MATH' if subject_type == 'math' else 'SCIENCE'} prompts")
        print(f"🎯 Topic: {topic}")
        
        # Progressive difficulty pattern - DON'T add operation hints, let topic define it
        difficulties = ['easy', 'easy', 'medium', 'medium', 'hard']
        variations = [
            'direct arithmetic',
            'direct arithmetic with different numbers', 
            'word problem with simple context',
            'word problem with different scenario',
            'word problem with moderate numbers'
        ]
        
        # Generate all 5 questions in optimal batches
        all_questions = []
        
        # Batch 1: Generate 2 easy questions together (direct arithmetic only)
        easy_questions = await gemini_service.generate_question_batch(
            topic=topic,  # Pass topic as-is (e.g., "Multiplication" or "Division")
            difficulty='easy',
            count=2,
            class_level=class_level,
            subject_type=subject_type
        )
        all_questions.extend(easy_questions[:2])
        
        # Batch 2: Generate 2 medium questions together (word problems)
        medium_questions = await gemini_service.generate_question_batch(
            topic=topic,
            difficulty='medium',
            count=2,
            class_level=class_level,
            subject_type=subject_type
        )
        all_questions.extend(medium_questions[:2])
        
        # Batch 3: Generate 1 hard question (complex word problem)
        hard_questions = await gemini_service.generate_question_batch(
            topic=topic,
            difficulty='hard',
            count=1,
            class_level=class_level,
            subject_type=subject_type
        )
        all_questions.extend(hard_questions[:1])
        
        print(f"Successfully generated {len(all_questions)} questions in batch")
        
        return {
            "questions": all_questions,
            "count": len(all_questions)
        }
        
    except Exception as e:
        print(f"Error generating quiz batch: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/start-adaptive-mode")
async def start_adaptive_mode(request: Dict[str, Any]):
    """Start adaptive practice mode with ALL 3 difficulty levels generated upfront for smooth progression"""
    try:
        print(f"Starting adaptive mode with request: {request}")
        
        student_id = request.get("studentId")
        question_data = request.get("questionData", {})
        class_level = request.get("classLevel", 5)
        subject_type = request.get("subjectType", "math")  # 'math' or 'science'
        topic = " ".join(question_data.get("conceptTags", ["general"]))
        
        print(f"🚀 Generating ALL 3 practice levels (easy, medium, hard) in one batch for smooth practice!")
        print(f"📚 Subject Type: {subject_type.upper()} - Using {'MATH' if subject_type == 'math' else 'SCIENCE'} prompts")
        
        # Generate all 3 difficulty levels at once - NO delays during practice!
        # These use the EXACT SAME difficulty definitions as normal quiz mode:
        # - Easy: Direct arithmetic (single-digit × single-digit OR double-digit simple)
        # - Medium: Simple word problems with easy single-digit multiplication
        # - Hard: Word problems with moderate multiplication (one digit 5-9, other 10-20)
        all_practice_questions = []
        
        # Level 1: Easy question (same as quiz Q1-Q2)
        easy_questions = await gemini_service.generate_question_batch(
            topic=topic,
            difficulty='easy',
            count=1,
            class_level=class_level,
            subject_type=subject_type
        )
        all_practice_questions.extend(easy_questions[:1])
        
        # Level 2: Medium question (same as quiz Q3-Q4)
        medium_questions = await gemini_service.generate_question_batch(
            topic=topic,
            difficulty='medium',
            count=1,
            class_level=class_level,
            subject_type=subject_type
        )
        all_practice_questions.extend(medium_questions[:1])
        
        # Level 3: Hard question (same as quiz Q5)
        hard_questions = await gemini_service.generate_question_batch(
            topic=topic,
            difficulty='hard',
            count=1,
            class_level=class_level,
            subject_type=subject_type
        )
        all_practice_questions.extend(hard_questions[:1])
        
        print(f"✅ Generated {len(all_practice_questions)} practice questions (easy, medium, hard) - ready for smooth progression!")
        
        return {
            "action": "start_practice",
            "data": {
                "questions": all_practice_questions,  # Send all 3 levels upfront
                "currentQuestion": all_practice_questions[0],  # Start with easy
                "questionIndex": 0,
                "totalQuestions": len(all_practice_questions),
                "difficulty": "easy",
                "progress": {"current": 1, "total": 3},
                "message": f"Let's practice! Progress through 3 levels: Easy → Medium → Hard"
            },
            "reward": 0,
            "nextState": {
                "classLevel": class_level,
                "consecutiveCorrect": 0,
                "consecutiveWrong": 0,
                "currentDifficulty": "easy",
                "isInAdaptiveMode": True,
                "recentPerformance": []
            }
        }
        
    except Exception as e:
        print(f"Error starting adaptive mode: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


def generate_ai_explanation(question: str, correct_answer: str, student_answer: str, concept_tags: List[str]) -> AIExplanation:
    """Generate AI-powered explanation with encouragement, explanation, example, and tip"""
    
    # Encouragement messages
    encouragements = [
        "Don't worry! Learning is all about making mistakes and growing from them. 🌱",
        "Great effort! Every mistake is a step closer to mastery. Keep going! 💪",
        "Nice try! Let's learn why the correct answer works better. 🎓",
        "You're on the right track! Let me help you understand this better. ✨"
    ]
    
    # Generate contextual explanation
    concepts_str = ", ".join(concept_tags) if concept_tags else "this topic"
    
    explanation = f"The correct answer is '{correct_answer}'. "
    
    # Add concept-specific explanation
    if any(tag.lower() in ["math", "algebra", "arithmetic", "numbers"] for tag in concept_tags):
        explanation += f"In mathematics, understanding {concepts_str} helps you solve problems accurately. "
    else:
        explanation += f"This question tests your understanding of {concepts_str}. "
    
    # Generate a helpful real-world example based on the answer
    example = ""
    answer_lower = correct_answer.lower()
    
    # Math-related examples
    if any(char.isdigit() for char in correct_answer):
        if "12" in correct_answer:
            example = "Think of it like having a dozen eggs - that's 12 eggs in a carton!"
        elif "24" in correct_answer:
            example = "Like the number of hours in a day - 24 hours make one full day!"
        elif "7" in correct_answer:
            example = "Like the days of the week - there are 7 days from Monday to Sunday!"
        elif "365" in correct_answer:
            example = "Like the days in a year - 365 days make one complete year!"
        elif "+" in question.lower() or "sum" in question.lower():
            example = "Imagine you have some apples and get more - addition helps you count the total!"
        elif "-" in question.lower() or "subtract" in question.lower():
            example = "Like taking cookies from a jar - subtraction tells you how many are left!"
        elif "×" in question.lower() or "multiply" in question.lower():
            example = "Like counting rows of chairs - multiplication makes it faster!"
        else:
            example = f"Think of {correct_answer} in terms of things you can count or see around you!"
    
    # Science-related examples
    elif any(tag.lower() in ["science", "physics", "biology", "chemistry"] for tag in concept_tags):
        if "water" in answer_lower:
            example = "Water is everywhere - in rivers, oceans, and even in the air as vapor!"
        elif "sun" in answer_lower:
            example = "The sun is like a giant light bulb that gives us warmth and helps plants grow!"
        elif "plant" in answer_lower:
            example = "Plants are like food factories - they make their own food using sunlight!"
        else:
            example = "Think about how you see this in nature or in everyday life!"
    
    # Geography examples
    elif any(tag.lower() in ["geography", "world", "countries"] for tag in concept_tags):
        if "7" in correct_answer or "seven" in answer_lower:
            example = "There are 7 continents on Earth - like 7 big pieces of land surrounded by water!"
        elif "capital" in question.lower():
            example = f"{correct_answer} is where the government works, like the 'main office' of the country!"
        else:
            example = "Imagine looking at a map or globe - this is what you'd find there!"
    
    # English/Language examples  
    elif any(tag.lower() in ["english", "grammar", "language", "reading"] for tag in concept_tags):
        example = f"Using '{correct_answer}' correctly helps people understand what you're trying to say!"
    
    # Default example if no specific match
    if not example:
        example = f"Remember: '{correct_answer}' is important because it helps you understand {concepts_str} better!"
    
    # Generate a helpful tip/hint
    tips = [
        f"💡 Tip: When you see questions about {concepts_str}, take your time and think carefully!",
        f"💡 Tip: Try to remember: {correct_answer.split()[0] if len(correct_answer.split()) > 0 else correct_answer} is key here!",
        "💡 Tip: Read each option carefully before selecting your answer.",
        f"💡 Tip: A good strategy is to think about what you already know about {concepts_str}."
    ]
    
    return AIExplanation(
        encouragement=random.choice(encouragements),
        explanation=explanation,
        example=example,
        tip=random.choice(tips)
    )
