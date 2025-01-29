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

export const rules: Rule[] = [
  {
    title: "Verb-Subject Order",
    rule: "In Arabic, verbs may come before the subject in a sentence.",
    vocabulary: [
      { word: "اللهُ", translation: "Allah", type: "Ism (Noun)" },
      { word: "يَخْلُقُ", translation: "Creates", type: "Fa'l (Verb)" },
      { word: "يَعْلَمُ", translation: "Knows", type: "Fa'l (Verb)" },
      { word: "قَالَ", translation: "Said", type: "Fa'l (Verb)" },
    ],
    examples: [
      {
        arabic: "قَالَ اللهُ",
        lemma: ["قَالَ", "اللهُ"],
        translation: "Allah said",
        explanation: "The verb 'قَالَ' (said) comes before the subject 'اللهُ' (Allah).",
        surah: "Al-Maidah",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled.mp3",
        ayah: 116
      },
      {
        arabic: "يَعْلَمُ اللهُ",
        lemma: ["يَعْلَمُ", "اللهُ"],
        translation: "Allah knows",
        explanation: "The verb 'يَعْلَمُ' (knows) comes before the subject 'اللهُ' (Allah).",
        surah: "An-Nisa",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-2.mp3",
        ayah: 63
      },
      {
        arabic: "يَخْلُقُ اللهُ",
        lemma: ["يَخْلُقُ", "اللهُ"],
        translation: "Allah created",
        explanation: "The verb 'يَخْلُقُ' (creates) comes before the subject 'اللهُ' (Allah).",
        surah: "An-Nur",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-3.mp3",
        ayah: 45
      },
      {
        arabic: "يُرِيدُ اللهُ",
        lemma: ["يُرِيدُ", "اللهُ"],
        translation: "Allah wishes",
        explanation: "The verb 'يُرِيدُ' (wishes) comes before the subject 'اللهُ' (Allah).",
        surah: "An-Nisa",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-4.mp3",
        ayah: 26
      }
    ]
  },
  {
    title: "Adjective Order",
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
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-5.mp3",
        ayah: 29
      },
      {
        arabic: "بَلَدًا آمِنًا",
        lemma: ["بَلَدًا", "آمِنًا"],
        translation: "A secure city",
        explanation: "The adjective 'ءَامِنًۭا' (secure) comes after the noun 'بَلَدًا' (city).",
        surah: "Al-Baqarah",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-6.mp3",
        ayah: 126
      },
      {
        arabic: "عَذَابٌ أَلِيمٌ",
        lemma: ["عَذَابٌ", "أَلِيمٌ"],
        translation: "A painful punishment",
        explanation: "The adjective 'أَلِيمٌ' (painful) comes after the noun 'عَذَابٌ' (punishment).",
        surah: "Al-Baqarah",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-7.mp3",
        ayah: 10
      }
    ]
  },
  {
    title: "Definite Article",
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
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-8.mp3",
        ayah: 2
      },
      {
        arabic: "الرَّحِيمِ",
        lemma: "رَحِيمٌ",
        translation: "The Most Merciful",
        explanation: "The definite article 'ال' is attached to 'رَحِيمٌ' (Merciful) to make it 'the Most Merciful'.",
        surah: "Al-Fatihah",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-9.mp3",
        ayah: 3
      },
      {
        arabic: "الْعَالَمِينَ",
        lemma: "عَالَمٌ",
        translation: "The worlds",
        explanation: "The definite article 'ال' is attached to 'عَالَمِينَ' (worlds) to make it 'the worlds'.",
        surah: "Al-Fatihah",
        audio: "https://hhcourses-assets.s3.us-east-2.amazonaws.com/General/Audio/grammar/untitled-10.mp3",
        ayah: 2
      }
    ]
  },
]; 