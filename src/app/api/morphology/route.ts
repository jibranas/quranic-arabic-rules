import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse';

// Cache for parsed morphology data
const morphologyCache: {
  [key: string]: {
    id: string;
    surahId: number;
    ayahNo: number;
    wordNo: number;
    segmentNo: number;

    wordPart: number;
    text: string;
    textBw: string;
    lemmaArabic: string;
    lemmaCode: string;
    lemmaBwNew: string;
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
  }[]
} = {};

// Export the initialization function
export async function GET() {
  try {
    if (Object.keys(morphologyCache).length > 0) {
      return NextResponse.json({ success: true });
    }

    const filePath = path.join(process.cwd(), 'data', 'morphology-v0.5-tab.tsv');
    
    // Add debug logging
    console.log('Looking for file at:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found at path:', filePath);
      return NextResponse.json({ error: 'Morphology data file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Add debug logging for file content
    console.log('File content first 200 chars:', fileContent.substring(0, 200));
    
    await new Promise((resolve, reject) => {
      parse(fileContent, {
        delimiter: '\t',
        skip_empty_lines: true,
        from_line: 2, // Skip header row
        relax_column_count: true, // Be more forgiving with column counts
        skip_records_with_error: true // Skip problematic rows instead of failing
      }, (err, records) => {
        if (err) {
          console.error('Parse error:', err);
          reject(err);
          return;
        }

        // Add debug logging
        console.log('Number of records parsed:', records.length);
        if (records.length > 0) {
          console.log('Sample record:', records[0]);
        }

        // Index the records by surah:ayah:word
        records.forEach((record, index) => {
          try {
            const key = `${record[1]}:${record[4]}:${record[5]}`; // surahId:ayahNo:wordNo
            
            // Validate required fields
            if (!record[1] || !record[4] || !record[5]) {
              console.warn(`Skipping record at index ${index} due to missing required fields:`, record);
              return;
            }

            if (!morphologyCache[key]) {
              morphologyCache[key] = [];
            }

            morphologyCache[key].push({
              id: record[0] || '',
              surahId: Number(record[1]),
              ayahNo: Number(record[4]),
              wordNo: Number(record[5]),
              segmentNo: Number(record[6]) || 0,
              wordPart: Number(record[7]) || 0,
              text: record[12] || '',
              textBw: record[13] || '',
              lemmaArabic: record[16] || '',
              lemmaCode: record[17] || '',
              lemmaBwNew: record[18] || '',
              root: record[14] || '',
              rootCode: record[15] || '',
              pos: record[8] || '',
              type: record[9] || '',
              person: record[10] || '',
              gender: record[11] || '',
              prefixType: record[21] || '',
              suffixType: record[22] || '',
              nominalCase: record[28] || '',
              state: record[29] || ''
            });
          } catch (e) {
            console.error(`Error processing record at index ${index}:`, e);
            console.error('Problematic record:', record);
          }
        });

        // Add debug logging
        console.log('Cache size:', Object.keys(morphologyCache).length);
        
        resolve(true);
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error initializing morphology cache:', error);
    // Return more detailed error information
    return NextResponse.json({ 
      error: 'Failed to initialize cache',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { surahId, ayahNo, wordNo, segmentNo } = await request.json();
    
    // Initialize cache if needed
    await GET();

    const key = `${surahId}:${ayahNo}:${wordNo}`;
    let segments = morphologyCache[key];

    if (segments && segments.length > 0) {
      // Filter by segmentNo if provided
      if (segmentNo !== undefined) {
        segments = segments.filter(seg => seg.segmentNo <= segmentNo);
      }
      return NextResponse.json({ segments });
    } else {
      return NextResponse.json({ message: 'Entry not found' }, { status: 404 });
    } 

  } catch (error) {
    console.error('Error in morphology API:', error);
    return NextResponse.json({ 
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function fetchMorphology(surahId: number, ayahNo: number, wordNo: number) {
  const key = `${surahId}:${ayahNo}:${wordNo}`;
  return morphologyCache[key] || [];
} 