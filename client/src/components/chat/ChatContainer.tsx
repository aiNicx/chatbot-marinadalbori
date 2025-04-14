import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Message, ApiResponse } from './types';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatContainer({ isOpen, onClose }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  // On mount, check for existing session in localStorage
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chat_session_id');
    if (savedSessionId) {
      setSessionId(savedSessionId);
      fetchChatHistory(savedSessionId);
    } else {
      // Add welcome message if no session exists
      setMessages([
        {
          role: 'assistant',
          content: 'Benvenuto a Marina D\'Albori! Sono qui per aiutarti con informazioni sul nostro ristorante, menù, orari e come raggiungerci. Come posso esserti utile oggi?'
        }
      ]);
    }
  }, []);

  // Fetch chat history for existing session
  const fetchChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`/api/chat/${sid}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }
      
      const data = await response.json();
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Use welcome message if history can't be fetched
      setMessages([
        {
          role: 'assistant',
          content: 'Benvenuto a Marina D\'Albori! Sono qui per aiutarti con informazioni sul nostro ristorante, menù, orari e come raggiungerci. Come posso esserti utile oggi?'
        }
      ]);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    // Add user message to chat immediately
    const userMessage: Message = {
      role: 'user',
      content: messageText
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        message: messageText,
        sessionId
      });
      
      const data: ApiResponse = await response.json();
      
      // Save session ID if this is first message
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('chat_session_id', data.sessionId);
      }
      
      // Add AI response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore nella connessione. Riprova più tardi.',
        variant: 'destructive'
      });
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 flex items-end justify-end m-4">
      <div className="mb-4 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
        <ChatHeader onClose={onClose} />
        <ChatMessages messages={messages} isTyping={isTyping} />
        <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
