# Chatbot Marina D'Albori - Guida all'Installazione

Questa è la guida per integrare il chatbot interattivo sul sito web marinadalbori.it.

## Prerequisiti

- Accesso FTP o SSH al server web di marinadalbori.it
- Possibilità di modificare le pagine HTML del sito
- Credenziali per l'API OpenRouter (assicurati di averle configurate)

## Installazione

### 1. Caricamento dei file sul server

Per prima cosa, devi copiare la build del chatbot sul tuo server web. Segui questi passaggi:

```bash
# Costruisci l'applicazione
npm run build

# Carica i file della build sul tuo server tramite FTP o SSH
# La cartella della build dovrebbe essere disponibile in /dist
```

Carica i file nella directory del tuo sito web, ad esempio in una cartella chiamata `/chatbot/`.

### 2. Configurazione delle variabili d'ambiente

Configura le variabili d'ambiente nel tuo server. Puoi farlo creando un file `.env` nella radice del server o configurando le variabili d'ambiente direttamente dal tuo pannello di hosting:

```
OPENROUTER_API_KEY=la_tua_chiave_api_openrouter
MODEL=meta-llama/llama-4-maverick:free
```

### 3. Embedding del chatbot nelle pagine del sito

Aggiungi il seguente codice prima del tag di chiusura `</body>` in ogni pagina del sito marinadalbori.it dove vuoi che il chatbot sia disponibile:

```html
<!-- Chatbot Marina D'Albori -->
<script type="text/javascript" src="/chatbot/assets/index-[hash].js" defer></script>
<link rel="stylesheet" href="/chatbot/assets/index-[hash].css">
<div id="marina-chatbot"></div>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Inizializza il chatbot
    if (window.MarinaChatbot) {
      window.MarinaChatbot.init({
        apiUrl: '/api/chat',
        persistSession: true  // Mantiene la sessione durante la navigazione
      });
    }
  });
</script>
```

Sostituisci `[hash]` con il valore hash effettivo generato nella build (puoi verificarlo guardando i nomi dei file nella cartella `/dist/assets/`).

## Persistenza della sessione

Il chatbot è configurato per mantenere la sessione di chat mentre l'utente naviga tra le diverse pagine del sito web. Questo funziona grazie a:

1. Salvataggio dell'ID sessione nel localStorage del browser
2. Recupero della sessione all'apertura del chatbot su una nuova pagina

L'ID sessione viene memorizzato in `localStorage` con la chiave `chat_session_id` e recuperato automaticamente quando il chatbot viene inizializzato su una nuova pagina.

## Personalizzazione (opzionale)

È possibile personalizzare l'aspetto del chatbot modificando le variabili CSS nel file `theme.json`. Per una personalizzazione più avanzata, puoi modificare i componenti React nel codice sorgente e ricostruire l'applicazione.

## Risoluzione dei problemi

Se riscontri problemi con il chatbot, verifica:

1. Che le variabili d'ambiente siano configurate correttamente
2. Che i percorsi dei file JS e CSS siano corretti nell'embedding
3. Che il server API del chatbot sia accessibile dall'esterno

Per assistenza, contatta il supporto tecnico.

## Libreria standalone alternativa (Opzione avanzata)

In alternativa all'approccio sopra, è possibile creare una libreria standalone che può essere inclusa in qualsiasi sito web con un singolo tag script:

```html
<script src="https://tuodominio.com/chatbot/marina-chatbot.js"></script>
<script>
  MarinaChatbot.init();
</script>
```

Per questa implementazione, sarà necessario modificare la configurazione di build per generare una libreria standalone. Contatta lo sviluppatore per ulteriori dettagli su questa opzione.