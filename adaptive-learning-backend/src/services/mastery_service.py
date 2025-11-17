from pymongo import MongoClient
from bson.objectid import ObjectId

class MasteryService:
    def __init__(self, db_url: str, db_name: str):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]
        self.mastery_collection = self.db['mastery_levels']

    def get_mastery_level(self, student_id: str):
        mastery = self.mastery_collection.find_one({"student_id": student_id})
        return mastery if mastery else {"student_id": student_id, "levels": {}}

    def update_mastery_level(self, student_id: str, concept_id: str, level: int):
        self.mastery_collection.update_one(
            {"student_id": student_id},
            {"$set": {f"levels.{concept_id}": level}},
            upsert=True
        )

    def schedule_review(self, student_id: str, concept_id: str):
        # Logic to schedule a review for the concept
        pass

    def mark_concept_mastered(self, student_id: str, concept_id: str):
        self.update_mastery_level(student_id, concept_id, 1)  # Assuming 1 indicates mastery

    def close(self):
        self.client.close()