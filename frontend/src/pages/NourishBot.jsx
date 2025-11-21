import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Trash2, Plus, Loader, Bot, User, Sparkles } from 'lucide-react';
import api from '../services/api';

const NourishBot = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await api.get('/api/chatbot/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadSessionHistory = async (sessionId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/chatbot/sessions/${sessionId}/history`);
      setMessages(response.data.messages);
      setCurrentSessionId(sessionId);
    } catch (error) {
      console.error('Error loading history:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await api.post('/api/chatbot/sessions/new');
      setSessions([response.data, ...sessions]);
      setCurrentSessionId(response.data.id);
      setMessages([]);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this chat session?')) return;
    
    try {
      await api.delete(`/api/chatbot/sessions/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // Optimistically add user message
    const tempUserMsg = {
      id: 'temp-' + Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await api.post('/api/chatbot/chat', {
        message: userMessage,
        session_id: currentSessionId
      });

      // Update session ID if it's a new chat
      if (!currentSessionId) {
        setCurrentSessionId(response.data.session_id);
        await loadSessions();
      }

      // Replace temp message and add assistant response
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempUserMsg.id),
        { ...tempUserMsg, id: 'user-' + Date.now() },
        {
          id: 'assistant-' + Date.now(),
          role: 'assistant',
          content: response.data.message,
          timestamp: response.data.timestamp
        }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempUserMsg.id));
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    { icon: '♻️', text: 'How can I reduce food waste?', prompt: 'Give me practical tips for reducing food waste at home.' },
    { icon: '🥗', text: 'Nutrition advice', prompt: 'What are some tips for balanced nutrition on a budget?' },
    { icon: '💰', text: 'Budget meal ideas', prompt: 'Suggest some affordable and healthy meal ideas.' },
    { icon: '🍲', text: 'Leftover recipes', prompt: 'What creative dishes can I make with common leftovers?' },
    { icon: '🌍', text: 'Environmental impact', prompt: 'Explain the environmental impact of food waste.' },
    { icon: '🤝', text: 'Food sharing', prompt: 'How can I share food with my community?' },
  ];

  const handleQuickPrompt = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-2xl shadow-lg">
              <Bot className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            NourishBot <Sparkles className="w-8 h-8 text-yellow-500" />
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your AI-powered assistant for food waste reduction, nutrition advice, budget planning, and sustainable living
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Chat Sessions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 h-[calc(100vh-280px)] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chats
                </h2>
                <button
                  onClick={createNewSession}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="New Chat"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2">
                {sessions.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No chat sessions yet. Start a new conversation!
                  </p>
                ) : (
                  sessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => loadSessionHistory(session.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all group ${
                        currentSessionId === session.id
                          ? 'bg-green-100 border-2 border-green-600'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteSession(session.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg h-[calc(100vh-280px)] flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && !isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <Bot className="w-20 h-20 text-green-600 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Welcome to NourishBot! 👋
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-lg">
                      I'm here to help you with food waste reduction, nutrition guidance,
                      budget meal planning, and creative leftover ideas. Try one of these:
                    </p>
                    
                    {/* Quick Prompts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                      {quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickPrompt(prompt.prompt)}
                          className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all text-left border-2 border-transparent hover:border-green-300"
                        >
                          <span className="text-2xl mb-2 block">{prompt.icon}</span>
                          <span className="text-sm font-medium text-gray-800">
                            {prompt.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          msg.role === 'user'
                            ? 'bg-blue-600'
                            : 'bg-gradient-to-r from-green-600 to-blue-600'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          msg.role === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div
                          className={`inline-block p-4 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 px-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about food, nutrition, or sustainability..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputMessage.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSending ? (
                      <Loader className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  NourishBot uses AI to provide helpful suggestions. Always verify important information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NourishBot;
