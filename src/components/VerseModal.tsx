import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  verse: {
    arabic: string;
    translation: string;
    surah: string;
    ayah: number;
    highlightText: string;
  };
}

export function VerseModal({ isOpen, onClose, verse }: VerseModalProps) {
  // Function to highlight the specific word in the verse
  const highlightWord = (text: string, wordToHighlight: string) => {
    // For debugging
    console.log('Full text:', text);
    console.log('Word to highlight:', wordToHighlight);

    // Normalize both strings by removing diacritics and special characters
    const normalizeArabic = (str: string) => {
      return str
        .replace(/[\u064B-\u065F]/g, '') // Remove tashkeel (diacritics)
        .replace(/\u0640/g, '')          // Remove tatweel
        .replace(/[\u0670-\u0674]/g, '') // Remove superscript alef
        .replace(/[ىئءؤإأٱآا]/g, 'ا')     // Normalize all alef forms first
        .replace(/ة/g, 'ه')              // Normalize taa marbouta
        .replace(/[ۚۖۛۗ]/g, '')          // Remove other marks
        .replace(/\s+/g, ' ')            // Normalize spaces
        .replace(/لله/g, 'الله')         // Fix Allah word normalization
        .replace(/ا+/g, 'ا')             // Replace multiple alefs with single alef
        .trim();
    };

    const normalizedText = normalizeArabic(text);
    const normalizedWord = normalizeArabic(wordToHighlight);

    console.log('Normalized text:', normalizedText);
    console.log('Normalized word:', normalizedWord);

    // Find the word boundaries in the original text
    const words = text.split(/\s+/);
    const normalizedWords = words.map(w => normalizeArabic(w));
    const targetWords = wordToHighlight.split(/\s+/).map(w => normalizeArabic(w));
    
    let matchStart = -1;
    for (let i = 0; i < normalizedWords.length - targetWords.length + 1; i++) {
      if (targetWords.every((w, j) => normalizedWords[i + j] === w)) {
        matchStart = i;
        break;
      }
    }

    if (matchStart === -1) return <>{text}</>;

    // Get the original words with all diacritics
    const originalPhrase = words.slice(matchStart, matchStart + targetWords.length).join(' ');
    
    // Split and highlight
    const parts = text.split(originalPhrase);
    
    return (
      <>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span className="bg-yellow-200 px-1 rounded">
                {originalPhrase}
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Surah {verse.surah}, Ayah {verse.ayah}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-2xl text-right font-arabic leading-loose">
            {highlightWord(verse.arabic, verse.highlightText)}
          </p>
          <p className="text-gray-600">
            {verse.translation}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 