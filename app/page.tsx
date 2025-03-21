"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [platform, setPlatform] = useState('');
  const [profile1, setProfile1] = useState('');
  const [profile2, setProfile2] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (platform && profile1 && profile2 && email) {
      router.push(`/results?platform=${platform}&profile1=${profile1}&profile2=${profile2}&email=${email}`);
    } else {
      alert('Please fill out all fields.');
    }
  };

  const getPlaceholder = (base: string) => {
    if (platform === 'instagram') return `${base}instagram`;
    if (platform === 'twitter') return `${base}twitter`;
    return base;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100 p-4">
      <div className="card w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">FlagFinder</h1>
        <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Predict Your Relationship Compatibility</h2>
        <p className="text-sm font-medium text-gray-600 mb-6 text-center">
          <span className="font-bold text-blue-600">Choose one platform</span> and enter both usernames from that platform.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="platform" className="block text-left text-base font-medium text-gray-700 mb-2">Select Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="select select-bordered w-full text-lg bg-gray-50 text-gray-800 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-3"
              required
            >
              <option value="" disabled>Select a platform</option>
              <option value="instagram">Instagram</option>
              <option value="twitter">Twitter</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">Both profiles must be from the same platform</p>
          </div>
          <div>
            <label htmlFor="profile1" className="block text-left text-base font-medium text-gray-700 mb-2">Your Username</label>
            <input
              type="text"
              id="profile1"
              value={profile1}
              onChange={(e) => setProfile1(e.target.value)}
              placeholder={getPlaceholder('@your')}
              className="input input-bordered w-full text-lg bg-gray-50 text-gray-800 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-3"
              required
            />
            <p className="text-sm text-gray-500 mt-2">Enter your username (e.g., {getPlaceholder('@your')})</p>
          </div>
          <div>
            <label htmlFor="profile2" className="block text-left text-base font-medium text-gray-700 mb-2">Their Username</label>
            <input
              type="text"
              id="profile2"
              value={profile2}
              onChange={(e) => setProfile2(e.target.value)}
              placeholder={getPlaceholder('@their')}
              className="input input-bordered w-full text-lg bg-gray-50 text-gray-800 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-3"
              required
            />
            <p className="text-sm text-gray-500 mt-2">Enter their username (e.g., {getPlaceholder('@their')})</p>
          </div>
          <div>
            <label htmlFor="email" className="block text-left text-base font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@gmail.com"
              className="input input-bordered w-full text-lg bg-gray-50 text-gray-800 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-3"
              required
            />
            <p className="text-sm text-gray-500 mt-2">We’ll send your results to this email</p>
          </div>
          <button type="submit" className="btn btn-primary w-full text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-3">
            GET COMPATIBILITY SCORE →
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">Instantly see if they’re a match or a mismatch</p>
      </div>
    </div>
  );
}