import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { OpenRouterRequest, OpenRouterMessage } from '@shared/schema';
import { scrapeWebsite } from './scraper';

// Cache for scraped website content to avoid too many requests
let websiteContentCache: any = null;
let lastScrapedTime = 0;
const CACHE_TTL = 3600000; // 1 hour

/**
 * Load system instructions from file
 */
async function loadInstructions(): Promise<string> {
  try {
    const instructionsPath = path.join(process.cwd(), 'server', 'instructions.txt');
    const instructions = await fs.readFile(instructionsPath, 'utf-8');
    return instructions;
  } catch (error) {
    console.error('Error loading instructions:', error);
    return 'Sei un assistente virtuale per il ristorante Marina D\'Albori. Rispondi su orari, menù, come raggiungerci in auto/barca/navetta da Marina di Vietri, consiglia piatti di pesce, guida l\'utente tra le pagine del sito.';
  }
}

/**
 * Get website content either from cache or by scraping
 */
async function getWebsiteContent(): Promise<any> {
  const currentTime = Date.now();
  
  // If cache is valid, use it
  if (websiteContentCache && (currentTime - lastScrapedTime < CACHE_TTL)) {
    return websiteContentCache;
  }
  
  // Otherwise, scrape and update cache
  try {
    const content = await scrapeWebsite();
    websiteContentCache = content;
    lastScrapedTime = currentTime;
    return content;
  } catch (error) {
    console.error('Error getting website content:', error);
    if (websiteContentCache) {
      return websiteContentCache; // Return old cache if available
    }
    return null;
  }
}

/**
 * Creates the system message with instructions and website content
 */
async function createSystemMessage(): Promise<OpenRouterMessage> {
  const instructions = await loadInstructions();
  const websiteContent = await getWebsiteContent();
  
  let systemMessageContent = instructions + '\n\n';
  
  if (websiteContent) {
    systemMessageContent += 'Ecco alcune informazioni sul ristorante che puoi utilizzare:\n\n';
    
    if (websiteContent.description) {
      systemMessageContent += `Descrizione: ${websiteContent.description}\n\n`;
    }
    
    if (websiteContent.hours) {
      systemMessageContent += `Orari: ${websiteContent.hours}\n\n`;
    }
    
    if (websiteContent.location) {
      systemMessageContent += `Posizione: ${websiteContent.location}\n\n`;
    }
    
    if (websiteContent.contact) {
      systemMessageContent += `Contatti: ${websiteContent.contact}\n\n`;
    }
    
    if (websiteContent.menu && websiteContent.menu.length > 0) {
      systemMessageContent += `Menu: ${websiteContent.menu.join(', ')}\n\n`;
    }
    
    if (websiteContent.content) {
      // Limit content size to avoid exceeding token limits
      const truncatedContent = websiteContent.content.substring(0, 1500);
      systemMessageContent += `Contenuto aggiuntivo: ${truncatedContent}\n\n`;
    }
  }
  
  return {
    role: 'system',
    content: systemMessageContent
  };
}

/**
 * Call OpenRouter API to get AI response
 */
export async function callOpenRouter(messages: OpenRouterMessage[]): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.MODEL || 'meta-llama/llama-4-maverick:free';
  
  if (!apiKey) {
    throw new Error('OpenRouter API key is missing');
  }
  
  // Add system message at the beginning
  const systemMessage = await createSystemMessage();
  const fullMessages = [systemMessage, ...messages];
  
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        messages: fullMessages,
        model,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://www.marinadalbori.it'
        }
      }
    );
    
    // Extract and return the assistant's reply
    if (response.data && 
        response.data.choices && 
        response.data.choices[0] && 
        response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    }
    
    throw new Error('Unexpected response structure from OpenRouter');
  } catch (error: any) {
    console.error('Error calling OpenRouter:', error);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(`OpenRouter API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    }
    
    throw error;
  }
}
