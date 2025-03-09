// File: frontend/src/components/common/TermsPage.js
import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
      <div className="bg-gray-800 p-6 rounded-lg prose prose-invert max-w-none">
        <p className="text-sm text-gray-400 mb-4">Last Updated: March 9, 2025</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
        <p>
          Welcome to Playex ("we", "our", or "us"). By accessing or using our website, mobile applications, 
          or any of our services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
          If you do not agree to these Terms, please do not use the Service.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Service Description</h2>
        <p>
          Playex is a streaming interface that aggregates and displays content from third-party sources. 
          We use The Movie Database (TMDB) API for metadata and vidlink.pro for video playback. 
          Playex does not host, store, or distribute any media content directly. 
          We serve as an interface to help you discover and access content from other sources.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Account Registration and Security</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.1 Account Creation</h3>
        <p>
          To use certain features of the Service, you may need to create an account. 
          You must provide accurate, current, and complete information during the registration process 
          and keep your account information updated.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.2 Account Security</h3>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials 
          and for all activities that occur under your account. You agree to notify us immediately 
          of any unauthorized use of your account or any other breach of security.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.3 Password Reset</h3>
        <p>
          If you forget your password, you can reset it through our password reset feature. 
          We may send password reset instructions to the email address associated with your account.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">3.4 Account Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account at our sole discretion, without notice, 
          for conduct that we believe violates these Terms or is harmful to other users of the Service, 
          us, or third parties, or for any other reason.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">4. User Content and Collections</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">4.1 User Collections</h3>
        <p>
          The Service allows you to create and maintain personal collections including watchlists, 
          favorites, and watch history. You acknowledge that these collections are stored for your 
          convenience and may be deleted or become unavailable at any time.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">4.2 Watch History</h3>
        <p>
          We store your watch progress and history to enhance your experience. 
          You can delete your watch history through your account settings.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">4.3 Content Availability</h3>
        <p>
          Content availability depends on third-party services. We do not guarantee the availability, 
          quality, or legitimacy of any content accessed through our Service.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Permitted Use</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">5.1 Personal Use</h3>
        <p>
          The Service is provided for your personal, non-commercial use only. 
          You may not use the Service for any illegal purpose or in violation of any 
          local, state, national, or international law.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">5.2 Prohibited Activities</h3>
        <p>
          You agree not to engage in any of the following prohibited activities:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>Copying, distributing, or disclosing any part of the Service</li>
          <li>Using any automated system to access the Service</li>
          <li>Attempting to interfere with or compromise the system integrity or security</li>
          <li>Impersonating another person or entity</li>
          <li>Collecting or harvesting any information from the Service</li>
          <li>Using the Service to transmit any viruses, worms, defects, Trojans, or other harmful items</li>
          <li>Modifying, adapting, or hacking the Service or modifying another website to falsely imply that it is associated with the Service</li>
        </ul>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">6.1 Ownership</h3>
        <p>
          All content included on the Service, such as text, graphics, logos, images, as well as 
          the compilation thereof, and any software used on the Service, is the property of 
          Playex or its suppliers and protected by copyright and other laws.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">6.2 Third-Party Content</h3>
        <p>
          Content metadata is provided by TMDB. Playex acknowledges that TMDB and its licensors 
          retain all right, title, and interest in and to the TMDB content and data.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">6.3 User License</h3>
        <p>
          Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, 
          non-sublicensable license to access and use the Service for your personal, non-commercial purposes.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">7. Disclaimers and Limitations of Liability</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">7.1 Service "As Is"</h3>
        <p>
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties 
          of any kind, whether express or implied, including but not limited to the implied warranties 
          of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">7.2 Content Disclaimer</h3>
        <p>
          We do not guarantee the accuracy, completeness, or usefulness of any content available 
          through the Service. Any reliance you place on such information is strictly at your own risk.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">7.3 Limitation of Liability</h3>
        <p>
          In no event shall Playex, its officers, directors, employees, or agents, be liable for any 
          indirect, incidental, special, consequential or punitive damages, including without limitation, 
          loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
          to or use of or inability to access or use the Service.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">8. Service Modifications</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">8.1 Changes to the Service</h3>
        <p>
          We reserve the right to modify or discontinue, temporarily or permanently, the Service 
          (or any part thereof) with or without notice. You agree that we shall not be liable to you 
          or to any third party for any modification, suspension, or discontinuance of the Service.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">8.2 Updates to Terms</h3>
        <p>
          We may update these Terms from time to time. We will notify you of any changes by posting 
          the new Terms on this page. Your continued use of the Service after such modifications will 
          constitute your acknowledgment of the modified Terms and agreement to abide and be bound by the modified Terms.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-3">9. General Provisions</h2>
        
        <h3 className="text-lg font-medium mt-4 mb-2">9.1 Governing Law</h3>
        <p>
          These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], 
          without regard to its conflict of law provisions.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">9.2 Severability</h3>
        <p>
          If any provision of these Terms is held to be invalid or unenforceable, such provision shall 
          be struck and the remaining provisions shall be enforced.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">9.3 Entire Agreement</h3>
        <p>
          These Terms constitute the entire agreement between you and us regarding our Service, and 
          supersede and replace any prior agreements we might have between us regarding the Service.
        </p>
        
        <h3 className="text-lg font-medium mt-4 mb-2">9.4 Contact Information</h3>
        <p>
          If you have any questions about these Terms, please contact us at [contact@example.com].
        </p>
        
        <p className="mt-8">Thank you for using Playex!</p>
      </div>
    </div>
  );
};

export default TermsPage;