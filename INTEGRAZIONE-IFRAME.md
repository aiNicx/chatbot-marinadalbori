# Integrazione del Chatbot tramite iframe

Questo documento spiega come integrare il chatbot di Marina D'Albori tramite iframe, un metodo alternativo che può essere utile in determinati contesti.

## Vantaggi dell'approccio iframe

L'approccio iframe offre diversi vantaggi rispetto all'integrazione diretta tramite JavaScript:

1. **Isolamento completo**: Il chatbot funziona in un ambiente completamente isolato dal sito principale
2. **Semplicità di implementazione**: Basta un tag HTML per integrare il chatbot
3. **Manutenzione semplificata**: Aggiornamenti al chatbot senza necessità di modificare il sito principale
4. **Sicurezza**: Il chatbot non ha accesso diretto al DOM del sito principale
5. **Hosting separato**: Possibilità di gestire il chatbot su un server diverso da quello del sito principale

## Limitazioni dell'approccio iframe

Ci sono anche alcune limitazioni da considerare:

1. **Problemi di responsive design**: Gli iframe possono essere difficili da rendere completamente responsive
2. **Limiti di integrazione visiva**: Il chatbot potrebbe sembrare "separato" dal sito principale
3. **Politiche di sicurezza del browser**: Alcuni browser limitano le funzionalità degli iframe
4. **SEO**: I contenuti all'interno dell'iframe non sono indicizzati insieme al sito principale
5. **Cookies e Storage**: L'iframe potrebbe avere accesso limitato ai cookie e localStorage del sito principale
6. **Problemi di performance**: Caricamento di un'intera pagina separata dentro il sito principale

## Passaggi per l'integrazione tramite iframe

### 1. Deploy del Chatbot

Per prima cosa, effettua il deployment dell'applicazione chatbot su un dominio/sottodominio dedicato:

```bash
# Build dell'applicazione completa
npm run build

# Deploy sui server (esempio con comando generico)
scp -r dist/* user@tuo-server:/path/to/chatbot.marinadalbori.it/
```

### 2. Creazione di una Pagina Dedicata per l'Embed

Crea una pagina HTML dedicata che ospiterà solo il chatbot, ottimizzata per essere incorporata in un iframe:

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marina D'Albori Chatbot</title>
    <style>
        /* Reset CSS */
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background: transparent;
        }
        
        /* Contenitore principale */
        #chatbot-container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        
        /* Stile per nascondere la UI quando il chatbot è chiuso */
        .chatbot-closed {
            display: none;
        }
    </style>
</head>
<body>
    <div id="marina-chatbot"></div>
    
    <script>
        // Funzione per comunicare con il sito principale
        function sendMessageToParent(action, data) {
            window.parent.postMessage({
                source: 'marina-chatbot',
                action: action,
                data: data
            }, '*');  // In produzione, sostituire '*' con l'origine del sito marinadalbori.it
        }
        
        // Ascolta i messaggi dal sito principale
        window.addEventListener('message', function(event) {
            // Verifica che il messaggio provenga dal sito principale
            if (event.data && event.data.source === 'marina-parent') {
                if (event.data.action === 'open') {
                    // Apri il chatbot
                    MarinaChatbot.open();
                } else if (event.data.action === 'close') {
                    // Chiudi il chatbot
                    MarinaChatbot.close();
                }
            }
        });
        
        // Comunica quando il chatbot è pronto
        window.addEventListener('DOMContentLoaded', function() {
            sendMessageToParent('ready', {});
        });
    </script>
    
    <!-- Script del chatbot -->
    <script src="/marina-chatbot.umd.js"></script>
    <link rel="stylesheet" href="/assets/index.css">
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Inizializza il chatbot
            MarinaChatbot.init({
                persistSession: true,
                apiBaseUrl: '/api'
            });
            
            // Informa il parent quando il chatbot è aperto o chiuso
            window.addEventListener('marina-chatbot-open', function() {
                sendMessageToParent('opened', {});
            });
            
            window.addEventListener('marina-chatbot-close', function() {
                sendMessageToParent('closed', {});
            });
        });
    </script>
</body>
</html>
```

Salva questo file come `index.html` nella radice del tuo server chatbot.

### 3. Integrazione dell'iframe nel Sito Principale

Aggiungi il seguente codice HTML al tuo sito marinadalbori.it:

```html
<!-- Contenitore dell'iframe del chatbot -->
<div id="marina-chatbot-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: none;">
  <iframe 
    id="marina-chatbot-iframe"
    src="https://chatbot.marinadalbori.it/" 
    frameborder="0" 
    style="width: 350px; height: 550px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);"
    title="Marina D'Albori Chatbot"
    loading="lazy">
  </iframe>
</div>

<!-- Pulsante per aprire il chatbot -->
<div id="marina-chatbot-button" style="position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background-color: #1d4ed8; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 9998;">
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
</div>

