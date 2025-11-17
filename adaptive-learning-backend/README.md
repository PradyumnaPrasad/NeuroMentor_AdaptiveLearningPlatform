# Adaptive Learning Backend

This project implements an adaptive learning backend using FastAPI and a Deep Q-Learning agent to enhance the learning experience for students. The backend replaces traditional rule-based decision-making with a reinforcement learning approach, allowing for more personalized and effective learning paths.

## Project Structure

```
adaptive-learning-backend
├── src
│   ├── main.py                # Entry point for the FastAPI application
│   ├── config.py              # Configuration settings
│   ├── api                    # API related files
│   │   ├── routes             # API route definitions
│   │   ├── dependencies.py     # Dependency functions for routes
│   ├── models                 # Data models and schemas
│   ├── rl                     # Reinforcement learning components
│   ├── services               # Services for external integrations and logic
│   └── utils                  # Utility functions and classes
├── tests                      # Unit tests for the application
├── data                      # Directory for model files and data
├── requirements.txt           # Project dependencies
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore file
└── README.md                  # Project documentation
```

## Features

- **Reinforcement Learning**: Utilizes a Deep Q-Learning agent to make decisions based on student interactions.
- **FastAPI Framework**: Provides a fast and efficient API for frontend integration.
- **MongoDB Integration**: Stores mastery levels and model states for persistence.
- **Caching Strategies**: Implements caching for expensive API calls to reduce costs and latency.
- **Unit Testing**: Comprehensive tests for key functionalities to ensure reliability.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd adaptive-learning-backend
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables by copying `.env.example` to `.env` and modifying as necessary.

## Usage

To run the FastAPI application, execute the following command:
```
uvicorn src.main:app --reload
```

You can access the API documentation at `http://127.0.0.1:8000/docs`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.