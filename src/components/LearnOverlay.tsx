import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
import { fetchVerse } from '../../data/verses';
import Lottie from 'lottie-react';
import ExampleDisplay from './ExampleDisplay';


interface Example {
  surahId: number;
  ayahNo: number;
  words: Array<{
    wordNo: number;
    segmentNo?: number;  // Add optional segmentNo
  }>;
  morphologyData?: {
    lemmaArabic: string;
    lemmaCode: string;
    pos: string;
  }[];
  explanation?: string;
  beforeInterlude?: InterludeSlide[];
  afterInterlude?: InterludeSlide[];
}

interface Rule {
  title: string;
  rule: string;
  introInterlude?: InterludeSlide[];
  vocabulary: {
    word: string;
    translation: string;
    type: string;
  }[];
  examples: Example[];
  conclusionInterlude?: InterludeSlide[];
}

interface InterludeSlide {
  type: string;
  content: string;
  caption?: string;
}

interface VocabularyWord {
  word: string;
  translation: string;
  type: string;
}

interface MorphologySegment {
  lemmaArabic: string;
  lemmaCode: string;
  pos: string;
  text: string;
  type: string;
}

interface ExampleWithMorphology extends Example {
  morphologyData?: MorphologySegment[][];  // Array of arrays - one array per word
}

interface LearnOverlayProps {
  rule: Rule;
  onComplete: (learnedWords: { 
    surahId: number;
    ayahNo: number;
    words: Array<{
      wordNo: number;
      segmentNo?: number;
    }>;
    translation: string;
    rule: string;
    explanation?: string;
  }[], quizResults: { [key: string]: boolean[] }) => void;
  onClose: () => void;
  generateVocabularyQuestion: (word: Word) => Question;
  generateGrammarQuestion: (word: Word) => Question;
  generatePartsOfSpeechQuestion: (word: Word) => Question | null;
  quizResults: { [key: string]: boolean[] };
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

// Add helper function to deduplicate text
const deduplicateText = (text: string): string => {
  const parts = text.split('');
  let result = '';
  let currentChar = '';
  let count = 0;

  for (const char of parts) {
    if (char === currentChar) {
      count++;
    } else {
      currentChar = char;
      count = 1;
      result += char;
    }
  }

  return result;
};

export function LearnOverlay({ 
  rule, 
  onComplete, 
  onClose,
  generateVocabularyQuestion,
  generateGrammarQuestion,
  generatePartsOfSpeechQuestion,
  quizResults 
}: LearnOverlayProps) {
  const [visibleExamples, setVisibleExamples] = useState<number[]>([]);
  const [showingExamples, setShowingExamples] = useState(false);
  const [showingWordSummary, setShowingWordSummary] = useState(false);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showingResults, setShowingResults] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [maxVisibleIndex, setMaxVisibleIndex] = useState(-1);
  const [loadedExamples, setLoadedExamples] = useState<ExampleWithMorphology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [vocabularyList, setVocabularyList] = useState<VocabularyWord[]>([]);

