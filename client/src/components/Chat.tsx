import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  onNewChat: () => void;
  key?: string; // Add this to force re-mounting
}

export function Chat({ onNewChat }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Scroll when messages change or loading state changes

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    onNewChat();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/chat', {
        question: input,
        threadId,
      });
      
      const botMessage = { role: 'assistant' as const, content: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant' as const, 
        content: 'Sorry, there was an error processing your request.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.content} 
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <strong>{message.role === 'user' ? 'You' : 'Hive Notes Assistant'}:</strong>
            <p>{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <p>Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Invisible element for scrolling */}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the hives..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>

      <button 
        onClick={handleNewChat}
        className="new-chat-button"
        title="Start a new conversation"
      >
        New Chat
      </button>
    </div>
  );
} 