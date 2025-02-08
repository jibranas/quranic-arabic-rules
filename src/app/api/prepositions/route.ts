import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface Preposition {
  text: string;
  prefixType: string;
  suffixType: string;
  surahId: number;
  ayahNo: number;
  wordNo: number;
  segmentNo: number;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'morphology-v0.5-tab.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      delimiter: '\t',
      skip_empty_lines: true
    });

    // Create a Map to count segments per word
    const wordSegmentCount = new Map<string, number>();
    
    // Count segments for each word
    records.forEach(record => {
      const wordKey = `${record.SurahId}-${record.AyahId}-${record.WordId}`;
      wordSegmentCount.set(wordKey, (wordSegmentCount.get(wordKey) || 0) + 1);
    });

    // Create a Map to store unique combinations
    const prepositionMap = new Map<string, Preposition>();

    records
      .filter(record => {
        // Only include if PartOfSpeech is P and word has multiple segments
        const wordKey = `${record.SurahId}-${record.AyahId}-${record.WordId}`;
        return record.PartOfSpeech === 'P' && wordSegmentCount.get(wordKey) > 1;
      })
      .forEach(record => {
        const key = record.Text;
        if (!prepositionMap.has(key)) {
          prepositionMap.set(key, {
            text: record.Text,
            prefixType: record.PrefixType || '',
            suffixType: record.SuffixType || '',
            surahId: parseInt(record.SurahId),
            ayahNo: parseInt(record.AyahNo),
            wordNo: parseInt(record.WordNo),
            segmentNo: parseInt(record.SegmentNo)
          });
        }
      });

    // Convert Map to sorted array
    const prepositions = Array.from(prepositionMap.values())
      .sort((a, b) => a.text.localeCompare(b.text));

    return NextResponse.json({ prepositions });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
} 