  // Add this useEffect to fetch morphology data when component mounts
  useEffect(() => {
    const fetchMorphologyData = async () => {
      setIsLoading(true);
      try {
        const examplesWithMorphology = await Promise.all(
          rule.examples.map(async (example) => {
            // Fetch morphology data for each word in the example
            const morphologyData = await Promise.all(
              example.words.map(async (wordNo) => {
                const response = await fetch('/api/morphology', {
                  method: 'POST',
                  body: JSON.stringify({
                    surahId: example.surahId,
                    ayahNo: example.ayahNo,
                    wordNo
                  })
                });
                
                if (!response.ok) {
                  throw new Error(`Morphology API error: ${response.status}`);
                }
                
                const data = await response.json();
                return data.segments || [];
              })
            );

            return {
              ...example,
              morphologyData
            };
          })
        );

        setLoadedExamples(examplesWithMorphology);
      } catch (error) {
        console.error('Error fetching morphology data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMorphologyData();
  }, [rule.examples]);

  // Update the translation fetching useEffect
  useEffect(() => {
    const fetchTranslations = async () => {
      const uniqueWords = new Map<string, VocabularyWord>();
      
      for (const example of loadedExamples) {
        for (const [wordIndex, wordSegments] of example.morphologyData?.entries() || []) {
          // Deduplicate segments and sort them
          const uniqueSegments = Array.from(
            new Map(
              wordSegments
                .sort((a, b) => (a.segmentNo || 0) - (b.segmentNo || 0))
                .map(seg => [seg.segmentNo, seg])
            ).values()
          );

          // Combine unique segments to form the complete word
          const completeWord = uniqueSegments.map(s => s.text || '').join('');
          
          if (completeWord && !uniqueWords.has(completeWord)) {
            const translationKey = `${example.surahId}:${example.ayahNo}:${example.words[wordIndex].wordNo}`;
            
            try {
              const response = await fetch('/api/translation', {
                method: 'POST',
                body: JSON.stringify({ key: translationKey })
              });

              if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
              }

              const data = await response.json();
              const translation = data[translationKey] || 'Translation not available';

              uniqueWords.set(completeWord, {
                word: completeWord,
                translation: translation,
                // Use the type of the main segment (usually the first non-prefix segment)
                type: uniqueSegments.find(s => s.pos)?.pos || 'Unknown'
              });
            } catch (error) {
              console.error('Error fetching translation:', error);
              uniqueWords.set(completeWord, {
                word: completeWord,
                translation: 'Translation error',
                type: uniqueSegments.find(s => s.pos)?.pos || 'Unknown'
              });
            }
          }
        }
      }
      
      setVocabularyList(Array.from(uniqueWords.values()));
    };

    if (loadedExamples.length > 0) {
      fetchTranslations();
    }
  }, [loadedExamples]);

  // Update the learning sequence generation to use the rule prop
  const learningSequence = useMemo(() => {
    const sequence = [];
    
    // Add intro interlude slides if they exist
    if (rule.introInterlude) {
      sequence.push(...rule.introInterlude.map(slide => ({
        type: 'interlude' as const,
        content: slide
      })));
    }
    
    // Add examples with their associated interludes
    rule.examples.forEach(example => {
      // Add before interlude if it exists
      if (example.beforeInterlude) {
        sequence.push(...example.beforeInterlude.map(slide => ({
          type: 'interlude' as const,
          content: slide
        })));
      }
      
      // Add the example
      sequence.push({
        type: 'example' as const,
        content: example
      });
      
      // Add after interlude if it exists
      if (example.afterInterlude) {
        sequence.push(...example.afterInterlude.map(slide => ({
          type: 'interlude' as const,
          content: slide
        })));
      }
    });
    
    // Add conclusion interlude slides if they exist
    if (rule.conclusionInterlude) {
      sequence.push(...rule.conclusionInterlude.map(slide => ({
        type: 'interlude' as const,
        content: slide
      })));
    }
    
    return sequence;
  }, [rule]); // Only depend on the rule prop

  const progress = ((currentIndex + 1) / learningSequence.length) * 100;

  // Add scroll function
  const scrollToItem = useCallback((index: number) => {
    const element = itemRefs.current[index];
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  }, []);

  // Update showNextItem to include scrolling
  const showNextItem = useCallback(() => {
    if (currentIndex < learningSequence.length - 1) {
      const nextIndex = currentIndex + 1;
      setMaxVisibleIndex(nextIndex);
      setCurrentIndex(nextIndex);
      // Add a small delay to ensure the item is rendered before scrolling
      setTimeout(() => scrollToItem(nextIndex), 100);
    } else {
      setShowingWordSummary(true);
    }
  }, [currentIndex, learningSequence.length, scrollToItem]);

  // Add effect to handle audio playback when currentIndex changes
  useEffect(() => {
    if (currentIndex >= 0 && learningSequence[currentIndex]?.type === 'example') {
      const example = learningSequence[currentIndex].content as Example;
      
      if (example?.audio) {
        const cleanupAudio = () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
          }
        };

        cleanupAudio(); // Cleanup any existing audio

        const audio = new Audio(example.audio);
        audioRef.current = audio;
        
        audio.addEventListener('canplaythrough', () => {
          audio.play().catch(error => console.log('Audio playback failed:', error));
        });

        return cleanupAudio;
      }
    }
  }, [currentIndex, learningSequence]);

