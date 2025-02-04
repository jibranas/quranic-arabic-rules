import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { key } = await request.json();

    const filePath = path.join(process.cwd(), 'data', 'English wbw translation.json');
    const translations = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (translations[key]) {
      return NextResponse.json({ [key]: translations[key] });
    }

    return NextResponse.json({ message: 'Translation not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 });
  }
} 