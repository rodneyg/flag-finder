import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100 p-4">
      <section className="card w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold text-blue-600">FlagFinder</h1>
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">Service unavailable</h2>
        <p className="mb-6 text-gray-700">
          FlagFinder is temporarily unavailable while we update its Instagram data connection. No profile or email information is being collected.
        </p>
        <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
      </section>
    </main>
  );
}
