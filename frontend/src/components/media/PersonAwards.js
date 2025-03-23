import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PersonAwards = ({ awards }) => {
  const [expanded, setExpanded] = useState(false);

  if (!awards?.length) return null;

  // Group awards by category
  const groupedAwards = awards.reduce((acc, award) => {
    if (!acc[award.category]) {
      acc[award.category] = [];
    }
    acc[award.category].push(award);
    return acc;
  }, {});

  const displayAwards = expanded ? awards : awards.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-12 pb-8"
    >
      <div className="container mx-auto px-4">
        <div className="relative bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#E4D981]/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#E4D981]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 3.414V9a1 1 0 11-2 0V3.414L5.707 6.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Awards & Nominations</h2>
                <p className="text-gray-400 text-sm">{awards.length} total recognitions</p>
              </div>
            </div>
          </div>

          {/* Awards List */}
          <div className="p-6">
            <div className="space-y-6">
              {Object.entries(groupedAwards).map(([category, items], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/20 rounded-xl p-4"
                >
                  <h3 className="text-[#E4D981] font-medium mb-3">{category}</h3>
                  <div className="space-y-2">
                    {items.map((award) => (
                      <div key={award.id} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${award.won ? 'bg-[#82BC87]' : 'bg-gray-500'}`} />
                        <div>
                          <div className="text-white">{award.title}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <span>{award.year}</span>
                            {award.won && (
                              <>
                                <span className="text-gray-500">•</span>
                                <span className="text-[#82BC87]">Winner</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {awards.length > 3 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-6 w-full px-4 py-3 rounded-xl bg-[#E4D981]/10 hover:bg-[#E4D981]/20 
                         text-[#E4D981] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{expanded ? 'Show Less' : `Show All ${awards.length} Awards`}</span>
                <motion.svg
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </motion.svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PersonAwards;
