import torch
from torch import nn
import torch.optim as optim
import numpy as np
import random

class AdaptiveQNetwork:
    def __init__(self, state_size, action_size, learning_rate=0.001, replay_buffer_size=10000, batch_size=32):
        self.state_size = state_size
        self.action_size = action_size
        self.learning_rate = learning_rate
        self.replay_buffer_size = replay_buffer_size
        self.batch_size = batch_size
        
        self.q_network = QNetwork(state_size, action_size)
        self.target_network = QNetwork(state_size, action_size)
        self.optimizer = optim.Adam(self.q_network.parameters(), lr=self.learning_rate)
        self.replay_buffer = ReplayBuffer(replay_buffer_size)
        self.epsilon = 1.0
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01
        self.gamma = 0.99

    def update_epsilon(self):
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

    def select_action(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)
        state = torch.FloatTensor(state).unsqueeze(0)
        q_values = self.q_network(state)
        return torch.argmax(q_values).item()

    def store_experience(self, experience):
        self.replay_buffer.add(experience)

    def train(self):
        if len(self.replay_buffer) < self.batch_size:
            return
        
        minibatch = self.replay_buffer.sample(self.batch_size)
        for state, action, reward, next_state, done in minibatch:
            target = reward
            if not done:
                target += self.gamma * torch.max(self.target_network(torch.FloatTensor(next_state).unsqueeze(0))).item()
            target_f = self.q_network(torch.FloatTensor(state).unsqueeze(0))
            target_f[0][action] = target
            
            self.optimizer.zero_grad()
            loss = nn.MSELoss()(self.q_network(torch.FloatTensor(state).unsqueeze(0)), target_f)
            loss.backward()
            self.optimizer.step()

    def update_target_network(self):
        self.target_network.load_state_dict(self.q_network.state_dict())

class QNetwork(nn.Module):
    def __init__(self, state_size, action_size):
        super(QNetwork, self).__init__()
        self.fc1 = nn.Linear(state_size, 64)
        self.fc2 = nn.Linear(64, 64)
        self.fc3 = nn.Linear(64, action_size)
        self.dropout = nn.Dropout(0.2)
        
    def forward(self, x):
        x = nn.functional.relu(self.fc1(x))
        x = self.dropout(x)
        x = nn.functional.relu(self.fc2(x))
        x = self.dropout(x)
        return self.fc3(x)

class ReplayBuffer:
    def __init__(self, max_size):
        self.buffer = []
        self.max_size = max_size

    def add(self, experience):
        if len(self.buffer) >= self.max_size:
            self.buffer.pop(0)
        self.buffer.append(experience)

    def sample(self, batch_size):
        return random.sample(self.buffer, batch_size)

    def __len__(self):
        return len(self.buffer)