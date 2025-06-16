# The Last of Us: AI-Powered Survival Game

This is a text-based, AI-driven survival game inspired by the post-apocalyptic world of The Last of Us. The player interacts with the game through natural language prompts, and the game responds with AI-generated narrative content. The objective is to survive and explore the wasteland while managing stats such as health, energy, and age.

## Setup Instructions

1. Clone this repository
2. Ensure you have Node.js and a modern browser installed
3. Deploy the frontend to an S3 bucket or serve locally using a live server
4. Set up the backend:
   - Use AWS Lambda for the `aiTextHandler` function
   - Set API Gateway trigger and enable CORS for your frontend domain
   - Store the backend API key securely in AWS Secrets Manager or directly in code for development only

## Project Structure

- `index.html`: Main game interface
- `script.js`: Handles game logic, player stats, and interaction with AI API
- `style.css`: Basic post-apocalyptic themed styling
- `lambda/index.cjs`: AWS Lambda function for calling the AI model via OpenRouter or another LLM provider
- `terraform/`: Optional infrastructure setup (currently unused and excluded from deployment)

## API Integration

- The backend uses an AI model via OpenRouter API
- Prompts are passed with current player context and a system prompt to maintain tone and setting
- The API is called through an HTTPS POST request in the Lambda function
- The response is sent back to the frontend and rendered in the game log

## Capabilities and Limitations

### Capabilities

- Fully AI-generated interactive story
- Player stat tracking and simple death conditions
- Immersive world-building with tone-matching responses (horror + humor)
- Context-aware narrative progression using AI
- Dynamic aging system that impacts game outcome

### Limitations

- AI may occasionally give generic or non-sequential replies
- No true memory; only recent prompts are retained
- No real-time multiplayer or persistent backend save system
- AI model quality is dependent on token availability and service tier

## Future Improvements

- Add custom memory logic to give AI a sense of long-term story development
- Implement server-side session saving
- Add image generation for scenes
- Integrate a better stat or resource management system
- Add actual branching logic based on choices or state
