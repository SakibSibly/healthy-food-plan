from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from app.db import get_session
from app.api.deps import get_current_user
from app.models import User, ChatRequest, ChatResponse, ChatSession
from app.chatbot_service import NourishBotService
import uuid

router = APIRouter(prefix="/api/chatbot", tags=["chatbot"])

chatbot_service = NourishBotService()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Send a message to NourishBot and get a response."""
    try:
        response_message, session_id = await chatbot_service.get_chat_response(
            message=request.message,
            session_id=request.session_id,
            user_id=current_user.id,
            db=db
        )
        
        return ChatResponse(
            session_id=session_id,
            message=response_message,
            timestamp=__import__("datetime").datetime.utcnow().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")


@router.get("/sessions")
async def get_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get all chat sessions for the current user."""
    try:
        sessions = chatbot_service.get_user_sessions(current_user.id, db)
        return {"sessions": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching sessions: {str(e)}")


@router.get("/sessions/{session_id}/history")
async def get_session_history(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Get message history for a specific session."""
    try:
        # Verify session belongs to user
        from sqlmodel import select
        session = db.exec(select(ChatSession).where(ChatSession.id == session_id)).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Session not found")
        
        history = chatbot_service.get_session_history(session_id, db)
        return {"messages": history}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Delete a chat session."""
    try:
        from sqlmodel import select
        session = db.exec(select(ChatSession).where(ChatSession.id == session_id)).first()
        if not session or session.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session.is_active = False
        db.add(session)
        db.commit()
        
        return {"message": "Session deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting session: {str(e)}")


@router.post("/sessions/new")
async def create_new_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Create a new chat session."""
    try:
        from datetime import datetime
        session = ChatSession(
            user_id=current_user.id,
            title="New Chat",
            created_at=datetime.utcnow().isoformat(),
            updated_at=datetime.utcnow().isoformat()
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return {
            "id": str(session.id),
            "title": session.title,
            "created_at": session.created_at,
            "updated_at": session.updated_at
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating session: {str(e)}")
