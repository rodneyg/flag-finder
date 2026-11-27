import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(
    { error: 'Instagram sign-in is unavailable.' },
    { status: 410 }
  );
}
