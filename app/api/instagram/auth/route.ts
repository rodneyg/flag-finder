import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;
  const scope = 'user_profile,user_media';

  if (!appId || !redirectUri) {
    return NextResponse.json({ error: 'Instagram app configuration missing' }, { status: 500 });
  }

  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  return NextResponse.redirect(authUrl);
}