// Types for chat components
export interface Message {
  id?: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
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
