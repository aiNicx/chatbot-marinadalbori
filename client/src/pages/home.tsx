import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ChatWidget from '@/components/chat/ChatWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-center mb-8 text-primary">
          Benvenuti a Marina D'Albori
        </h1>
        
        <Card className="shadow-md mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-serif font-semibold mb-4">
              Benvenuto nel sito demo per il chatbot di Marina D'Albori
            </h2>
            <p className="text-gray-700 mb-4">
              Questo è un sito demo per mostrare il funzionamento del chatbot AI integrato.
              Il chatbot si trova in basso a destra dello schermo e può rispondere a domande sul ristorante.
            </p>
            <p className="text-gray-700">
              Prova a chiedere informazioni su:
            </p>
            <ul className="list-disc list-inside mt-2 mb-4 text-gray-700">
              <li>Orari di apertura</li>
              <li>Menu e specialità</li>
              <li>Come raggiungere il ristorante</li>
              <li>Prenotazioni</li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Chat widget will be displayed as a floating button */}
        <ChatWidget />
      </div>
    </div>
  );
}
