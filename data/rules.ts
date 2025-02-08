export interface Example {
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
  beforeInterlude?: {
    type: string;
    content: string;
    caption?: string;
  }[];
  afterInterlude?: {
    type: string;
    content: string;
    caption?: string;
  }[];
}

export interface Rule {
  title: string;
  rule: string;
  introInterlude?: {
    type: string;
    content: string;
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
        surahId: 105,
        ayahNo: 3,
        words: [{ wordNo: 1, segmentNo: 1 }],
        explanation: "Contains: Ḥarf (and)",

        beforeInterlude: [
          {
            type: "text",
            content: `
              <h3>Understanding Ḥarf (حرف)</h3>
              <p>Ḥarf is a particle that connects and modifies other words. It is essential for creating meaningful sentences.</p>
            `
          }
        ],
        afterInterlude: [
          {
            type: "text",
            content: `
              <h3>Example of Ḥarf</h3>
              <p>In this example, the word "and" is a Ḥarf, connecting different parts of the sentence.</p>
            `
          }
        ]
      },
      {
        surahId: 105,
        ayahNo: 3,
        words: [{ wordNo: 1}],
        explanation: "Contains: Fi'l (sent)",
        beforeInterlude: [
          {
            type: "text",
            content: `
              <h3>Understanding Fi'l (فعل)</h3>
              <p>Fi'l is a verb that represents actions or states. It is the energy that moves things in a sentence.</p>
            `
          }
        ],
        afterInterlude: [
          {
            type: "text",
            content: `
              <h3>Example of Fi'l</h3>
              <p>In this example, the word "sent" is a Fi'l, indicating an action.</p>
            `
          }
        ]
      },
      {
        surahId: 105,
        ayahNo: 3,
        words: [{ wordNo: 3 }],
        explanation: "Contains: Ism (against)",
        beforeInterlude: [
          {
            type: "text",
            content: `
              <h3>Understanding Ism (اسم)</h3>
              <p>Ism is a noun that represents persons, places, things, or qualities. It is the building block of sentences.</p>
            `
          }
        ],
        afterInterlude: [
          {
            type: "text",
            content: `
              <h3>Example of Ism</h3>
              <p>In this example, the word "against" is an Ism, representing a concept.</p>
            `
          }
        ]
      },
      {
        surahId: 105,
        ayahNo: 3,
        words: [
          { wordNo: 1 },
          { wordNo: 2 },
          { wordNo: 3 }
        ],
        explanation: "Contains: Ḥarf (and), Fi'l (sent), Ism (against)",
        beforeInterlude: [
          {
            type: "text",
            content: `
              <h3>Combining the Elements</h3>
              <p>Now, let's see how these elements come together to form a meaningful sentence.</p>
            `
          }
        ],
        afterInterlude: [
          {
            type: "text",
            content: `
              <h3>Full Example</h3>
              <p>In this example, we have a Ḥarf (and), a Fi'l (sent), and an Ism (against) working together to convey a complete idea.</p>
            `
          }
        ]
      },
      {
        surahId: 106,
        ayahNo: 4,
        words: [
          { wordNo: 1 },
          { wordNo: 2 },
          { wordNo: 3 },
          { wordNo: 4 }
        ],
        explanation: "Contains: Ḥarf (for), Ism (the protection), Ism (of), and Ism (Quraysh)"
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
        surahId: 101,
        ayahNo: 11,
        words: [1],
        explanation: "The word has tanween damma (ـٌ) indicating it is an indefinite noun in the nominative case"
      },
      {
        surahId: 104,
        ayahNo: 2,
        words: [1],
        explanation: "The word has tanween fatha (ـً) indicating it is an indefinite noun in the accusative case"
      },
      {
        surahId: 104,
        ayahNo: 1,
        words: [1],
        explanation: "The word has tanween kasra (ـٍ) indicating it is an indefinite noun in the genitive case"
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
    ]
  },
  {
    title: "Verb-Subject Order",
    rule: "In Arabic, verbs may come before the subject in a sentence.",
    examples: [
      {
        surahId: 2,
        ayahNo: 30,
        words: [1, 2],
        explanation: "The verb 'قَالَ' (said) comes before the subject 'رَبُّكَ' (your Lord)."
      },
      {
        surahId: 3,
        ayahNo: 37,
        words: [1, 2],
        explanation: "The verb 'تَقَبَّلَ' (accepted) comes before the subject 'رَبُّهَا' (her Lord)."
      },
      {
        surahId: 7,
        ayahNo: 54,
        words: [1, 2],
        explanation: "The verb 'خَلَقَ' (created) comes before the subject 'رَبُّكُمُ' (your Lord)."
      },
      {
        surahId: 26,
        ayahNo: 26,
        words: [1, 2],
        explanation: "The verb 'يُرِيدُ' (wishes) comes before the subject 'اللهُ' (Allah)."
      }
    ]
  },
  {
    title: "Adjective Order",
    rule: "In Arabic, adjectives come after the noun they describe.",
    examples: [
      {
        surahId: 29,
        ayahNo: 29,
        words: [1, 2],
        explanation: "The adjective 'كَرِيمٌ' (noble) comes after the noun 'كِتَابٌ' (letter)."
      },
      {
        surahId: 126,
        ayahNo: 126,
        words: [1, 2],
        explanation: "The adjective 'ءَامِنًۭا' (secure) comes after the noun 'بَلَدًا' (city)."
      },
      {
        surahId: 10,
        ayahNo: 10,
        words: [1, 2],
        explanation: "The adjective 'أَلِيمٌ' (painful) comes after the noun 'عَذَابٌ' (punishment)."
      }
    ]
  },
  {
    title: "Definite Article",
    rule: "In Arabic, the definite article 'ال' (al) is attached to the beginning of a word to make it definite.",
    examples: [
      {
        surahId: 2,
        ayahNo: 2,
        words: [1],
        explanation: "The definite article 'ال' is attached to 'كِتَابُ' (book) to make it 'the book'."
      },
      {
        surahId: 1,
        ayahNo: 3,
        words: [1],
        explanation: "The definite article 'ال' is attached to 'رَحِيمٌ' (Merciful) to make it 'the Most Merciful'."
      },
      {
        surahId: 2,
        ayahNo: 2,
        words: [1],
        explanation: "The definite article 'ال' is attached to 'عَالَمِينَ' (worlds) to make it 'the worlds'."
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
        surahId: 2,
        ayahNo: 60,
        words: [1],
        explanation: "Basic form (Pattern I) - indicates simple knowledge"
      },
      {
        surahId: 2,
        ayahNo: 31,
        words: [1],
        explanation: "Adding a shadda (ّ) to the middle letter transforms the meaning from 'to know' into 'to make someone know' (i.e., to teach)."
      },
      {
        surahId: 2,
        ayahNo: 102,
        words: [1],
        explanation: "Adding تَ to Pattern II"
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
      }
    ]
  }
]; 