// faq page
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactLink from '../ContactLink';

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-left border border-white/5 
                   hover:border-[#82BC87]/20 transition-all duration-500"
      >
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
              ${isOpen ? 'bg-[#82BC87]/20' : 'bg-white/5'}`}
            >
              <motion.span
                animate={{ color: isOpen ? '#82BC87' : '#9CA3AF' }}
                className="text-xl font-bold"
              >
                {(index + 1).toString().padStart(2, '0')}
              </motion.span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-[#82BC87] transition-colors duration-300">
              {question}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`w-6 h-6 flex items-center justify-center transition-colors duration-300
              ${isOpen ? 'text-[#82BC87]' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-white/5">
                {typeof answer === 'string' ? (
                  <p className="text-gray-300 leading-relaxed">{answer}</p>
                ) : (
                  answer
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Decorative elements */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[#82BC87]/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10" />
    </motion.div>
  );
};

const FAQ = () => {
  const faqData = [
    {
      question: "Who created playex?",
      answer: (
        <p>Playex was created by <a href="https://www.linkedin.com/company/safique-solutions" className="text-[#82BC87] hover:text-[#E4D981]">NOVA</a></p>
      )
    },
    {
      question: "How can I request to add Movies/TV-Shows?",
      answer: "As Playex doesn't manually host any media but rather uses an embedded player, we currently cannot add any movies or TV shows to our site. We are limited to the media that the embedded player has. However, in the future, we may add other embedded players that allow you to switch if one doesn't have what you want."
    },
    {
      question: "Why is the player not working?",
      answer: (
        <>
          <p>As we have no control over the embedded player(s) due to them being external, we can't solve any issues relating to them.</p>
          <p>However, the embedded player(s) may not be working for a few reasons:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Ad blockers</strong> - Some ad-blockers may interrupt the fetching process of the embedded player. Disable them on our site, close the site tab, re-access it, and try again.</li>
            <li><strong>New media</strong> - If the Movie or TV-Show was just released, the selected embedded player may not yet have it.</li>
            <li><strong>WI-FI Issues</strong> - Ensure your internet connection is working.</li>
            <li><strong>Wait 2-3 Minutes</strong> - Sometimes, the player may have an interruption fetching the data to play the media. Give the player 2-3 minutes or reload the page to resolve this issue and play your media.</li>
            <li>If none of these work, try reloading the page. If that still doesn't work, contact us at  
            <ContactLink className="text-[#82BC87] hover:text-[#E4D981]"
            subject="Player Issues">
               contact.playex@gmail.com</ContactLink>, describe your issue, 
                and we will resolve this to the best of our ability ASAP.</li>
          </ul>
        </>
      )
    },
    {
      question: "Do I need an account to watch movies or TV shows?",
      answer: "No. You do not need an account to watch Movies and TVShows on our website."
    },
    {
      question: "Why are there ads on the player?",
      answer: "Ads are controlled by the embedded player providers, not by us. We do not place or manage these ads. You can try using a pop-up blocker to reduce unwanted ads, but ad blockers MAY affect the players."
    },
    {
      question: "How do I report a problem with a movie or TV show?",
      answer: (
        <p>You can contact us at <a href="mailto:contact.playex@gmail.com" className="text-[#82BC87] hover:text-[#E4D981]">contact.playex@gmail.com</a>. Be sure to include a brief description of the issue.</p>
      )
    },
    {
      question: "Will you add a download feature?",
      answer: "Currently, we do not offer downloads, as our platform is based on streaming via embedded players. However, we may explore this option in the future if permitted."
    },
    {
      question: "Is Playex legal?",
      answer: "Playex does not host any media files. We use publicly available embedded players from third-party sources. We do not control or distribute content; we only provide access to what is already available online."
    },
    {
      question: "Why is the quality on the player bad?",
      answer: (
        <>
          <p>To fix the quality issue, click the settings icon on the bottom right, click quality, and upgrade the quality to your preference. Currently, the highest quality available may be 1080p or 4k depending on the embedded player.</p>
          <p className="mt-2">However, on some movies and/or TV-Shows, higher qualities may not yet be available. You would need to wait until they are to fix the quality.</p>
          <p className="mt-2">Additionally, you might find on new movies and tv-shows, that you may select a higher/ the highest quality and the quality is still in CAM. To resolve this, you would have to wait until the media is released in proper quality.</p>
        </>
      )
    }
  ];

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
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5 animate-pulse" />
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
                <span className="text-[#82BC87] font-medium">Help Center</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Frequently Asked
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#82BC87] to-[#E4D981] ml-3">
                  Questions
                </span>
              </h1>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              index={index}
            />
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <ContactLink
            buttonStyle={true}
            subject="FAQ Inquiries"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#82BC87] text-white font-medium hover:bg-[#6da972] transition-colors duration-300"
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
  );
};

export default FAQ;