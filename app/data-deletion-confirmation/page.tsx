export default function DataDeletionConfirmation() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100 p-4">
        <div className="card w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-blue-600 text-center">Data Deletion Confirmation</h1>
          <p className="text-gray-600 text-center">
            FlagFinder has processed this data deletion request. If you need to contact us, open an issue at <a href="https://github.com/rodneyg/flag-finder/issues" className="text-blue-600 hover:underline">github.com/rodneyg/flag-finder/issues</a> and ask for a private contact method. Do not include personal data in the issue.
          </p>
        </div>
      </div>
    );
  }