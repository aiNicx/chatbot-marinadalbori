# Guida all'Integrazione del Chatbot in marinadalbori.it

Questa guida spiega in dettaglio come integrare il chatbot di Marina D'Albori nel sito web esistente marinadalbori.it, assicurando che il chatbot mantenga la sessione durante la navigazione tra le pagine.

## 1. Prerequisiti

- Accesso FTP o SSH al server web di marinadalbori.it
- Possibilità di modificare i file HTML del sito web
- Credenziali API OpenRouter (OPENROUTER_API_KEY)

## 2. Preparazione del Server

### 2.1 Creazione della Struttura delle Directory

Crea una cartella dedicata al chatbot sul server:

```bash
mkdir -p /path/to/marinadalbori.it/chatbot
```

### 2.2 Configurazione delle Variabili d'Ambiente

Nel tuo server web, configura le variabili d'ambiente necessarie. Se il tuo hosting supporta i file `.env`, crea un file `.env` nella root del server:

```
OPENROUTER_API_KEY=la_tua_chiave_api_openrouter
MODEL=meta-llama/llama-4-maverick:free
```

Se il tuo hosting non supporta i file `.env`, configura queste variabili dal pannello di controllo del hosting o contatta il tuo provider per assistenza.

## 3. Deployment del Chatbot

### 3.1 Costruisci il Chatbot

Esegui lo script di build per generare sia l'applicazione completa che la versione embeddable:

```bash
npm run build       # Costruisce l'applicazione completa
./build-embed.sh    # Costruisce la versione embeddable
```

### 3.2 Carica i File sul Server

Carica i file generati nella cartella `dist/embed` sul tuo server:

```bash
# Utilizzando FTP o il metodo preferito
cp -r dist/embed/* /path/to/marinadalbori.it/chatbot/
```

### 3.3 Carica il Server Backend

Carica anche i file del server backend nella directory appropriata del tuo server:

```bash
cp -r dist/* /path/to/marinadalbori.it/
```

## 4. Integrazione del Chatbot nel Sito Web

### 4.1 Integrazione Base (Tutte le Pagine)

Per integrare il chatbot in tutte le pagine del sito, aggiungi il seguente codice prima del tag di chiusura `</body>` in ogni pagina HTML o nel template comune del sito:

```html
<!-- Marina D'Albori Chatbot -->
<div id="marina-chatbot"></div>
<script src="/chatbot/marina-chatbot.umd.js"></script>
<link rel="stylesheet" href="/chatbot/assets/index.css">
<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Inizializza il chatbot
    MarinaChatbot.init({
      persistSession: true,  // Mantiene la sessione durante la navigazione
      apiUrl: '/api/chat'    // URL dell'endpoint API del chatbot
    });
  });
</script>
```

### 4.2 Per Siti con Gestori di Template

Se il tuo sito utilizza un sistema di template (come WordPress, Joomla, ecc.), modifica il template principale per includere il codice sopra.

#### Esempio per WordPress:

Aggiungi il codice al file `footer.php` del tuo tema:

```php
<?php
// Contenuto esistente del footer
?>

<!-- Marina D'Albori Chatbot -->
<div id="marina-chatbot"></div>
<script src="<?php echo get_template_directory_uri(); ?>/chatbot/marina-chatbot.umd.js"></script>
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/chatbot/assets/index.css">
<script>
  document.addEventListener('DOMContentLoaded', function() {
    MarinaChatbot.init({
      persistSession: true,
      apiUrl: '<?php echo site_url(); ?>/api/chat'
    });
  });
</script>

</body>
</html>
```

## 5. Configurazione della Persistenza della Sessione

### 5.1 Single Page Applications (SPA)

Se marinadalbori.it è una Single Page Application, il chatbot manterrà automaticamente la sessione durante la navigazione perché la pagina non viene ricaricata completamente.

### 5.2 Siti Web Tradizionali (Multi-pagina)

Per i siti web tradizionali dove le pagine vengono ricaricate completamente durante la navigazione, il chatbot è già configurato per mantenere la sessione utilizzando `localStorage`. 

Il parametro `persistSession: true` nella configurazione assicura che:

1. L'ID sessione della chat venga salvato nel browser dell'utente
2. La cronologia della chat venga recuperata quando l'utente naviga tra le pagine
3. L'utente possa continuare la conversazione da dove l'aveva lasciata

## 6. API e Funzionalità Aggiuntive

### 6.1 Apertura Programmatica del Chatbot

Per aprire il chatbot da un pulsante o un link personalizzato:

```html
<button onclick="MarinaChatbot.open()">Chatta con noi</button>
```

### 6.2 Chiusura Programmatica del Chatbot

Per chiudere il chatbot programmaticamente:

```html
<button onclick="MarinaChatbot.close()">Chiudi chat</button>
```

### 6.3 Ascolto degli Eventi del Chatbot

È possibile reagire agli eventi del chatbot:

```javascript
window.addEventListener('marina-chatbot-open', function() {
  console.log('Il chatbot è stato aperto');
});

window.addEventListener('marina-chatbot-close', function() {
  console.log('Il chatbot è stato chiuso');
});
```

## 7. Risoluzione dei Problemi

### 7.1 Il Chatbot Non Appare

- Verifica che i percorsi dei file JavaScript e CSS siano corretti
- Controlla la console del browser per eventuali errori
- Assicurati che l'elemento con ID `marina-chatbot` esista nel DOM

### 7.2 Il Chatbot Appare Ma Non Risponde

- Verifica che l'API backend sia accessibile
- Controlla che le variabili d'ambiente OPENROUTER_API_KEY e MODEL siano configurate correttamente
- Esamina i log del server per eventuali errori

### 7.3 La Sessione Non Persiste Tra le Pagine

- Assicurati che il parametro `persistSession` sia impostato su `true`
- Verifica che localStorage sia abilitato nel browser dell'utente
- Controlla la console del browser per eventuali errori relativi all'accesso a localStorage

## 8. Supporto e Assistenza

Per assistenza tecnica con l'integrazione del chatbot, contatta:

- Email: [email del supporto tecnico]
- Telefono: [numero di supporto tecnico]