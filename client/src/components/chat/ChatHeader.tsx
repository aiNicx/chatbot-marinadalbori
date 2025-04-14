import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-700 text-white border-b border-blue-800">
      <div className="flex items-center">
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
          <span className="text-blue-700 font-bold font-serif text-xl">M</span>
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg">Marina D'Albori</h3>
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
