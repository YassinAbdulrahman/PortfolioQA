import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const experiences = await db.experience.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(experiences);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}