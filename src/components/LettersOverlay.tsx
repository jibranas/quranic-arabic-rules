import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { X, Volume2 } from 'lucide-react';
import { ARABIC_LETTERS, Letter } from '../../data/letters';
import { ScrollArea } from "@/components/ui/scroll-area";

interface LettersOverlayProps {
  onClose: () => void;
}

export function LettersOverlay({ onClose }: LettersOverlayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioPlay = (letter: Letter) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (letter.audio) {
      audioRef.current = new Audio(letter.audio);
      audioRef.current.play().catch(error => console.log('Audio playback failed:', error));
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold">Arabic Letters</h2>
        <div className="w-10" />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ARABIC_LETTERS.map((letter, index) => (
              <button
                key={letter.arabic}
                onClick={() => handleAudioPlay(letter)}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center space-y-2 relative"
              >
                <div className="absolute top-2 left-2 bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <span className="text-4xl font-arabic">{letter.arabic}</span>
                <div className="text-center">
                  <div className="font-semibold">{letter.name}</div>
                  <div className="text-sm text-gray-500">/{letter.pronunciation}/</div>
                </div>
                <Volume2 className="h-4 w-4 text-blue-500" />
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}