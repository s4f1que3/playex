import React from 'react';

const CookiePolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">Cookie Policy</h1>
        <div className="text-gray-300 space-y-6">
          <p className="text-sm text-gray-400">Last Updated: March 9, 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>This Cookie Policy explains how Playex ("we", "our", or "us") uses cookies, local storage, and similar technologies when you use our website and services (collectively, the "Service"). This Policy should be read alongside our Privacy Policy and Terms of Service.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how users interact with their sites.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Cookies and Similar Technologies</h2>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">3.1 Types of Technologies We Use</h3>
            <p>We use several types of storage technologies to enhance your experience:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cookies: Small text files stored in your browser</li>
              <li>Local Storage: Browser storage feature that allows websites to store larger amounts of data</li>
              <li>Session Storage: Similar to local storage but cleared when your browser session ends</li>
              <li>IndexedDB: A low-level API for client-side storage of larger amounts of structured data</li>
            </ul>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">3.2 Categories of Cookies We Use</h3>
            <h4 className="text-lg font-medium text-white mt-3 mb-1">3.2.1 Essential Cookies</h4>
            <p>These cookies are necessary for the Service to function properly. They enable core functionality such as security, network management, and user authentication. You cannot opt out of these cookies.</p>
            
            <h4 className="text-lg font-medium text-white mt-3 mb-1">3.2.2 Preference Cookies</h4>
            <p>These cookies allow us to remember choices you make when you use our Service, such as your preferred language, theme settings, and other customization options.</p>
            
            <h4 className="text-lg font-medium text-white mt-3 mb-1">3.2.3 Analytics Cookies</h4>
            <p>These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. This helps us improve our Service.</p>
            
            <h4 className="text-lg font-medium text-white mt-3 mb-1">3.2.4 Functional Cookies</h4>
            <p>These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Specific Uses of Storage Technologies</h2>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">4.1 Authentication</h3>
            <p>We use cookies and local storage to keep you logged in and to remember your authentication status.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">4.2 Watch Progress</h3>
            <p>We use local storage (specifically vidLinkProgress) to track your watch progress across movies and TV shows, allowing you to continue watching where you left off.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">4.3 User Preferences</h3>
            <p>We store your preferences, such as watchlists, favorites, and deleted items from watch history (using playexDeletedItems in local storage).</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">4.4 Site Performance</h3>
            <p>We use cookies to monitor and analyze site performance and to understand how users navigate through our Service.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Third-Party Cookies</h2>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">5.1 TMDB Integration</h3>
            <p>Our Service integrates with The Movie Database (TMDB) API for media metadata. TMDB may place cookies on your device when you interact with content from their service. These cookies are governed by TMDB's own cookie policy.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">5.2 vidlink.pro Integration</h3>
            <p>We use vidlink.pro for video playback. When you watch content through our Service, vidlink.pro may set cookies or use local storage on your device to manage playback settings, track progress, and provide their service. These are governed by vidlink.pro's cookie policy.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">5.3 Analytics Services</h3>
            <p>We may use third-party analytics services that place cookies on your device to help us understand how users engage with our Service. These services collect information anonymously and report website trends without identifying individual visitors.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Cookie Duration</h2>
            <p>Cookies we use may be either "session cookies" or "persistent cookies":</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Session cookies: These are temporary and are deleted when you close your browser</li>
              <li>Persistent cookies: These remain on your device for a set period or until you delete them manually</li>
            </ul>
            <p className="mt-2">The specific duration of each persistent cookie depends on its purpose and is determined either by us or the third party placing the cookie.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Managing Cookies</h2>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">7.1 Browser Settings</h3>
            <p>Most web browsers allow you to control cookies through their settings preferences. These settings are typically found in the "options" or "preferences" menu of your browser.</p>
            <p className="mt-2">To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><a href="http://www.aboutcookies.org/" className="text-[#82BC87] hover:text-[#E4D981]">www.aboutcookies.org</a></li>
              <li><a href="http://www.allaboutcookies.org/" className="text-[#82BC87] hover:text-[#E4D981]">www.allaboutcookies.org</a></li>
            </ul>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">7.2 Managing Local Storage</h3>
            <p>To clear local storage, including watch progress data:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Open your browser settings</li>
              <li>Navigate to privacy or storage settings</li>
              <li>Look for "Site Data" or "Local Storage"</li>
              <li>Clear data for the Playex domain</li>
            </ol>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">7.3 Do Not Track</h3>
            <p>Some browsers have a "Do Not Track" feature that signals to websites that you do not want to have your online activity tracked. Due to the lack of a common understanding of how to interpret this signal, our Service currently does not respond to browser "Do Not Track" signals.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. The Impact of Disabling Cookies</h2>
            <p>If you disable or clear cookies and local storage:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You may not be able to stay logged in</li>
              <li>Your watch progress will be lost</li>
              <li>Personalized features like watchlists and favorites may not function properly</li>
              <li>Your preferences and settings will be reset</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Changes to This Cookie Policy</h2>
            <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date. We advise you to review this Cookie Policy periodically for any changes.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Cookie Policy, please contact us at <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a>.</p>
          </section>
          
          <p className="mt-8 text-center">Thank you for using Playex!</p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;