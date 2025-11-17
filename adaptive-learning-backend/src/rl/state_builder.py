from typing import List
import numpy as np

class StateBuilder:
    def __init__(self, max_length: int):
        self.max_length = max_length

    def build_state_vector(self, student_features: List[float], question_features: List[float]) -> np.ndarray:
        state_vector = np.concatenate((student_features, question_features))
        state_vector = self._normalize_and_pad(state_vector)
        return state_vector

    def _normalize_and_pad(self, state_vector: np.ndarray) -> np.ndarray:
        norm_state = (state_vector - np.mean(state_vector)) / (np.std(state_vector) + 1e-8)
        if len(norm_state) < self.max_length:
            padding = np.zeros(self.max_length - len(norm_state))
            norm_state = np.concatenate((norm_state, padding))
        return norm_state[:self.max_length]  # Ensure fixed size
