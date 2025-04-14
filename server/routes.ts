import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import { z } from "zod";
import { callOpenRouter } from "./lib/openrouter";
import { OpenRouterMessage, openRouterMessageSchema } from "@shared/schema";

// Validate chat message schema
const chatRequestSchema = z.object({
  sessionId: z.string().optional(),
  message: z.string(),
  messages: z.array(openRouterMessageSchema).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoints
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      // Validate request
      const validatedData = chatRequestSchema.parse(req.body);
      
      // Generate session ID if not provided
      const sessionId = validatedData.sessionId || nanoid();
      
      // Get or create session
      let session = await storage.getChatSession(sessionId);
      if (!session) {
        session = await storage.createChatSession({
          id: sessionId,
          metadata: {}
        });
      } else {
        await storage.updateChatSessionLastActive(sessionId);
      }
      
      // Get previous messages for this session
      let messageHistory: OpenRouterMessage[] = [];
      
      if (validatedData.messages) {
        // If client provided message history, use it
        messageHistory = validatedData.messages;
      } else {
        // Otherwise load from storage (convert to OpenRouter format)
        const storedMessages = await storage.getChatMessages(sessionId);
        messageHistory = storedMessages.map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content
        }));
      }
      
      // Add the new user message
      const userMessage: OpenRouterMessage = {
        role: "user",
        content: validatedData.message
      };
      
      // Store user message
      await storage.createChatMessage({
        role: "user",
        content: validatedData.message,
        sessionId
      });
      
      // Prepare messages for OpenRouter API
      const apiMessages = [...messageHistory, userMessage];
      
      // Call OpenRouter API
      const aiResponse = await callOpenRouter(apiMessages);
      
      // Store AI response
      await storage.createChatMessage({
        role: "assistant",
        content: aiResponse,
        sessionId
      });
      
      // Send response to client
      res.status(200).json({
        message: aiResponse,
        sessionId
      });
    } catch (error: any) {
      console.error("Error in chat API:", error);
      res.status(500).json({ 
        error: error.message || "Internal server error" 
      });
    }
  });

  // Get chat history for a session
  app.get("/api/chat/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      
      // Get messages for this session
      const messages = await storage.getChatMessages(sessionId);
      
      // If session exists, update last active time
      const session = await storage.getChatSession(sessionId);
      if (session) {
        await storage.updateChatSessionLastActive(sessionId);
      }
      
      res.status(200).json({ messages });
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ 
        error: error.message || "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
