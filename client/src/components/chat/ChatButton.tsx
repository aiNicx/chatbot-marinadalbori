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
      className={`fixed bottom-4 right-4 rounded-full w-14 h-14 p-0 shadow-lg ${isOpen ? 'hidden' : 'flex'} items-center justify-center bg-primary hover:bg-primary/90 z-50`}
      onClick={onClick}
    >
      <MessageSquare className="h-6 w-6 text-white" />
    </Button>
  );
}
