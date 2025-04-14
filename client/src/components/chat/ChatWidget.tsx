import { useState, useEffect } from 'react';
import ChatButton from './ChatButton';
import ChatContainer from './ChatContainer';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Check for persisted open state
  useEffect(() => {
    const isOpenStored = localStorage.getItem('chat_widget_open');
    if (isOpenStored === 'true') {
      setIsOpen(true);
    }
  }, []);
  
  // Toggle chat open/closed state
  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('chat_widget_open', String(newState));
  };
  
  return (
    <>
      <ChatButton onClick={toggleChat} isOpen={isOpen} />
      <ChatContainer isOpen={isOpen} onClose={toggleChat} />
      
      {/* Add styling for typing indicator animation */}
      <style jsx global>{`
        .chat-window::-webkit-scrollbar {
          width: 6px;
        }
        .chat-window::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .chat-window::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 10px;
        }
        .chat-window::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 7px;
          width: 7px;
          margin: 0 1px;
          background-color: #bbb;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.3s linear infinite;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.15s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
