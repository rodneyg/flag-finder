"use client";

import { auth } from './lib/firebase';

export default function Home() {
  return (
    <div>
      <h1>FlagFinder</h1>
      <p>Firebase Auth State: {auth ? 'Initialized' : 'Not Initialized'}</p>
      <button className="btn">Test Daisy UI</button>
    </div>
  );
}