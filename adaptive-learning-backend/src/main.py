from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routes import student, practice, mastery, learning, auth
from src.config import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(learning.router, prefix="/api/learning", tags=["learning"])
app.include_router(student.router, prefix="/api/students", tags=["students"])
app.include_router(practice.router, prefix="/api/practice", tags=["practice"])
app.include_router(mastery.router, prefix="/api/mastery", tags=["mastery"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Adaptive Learning API!"}