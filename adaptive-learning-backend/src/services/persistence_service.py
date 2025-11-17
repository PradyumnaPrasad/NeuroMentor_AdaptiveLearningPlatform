from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import json
from src.config import settings

class PersistenceService:
    def __init__(self):
        self.client = AsyncIOMotorClient(settings.mongodb_url)
        self.db = self.client[settings.mongodb_db]
        self.mastery_collection = self.db["mastery_levels"]
        self.model_collection = self.db["model_states"]
        self.users_collection = self.db["users"]

    async def save_mastery_level(self, student_id, mastery_data):
        await self.mastery_collection.update_one(
            {"student_id": student_id},
            {"$set": mastery_data},
            upsert=True
        )

    async def load_mastery_level(self, student_id):
        mastery_data = await self.mastery_collection.find_one({"student_id": student_id})
        return mastery_data if mastery_data else {}

    async def save_model_state(self, model_id, model_state):
        await self.model_collection.update_one(
            {"model_id": model_id},
            {"$set": {"state": model_state}},
            upsert=True
        )

    async def load_model_state(self, model_id):
        model_data = await self.model_collection.find_one({"model_id": model_id})
        return model_data['state'] if model_data else None

    def close(self):
        self.client.close()

    # Add user-related methods
    async def find_user_by_email(self, email: str):
        return await self.users_collection.find_one({"email": email})

    async def create_user(self, user_data: dict):
        return await self.users_collection.insert_one(user_data)