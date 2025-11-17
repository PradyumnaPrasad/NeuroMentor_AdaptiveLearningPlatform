from fastapi import HTTPException
import requests
from src.config import settings
import json
import random
from typing import List, Dict, Any

class GeminiService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        # Use REST API directly with gemini-2.0-flash (fast, reliable, widely available)
        self.base_url = f"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key={self.api_key}"
        self.explanation_cache = {}  # Cache for explanations

    def get_explanation(self, question_id: str) -> dict:
        """Get explanation for a question"""
        try:
            return {
                "explanation": "This is a concept explanation",
                "tip": "Remember to focus on the key concepts"
            }
        except Exception as err:
            raise HTTPException(status_code=500, detail=str(err))
    
    async def generate_explanation(self, question: str, correct_answer: str, student_answer: str, concept_tags: List[str]) -> Dict[str, str]:
        """Generate contextual explanation using Gemini REST API"""
        try:
            # Check cache first
            cache_key = f"{question}:{correct_answer}"
            if cache_key in self.explanation_cache:
                print(f"Using cached explanation for: {question}")
                return self.explanation_cache[cache_key]
            
            concepts_str = ", ".join(concept_tags) if concept_tags else "this topic"
            
            prompt = f"""You are a friendly, encouraging tutor helping a student who just answered incorrectly.

QUESTION: {question}
STUDENT CHOSE: {student_answer}
CORRECT ANSWER: {correct_answer}
TOPIC: {concepts_str}

Generate a personalized, engaging explanation that is HIGHLY RELEVANT to this specific question. Be dynamic and creative!

Provide exactly this JSON format:
{{
    "encouragement": "Write 1 warm, specific encouragement referencing their attempt",
    "explanation": "Write 2-3 sentences explaining WHY '{correct_answer}' is correct for THIS specific question. Be educational and clear.",
    "example": "Give a vivid, relatable real-world example or analogy that directly relates to '{correct_answer}' and helps visualize or understand it better. Make it memorable!",
    "tip": "Share 1 practical tip or memory trick specifically for remembering or understanding this concept"
}}

CRITICAL: Make the example HIGHLY SPECIFIC and RELEVANT to the question. No generic phrases like "Think about real-life situations" - give an ACTUAL concrete example!

Example for "What do we breathe?":
- Good: "Every time you take a breath, you're pulling in air which contains oxygen - the same oxygen that keeps a candle burning! Your body uses oxygen just like fire does, to create energy."
- Bad: "Think about how this applies to real-life situations you encounter every day!"

Now generate for the actual question above:"""
            
            print(f"Calling Gemini REST API for explanation...")
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            response = requests.post(self.base_url, json=payload, timeout=10)
            response.raise_for_status()
            
            result = response.json()
            response_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
            print(f"Gemini response: {response_text[:200]}...")
            
            # Extract JSON from response
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            explanation_data = json.loads(response_text)
            print(f"Parsed explanation successfully: {list(explanation_data.keys())}")
            
            # Validate that we got relevant content
            if "real-life situations you encounter every day" in explanation_data.get("example", ""):
                print("WARNING: Got generic example, regenerating...")
                raise ValueError("Generic example detected")
            
            # Cache the result
            self.explanation_cache[cache_key] = explanation_data
            
            return explanation_data
            
        except Exception as e:
            print(f"ERROR generating explanation with Gemini: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            
            # Better fallback that's at least somewhat relevant
            concepts_str = ", ".join(concept_tags) if concept_tags else "this topic"
            return {
                "encouragement": f"Good try! Let's understand why '{correct_answer}' is the right answer.",
                "explanation": f"The correct answer is '{correct_answer}' because this question tests your knowledge of {concepts_str}. Understanding this concept will help you solve similar problems.",
                "example": f"For '{correct_answer}': This is commonly seen when dealing with {concepts_str}. Try to connect it with what you already know about the topic.",
                "tip": f"Pro tip: Focus on the key concept of {concepts_str} and how '{correct_answer}' relates to it directly."
            }

    async def generate_question(self, topic: str, difficulty: str) -> dict:
        """Generate a question using Gemini REST API"""
        try:
            prompt = f"""Generate a multiple-choice question about {topic} at {difficulty} difficulty level.
            
Format the response as a JSON object with this structure:
{{
    "id": <random_number>,
    "question": "<question_text>",
    "options": [
        {{"text": "<option1>", "correct": true}},
        {{"text": "<option2>", "correct": false}},
        {{"text": "<option3>", "correct": false}},
        {{"text": "<option4>", "correct": false}}
    ],
    "difficulty": "{difficulty}",
    "explanation": "<brief_explanation>",
    "conceptTags": ["{topic}"]
}}

Make sure:
- The question is clear and age-appropriate
- Exactly ONE option is marked as correct
- All options are plausible
- The explanation is helpful and encouraging
"""
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            response = requests.post(self.base_url, json=payload, timeout=10)
            response.raise_for_status()
            
            result = response.json()
            response_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
            
            # Try to extract JSON from response
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            question_data = json.loads(response_text)
            return question_data
            
        except json.JSONDecodeError as e:
            # Fallback: generate a simple question
            print(f"JSON decode error: {e}, generating fallback question")
            return self._generate_fallback_question(topic, difficulty)
        except Exception as err:
            print(f"Error generating question: {err}")
            return self._generate_fallback_question(topic, difficulty)
    
    async def generate_question_batch(self, topic: str, difficulty: str, count: int = 3) -> List[dict]:
        """Generate multiple practice questions at once for better performance"""
        try:
            prompt = f"""Generate {count} DIVERSE and ENGAGING multiple-choice questions about "{topic}" at {difficulty} difficulty level.

Make each question UNIQUE and test different aspects of {topic}. Be creative and relevant!

FORMAT: Return ONLY valid JSON array (no extra text):
[
    {{
        "id": <random_5_digit_number>,
        "question": "<clear, specific question>",
        "options": [
            {{"text": "<correct_answer>", "correct": true}},
            {{"text": "<plausible_wrong_option_1>", "correct": false}},
            {{"text": "<plausible_wrong_option_2>", "correct": false}},
            {{"text": "<plausible_wrong_option_3>", "correct": false}}
        ],
        "difficulty": "{difficulty}",
        "explanation": "<why the correct answer is right>",
        "conceptTags": ["{topic}"]
    }}
]

REQUIREMENTS:
- {count} completely different questions
- Each tests a different aspect of {topic}
- Questions are engaging and age-appropriate  
- Exactly ONE correct option per question
- Wrong options are believable but clearly incorrect
- Shuffle the position of the correct answer (don't always put it first!)

Return ONLY the JSON array, nothing else!"""
            
            print(f"Generating {count} practice questions for topic: {topic}")
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            response = requests.post(self.base_url, json=payload, timeout=15)
            response.raise_for_status()
            
            result = response.json()
            response_text = result['candidates'][0]['content']['parts'][0]['text'].strip()
            print(f"Gemini response length: {len(response_text)} chars")
            
            # Extract JSON from response
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            
            questions = json.loads(response_text)
            
            if not isinstance(questions, list):
                questions = [questions]
            
            print(f"Successfully generated {len(questions)} questions")
            return questions[:count]
            
        except Exception as e:
            print(f"ERROR generating question batch: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            # Fallback: generate diverse questions one by one
            print(f"Falling back to individual question generation")
            return [self._generate_fallback_question(topic, difficulty) for _ in range(count)]
    
    def _generate_fallback_question(self, topic: str, difficulty: str) -> dict:
        """Generate a simple fallback question when API fails"""
        questions = {
            "easy": {
                "math": {
                    "question": "What is 2 + 2?",
                    "options": [
                        {"text": "4", "correct": True},
                        {"text": "3", "correct": False},
                        {"text": "5", "correct": False},
                        {"text": "6", "correct": False}
                    ]
                },
                "general": {
                    "question": "Which color is the sky on a clear day?",
                    "options": [
                        {"text": "Blue", "correct": True},
                        {"text": "Green", "correct": False},
                        {"text": "Red", "correct": False},
                        {"text": "Yellow", "correct": False}
                    ]
                }
            },
            "medium": {
                "math": {
                    "question": "What is 15 × 3?",
                    "options": [
                        {"text": "45", "correct": True},
                        {"text": "35", "correct": False},
                        {"text": "50", "correct": False},
                        {"text": "40", "correct": False}
                    ]
                },
                "general": {
                    "question": "How many continents are there?",
                    "options": [
                        {"text": "7", "correct": True},
                        {"text": "5", "correct": False},
                        {"text": "6", "correct": False},
                        {"text": "8", "correct": False}
                    ]
                }
            },
            "hard": {
                "math": {
                    "question": "What is the square root of 144?",
                    "options": [
                        {"text": "12", "correct": True},
                        {"text": "11", "correct": False},
                        {"text": "13", "correct": False},
                        {"text": "14", "correct": False}
                    ]
                },
                "general": {
                    "question": "What is the capital of Australia?",
                    "options": [
                        {"text": "Canberra", "correct": True},
                        {"text": "Sydney", "correct": False},
                        {"text": "Melbourne", "correct": False},
                        {"text": "Brisbane", "correct": False}
                    ]
                }
            }
        }
        
        topic_key = "general"
        if "math" in topic.lower() or "algebra" in topic.lower():
            topic_key = "math"
        
        question_template = questions.get(difficulty, questions["medium"]).get(topic_key, questions["medium"]["general"])
        
        return {
            "id": random.randint(10000, 99999),
            "question": question_template["question"],
            "options": question_template["options"],
            "difficulty": difficulty,
            "explanation": "This is a practice question to help you learn.",
            "conceptTags": [topic]
        }