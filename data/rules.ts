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
  conclusionInterlude?: {
    type: string;
    content: string;
  }[];
}

export const rules: Rule[] = [
  {
    title: "The Three Musketeers of Arabic: Ism, Fi'l, and Ḥarf",
    rule: "Every word in Arabic falls into one of three categories: Ism (noun/name), Fi'l (verb/action), or Ḥarf (particle/connector).",
    introInterlude: [
      {
        type: "text",
        content: `
          <h3>The Foundation of Arabic Grammar</h3>
          <p>Just as there are three musketeers, Arabic has three heroes that form every sentence:</p>
          <div class="bg-amber-50 p-4 rounded-lg my-3">
            <p class="font-bold text-amber-900">1. Ism (اسم)</p>
            <p class="text-amber-800">The naming word - persons, places, things, qualities</p>
          </div>
          <div class="bg-emerald-50 p-4 rounded-lg my-3">
            <p class="font-bold text-emerald-900">2. Fi'l (فعل)</p>
            <p class="text-emerald-800">The doing word - actions and states</p>
          </div>
          <div class="bg-blue-50 p-4 rounded-lg my-3">
            <p class="font-bold text-blue-900">3. Ḥarf (حرف)</p>
            <p class="text-blue-800">The connecting word - joins and modifies other words</p>
          </div>
        `
      },
      {
        type: "text",
        content: `
          <h3>Think of it this way:</h3>
          <ul class="space-y-3">
            <li>🏗️ <strong>Ism</strong> is like the building blocks (nouns)</li>
            <li>⚡ <strong>Fi'l</strong> is like the energy that moves things (verbs)</li>
            <li>🔗 <strong>Ḥarf</strong> is like the glue that holds everything together (particles)</li>
          </ul>
          <p class="mt-4">Together, they create meaningful sentences!</p>
        `
      },
      
    ],
    examples: [
      {
        arabic: "يَعْلَمُ مَا فِي السَّمَاوَاتِ",
        lemma: ["يَعْلَمُ", "مَا", "فِي", "سَمَاءٌ"],
        translation: "He knows what is in the heavens",
        explanation: "Contains: Fi'l (يَعْلَمُ - knows), Ism (مَا - what), Ḥarf (فِي - in), and Ism (السَّمَاوَاتِ - the heavens)",
        surah: "Al-Hujurat",
        audio: "https://verses.quran.com/49/16.mp3",
        ayah: 16
      },
      {
        arabic: "وَاللَّهُ غَفُورٌ رَّحِيمٌ",
        lemma: ["وَ", "اللهُ", "غَفُورٌ", "رَحِيمٌ"],
        translation: "And Allah is Forgiving and Merciful",
        explanation: "Contains: Ḥarf (وَ - and), Ism (اللَّهُ - Allah), Ism (غَفُورٌ - Forgiving), and Ism (رَحِيمٌ - Merciful)",
        surah: "An-Nur",
        audio: "https://verses.quran.com/24/22.mp3",
        ayah: 22
      },
      {
        arabic: "إِنَّا فَتَحْنَا لَكَ",
        lemma: ["إِنَّ", "فَتَحَ", "لِ"],
        translation: "Indeed, We have granted you",
        explanation: "Contains: Ḥarf (إِنَّ - indeed), Fi'l (فَتَحْنَا - we opened/granted), and Ḥarf (لَ - for) with attached pronoun",
        surah: "Al-Fath",
        audio: "https://verses.quran.com/48/1.mp3",
        ayah: 1
      },
      {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        lemma: ["قَالَ", "هُوَ", "اللهُ", "أَحَدٌ"],
        translation: "Say, 'He is Allah, [who is] One'",
        explanation: "Contains: Fi'l (قُلْ - say), Ism (هُوَ - He), Ism (اللَّهُ - Allah), and Ism (أَحَدٌ - One)",
        surah: "Al-Ikhlas",
        audio: "https://verses.quran.com/112/1.mp3",
        ayah: 1
      }
    ],
    conclusionInterlude: [
      {
        type: "text",
        content: `
          <h3>Don't Worry!</h3>
          <div class="bg-blue-50 p-4 rounded-lg">
            <p>If this seems a bit overwhelming at first, that's completely normal! Just like the three musketeers became masters of their craft through practice, you'll become more comfortable with these concepts as we progress.</p>
          </div>
        `
      },
      {
        type: "text",
        content: `
          <div class="bg-amber-50 p-4 rounded-lg">
            <p class="mt-3">Remember:</p>
            <ul class="list-disc pl-6 mt-2">
              <li>We'll explore each type in detail</li>
              <li>You'll see plenty of examples</li>
              <li>Everything will become clearer with practice</li>
            </ul>
          </div>
        `
      }
    ],
    vocabulary: [
      { word: "اللَّهُ", translation: "Allah", type: "Ism (Noun)" },
      { word: "فَتَحَ", translation: "to open/grant", type: "Fi'l (Verb)" },
      { word: "يَعْلَمُ", translation: "knows", type: "Fi'l (Verb)" },
      { word: "إِنَّ", translation: "indeed", type: "Ḥarf (Particle)" },
      { word: "فِي", translation: "in", type: "Ḥarf (Particle)" },
      { word: "لِ", translation: "for", type: "Ḥarf (Particle)" },
      { word: "سَمَاءٌ", translation: "heaven", type: "Ism (Noun)" },
      { word: "غَفُورٌ", translation: "Forgiving", type: "Ism (Noun)" }
    ]
  },
  {
    title: "I'raab (الإعراب): The Essence of Arabic Grammar",
    rule: "I'raab refers to the changes in the ending of words that indicate their grammatical function, marked by different vowel marks or tanween.",
    introInterlude: [
      {
        type: "text",
        content: `
          <h3>The Key to Understanding Arabic</h3>
          <p>I'raab (الإعراب) is arguably the most important concept in Arabic grammar. Think of it as the traffic signals of Arabic - it tells you how words relate to each other!</p>
          <div class="bg-amber-50 p-4 rounded-lg my-3">
            <p class="font-bold text-amber-900">What is I'raab?</p>
            <p class="text-amber-800">It's the system of marking word endings to show their grammatical function in a sentence. While these marks change the pronunciation, they don't change the core meaning of the word.</p>
          </div>
        `
      },
      {
        type: "text",
        content: `
          <h3>Tanween (التنوين)</h3>
          <p>One common form of I'raab is tanween - the double vowel marks that create an "n" sound at the end of words:</p>
          <ul class="space-y-3">
            <li>ـٌ (-un) for nominative case</li>
            <li>ـً (-an) for accusative case</li>
            <li>ـٍ (-in) for genitive case</li>
          </ul>
        `
      }
    ],
    examples: [
      {
        arabic: "نَارٌ",
        lemma: ["نَارٌ"],
        translation: "a fire",
        explanation: "The word has tanween damma (ـٌ) indicating it is an indefinite noun in the nominative case",
        surah: "Al-Qariah",
        audio: "https://verses.quran.com/101/11.mp3",
        ayah: 11
      },
      {
        arabic: "مَالًا",
        lemma: ["مَالًا"],
        translation: "wealth",
        explanation: "The word has tanween fatha (ـً) indicating it is an indefinite noun in the accusative case",
        surah: "Al-Humazah",
        audio: "https://verses.quran.com/104/2.mp3",
        ayah: 2
      },
      {
        arabic: "هُمَزَةٍ",
        lemma: ["هُمَزَةٍ"],
        translation: "a slanderer",
        explanation: "The word has tanween kasra (ـٍ) indicating it is an indefinite noun in the genitive case",
        surah: "Al-Humazah",
        audio: "https://verses.quran.com/104/1.mp3",
        ayah: 1
      }
    ],
    conclusionInterlude: [
      {
        type: "text",
        content: `
          <h3>Key Takeaways</h3>
          <div class="bg-blue-50 p-4 rounded-lg">
            <ul class="list-disc pl-6">
              <li>I'raab shows the grammatical function of words</li>
              <li>Changes in I'raab don't change the core meaning</li>
              <li>Tanween (ـٌ ـً ـٍ) is one type of I'raab marking</li>
              <li>These markings are crucial for proper understanding</li>
            </ul>
          </div>
        `
      }
    ],
    vocabulary: [
      { word: "نَارٌ", translation: "fire", type: "Ism (Noun)" },
      { word: "مَالًا", translation: "wealth", type: "Ism (Noun)" },
      { word: "هُمَزَةٍ", translation: "slanderer", type: "Ism (Noun)" }
    ]
  },
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
        lemma: ["بَلَدًا", "آمِنًۭا"],
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
  {
    title: "Arabic Verb Patterns (الأَوْزَان)",
    rule: "Arabic verbs follow specific patterns (أَوْزَان) that modify their meaning in predictable ways.",
    introInterlude: [
      {
        type: "text",
        content: `
          <h3>Understanding Verb Patterns</h3>
          <p>Just like a master key can open many locks, understanding Arabic verb patterns unlocks the meaning of thousands of words!</p>
          <div class="bg-amber-50 p-4 rounded-lg my-3">
            <p class="font-bold">For example, adding a shadda (ّ) often makes a verb intensive or causative.</p>
          </div>
        `
      },
      {
        type: "image",
        content: "https://your-image-url.com/verb-patterns.png",
        caption: "Overview of common verb patterns"
      }
    ],
    examples: [
      {
        arabic: "عَلِمَ",
        lemma: ["عَلِمَ"],
        translation: "he knew",
        explanation: "Basic form (Pattern I) - indicates simple knowledge",
        surah: "Al-Baqarah",
        audio: "https://audio-url.com/2-60.mp3",
        ayah: 60,
        afterInterlude: [
          {
            type: "text",
            content: `
              <h4>Pattern I (فَعِلَ)</h4>
              <p>This is the basic form of the verb. It usually indicates a simple action or state.</p>
              <ul class="list-disc pl-4 mt-2">
                <li>No prefix</li>
                <li>No doubling of letters</li>
                <li>Basic meaning</li>
              </ul>
            `
          }
        ]
      },
      {
        arabic: "عَلَّمَ",
        lemma: ["عَلَّمَ"],
        translation: "he taught",
        explanation: "Pattern II with shadda - indicates causing someone to know",
        surah: "Al-Baqarah",
        audio: "https://audio-url.com/2-31.mp3",
        ayah: 31,
        beforeInterlude: [
          {
            type: "text",
            content: `
              <h4>Now, watch what happens when we add a shadda!</h4>
              <p>Adding a shadda (ّ) to the middle letter transforms the meaning from "to know" into "to make someone know" (i.e., to teach).</p>
            `
          }
        ],
        afterInterlude: [
          {
            type: "text",
            content: `
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-bold text-blue-900">Pattern II (فَعَّلَ)</h4>
                <p class="text-blue-800">The shadda makes the verb:</p>
                <ul class="list-disc pl-4 mt-2 text-blue-800">
                  <li>Causative (make someone do something)</li>
                  <li>Intensive (do something intensively)</li>
                  <li>Transitive (takes an object)</li>
                </ul>
              </div>
            `
          }
        ]
      },
      {
        arabic: "تَعَلَّمَ",
        lemma: ["تَعَلَّمَ"],
        translation: "he learned",
        explanation: "Pattern V with ta prefix - indicates actively acquiring knowledge",
        surah: "Al-Baqarah",
        audio: "https://audio-url.com/2-102.mp3",
        ayah: 102,
        beforeInterlude: [
          {
            type: "text",
            content: `
              <h4>Adding تَ to Pattern II</h4>
              <p>When we add تَ to the beginning of a Pattern II verb, it often indicates doing the action to oneself.</p>
            `
          }
        ]
      }
    ],
    conclusionInterlude: [
      {
        type: "text",
        content: `
          <h3>Let's Review!</h3>
          <div class="space-y-3">
            <div class="bg-gray-50 p-3 rounded">
              <p class="font-bold">عَلِمَ = to know</p>
              <p class="text-sm">Basic form (Pattern I)</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="font-bold">عَلَّمَ = to teach</p>
              <p class="text-sm">Causative form (Pattern II)</p>
            </div>
            <div class="bg-gray-50 p-3 rounded">
              <p class="font-bold">تَعَلَّمَ = to learn</p>
              <p class="text-sm">Reflexive of Pattern II (Pattern V)</p>
            </div>
          </div>
        `
      },
      // {
      //   type: "animation",
      //   content: JSON.stringify(yourLottieAnimation), // Your Lottie animation JSON
      //   caption: "The transformation of verb patterns"
      // }
    ],
    vocabulary: [
      { word: "عَلِمَ", translation: "to know", type: "Fi'l (Verb)" },
      { word: "عَلَّمَ", translation: "to teach", type: "Fi'l (Verb)" },
      { word: "تَعَلَّمَ", translation: "to learn", type: "Fi'l (Verb)" }
    ]
  }
]; 