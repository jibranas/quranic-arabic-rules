"use client"

import React, { useState, useEffect, useRef } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { BookOpen, List, User, ChevronRight, Brain, Volume2, Book } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Quiz } from "@/components/Quiz"
import { VerseModal } from "@/components/VerseModal"
import { Word } from "@/types/arabic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { CheckIcon } from 'lucide-react'
import { shuffleArray } from "@/lib/utils"
import { QuizOverlay } from "@/components/QuizOverlay"
import { LearnOverlay } from "@/components/LearnOverlay"
import { QuranOverlay } from "@/components/QuranOverlay"
import { rules as initialRules } from '../../data/rules'
import { verses as VERSE_DETAILS } from '../../data/verses'
import { LettersOverlay } from "@/components/LettersOverlay"

interface VerseDetail {
  arabic: string;
  translation: string;
}

interface VerseDetails {
  [key: string]: VerseDetail;
}

interface Question {
  type: 'vocabulary' | 'grammar' | 'partsOfSpeech';
  word: {
    arabic: string;
    translation: string;
    rule: string;
    surah: string;
    ayah: number;
    explanation: string;
  };
  question: string;
  options: string[];
  correctAnswer: string;
}

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

const ArabicGrammarApp = () => {
  // Move audioRef to parent component
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [learnedWords, setLearnedWords] = useState<{ arabic: string; translation: string; rule: string; surah: string; ayah: number; explanation: string }[]>([])
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showingExamples, setShowingExamples] = useState(false)
  const [showingVocabulary, setShowingVocabulary] = useState(false)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0)
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("contents")
  const [expandedWordIndex, setExpandedWordIndex] = useState<number | null>(null)
  const [rules, setRules] = useState(initialRules);

  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean[] }>({});
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)
  const [isQuizActive, setIsQuizActive] = useState(false);

  const totalQuranWords = 77430 // Total words in the Quran
  const progress = (learnedWords.length / totalQuranWords) * 100

  // Add new state for tracking covered examples
  const [coveredExamples, setCoveredExamples] = useState<Set<string>>(new Set());
  // Add state for showing word summary
  const [showingWordSummary, setShowingWordSummary] = useState(false);

  // Add these two new state variables
  const [isLearningActive, setIsLearningActive] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  // Add new state variable for LettersOverlay
  const [isLettersActive, setIsLettersActive] = useState(false);

  // Function to get vocabulary for covered examples
  const getCoveredVocabulary = () => {
    const currentRule = rules[currentRuleIndex];
    const coveredVocab = new Set<string>();
    
    currentRule.examples.forEach(example => {
      if (coveredExamples.has(example.arabic)) {
        // Handle both single and array lemmas
        const lemmas = Array.isArray(example.lemma) ? example.lemma : [example.lemma];
        lemmas.forEach(lemma => {
          const vocabWord = currentRule.vocabulary.find(v => v.word === lemma);
          if (vocabWord) {
            coveredVocab.add(vocabWord.word);
          }
        });
      }
    });

    return currentRule.vocabulary.filter(v => coveredVocab.has(v.word));
  };

  // Modify showNextRule to use the moved audioRef
  const showNextRule = () => {
    // Clean up audio if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!showingWordSummary && coveredExamples.size > 0) {
      setShowingWordSummary(true);
      setShowingExamples(false);
      return;
    }

    // Reset states and move to next rule
    setShowingWordSummary(false);
    setCoveredExamples(new Set());
    let nextRuleIndex = (currentRuleIndex + 1) % rules.length;
    setCurrentRuleIndex(nextRuleIndex);
    setCurrentExampleIndex(0);
    setShowingExamples(false);
  };

  // Modify useEffect to track covered examples
  useEffect(() => {
    if (showingExamples) {
      const currentExample = rules[currentRuleIndex].examples[currentExampleIndex];
      setCoveredExamples(prev => new Set(prev).add(currentExample.arabic));
      
      if (!learnedWords.some(word => word.arabic === currentExample.arabic)) {
        setLearnedWords(prevWords => [...prevWords, {
          arabic: currentExample.arabic,
          translation: currentExample.translation,
          rule: rules[currentRuleIndex].rule,
          surah: currentExample.surah,
          ayah: currentExample.ayah,
          explanation: currentExample.explanation
        }]);
      }
    }
  }, [currentExampleIndex, currentRuleIndex, showingExamples]);

  console.log("learnedWords", learnedWords)

  // Add WordSummary component
  const WordSummary = () => {
    const coveredVocab = getCoveredVocabulary();

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">New Words You've Learned</h2>
        <div className="grid gap-4">
          {coveredVocab.map((word, index) => (
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
          onClick={showNextRule}
          className="w-full mt-4"
        >
          Next Rule
        </Button>
      </div>
    );
  };

  const showNextExample = () => {
    const currentRule = rules[currentRuleIndex];
    if (currentExampleIndex < currentRule.examples.length - 1) {
      // Still have examples in current rule
      setCurrentExampleIndex(currentExampleIndex + 1);
    } else {
      // Clean up audio before showing word summary
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setShowingExamples(false);
      showNextRule();
    }
  };

  const navigateToRule = (rule: Rule) => {
    setSelectedRule(rule);
    setIsLearningActive(true);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      setIsSubmitSuccess(true);
      setEmail('');
      setError('');
      
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextVocab = () => {
    if (currentVocabIndex < rules[currentRuleIndex].vocabulary.length - 1) {
      setCurrentVocabIndex(currentVocabIndex + 1);
    } else {
      setShowingVocabulary(false);
      setShowingExamples(true);
      setCurrentVocabIndex(0);
    }
  };

  // Move these functions inside the component
  const generateVocabularyQuestion = (word: Word): Question => {
    // Get other translations as options, excluding the current word's translation
    const otherTranslations = learnedWords
      .filter(w => w.translation !== word.translation)
      .map(w => w.translation);
    
    // Shuffle and take first 3 other translations
    const otherOptions = shuffleArray(otherTranslations).slice(0, 3);
    
    // Always include the correct answer and shuffle final options
    const options = shuffleArray([
      word.translation,  // Ensure correct answer is included
      ...otherOptions
    ]);

    return {
      type: 'vocabulary',
      word,
      question: `What is the translation of: "${word.arabic}"?`,
      options,
      correctAnswer: word.translation
    };
  };

  const generateGrammarQuestion = (word: Word): Question => {
    // Filter out the current rule to create options
    const otherRules = rules
      .map(r => r.rule)
      .filter(rule => rule !== word.rule);

    return {
      type: 'grammar',
      word,
      question: `What grammar rule is demonstrated in: "${word.arabic}"?`,
      options: shuffleArray([word.rule, ...otherRules]).slice(0, 4),
      correctAnswer: word.rule
    };
  };

  const generatePartsOfSpeechQuestion = (word: Word): Question | null => {
    // Handle verb-subject rule
    if (word.rule.includes("verbs may come before the subject")) {
      const verbMatch = word.explanation.match(/The verb '([^']+)'/);
      const subjectMatch = word.explanation.match(/subject '([^']+)'/);

      if (!verbMatch || !subjectMatch) return null;

      const verb = verbMatch[1];
      const subject = subjectMatch[1];

      const isIdentifyPartQuestion = Math.random() > 0.5;

      if (isIdentifyPartQuestion) {
        const targetWord = Math.random() > 0.5 ? verb : subject;
        return {
          type: 'partsOfSpeech',
          word,
          question: `What part of speech is "${targetWord}" in "${word.arabic}"?`,
          options: ['Verb', 'Subject (Noun)'],
          correctAnswer: targetWord === verb ? 'Verb' : 'Subject (Noun)'
        };
      } else {
        const targetPart = Math.random() > 0.5 ? 'verb' : 'subject';
        return {
          type: 'partsOfSpeech',
          word,
          question: `Which word is the ${targetPart} in "${word.arabic}"?`,
          options: [verb, subject],
          correctAnswer: targetPart === 'verb' ? verb : subject
        };
      }
    }
    
    // Handle adjective rule
    if (word.rule.includes("adjectives come after the noun")) {
      const nounMatch = word.explanation.match(/noun '([^']+)'/);
      const adjectiveMatch = word.explanation.match(/adjective '([^']+)'/);

      if (!nounMatch || !adjectiveMatch) return null;

      const noun = nounMatch[1];
      const adjective = adjectiveMatch[1];

      const isIdentifyPartQuestion = Math.random() > 0.5;

      if (isIdentifyPartQuestion) {
        const targetWord = Math.random() > 0.5 ? noun : adjective;
        return {
          type: 'partsOfSpeech',
          word,
          question: `What part of speech is "${targetWord}" in "${word.arabic}"?`,
          options: ['Noun', 'Adjective'],
          correctAnswer: targetWord === noun ? 'Noun' : 'Adjective'
        };
      } else {
        const targetPart = Math.random() > 0.5 ? 'noun' : 'adjective';
        return {
          type: 'partsOfSpeech',
          word,
          question: `Which word is the ${targetPart} in "${word.arabic}"?`,
          options: [noun, adjective],
          correctAnswer: targetPart === 'noun' ? noun : adjective
        };
      }
    }

    return null;
  };

 

  const WordsTab = () => {
    const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
    const [expandedWordIndex, setExpandedWordIndex] = useState<number | null>(null);
    const [selectedVerse, setSelectedVerse] = useState<{
      arabic: string;
      translation: string;
      surah: string;
      ayah: number;
      highlightText: string;
    } | null>(null);
    // Add new state for view type
    const [viewType, setViewType] = useState<'words' | 'rules'>('words');

    // Get all vocabulary words from rules
    const vocabularyWords = rules.flatMap(rule => 
      rule.vocabulary.map(v => v.word)
    );

    // Group examples by vocabulary words using lemma
    const groupedWords = vocabularyWords.reduce((acc, vocabWord) => {
      acc[vocabWord] = learnedWords.filter(example => {
        // Find the original example in rules to get its lemma
        const ruleExample = rules.flatMap(rule => rule.examples)
          .find(ex => ex.arabic === example.arabic);
        
        // Handle both single lemma and array of lemmas
        if (Array.isArray(ruleExample?.lemma)) {
          return ruleExample.lemma.includes(vocabWord);
        }
        return ruleExample?.lemma === vocabWord;
      });
      return acc;
    }, {} as { [key: string]: typeof learnedWords });

    const handleVerseClick = (example: typeof learnedWords[0]) => {
      setSelectedVerse({
        arabic: VERSE_DETAILS[`${example.surah}-${example.ayah}`]?.arabic || '',
        translation: VERSE_DETAILS[`${example.surah}-${example.ayah}`]?.translation || '',
        surah: example.surah,
        ayah: example.ayah,
        highlightText: example.arabic
      });
      setIsVerseModalOpen(true);
    };

    // Modify function to check performance for a specific example
    const getExamplePerformance = (arabic: string) => {
      // Get all results for this example
      const exampleResults = quizResults[arabic];
      
      if (!exampleResults || exampleResults.length === 0) return null;

      const correctAnswers = exampleResults.filter(isCorrect => isCorrect).length;
      
      console.log('Example:', arabic);
      console.log('Results:', exampleResults);
      console.log('Correct answers:', correctAnswers);
      console.log('Total questions:', exampleResults.length);

      // All correct - green
      if (correctAnswers === exampleResults.length) {
        console.log('Returning green');
        return 'green';
      }
      // All wrong - red
      if (correctAnswers === 0) {
        console.log('Returning red');
        return 'red';
      }
      // Some correct - yellow
      console.log('Returning yellow');
      return 'yellow';
    };

    // Modify handlePracticeExample
    const handlePracticeExample = (example: typeof learnedWords[0]) => {
      const exampleQuestions = [
        generateVocabularyQuestion(example),
        generateGrammarQuestion(example)
      ];
      
      const partsOfSpeechQ = generatePartsOfSpeechQuestion(example);
      if (partsOfSpeechQ) {
        exampleQuestions.push(partsOfSpeechQ);
      }

      setQuestions(shuffleArray(exampleQuestions));
      setIsQuizActive(true);
    };

    // Modify handlePracticeAllWords
    const handlePracticeAllWords = () => {
      const allQuestions = learnedWords.flatMap(word => {
        const questions = [
          generateVocabularyQuestion(word),
          generateGrammarQuestion(word)
        ];
        
        const partsOfSpeechQ = generatePartsOfSpeechQuestion(word);
        if (partsOfSpeechQ) {
          questions.push(partsOfSpeechQ);
        }
        
        return questions;
      });

      setQuestions(shuffleArray(allQuestions));
      setIsQuizActive(true);
    };

    // Keep getPerformanceStats the same
    const getPerformanceStats = (examples: typeof learnedWords) => {
      let green = 0, yellow = 0, red = 0;
      
      examples.forEach(example => {
        const performance = getExamplePerformance(example.arabic);
        if (performance === 'green') green++;
        else if (performance === 'yellow') yellow++;
        else if (performance === 'red') red++;
      });
      
      return { green, yellow, red };
    };

    // Replace PerformanceIndicators with new version
    const PerformanceBar = ({ stats }: { stats: { green: number, yellow: number, red: number } }) => {
      const total = stats.green + stats.yellow + stats.red;
      if (total === 0) return null;

      const greenWidth = (stats.green / total) * 100;
      const yellowWidth = (stats.yellow / total) * 100;
      const redWidth = (stats.red / total) * 100;

      return (
        <div className="flex w-20 h-2 rounded-full overflow-hidden bg-gray-200">
          {stats.green > 0 && (
            <div 
              className="h-full bg-green-500"
              style={{ width: `${greenWidth}%` }}
            />
          )}
          {stats.yellow > 0 && (
            <div 
              className="h-full bg-yellow-500"
              style={{ width: `${yellowWidth}%` }}
            />
          )}
          {stats.red > 0 && (
            <div 
              className="h-full bg-red-500"
              style={{ width: `${redWidth}%` }}
            />
          )}
        </div>
      );
    };

    // Add handleAudioPlay function
    const handleAudioPlay = (exampleArabic: string) => {
      // Find the example in rules to get its audio
      const example = rules
        .flatMap(rule => rule.examples)
        .find(ex => ex.arabic === exampleArabic);

      if (example?.audio) {
        // Clean up previous audio if it exists
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        // Create and play new audio
        audioRef.current = new Audio(example.audio);
        audioRef.current.play().catch(error => console.log('Audio playback failed:', error));
      }
    };

    // Update the example rendering in renderWordsView
    const renderWordsView = () => {
      return (
        <>
          {Object.entries(groupedWords)
            .filter(([_, examples]) => examples.length > 0)
            .map(([vocabWord, examples], wordIndex) => {
              const translation = rules
                .flatMap(rule => rule.vocabulary)
                .find(v => v.word === vocabWord)?.translation;
              
              const stats = getPerformanceStats(examples);

              return (
                <div key={vocabWord} className="mb-2 bg-white rounded-lg shadow">
                  <button
                    onClick={() => setExpandedWordIndex(expandedWordIndex === wordIndex ? null : wordIndex)}
                    className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="text-xl font-arabic mb-1">{vocabWord}</h3>
                      <p className="text-sm text-gray-600">{translation}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <PerformanceBar stats={stats} />
                      <ChevronRight 
                        className={`transform transition-transform duration-200 ${
                          expandedWordIndex === wordIndex ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>
                  
                  {expandedWordIndex === wordIndex && (
                    <div className="p-4 border-t">
                      <div className="space-y-4">
                        {examples.map((example, index) => {
                          const performance = getExamplePerformance(example.arabic);
                          
                          // Define background color based on performance
                          let bgColor = 'bg-white';
                          if (performance === 'green') bgColor = 'bg-green-100';
                          if (performance === 'yellow') bgColor = 'bg-yellow-100';
                          if (performance === 'red') bgColor = 'bg-red-100';

                          return (
                            <div 
                              key={index} 
                              className={`${bgColor} border-b last:border-b-0 pb-4 rounded-lg p-4 transition-colors duration-300`}
                            >
                              <div className="text-right mb-4">
                                <div className="flex justify-end items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleAudioPlay(example.arabic)}
                                    className="h-8 w-8 text-blue-500"
                                    title="Play Audio"
                                  >
                                    <Volume2 className="h-4 w-4" />
                                  </Button>
                                  <div className="text-2xl font-arabic">{example.arabic}</div>
                                </div>
                                <div className="text-lg text-gray-700">{example.translation}</div>
                                <button 
                                  onClick={() => handleVerseClick(example)}
                                  className="text-xs mb-2 text-right text-blue-500 hover:text-blue-700 hover:underline block w-full"
                                >
                                  Surah {example.surah}, Ayah {example.ayah}
                                </button>
                              </div>
                              <div className="text-sm text-gray-500 mb-2">
                                <strong>Rule:</strong> {example.rule}
                              </div>
                              <div className="text-sm text-gray-500 mb-2">
                                <strong>Explanation:</strong> {example.explanation}
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handlePracticeExample(example)}
                                  className="h-8 w-8"
                                  title="Practice This Example"
                                >
                                  <Brain className="h-4 w-4" /> <span className="text-xs">Practice Example</span>
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
          })}
        </>
      );
    };

    // Update the example rendering in renderRulesView
    const renderRulesView = () => {
      const groupedByRules = rules.map(rule => ({
        rule: rule.rule,
        examples: learnedWords.filter(word => word.rule === rule.rule)
      })).filter(group => group.examples.length > 0);

      return (
        <>
          {groupedByRules.map((group, ruleIndex) => {
            const stats = getPerformanceStats(group.examples);

            return (
              <div key={ruleIndex} className="mb-2 bg-white rounded-lg shadow">
                <button
                  onClick={() => setExpandedWordIndex(expandedWordIndex === ruleIndex ? null : ruleIndex)}
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{group.rule}</h3>
                    <p className="text-sm text-gray-600">{group.examples.length} examples</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <PerformanceBar stats={stats} />
                    <ChevronRight 
                      className={`transform transition-transform duration-200 ${
                        expandedWordIndex === ruleIndex ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>
                
                {expandedWordIndex === ruleIndex && (
                  <div className="p-4 border-t">
                    <div className="space-y-4">
                      {group.examples.map((example, index) => {
                        const performance = getExamplePerformance(example.arabic);
                        
                        // Define background color based on performance
                        let bgColor = 'bg-white';
                        if (performance === 'green') bgColor = 'bg-green-100';
                        if (performance === 'yellow') bgColor = 'bg-yellow-100';
                        if (performance === 'red') bgColor = 'bg-red-100';

                        return (
                          <div 
                            key={index} 
                            className={`${bgColor} border-b last:border-b-0 pb-4 rounded-lg p-4 transition-colors duration-300`}
                          >
                            <div className="text-right mb-4">
                              <div className="flex justify-end items-center gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleAudioPlay(example.arabic)}
                                  className="h-8 w-8 text-blue-500"
                                  title="Play Audio"
                                >
                                  <Volume2 className="h-4 w-4" />
                                </Button>
                                <div className="text-2xl font-arabic">{example.arabic}</div>
                              </div>
                              <div className="text-lg text-gray-700">{example.translation}</div>
                              <button 
                                onClick={() => handleVerseClick(example)}
                                className="text-xs mb-2 text-right text-blue-500 hover:text-blue-700 hover:underline block w-full"
                              >
                                Surah {example.surah}, Ayah {example.ayah}
                              </button>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">
                              <strong>Explanation:</strong> {example.explanation}
                            </div>
                            <div className="flex justify-center mt-4">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handlePracticeExample(example)}
                                className="h-8 w-8"
                                title="Practice This Example"
                              >
                                <Brain className="h-4 w-4" /> <span className="text-xs">Practice Example</span>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      );
    };

    return (
      <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Learned Words</h2>
          <div className="flex gap-2">
            <Button
              variant={viewType === 'words' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('words')}
            >
              By Words
            </Button>
            <Button
              variant={viewType === 'rules' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('rules')}
            >
              By Rules
            </Button>
          </div>
        </div>

        {/* Add Practice All Words button */}
        <div className="mb-4">
          <Button 
            onClick={handlePracticeAllWords}
            className="w-full"
            size="lg"
            variant="default"
          >
          <Brain className="h-4 w-4" />  Practice All 
          </Button>
        </div>

        {viewType === 'words' ? renderWordsView() : renderRulesView()}

        {selectedVerse && (
          <VerseModal
            isOpen={isVerseModalOpen}
            onClose={() => setIsVerseModalOpen(false)}
            verse={selectedVerse}
          />
        )}
      </ScrollArea>
    );
  };

  const ContentsTab = () => {
    return (
      <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
        <h2 className="text-2xl font-bold mb-4">Contents</h2>
        <div className="space-y-2">
          {/* Add Letters section */}
          <button
            onClick={() => setIsLettersActive(true)}
            className="w-full p-4 text-left bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-1">Arabic Letters</h3>
            <p className="text-sm text-gray-600">Learn the Arabic alphabet and their pronunciations</p>
          </button>

          {/* Existing rules */}
          {rules.map((rule, index) => (
            <button
              key={index}
              onClick={() => navigateToRule(rule)}
              className="w-full p-4 text-left bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-1">{rule.title}</h3>
              <p className="text-sm text-gray-600">{rule.rule}</p>
            </button>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-emerald-600 text-white">
        <div className="flex flex-col">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Arabic Grammar</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-black hover:bg-black/90 text-white border-black/20"
              onClick={() => setIsSignupOpen(true)}
            >
              Get Early Access
            </Button>
          </div>
        </div>
        <div className="w-12 h-12">
          <CircularProgressbar 
            value={progress} 
            text={`${progress.toFixed(2)}%`}
            styles={buildStyles({
              textSize: '26px',
              pathColor: `rgba(255, 255, 255, ${progress / 100})`,
              textColor: '#ffffff',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7',
            })}
          />
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow relative">
        {/* Main Content */}
        <main className="flex-grow p-4 overflow-y-auto mb-14">
          <TabsContent value="contents">
            <ContentsTab />
          </TabsContent>
         
          <TabsContent value="words">
            <WordsTab quizResults={quizResults} />
          </TabsContent>
          <TabsContent value="quran">
            <QuranOverlay />
          </TabsContent>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-white max-w-md mx-auto h-14">
          <TabsList className="w-full h-full grid grid-cols-2">
            <TabsTrigger value="contents" className="flex flex-col items-center justify-center data-[state=active]:text-emerald-600">
              <List className="h-5 w-5" />
              <span className="text-xs">Contents</span>
            </TabsTrigger>
            <TabsTrigger value="words" className="flex flex-col items-center justify-center data-[state=active]:text-emerald-600">
              <Book className="h-5 w-5" />
              <span className="text-xs">Words</span>
            </TabsTrigger>
            {/* <TabsTrigger value="quran" className="flex flex-col items-center justify-center data-[state=active]:text-emerald-600">
              <User className="h-5 w-5" />
              <span className="text-xs">Quran</span>
            </TabsTrigger> */}
          </TabsList>
        </nav>
      </Tabs>

      {/* Overlays and dialogs */}
      {isQuizActive && questions.length > 0 && (
        <QuizOverlay
          questions={questions}
          onComplete={(newResults) => {
            setQuizResults(prev => ({
              ...prev,
              ...newResults
            }));
            setIsQuizActive(false);
          }}
          onClose={() => setIsQuizActive(false)}
        />
      )}

      {isLearningActive && selectedRule && (
        <LearnOverlay
          rule={selectedRule}
          verseDetails={VERSE_DETAILS}
          onComplete={(newLearnedWords, newQuizResults) => {
            setLearnedWords(prev => [...prev, ...newLearnedWords]);
            // Merge new quiz results with existing ones
            setQuizResults(prev => ({
              ...prev,
              ...newQuizResults
            }));
            setIsLearningActive(false);
            setSelectedRule(null);
          }}
          onClose={() => {
            setIsLearningActive(false);
            setSelectedRule(null);
          }}
        />
      )}

      {isLettersActive && (
        <LettersOverlay
          onClose={() => {
            setIsLettersActive(false);
          }}
        />
      )}

      <Dialog open={isSignupOpen} onOpenChange={(open) => {
        setIsSignupOpen(open);
        if (!open) {
          setIsSubmitSuccess(false);
        }
      }}>
        <DialogContent className="sm:max-w-[425px] fixed top-[20%] left-[50%] translate-x-[-50%] translate-y-0">
          <DialogHeader>
            <DialogTitle>Get Notified When the App is Released</DialogTitle>
          </DialogHeader>
          {isSubmitSuccess ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="mt-2 text-sm text-gray-600">Thank you for joining the waitlist!</p>
            </div>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ArabicGrammarApp