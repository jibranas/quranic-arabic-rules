import { useState } from 'react';
import { VerseModal } from './VerseModal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WordCardProps {
//   word: Word;
  quizResult?: boolean | undefined;
  verseDetails?: {
    arabic: string;
    translation: string;
  };
}

export function WordCard({ word, quizResult, verseDetails }: WordCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className={`p-4 rounded-lg border ${
        quizResult === undefined 
          ? 'bg-white' 
          : quizResult 
            ? 'bg-green-100' 
            : 'bg-red-100'
      }`}>
        <div 
          className="flex justify-between items-start cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col items-end flex-grow">
            <span className="text-xl font-arabic">{word.arabic}</span>
            <span className="text-sm text-gray-600">{word.translation}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="text-xs text-blue-500 hover:text-blue-700 hover:underline"
            >
              Surah {word.surah}, Ayah {word.ayah}
            </button>
          </div>
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className="ml-2 text-gray-400" size={16} />
            ) : (
              <ChevronDown className="ml-2 text-gray-400" size={16} />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold mb-2">Grammar Rule:</h4>
            <p className="text-sm text-gray-600 mb-4">{word.rule}</p>
            <h4 className="text-sm font-semibold mb-2">Explanation:</h4>
            <p className="text-sm text-gray-600">{word.explanation}</p>
          </div>
        )}
      </div>

      {verseDetails && (
        <VerseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          verse={{
            arabic: verseDetails.arabic,
            translation: verseDetails.translation,
            surah: word.surah,
            ayah: word.ayah,
            highlightText: word.arabic
          }}
        />
      )}
    </>
  );
} 