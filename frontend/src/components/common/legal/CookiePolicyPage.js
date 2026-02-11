import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactLink from '../ContactLink';

const PolicySection = ({ title, children, icon, expandedByDefault = false }) => {
  const [isExpanded, setIsExpanded] = useState(expandedByDefault);

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
                   hover:border-cyan-500/20 transition-all duration-500"
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
              ${isExpanded ? 'bg-cyan-500/20' : 'bg-white/5'}`}
            >
              {icon}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-500 transition-colors duration-300">
              {title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`w-6 h-6 flex items-center justify-center transition-colors duration-300
              ${isExpanded ? 'text-cyan-500' : 'text-gray-400'}`}
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

      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />
    </motion.div>
  );
};

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative -mx-4 mb-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[40vh] bg-gradient-to-b from-gray-900/90 via-gray-900/50 to-[#161616]"
        >
          {/* ...existing hero background code... */}

          <div className="container relative mx-auto px-4 h-full flex items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
                <span className="text-cyan-500 font-medium">Legal Information</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Cookie
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-indigo-500 ml-3">
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
          <div className="text-sm text-cyan-500 mb-8">Last Updated: March 11, 2025</div>

          {/* Convert each section to use PolicySection component */}
          <PolicySection 
            title="Introduction"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
            expandedByDefault={true}
          >
            <p>This Cookie Policy explains how Playex ("we", "our", or "us") uses cookies, local storage, and similar technologies when you use our website and services (collectively, the "Service"). This Policy should be read alongside our Privacy Policy and Terms of Service.</p>
          </PolicySection>

          <PolicySection 
            title="What Are Cookies?"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how users interact with their sites.</p>
          </PolicySection>

          <PolicySection 
            title="How We Use Cookies and Similar Technologies"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Types of Technologies We Use</h3>
            <p>We use several types of storage technologies to enhance your experience:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cookies: Small text files stored in your browser</li>
              <li>Local Storage: Browser storage feature that allows websites to store larger amounts of data</li>
              <li>Session Storage: Similar to local storage but cleared when your browser session ends</li>
              <li>IndexedDB: A low-level API for client-side storage of larger amounts of structured data</li>
            </ul>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Categories of Cookies We Use</h3>
            <h4 className="text-lg font-medium text-white mt-3 mb-1">Essential Cookies</h4>
            <p>These cookies are necessary for the Service to function properly. They enable core functionality such as security and network management. You cannot opt out of these cookies.</p>
            
            <h4 className="text-lg font-medium text-white mt-3 mb-1">Preference Cookies</h4>
            <p>These cookies allow us to remember choices you make when you use our Service, such as your preferred language, theme settings, and other customization options.</p>
            
            <h4 className="text-lg font-medium text-white mt-3 mb-1">Analytics Cookies</h4>
            <p>These cookies help us understand how visitors interact with our Service by collecting and reporting information anonymously. This helps us improve our Service.</p>
            
            <h4 className="text-lg font-medium text-white mt-3 mb-1">Functional Cookies</h4>
            <p>These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.</p>
          </PolicySection>

          <PolicySection 
            title="Specific Uses of Storage Technologies"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Authentication</h3>
            <p>We use cookies and local storage to enable your watchlist and favorites.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Site Performance</h3>
            <p>We use cookies to monitor and analyze site performance and to understand how users navigate through our Service.</p>
          </PolicySection>

          <PolicySection 
            title="Third-Party Cookies"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <h3 className="text-xl font-medium text-white mt-4 mb-2">TMDB Integration</h3>
            <p>Our Service integrates with The Movie Database (TMDB) API for media metadata. TMDB may place cookies on your device when you interact with content from their service. These cookies are governed by TMDB's own cookie policy.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">vidlink.pro Integration</h3>
            <p>We use vidlink.pro for video playback. When you watch content through our Service, vidlink.pro may set cookies or use local storage on your device to manage playback settings, track progress, and provide their service. These are governed by vidlink.pro's cookie policy.</p>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Analytics Services</h3>
            <p>We may use third-party analytics services that place cookies on your device to help us understand how users engage with our Service. These services collect information anonymously and report website trends without identifying individual visitors.</p>
          </PolicySection>

          <PolicySection 
            title="Cookie Duration"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <p>Cookies we use may be either "session cookies" or "persistent cookies":</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Session cookies: These are temporary and are deleted when you close your browser</li>
              <li>Persistent cookies: These remain on your device for a set period or until you delete them manually</li>
            </ul>
            <p className="mt-2">The specific duration of each persistent cookie depends on its purpose and is determined either by us or the third party placing the cookie.</p>
          </PolicySection>

          <PolicySection 
            title="Managing Cookies"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Browser Settings</h3>
            <p>Most web browsers allow you to control cookies through their settings preferences. These settings are typically found in the "options" or "preferences" menu of your browser.</p>
            <p className="mt-2">To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><a href="http://www.aboutcookies.org/" className="text-cyan-500 hover:text-indigo-400">www.aboutcookies.org</a></li>
              <li><a href="http://www.allaboutcookies.org/" className="text-cyan-500 hover:text-indigo-400">www.allaboutcookies.org</a></li>
            </ul>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Managing Local Storage</h3>
            <p>To clear local storage, including watch progress data:</p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Open your browser settings</li>
              <li>Navigate to privacy or storage settings</li>
              <li>Look for "Site Data" or "Local Storage"</li>
              <li>Clear data for the Playex domain</li>
            </ol>
            
            <h3 className="text-xl font-medium text-white mt-4 mb-2">Do Not Track</h3>
            <p>Some browsers have a "Do Not Track" feature that signals to websites that you do not want to have your online activity tracked. Due to the lack of a common understanding of how to interpret this signal, our Service currently does not respond to browser "Do Not Track" signals.</p>
          </PolicySection>

          <PolicySection 
            title="The Impact of Disabling Cookies"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <p>If you disable or clear cookies and local storage:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>You may not be able to stay logged in</li>
              <li>Personalized features like watchlists and favorites may not work</li>
              <li>Your preferences and settings will be reset</li>
            </ul>
          </PolicySection>

          <PolicySection 
            title="Changes to This Cookie Policy"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <p>We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last Updated" date. We advise you to review this Cookie Policy periodically for any changes.</p>
          </PolicySection>

          <PolicySection 
            title="Contact Us"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>}
          >
            <p>If you have any questions about this Cookie Policy, please contact us at 
            <ContactLink buttonStyle={true} className="text-cyan-500 hover:text-indigo-400"
            subject="Cookie Policy Inquires">
              contact.playex@gmail.com</ContactLink>
            </p>
          </PolicySection>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <ContactLink
              buttonStyle={true}
              subject="Cookie Policy Inquiries"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-white font-medium hover:bg-blue-600 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Support
            </ContactLink>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;