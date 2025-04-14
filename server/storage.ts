import { 
  ChatMessage, 
  InsertChatMessage, 
  ChatSession, 
  InsertChatSession, 
  chatMessages, 
  chatSessions, 
  users, 
  type User, 
  type InsertUser 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat message operations
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Chat session operations
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSessionLastActive(sessionId: string): Promise<void>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<string, ChatMessage[]>;
  private chatSessions: Map<string, ChatSession>;
  private currentUserId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.chatSessions = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Chat message methods
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.get(sessionId) || [];
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const now = new Date();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      createdAt: now 
    };
    
    const sessionMessages = this.chatMessages.get(insertMessage.sessionId) || [];
    sessionMessages.push(message);
    this.chatMessages.set(insertMessage.sessionId, sessionMessages);
    
    return message;
  }

  // Chat session methods
  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(sessionId);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const now = new Date();
    const session: ChatSession = {
      ...insertSession,
      createdAt: now,
      lastActive: now
    };
    
    this.chatSessions.set(insertSession.id, session);
    return session;
  }

  async updateChatSessionLastActive(sessionId: string): Promise<void> {
    const session = this.chatSessions.get(sessionId);
    if (session) {
      session.lastActive = new Date();
      this.chatSessions.set(sessionId, session);
    }
  }
}

// Export a singleton instance of MemStorage
export const storage = new MemStorage();
