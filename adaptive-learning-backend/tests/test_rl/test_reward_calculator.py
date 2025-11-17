from src.rl.reward_calculator import RewardCalculator
import pytest

@pytest.fixture
def reward_calculator():
    return RewardCalculator()

def test_correct_answer_reward(reward_calculator):
    action_type = "explanation"
    correctness = True
    adaptive_mode = "normal"
    consecutive_fails = 0
    expected_reward = 1.0  # Assuming a reward of 1 for correct answers

    reward = reward_calculator.calculate_reward(correctness, action_type, adaptive_mode, consecutive_fails)
    assert reward == expected_reward

def test_incorrect_answer_reward(reward_calculator):
    action_type = "practice"
    correctness = False
    adaptive_mode = "normal"
    consecutive_fails = 1
    expected_reward = -1.0  # Assuming a penalty of -1 for incorrect answers

    reward = reward_calculator.calculate_reward(correctness, action_type, adaptive_mode, consecutive_fails)
    assert reward == expected_reward

def test_consecutive_failures_penalty(reward_calculator):
    action_type = "review"
    correctness = False
    adaptive_mode = "normal"
    consecutive_fails = 3
    expected_reward = -3.0  # Assuming a penalty that scales with consecutive failures

    reward = reward_calculator.calculate_reward(correctness, action_type, adaptive_mode, consecutive_fails)
    assert reward == expected_reward

def test_action_type_reward(reward_calculator):
    action_type = "explanation"
    correctness = True
    adaptive_mode = "normal"
    consecutive_fails = 0
    expected_reward = 1.0  # Assuming a reward for correct action type

    reward = reward_calculator.calculate_reward(correctness, action_type, adaptive_mode, consecutive_fails)
    assert reward == expected_reward

def test_adaptive_mode_reward(reward_calculator):
    action_type = "practice"
    correctness = True
    adaptive_mode = "advanced"
    consecutive_fails = 0
    expected_reward = 1.5  # Assuming a higher reward for advanced mode

    reward = reward_calculator.calculate_reward(correctness, action_type, adaptive_mode, consecutive_fails)
    assert reward == expected_reward