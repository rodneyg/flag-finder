"use client";

import Link from 'next/link';

export default function Payment() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-10">Upgrade Your Insights</h1>
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="card flex-1 bg-gray-50 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Free Plan</h2>
            <p className="text-3xl font-bold text-gray-600 mb-4 text-center">$0 <span className="text-base font-normal">/ forever</span></p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>5 analyses per day</li>
              <li>Basic compatibility score</li>
            </ul>
            <div className="w-full flex justify-center">
              <button className="w-full text-base text-gray-500 bg-gray-200 rounded-xl py-3 px-6 shadow-md cursor-not-allowed text-center">
                Current Plan
              </button>
            </div>
          </div>
          <div className="card flex-1 bg-blue-50 shadow-xl rounded-2xl p-6 border-4 border-blue-600 relative">
            <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg rounded-tr-lg">Most Popular</span>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Deep Plan</h2>
            <p className="text-3xl font-bold text-blue-600 mb-4 text-center">$15 <span className="text-base font-normal">/ month</span></p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Unlimited analyses</li>
              <li>Up to 5 red/green flags</li>
              <li>Tone and image analysis</li>
            </ul>
            <div className="w-full flex justify-center">
              <Link href="https://stripe.com" className="w-full text-base text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-3 px-6 shadow-md hover:shadow-lg transition-shadow text-center">
                Select Deep Plan
              </Link>
            </div>
          </div>
          <div className="card flex-1 bg-gray-50 shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Pay-As-You-Go Credits</h2>
            <p className="text-3xl font-bold text-gray-600 mb-4 text-center">$1 <span className="text-base font-normal">= 10 credits</span></p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>5 credits per Basic analysis</li>
              <li>15 credits per Deep analysis</li>
            </ul>
            <div className="w-full flex justify-center">
              <Link href="https://stripe.com" className="w-full text-base text-white bg-blue-600 hover:bg-blue-700 rounded-xl py-3 px-6 shadow-md hover:shadow-lg transition-shadow text-center">
                Buy Credits
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link href="/results" className="btn inline-block text-base text-white bg-blue-800 hover:bg-blue-900 rounded-xl !py-3 !px-6 shadow-md hover:shadow-lg transition-shadow">
            Back to Results
          </Link>
        </div>
      </div>
    </div>
  );
}