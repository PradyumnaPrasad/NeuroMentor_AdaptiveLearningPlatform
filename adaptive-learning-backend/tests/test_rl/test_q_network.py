from src.rl.q_network import QNetwork
import torch
import torch.nn as nn
import pytest

class TestQNetwork:
    def setup_method(self):
        self.input_size = 10  # Example input size
        self.output_size = 5   # Example number of actions
        self.q_network = QNetwork(self.input_size, self.output_size)

    def test_forward_pass(self):
        # Create a random input tensor
        input_tensor = torch.randn(1, self.input_size)
        output = self.q_network(input_tensor)

        # Check the output shape
        assert output.shape == (1, self.output_size)

    def test_network_layers(self):
        # Check if the network has the correct layers
        assert isinstance(self.q_network.fc1, nn.Linear)
        assert isinstance(self.q_network.fc2, nn.Linear)
        assert isinstance(self.q_network.fc3, nn.Linear)
        assert isinstance(self.q_network.output_layer, nn.Linear)

    def test_dropout(self):
        # Check if dropout is applied
        self.q_network.train()  # Set to training mode
        input_tensor = torch.randn(1, self.input_size)
        output1 = self.q_network(input_tensor)

        self.q_network.eval()  # Set to evaluation mode
        output2 = self.q_network(input_tensor)

        # Ensure that outputs are different due to dropout
        assert not torch.equal(output1, output2)