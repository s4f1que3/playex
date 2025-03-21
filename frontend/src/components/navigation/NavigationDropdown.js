//NavigationDropdown.js
import React from 'react';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import PrefetchLink from '../common/PrefetchLink';

const dropdownLinks = [
  {
    title: 'Movies',
    description: 'Browse our collection of films',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    links: [
      { to: '/movies', label: 'All Movies', tag: 'New' },
      { to: '/movies?sort_by=popularity.desc', label: 'Popular' },
      { to: '/movies?sort_by=vote_average.desc', label: 'Top Rated' },
      { to: '/movies?with_genres=28', label: 'Action' },
      { to: '/movies?with_genres=35', label: 'Comedy' },
      { to: '/movies?with_genres=18', label: 'Drama' }
    ]
  },
  {
    title: 'TV Shows',
    description: 'Discover series and episodes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    links: [
      { to: '/tv-shows', label: 'All Shows', tag: 'Updated' },
      { to: '/tv-shows?sort_by=popularity.desc', label: 'Popular' },
      { to: '/tv-shows?sort_by=vote_average.desc', label: 'Top Rated' },
      { to: '/tv-shows?with_genres=10759', label: 'Action' },
      { to: '/tv-shows?with_genres=35', label: 'Comedy' },
      { to: '/tv-shows?with_genres=18', label: 'Drama' }
    ]
  }
];

const NavigationDropdown = () => (
  <Menu as="div" className="relative">
    {({ open }) => (
      <>
        <Menu.Button className="group px-4 py-2 rounded-xl text-gray-300 hover:text-white 
                               transition-all duration-300 flex items-center gap-2">
          <span>Browse</span>
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </motion.svg>
        </Menu.Button>

        <AnimatePresence>
          {open && (
            <Menu.Items
              as={motion.div}
              static
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 mt-4 w-screen max-w-5xl px-4"
            >
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-gray-900/95 backdrop-blur-xl shadow-2xl">
                <div className="relative">
                  {/* Decorative Elements */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#82BC87]/10 rounded-full filter blur-[100px] transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E4D981]/10 rounded-full filter blur-[100px] transform -translate-x-1/2 translate-y-1/2" />
                  </div>

                  {/* Content */}
                  <div className="relative grid grid-cols-2 gap-8 p-8">
                    {dropdownLinks.map((section, index) => (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 rounded-xl bg-[#82BC87]/10 flex items-center justify-center">
                            {section.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{section.title}</h3>
                            <p className="text-sm text-gray-400">{section.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {section.links.map((link, linkIndex) => (
                            <Menu.Item key={link.to}>
                              {({ active }) => (
                                <PrefetchLink
                                  to={link.to}
                                  className={`group relative px-4 py-3 rounded-xl transition-all duration-300
                                            ${active ? 'bg-[#82BC87]/10' : 'hover:bg-gray-800/50'}`}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (index * 0.1) + (linkIndex * 0.05) }}
                                    className="flex items-center justify-between"
                                  >
                                    <span className="text-gray-300 group-hover:text-white transition-colors">
                                      {link.label}
                                    </span>
                                    
                                    {link.tag && (
                                      <span className="px-2 py-1 text-xs rounded-full bg-[#82BC87]/20 text-[#82BC87]">
                                        {link.tag}
                                      </span>
                                    )}
                                  </motion.div>

                                  <motion.div
                                    className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-[#82BC87] to-[#E4D981]"
                                    initial={false}
                                    animate={{ width: active ? '100%' : '0%' }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </PrefetchLink>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-white/5 p-4 bg-black/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Press <kbd className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 text-xs">Esc</kbd> to close</span>
                      <PrefetchLink to="/collections" className="text-[#82BC87] hover:text-[#E4D981] transition-colors">
                        View All Collections →
                      </PrefetchLink>
                    </div>
                  </div>
                </div>
              </div>
            </Menu.Items>
          )}
        </AnimatePresence>
      </>
    )}
  </Menu>
);

export default NavigationDropdown;