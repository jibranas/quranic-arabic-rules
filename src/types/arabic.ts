export interface Example {
  arabic: string;
  lemma: string | string[];
  translation: string;
  explanation: string;
  surah: string;
  audio: string;
  ayah: number;
}

export interface Rule {
  title: string;
  rule: string;
  vocabulary: {
    word: string;
    translation: string;
    type: string;
  }[];
  examples: Example[];
}

export interface LearnedWord {
  arabic: string;
  translation: string;
  rule: string;
  surah: string;
  ayah: number;
}

export interface Word {
  arabic: string;
  translation: string;
  rule: string;
  surah: string;
  ayah: number;
  explanation: string;
}

export type QuestionType = 'vocabulary' | 'grammar' | 'partsOfSpeech';

export interface Question {
  type: QuestionType;
  word: {
    arabic: string;
    translation: string;
    explanation: string;
    surah: string;
    ayah: number;
    rule?: string;
  };
  question: string;
  options: string[];
  correctAnswer: string;
}

interface LearnOverlayProps {
  rule: Rule;
  verseDetails: { [key: string]: { arabic: string; translation: string } };
  onComplete: (learnedWords: { arabic: string; translation: string; rule: string; surah: string; ayah: number; explanation: string }[], quizResults: { [key: string]: boolean[] }) => void;
  onClose: () => void;
  generateVocabularyQuestion: (word: Word) => Question;
  generateGrammarQuestion: (word: Word) => Question;
  generatePartsOfSpeechQuestion: (word: Word) => Question | null;
  quizResults: { [key: string]: boolean[] };
} 