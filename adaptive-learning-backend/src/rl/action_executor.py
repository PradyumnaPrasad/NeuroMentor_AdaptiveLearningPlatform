from typing import Any, Dict, Tuple, List
import random

class ActionExecutor:
    def __init__(self, gemini_service, mastery_service):
        self.gemini_service = gemini_service
        self.mastery_service = mastery_service

    def execute_action(self, action: str, student_id: str, question_id: str, **kwargs) -> Dict[str, Any]:
        if action == "show_explanation":
            return self.show_explanation(question_id)
        elif action == "generate_question":
            return self.generate_question(kwargs.get("difficulty", "easy"))
        elif action == "mark_mastered":
            return self.mark_mastered(student_id, question_id)
        elif action == "schedule_review":
            return self.schedule_review(student_id, question_id)
        else:
            return {"error": "Invalid action"}

    def show_explanation(self, question_id: str) -> Dict[str, Any]:
        explanation = self.gemini_service.get_explanation(question_id)
        return {"explanation": explanation}

    async def generate_question(self, difficulty: str, class_level: int = 5, concept_tags: List[str] = None) -> Dict[str, Any]:
        # Use the difficulty as provided without mapping
        # The difficulty is already set correctly in the frontend with progressive pattern
        
        # Use concept tags to create relevant topic
        topic = " ".join(concept_tags) if concept_tags else "general"
        
        question = await self.gemini_service.generate_question(topic, difficulty, class_level)
        return {"question": question}

    def mark_mastered(self, student_id: str, question_id: str) -> Dict[str, Any]:
        self.mastery_service.update_mastery(student_id, question_id, mastered=True)
        return {"status": "mastered", "question_id": question_id}

    def schedule_review(self, student_id: str, question_id: str) -> Dict[str, Any]:
        self.mastery_service.schedule_review(student_id, question_id)
        return {"status": "review scheduled", "question_id": question_id}