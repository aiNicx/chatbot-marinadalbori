// Types for chat components
export interface BotAction {
  type: string;
  label: string;
  action: 'navigate' | 'scroll';
  target: string;
}

export interface Message {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  actions?: BotAction[]; // Array di azioni o pulsanti
}

export interface ChatSession {
  id: string;
  messages: Message[];
}

export interface ApiResponse {
  message: string;
  sessionId: string;
  error?: string;
}
