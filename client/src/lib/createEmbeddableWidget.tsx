import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from '../components/chat/ChatWidget';

// Configurazione predefinita
const defaultConfig = {
  apiUrl: '/api/chat',
  persistSession: true,
  containerId: 'marina-chatbot',
  autoInit: false,
};

// Interfaccia di configurazione
interface ChatbotConfig {
  apiUrl?: string;
  persistSession?: boolean;
  containerId?: string;
  autoInit?: boolean;
}

// Configura l'API globale
const configureGlobalAPI = (config: ChatbotConfig = {}) => {
  const mergedConfig = { ...defaultConfig, ...config };
  
  // Trova o crea il contenitore
  const getContainer = () => {
    let container = document.getElementById(mergedConfig.containerId!);
    if (!container) {
      container = document.createElement('div');
      container.id = mergedConfig.containerId!;
      document.body.appendChild(container);
    }
    return container;
  };
  
  // Inizializza il widget
  const init = (config: ChatbotConfig = {}) => {
    const finalConfig = { ...mergedConfig, ...config };
    const container = getContainer();
    
    // Rendering del componente React nel DOM
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <ChatWidget />
      </React.StrictMode>
    );
    
    console.log('Marina D\'Albori chatbot inizializzato con:', finalConfig);
    return api;
  };
  
  // Apri chatbot
  const open = () => {
    localStorage.setItem('chat_widget_open', 'true');
    // Trigger per evento personalizzato
    window.dispatchEvent(new CustomEvent('marina-chatbot-open'));
    return api;
  };
  
  // Chiudi chatbot
  const close = () => {
    localStorage.setItem('chat_widget_open', 'false');
    // Trigger per evento personalizzato
    window.dispatchEvent(new CustomEvent('marina-chatbot-close'));
    return api;
  };
  
  // API pubblica
  const api = {
    init,
    open,
    close,
    getConfig: () => ({ ...mergedConfig }),
  };
  
  return api;
};

// Esporta il creatore dell'API
export const createEmbeddableWidget = (config?: ChatbotConfig) => {
  return configureGlobalAPI(config);
};

// Crea l'API globale
const globalAPI = createEmbeddableWidget();

// Esporta per l'uso come modulo
export default globalAPI;

// Rendi disponibile globalmente
if (typeof window !== 'undefined') {
  (window as any).MarinaChatbot = globalAPI;
}