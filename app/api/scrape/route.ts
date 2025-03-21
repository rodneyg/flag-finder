import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Define interface for the scraped data
interface InstagramProfileData {
  followers: string;
  posts: Array<{ src: string; alt: string }>;
  bio: string;
  profilePic: string;
}

// Define interface for Instagram media data
interface InstagramMedia {
  media_url: string;
  caption?: string;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    // Get parameters from JSON body
    const { platform, profile1, profile2 } = await request.json();

    // Validate input
    if (!platform || !profile1 || !profile2) {
      console.log('Validation failed: Missing platform or usernames', { platform, profile1, profile2 });
      return NextResponse.json({ error: 'Missing platform or usernames' }, { status: 400 });
    }

    if (!['instagram', 'twitter'].includes(platform)) {
      console.log('Invalid platform:', platform);
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    // Get access token from cookies
    const cookieStore = cookies();
    const accessToken = cookieStore.get('instagram_access_token')?.value;

    if (!accessToken) {
      console.log('Access token missing, user needs to authenticate');
      return NextResponse.json({ error: 'User not authenticated. Please log in with Instagram.' }, { status: 401 });
    }

    // Function to fetch Instagram user data
    const fetchUserData = async (username: string): Promise<InstagramProfileData> => {
      // First, search for the user to get their user ID
      const searchResponse = await fetch(`https://graph.instagram.com/v12.0/ig_users/search?access_token=${accessToken}&q=${username}`);
      const searchData = await searchResponse.json();

      if (!searchResponse.ok || !searchData.data || searchData.data.length === 0) {
        console.log(`User not found: ${username}`, searchData);
        throw new Error(`User not found: ${username}`);
      }

      const userId = searchData.data[0].id;

      // Fetch user profile data
      const profileResponse = await fetch(`https://graph.instagram.com/${userId}?fields=username,media_count,followers_count&access_token=${accessToken}`);
      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        console.log(`Error fetching profile data for ${username}:`, profileData);
        throw new Error(`Failed to fetch profile data for ${username}`);
      }

      // Fetch recent media (posts)
      const mediaResponse = await fetch(`https://graph.instagram.com/${userId}/media?fields=media_url,caption,timestamp&access_token=${accessToken}&limit=3`);
      const mediaData = await mediaResponse.json();

      if (!mediaResponse.ok) {
        console.log(`Error fetching media for ${username}:`, mediaData);
        throw new Error(`Failed to fetch media for ${username}`);
      }

      const posts = mediaData.data.map((post: InstagramMedia) => ({
        src: post.media_url,
        alt: post.caption || '',
      }));

      return {
        followers: profileData.followers_count || '0',
        posts,
        bio: '',
        profilePic: '',
      };
    };

    // Fetch data for both profiles
    console.log('Fetching data for profile1:', profile1);
    const profile1Data = await fetchUserData(profile1);
    console.log('Fetching data for profile2:', profile2);
    const profile2Data = await fetchUserData(profile2);

    return NextResponse.json({ profile1: profile1Data, profile2: profile2Data }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram data', details: error.message }, { status: 500 });
  }
}