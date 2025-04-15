import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatButton({ onClick, isOpen }: ChatButtonProps) {
  return (
    <Button
      aria-label="Chat con Marina D'Albori"
      className={`fixed bottom-6 right-6 rounded-full w-16 h-16 p-0 shadow-xl ${isOpen ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 z-50 transition-all duration-300 ease-in-out transform hover:scale-105`}
      onClick={onClick}
    >
      <div className="relative">
        <MessageSquare className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-blue-800">
          M
        </span>
      </div>
    </Button>
  );
}
