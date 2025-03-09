// File: frontend/src/pages/TermsPage.js
import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
            <div className="text-gray-300 space-y-6">
              <p className="text-sm text-gray-400">Last Updated: March 9, 2025</p>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
                <p>At Playex ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Service").</p>
                <p className="mt-2">Please read this Privacy Policy carefully. By using the Service, you consent to the practices described in this policy.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">2.1 Account Information</h3>
                <p>When you create an account, we collect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Username</li>
                  <li>Email address</li>
                  <li>Password (stored in encrypted form)</li>
                  <li>Profile information you choose to provide</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">2.2 Usage Information</h3>
                <p>We collect information about how you interact with our Service:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Watch history</li>
                  <li>Watchlist and favorites selections</li>
                  <li>Viewing preferences</li>
                  <li>Time spent watching specific content</li>
                  <li>Playback progress</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">2.3 Automatically Collected Information</h3>
                <p>When you access our Service, we automatically collect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Operating system</li>
                  <li>Referral source</li>
                  <li>Length of visit and pages viewed</li>
                  <li>Other diagnostic data</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">2.4 Local Storage Data</h3>
                <p>We use browser local storage to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Store watch progress information</li>
                  <li>Maintain user preferences</li>
                  <li>Keep track of deleted items in watch history</li>
                  <li>Store authentication tokens</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">3.1 Provide the Service</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Maintain your account</li>
                  <li>Track your watch progress</li>
                  <li>Manage your watchlist and favorites</li>
                  <li>Personalize your viewing experience</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">3.2 Improve the Service</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Develop new features</li>
                  <li>Fix bugs and issues</li>
                  <li>Understand how users interact with the Service</li>
                  <li>Make informed decisions about future development</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">3.3 Personalization</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Recommend content based on your watch history</li>
                  <li>Remember your preferences</li>
                  <li>Customize your experience</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">3.4 Communication</h3>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Respond to your inquiries</li>
                  <li>Send service-related notifications</li>
                  <li>Provide updates about the Service</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">4. Storage and Security</h2>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">4.1 Local Storage</h3>
                <p>Much of your user data, including watch progress, is stored in your browser's localStorage. This data remains on your device and is not transmitted to our servers except as needed to provide the Service.</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">4.2 Data Retention</h3>
                <p>We retain your account information for as long as your account is active. You can delete your account at any time, which will remove your personal information from our systems.</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">4.3 Security Measures</h3>
                <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">5. Information Sharing</h2>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">5.1 Third-Party Service Providers</h3>
                <p>We may share your information with third-party service providers that help us operate our Service:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>TMDB API:</strong> We use The Movie Database (TMDB) API to retrieve media metadata. Your search queries and interactions with media content may be shared with TMDB in accordance with their privacy policy.</li>
                  <li><strong>vidlink.pro:</strong> We use vidlink.pro for video playback. When you watch content, information about your viewing activity may be shared with vidlink.pro in accordance with their privacy policy.</li>
                </ul>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">5.2 Legal Requirements</h3>
                <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">5.3 Business Transfers</h3>
                <p>If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">6. Your Rights and Choices</h2>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">6.1 Account Information</h3>
                <p>You can review and update your account information through your account settings.</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">6.2 Watch History</h3>
                <p>You can view and delete your watch history through the Watch History page. You can also clear your entire watch history at once.</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">6.3 Deleted Items</h3>
                <p>When you delete items from your watch history, we store this preference to ensure those items don't reappear in your history when you watch new content.</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">6.4 Account Deletion</h3>
                <p>You can delete your account at any time through your account settings. This will remove your personal information from our systems.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">7. Children's Privacy</h2>
                <p>Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">8. Third-Party Links and Services</h2>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">8.1 External Links</h3>
                <p>Our Service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">8.2 TMDB Integration</h3>
                <p>We use TMDB for media metadata. Your interactions with media content may be subject to TMDB's privacy policy, which we encourage you to read.</p>
                
                <h3 className="text-xl font-medium text-white mt-4 mb-2">8.3 vidlink.pro Integration</h3>
                <p>We use vidlink.pro for video playback. Your viewing activity may be subject to vidlink.pro's privacy policy, which we encourage you to read.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">9. Changes to This Privacy Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.</p>
              </section>
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-3">10. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a>.</p>
              </section>
              
              <p className="mt-8 text-center">Thank you for trusting Playex!</p>
            </div>
          </div>
        </div>
      );
    };

export default PrivacyPolicyPage;