import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Word, Question } from "@/types/arabic";
import { shuffleArray } from "@/lib/utils";

interface QuizProps {
  words: Word[];
  onQuizComplete: (results: { [key: string]: boolean }) => void;
  initialQuestions?: Question[];
}

export function Quiz({ words, onQuizComplete, initialQuestions }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: boolean }>({});
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) {
      setQuestions(initialQuestions);
    }
  }, [initialQuestions]);

  if (!questions.length) {
    return <div>No questions available</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    onQuizComplete(results);
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p>Check your results in the Words tab</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    setSelectedAnswer(answer);
    setResults(prev => ({
      ...prev,
      [currentQuestion.word.arabic]: isCorrect
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <h3 className="text-xl font-semibold">
        Question {currentQuestionIndex + 1} of {questions.length}
      </h3>
      <div className="text-2xl font-bold text-center max-w-[80%] mb-8">
        {currentQuestion.question}
      </div>
      <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          const showFeedback = selectedAnswer !== null;

          let buttonClasses = "min-h-[60px] text-base p-4 whitespace-normal text-left ";
          if (showFeedback) {
            if (isCorrect) {
              buttonClasses += "bg-green-500 hover:bg-green-600 text-white";
            } else if (isSelected) {
              buttonClasses += "bg-red-500 hover:bg-red-600 text-white";
            }
          }

          return (
            <Button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={buttonClasses}
              variant="outline"
              disabled={selectedAnswer !== null}
            >
              {option}
            </Button>
          );
        })}
      </div>
      {selectedAnswer && (
        <div className="mt-4">
          <Button onClick={handleNext}>Next Question</Button>
        </div>
      )}
    </div>
  );
} 