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

export default function ChatMessages({ messages, isTyping, onActionClick }: ChatMessagesProps) {
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
          className={`flex flex-col ${
            message.role === 'user' ? 'items-end' : 'items-start'
          } mb-4`}
        >
          <div className={`flex items-start ${message.role === 'user' ? 'justify-end' : ''}`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-2 shadow-sm">
                <span className="text-blue-700 font-serif font-bold text-sm">M</span>
              </div>
            )}
            <div
              className={`${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md'
                  : 'bg-gray-50 text-gray-800 border border-gray-100 shadow-sm'
              } rounded-2xl py-3 px-4 max-w-[85%] transition-all duration-200`}
            >
              <p className="text-sm whitespace-pre-line font-normal leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
          
          {/* Pulsanti di azione (se presenti) */}
          {message.actions && message.actions.length > 0 && (
            <div className={`mt-3 flex flex-wrap gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'} max-w-[80%]`}>
              {message.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  variant="outline"
                  size="sm"
                  className={`rounded-full text-blue-700 border-blue-200 bg-white hover:bg-blue-50 transition-colors shadow-sm ${
                    action.action === 'navigate' ? 'pl-3 pr-4' : 'pl-3 pr-4'
                  }`}
                  onClick={() => onActionClick && onActionClick(action)}
                >
                  {action.action === 'navigate' ? (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      {action.label}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line></svg>
                      {action.label}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-start mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-2 shadow-sm">
            <span className="text-blue-700 font-serif font-bold text-sm">M</span>
          </div>
          <div className="bg-gray-100 text-gray-500 rounded-2xl py-3 px-4 shadow-sm">
            <TypingIndicator />
          </div>
        </div>
      )}

      {/* Invisible div for auto-scrolling */}
      <div ref={messagesEndRef} />
    </div>
  );
}
