from fastapi import HTTPException
import requests
from src.config import settings
import json
import random
import time
from typing import List, Dict, Any

class GeminiService:
    def __init__(self):
        self.api_key = settings.gemini_api_key
        # Use gemini-2.5-flash (latest model with good free tier)
        self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
        self.explanation_cache = {}  # Cache for explanations
        self.last_request_time = 0  # Track last API call for rate limiting

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

    async def generate_question(self, topic: str, difficulty: str, class_level: int = 5, subject_type: str = 'math') -> dict:
        """Generate a question using Gemini REST API"""
        try:
            # Use explicit subject type instead of detection
            is_math_topic = (subject_type == 'math')
            
            # Adjust difficulty description based on class level
            grade_descriptions = {
                1: "very basic, suitable for first graders (ages 6-7)",
                2: "basic, suitable for second graders (ages 7-8)",
                3: "intermediate, suitable for third graders (ages 8-9)",
                4: "moderately challenging, suitable for fourth graders (ages 9-10)",
                5: "challenging, suitable for fifth graders (ages 10-11)"
            }
            
            grade_desc = grade_descriptions.get(class_level, "age-appropriate for elementary students")
            
            # SEPARATE PROMPTS FOR MATH AND SCIENCE
            if is_math_topic:
                # MATH-SPECIFIC QUESTION STYLES
                question_style_instructions = {
                    "easy": """
QUESTION FORMAT FOR EASY MATH:
- Use DIRECT, STRAIGHTFORWARD arithmetic format
- For multiplication: Single-digit × single-digit (use VARIED numbers from 2-9) OR Double-digit with simple numbers (one number 10-20, other 2-9)
- For addition: Simple direct addition (numbers from 5-50)
- For subtraction: Simple direct subtraction (numbers from 5-50)
- For division: Simple division with whole number results
- Keep it simple and clear - NO word problems, NO complex scenarios
- Just the basic arithmetic operation being tested directly
- IMPORTANT: Choose RANDOM numbers each time, never repeat the same numbers
- ONLY MATH - NO science concepts mixed in!""",
                    
                    "medium": """
QUESTION FORMAT FOR MEDIUM MATH:
- Use SIMPLE CONTEXTUAL WORD PROBLEMS with easy arithmetic
- Simple word problems with EASY single-digit operations
- Use creative scenarios: children collecting items, arranging objects, sharing things
- Keep numbers SIMPLE: single digits (2-9) for multiplication
- Use DIFFERENT numbers each time - avoid repeating combinations
- Use relatable, everyday scenarios
- One-step problems with context
- IMPORTANT: Create UNIQUE scenarios, not generic "bags with items" - be creative!
- ONLY MATH - NO science concepts mixed in!""",
                    
                    "hard": """
QUESTION FORMAT FOR HARD MATH:
- Use WORD PROBLEMS with slightly harder arithmetic
- Word problems with moderate operations
- For multiplication: One number single-digit (5-9), other small double-digit (10-20), results under 150
- Use VARIED scenarios: shops, farms, schools, parties, sports
- Use realistic scenarios that a child can visualize
- ONE-STEP problems only, not multi-step
- IMPORTANT: Use DIFFERENT number combinations each time - vary both numbers and context
- ONLY MATH - NO science concepts mixed in!"""
                }
            else:
                # SCIENCE-SPECIFIC QUESTION STYLES
                question_style_instructions = {
                    "easy": """
QUESTION FORMAT FOR EASY SCIENCE:
- Simple factual questions about basic science concepts
- Focus on: plants, animals, weather, human body, water, air, earth, sun, moon
- Direct questions like "What do plants need to grow?" or "Where do fish live?"
- NO MATH, NO NUMBERS, NO CALCULATIONS
- Keep it simple and clear - just testing basic science knowledge
- Use age-appropriate vocabulary
- Focus on observable facts and everyday science""",
                    
                    "medium": """
QUESTION FORMAT FOR MEDIUM SCIENCE:
- Scenario-based questions about science concepts
- Topics: plants, animals, weather, ecosystems, life cycles, simple machines, states of matter
- Use relatable scenarios: "A plant in the garden...", "When you see clouds..."
- Questions that require simple reasoning and understanding
- NO MATH, NO NUMBERS, NO CALCULATIONS
- One-step reasoning problems
- Connect to real-world observations""",
                    
                    "hard": """
QUESTION FORMAT FOR HARD SCIENCE:
- Questions requiring deeper understanding and reasoning
- Topics: food chains, adaptation, habitats, photosynthesis, water cycle, energy, simple experiments
- Scenarios that require cause-and-effect thinking
- "Why" and "How" questions that test understanding
- NO MATH, NO NUMBERS, NO CALCULATIONS
- Use realistic scenarios children can understand
- Test conceptual understanding, not memorization"""
                }
            
            style_guide = question_style_instructions.get(difficulty, question_style_instructions["medium"])
            
            # Add randomization to ensure unique questions each time
            import time
            import random as rand
            random_seed = int(time.time() * 1000) % 10000
            unique_id = f"{random_seed}-{rand.randint(1000, 9999)}"
            
            # Generate diverse number ranges and scenarios
            sample_numbers = rand.sample(range(2, 20), 4)
            sample_names = rand.choice([
                ["Sarah", "Tom", "Maria", "Alex"],
                ["Emma", "Jack", "Lily", "Noah"],
                ["Sophia", "Oliver", "Ava", "Liam"]
            ])
            sample_objects = rand.choice([
                ["apples", "oranges", "bananas", "mangoes"],
                ["pencils", "erasers", "crayons", "markers"],
                ["cookies", "candies", "cupcakes", "donuts"],
                ["books", "toys", "balls", "cards"]
            ])
            
            # Build appropriate prompt based on subject type and difficulty
            if is_math_topic:
                if difficulty == 'easy':
                    # EASY = NO word problems, just direct arithmetic
                    subject_guidance = f"""MATH SUBJECT REQUIREMENTS FOR EASY:
- This is a DIRECT ARITHMETIC question about {topic}
- Use ONLY the arithmetic operation - NO stories, NO scenarios, NO context
- Example format: "What is 5 × 3?" or "Calculate 12 + 8"
- Use VARIED numbers: {sample_numbers[0]}, {sample_numbers[1]}, {sample_numbers[2]}, {sample_numbers[3]} (choose different ones)
- All answer options should be NUMBERS
- ABSOLUTELY NO WORD PROBLEMS - just the math operation
- DO NOT mix in science concepts - keep it pure math!

HINT REQUIREMENT FOR EASY MATH:
- Provide a tip or strategy (e.g., "Break it down: 12 = 10 + 2")
- Keep hints SHORT and CLEAR (1-2 sentences max)"""
                else:
                    # MEDIUM/HARD = Word problems allowed
                    subject_guidance = f"""MATH SUBJECT REQUIREMENTS:
- This is a MATH question about {topic}
- Use NUMBERS and ARITHMETIC OPERATIONS in a word problem
- Use VARIED numbers: {sample_numbers[0]}, {sample_numbers[1]}, {sample_numbers[2]}, {sample_numbers[3]} (choose different ones)
- Use DIFFERENT names: {sample_names[0]}, {sample_names[1]}, {sample_names[2]}, or create new ones
- Use DIFFERENT objects/items: {sample_objects[0]}, {sample_objects[1]}, {sample_objects[2]}, or invent new ones
- Create UNIQUE scenarios (not just "bags with apples" or "tables with chairs")
- All answer options should be NUMBERS
- DO NOT mix in science concepts - keep it pure math!

HINT REQUIREMENT FOR MATH:
- For word problems: show how to convert to simple arithmetic (e.g., "5 bags with 3 apples each" → "Think: 5 × 3 = ?")
- Keep hints SHORT and CLEAR (1-2 sentences max)"""
            else:
                subject_guidance = f"""SCIENCE SUBJECT REQUIREMENTS:
- This is a PURE SCIENCE question about {topic}
- Focus on scientific concepts, facts, and understanding
- NO MATH, NO NUMBERS, NO CALCULATIONS at all!
- Use science vocabulary appropriate for Class {class_level}
- Answer options should be science concepts/facts, NOT numbers
- Make it about real-world science observations
- DO NOT mix in math operations - keep it pure science!

HINT REQUIREMENT FOR SCIENCE:
- Give a memory aid or key concept hint
- Help them recall the scientific principle
- Connect to real-world examples they can observe
- Keep hints SHORT and CLEAR (1-2 sentences max)"""
            
            prompt = f"""Generate a UNIQUE and CREATIVE multiple-choice question about {topic} at {difficulty} difficulty level for a Class {class_level} student ({grade_desc}).

UNIQUENESS REQUIREMENT - CRITICAL:
- Make this question COMPLETELY DIFFERENT from typical examples shown
- Create UNIQUE scenarios
- Unique ID for this question: {unique_id}
- DO NOT repeat the example questions shown in the format guide - CREATE NEW ONES!
            
CRITICAL REQUIREMENTS:
- The question MUST be directly about {topic} only
- Stay 100% focused on {topic} concepts
- Generate DIVERSE questions - avoid repetitive patterns

{subject_guidance}

{style_guide}

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
    "hint": "<simplified_hint_that_helps_solve>",
    "conceptTags": ["{topic}"]
}}

Make sure:
- Follow the question format style for {difficulty} difficulty EXACTLY as described above
- The question is DIRECTLY about {topic} - no unrelated topics
- {"PURE MATH with numbers and operations - NO science concepts!" if is_math_topic else "PURE SCIENCE with concepts - NO math or numbers!"}
- The question is appropriate for a Class {class_level} student
- Use vocabulary and concepts suitable for their grade level
- Exactly ONE option is marked as correct
- All options are plausible but clearly distinguishable
- The explanation is helpful, encouraging, and uses simple language
- The hint simplifies the problem without giving away the answer
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
            return self._generate_fallback_question(topic, difficulty, subject_type)
        except Exception as err:
            print(f"Error generating question: {err}")
            return self._generate_fallback_question(topic, difficulty, subject_type)
    
    async def generate_question_batch(self, topic: str, difficulty: str, count: int = 3, class_level: int = 5, subject_type: str = 'math') -> List[dict]:
        """Generate multiple practice questions at once for better performance"""
        try:
            # Use explicit subject type instead of detection
            is_math_topic = (subject_type == 'math')
            
            # Adjust difficulty description based on class level
            grade_descriptions = {
                1: "very basic, suitable for first graders (ages 6-7)",
                2: "basic, suitable for second graders (ages 7-8)",
                3: "intermediate, suitable for third graders (ages 8-9)",
                4: "moderately challenging, suitable for fourth graders (ages 9-10)",
                5: "challenging, suitable for fifth graders (ages 10-11)"
            }
            
            grade_desc = grade_descriptions.get(class_level, "age-appropriate for elementary students")
            
            # SEPARATE PROMPTS FOR MATH AND SCIENCE
            if is_math_topic:
                # MATH-SPECIFIC QUESTION STYLES
                question_style_instructions = {
                    "easy": "MATH: Use DIRECT arithmetic. For multiplication: single-digit × single-digit (RANDOM numbers 2-9) OR double-digit (one number 10-20, other 2-9). NO word problems. Use DIFFERENT numbers each time. ONLY MATH - NO science!",
                    "medium": "MATH: Use SIMPLE word problems with EASY single-digit operations. Both numbers 2-9 for multiplication. Create UNIQUE scenarios - vary context, names, objects. Use DIFFERENT number combinations. ONLY MATH - NO science!",
                    "hard": "MATH: Use word problems with moderate multiplication. One number 5-9, other 10-20. Results under 150. ONE-STEP problems. Create VARIED scenarios and DIFFERENT numbers. ONLY MATH - NO science!"
                }
            else:
                # SCIENCE-SPECIFIC QUESTION STYLES
                question_style_instructions = {
                    "easy": "SCIENCE: Simple factual questions about basic science concepts (plants, animals, weather, human body, water, air). Direct questions. NO MATH, NO NUMBERS, NO CALCULATIONS. Just testing science knowledge.",
                    "medium": "SCIENCE: Scenario-based questions about science (ecosystems, life cycles, simple machines, states of matter). Use relatable scenarios. Simple reasoning. NO MATH, NO NUMBERS. Connect to real-world observations.",
                    "hard": "SCIENCE: Questions requiring deeper understanding (food chains, adaptation, photosynthesis, water cycle, energy). Cause-and-effect thinking. 'Why' and 'How' questions. NO MATH, NO NUMBERS. Test conceptual understanding."
                }
            
            style_guide = question_style_instructions.get(difficulty, question_style_instructions["medium"])
            
            # Add strong randomization for batch generation
            import time
            import random as rand
            batch_id = f"{int(time.time() * 1000)}-{rand.randint(1000, 9999)}"
            
            # Generate diverse suggestions for variety
            number_sets = [rand.sample(range(2, 15), 5) for _ in range(count)]
            name_options = [
                ["Sarah", "Tom", "Maria", "Alex", "Emily"],
                ["Jack", "Lily", "Noah", "Emma", "Oliver"],
                ["Sophia", "Liam", "Ava", "Lucas", "Mia"],
                ["Ben", "Zoe", "Ryan", "Chloe", "Max"]
            ]
            object_options = [
                ["apples", "oranges", "bananas", "grapes", "mangoes"],
                ["pencils", "erasers", "books", "notebooks", "pens"],
                ["cookies", "candies", "cupcakes", "brownies", "donuts"],
                ["toys", "balls", "cards", "puzzles", "games"],
                ["flowers", "trees", "plants", "seeds", "leaves"]
            ]
            
            # Build appropriate prompt based on subject type and difficulty
            if is_math_topic:
                if difficulty == 'easy':
                    # EASY = NO word problems, just direct arithmetic
                    subject_guidance = f"""MATH SUBJECT REQUIREMENTS FOR BATCH (EASY):
