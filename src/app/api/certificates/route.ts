import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const certificates = await db.certificate.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(certificates);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}