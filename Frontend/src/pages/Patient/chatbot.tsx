import React, { useState, useRef, useEffect } from 'react';
import { Send, Youtube } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  mood?: string;
  videoUrl?: string;
}

interface ChatResponse {
  response: string;
  mood?: string;
  video_url?: string;
  error?: string;
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How are you feeling today?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://healthsphere-flask-3.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data: ChatResponse = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          text: data.response,
          isUser: false,
          mood: data.mood,
          videoUrl: data.video_url
        }]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-photo/top-view-smiley-sad-faces-blue-monday-with-copy-space_23-2148756223.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden opacity-90" style={{ marginLeft: '350px' }}>
        <div className="bg-indigo-600 p-4">
          <h1 className="text-white text-xl font-semibold">Emotional Support Chat</h1>
          <p className="text-indigo-200 text-sm">Share how you're feeling, and I'll try to help</p>
        </div>
        
        <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{message.text}</p>
                {message.videoUrl && (
                  <a
                    href={message.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-2 text-sm font-medium text-indigo-100 hover:text-white"
                  >
                    <Youtube size={16} />
                    Watch recommended video
                  </a>
                )}
                {message.mood && (
                  <p className="mt-1 text-xs opacity-75">
                    Detected mood: {message.mood}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type how you're feeling..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;