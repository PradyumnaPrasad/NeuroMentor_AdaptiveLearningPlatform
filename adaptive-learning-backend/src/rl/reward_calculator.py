from typing import Dict, Any

class RewardCalculator:
    def __init__(self):
        pass

    def calculate_reward(self, correctness: bool, action_type: str, adaptive_mode: bool, consecutive_fails: int) -> float:
        """
        Calculate the reward based on the student's answer correctness, action type, adaptive mode, and consecutive fails.

        Parameters:
        - correctness (bool): Whether the student's answer was correct.
        - action_type (str): The type of action taken (e.g., 'explanation', 'practice', 'review').
        - adaptive_mode (bool): Whether the adaptive learning mode is active.
        - consecutive_fails (int): The number of consecutive incorrect answers.

        Returns:
        - float: The calculated reward.
        """
        base_reward = 1.0 if correctness else -1.0
        action_bonus = self._get_action_bonus(action_type)
        fail_penalty = self._get_fail_penalty(consecutive_fails)

        reward = base_reward + action_bonus + fail_penalty

        if adaptive_mode:
            reward *= 1.5  # Boost reward in adaptive mode

        return reward

    def _get_action_bonus(self, action_type: str) -> float:
        """
        Get the bonus for the action type.

        Parameters:
        - action_type (str): The type of action taken.

        Returns:
        - float: The bonus for the action type.
        """
        action_bonuses = {
            'explanation': 0.5,
            'practice': 1.0,
            'review': 0.2,
            'mastery': 0.3
        }
        return action_bonuses.get(action_type, 0.0)

    def _get_fail_penalty(self, consecutive_fails: int) -> float:
        """
        Get the penalty for consecutive fails.

        Parameters:
        - consecutive_fails (int): The number of consecutive incorrect answers.

        Returns:
        - float: The penalty for consecutive fails.
        """
        return -0.5 * consecutive_fails if consecutive_fails > 0 else 0.0