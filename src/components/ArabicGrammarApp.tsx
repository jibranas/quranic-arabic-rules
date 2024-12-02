"use client"

import React, { useState, useEffect } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { BookOpen, List, User, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Quiz } from "@/components/Quiz"
import { Words } from "@/components/Words"
import { VerseModal } from "@/components/VerseModal"
import { Word } from "@/types/arabic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VerseDetail {
  arabic: string;
  translation: string;
}

interface VerseDetails {
  [key: string]: VerseDetail;
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
  const [showingExamples, setShowingExamples] = useState(false)
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0)
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("learn")
  const [expandedWordIndex, setExpandedWordIndex] = useState<number | null>(null)
  const [rules, setRules] = useState([
    {
      rule: "In Arabic, verbs may come before the subject in a sentence.",
      examples: [
        {
          arabic: "قَالَ اللهُ",
          translation: "Allah said",
          explanation: "The verb 'قَالَ' (said) comes before the subject 'اللهُ' (Allah).",
          surah: "Al-Maidah",
          ayah: 116
        },
        {
          arabic: "يَعْلَمُ اللهُ",
          translation: "Allah knows",
          explanation: "The verb 'يَعْلَمُ' (knows) comes before the subject 'اللهُ' (Allah).",
          surah: "An-Nisa",
          ayah: 63
        },
        {
          arabic: "يَخْلُقُ اللهُ",
          translation: "Allah created",
          explanation: "The verb 'يَخْلُقُ' (creates) comes before the subject 'اللهُ' (Allah).",
          surah: "An-Nur",
          ayah: 45
        },
        {
          arabic: "يُرِيدُ ٱللَّهُ",
          translation: "Allah provides",
          explanation: "The verb 'يُرِيدُ' (wishes) comes before the subject 'اللهُ' (Allah).",
          surah: "An-Nisa",
          ayah: 26
        }
      ]
    },
    {
      rule: "In Arabic, adjectives come after the noun they describe.",
      examples: [
        {
          arabic: "كِتَابٌ كَرِيمٌ",
          translation: "A noble letter",
          explanation: "The adjective 'كَرِيمٌ' (noble) comes after the noun 'كِتَابٌ' (letter).",
          surah: "An-Naml",
          ayah: 29
        },
        {
          arabic: "بَلَدًا آمِنًا",
          translation: "A straight path",
          explanation: "The adjective 'ءَامِنًۭا' (secure) comes after the noun 'بَلَدًا' (city).",
          surah: "Al-Baqarah",
          ayah: 126
        },
        {
          arabic: "عَذَابٌ أَلِيمٌ",
          translation: "A painful punishment",
          explanation: "The adjective 'أَلِيمٌ' (painful) comes after the noun 'عَذَابٌ' (punishment).",
          surah: "Al-Baqarah",
          ayah: 10
        }
      ]
    },
    {
      rule: "In Arabic, the definite article 'ال' (al) is attached to the beginning of a word to make it definite.",
      examples: [
        {
          arabic: "الْكِتَابُ",
          translation: "The book",
          explanation: "The definite article 'ال' is attached to 'كِتَابُ' (book) to make it 'the book'.",
          surah: "Al-Baqarah",
          ayah: 2
        },
        {
          arabic: "الرَّحْمَنُ",
          translation: "The Most Merciful",
          explanation: "The definite article 'ال' is attached to 'رَحْمَنُ' (Merciful) to make it 'the Most Merciful'.",
          surah: "Al-Fatihah",
          ayah: 3
        },
        {
          arabic: "الْعَالَمِينَ",
          translation: "The worlds",
          explanation: "The definite article 'ال' is attached to 'عَالَمِينَ' (worlds) to make it 'the worlds'.",
          surah: "Al-Fatihah",
          ayah: 2
        }
      ]
    },
  ])

  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>({});
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)

  const totalQuranWords = 77430 // Total words in the Quran
  const progress = (learnedWords.length / totalQuranWords) * 100

  useEffect(() => {
    if (showingExamples) {
      const currentExample = rules[currentRuleIndex].examples[currentExampleIndex];
      if (!learnedWords.some(word => word.arabic === currentExample.arabic)) {
        setLearnedWords(prevWords => [...prevWords, { 
          arabic: currentExample.arabic, 
          translation: currentExample.translation,
          rule: rules[currentRuleIndex].rule,
          surah: currentExample.surah,
          ayah: currentExample.ayah,
          explanation: currentExample.explanation
        }])
      }
    }
  }, [currentExampleIndex, currentRuleIndex, showingExamples, learnedWords, rules])

  const showNextExample = () => {
    const currentRule = rules[currentRuleIndex];
    const unlearned = currentRule.examples.filter(example => 
      !learnedWords.some(word => word.arabic === example.arabic)
    );

    if (unlearned.length > 0) {
      const nextIndex = currentRule.examples.findIndex(example => example.arabic === unlearned[0].arabic);
      setCurrentExampleIndex(nextIndex);
    } else {
      showNextRule();
    }
  }

  const showNextRule = () => {
    let nextRuleIndex = (currentRuleIndex + 1) % rules.length;
    setCurrentRuleIndex(nextRuleIndex);
    setCurrentExampleIndex(0);
    setShowingExamples(false);
  }

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

  const handleDelete = (word: { arabic: string; translation: string; rule: string; surah: string; ayah: number; explanation: string }) => {
    setLearnedWords(prevWords => prevWords.filter(w => w.arabic !== word.arabic));
    // Also remove the quiz result for this word if it exists
    const newQuizResults = { ...quizResults };
    delete newQuizResults[word.arabic];
    setQuizResults(newQuizResults);
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

        {!showingExamples ? (
          unlearned.length > 0 ? (
            // Show Examples Button
            <button 
              onClick={() => setShowingExamples(true)}
              className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 mb-4"
            >
              Show me examples
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
          // Quranic Example
          <section className="mb-4 bg-white rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Quranic Example:</h2>
            <p className="text-2xl mb-1 text-right font-arabic">{currentExample.arabic}</p>
            <button 
              onClick={() => setIsVerseModalOpen(true)}
              className="text-xs mb-2 text-right text-blue-500 hover:text-blue-700 hover:underline block w-full"
            >
              Surah {currentExample.surah}, Ayah {currentExample.ayah}
            </button>
            <p className="mb-2"><strong>Translation:</strong> {currentExample.translation}</p>
            <p className="mb-4"><strong>Explanation:</strong> {currentExample.explanation}</p>
            <div className="flex justify-between">
              <button 
                onClick={showNextExample}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
              >
                Next Example
                <ChevronRight className="ml-2" size={20} />
              </button>
              <button 
                onClick={showNextRule}
                className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition duration-300 flex items-center"
              >
                Next Rule
                <ChevronRight className="ml-2" size={20} />
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
    )
  }

  const WordsTab = () => (
    <ScrollArea className="h-[calc(100vh-200px)] w-full rounded-md border p-4">
      <h2 className="text-2xl font-bold mb-4">Learned Words</h2>
      <Words 
        words={learnedWords} 
        quizResults={quizResults}
        verseDetails={VERSE_DETAILS}
      />
    </ScrollArea>
  )

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
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="learn">Learn</TabsTrigger>
            <TabsTrigger value="words">Words</TabsTrigger>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
          </TabsList>
          <TabsContent value="learn">
            <LearnTab />
          </TabsContent>
          <TabsContent value="words">
            <WordsTab />
          </TabsContent>
          <TabsContent value="quiz">
            <Quiz 
              words={learnedWords} 
              onQuizComplete={setQuizResults} 
            />
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
    </div>
  )
}

export default ArabicGrammarApp

