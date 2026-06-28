import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }
    const admin = await db.admin.findUnique({ where: { username } });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const valid = await compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = signToken(admin.id);
    return NextResponse.json({ token, id: admin.id });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}