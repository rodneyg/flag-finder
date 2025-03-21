"use client";

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { db } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Home() {
  const router = useRouter();
  const [platform, setPlatform] = useState('');
  const [profile1, setProfile1] = useState('');
  const [profile2, setProfile2] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showStopPrompt, setShowStopPrompt] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messages = [
    "Fetching profile data... This might take a moment.",
    "Analyzing posts and activity... Hang tight!",
    "Almost there! Building your compatibility report..."
  ];

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/check-auth');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    };
    checkAuth();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
      setIsAuthenticated(true);
      window.history.replaceState(null, '', '/');
    } else if (urlParams.get('error')) {
      setError('Instagram authentication failed: ' + urlParams.get('error_description'));
      window.history.replaceState(null, '', '/');
    }
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 12000);
      return () => clearInterval(interval);
    }
  }, [loading, messages.length]);

  useEffect(() => {
    if (loading) {
      timeoutRef.current = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          setError('Analysis timed out after 90 seconds.');
          setLoading(false);
          setShowStopPrompt(false);
          console.log('Analysis timed out after 90 seconds');
        }
      }, 90000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading]);

  const handleInstagramLogin = () => {
    window.location.href = '/api/instagram/auth';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowStopPrompt(false);
    setFadeOut(false);

    if (!platform || !profile1 || !profile2 || !email) {
      console.log('Validation failed: Missing fields');
      setError('Please fill out all fields.');
      setLoading(false);
      return;
    }

    try {
      console.log('Starting API scrape request:', { platform, profile1, profile2 });
      abortControllerRef.current = new AbortController();
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, profile1, profile2 }),
        signal: abortControllerRef.current.signal,
      });

      console.log('API response status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        console.log('API error:', data);
        if (response.status === 401) {
          setError('Please log in with Instagram to continue.');
          handleInstagramLogin();
          return;
        }
        throw new Error(data.error || 'Failed to fetch profile data');
      }

      console.log('API response data:', data);

      console.log('Storing data in Firebase...');
      const docRef = await addDoc(collection(db, 'analyses'), {
        platform,
        profile1,
        profile2,
        email,
        profile1Data: data.profile1,
        profile2Data: data.profile2,
        timestamp: new Date(),
      }).catch(err => {
        console.error('Firebase addDoc error:', err);
        throw new Error('Failed to store data in Firebase: ' + err.message);
      });

      console.log('Firebase document created with ID:', docRef.id);

      console.log('Initiating redirect to Results Page...');
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
        setShowStopPrompt(false);
        router.replace(`/results?id=${docRef.id}`);
      }, 1000);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Scraping aborted by user or timeout');
        setError('Analysis stopped.');
      } else {
        console.error('Error in handleSubmit:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage || 'An error occurred while fetching profile data.');
      }
    } finally {
      if (!fadeOut) {
        setLoading(false);
        setShowStopPrompt(false);
        abortControllerRef.current = null;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        console.log('Loading state reset to false');
      }
    }
  };

  const handleTest = () => {
    setPlatform('instagram');
    setProfile1('natgeo');
    setProfile2('nasa');
    setEmail('test@example.com');
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleOverlayClick = () => {
    if (loading && !showStopPrompt) {
      setShowStopPrompt(true);
    }
  };

  const handleContinue = () => {
    setShowStopPrompt(false);
  };

  const getPlaceholder = (base: string) => {
    if (platform === 'instagram') return `${base}instagram`;
    if (platform === 'twitter') return `${base}twitter`;
    return base;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100 p-4">
      <div className="relative w-full max-w-md">
        {loading && (
          <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-5 flex items-center justify-center z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleOverlayClick}
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid mb-4"></div>
                <p className="text-gray-800 text-lg mb-4">{messages[currentMessage]}</p>
                {showStopPrompt ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-600">Would you like to stop the analysis?</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleStop}
                        className="btn btn-primary text-base text-white bg-red-600 hover:bg-red-700 rounded-xl py-2 px-4"
                      >
                        Stop
                      </button>
                      <button
                        onClick={handleContinue}
                        className="btn btn-outline text-base text-blue-600 border-blue-600 hover:bg-blue-50 rounded-xl py-2 px-4"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleStop}
                    className="btn btn-primary text-base text-white bg-red-600 hover:bg-red-700 rounded-xl py-2 px-4 mt-4"
                  >
                    Stop Analysis
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="card w-full bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">FlagFinder</h1>
          <h2 className="text-2xl font-semibold mb-2 text-center text-gray-800">Predict Your Relationship Compatibility</h2>
          <p className="text-sm font-medium text-gray-600 mb-6 text-center">
            <span className="font-bold text-blue-600">Choose one platform</span> and enter both usernames from that platform.
          </p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {!isAuthenticated && platform === 'instagram' && (
            <button
              onClick={handleInstagramLogin}
              className="btn btn-primary w-full text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-3 mb-4"
            >
              Log in with Instagram
            </button>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="platform" className="block text-left text-base font-medium text-gray-700 mb-2">Select Platform</label>
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="select select-bordered w-full text-lg bg-gray-50 text-gray-800 focus:ring-blue-500 focus:border-blue-500 rounded-xl p-3"
                required
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">We’ll send your results to this email</p>
            </div>
            <button type="submit" className="btn btn-primary w-full text-lg text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-3" disabled={loading}>
              {loading ? 'Analyzing...' : 'GET COMPATIBILITY SCORE →'}
            </button>
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                onClick={handleTest}
                className="btn btn-outline w-full text-base text-blue-600 border-blue-600 hover:bg-blue-50 rounded-xl py-3 mt-4"
              >
                Fill Test Data
              </button>
            )}
          </form>
          <p className="text-sm text-gray-500 mt-6 text-center">
            Instantly see if they’re a match or a mismatch. <span className="italic">Note: Analysis may take up to 30 seconds.</span>
            <br />
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}