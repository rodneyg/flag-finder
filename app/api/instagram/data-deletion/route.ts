import { NextResponse } from 'next/server';
import { db } from './../../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    // Meta sends this callback as form data. JSON remains supported for existing callers.
    const contentType = request.headers.get('content-type') || '';
    let signed_request: string | null | undefined;
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const value = formData.get('signed_request');
      signed_request = typeof value === 'string' ? value : undefined;
    } else {
      const body = await request.json();
      signed_request = body?.signed_request;
    }

    if (!signed_request) {
      return NextResponse.json({ error: 'Missing signed_request' }, { status: 400 });
    }

    // Split the signed request into signature and payload
    const [encodedSig, payload] = signed_request.split('.');
    if (!encodedSig || !payload) {
      return NextResponse.json({ error: 'Invalid signed_request format' }, { status: 400 });
    }

    // Decode the signature and payload
    const signature = Buffer.from(encodedSig, 'base64').toString('hex');
    const decodedPayload = Buffer.from(payload, 'base64').toString('utf8');
    const data = JSON.parse(decodedPayload);

    // Verify the signature
    const appSecret = process.env.INSTAGRAM_APP_SECRET;
    if (!appSecret) {
      return NextResponse.json({ error: 'Missing Instagram app secret' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Extract the user ID from the payload
    const userId = data.user_id;
    if (!userId) {
      return NextResponse.json({ error: 'Missing user_id in payload' }, { status: 400 });
    }

    // Delete the user's data from Firestore
    const analysesRef = collection(db, 'analyses');
    // Check for profile1Data.instagramUserId
    const q1 = query(analysesRef, where('profile1Data.instagramUserId', '==', userId));
    const querySnapshot1 = await getDocs(q1);
    for (const doc of querySnapshot1.docs) {
      await deleteDoc(doc.ref);
    }

    // Check for profile2Data.instagramUserId (if applicable)
    const q2 = query(analysesRef, where('profile2Data.instagramUserId', '==', userId));
    const querySnapshot2 = await getDocs(q2);
    for (const doc of querySnapshot2.docs) {
      await deleteDoc(doc.ref);
    }

    // Respond with a confirmation URL on the same deployment that handled the request.
    const confirmationCode = crypto.randomBytes(16).toString('hex');
    const confirmationUrl = new URL('/data-deletion-confirmation', request.url);
    confirmationUrl.searchParams.set('confirmation_code', confirmationCode);
    return NextResponse.json({ url: confirmationUrl.toString(), confirmation_code: confirmationCode }, { status: 200 });

  } catch (error) {
    console.error('Error in data deletion callback:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to process data deletion request', details: errorMessage }, { status: 500 });
  }
}