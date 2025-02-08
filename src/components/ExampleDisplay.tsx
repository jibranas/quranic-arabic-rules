"use client";

import { useEffect, useState, useRef } from 'react';
import { Example } from '@/data/rules';
import morphologyMeta from '../../data/morphology-meta.json';
import { Button } from "@/components/ui/button";
import { Volume2 } from 'lucide-react';
import { VerseModal } from "@/components/VerseModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"



// Add this helper function
const getSurahName = (surahId: number): string => {
  const surahNames: { [key: number]: string } = {
    1: "Al-Fatihah",
    2: "Al-Baqarah",
    3: "Ali 'Imran",
    4: "An-Nisa",
    5: "Al-Ma'idah",
    6: "Al-An'am",
    7: "Al-A'raf",
    8: "Al-Anfal",
    9: "At-Tawbah",
    10: "Yunus",
    11: "Hud",
    12: "Yusuf",
    13: "Ar-Ra'd",
    14: "Ibrahim",
    15: "Al-Hijr",
    16: "An-Nahl",
    17: "Al-Isra",
    18: "Al-Kahf",
    19: "Maryam",
    20: "Taha",
    21: "Al-Anbiya",
    22: "Al-Hajj",
    23: "Al-Mu'minun",
    24: "An-Nur",
    25: "Al-Furqan",
    26: "Ash-Shu'ara",
    27: "An-Naml",
    28: "Al-Qasas",
    29: "Al-Ankabut",
    30: "Ar-Rum",
    31: "Luqman",
    32: "As-Sajda",
    33: "Al-Ahzab",
    34: "Saba",
    35: "Fatir",
    36: "Ya-Sin",
    37: "As-Saffat",
    38: "Sad",
    39: "Az-Zumar",
    40: "Ghafir",
    41: "Fussilat",
    42: "Ash-Shura",
    43: "Az-Zukhruf",
    44: "Ad-Dukhan",
    45: "Al-Jathiya",
    46: "Al-Ahqaf",
    47: "Muhammad",
    48: "Al-Fath",
    49: "Al-Hujurat",
    50: "Qaf",
    51: "Adh-Dhariyat",
    52: "At-Tur",
    53: "An-Najm",
    54: "Al-Qamar",
    55: "Ar-Rahman",
    56: "Al-Waqi'a",
    57: "Al-Hadid",
    58: "Al-Mujadila",
    59: "Al-Hashr",
    60: "Al-Mumtahina",
    61: "As-Saff",
    62: "Al-Jumu'a",
    63: "Al-Munafiqun",
    64: "At-Taghabun",
    65: "At-Talaq",
    66: "At-Tahrim",
    67: "Al-Mulk",
    68: "Al-Qalam",
    69: "Al-Haqqah",
    70: "Al-Ma'arij",
    71: "Nuh",
    72: "Al-Jinn",
    73: "Al-Muzzammil",
    74: "Al-Muddathir",
    75: "Al-Qiyamah",
    76: "Al-Insan",
    77: "Al-Mursalat",
    78: "An-Naba",
    79: "An-Nazi'at",
    80: "Abasa",
    81: "At-Takwir",
    82: "Al-Infitar",
    83: "Al-Mutaffifin",
    84: "Al-Inshiqaq",
    85: "Al-Buruj",
    86: "At-Tariq",
    87: "Al-A'la",
    88: "Al-Ghashiyah",
    89: "Al-Fajr",
    90: "Al-Balad",
    91: "Ash-Shams",
    92: "Al-Lail",
    93: "Ad-Duha",
    94: "Ash-Sharh",
    95: "At-Tin",
    96: "Al-Alaq",
    97: "Al-Qadr",
    98: "Al-Bayyina",
    99: "Az-Zalzalah",
    100: "Al-Adiyat",
    101: "Al-Qariah",
    102: "At-Takathur",
    103: "Al-Asr",
    104: "Al-Humazah",
    105: "Al-Fil",
    106: "Quraysh",
    107: "Al-Ma'un",
    108: "Al-Kawthar",
    109: "Al-Kafirun",
    110: "An-Nasr",
    111: "Al-Masad",
    112: "Al-Ikhlas",
    113: "Al-Falaq",
    114: "An-Nas"
  };

  return surahNames[surahId] || `Surah ${surahId}`;
};