<!-- Script per gestire l'interazione -->
<script>
  (function() {
    // Elementi DOM
    const button = document.getElementById('marina-chatbot-button');
    const container = document.getElementById('marina-chatbot-container');
    const iframe = document.getElementById('marina-chatbot-iframe');
    
    // Stato del chatbot
    let isChatbotOpen = false;
    
    // Funzione per aprire il chatbot
    function openChatbot() {
      container.style.display = 'block';
      button.style.display = 'none';
      isChatbotOpen = true;
      
      // Invia messaggio al chatbot
      iframe.contentWindow.postMessage({
        source: 'marina-parent',
        action: 'open'
      }, '*');  // In produzione, usa l'URL esatto del chatbot
      
      // Salva lo stato
      localStorage.setItem('marina_chatbot_open', 'true');
    }
    
    // Funzione per chiudere il chatbot
    function closeChatbot() {
      container.style.display = 'none';
      button.style.display = 'flex';
      isChatbotOpen = false;
      
      // Invia messaggio al chatbot
      iframe.contentWindow.postMessage({
        source: 'marina-parent',
        action: 'close'
      }, '*');
      
      // Salva lo stato
      localStorage.setItem('marina_chatbot_open', 'false');
    }
    
    // Aggiungi event listener al pulsante
    button.addEventListener('click', openChatbot);
    
    // Ascolta i messaggi dall'iframe
    window.addEventListener('message', function(event) {
      // Verifica che il messaggio provenga dall'iframe del chatbot
      if (event.data && event.data.source === 'marina-chatbot') {
        if (event.data.action === 'closed') {
          closeChatbot();
        }
      }
    });
    
    // Ripristina lo stato precedente
    document.addEventListener('DOMContentLoaded', function() {
      const savedState = localStorage.getItem('marina_chatbot_open');
      if (savedState === 'true') {
        openChatbot();
      }
    });
  })();
</script>
```

## Configurazione del Server per Cross-Origin Communication

Per garantire il corretto funzionamento della comunicazione tra il sito principale e l'iframe, configura il server del chatbot per inviare i corretti header CORS:

### Per Apache

Aggiungi queste righe al file `.htaccess`:

```apache
<IfModule mod_headers.c>
    # Consenti la comunicazione dalla fonte del sito principale
    Header set Access-Control-Allow-Origin "https://marinadalbori.it"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
    Header set Access-Control-Allow-Credentials "true"
</IfModule>
```

### Per Nginx

Aggiungi queste direttive al blocco `server` o `location`:

```nginx
add_header Access-Control-Allow-Origin "https://marinadalbori.it";
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
add_header Access-Control-Allow-Headers "Content-Type";
add_header Access-Control-Allow-Credentials "true";
```

## Soluzioni per Deployment su Replit

Se desideri deployare questo chatbot direttamente su Replit, puoi utilizzare il servizio Replit Deployments:

1. Apri il pulsante "Deploy" dal tuo progetto Replit
2. Segui le istruzioni per deployare il progetto
3. Una volta deployato, usa l'URL generato (qualcosa come `https://yourproject.yourname.repl.co`) come fonte per l'iframe

### Vantaggi del Deployment su Replit:

- Hosting gestito con SSL incluso
- Scalabilità automatica
- Prezzo conveniente
- Facile da aggiornare (basta fare un nuovo deploy)

## Riepilogo Comparativo degli Approcci di Integrazione

| Caratteristica | Integrazione JS Diretta | Integrazione iframe |
|----------------|-------------------------|---------------------|
| Facilità di implementazione | Moderata | Alta |
| Integrazione visiva | Eccellente | Limitata |
| Isolamento | Parziale | Completo |
| Performance | Migliore | Può essere più lenta |
| Sicurezza | Condivide il contesto | Completamente isolato |
| Responsive design | Eccellente | Può essere problematico |
| SEO | Contenuto indicizzabile | Contenuto non indicizzato |
| Manutenzione | Più complessa | Più semplice |
| Comunicazione col sito | Diretta | Via postMessage API |

## Conclusione

L'integrazione via iframe è un'alternativa valida all'embedding diretto via JavaScript, specialmente quando si preferisce un'implementazione semplice e un isolamento completo del chatbot dal sito principale. Tuttavia, presenta alcune limitazioni in termini di integrazione visiva e responsive design.

La scelta tra i due approcci dipende dalle priorità specifiche del progetto:
- Se la perfetta integrazione visiva e il responsive design sono prioritari: scegli l'integrazione JS diretta
- Se la semplicità di implementazione e l'isolamento completo sono più importanti: l'approccio iframe può essere preferibile

In entrambi i casi, è possibile mantenere la persistenza della sessione di chat durante la navigazione, garantendo un'esperienza utente fluida.