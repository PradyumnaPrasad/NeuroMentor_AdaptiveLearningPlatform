from fastapi import HTTPException
from src.services.gemini_service import GeminiService

def test_gemini_service_get_explanation(mocker):
    mock_response = {"explanation": "This is a mock explanation."}
    mocker.patch.object(GeminiService, 'get_explanation', return_value=mock_response)

    service = GeminiService()
    response = service.get_explanation("sample_question")

    assert response == mock_response
    assert "explanation" in response

def test_gemini_service_get_question(mocker):
    mock_response = {"question": "What is the capital of France?", "options": ["Paris", "London", "Berlin"]}
    mocker.patch.object(GeminiService, 'get_question', return_value=mock_response)

    service = GeminiService()
    response = service.get_question("sample_topic")

    assert response == mock_response
    assert "question" in response
    assert "options" in response

def test_gemini_service_error_handling(mocker):
    mocker.patch.object(GeminiService, 'get_explanation', side_effect=HTTPException(status_code=500, detail="Internal Server Error"))

    service = GeminiService()
    
    try:
        service.get_explanation("sample_question")
    except HTTPException as e:
        assert e.status_code == 500
        assert e.detail == "Internal Server Error"