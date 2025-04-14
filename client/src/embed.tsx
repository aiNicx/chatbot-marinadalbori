// Punto di ingresso per il chatbot da incorporare in altri siti
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/chat/ChatWidget';
import './index.css';

// Trova tutti gli elementi con il data-attribute del chatbot
const chatbotElements = document.querySelectorAll('[data-marina-chatbot]');

// Inizializza il chatbot in ogni elemento trovato
chatbotElements.forEach((element) => {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <ChatWidget />
    </React.StrictMode>
  );
});

// Esponi le API globali per controllare il chatbot
window.MarinaChatbot = {
  // Inizializza il chatbot in un elemento specifico
  init: (config = {}) => {
    const { containerId = 'marina-chatbot', ...otherConfig } = config;
    let container = document.getElementById(containerId);
    
    // Se il contenitore non esiste, crealo
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }
    
    // Aggiungi attributo data
    container.setAttribute('data-marina-chatbot', 'true');
    
    // Renderizza il chatbot
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <ChatWidget />
      </React.StrictMode>
    );
    
    console.log('Chatbot Marina D\'Albori inizializzato:', config);
  },
  
  // Apri il chatbot
  open: () => {
    localStorage.setItem('chat_widget_open', 'true');
    window.dispatchEvent(new CustomEvent('marina-chatbot-open'));
  },
  
  // Chiudi il chatbot
  close: () => {
    localStorage.setItem('chat_widget_open', 'false');
    window.dispatchEvent(new CustomEvent('marina-chatbot-close'));
  }
};

// Auto-inizializzazione se l'utente ha aggiunto il tag script con data-auto-init
if (document.currentScript && document.currentScript.getAttribute('data-auto-init') === 'true') {
  window.MarinaChatbot.init();
}