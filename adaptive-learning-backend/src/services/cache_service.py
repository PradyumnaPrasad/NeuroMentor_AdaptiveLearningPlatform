from typing import Any, Dict
import time
import json
import redis

class CacheService:
    def __init__(self, redis_host: str, redis_port: int, redis_db: int):
        self.cache = redis.StrictRedis(host=redis_host, port=redis_port, db=redis_db, decode_responses=True)

    def set_cache(self, key: str, value: Any, expiration: int = 3600) -> None:
        self.cache.set(key, json.dumps(value), ex=expiration)

    def get_cache(self, key: str) -> Any:
        value = self.cache.get(key)
        return json.loads(value) if value else None

    def cache_gemini_response(self, key: str, response: Dict[str, Any]) -> None:
        self.set_cache(key, response)

    def get_cached_gemini_response(self, key: str) -> Dict[str, Any]:
        return self.get_cache(key)

    def clear_cache(self, key: str) -> None:
        self.cache.delete(key)

    def clear_all_cache(self) -> None:
        self.cache.flushdb()