interface MorphologySegment {
  id: string;
  surahId: number;
  ayahId: number;
  wordId: number;
  segmentNo: number;
  wordPart: number;
  text: string;
  textBw: string;
  lemmaArabic: string;
  lemmaCode: string;
  root: string;
  rootCode: string;
  pos: string;
  type: string;
  person: string;
  gender: string;
  prefixType: string;
  suffixType: string;
  nominalCase: string;
  state: string;
}

interface MorphologyMeta {
  PartOfSpeechTags: Array<{
    Tag: string;
    ArabicName: string;
    Description: string;
    Category: string;
  }>;
  NominalTags: Array<{
    Tag: string;
    ArabicName: string;
    Description: string;
    Category: string;
  }>;
  VerbTags: Array<{
    Tag: string;
    ArabicName: string;
    Description: string;
    Category: string;
  }>;
  PrefixTags: Array<{
    Tag: string;
    Name: string;
    Description: string;
    PrefixType: string;
    LemmaBwNew: string | string[];
    PrefixTranslation: string;
  }>;
}

interface PrefixTag {
  Tag: string;
  Name: string;
  Description: string;
  PrefixType: string;
  LemmaBwNew: string | string[];
  PrefixTranslation: string;
}

interface Props {
  surahId: string;
  ayahNo: number;
  words: Array<{
    wordNo: number;
    segmentNo?: number;  // Optional segment number
  }>;
  exampleId: string;
  highlightText?: string;
}

function generateSegmentExplanation(segment: MorphologySegment): string {
  const parts: string[] = [];


  // Add part of speech information
  if (segment.pos) {
    const posDescription = getTagDescription(segment.pos, morphologyMeta);
    parts.push(`Type: ${posDescription}`);
  }

  // Add prefix type if exists
  if (segment.prefixType) {
    const prefixDescription = getTagDescription(segment.prefixType, morphologyMeta);
    parts.push(`Prefix: ${prefixDescription}`);
  }

  // Add root information
  if (segment.root) {
    parts.push(`Root: ${segment.root} (${segment.rootCode})`);
  }

  // Add lemma information
  if (segment.lemmaArabic) {
    parts.push(`Lemma: ${segment.lemmaArabic} (${segment.lemmaCode})`);
  }

  // Add case information
  if (segment.nominalCase) {
    const caseDescription = getTagDescription(segment.nominalCase, morphologyMeta);
    parts.push(`Case: ${caseDescription}`);
  }

  // Add state information
  if (segment.state) {
    const stateDescription = getTagDescription(segment.state, morphologyMeta);
    parts.push(`State: ${stateDescription}`);
  }

  return parts.join(' | ');
}

