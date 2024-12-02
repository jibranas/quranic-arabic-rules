import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Waitlist } from '@/lib/models/waitlist';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingEmail = await Waitlist.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const waitlistEntry = await Waitlist.create({ email });

    return NextResponse.json(
      { message: 'Successfully joined waitlist', data: waitlistEntry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
} 