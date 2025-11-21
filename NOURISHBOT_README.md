# NourishBot - AI-Powered Food Assistant

## Overview
NourishBot is an intelligent chatbot integrated into the Healthy Food Plan application that provides personalized advice on:
- 🔄 Food waste reduction
- 🥗 Nutrition balancing
- 💰 Budget meal planning
- 🍲 Creative leftover transformations
- 🤝 Local food sharing guidance
- 🌍 Environmental impact education

## Features

### 1. **LLM-Powered Conversations**
- Uses OpenAI's GPT-4o-mini for cost-effective, intelligent responses
- Natural language understanding for food-related queries
- Context-aware responses based on user profile

### 2. **Contextual Memory (Session Management)**
- Maintains conversation history across sessions
- Remembers previous discussions within a chat session
- Prompt chaining: Uses last 10 messages for context
- Multiple chat sessions per user with persistent storage

### 3. **Rule-Based Knowledge Enhancement**
- Built-in knowledge base with 48+ curated tips across 6 categories:
  - Food waste reduction (8 tips)
  - Nutrition advice (8 tips)
  - Budget meal planning (8 tips)
  - Leftover transformation (8 tips)
  - Food sharing resources (8 tips)
  - Environmental impact facts (8 tips)
- Keyword detection automatically retrieves relevant tips
- Fallback responses when API is unavailable

### 4. **Personalized Responses**
- Integrates user profile data:
  - Household size
  - Budget preferences
  - Dietary preferences (vegetarian, vegan, etc.)
  - Dietary restrictions (allergies, intolerances)
  - Location (for local resource recommendations)

### 5. **Modern UI/UX**
- Chat interface with message history
- Session management sidebar
- Quick prompt buttons for common questions
- Real-time message updates
- Responsive design for mobile and desktop
- Loading states and error handling

## Backend Architecture

### Database Models
```python
# ChatSession: Stores chat sessions
- id: UUID (primary key)
- user_id: UUID (foreign key to User)
- title: String (auto-generated from first message)
- is_active: Boolean
- created_at: DateTime
- updated_at: DateTime

# ChatMessage: Stores individual messages
- id: UUID (primary key)
- session_id: UUID (foreign key to ChatSession)
- role: String (user/assistant/system)
- content: String (up to 10,000 chars)
- created_at: DateTime
```

### API Endpoints

#### `POST /api/chatbot/chat`
Send a message and get AI response
```json
Request:
{
  "message": "How can I reduce food waste?",
  "session_id": "uuid" // optional, creates new if null
}

Response:
{
  "session_id": "uuid",
  "message": "Here are some practical tips...",
  "timestamp": "2025-11-21T12:00:00"
}
```

#### `GET /api/chatbot/sessions`
Get all chat sessions for current user
```json
Response:
{
  "sessions": [
    {
      "id": "uuid",
      "title": "Food waste tips",
      "created_at": "2025-11-21T10:00:00",
      "updated_at": "2025-11-21T12:00:00"
    }
  ]
}
```

#### `GET /api/chatbot/sessions/{session_id}/history`
Get message history for a session
```json
Response:
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "How can I reduce food waste?",
      "timestamp": "2025-11-21T10:00:00"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Here are some tips...",
      "timestamp": "2025-11-21T10:00:05"
    }
  ]
}
```

#### `POST /api/chatbot/sessions/new`
Create a new chat session

#### `DELETE /api/chatbot/sessions/{session_id}`
Delete (deactivate) a chat session

### NourishBotService
Core service class handling:
- OpenAI API integration
- Rule-based tip retrieval
- Context building from user profile
- Session and message management
- Fallback responses

## Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
pip install -e .
# or
uv pip install -e .
```

This will install the `openai` package (version 1.54.0+).

#### Set OpenAI API Key
Create or update `.env` file in the backend directory:
```bash
OPENAI_API_KEY=sk-your-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

#### Run Database Migration
```bash
cd backend
alembic upgrade head
```

This creates the `chatsession` and `chatmessage` tables.

### 2. Frontend Setup
No additional dependencies needed - uses existing React and Tailwind CSS setup.

### 3. Start the Application

#### Backend
```bash
cd backend
fastapi dev app/api/main.py
```

#### Frontend
```bash
cd frontend
npm run dev
```

## Usage Guide

### For Users

