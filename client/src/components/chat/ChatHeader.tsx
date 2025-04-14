import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-primary text-white border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
          <span className="text-primary font-bold font-serif">M</span>
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg">Marina D'Albori</h3>
          <p className="text-xs opacity-80">Assistente Virtuale</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-white hover:bg-primary/90 hover:text-white"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
