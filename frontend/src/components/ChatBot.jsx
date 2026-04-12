import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import './ChatBot.css';

const SUGGESTED_QUESTIONS = [
  "What is the best breed for milk production?",
  "What are symptoms of FMD?",
  "How much should I feed a Gir cow?",
  "Which breed is best for drought areas?"
];

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { text, sender: 'user' };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send last 5 messages as history
      const historyToSend = messages.slice(-5).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await sendChatMessage(text, historyToSend);
      setMessages([...currentMessages, { text: response.response, sender: 'bot' }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...currentMessages, { text: 'Sorry, I am having trouble connecting right now. Please try again later.', sender: 'bot', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div>
              <h3>🐄 CattleAI Assistant</h3>
              <p className="chatbot-disclaimer">Consulting veterinarian recommended for medical decisions</p>
            </div>
            <div className="chatbot-header-actions">
              <button onClick={clearChat} title="Clear Chat" className="chatbot-icon-btn">🗑️</button>
              <button onClick={toggleChat} title="Close" className="chatbot-icon-btn">❌</button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && (
              <div className="chatbot-welcome">
                <p>Hello! I'm your CattleAI Assistant. Ask me anything about cattle breeds, health, or management.</p>
                <div className="chatbot-suggestions">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => handleSend(q)} className="chatbot-suggestion-btn">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.sender}`}>
                <div className="chatbot-message-content" style={msg.isError ? { color: 'red' } : {}}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chatbot-message bot">
                <div className="chatbot-message-content loading">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Type your question..."
              disabled={isLoading}
            />
            <button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <button className="chatbot-fab" onClick={toggleChat} title="Open CattleAI Assistant">
          💬
        </button>
      )}
    </div>
  );
}

export default ChatBot;