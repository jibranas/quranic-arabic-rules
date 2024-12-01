import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Word } from "@/types/arabic";
import { shuffleArray } from "@/lib/utils";

interface QuizProps {
  words: Word[];
  onQuizComplete: (results: { [key: string]: boolean }) => void;
}

export function Quiz({ words, onQuizComplete }: QuizProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);

  useEffect(() => {
    if (currentQuestionIndex < words.length) {
      const options = generateOptions(words[currentQuestionIndex], words);
      setCurrentOptions(options);
    }
  }, [currentQuestionIndex, words]);

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Button onClick={() => setIsStarted(true)}>Start Quiz</Button>
      </div>
    );
  }

  if (currentQuestionIndex >= words.length) {
    onQuizComplete(results);
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p>Check your results in the Words tab</p>
      </div>
    );
  }

  const currentWord = words[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === currentWord.translation;
    setSelectedAnswer(answer);
    setResults(prev => ({
      ...prev,
      [currentWord.arabic]: isCorrect
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <h3 className="text-xl font-semibold">
        Question {currentQuestionIndex + 1} of {words.length}
      </h3>
      <div className="text-3xl font-bold">{currentWord.arabic}</div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {currentOptions.map((option) => (
          <Button
            key={option}
            onClick={() => handleAnswerSelect(option)}
            className={`h-20 text-lg ${
              selectedAnswer === null
                ? ''
                : selectedAnswer === option
                ? option === currentWord.translation
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                : option === currentWord.translation && selectedAnswer !== null
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : ''
            }`}
            variant="outline"
            disabled={selectedAnswer !== null}
          >
            {option}
          </Button>
        ))}
      </div>
      {selectedAnswer && (
        <div className="mt-4">
          <Button onClick={handleNext}>Next Question</Button>
        </div>
      )}
    </div>
  );
}

function generateOptions(currentWord: Word, allWords: Word[]): string[] {
  const correctAnswer = currentWord.translation;
  const otherWords = allWords
    .filter(word => word.translation !== correctAnswer)
    .map(word => word.translation);
  
  const options = [correctAnswer, ...shuffleArray(otherWords).slice(0, 3)];
  return shuffleArray(options);
} 