- These are DIRECT ARITHMETIC questions about {topic}
- Use ONLY the arithmetic operation - NO stories, NO scenarios, NO context
- Example format: "What is 5 × 3?" or "Calculate 12 + 8"
- Suggested number sets: {number_sets}
- DO NOT repeat numbers across questions
- All answer options should be NUMBERS
- ABSOLUTELY NO WORD PROBLEMS - just the math operation
- DO NOT mix in science concepts - keep it pure math!

HINT REQUIREMENT FOR EASY MATH QUESTIONS:
- Provide a tip or strategy (e.g., "Break it down: 12 = 10 + 2")
- Keep hints SHORT and CLEAR (1-2 sentences max)"""
                else:
                    # MEDIUM/HARD = Word problems allowed
                    subject_guidance = f"""MATH SUBJECT REQUIREMENTS FOR BATCH:
- These are MATH questions about {topic}
- Use NUMBERS and ARITHMETIC OPERATIONS in word problems
- Suggested number sets: {number_sets}
- Suggested names: {rand.choice(name_options)}
- Suggested objects: {rand.choice(object_options)}
- DO NOT repeat numbers, names, objects, or scenarios across questions
- All answer options should be NUMBERS
- DO NOT mix in science concepts - keep it pure math!

HINT REQUIREMENT FOR MATH QUESTIONS:
- For word problems: show how to convert to simple arithmetic (e.g., "5 bags with 3 apples each" → "Think: 5 × 3 = ?")
- Keep hints SHORT and CLEAR (1-2 sentences max)"""
            else:
                subject_guidance = f"""SCIENCE SUBJECT REQUIREMENTS FOR BATCH:
