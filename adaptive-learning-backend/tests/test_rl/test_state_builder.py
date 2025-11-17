from src.rl.state_builder import StateBuilder

def test_state_vector_construction():
    student_features = {
        'student_id': '123',
        'mastery_levels': {'math': 0.8, 'science': 0.5},
        'previous_answers': [1, 0, 1]
    }
    
    question_features = {
        'question_id': 'q1',
        'difficulty': 0.7,
        'topic': 'math'
    }
    
    state_builder = StateBuilder()
    state_vector = state_builder.construct_state_vector(student_features, question_features)
    
    assert len(state_vector) == expected_length  # Replace with the expected length of the state vector
    assert state_vector[0] == student_features['student_id']  # Example check
    assert state_vector[1] == question_features['difficulty']  # Example check

def test_state_vector_normalization():
    raw_state_vector = [0.5, 0.2, 0.9]  # Example raw state vector
    normalized_vector = StateBuilder.normalize_state_vector(raw_state_vector)
    
    assert all(0 <= value <= 1 for value in normalized_vector)  # Ensure normalization is correct

def test_state_vector_padding():
    state_vector = [0.1, 0.2]  # Example state vector
    padded_vector = StateBuilder.pad_state_vector(state_vector, target_length=5)
    
    assert len(padded_vector) == 5  # Ensure the padded vector has the correct length
    assert padded_vector[:2] == state_vector  # Ensure original values are preserved
    assert padded_vector[2:] == [0] * 3  # Ensure padding is correct