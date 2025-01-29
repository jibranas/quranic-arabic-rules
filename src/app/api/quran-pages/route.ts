import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'pages.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      delimiter: ',',
      skip_empty_lines: true
    });

    console.log('Pages API: First few records:', records.slice(0, 3)); // Debug log
    return NextResponse.json({ pages: records });

  } catch (error) {
    console.error('Error in pages API:', error);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
} 