"use client";

import { useEffect, useState } from 'react';
import { Example } from '@/data/rules';
import morphologyMeta from '../../data/morphology-meta.json';



// Add this helper function
const getSurahName = (surahId: number): string => {
  const surahNames: { [key: number]: string } = {
    1: "Al-Fatihah",
    2: "Al-Baqarah",
    3: "Ali 'Imran",
    4: "An-Nisa",
    5: "Al-Ma'idah",
    // ... add more surahs as needed
    101: "Al-Qariah",
    102: "At-Takathur",
    103: "Al-'Asr",
    104: "Al-Humazah",
    // ... add more surahs as needed
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
  }>;
}

interface Props {
  surahId: number;
  ayahNo: number;
  words: number[]; // Array of word numbers
}

function generateSegmentExplanation(segment: MorphologySegment): string {
  let parts = [];

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

export default function ExampleDisplay({ surahId, ayahNo, words }: Props) {
  const [wordsData, setWordsData] = useState<Array<{
    segments: MorphologySegment[];
    translation: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWords() {
      try {
        const wordPromises = words.map(async (wordNo) => {
          // Fetch morphology data
          const morphologyResponse = await fetch('/api/morphology', {
            method: 'POST',
            body: JSON.stringify({
              surahId,
              ayahNo,
              wordNo
            })
          });
          
          if (!morphologyResponse.ok) {
            throw new Error(`Morphology API error for word ${wordNo}: ${morphologyResponse.status}`);
          }

          const morphologyData = await morphologyResponse.json();

          if (!morphologyData.segments) {
            throw new Error(`No morphology segments found for word ${wordNo}`);
          }

          // Fetch translation
          const translationKey = `${surahId}:${ayahNo}:${wordNo}`;
          const translationResponse = await fetch('/api/translation', {
            method: 'POST',
            body: JSON.stringify({ key: translationKey })
          });

          if (!translationResponse.ok) {
            throw new Error(`Translation API error for word ${wordNo}: ${translationResponse.status}`);
          }

          const translationData = await translationResponse.json();

          return {
            segments: morphologyData.segments,
            translation: translationData[translationKey] || 'Translation not available'
          };
        });

        const results = await Promise.all(wordPromises);
        setWordsData(results);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch examples');
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, [surahId, ayahNo, words]);

  if (loading) return <div className="p-4 border rounded-lg bg-gray-50"><div className="animate-pulse">Loading...</div></div>;
  if (error) return <div className="p-4 border border-red-300 rounded-lg bg-red-50"><div className="text-red-700">Error: {error}</div></div>;
  if (!wordsData || wordsData.length === 0) {
    return (
      <div className="p-4 border border-yellow-300 rounded-lg bg-yellow-50">
        <div className="text-yellow-700">No data found for Surah {surahId}, Ayah {ayahNo}</div>
      </div>
    );
  }

  // Combine all words into a single text line
  const completeText = wordsData
    .map(wordData => 
      wordData.segments
        .sort((a, b) => (a.segmentNo || 0) - (b.segmentNo || 0))
        .map(s => s.text || '')
        .join('')
    )
    .join(' ');

  // Combine all translations
  const completeTranslation = wordsData
    .map(wordData => wordData.translation)
    .join(' ');

  return (
    <div className="p-4 border rounded-lg">
      {/* Complete text and translation at the top */}
      <div className="text-2xl mb-2 text-right">{completeText}</div>
      <div className="mb-4 pb-4 border-b">{completeTranslation}</div>

      {/* Individual word analyses */}
      <div className="space-y-6">
        {wordsData.map((wordData, index) => {
          const wordText = wordData.segments
            .sort((a, b) => (a.segmentNo || 0) - (b.segmentNo || 0))
            .map(s => s.text || '')
            .join('');

          return (
            <div key={`word-${words[index]}`} className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold mb-2 flex justify-between items-center">
                <span className="text-gray-600">Word {index + 1}:</span>
                <span className="text-xl">{wordText}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                {wordData.segments.map((segment) => (
                  <div key={segment.id || `segment-${segment.segmentNo}`} 
                       className="bg-white p-2 rounded border">
                    <div className="font-semibold mb-1">
                      Segment {segment.segmentNo || '?'}: {segment.text || 'Text not available'}
                    </div>
                    {generateSegmentExplanation(segment).split(' | ').map((part, i) => (
                      <div key={i} className="text-gray-600 pl-2">
                        {part || 'No analysis available'}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-sm">
        Surah {getSurahName(surahId)}, Ayah {ayahNo}
      </div>
      <audio controls className="mt-2">
        <source src={`https://verses.quran.com/${surahId}/${ayahNo}.mp3`} type="audio/mp3" />
      </audio>
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