// embedding.ts - File per l'esportazione del chatbot come libreria standalone

// Configurazione predefinita
const defaultConfig = {
  apiUrl: '/api/chat',  // URL dell'endpoint API del chatbot
  persistSession: true, // Mantiene la sessione durante la navigazione
  containerId: 'marina-chatbot', // ID del contenitore HTML
  autoInit: false,  // Non inizializzare automaticamente
};

// Interfaccia di configurazione
interface ChatbotConfig {
  apiUrl?: string;
  persistSession?: boolean;
  containerId?: string;
  autoInit?: boolean;
}

// Classe principale del chatbot
class MarinaChatbot {
  private config: ChatbotConfig;
  private static instance: MarinaChatbot | null = null;
  private initialized: boolean = false;

  // Singleton pattern
  private constructor(config: ChatbotConfig = {}) {
    this.config = { ...defaultConfig, ...config };
    if (this.config.autoInit) {
      this.init();
    }
  }

  // Metodo per ottenere/creare l'istanza
  public static getInstance(config?: ChatbotConfig): MarinaChatbot {
    if (!MarinaChatbot.instance) {
      MarinaChatbot.instance = new MarinaChatbot(config);
    } else if (config) {
      // Aggiorna la configurazione se fornita
      MarinaChatbot.instance.config = { ...MarinaChatbot.instance.config, ...config };
    }
    return MarinaChatbot.instance;
  }

  // Inizializza il chatbot
  public init(): void {
    if (this.initialized) return;
    
    // Crea o trova il contenitore
    let container = document.getElementById(this.config.containerId || defaultConfig.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.config.containerId || defaultConfig.containerId;
      document.body.appendChild(container);
    }

    // Qui si integra la logica di inizializzazione del chatbot React
    // Questo esempio utilizza un approccio semplificato
    
    // Verifica se la sessione è persistente
    if (this.config.persistSession) {
      // Recupera la sessione dal localStorage
      const sessionId = localStorage.getItem('chat_session_id');
      // Qui andrebbe la logica per caricare la sessione esistente
    }

    this.initialized = true;
    console.log("Marina D'Albori chatbot inizializzato con configurazione:", this.config);
  }
  
  // Metodo per aprire il chatbot
  public open(): void {
    if (!this.initialized) this.init();
    localStorage.setItem('chat_widget_open', 'true');
    // Qui andrebbe la logica per aprire il chatbot
    console.log("Chatbot aperto");
  }
  
  // Metodo per chiudere il chatbot
  public close(): void {
    if (!this.initialized) return;
    localStorage.setItem('chat_widget_open', 'false');
    // Qui andrebbe la logica per chiudere il chatbot
    console.log("Chatbot chiuso");
  }
}

// Inizializzatore globale
function init(config?: ChatbotConfig): MarinaChatbot {
  return MarinaChatbot.getInstance(config);
}

// Esporta l'API pubblica
const marinaChatbot = {
  init,
  getInstance: MarinaChatbot.getInstance,
};

// Esporta come modulo e rendi disponibile globalmente
export default marinaChatbot;

// Rendi disponibile globalmente per l'uso tramite tag script
if (typeof window !== 'undefined') {
  (window as any).MarinaChatbot = marinaChatbot;
}