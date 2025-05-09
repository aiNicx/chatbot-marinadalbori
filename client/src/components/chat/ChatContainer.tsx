import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Message, ApiResponse, BotAction } from './types';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useLocation } from 'wouter';

interface ChatContainerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatContainer({ isOpen, onClose }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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

  // Funzione per estrarre e gestire azioni dal messaggio del bot
  const handleBotActions = (message: string): { extractedMessage: string, actions: BotAction[] } => {
    const actions: BotAction[] = [];
    let extractedMessage = message;
    
    try {
      // Migliora il pattern di ricerca per essere più flessibile
      // Cerca sia pattern JSON esatti che testo strutturato che potrebbe contenere azioni
      const jsonPattern = /\{[\s\S]*?"type"[\s\S]*?"button"[\s\S]*?\}/g;
      const matches = message.match(jsonPattern);
      
      console.log("Pattern trovati nel messaggio:", matches);
      
      if (matches && matches.length > 0) {
        // Per ogni match trovato
        matches.forEach(match => {
          try {
            // Converte la stringa JSON in oggetto
            const actionObj = JSON.parse(match);
            console.log("Oggetto azione estratto:", actionObj);
            
            // Verifica che sia un'azione valida
            if (actionObj.type === 'button' && 
                actionObj.label && 
                (actionObj.action === 'navigate' || actionObj.action === 'scroll') && 
                actionObj.target) {
              
              // Aggiunge l'azione all'array
              actions.push({
                type: actionObj.type,
                label: actionObj.label,
                action: actionObj.action,
                target: actionObj.target
              });
              
              // Rimuove il JSON dal messaggio visualizzato
              extractedMessage = extractedMessage.replace(match, '');
            }
          } catch (e) {
            console.error('Errore nel parsing del JSON per azione:', e, "nel testo:", match);
          }
        });
        
        // Pulizia del messaggio (rimuove linee vuote multiple, etc.)
        extractedMessage = extractedMessage.replace(/\n{3,}/g, '\n\n').trim();
      }
      
      // Ricerca alternativa per link in forma semplice, nel caso il modello non risponda col formato JSON
      if (actions.length === 0) {
        const paginePattern = /(\/[a-z-]+)/g;
        const elementiPattern = /(#[a-z-]+)/g;
        
        const pagine = message.match(paginePattern);
        const elementi = message.match(elementiPattern);
        
        if (pagine) {
          pagine.forEach(pagina => {
            if (['/menu', '/prenotazione', '/contatti', '/come-arrivare'].includes(pagina)) {
              actions.push({
                type: 'button',
                label: `Vai a ${pagina.replace('/', '').replace('-', ' ')}`,
                action: 'navigate',
                target: pagina
              });
            }
          });
        }
        
        if (elementi) {
          elementi.forEach(elemento => {
            if (['#menu', '#contatti', '#orari', '#mappa'].includes(elemento)) {
              actions.push({
                type: 'button',
                label: `Vedi ${elemento.replace('#', '')}`,
                action: 'scroll',
                target: elemento
              });
            }
          });
        }
      }
    } catch (error) {
      console.error('Errore nell\'elaborazione delle azioni:', error);
    }
    
    console.log("Azioni estratte:", actions);
    return { extractedMessage, actions };
  };
  
  // Funzione per eseguire le azioni quando l'utente clicca sul bottone
  const executeAction = (action: BotAction) => {
    switch (action.action) {
      case 'navigate':
        // Navigazione a una nuova pagina
        setLocation(action.target);
        break;
      case 'scroll':
        // Scrolling a un elemento nella pagina
        const element = document.querySelector(action.target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.error(`Elemento non trovato: ${action.target}`);
        }
        break;
      default:
        console.error(`Tipo di azione non supportata: ${action.action}`);
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
      // Invia il sessionId solo se esiste, altrimenti lascia che il server ne generi uno nuovo
      const payload = sessionId 
        ? { message: messageText, sessionId } 
        : { message: messageText };
      
      const response = await apiRequest('POST', '/api/chat', payload);
      
      const data: ApiResponse = await response.json();
      
      // Save session ID if this is first message
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem('chat_session_id', data.sessionId);
      }
      
      // Analizza la risposta per individuare eventuali azioni o pulsanti
      const { extractedMessage, actions } = handleBotActions(data.message);
      
      // Add AI response to chat
      const assistantMessage: Message = {
        role: 'assistant',
        content: extractedMessage,
        actions: actions
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
    <div className="fixed inset-0 sm:inset-auto sm:bottom-0 sm:right-0 z-50 flex items-end justify-end sm:m-4 transition-all duration-300 ease-out">
      <div className="w-full sm:w-[28rem] h-[85vh] sm:h-[32rem] max-h-screen sm:max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200/80 transition-all chat-container">
        <ChatHeader onClose={onClose} />
        <ChatMessages 
          messages={messages} 
          isTyping={isTyping} 
          onActionClick={executeAction} 
        />
        <ChatInput onSendMessage={sendMessage} disabled={isTyping} />
      </div>
    </div>
  );
}
