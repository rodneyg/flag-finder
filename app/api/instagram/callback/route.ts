import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.json({ error: 'Instagram app configuration missing' }, { status: 500 });
  }

  // Exchange code for access token
  const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok) {
    console.error('Error fetching access token:', tokenData);
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 500 });
  }

  const { access_token, user_id } = tokenData;

  // Store the access token in a cookie (or session, depending on your setup)
  const response = NextResponse.redirect('/?auth=success');
  response.cookies.set('instagram_access_token', access_token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 }); // 7 days expiry
  response.cookies.set('instagram_user_id', user_id, { httpOnly: true, maxAge: 60 * 60 * 24 * 7 });

  return response;
}