"use client"

import React, { useState, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { BookOpen, List, User, ChevronRight, Brain } from 'lucide-react'
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

const VERSE_DETAILS: VerseDetails = {
  "Al-Baqarah-30": {
    arabic: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
    translation: "And [mention, O Muhammad], when your Lord said to the angels, 'Indeed, I will make upon the earth a successive authority.'"
  },
  "An-Nisa-63": {
    arabic: "أُولَٰئِكَ الَّذِينَ يَعْلَمُ اللَّهُ مَا فِي قُلُوبِهِمْ فَأَعْرِضْ عَنْهُمْ وَعِظْهُمْ وَقُلْ لَهُمْ فِي أَنفُسِهِمْ قَوْلًا بَلِيغًا",
    translation: "Those are the ones of whom Allah knows what is in their hearts, so turn away from them but admonish them and speak to them a far-reaching word."
  },
  "Al-Maidah-116": {
    arabic: "وَإِذْ قَالَ اللَّهُ يَا عِيسَى ابْنَ مَرْيَمَ أَأَنتَ قُلتَ لِلنَّاسِ اتَّخِذُونِي وَأُمِّيَ إِلَٰهَيْنِ مِن دُونِ اللَّهِ",
    translation: "And [beware the Day] when Allah will say, 'O Jesus, Son of Mary, did you say to the people, 'Take me and my mother as deities besides Allah?'"
  },
  // Al-Baqarah, 77
  "Al-Baqarah-77": {
    arabic: "أَوَلَا يَعْلَمُونَ أَنَّ اللَّهَ يَعْلَمُ مَا يُسِرُّونَ وَمَا يُعْلِنُونَ",
    translation: "Do they not know that Allah knows what they conceal and what they declare?"
  },
  // An-Nur, 45
  "An-Nur-45": {
    arabic: "يَخْلُقُ ٱللَّهُ مَا يَشَآءُ ۚ إِنَّ ٱللَّهَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌۭ",
    translation: "Allâh creates what He wills. Verily Allâh is Able to do all things."
  },

  "An-Naml-29": {
    arabic: "قَالَتْ يَا أَيُّهَا الْمَلَأُ إِنِّي أُلْقِيَ إِلَيَّ كِتَابٌ كَرِيمٌ",
    translation: "She said, 'O eminent ones, indeed, to me has been delivered a noble letter.'"
  },

  "Al-Baqarah-126": {
    arabic: "وَإِذْ قَالَ إِبْرَاهِيمُ رَبِّ اجْعَلْ هَٰذَا بَلَدًا آمِنًا",
    translation: "And [mention] when Abraham said, 'My Lord, make this a secure city.'"
  },
  
  // An-Nisa, 26
  "An-Nisa-26": {
    arabic: "يُرِيدُ اللَّهُ لِيُبَيِّنَ لَكُمْ وَيَهْدِيَكُمْ سُنَنَ الَّذِينَ مِن قَبْلِكُمْ وَيَتُوبَ عَلَيْكُمْ وَاللَّهُ عَلِيمٌ حَكِيمٌ",
    translation: "Allah wants to make clear to you [the lawful from the unlawful] and guide you to the [good] practices of those before you and to accept your repentance. And Allah is Knowing and Wise."
  },
  // An-Nur, 38
  "An-Nur-38": {
    arabic: "وَاللَّهُ يَرْزُقُ مَن يَشَاءُ بِغَيْرِ حِسَابٍ",
    translation: "And Allah provides for whom He wills without account."
  },
  // Ad-Dukhan, 2
  "Ad-Dukhan-2": {
    arabic: "وَالْكِتَابِ الْمُبِينِ",
    translation: "By the clear Book"
  },
  // Al-Fatihah, 6
  "Al-Fatihah-6": {
    arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translation: "Guide us to the straight path"
  },
  // Al-Baqarah, 10
  "Al-Baqarah-10": {
    arabic: "وَلَهُمْ عَذَابٌ أَلِيمٌ بِمَا كَانُوا يَكْذِبُونَ",
    translation: "And for them is a painful punishment because they used to lie."
  },
  // Al-Baqarah, 2
  "Al-Baqarah-2": {
    arabic: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
    translation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah"
  },
  // Al-Fatihah, 3
  "Al-Fatihah-3": {
    arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "The Entirely Merciful, the Especially Merciful"
  },
  // Al-Fatihah, 2
  "Al-Fatihah-2": {
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "All praise is due to Allah, Lord of the worlds"
  },
  // Al-Fatihah, 4
  "Al-Fatihah-4": {
    arabic: "مَالِكِ يَوْمِ الدِّينِ",
    translation: "Sovereign of the Day of Recompense"
  },
  // Al-Fatihah, 7
  "Al-Fatihah-7": {
    arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    translation: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray"
  },
  // Al-Fatihah, 1
  "Al-Fatihah-1": {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful"
  },
  // Al-Ahzab, 23
  "Al-Ahzab-23": {
    arabic: "مِّنَ الْمُؤْمِنِينَ رِجَالٌ صَدَقُوا مَا عَاهَدُوا اللَّهَ عَلَيْهِ",
    translation: "Among the believers are men true to what they promised Allah"
  },
  // An-Nas, 6
  "An-Nas-6": {
    arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
    translation: "From among the jinn and mankind"
  }
};

const ArabicGrammarApp = () => {
  const [learnedWords, setLearnedWords] = useState<{ arabic: string; translation: string; rule: string; surah: string; ayah: number; explanation: string }[]>([])
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showingExamples, setShowingExamples] = useState(false)
  const [showingVocabulary, setShowingVocabulary] = useState(false)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0)
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("learn")
  const [expandedWordIndex, setExpandedWordIndex] = useState<number | null>(null)
  const [rules, setRules] = useState([
    {
      rule: "In Arabic, verbs may come before the subject in a sentence.",
      vocabulary: [
        { word: "اللهُ", translation: "Allah", type: "Ism (Noun)" },
      ],
      examples: [
        {
          arabic: "قَالَ اللهُ",
          lemma: "اللهُ",
          translation: "Allah said",
          explanation: "The verb 'قَالَ' (said) comes before the subject 'اللهُ' (Allah).",
          surah: "Al-Maidah",
          ayah: 116
        },
        {
          arabic: "يَعْلَمُ اللهُ",
          lemma: "اللهُ",
          translation: "Allah knows",
          explanation: "The verb 'يَعْلَمُ' (knows) comes before the subject 'اللهُ' (Allah).",
          surah: "An-Nisa",
          ayah: 63
        },
        {
          arabic: "يَخْلُقُ اللهُ",
          lemma: "اللهُ",
          translation: "Allah created",
          explanation: "The verb 'يَخْلُقُ' (creates) comes before the subject 'اللهُ' (Allah).",
          surah: "An-Nur",
          ayah: 45
        },
        {
          arabic: "يُرِيدُ اللهُ",
          lemma: "اللهُ",
          translation: "Allah wishes",
          explanation: "The verb 'يُرِيدُ' (wishes) comes before the subject 'اللهُ' (Allah).",
          surah: "An-Nisa",
          ayah: 26
        }
      ]
    },
    {
      rule: "In Arabic, adjectives come after the noun they describe.",
      vocabulary: [
        { word: "كِتَابٌ", translation: "letter/book", type: "Ism (Noun)" },
        { word: "كَرِيمٌ", translation: "noble", type: "Ism (Noun)" },
        { word: "آمِنًا", translation: "secure", type: "Ism (Noun)" },
        { word: "بَلَدًا", translation: "city", type: "Ism (Noun)" },
        { word: "أَلِيمٌ", translation: "painful", type: "Ism (Noun)" },
        { word: "عَذَابٌ", translation: "punishment", type: "Ism (Noun)" },
      ],
      examples: [
        {
          arabic: "كِتَابٌ كَرِيمٌ",
          lemma: ["كِتَابٌ", "كَرِيمٌ"],
          translation: "A noble letter",
          explanation: "The adjective 'كَرِيمٌ' (noble) comes after the noun 'كِتَابٌ' (letter).",
          surah: "An-Naml",
          ayah: 29
        },
        {
          arabic: "بَلَدًا آمِنًا",
          lemma: ["بَلَدًا", "آمِنًا"],
          translation: "A secure city",
          explanation: "The adjective 'ءَامِنًۭا' (secure) comes after the noun 'بَلَدًا' (city).",
          surah: "Al-Baqarah",
          ayah: 126
        },
        {
          arabic: "عَذَابٌ أَلِيمٌ",
          lemma: ["عَذَابٌ", "أَلِيمٌ"],
          translation: "A painful punishment",
          explanation: "The adjective 'أَلِيمٌ' (painful) comes after the noun 'عَذَابٌ' (punishment).",
          surah: "Al-Baqarah",
          ayah: 10
        }
      ]
    },
    {
      rule: "In Arabic, the definite article 'ال' (al) is attached to the beginning of a word to make it definite.",
      vocabulary: [
        { word: "كِتَابٌ", translation: "book", type: "Ism (Noun)" },
        { word: "رَحِيمٌ", translation: "Merciful", type: "Ism (Noun)" },
        { word: "عَالَمٌ", translation: "world", type: "Ism (Noun)" },
      ],
      examples: [
        {
          arabic: "الْكِتَابُ",
          lemma: "كِتَابٌ",
          translation: "The book",
          explanation: "The definite article 'ال' is attached to 'كِتَابُ' (book) to make it 'the book'.",
          surah: "Al-Baqarah",
          ayah: 2
        },
        {
          arabic: "الرَّحِيمُ",
          lemma: "رَحِيمٌ",
          translation: "The Most Merciful",
          explanation: "The definite article 'ال' is attached to 'رَحْمَنُ' (Merciful) to make it 'the Most Merciful'.",
          surah: "Al-Fatihah",
          ayah: 3
        },
        {
          arabic: "الْعَالَمِينَ",
          lemma: "عَالَمٌ",
          translation: "The worlds",
          explanation: "The definite article 'ال' is attached to 'عَالَمِينَ' (worlds) to make it 'the worlds'.",
          surah: "Al-Fatihah",
          ayah: 2
        }
      ]
    },
  ])

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

  // Modify showNextRule to show word summary first
  const showNextRule = () => {
    if (!showingWordSummary && coveredExamples.size > 0) {
      setShowingWordSummary(true);
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
      showNextRule();
    }
  };

  const navigateToRule = (rule: string) => {
    const ruleIndex = rules.findIndex(r => r.rule === rule);
    if (ruleIndex !== -1) {
      setCurrentRuleIndex(ruleIndex);
      const unlearned = rules[ruleIndex].examples.filter(example => 
        !learnedWords.some(word => word.arabic === example.arabic)
      );
      setCurrentExampleIndex(unlearned.length > 0 ? rules[ruleIndex].examples.indexOf(unlearned[0]) : 0);
      setShowingExamples(unlearned.length > 0);
      setActiveTab("learn");
    }
  }

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

    // Ensure we have enough options
    const options = shuffleArray([
      word.translation,
      ...otherTranslations
    ]).slice(0, 4);

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

  // Modify LearnTab to include WordSummary
  const LearnTab = () => {
    const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
    const currentRule = rules[currentRuleIndex];
    const currentExample = currentRule.examples[currentExampleIndex];
    const unlearned = currentRule.examples.filter(example => 
      !learnedWords.some(word => word.arabic === example.arabic)
    );

    return (
      <>
        {/* Grammar Rule (always visible) */}
        <section className="mb-4 bg-white rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Grammar Rule:</h2>
          <p>{currentRule.rule}</p>
        </section>

        {showingWordSummary ? (
          <WordSummary />
        ) : !showingExamples ? (
          unlearned.length > 0 ? (
            // Start Examples button - directly starts examples without vocabulary preview
            <button 
              onClick={() => setShowingExamples(true)}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 mb-4"
            >
              Start Examples
            </button>
          ) : (
            // All examples learned for this rule
            <div className="mb-4 text-center">
              <p className="mb-2">Great job! You've learned all examples for this rule.</p>
              <button 
                onClick={showNextRule}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Next Rule
              </button>
            </div>
          )
        ) : (
          // Quranic Example section
          <section className="mb-4 bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Quranic Example:</h2>
            <p className="text-sm text-gray-500 mb-2">
              Example {currentExampleIndex + 1} of {currentRule.examples.length}
            </p>
            <p className="text-2xl mb-1 text-right font-arabic">{currentExample.arabic}</p>
            <button 
              onClick={() => setIsVerseModalOpen(true)}
              className="text-xs mb-2 text-right text-blue-500 hover:text-blue-700 hover:underline block w-full"
            >
              Surah {currentExample.surah}, Ayah {currentExample.ayah}
            </button>
            <p className="mb-2"><strong>Translation:</strong> {currentExample.translation}</p>
            <p className="mb-4"><strong>Explanation:</strong> {currentExample.explanation}</p>
            <div className="flex flex-col gap-2">
              {currentExampleIndex === currentRule.examples.length - 1 ? (
                <motion.button 
                  onClick={showNextExample}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    y: [-10, 1, 10],
                    transition: {
                      y: {
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }
                    }
                  }}
                >
                  See New words you learned!
                  <ChevronRight className="ml-2" size={20} />
                </motion.button>
              ) : (
                <button 
                  onClick={showNextExample}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                  Next Example
                  <ChevronRight className="ml-2" size={20} />
                </button>
              )}
              <button 
                onClick={showNextRule}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition duration-300 flex items-center justify-center"
              >
                Skip to next rule
                <ChevronRight className="ml-2" size={16} />
              </button>
            </div>
          </section>
        )}

        {/* Add VerseModal */}
        {showingExamples && (
          <VerseModal
            isOpen={isVerseModalOpen}
            onClose={() => setIsVerseModalOpen(false)}
            verse={{
              arabic: VERSE_DETAILS[`${currentExample.surah}-${currentExample.ayah}`]?.arabic || '',
              translation: VERSE_DETAILS[`${currentExample.surah}-${currentExample.ayah}`]?.translation || '',
              surah: currentExample.surah,
              ayah: currentExample.ayah,
              highlightText: currentExample.arabic
            }}
          />
        )}
      </>
    );
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

    // Modify the existing words view to be its own function
    const renderWordsView = () => {
      return (
        <>
          {Object.entries(groupedWords)
            .filter(([_, examples]) => examples.length > 0)
            .map(([vocabWord, examples], wordIndex) => {
              const translation = rules
                .flatMap(rule => rule.vocabulary)
                .find(v => v.word === vocabWord)?.translation;

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
                    <ChevronRight 
                      className={`transform transition-transform duration-200 ${
                        expandedWordIndex === wordIndex ? 'rotate-90' : ''
                      }`}
                    />
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
                                <div className="text-2xl font-arabic mb-1">{example.arabic}</div>
                                <div className="text-lg text-gray-700">{example.translation}</div>
                              </div>
                              <div className="text-sm text-gray-500 mb-2">
                                <strong>Rule:</strong> {example.rule}
                              </div>
                              <div className="text-sm text-gray-500 mb-2">
                                <strong>Explanation:</strong> {example.explanation}
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleVerseClick(example)}
                                  className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
                                >
                                  View in Surah {example.surah}, Ayah {example.ayah}
                                </button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handlePracticeExample(example)}
                                  className="ml-auto h-8 w-8"
                                  title="Practice This Example"
                                >
                                  <Brain className="h-4 w-4" />
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

    // Add new function to render rules view
    const renderRulesView = () => {
      const groupedByRules = rules.map(rule => ({
        rule: rule.rule,
        examples: learnedWords.filter(word => word.rule === rule.rule)
      })).filter(group => group.examples.length > 0);

      return (
        <>
          {groupedByRules.map((group, ruleIndex) => (
            <div key={ruleIndex} className="mb-2 bg-white rounded-lg shadow">
              <button
                onClick={() => setExpandedWordIndex(expandedWordIndex === ruleIndex ? null : ruleIndex)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <h3 className="text-lg font-semibold">{group.rule}</h3>
                  <p className="text-sm text-gray-600">{group.examples.length} examples</p>
                </div>
                <ChevronRight 
                  className={`transform transition-transform duration-200 ${
                    expandedWordIndex === ruleIndex ? 'rotate-90' : ''
                  }`}
                />
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
                            <div className="text-2xl font-arabic mb-1">{example.arabic}</div>
                            <div className="text-lg text-gray-700">{example.translation}</div>
                          </div>
                          <div className="text-sm text-gray-500 mb-2">
                            <strong>Explanation:</strong> {example.explanation}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleVerseClick(example)}
                              className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
                            >
                              View in Surah {example.surah}, Ayah {example.ayah}
                            </button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handlePracticeExample(example)}
                              className="ml-auto h-8 w-8"
                              title="Practice This Example"
                            >
                              <Brain className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
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
            Practice All Words
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

      {/* Dialog */}
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

      {/* Main Content */}
      <main className="flex-grow p-4 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
          </TabsList>
          <TabsContent value="learn">
            <LearnTab />
          </TabsContent>
          <TabsContent value="words">
            <WordsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Navigation Bar */}
<nav className="flex justify-around items-center p-4 bg-white border-t border-gray-200">
  <button 
    className={`flex flex-col items-center ${activeTab === 'learn' ? 'text-emerald-600' : 'text-gray-500'}`}
    onClick={() => setActiveTab('learn')}
  >
    <BookOpen size={24} />
    <span className="text-xs mt-1">Learn</span>
  </button>
  <button 
    className={`flex flex-col items-center ${activeTab === 'words' ? 'text-emerald-600' : 'text-gray-500'}`}
    onClick={() => setActiveTab('words')}
  >
    <List size={24} />
    <span className="text-xs mt-1">Words</span>
  </button>
  <button 
    className={`flex flex-col items-center ${activeTab === 'quiz' ? 'text-emerald-600' : 'text-gray-500'}`}
    onClick={() => setActiveTab('quiz')}
  >
    <BookOpen size={24} />
    <span className="text-xs mt-1">Quiz</span>
  </button>
  <button className="flex flex-col items-center text-gray-500">
    <User size={24} />
    <span className="text-xs mt-1">Profile</span>
  </button>
</nav>

      {/* Add QuizOverlay */}
      {isQuizActive && questions.length > 0 && (
        <QuizOverlay
          questions={questions}
          onComplete={(newResults) => {
            setQuizResults(prevResults => ({
              ...prevResults,  // Keep previous results
              ...newResults    // Merge with new results
            }));
            setIsQuizActive(false);
          }}
          onClose={() => setIsQuizActive(false)}
        />
      )}
    </div>
  )
}

export default ArabicGrammarApp