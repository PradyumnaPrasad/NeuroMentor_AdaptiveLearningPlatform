from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "adaptive_learning"
    gemini_api_key: str = ""
    epsilon_start: float = 1.0
    epsilon_end: float = 0.1
    epsilon_decay: float = 0.995
    learning_rate: float = 0.001
    batch_size: int = 32
    replay_buffer_size: int = 10000
    target_update_frequency: int = 1000
    model_save_path: str = "data/models/dqn_model.pth"
    allow_origins: List[str] = ["http://localhost:5173", "http://localhost:3000", "*"]
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()
