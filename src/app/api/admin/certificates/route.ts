import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const auth = verifyToken(request.headers.get('authorization'));
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await request.json();
    const cert = await db.certificate.create({ data: body });
    return NextResponse.json(cert);
  } catch {
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = verifyToken(request.headers.get('authorization'));
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, ...data } = await request.json();
    const cert = await db.certificate.update({ where: { id }, data });
    return NextResponse.json(cert);
  } catch {
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = verifyToken(request.headers.get('authorization'));
  if (!auth.valid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    await db.certificate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 });
  }
}