export default function ExampleDisplay({ surahId, ayahNo, words, exampleId, highlightText }: Props) {
  const [wordsData, setWordsData] = useState<Array<{
    segments: MorphologySegment[];
    translation: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerseModalOpen, setIsVerseModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    async function fetchWords() {
      try {
        setLoading(true);
        setError(null);

        const morphologyPromises = words.map(async (word) => {
          const response = await fetch('/api/morphology', {
            method: 'POST',
            body: JSON.stringify({ 
              surahId, 
              ayahNo, 
              wordNo: word.wordNo,
              segmentNo: word.segmentNo
            }),
            signal: abortController.signal
          });
          
          if (!response.ok) {
            throw new Error(`Morphology API error: ${response.status}`);
          }

          const morphData = await response.json();

          // If we're looking at a specific segment, only use prefix translation if applicable
          if (word.segmentNo !== undefined) {
            const segment = morphData.segments?.find(s => s.segmentNo === word.segmentNo);
            
            // Debug logging
            console.log('Segment data:', segment);
            
            if (segment?.pos === 'P') {
              const prefixTag = (morphologyMeta as MorphologyMeta).PrefixTags.find(tag => {
                const lemmaBwNewMatch = Array.isArray(tag.LemmaBwNew) 
                  ? tag.LemmaBwNew.includes(segment.lemmaBwNew)
                  : tag.LemmaBwNew === segment.lemmaBwNew;
                return tag.PrefixType === segment.prefixType && lemmaBwNewMatch;
              });

              // Debug logging
              console.log('Matching prefix tag:', prefixTag);

              if (prefixTag) {
                return {
                  segments: [segment],
                  translation: prefixTag.PrefixTranslation
                };
              }
            }
          }

          // Only fetch word translation if we're not dealing with a prefix segment
          if (!word.segmentNo) {
            const translationKey = `${surahId}:${ayahNo}:${word.wordNo}`;
            const translationResponse = await fetch('/api/translation', {
              method: 'POST',
              body: JSON.stringify({ key: translationKey }),
              signal: abortController.signal
            });

            if (!translationResponse.ok) {
              throw new Error(`Translation API error: ${translationResponse.status}`);
            }

            const translationData = await translationResponse.json();
            return {
              segments: morphData.segments || [],
              translation: translationData[translationKey] || 'Translation not available'
            };
          }

          // Return just the segments without translation if no prefix match found
          return {
            segments: morphData.segments || [],
            translation: 'Translation not available'
          };
        });

        const results = await Promise.all(morphologyPromises);

        if (isMounted) {
          setWordsData(results);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError' && isMounted) {
          console.error('Error fetching data:', err);
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWords();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [surahId, ayahNo, JSON.stringify(words)]);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 rounded-lg bg-red-50">
        <div className="text-red-700">Error: {error}</div>
      </div>
    );
  }

  if (!wordsData || wordsData.length === 0) {
    return (
      <div className="p-4 border border-yellow-300 rounded-lg bg-yellow-50">
        <div className="text-yellow-700">No data found for Surah {surahId}, Ayah {ayahNo}</div>
      </div>
    );
  }

  // Deduplicate segments based on segmentNo
  const uniqueSegments = wordsData.map(wordData => {
    const uniqueSegs = Array.from(
      new Map(
        wordData.segments
          .sort((a, b) => (a.segmentNo || 0) - (b.segmentNo || 0))
          .map(seg => [seg.segmentNo, seg])
      ).values()
    );
    return { ...wordData, segments: uniqueSegs };
  });

  const completeText = uniqueSegments
    .map(wordData => {
      // If we're looking for a specific segment, only show that segment
      if (words.some(w => w.segmentNo !== undefined)) {
        return wordData.segments
          .filter(s => words.some(w => w.segmentNo === s.segmentNo))
          .map(s => s.text || '')
          .join('');
      }
      // Otherwise show all segments
      return wordData.segments
        .map(s => s.text || '')
        .join('');
    })
    .join(' ');

  // Combine all translations
  const completeTranslation = wordsData
    .map(wordData => wordData.translation)
    .join(' ');

  const handleAudioPlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.log('Audio playback failed:', error));
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <TooltipProvider>
        {/* Complete text as a tooltip trigger */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-2xl mb-2 text-right cursor-help">{completeText}</div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="w-[400px] max-h-[400px] overflow-y-auto">
            <div className="space-y-4">
              {uniqueSegments.map((wordData, wordIndex) => {
                const wordText = wordData.segments.map(s => s.text || '').join('');
                return (
                  <div key={`${exampleId}-word-${wordIndex}`} className="bg-gray-50 p-2 rounded">
                    <div className="font-semibold mb-1 flex justify-between items-center">
                      <span className="text-gray-600">Word {wordIndex + 1}:</span>
                      <span>{wordText}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {wordData.segments.map((segment, segmentIndex) => (
                        <div 
                          key={`${exampleId}-segment-${wordIndex}-${segmentIndex}`}
                          className="bg-white p-1 rounded border mt-1"
                        >
                          {generateSegmentExplanation(segment)}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="mb-4">{completeTranslation}</div>

      <div className="mt-4 flex items-center justify-between">
        <button 
          onClick={() => setIsVerseModalOpen(true)}
          className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
        >
          Surah {getSurahName(Number(surahId))}, Ayah {ayahNo}
        </button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleAudioPlay}
          className="h-8 w-8"
          title="Play Audio"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Verse Modal */}
      <VerseModal
        isOpen={isVerseModalOpen}
        onClose={() => setIsVerseModalOpen(false)}
        verse={{
          surah: surahId,
          ayah: ayahNo,
          highlightText: highlightText || completeText
        }}
      />
    </div>
  );
}

function getTagDescription(tag: string, meta: MorphologyMeta): string {
  // Check in all tag categories
  const posTag = meta.PartOfSpeechTags.find(t => t.Tag === tag);
  if (posTag) return `${posTag.Description} (${posTag.ArabicName})`;

  const nominalTag = meta.NominalTags.find(t => t.Tag === tag);
  if (nominalTag) return `${nominalTag.Description} (${nominalTag.ArabicName})`;

  const verbTag = meta.VerbTags.find(t => t.Tag === tag);
  if (verbTag) return `${verbTag.Description} (${verbTag.ArabicName})`;

  const prefixTag = meta.PrefixTags.find(t => t.Tag === tag);
  if (prefixTag) return prefixTag.Description;

  return tag;
} 