- These are PURE SCIENCE questions about {topic}
- Focus on scientific concepts, facts, and understanding
- NO MATH, NO NUMBERS, NO CALCULATIONS at all!
- Use science vocabulary appropriate for Class {class_level}
- Answer options should be science concepts/facts, NOT numbers
- Make questions about real-world science observations
- DO NOT mix in math operations - keep it pure science!

HINT REQUIREMENT FOR SCIENCE QUESTIONS:
- Give a memory aid or key concept hint
- Help them recall the scientific principle
- Connect to real-world examples they can observe
- Keep hints SHORT and CLEAR (1-2 sentences max)"""
            
            prompt = f"""Generate {count} COMPLETELY DIFFERENT and UNIQUE multiple-choice questions about "{topic}" at {difficulty} difficulty level for Class {class_level} students ({grade_desc}).

CRITICAL UNIQUENESS REQUIREMENTS:
- Each question MUST be COMPLETELY DIFFERENT from the others
- Use DIFFERENT contexts for each question
- Batch ID: {batch_id}
- CREATE UNIQUE SCENARIOS - NOT JUST THE EXAMPLES!

{subject_guidance}

QUESTION FORMAT REQUIREMENT:
{style_guide}

Each question should be in this JSON format:
[{{
    "id": <unique_number>,
    "question": "<question_text>",
    "options": [
        {{"text": "<option1>", "correct": true}},
        {{"text": "<option2>", "correct": false}},
        {{"text": "<option3>", "correct": false}},
        {{"text": "<option4>", "correct": false}}
    ],
    "difficulty": "{difficulty}",
    "explanation": "<brief_explanation>",
    "hint": "<simplified_hint_that_helps_solve>",
    "conceptTags": ["{topic}"]
}}]

