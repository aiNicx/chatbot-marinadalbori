import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-200 p-3 bg-gray-50">
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 border border-gray-300 rounded-l-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          disabled={disabled}
        />
        <Button
          type="submit"
          className="bg-primary text-white rounded-r-lg h-10 px-4 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={disabled || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>Powered by LLaMa 4 Maverick</span>
      </div>
    </div>
  );
}