1. **Access NourishBot**: Click "NourishBot" in the navigation menu
2. **Start Chatting**: 
   - Click quick prompt buttons for common questions
   - Or type your own question in the input field
3. **Manage Sessions**:
   - Create new chat sessions with the "+" button
   - View past conversations in the sidebar
   - Delete sessions with the trash icon
4. **Get Personalized Advice**: The bot uses your profile information to tailor responses

### Example Queries
- "I have leftover chicken and rice. What can I make?"
- "What are cheap, nutritious meals for a family of 4?"
- "How do I store vegetables to make them last longer?"
- "What's the environmental impact of food waste?"
- "Are there food sharing programs in my area?"

## Technical Details

### AI Model Configuration
- **Model**: `gpt-4o-mini` (cost-effective, fast)
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 800 (concise responses)
- **Context Window**: Last 10 messages + system prompt + user profile

### Knowledge Base Structure
```python
knowledge_base = {
    "food_waste": [...],     # 8 tips
    "nutrition": [...],      # 8 tips
    "budget_meals": [...],   # 8 tips
    "leftovers": [...],      # 8 tips
    "food_sharing": [...],   # 8 tips
    "environment": [...]     # 8 tips
}
```

### Keyword Detection
Smart keyword matching triggers relevant tip retrieval:
- "waste", "spoil", "expire" → food_waste tips
- "nutrition", "healthy", "vitamin" → nutrition tips
- "budget", "cheap", "afford" → budget_meals tips
- "leftover", "reuse" → leftovers tips
- "share", "donate", "community" → food_sharing tips
- "environment", "climate", "sustainable" → environment tips

## Cost Considerations

### OpenAI API Costs (GPT-4o-mini)
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens
- Average conversation: ~500-1000 tokens
- Estimated cost: $0.0005-0.001 per conversation

### Cost Optimization
1. Uses gpt-4o-mini (10x cheaper than GPT-4)
2. Limits response length (800 tokens max)
3. Maintains only last 10 messages in context
4. Rule-based fallback when API unavailable
5. Caches user profile data

## Security & Privacy

- All chats are user-specific (user_id foreign key)
- Session validation ensures users only access their own chats
- Messages stored securely in PostgreSQL
- OpenAI API key stored in environment variables
- No chat data shared between users

## Future Enhancements

Potential improvements:
1. **RAG Integration**: Add vector database for recipe/tip retrieval
2. **Image Analysis**: Upload food photos for identification and recipes
3. **Voice Input**: Speech-to-text for hands-free interaction
4. **Meal Plan Generation**: Direct integration with meal planner
5. **Inventory Integration**: Query inventory for recipe suggestions
6. **Multi-language Support**: Translate conversations
7. **Analytics Dashboard**: Track popular queries and topics
8. **Fine-tuned Model**: Train custom model on food domain

## Troubleshooting

### Common Issues

**1. "Error processing chat" message**
- Check OpenAI API key is set correctly
- Verify API key has credits
- Check internet connection
- Review backend logs for details

**2. Sessions not loading**
- Ensure database migration ran successfully
- Check backend API is running
- Verify authentication token is valid

**3. Slow responses**
- Normal for first message (cold start)
- Consider upgrading OpenAI plan for faster responses
- Check network latency

**4. Fallback responses appearing**
- OpenAI API key not set or invalid
- API rate limit exceeded
- Network connectivity issues

## File Structure

```
backend/
├── app/
│   ├── models.py                    # ChatSession & ChatMessage models
│   ├── chatbot_service.py          # NourishBotService class
│   ├── api/
│   │   ├── main.py                 # Router registration
│   │   └── routes/
│   │       └── chatbot.py          # API endpoints
│   └── alembic/
│       └── versions/
│           └── c5f6d7e8f9a0_*.py  # Migration file
└── pyproject.toml                   # openai dependency

frontend/
└── src/
    ├── pages/
    │   └── NourishBot.jsx           # Main chatbot component
    ├── components/
    │   └── Navbar.jsx               # Navigation with NourishBot link
    └── App.jsx                      # Route configuration
```

## Contributing

To extend NourishBot:
1. Add new tips to `knowledge_base` in `chatbot_service.py`
2. Enhance keyword detection in `get_relevant_tips()`
3. Customize system prompt for different personas
4. Add new quick prompts in `NourishBot.jsx`

## License
Part of the Healthy Food Plan application.
