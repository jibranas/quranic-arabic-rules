// app/api/al-words/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { surahNames } from '@/utils/surahNames';

interface WordPair {
  prefix: string;
  word: string;
  surahId: number;
  surahName: string;
  ayahId: number;
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

    const results: WordPair[] = [];
    for (let i = 0; i < records.length; i++) {
      if (records[i].Text === 'ٱل') {
        if (i + 1 < records.length &&
            records[i + 1].SurahId === records[i].SurahId &&
            records[i + 1].AyahId === records[i].AyahId &&
            records[i + 1].WordId === records[i].WordId &&
            parseInt(records[i + 1].SegmentNo) === parseInt(records[i].SegmentNo) + 1) {
          const surahId = parseInt(records[i].SurahId);
          results.push({
            prefix: records[i].Text,
            word: records[i + 1].Text,
            surahId,
            surahName: surahNames[surahId as keyof typeof surahNames],
            ayahId: parseInt(records[i].AyahId)
          });
        }
      }
    }

    // Sort by Surah and Ayah order
    const sortedResults = results.sort((a, b) => {
      if (a.surahId !== b.surahId) {
        return a.surahId - b.surahId;
      }
      return a.ayahId - b.ayahId;
    });

    return NextResponse.json({ wordPairs: sortedResults });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}