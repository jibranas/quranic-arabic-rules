import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

export async function POST(request: Request) {
  try {
    const { surahId, ayahNo, wordNo } = await request.json();
    
    console.log('Searching for:', { surahId, ayahNo, wordNo }); // Debug log

    // Updated file path to point to /data directory
    const filePath = path.join(process.cwd(), 'data', 'morphology-v0.5-tab.csv');
    console.log('File path:', filePath); // Debug log
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found at:', filePath);
      return NextResponse.json({ message: 'Morphology data file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    return new Promise((resolve, reject) => {
      parse(fileContent, {
        delimiter: '\t',
        skip_empty_lines: true
      }, (err, records) => {
        if (err) {
          console.error('CSV parsing error:', err);
          resolve(NextResponse.json({ message: 'Error parsing data' }, { status: 500 }));
          return;
        }

        // Find all segments for the word using AyahNo and WordNo
        const segments = records.filter(record => 
          Number(record[1]) === surahId &&  // SurahId
          Number(record[4]) === ayahNo &&   // AyahNo
          Number(record[5]) === wordNo      // WordNo
        );

        if (segments.length > 0) {
          const wordSegments = segments.map(segment => ({
            id: segment[0],
            surahId: Number(segment[1]),
            ayahNo: Number(segment[4]),
            wordNo: Number(segment[5]),
            segmentNo: Number(segment[6]),
            wordPart: Number(segment[7]),
            text: segment[12],
            textBw: segment[13],
            lemmaArabic: segment[16],
            lemmaCode: segment[17],
            root: segment[14],
            rootCode: segment[15],
            pos: segment[8],
            type: segment[9],
            person: segment[10],
            gender: segment[11],
            prefixType: segment[20],
            suffixType: segment[21],
            nominalCase: segment[27],
            state: segment[28],
          }));

          resolve(NextResponse.json({ segments: wordSegments }));
        } else {
          resolve(NextResponse.json({ message: 'Entry not found' }, { status: 404 }));
        }
      });
    });

  } catch (error) {
    console.error('Error in morphology API:', error);
    return NextResponse.json({ 
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 