  // Add handleAudioPlay function for manual replay
  const handleAudioPlay = (example: Example) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.log('Audio playback failed:', error));
    } else if (example.audio) {
      const audio = new Audio(example.audio);
      audioRef.current = audio;
      audio.play().catch(error => console.log('Audio playback failed:', error));
    }
  };

  const handleComplete = () => {
    const learnedWords = rule.examples.map(example => ({
      surahId: example.surahId,
      ayahNo: example.ayahNo,
      words: example.words,
      translation: example.translation,
      rule: rule.rule,
      explanation: example.explanation
    }));
    onComplete(learnedWords, quizResults);
  };

  const handleStartQuiz = () => {
    // Create a pool of questions for each type
    const vocabularyQuestions = rule.examples.map(example => {
      const wordFromExample: Word = {
        ...example,
        rule: rule.rule
      };
      return generateVocabularyQuestion(wordFromExample);
    });

    const grammarQuestions = rule.examples.map(example => {
      const wordFromExample: Word = {
        ...example,
        rule: rule.rule
      };
      return generateGrammarQuestion(wordFromExample);
    });

    const partsOfSpeechQuestions = rule.examples
      .map(example => {
        const wordFromExample: Word = {
          ...example,
          rule: rule.rule
        };
        return generatePartsOfSpeechQuestion(wordFromExample);
      })
      .filter((q): q is Question => q !== null);

    // Ensure we have at least one of each type where possible
    const selectedQuestions: Question[] = [];

    // Add one vocabulary question
    if (vocabularyQuestions.length > 0) {
      selectedQuestions.push(shuffleArray(vocabularyQuestions)[0]);
    }

    // Add one grammar question
    if (grammarQuestions.length > 0) {
      selectedQuestions.push(shuffleArray(grammarQuestions)[0]);
    }

    // Add one parts of speech question if available
    if (partsOfSpeechQuestions.length > 0) {
      selectedQuestions.push(shuffleArray(partsOfSpeechQuestions)[0]);
    }

    // Fill remaining slots with random questions
    const remainingSlots = 5 - selectedQuestions.length;
    const remainingQuestions = shuffleArray([
      ...vocabularyQuestions,
      ...grammarQuestions,
      ...partsOfSpeechQuestions
    ]).filter(q => !selectedQuestions.some(sq => 
      sq.word.arabic === q.word.arabic && sq.type === q.type
    ));

    selectedQuestions.push(...remainingQuestions.slice(0, remainingSlots));

    setQuestions(shuffleArray(selectedQuestions));
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
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Words Learned2</h2>
          <Button onClick={handleComplete} variant="ghost">
            Complete <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {vocabularyList.map((word, index) => (
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
                  <p className="text-xs text-gray-500">
                    {word.type === 'N' ? 'Noun' : 
                     word.type === 'V' ? 'Verb' : 
                     word.type === 'P' ? 'Particle' : 
                     word.type}
                  </p>
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
        </ScrollArea>
      </div>
    );
  }

  // Add loading state handling
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  // Update the renderExample function to handle the new word format
  const renderExample = (example: ExampleWithMorphology) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 bg-gray-50 rounded-lg shadow-sm"
    >
      <ExampleDisplay
        surahId={example.surahId}
        ayahNo={example.ayahNo}
        words={example.words.map(word => ({
          wordNo: typeof word === 'number' ? word : word.wordNo,
          segmentNo: typeof word === 'number' ? undefined : word.segmentNo
        }))}
        exampleId={`${example.surahId}-${example.ayahNo}`}
      />
      {example.explanation && (
        <p className="text-sm text-gray-600 mt-4 px-4 pb-4">
          <strong>Explanation:</strong> {example.explanation}
        </p>
      )}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white">
        <div className="flex justify-between items-center p-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="w-full max-w-md mx-4">
            <div className="h-2 rounded-full bg-gray-200">
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

          {learningSequence.map((item, index) => (
            <motion.div
              key={index}
              ref={el => itemRefs.current[index] = el}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: index <= maxVisibleIndex ? 1 : 0,
                y: index <= maxVisibleIndex ? 0 : 20 
              }}
              transition={{ duration: 0.5 }}
              className={`mb-8 ${index > maxVisibleIndex ? 'hidden' : ''}`}
            >
              {item.type === 'interlude' 
                ? renderInterludeSlide(item.content)
                : renderExample(item.content)}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed button at bottom */}
      {currentIndex < learningSequence.length - 1 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            onClick={showNextItem}
            className="w-full"
          >
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {currentIndex === learningSequence.length - 1 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button 
            onClick={() => setShowingWordSummary(true)}
            className="w-full"
          >
            Complete Lesson
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Add VerseModal at the end of the component */}
      {isVerseModalOpen && selectedExample && (
        <VerseModal
          isOpen={isVerseModalOpen}
          onClose={() => setIsVerseModalOpen(false)}
          verse={{
            surah: selectedExample.surah,
            ayah: selectedExample.ayah,
            highlightText: selectedExample.arabic
          }}
        />
      )}
    </div>
  );
}
// Render an interlude slide
const renderInterludeSlide = (slide: InterludeSlide) => {
  switch (slide.type) {
    case 'text':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose max-w-none w-full"
        >
          <div dangerouslySetInnerHTML={{ __html: slide.content }} />
        </motion.div>
      );
    
    case 'image':
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img 
            src={slide.content} 
            alt={slide.caption || ''} 
            className="max-w-full max-h-[60vh] object-contain mx-auto"
          />
          {slide.caption && (
            <p className="text-center text-sm text-gray-600 mt-2">
              {slide.caption}
            </p>
          )}
        </motion.div>
      );

    case 'animation':
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Lottie
            animationData={JSON.parse(slide.content)}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '300px' }}
          />
        </motion.div>
      );
  }
};
