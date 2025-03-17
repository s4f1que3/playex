// File: frontend/src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const navigation = {
  discover: [
    { name: 'Movies', href: '/movies' },
    { name: 'TV Shows', href: '/tv-shows' },
    { name: 'Trending', href: '/trending' },
    { name: 'Fan Favorites', href: '/fan-favorites' },
    { name: 'Collections', href: '/collections' },
    { name: 'Actors', href: '/actors' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  help: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Discover</h3>
            <ul>
              {navigation.discover.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link to={item.href} className="hover:text-white transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul>
              {navigation.company.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link to={item.href} className="hover:text-white transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul>
              {navigation.legal.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link to={item.href} className="hover:text-white transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Help</h3>
            <ul>
              {navigation.help.map((item) => (
                <li key={item.name} className="mb-2">
                  <Link to={item.href} className="hover:text-white transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Playex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;