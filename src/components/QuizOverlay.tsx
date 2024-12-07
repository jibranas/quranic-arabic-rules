import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Word, Question } from "@/types/arabic";
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizOverlayProps {
  questions: Question[];
  onComplete: (results: { [key: string]: boolean[] }) => void;
  onClose: () => void;
}

export function QuizOverlay({ questions, onComplete, onClose }: QuizOverlayProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [results, setResults] = useState<{ [key: string]: boolean[] }>({});

  const progress = (currentQuestionIndex / questions.length) * 100;

  if (currentQuestionIndex >= questions.length) {
    onComplete(results);
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="mb-4">Check your results in the Words tab</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    setSelectedAnswer(answer);
    setResults(prev => ({
      ...prev,
      [currentQuestion.word.arabic]: [
        ...(prev[currentQuestion.word.arabic] || []),
        isCorrect
      ]
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header with progress and close button */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md">
        <div className="flex justify-between items-center p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="w-full max-w-md mx-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Quiz content */}
      <div className="pt-16 flex flex-col items-center justify-center p-8 space-y-6 h-full">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Button onClick={handleNext} size="lg">
              Continue
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
} 