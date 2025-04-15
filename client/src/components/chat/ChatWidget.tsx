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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300 ease-out chat-overlay"
          onClick={toggleChat}
        />
      )}
      <ChatContainer isOpen={isOpen} onClose={toggleChat} />
      
      {/* Add styling for animations and scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .chat-window::-webkit-scrollbar {
          width: 4px;
        }
        .chat-window::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-window::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .chat-window::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 6px;
          width: 6px;
          margin: 0 1px;
          background-color: #90b4e0;
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
        
        /* Animazioni fluide per apertura/chiusura */
        @keyframes slideIn {
          from { transform: translateY(10px) scale(0.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .chat-container {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .chat-overlay {
          animation: fadeIn 0.2s ease-out;
        }
      `}} />
    </>
  );
}
