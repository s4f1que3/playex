import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PolicySection = ({ title, children, icon }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-left border border-white/5 
                   hover:border-[#82BC87]/20 transition-all duration-500"
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
              ${isExpanded ? 'bg-[#82BC87]/20' : 'bg-white/5'}`}
            >
              {icon}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#82BC87] transition-colors duration-300">
              {title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`w-6 h-6 flex items-center justify-center transition-colors duration-300
              ${isExpanded ? 'text-[#82BC87]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-white/5 text-gray-300 space-y-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#82BC87]/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />
    </motion.div>
  );
};

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative -mx-4 mb-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[40vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-pattern-grid opacity-5 animate-pulse transform rotate-45 scale-150" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-gray-900/50 to-transparent" />
          </div>

          <div className="container relative mx-auto px-4 h-full flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#82BC87]/10 border border-[#82BC87]/20 mb-6 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#82BC87] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#82BC87]" />
                </span>
                <span className="text-[#82BC87] font-medium">Legal Information</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Privacy
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                  Policy
                </span>
              </h1>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-sm text-[#82BC87] mb-8">Last Updated: March 11, 2025</div>

          {/* Policy Sections */}
          <PolicySection title="1. Introduction" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <p>At Playex ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (collectively, the "Service").</p>
            <p className="mt-2">Please read this Privacy Policy carefully. By using the Service, you consent to the practices described in this policy.</p>
          </PolicySection>

          <PolicySection title="2. Information We Collect" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">2.1 Usage Information</h3>
            <p>We collect information about how you interact with our Service:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Watchlist and favorites selections</li>
              <li>Viewing preferences</li>
            </ul>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">2.2 Automatically Collected Information</h3>
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
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">2.3 Local Storage Data</h3>
            <p>We use browser local storage to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Enable the Watchlist function</li>
              <li>Enable the Favorites function</li>
              <li>Maintain user preferences</li>
            </ul>
          </PolicySection>

          <PolicySection title="3. How We Use Your Information" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">3.1 Provide the Service</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
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
              <li>Remember your preferences</li>
              <li>Customize your experience</li>
            </ul>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">3.4 Communication</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Respond to your inquiries</li>
              <li>Send service-related notifications</li>
              <li>Provide updates about the Service</li>
            </ul>
          </PolicySection>

          <PolicySection title="4. Information Sharing" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">4.1 Third-Party Service Providers</h3>
            <p>We may share your information with third-party service providers that help us operate our Service:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>TMDB API:</strong> We use The Movie Database (TMDB) API to retrieve media metadata. Your search queries and interactions with media content may be shared with TMDB in accordance with their privacy policy.</li>
              <li><strong>Embed Players:</strong> We use vidlink.pro, embed.su, and vidsrc.me for video playback. When you watch content, information about your viewing activity may be shared with them in accordance with their privacy policy.</li>
            </ul>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">4.2 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">4.3 Business Transfers</h3>
            <p>If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</p>
          </PolicySection>

          <PolicySection title="5. Children's Privacy" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <p>Our Service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.</p>
          </PolicySection>

          <PolicySection title="6. Third-Party Links and Services" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <h3 className="text-xl font-medium text-white mt-4 mb-2">6.1 External Links</h3>
            <p>Our Service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">6.2 TMDB Integration</h3>
            <p>We use TMDB for media metadata. Your interactions with media content may be subject to TMDB's privacy policy, which we encourage you to read.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">6.3 embed players Integration</h3>
            <p>We use vidlink.pro, embed.su, and vidsrc.me for video playback. Your viewing activity may be subject to their privacy policies which we encourage you to read.</p>
          </PolicySection>

          <PolicySection title="7. Changes to This Privacy Policy" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.</p>
          </PolicySection>

          <PolicySection title="8. Contact Us" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" /></svg>}>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a>.</p>
          </PolicySection>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-r from-[#82BC87]/10 to-transparent backdrop-blur-sm border border-white/5">
              <p className="text-gray-300 mb-3">Have questions about our privacy policy?</p>
              <a
                href="mailto:contact.playex@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#82BC87] text-white font-medium hover:bg-[#6da972] transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Contact Privacy Team
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .bg-pattern-grid {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicyPage;