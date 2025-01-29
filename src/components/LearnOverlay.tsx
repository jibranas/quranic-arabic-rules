import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { X, Volume2, ChevronRight, CheckIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerseModal } from "@/components/VerseModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizOverlay } from "@/components/QuizOverlay";
import { shuffleArray } from "@/lib/utils";
import { rules } from '../../data/rules';
import { QuizResults } from "@/components/QuizResults";
import { Question, Word } from "@/types/arabic";

interface Example {
  arabic: string;
  lemma: string | string[];
  translation: string;
  explanation: string;
  surah: string;
  audio: string;
  ayah: number;
}

interface Rule {
  title: string;
  rule: string;
  vocabulary: {
    word: string;
    translation: string;
    type: string;
  }[];
  examples: Example[];
}

interface LearnOverlayProps {
  rule: Rule;
  verseDetails: { [key: string]: { arabic: string; translation: string } };
  onComplete: (learnedWords: { arabic: string; translation: string; rule: string; surah: string; ayah: number; explanation: string }[], quizResults: { [key: string]: boolean[] }) => void;
  onClose: () => void;
}

// Add this type if not already defined
type QuestionType = 'vocabulary' | 'grammar' | 'partsOfSpeech';

// Helper function to analyze performance
const analyzePerformance = (
  arabic: string,
  quizResults: { [key: string]: boolean[] },
  questions: Question[]
) => {
  const results = quizResults[arabic] || [];
  const wordQuestions = questions.filter(q => q.word.arabic === arabic);
  
  if (!results.length) return null;

  const totalQuestions = results.length;
  const correctCount = results.filter(r => r).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Analyze performance by question type
  const performanceByType: Record<QuestionType, { total: number; correct: number }> = {
    vocabulary: { total: 0, correct: 0 },
    grammar: { total: 0, correct: 0 },
    partsOfSpeech: { total: 0, correct: 0 }
  };

  wordQuestions.forEach((q, index) => {
    performanceByType[q.type].total++;
    if (results[index]) {
      performanceByType[q.type].correct++;
    }
  });

  return {
    percentage,
    performanceByType,
    needsWorkOn: Object.entries(performanceByType)
      .filter(([_, stats]) => stats.total > 0 && (stats.correct / stats.total) < 0.7)
      .map(([type]) => type)
  };
};

