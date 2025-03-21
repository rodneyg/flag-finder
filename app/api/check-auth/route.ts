import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies(); // Await the promise to get ReadonlyRequestCookies
  const accessToken = cookieStore.get('instagram_access_token')?.value;
  return NextResponse.json({ authenticated: !!accessToken });
}