from typing import Tuple, List
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from collections import deque
import random
import os

class QNetwork(nn.Module):
    def __init__(self, input_dim: int, output_dim: int):
        super(QNetwork, self).__init__()
        self.fc1 = nn.Linear(input_dim, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 32)
        self.output = nn.Linear(32, output_dim)
        self.dropout = nn.Dropout(0.2)
        self.relu = nn.ReLU()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.relu(self.fc2(x))
        x = self.dropout(x)
        x = self.relu(self.fc3(x))
        return self.output(x)

class ReplayBuffer:
    def __init__(self, max_size: int):
        self.buffer = deque(maxlen=max_size)

    def add(self, experience: Tuple):
        self.buffer.append(experience)

    def sample(self, batch_size: int) -> List[Tuple]:
        return random.sample(self.buffer, batch_size)

    def size(self) -> int:
        return len(self.buffer)

class AdaptiveQNetwork:
    def __init__(self, input_dim: int, output_dim: int, learning_rate: float):
        self.q_network = QNetwork(input_dim, output_dim)
        self.target_network = QNetwork(input_dim, output_dim)
        self.optimizer = optim.Adam(self.q_network.parameters(), lr=learning_rate)
        self.replay_buffer = ReplayBuffer(max_size=10000)
        self.epsilon = 1.0
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01
        self.gamma = 0.99
        self.batch_size = 32
        self.update_target_every = 10
        self.training_step = 0

    def select_action(self, state: np.ndarray) -> int:
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.q_network.output.out_features)
        state_tensor = torch.FloatTensor(state).unsqueeze(0)
        q_values = self.q_network(state_tensor)
        return torch.argmax(q_values).item()

    def train(self):
        if self.replay_buffer.size() < self.batch_size:
            return

        batch = self.replay_buffer.sample(self.batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)

        states_tensor = torch.FloatTensor(states)
        actions_tensor = torch.LongTensor(actions).unsqueeze(1)
        rewards_tensor = torch.FloatTensor(rewards)
        next_states_tensor = torch.FloatTensor(next_states)
        dones_tensor = torch.FloatTensor(dones)

        q_values = self.q_network(states_tensor).gather(1, actions_tensor)
        next_q_values = self.target_network(next_states_tensor).max(1)[0]
        target_q_values = rewards_tensor + (self.gamma * next_q_values * (1 - dones_tensor))

        loss = nn.MSELoss()(q_values, target_q_values.unsqueeze(1))
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()

        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

        if self.training_step % self.update_target_every == 0:
            self.target_network.load_state_dict(self.q_network.state_dict())

        self.training_step += 1

    def save_model(self, filepath: str):
        torch.save(self.q_network.state_dict(), filepath)

    def load_model(self, filepath: str):
        if os.path.exists(filepath):
            self.q_network.load_state_dict(torch.load(filepath))
            self.target_network.load_state_dict(torch.load(filepath))

def train_loop(agent: AdaptiveQNetwork, num_episodes: int):
    for episode in range(num_episodes):
        state = ...  # Initialize state
        done = False
        while not done:
            action = agent.select_action(state)
            next_state, reward, done = ...  # Environment step
            agent.replay_buffer.add((state, action, reward, next_state, done))
            agent.train()
            state = next_state

        if episode % 10 == 0:
            agent.save_model(f"model_episode_{episode}.pth")