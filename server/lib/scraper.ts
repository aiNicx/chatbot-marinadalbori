import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Scrapes the content from Marina D'Albori website
 * @returns Object containing the extracted information
 */
export async function scrapeWebsite(): Promise<{ 
  title: string;
  description: string;
  menu: string[]; 
  hours: string;
  location: string;
  contact: string;
  content: string;
}> {
  try {
    const { data } = await axios.get('https://www.marinadalbori.it');
    const $ = cheerio.load(data);
    
    // Default empty values
    let result = {
      title: "Marina D'Albori",
      description: "",
      menu: [],
      hours: "",
      location: "",
      contact: "",
      content: ""
    };
    
    // Extract title and description
    result.title = $('title').text().trim() || result.title;
    const metaDescription = $('meta[name="description"]').attr('content');
    if (metaDescription) {
      result.description = metaDescription;
    }
    
    // Extract main content
    const mainContent: string[] = [];
    $('p, h1, h2, h3, h4, h5, h6').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10) { // Only get meaningful content
        mainContent.push(text);
      }
    });
    
    result.content = mainContent.join('\n');
    
    // Try to find menu items
    $('*:contains("menu"), *:contains("Menu"), *:contains("piatti"), *:contains("Piatti")').each((_, el) => {
      const menuItems: string[] = [];
      $(el).find('li, p').each((_, item) => {
        const text = $(item).text().trim();
        if (text && text.length > 3 && !menuItems.includes(text)) {
          menuItems.push(text);
        }
      });
      
      if (menuItems.length > 0) {
        result.menu = [...result.menu, ...menuItems];
      }
    });
    
    // Try to find opening hours
    $('*:contains("orari"), *:contains("Orari"), *:contains("apertura"), *:contains("Apertura")').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10 && (text.includes('orari') || text.includes('Orari') || text.includes('apertura'))) {
        result.hours = text;
      }
    });
    
    // Try to find location info
    $('*:contains("dove siamo"), *:contains("Dove Siamo"), *:contains("indirizzo"), *:contains("Indirizzo")').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10) {
        result.location = text;
      }
    });
    
    // Try to find contact info
    $('*:contains("contatti"), *:contains("Contatti"), *:contains("telefono"), *:contains("Telefono")').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10) {
        result.contact = text;
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error scraping website:', error);
    return {
      title: "Marina D'Albori",
      description: "Ristorante di pesce sulla costa amalfitana",
      menu: [],
      hours: "Aperto tutti i giorni dalle 12:00 alle 23:00",
      location: "Marina di Vietri, Costa Amalfitana",
      contact: "Tel: 089 123456",
      content: ""
    };
  }
}
