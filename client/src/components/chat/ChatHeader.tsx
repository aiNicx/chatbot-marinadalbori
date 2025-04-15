import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white border-b border-blue-800/50">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center mr-3 shadow-md">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-700 to-blue-900 font-bold font-serif text-2xl">M</span>
        </div>
        <div>
          <h3 className="font-serif font-bold text-xl tracking-tight">Marina D'Albori</h3>
          <p className="text-xs text-blue-200 font-medium">Ristorante & Enoteca</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-white hover:bg-blue-600 hover:text-white rounded-full"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
