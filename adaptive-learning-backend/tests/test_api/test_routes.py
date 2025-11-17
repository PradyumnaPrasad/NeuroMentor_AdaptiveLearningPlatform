from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_submit_answer():
    response = client.post("/api/student/submit_answer", json={"student_id": "123", "answer": "A"})
    assert response.status_code == 200
    assert "action" in response.json()

def test_initiate_practice_mode():
    response = client.post("/api/practice/initiate", json={"student_id": "123"})
    assert response.status_code == 200
    assert "practice_question" in response.json()

def test_update_mastery():
    response = client.post("/api/mastery/update", json={"student_id": "123", "concept": "Math", "mastered": True})
    assert response.status_code == 200
    assert response.json() == {"message": "Mastery updated successfully"}

def test_schedule_review():
    response = client.post("/api/mastery/schedule_review", json={"student_id": "123", "concept": "Math"})
    assert response.status_code == 200
    assert response.json() == {"message": "Review scheduled successfully"}