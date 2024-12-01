import { WordCard } from "./WordCard";


interface WordsProps {
  words: Word[];
  quizResults: { [key: string]: boolean };
  verseDetails: { [key: string]: { arabic: string; translation: string } };
}

export function Words({ words, quizResults, verseDetails }: WordsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {words.map((word) => (
        <WordCard 
          key={word.arabic} 
          word={word} 
          quizResult={quizResults[word.arabic]}
          verseDetails={verseDetails[`${word.surah}-${word.ayah}`]}
        />
      ))}
    </div>
  );
} 