Requirements:
- Generate EXACTLY {count} different questions ALL about {topic}
- {"PURE MATH with numbers and operations - NO science concepts!" if is_math_topic else "PURE SCIENCE with concepts - NO math or numbers!"}
- Each question appropriate for Class {class_level} students - use simple language and grade-appropriate concepts
- Use vocabulary suitable for their grade level
- Questions should be challenging but achievable for their age
- Each question must have exactly ONE correct answer
- Make questions engaging and varied in style
- Explanations should be encouraging and use simple language
- Each question MUST have a helpful hint that simplifies without revealing the answer
- ALL questions must stay on the topic of {topic} - no unrelated content

Return ONLY the JSON array, no additional text.
"""
            
            print(f"Generating {count} practice questions for topic: {topic}")
            
            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            
            # Add delay between requests to avoid rate limiting (free tier: 15 RPM)
            current_time = time.time()
            time_since_last = current_time - self.last_request_time
            if time_since_last < 4:  # Wait at least 4 seconds between requests
                sleep_time = 4 - time_since_last
                print(f"⏳ Rate limit protection: waiting {sleep_time:.1f}s...")
                time.sleep(sleep_time)
            self.last_request_time = time.time()
            
            # Retry logic with longer exponential backoff
            max_retries = 3
            retry_delay = 10  # Start with 10s (was 2s)
            response = None
            
            for attempt in range(max_retries):
                try:
                    response = requests.post(self.base_url, json=payload, timeout=15)
                    response.raise_for_status()
                    break  # Success
                except requests.exceptions.HTTPError as e:
                    if e.response.status_code == 429:  # Rate limit
                        if attempt < max_retries - 1:
                            # Exponential backoff with longer delays
                            wait_time = retry_delay * (2 ** attempt)
                            print(f"⚠️ Rate limited. Waiting {wait_time}s before retry {attempt + 1}/{max_retries}...")
                            time.sleep(wait_time)
                        else:
                            print(f"❌ Rate limit exceeded after {max_retries} attempts. Using fallback questions.")
                            raise
                    else:
                        raise
            
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
            return [self._generate_fallback_question(topic, difficulty, subject_type) for _ in range(count)]
    
    def _generate_fallback_question(self, topic: str, difficulty: str, subject_type: str = 'math') -> dict:
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
                    ],
                    "hint": "Count on your fingers: Start with 2, then add 2 more!"
                },
                "science": {
                    "question": "What do animals need to survive?",
                    "options": [
                        {"text": "Food and water", "correct": True},
                        {"text": "Only sunlight", "correct": False},
                        {"text": "Only air", "correct": False},
                        {"text": "Only shelter", "correct": False}
                    ],
                    "hint": "Think about what you need every day to stay healthy and alive."
                },
                "general": {
                    "question": "Which color is the sky on a clear day?",
                    "options": [
                        {"text": "Blue", "correct": True},
                        {"text": "Green", "correct": False},
                        {"text": "Red", "correct": False},
                        {"text": "Yellow", "correct": False}
                    ],
                    "hint": "Look outside on a sunny day and see what color you observe above you."
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
                    ],
                    "hint": "Break it down: 15 × 3 means 15 added three times (15 + 15 + 15)."
                },
                "science": {
                    "question": "Where do fish live?",
                    "options": [
                        {"text": "In water", "correct": True},
                        {"text": "On land", "correct": False},
                        {"text": "In trees", "correct": False},
                        {"text": "In the sky", "correct": False}
                    ],
                    "hint": "Think about where you see fish when you visit an aquarium or beach."
                },
                "general": {
                    "question": "How many continents are there?",
                    "options": [
                        {"text": "7", "correct": True},
                        {"text": "5", "correct": False},
                        {"text": "6", "correct": False},
                        {"text": "8", "correct": False}
                    ],
                    "hint": "Remember: Asia, Africa, North America, South America, Antarctica, Europe, Australia."
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
                    ],
                    "hint": "Think: What number times itself equals 144? (? × ? = 144)"
                },
                "science": {
                    "question": "What do plants need to make their own food?",
                    "options": [
                        {"text": "Sunlight, water, and air", "correct": True},
                        {"text": "Only soil", "correct": False},
                        {"text": "Only water", "correct": False},
                        {"text": "Only sunlight", "correct": False}
                    ],
                    "hint": "Remember photosynthesis needs three main ingredients from nature."
                },
                "general": {
                    "question": "What is the capital of Australia?",
                    "options": [
                        {"text": "Canberra", "correct": True},
                        {"text": "Sydney", "correct": False},
                        {"text": "Melbourne", "correct": False},
                        {"text": "Brisbane", "correct": False}
                    ],
                    "hint": "The capital is not the biggest city - it's a specially designed capital city."
                }
            }
        }
        
        # Use explicit subject type instead of detection
        topic_key = "math" if subject_type == "math" else "science"
        
        question_template = questions.get(difficulty, questions["medium"]).get(topic_key, questions["medium"]["general"])
        
        return {
            "id": random.randint(10000, 99999),
            "question": question_template["question"],
            "options": question_template["options"],
            "difficulty": difficulty,
            "explanation": "This is a practice question to help you learn.",
            "hint": question_template.get("hint", "Think carefully about what you know about this topic."),
            "conceptTags": [topic]
        }