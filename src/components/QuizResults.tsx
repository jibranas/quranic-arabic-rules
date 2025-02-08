import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ExampleDisplay } from './ExampleDisplay';

type QuestionType = 'vocabulary' | 'grammar' | 'partsOfSpeech';

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

interface Question {
  type: QuestionType;
  word: {
    arabic: string;
    translation: string;
    explanation: string;
    surah: string;
    ayah: number;
  };
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizResultsProps {
  rule?: Rule; // Optional because it might not exist when coming from Words tab
  questions: Question[];
  quizResults: { [key: string]: boolean[] };
  onComplete: (learnedWords: any[], quizResults: { [key: string]: boolean[] }) => void;
}

export function QuizResults({ rule, questions, quizResults, onComplete }: QuizResultsProps) {
  const analyzePerformance = (arabic: string) => {
    const results = quizResults[arabic] || [];
    const wordQuestions = questions.filter(q => q.word.arabic === arabic);
    
    if (!results.length) return null;

    const totalQuestions = results.length;
    const correctCount = results.filter(r => r).length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

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

  const getPerformanceColor = (arabic: string) => {
    const results = quizResults[arabic];
    if (!results || results.length === 0) return 'bg-white';
    
    const correctCount = results.filter(r => r).length;
    const percentage = (correctCount / results.length) * 100;
    
    if (percentage === 100) return 'bg-green-100';
    if (percentage === 0) return 'bg-red-100';
    return 'bg-yellow-100';
  };

  // Get unique words from questions to avoid duplicates
  const uniqueWords = Array.from(new Set(questions.map(q => q.word.arabic)))
    .map(arabic => questions.find(q => q.word.arabic === arabic)?.word)
    .filter((word): word is NonNullable<typeof word> => word !== undefined);

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Quiz Results</h2>
        <Button onClick={() => {
          const learnedWords = rule 
            ? rule.examples.map(example => ({
                arabic: example.arabic,
                translation: example.translation,
                rule: rule.rule,
                surah: example.surah,
                ayah: example.ayah,
                explanation: example.explanation
              }))
            : uniqueWords.map(word => ({
                arabic: word.arabic,
                translation: word.translation,
                surah: word.surah,
                ayah: word.ayah,
                explanation: word.explanation
              }));
          onComplete(learnedWords, quizResults);
        }}>Complete</Button>
      </div>
      <ScrollArea className="h-[calc(100vh-80px)] w-full p-4">
        <div className="space-y-6">
          {/* Overall Performance Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Overall Performance</h3>
            {(() => {
              const totalResults = Object.values(quizResults).flat();
              const totalCorrect = totalResults.filter(r => r).length;
              const overallPercentage = Math.round((totalCorrect / totalResults.length) * 100);
              
              return (
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{overallPercentage}%</div>
                  <div className="text-sm text-gray-600">
                    ({totalCorrect} correct out of {totalResults.length} questions)
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Individual Words */}
          {uniqueWords.map((word, index) => {
            const performance = analyzePerformance(word.arabic);
            
            return (
              <div 
                key={index}
                className={`${getPerformanceColor(word.arabic)} p-4 rounded-lg`}
              >
                <ExampleDisplay
                  surahId={word.surahId}
                  ayahNo={word.ayahNo}
                  words={word.words}
                />
                
                <div className="text-right mb-2">
                  <div className="text-2xl font-arabic">{word.arabic}</div>
                  <div className="text-lg text-gray-700">{word.translation}</div>
                </div>
                
                {performance && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Score:</span>
                      <span className="font-bold">{performance.percentage}%</span>
                    </div>
                    
                    {/* Performance breakdown by type */}
                    <div className="space-y-2 text-sm">
                      {Object.entries(performance.performanceByType).map(([type, stats]) => {
                        if (stats.total === 0) return null;
                        const typePercentage = Math.round((stats.correct / stats.total) * 100);
                        return (
                          <div key={type} className="flex justify-between items-center">
                            <span className="capitalize">{type}:</span>
                            <span className={typePercentage < 70 ? 'text-red-500' : 'text-green-500'}>
                              {stats.correct}/{stats.total} ({typePercentage}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Areas needing improvement */}
                    {performance.needsWorkOn.length > 0 && (
                      <div className="mt-2 text-sm text-red-600">
                        <p className="font-semibold">Areas to focus on:</p>
                        <ul className="list-disc list-inside">
                          {performance.needsWorkOn.map(type => (
                            <li key={type} className="capitalize">{type}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
} 