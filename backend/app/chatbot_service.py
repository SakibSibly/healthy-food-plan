import os
from datetime import datetime
from openai import OpenAI
from sqlmodel import Session, select
from app.models import ChatSession, ChatMessage, User
import uuid


class NourishBotService:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
        self.model = "gpt-4o-mini"  # Using cost-effective model
        
        # Rule-based knowledge base for enhanced responses
        self.knowledge_base = {
            "food_waste": [
                "Store herbs in water like flowers to keep them fresh longer.",
                "Freeze overripe bananas for smoothies or banana bread.",
                "Use vegetable scraps to make homemade broth.",
                "First In, First Out (FIFO): Use older items before newer ones.",
                "Pickle or ferment vegetables that are about to expire.",
                "Transform stale bread into croutons, breadcrumbs, or french toast.",
                "Proper storage: Keep tomatoes at room temperature, potatoes in dark places.",
                "Meal prep on weekends to use ingredients before they spoil.",
            ],
            "nutrition": [
                "Aim for colorful plates - different colors mean different nutrients.",
                "Include protein in every meal to stay full longer (eggs, beans, fish, chicken).",
                "Whole grains provide sustained energy (brown rice, quinoa, oats).",
                "Leafy greens are nutrient-dense: spinach, kale, and arugula pack vitamins.",
                "Healthy fats are essential: avocados, nuts, olive oil, fatty fish.",
                "Stay hydrated - sometimes thirst is mistaken for hunger.",
                "Balance macros: 40-50% carbs, 25-35% protein, 20-30% healthy fats.",
                "Vitamin C helps iron absorption - pair beans with tomatoes or citrus.",
            ],
            "budget_meals": [
                "Buy seasonal produce - it's cheaper and more flavorful.",
                "Bulk buying staples: rice, beans, pasta, oats saves money.",
                "Plan meals around sales and weekly discounts.",
                "Eggs are affordable protein powerhouses (~$0.25-0.50 per egg).",
                "Cook in batches and freeze portions for convenient future meals.",
                "Store brands often have same quality at lower prices.",
                "Canned beans and tomatoes are budget-friendly and nutritious.",
                "Grow herbs on windowsills - fresh herbs for pennies.",
            ],
            "leftovers": [
                "Roasted chicken → chicken salad → chicken soup → chicken fried rice.",
                "Cooked rice → fried rice → rice pudding → rice balls.",
                "Vegetables → stir-fry → frittata → soup → veggie wraps.",
                "Pasta → pasta salad → baked pasta casserole.",
                "Transform leftover meat into tacos, sandwiches, or grain bowls.",
                "Create 'leftover bowls' with grains + protein + veggies + sauce.",
                "Blend leftover vegetables into creamy soups or sauces.",
                "Make breakfast hash from dinner leftovers with eggs on top.",
            ],
            "food_sharing": [
                "Use apps like OLIO, Too Good To Go, or Flashfood to share surplus food.",
                "Check local food banks or community fridges in your area.",
                "Join or start a community garden to share produce.",
                "Participate in local food swaps or crop swaps.",
                "Share meals with neighbors through platforms like Casserole Club.",
                "Donate unexpired non-perishables to local shelters.",
                "Use social media neighborhood groups to offer food items.",
                "Consider meal trains for community members in need.",
            ],
            "environment": [
                "Food waste produces methane in landfills - a potent greenhouse gas.",
                "1/3 of global food production is wasted, contributing 8-10% of emissions.",
                "Composting food scraps reduces landfill waste and creates nutrient-rich soil.",
                "Local and seasonal eating reduces transportation emissions.",
                "Plant-based meals generally have lower carbon footprints.",
                "Reducing meat consumption by 50% can cut food-related emissions by 35%.",
                "Food packaging waste: choose products with minimal or recyclable packaging.",
                "Growing food at home eliminates transportation and packaging impacts.",
            ],
        }
        
        self.system_prompt = """You are NourishBot, an expert AI assistant specializing in sustainable food practices, nutrition, and budget-conscious meal planning. Your mission is to help users:

1. **Reduce Food Waste**: Provide practical tips on food storage, preservation, and creative use of ingredients.
2. **Balance Nutrition**: Offer evidence-based nutritional guidance for healthy, balanced meals.
3. **Budget Meal Planning**: Suggest cost-effective meal ideas and shopping strategies.
4. **Transform Leftovers**: Give creative ideas for repurposing leftovers into delicious new meals.
5. **Food Sharing**: Guide users on local food sharing programs and community resources.
6. **Environmental Impact**: Educate on the environmental benefits of reducing food waste.

Be friendly, practical, and concise. When appropriate, draw from rule-based tips but always personalize your advice to the user's situation. Consider their dietary preferences, budget, and household size when available. Use emojis occasionally to make conversations engaging."""

    def get_relevant_tips(self, message: str, limit: int = 3) -> list[str]:
        """Extract relevant tips based on message keywords."""
        message_lower = message.lower()
        relevant_tips = []
        
        # Check for keywords and gather relevant tips
        if any(word in message_lower for word in ["waste", "spoil", "expire", "throw", "discard"]):
            relevant_tips.extend(self.knowledge_base["food_waste"][:limit])
        
        if any(word in message_lower for word in ["nutrition", "healthy", "vitamin", "nutrient", "protein", "carb"]):
            relevant_tips.extend(self.knowledge_base["nutrition"][:limit])
        
        if any(word in message_lower for word in ["budget", "cheap", "afford", "money", "save", "cost"]):
            relevant_tips.extend(self.knowledge_base["budget_meals"][:limit])
        
        if any(word in message_lower for word in ["leftover", "extra", "remain", "reuse", "repurpose"]):
            relevant_tips.extend(self.knowledge_base["leftovers"][:limit])
        
        if any(word in message_lower for word in ["share", "donate", "give", "community", "neighbor"]):
            relevant_tips.extend(self.knowledge_base["food_sharing"][:limit])
        
        if any(word in message_lower for word in ["environment", "climate", "carbon", "sustainable", "eco", "green"]):
            relevant_tips.extend(self.knowledge_base["environment"][:limit])
        
        return relevant_tips[:5]  # Return max 5 tips

    def build_context_prompt(self, user_data: dict, relevant_tips: list[str]) -> str:
        """Build enriched context from user profile and knowledge base."""
        context_parts = []
        
        if user_data:
            context_parts.append(f"User Profile: {user_data.get('full_name', 'User')}")
            if user_data.get('housing_size'):
                context_parts.append(f"Household size: {user_data['housing_size']} people")
            if user_data.get('budget_pref'):
                context_parts.append(f"Budget preference: ${user_data['budget_pref']}")
            if user_data.get('dietary_pref'):
                context_parts.append(f"Dietary preference: {user_data['dietary_pref']}")
            if user_data.get('dietary_restrictions'):
                context_parts.append(f"Dietary restrictions: {user_data['dietary_restrictions']}")
            if user_data.get('location'):
                context_parts.append(f"Location: {user_data['location']}")
        
        if relevant_tips:
            context_parts.append(f"\nRelevant tips to consider:\n" + "\n".join(f"- {tip}" for tip in relevant_tips))
        
        return "\n".join(context_parts)

    async def get_chat_response(
        self,
        message: str,
        session_id: uuid.UUID | None,
        user_id: uuid.UUID,
        db: Session
    ) -> tuple[str, uuid.UUID]:
        """Generate chatbot response with context memory."""
        
        # Get user data for personalization
        user = db.exec(select(User).where(User.id == user_id)).first()
        user_data = {
            "full_name": user.full_name,
            "housing_size": user.housing_size,
            "budget_pref": user.budget_pref,
            "dietary_pref": user.dietary_pref,
            "dietary_restrictions": user.dietary_restrictions,
            "location": user.location,
        } if user else {}
        
        # Get relevant rule-based tips
        relevant_tips = self.get_relevant_tips(message)
        context_prompt = self.build_context_prompt(user_data, relevant_tips)
        
        # Get or create chat session
        if session_id:
            session = db.exec(select(ChatSession).where(ChatSession.id == session_id)).first()
            if not session or session.user_id != user_id:
                session = None
        else:
            session = None
        
        if not session:
            # Create new session
            session = ChatSession(
                user_id=user_id,
                title=message[:50] + "..." if len(message) > 50 else message,
                created_at=datetime.utcnow().isoformat(),
                updated_at=datetime.utcnow().isoformat()
            )
            db.add(session)
            db.commit()
            db.refresh(session)
            session_id = session.id
        
        # Get conversation history for context
        history = db.exec(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
        ).all()
        
        # Build messages for OpenAI
        messages = [{"role": "system", "content": self.system_prompt}]
        
        # Add context if available
        if context_prompt:
            messages.append({"role": "system", "content": f"Context:\n{context_prompt}"})
        
        # Add conversation history
        for msg in history[-10:]:  # Last 10 messages for context
            messages.append({"role": msg.role, "content": msg.content})
        
        # Add current user message
        messages.append({"role": "user", "content": message})
        
        # Save user message
        user_message = ChatMessage(
            session_id=session_id,
            role="user",
            content=message,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(user_message)
        
        try:
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=800
            )
            
            assistant_message = response.choices[0].message.content
            
        except Exception as e:
            # Fallback response if OpenAI fails
            assistant_message = self._fallback_response(message, relevant_tips)
        
        # Save assistant message
        assistant_msg = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=assistant_message,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(assistant_msg)
        
        # Update session
        session.updated_at = datetime.utcnow().isoformat()
        db.add(session)
        db.commit()
        
        return assistant_message, session_id

    def _fallback_response(self, message: str, tips: list[str]) -> str:
        """Provide rule-based response when OpenAI is unavailable."""
        if not tips:
            return """I'm here to help with food waste reduction, nutrition advice, budget meal planning, 
leftover transformation, food sharing, and environmental impact! Please ask me about any of these topics. 
For example: 'How can I reduce food waste?' or 'What are some budget-friendly meals?'"""
        
        response = "Here are some helpful tips based on your question:\n\n"
        for i, tip in enumerate(tips, 1):
            response += f"{i}. {tip}\n"
        
        response += "\nFeel free to ask more specific questions about any of these topics!"
        return response

    def get_session_history(self, session_id: uuid.UUID, db: Session) -> list[dict]:
        """Retrieve chat history for a session."""
        messages = db.exec(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at)
        ).all()
        
        return [
            {
                "id": str(msg.id),
                "role": msg.role,
                "content": msg.content,
                "timestamp": msg.created_at
            }
            for msg in messages
        ]

    def get_user_sessions(self, user_id: uuid.UUID, db: Session) -> list[dict]:
        """Get all chat sessions for a user."""
        sessions = db.exec(
            select(ChatSession)
            .where(ChatSession.user_id == user_id, ChatSession.is_active == True)
            .order_by(ChatSession.updated_at.desc())
        ).all()
        
        return [
            {
                "id": str(session.id),
                "title": session.title,
                "created_at": session.created_at,
                "updated_at": session.updated_at
            }
            for session in sessions
        ]
