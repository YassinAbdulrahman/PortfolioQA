import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'portfolio-secret-key-2024';

export function verifyToken(authHeader: string | null): { valid: boolean; id?: string } {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return { valid: false };
  try {
    const payload = jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as { id: string };
    return { valid: true, id: payload.id };
  } catch {
    return { valid: false };
  }
}

export function signToken(id: string): string {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '24h' });
}