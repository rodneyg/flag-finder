export default function DataDeletionConfirmation() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100 p-4">
        <div className="card w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-blue-600 text-center">Data Deletion Confirmation</h1>
          <p className="text-gray-600 text-center">
            Your data has been successfully deleted from FlagFinder. If you have any further questions, please contact us at <a href="mailto:support@flagfinder.app" className="text-blue-600 hover:underline">support@flagfinder.app</a>.
          </p>
        </div>
      </div>
    );
  }