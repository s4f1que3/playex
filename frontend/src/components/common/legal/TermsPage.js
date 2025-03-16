import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#82BC87]/10 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#82BC87]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
        </svg>
      </div>
      {title}
    </h2>
    <div className="ml-13">
      {children}
    </div>
  </motion.div>
);

const Subsection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-semibold text-[#E4D981] mb-3">{title}</h3>
    <div className="text-gray-300 space-y-4">
      {children}
    </div>
  </div>
);

const TermsPage = () => {
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
                Terms of
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                  Service
                </span>
              </h1>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#82BC87]/20 rounded-full filter blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="relative p-8">
              <div className="text-sm text-[#82BC87] mb-8">Last Updated: March 11, 2025</div>

              <Section title="1. Introduction">
                <p>
                  Welcome to Playex ("we", "our", or "us"). By accessing or using our website, mobile applications, 
                  or any of our services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you do not agree to these Terms, please do not use the Service.
                </p>
              </Section>

              <Section title="1.2 Embed Players">
                <p>
                  We use three embed players on our website : Vidlink.pro, Embed.su, and Vidsrc.me. If at any time we refer to embedded players, these are the three we are talking about.
                </p>
              </Section>

              <Section title="2. Service Description">
                <p>
                  Playex is a streaming interface that aggregates and displays content from third-party sources. 
                  We use The Movie Database (TMDB) API for metadata and embed players for video playback. 
                  Playex does not host, store, or distribute any media content directly. 
                  We serve as an interface to help you discover and access content from other sources.
                </p>
              </Section>

              <Section title="3. Account Registration and Security">
                <Subsection title="3.1 Account Creation">
                  <p>
                    We require no account creation to use our website. As we aim for our site to be easy to use, features (such as favorites and watchlist) work without account creation.
                  </p>
                </Subsection>
              </Section>

              <Section title="4. Content Availability">
                <p>
                  Content availability depends on third-party services. We do not guarantee the availability, 
                  quality, or legitimacy of any content accessed through our Service.
                </p>
              </Section>

              <Section title="5. Permitted Use">
                <Subsection title="5.1 Personal Use">
                  <p>
                    The Service is provided for your personal, non-commercial use only. 
                    You may not use the Service for any illegal purpose or in violation of any 
                    local, state, national, or international law.
                  </p>
                </Subsection>

                <Subsection title="5.2 Prohibited Activities">
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
                </Subsection>
              </Section>

              <Section title="6. Intellectual Property">
                <Subsection title="6.1 Ownership">
                  <p>
                    All content included on the Service, such as text, graphics, logos, images, as well as 
                    the compilation thereof, and any software used on the Service, is the property of 
                    Playex or its suppliers and protected by copyright and other laws.
                  </p>
                </Subsection>

                <Subsection title="6.2 Third-Party Content">
                  <p>
                    Content metadata is provided by TMDB. Playex acknowledges that TMDB and its licensors 
                    retain all right, title, and interest in and to the TMDB content and data.
                  </p>
                </Subsection>

                <Subsection title="6.3 User License">
                  <p>
                    Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, 
                    non-sublicensable license to access and use the Service for your personal, non-commercial purposes.
                  </p>
                </Subsection>
              </Section>

              <Section title="7. Disclaimers and Limitations of Liability">
                <Subsection title="7.1 Service 'As Is'">
                  <p>
                    The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties 
                    of any kind, whether express or implied, including but not limited to the implied warranties 
                    of merchantability, fitness for a particular purpose, and non-infringement.
                  </p>
                </Subsection>

                <Subsection title="7.2 Content Disclaimer">
                  <p>
                    We do not guarantee the accuracy, completeness, or usefulness of any content available 
                    through the Service. Any reliance you place on such information is strictly at your own risk.
                  </p>
                </Subsection>

                <Subsection title="7.3 Limitation of Liability">
                  <p>
                    In no event shall Playex, its officers, directors, employees, or agents, be liable for any 
                    indirect, incidental, special, consequential or punitive damages, including without limitation, 
                    loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
                    to or use of or inability to access or use the Service.
                  </p>
                </Subsection>
              </Section>

              <Section title="8. Service Modifications">
                <Subsection title="8.1 Changes to the Service">
                  <p>
                    We reserve the right to modify or discontinue, temporarily or permanently, the Service 
                    (or any part thereof) with or without notice. You agree that we shall not be liable to you 
                    or to any third party for any modification, suspension, or discontinuance of the Service.
                  </p>
                </Subsection>

                <Subsection title="8.2 Updates to Terms">
                  <p>
                    We may update these Terms from time to time. We will notify you of any changes by posting 
                    the new Terms on this page. Your continued use of the Service after such modifications will 
                    constitute your acknowledgment of the modified Terms and agreement to abide and be bound by the modified Terms.
                  </p>
                </Subsection>
              </Section>

              <Section title="9. General Provisions">
                <Subsection title="9.1 Governing Law">
                  <p>
                    These Terms shall be governed and construed in accordance with the laws of Saint Vincent and the Grenadines, 
                    without regard to its conflict of law provisions.
                  </p>
                </Subsection>

                <Subsection title="9.2 Severability">
                  <p>
                    If any provision of these Terms is held to be invalid or unenforceable, such provision shall 
                    be struck and the remaining provisions shall be enforced.
                  </p>
                </Subsection>

                <Subsection title="9.3 Entire Agreement">
                  <p>
                    These Terms constitute the entire agreement between you and us regarding our Service, and 
                    supersede and replace any prior agreements we might have between us regarding the Service.
                  </p>
                </Subsection>

                <Subsection title="9.4 Contact Information">
                  <p>
                    If you have any questions about these Terms, please contact us at: <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a> for any further questions.
                  </p>
                </Subsection>
              </Section>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-12 text-center"
              >
                <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-r from-[#82BC87]/10 to-transparent backdrop-blur-sm border border-white/5">
                  <p className="text-gray-300 mb-3">Have questions about our terms?</p>
                  <a
                    href="mailto:contact.playex@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#82BC87] text-white font-medium hover:bg-[#6da972] transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Legal Team
                  </a>
                </div>
              </motion.div>
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

export default TermsPage;