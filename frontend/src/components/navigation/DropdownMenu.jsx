import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = {
    quick: [
      { 
        name: 'Home', 
        path: '/', 
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
        highlight: true 
      }
    ],
    featured: [
      { 
        name: 'Fan Favorites', 
        path: '/fan-favorites', 
        icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
        highlight: true 
      }
    ],
    main: [
      { name: 'Movies', path: '/movies', icon: 'M7 4v16M17 4v16M3 8h18M3 16h18', colorClass: 'text-[#9B89B3]' },
      { name: 'TV Shows', path: '/tv-shows', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', colorClass: 'text-[#89B3B0]' },
      { name: 'Trending', path: '/trending', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', colorClass: 'text-[#B389A1]' },
      { name: 'Actors', path: '/actors', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', colorClass: 'text-[#B3A289]' },
    ],
    personal: [
      { name: 'Watchlist', path: '/watchlist', icon: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z', colorClass: 'text-[#89A1B3]' },
      { name: 'Favorites', path: '/favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', colorClass: 'text-[#B38989]' },
    ],
  };

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Menu.Button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white hover:text-gray-200 focus:outline-none">
            <span>Menu</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Menu.Button>

          <AnimatePresence>
            {(open || isOpen) && (
              <Menu.Items
                static
                as={motion.div}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-xl focus:outline-none divide-y divide-white/10"
              >
                {/* Quick Actions Section */}
                <div className="px-1 py-2">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-400">Quick Actions</p>
                  </div>
                  {menuItems.quick.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.path}
                          className={`${
                            active ? 'bg-[#82BC87]/20' : 'bg-[#82BC87]/10'
                          } group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#82BC87] transition-all duration-150`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>

                {/* Featured Section */}
                <div className="px-1 py-2">
                  {menuItems.featured.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.path}
                          className={`${
                            active ? 'bg-[#E4D981]/20' : 'bg-[#E4D981]/10'
                          } group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-[#E4D981] transition-all duration-150`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>

                {/* Main Navigation */}
                <div className="px-1 py-2">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-400">Navigation</p>
                  </div>
                  {menuItems.main.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.path}
                          className={`
                            group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                            transition-all duration-150 ${item.colorClass}
                            ${active ? 'bg-white/10 scale-[1.02]' : 'hover:bg-white/5'}
                          `}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>

                {/* Personal Section */}
                <div className="px-1 py-2">
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-400">Personal</p>
                  </div>
                  {menuItems.personal.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          to={item.path}
                          className={`
                            group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                            transition-all duration-150 ${item.colorClass}
                            ${active ? 'bg-white/10 scale-[1.02]' : 'hover:bg-white/5'}
                          `}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            )}
          </AnimatePresence>
        </div>
      )}
    </Menu>
  );
};

export default DropdownMenu;
