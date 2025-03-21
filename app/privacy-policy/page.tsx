export default function PrivacyPolicy() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-gray-100 p-4">
        <div className="card w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
          <h1 className="text-3xl font-bold text-blue-600 text-center">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: March 20, 2025</p>
          <p className="text-gray-600">
            FlagFinder (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the FlagFinder app, which uses the Instagram Basic Display API to fetch user profile data and media to predict relationship compatibility. This Privacy Policy explains how we collect, use, and protect your information.
          </p>
          <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
          <p className="text-gray-600">
            We collect the following information when you use our app:
            - <strong>Instagram Data</strong>: When you log in with Instagram, we collect your username, follower count, and recent posts (up to 3 posts) via the Instagram Basic Display API.
            - <strong>User Input</strong>: Your email address and the Instagram usernames you provide.
            - <strong>Cookies</strong>: We use cookies to store your Instagram access token for authentication purposes.
          </p>
          <h2 className="text-xl font-semibold text-gray-800">2. How We Use Your Information</h2>
          <p className="text-gray-600">
            We use the collected information to:
            - Generate compatibility reports based on Instagram profile data.
            - Display your Instagram profile information on the Results Page.
            - Send you the compatibility report via email.
          </p>
          <h2 className="text-xl font-semibold text-gray-800">3. Third-Party Sharing</h2>
          <p className="text-gray-600">
            We share your data with:
            - <strong>Instagram (Meta)</strong>: To fetch your profile data via the Instagram Basic Display API.
            - <strong>Firebase</strong>: To store your analysis data (usernames, email, and scraped data).
            We do not share your data with other third parties for marketing or advertising purposes.
          </p>
          <h2 className="text-xl font-semibold text-gray-800">4. User Control</h2>
          <p className="text-gray-600">
            You can revoke our access to your Instagram data at any time through your Instagram account settings. To delete your data from our app, please contact us at support@flagfinder.app.
          </p>
          <h2 className="text-xl font-semibold text-gray-800">5. Data Security</h2>
          <p className="text-gray-600">
            We implement reasonable security measures to protect your data from unauthorized access, including secure storage with Firebase and encrypted cookies for access tokens.
          </p>
          <h2 className="text-xl font-semibold text-gray-800">6. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy or our data practices, please contact us at support@flagfinder.app.
          </p>
        </div>
      </div>
    );
  }