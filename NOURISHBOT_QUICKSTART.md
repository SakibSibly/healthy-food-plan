# NourishBot - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Option 1: Automated Setup (Recommended)
```powershell
# From project root
.\setup_nourishbot.ps1
```

### Option 2: Manual Setup

#### 1. Install Backend Dependencies
```powershell
cd backend
pip install -e .
# This installs openai>=1.54.0 and other dependencies
```

#### 2. Configure OpenAI API Key
Create/edit `backend/.env`:
```
OPENAI_API_KEY=sk-your-api-key-here
```
Get key from: https://platform.openai.com/api-keys

#### 3. Run Database Migration
```powershell
cd backend
alembic upgrade head
```

#### 4. Start Servers
```powershell
# Terminal 1 - Backend
cd backend
fastapi dev app/api/main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## ✅ Verification

1. Backend running at: http://localhost:8000
2. Frontend running at: http://localhost:5173
3. API docs at: http://localhost:8000/docs
4. Check for `/api/chatbot` endpoints in API docs

## 🎯 Using NourishBot

### Access
1. Login to the application
2. Click **"NourishBot"** in the navigation menu
3. Start chatting!

### Quick Prompts
- ♻️ "How can I reduce food waste?"
- 🥗 "What are some tips for balanced nutrition?"
- 💰 "Suggest affordable and healthy meal ideas"
- 🍲 "Creative dishes from common leftovers?"
- 🌍 "Environmental impact of food waste"
- 🤝 "How to share food with community?"

### Features
- **New Chat**: Click the "+" button in the sidebar
- **View History**: Click on any previous chat session
- **Delete Chat**: Hover over a session and click the trash icon
- **Custom Questions**: Type anything in the input field

## 🔧 Configuration

### Environment Variables (backend/.env)
```bash
# Required for AI responses
OPENAI_API_KEY=sk-your-key-here

# Database connection (should already exist)
DATABASE_URL=postgresql://user:pass@localhost/dbname
```

### Model Settings (backend/app/chatbot_service.py)
```python
self.model = "gpt-4o-mini"  # Cost-effective model
self.temperature = 0.7      # Creativity level (0-1)
self.max_tokens = 800       # Response length limit
```

## 📊 API Endpoints

### Send Message
```bash
curl -X POST http://localhost:8000/api/chatbot/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "How can I reduce food waste?"}'
```

### Get Sessions
```bash
curl http://localhost:8000/api/chatbot/sessions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get History
```bash
curl http://localhost:8000/api/chatbot/sessions/{SESSION_ID}/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ❗ Troubleshooting

### "Import openai could not be resolved"
```powershell
cd backend
pip install openai
```

### "Error processing chat"
1. Check OpenAI API key is set in .env
2. Verify API key has credits: https://platform.openai.com/usage
3. Check backend logs for details

### Database tables not found
```powershell
cd backend
alembic upgrade head
```

### Session not loading
1. Clear browser cache
2. Logout and login again
3. Check backend logs for authentication errors

## 💡 Tips

### Cost Management
- GPT-4o-mini is ~10x cheaper than GPT-4
- Average cost: $0.0005-0.001 per conversation
- Fallback to rule-based tips when API unavailable

### Best Practices
1. Be specific in your questions
2. Mention dietary restrictions/preferences
3. Include context (e.g., "family of 4", "budget of $50/week")
4. Use quick prompts as conversation starters

### Personalization
The bot automatically uses your profile:
- Household size
- Budget preference  
- Dietary preferences
- Dietary restrictions
- Location

Update your profile to get better recommendations!

## 📚 Resources

- **Full Documentation**: NOURISHBOT_README.md
- **OpenAI Docs**: https://platform.openai.com/docs
- **API Pricing**: https://openai.com/api/pricing
- **Model Info**: https://platform.openai.com/docs/models

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend logs: `cd backend && fastapi dev app/api/main.py`
3. Check browser console for frontend errors
4. Verify all files are present (see NOURISHBOT_README.md)

## 🎉 Success Checklist

- [ ] OpenAI package installed
- [ ] API key configured in .env
- [ ] Database migration completed
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can access /nourishbot route
- [ ] Can send messages and get responses
- [ ] Sessions are persisted and loadable

## 📝 Example Usage

```
User: "I have chicken, rice, and broccoli. What can I make?"

NourishBot: "Great ingredients! Here are some ideas:

1. **Chicken Stir-Fry** 🥘
   - Dice chicken, sauté with broccoli
   - Serve over rice with soy sauce

2. **Chicken & Broccoli Casserole** 🍲
   - Mix rice, chicken, broccoli
   - Bake with cheese on top

3. **Meal Prep Bowls** 🥙
   - Portion into containers
   - Add variety with different sauces

These meals are budget-friendly and nutritious! 
Want recipes for any of these?"
```

---

**Happy Chatting! 🤖💚**
