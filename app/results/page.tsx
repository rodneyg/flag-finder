"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Results() {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform') || 'unknown';
  const profile1 = searchParams.get('profile1') || 'unknown';
  const profile2 = searchParams.get('profile2') || 'unknown';

  const getProfileLink = (username: string) => {
    const baseUrl = platform === 'instagram' ? 'https://instagram.com' : 'https://twitter.com';
    const cleanUsername = username.startsWith('@') ? username.replace('@', '') : username;
    return `${baseUrl}/${cleanUsername}`;
  };

  const compatibilityScore = 75; // Static for now, will be dynamic later
  const scoreColor = compatibilityScore >= 70 ? 'text-green-500' : compatibilityScore >= 40 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100 p-4">
      <div className="card w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-blue-600 text-center">Your Compatibility Results</h1>
        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Profile</h2>
          <p className="text-gray-600">
            <a href={getProfileLink(profile1)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile1}</a> ({platform.charAt(0).toUpperCase() + platform.slice(1)})
          </p>
          <p className="text-gray-700 mt-2">Looks like you’re active and friendly online!</p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Posts regularly and gets good engagement.</li>
            <li>Shares positive and respectful content.</li>
            <li>No red flags found—great job!</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Their Profile</h2>
          <p className="text-gray-600">
            <a href={getProfileLink(profile2)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile2}</a> ({platform.charAt(0).toUpperCase() + platform.slice(1)})
          </p>
          <p className="text-gray-700 mt-2">They’re active but might be a bit casual.</p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Posts often, but engagement varies.</li>
            <li>Some posts have a casual or flirty vibe.</li>
            <li>Minor red flag: Watch for consistency in tone.</li>
          </ul>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Compatibility Score</h2>
          <p className={`text-4xl font-bold ${scoreColor} mb-2`}>{compatibilityScore}/100</p>
          <p className="text-gray-700">You two have a decent match, but there might be some differences in how you both interact online.</p>
        </div>
        <div className="text-sm text-gray-500">
          <p><strong>Disclaimer:</strong> These insights are based on public data and are for informational purposes only. They’re not a final judgment of someone’s character. Always trust your own experiences and how they treat you in real life.</p>
        </div>
        <Link href="/" className="btn btn-primary w-full text-base text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-3 px-6 shadow-md hover:shadow-lg transition-shadow">
          Analyze Another Pair
        </Link>
      </div>
    </div>
  );
}