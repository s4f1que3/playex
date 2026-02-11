//terms page
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-8"
  >
    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
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
    <h3 className="text-xl font-semibold text-indigo-400 mb-3">{title}</h3>
    <div className="text-gray-300 space-y-4">
      {children}
    </div>
  </div>
);

const AdBlockCard = ({ title, description, link }) => (
  <div className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 border border-white/5">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1">
        <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
        <p className="text-gray-400 mb-4">{description}</p>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            to={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
          >
            <span>Add to Chrome</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  </div>
);

const AdBlockPage = () => {
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
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6 backdrop-blur-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                </span>
                <span className="text-cyan-500 font-medium">Ad Blockers</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Recommended
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-indigo-500 ml-3">
                  Blockers
                </span>
              </h1>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-[100px]" />
              <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[120px]" />
            </div>

            <div className="relative p-8">
              <div className="text-sm text-cyan-500 mb-8">Last Updated: October 23, 2025</div>

              <Section title="1. Introduction">
                <p>
                  Welcome to Playex ("we", "our", or "us"). We try our best to make our website Ad free for users.
                  However, we are only able to do such for our website itself. We cannot provide an ad free expereince
                  in regards to the media players, as these are third party services that we do not control.
                  To prevent being bombarded with ads from these third party services, we recommend getting -all- the ad Blockers
                  listed below.
                </p>
              </Section>

              <Section title="1.2 Adding Ad Blockers">
                <p>
                  To add an Ad blocker to your broswer, simply click the "Add to chrome" button next to the Ad blocker's name which will
                  take you to the chrome web store page for that Ad blocker. From there, click "Add to Chrome" and follow the one or two
                  prompts that may follow. The Ad blocker should be added in no more than 3-4 clicks, in which it would start working
                  immediately. Please add ALL of the Ad blockers listed below for the best experience.</p>
              </Section>

              <Section title="Recommended Ad Blockers">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdBlockCard
                    title="AdBlock Plus"
                    description="The most popular ad blocker for Chrome. Blocks intrusive ads and malware."
                    link="https://chromewebstore.google.com/detail/adblock-plus-free-ad-bloc/cfhdojbkjhnklbpkdaibdccddilifddb" 
                  />
                  <AdBlockCard
                    title="AdBlock"
                    description="A popular choice for blocking Ads across the web. Also one of the teass favorite Ad blockers."
                    link="https://chromewebstore.google.com/detail/adblock-%E2%80%94-block-ads-acros/gighmmpiobklfepjocnamgkkbiglidom"
                  />
                  <AdBlockCard
                    title="Popup Blocker (strict)"
                    description="Advanced popup blocking with strict rules for maximum protection."
                    link="https://chromewebstore.google.com/detail/popup-blocker-strict/aefkmifgmaafnojlojpnekbpbmjiiogg"
                  />
                  <AdBlockCard
                    title="Popup Blocker"
                    description="Simple yet effective popup blocking for a cleaner browsing experience."
                    link="https://chromewebstore.google.com/detail/popup-blocker/pecjjeljffnplfcclbbbklkpcbbkchdk"
                  />
                  <AdBlockCard
                    title="SBlock"
                    description="Super ad blocker with advanced features and minimal performance impact."
                    link="https://chromewebstore.google.com/detail/sblock-super-ad-blocker/cmdgdghfledlbkbciggfjblphiafkcgg"
                  />
                </div>
              </Section>
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

export default AdBlockPage;