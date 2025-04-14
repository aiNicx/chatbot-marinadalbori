import { useEffect, useRef } from 'react';
import { Message, BotAction } from './types';
import { Button } from '@/components/ui/button';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  onActionClick?: (action: BotAction) => void;
}

// Typing indicator component
const TypingIndicator = () => (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

export default function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or typing status changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-window">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex items-start mb-4 ${
            message.role === 'user' ? 'justify-end' : ''
          }`}
        >
          {message.role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mr-2">
              <span className="text-primary font-serif font-bold text-sm">M</span>
            </div>
          )}
          <div
            className={`${
              message.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-blue-50 text-gray-800'
            } rounded-lg py-2 px-4 max-w-[80%]`}
          >
            <p className="text-sm whitespace-pre-line">{message.content}</p>
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-start mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mr-2">
            <span className="text-primary font-serif font-bold text-sm">M</span>
          </div>
          <div className="bg-gray-200 text-gray-500 rounded-lg py-2 px-4">
            <TypingIndicator />
          </div>
        </div>
      )}

      {/* Invisible div for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
}
