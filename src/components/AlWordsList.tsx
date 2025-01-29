'use client';

import { useEffect, useState } from 'react';

interface WordPair {
  prefix: string;
  word: string;
  surahId: number;
  surahName: string;
  ayahId: number;
}

type SortType = 'location' | 'frequency';

export default function AlWordsList() {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [sortType, setSortType] = useState<SortType>('location');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('/api/al-words');
        const data = await response.json();
        
        if (response.ok) {
          setWordPairs(data.wordPairs);
        } else {
          setError(data.error || 'Failed to fetch words');
        }
      } catch (err) {
        setError('Failed to fetch words');
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const getSortedWords = () => {
    if (sortType === 'frequency') {
      // Count frequencies
      const frequencyMap = wordPairs.reduce((acc, pair) => {
        const key = `${pair.prefix}${pair.word}`;
        acc[key] = acc[key] || { count: 0, pair };
        acc[key].count++;
        return acc;
      }, {} as Record<string, { count: number; pair: WordPair }>);

      // Convert to array and sort by frequency
      return Object.values(frequencyMap)
        .sort((a, b) => b.count - a.count)
        .map(item => ({
          ...item.pair,
          frequency: item.count
        }));
    }

    // Default location-based sorting
    return wordPairs.sort((a, b) => {
      if (a.surahId !== b.surahId) {
        return a.surahId - b.surahId;
      }
      return a.ayahId - b.ayahId;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const sortedWords = getSortedWords();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Words with ٱل</h1>
        <div className="space-x-2">
          <button
            onClick={() => setSortType('location')}
            className={`px-3 py-1 rounded ${
              sortType === 'location' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200'
            }`}
          >
            By Location
          </button>
          <button
            onClick={() => setSortType('frequency')}
            className={`px-3 py-1 rounded ${
              sortType === 'frequency' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200'
            }`}
          >
            By Frequency
          </button>
        </div>
      </div>
      <div className="grid gap-2">
        {sortedWords.map((pair, index) => (
          <div key={index} className="p-2 border rounded flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {sortType === 'frequency' && (
                <span className="mr-2 px-2 py-0.5 bg-gray-200 rounded-full">
                  {(pair as any).frequency}×
                </span>
              )}
              {pair.surahName} ({pair.surahId}:{pair.ayahId})
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-3xl">{pair.prefix}</span>
              <span className="text-3xl">{pair.word}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 