export function LearnOverlay({ rule, verseDetails, onComplete, onClose }: LearnOverlayProps) {
  const [visibleExamples, setVisibleExamples] = useState<number[]>([]);
  const [showingExamples, setShowingExamples] = useState(false);
  const [showingWordSummary, setShowingWordSummary] = useState(false);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const exampleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean[] }>({});
  const [showingResults, setShowingResults] = useState(false);
  
  const progress = showingExamples 
    ? (visibleExamples.length / rule.examples.length) * 100 
    : 0;

  // Auto-play audio when a new example becomes visible
  useEffect(() => {
    if (showingExamples && visibleExamples.length > 0) {
      const latestExampleIndex = visibleExamples[visibleExamples.length - 1];
      const currentExample = rule.examples[latestExampleIndex];

      if (currentExample?.audio) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        audioRef.current = new Audio(currentExample.audio);
        audioRef.current.play().catch(error => console.log('Audio playback failed:', error));

        return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
        };
      }
    }
  }, [visibleExamples.length, showingExamples]);

  const handleAudioPlay = (example: Example) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.log('Audio playback failed:', error));
    } else if (example.audio) {
      audioRef.current = new Audio(example.audio);
      audioRef.current.play().catch(error => console.log('Audio playback failed:', error));
    }
  };

  const showNextExample = () => {
    if (visibleExamples.length < rule.examples.length) {
      const nextIndex = visibleExamples.length;
      setVisibleExamples(prev => [...prev, nextIndex]);
      
      // Scroll to the new example after it's rendered
      setTimeout(() => {
        exampleRefs.current[nextIndex]?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } else {
      setShowingWordSummary(true);
    }
  };

  const handleComplete = () => {
    const learnedWords = rule.examples.map(example => ({
      arabic: example.arabic,
      translation: example.translation,
      rule: rule.rule,
      surah: example.surah,
      ayah: example.ayah,
      explanation: example.explanation
    }));
    onComplete(learnedWords, quizResults);
  };

  // Add these helper functions from ArabicGrammarApp
  const generateVocabularyQuestion = (word: Word): Question => {
    const otherTranslations = rule.examples
      .filter(w => w.translation !== word.translation)
      .map(w => w.translation);
    
    const otherOptions = shuffleArray(otherTranslations).slice(0, 3);
    const options = shuffleArray([word.translation, ...otherOptions]);

    return {
      type: 'vocabulary' as const,
      word,
      question: `What is the translation of: "${word.arabic}"?`,
      options,
      correctAnswer: word.translation
    };
  };

  const generateGrammarQuestion = (word: Word): Question => {
    const correctRule = 'In Arabic, verbs may come before the subject in a sentence.';

    const otherRules = rules
      .map(r => r.rule)
      .filter(rule => rule !== correctRule && rule && rule.trim() !== '');

    const options = shuffleArray([correctRule, ...otherRules])
      .filter(option => option && option.trim() !== '');

    return {
      type: 'grammar' as const,
      word,
      question: `What grammar rule is demonstrated in: "${word.arabic}"?`,
      options,
      correctAnswer: correctRule
    };
  };

  const generatePartsOfSpeechQuestion = (word: Word): Question | null => {
    if (word.explanation.includes("verb") && word.explanation.includes("subject")) {
      const verbMatch = word.explanation.match(/The verb '([^']+)'/);
      const subjectMatch = word.explanation.match(/subject '([^']+)'/);

      if (!verbMatch || !subjectMatch) return null;

      const verb = verbMatch[1];
      const subject = subjectMatch[1];

      const isIdentifyPartQuestion = Math.random() > 0.5;

      if (isIdentifyPartQuestion) {
        const targetWord = Math.random() > 0.5 ? verb : subject;
        return {
          type: 'partsOfSpeech' as const,
          word,
          question: `What part of speech is "${targetWord}" in "${word.arabic}"?`,
          options: ['Verb', 'Subject (Noun)'],
          correctAnswer: targetWord === verb ? 'Verb' : 'Subject (Noun)'
        };
      } else {
        const targetPart = Math.random() > 0.5 ? 'verb' : 'subject';
        return {
          type: 'partsOfSpeech' as const,
          word,
          question: `Which word is the ${targetPart} in "${word.arabic}"?`,
          options: [verb, subject],
          correctAnswer: targetPart === 'verb' ? verb : subject
        };
      }
    }
    
    if (word.explanation.includes("adjective") && word.explanation.includes("noun")) {
      const nounMatch = word.explanation.match(/noun '([^']+)'/);
      const adjectiveMatch = word.explanation.match(/adjective '([^']+)'/);

      if (!nounMatch || !adjectiveMatch) return null;

      const noun = nounMatch[1];
      const adjective = adjectiveMatch[1];

      const isIdentifyPartQuestion = Math.random() > 0.5;

      if (isIdentifyPartQuestion) {
        const targetWord = Math.random() > 0.5 ? noun : adjective;
        return {
          type: 'partsOfSpeech' as const,
          word,
          question: `What part of speech is "${targetWord}" in "${word.arabic}"?`,
          options: ['Noun', 'Adjective'],
          correctAnswer: targetWord === noun ? 'Noun' : 'Adjective'
        };
      } else {
        const targetPart = Math.random() > 0.5 ? 'noun' : 'adjective';
        return {
          type: 'partsOfSpeech' as const,
          word,
          question: `Which word is the ${targetPart} in "${word.arabic}"?`,
          options: [noun, adjective],
          correctAnswer: targetPart === 'noun' ? noun : adjective
        };
      }
    }

    return null;
  };

  const handleStartQuiz = () => {
    const allQuestions = rule.examples.flatMap(example => {
      // Always generate vocabulary and grammar questions
      const questions = [
        generateVocabularyQuestion(example),
        generateGrammarQuestion(example)
      ];
      
      // Try to generate parts of speech question
      const partsOfSpeechQ = generatePartsOfSpeechQuestion(example);
      if (partsOfSpeechQ) {
        questions.push(partsOfSpeechQ);
      }
      
      console.log('Generated questions for example:', example.arabic, questions);
      return questions;
    });

    console.log('All questions:', allQuestions);
    setQuestions(shuffleArray(allQuestions));
    setIsQuizActive(true);
    setShowingWordSummary(false);
  };

  const handleQuizComplete = useCallback((results: { [key: string]: boolean[] }) => {
    setQuizResults(results);
    setIsQuizActive(false);
    setShowingResults(true);
  }, []);

  if (showingResults) {
    return (
      <QuizResults
        rule={rule}
        questions={questions}
        quizResults={quizResults}
        onComplete={onComplete}
      />
    );
  }

  if (isQuizActive) {
    return (
      <QuizOverlay
        questions={questions}
        onComplete={handleQuizComplete}
        onClose={() => setIsQuizActive(false)}
      />
    );
  }

  if (showingWordSummary) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="p-4 flex justify-between items-center border-b">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
          <h2 className="text-xl font-bold">New Words Learned</h2>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {rule.vocabulary.map((word, index) => (
              <motion.div
                key={word.word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
              >
                <div>
                  <p className="text-xl font-arabic mb-1">{word.word}</p>
                  <p className="text-sm text-gray-600">{word.translation}</p>
                  <p className="text-xs text-gray-500">{word.type}</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="bg-green-100 p-2 rounded-full"
                >
                  <CheckIcon className="w-5 h-5 text-green-600" />
                </motion.div>
              </motion.div>
            ))}
          </div>
          <Button 
            onClick={handleStartQuiz}
            className="w-full mt-8"
          >
            Start Practice Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header with progress and close button */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="w-full max-w-md mx-4">
            <div className="h-2 rounded-full">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="w-6" />
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="pt-16 pb-24 h-full overflow-y-auto">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">{rule.title}</h2>
            <p className="text-gray-600">{rule.rule}</p>
          </div>

          {!showingExamples ? (
            <Button 
              onClick={() => {
                setShowingExamples(true);
                showNextExample();
              }}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 mb-4"
            >
              Start Examples
            </Button>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {visibleExamples.map((index) => {
                  const example = rule.examples[index];
                  return (
                    <motion.div
                      key={index}
                      ref={el => exampleRefs.current[index] = el}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <div className="text-right mb-4">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleAudioPlay(example)}
                            className="h-8 w-8 text-blue-500"
                            title="Play Audio"
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <div className="text-2xl font-arabic">{example.arabic}</div>
                        </div>
                        <div className="text-lg text-gray-700">{example.translation}</div>
                        <button 
                          onClick={() => {
                            setSelectedExample(example);
                            setIsVerseModalOpen(true);
                          }}
                          className="text-xs mb-2 text-right text-blue-500 hover:text-blue-700 hover:underline block w-full"
                        >
                          Surah {example.surah}, Ayah {example.ayah}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Explanation:</strong> {example.explanation}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Fixed button at bottom */}
      {showingExamples && visibleExamples.length < rule.examples.length && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            onClick={showNextExample}
            className="w-full"
          >
            Next Example
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {showingExamples && visibleExamples.length === rule.examples.length && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            onClick={() => setShowingWordSummary(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
          >
            See New Words
          </Button>
        </div>
      )}

      {/* Verse Modal */}
      {isVerseModalOpen && selectedExample && (
        <VerseModal
          isOpen={isVerseModalOpen}
          onClose={() => setIsVerseModalOpen(false)}
          verse={{
            arabic: verseDetails[`${selectedExample.surah}-${selectedExample.ayah}`]?.arabic || selectedExample.arabic,
            translation: verseDetails[`${selectedExample.surah}-${selectedExample.ayah}`]?.translation || selectedExample.translation,
            surah: selectedExample.surah,
            ayah: selectedExample.ayah,
            highlightText: selectedExample.arabic
          }}
        />
      )}
    </div>
  );
}