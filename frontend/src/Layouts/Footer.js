// File: frontend/src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#161616] border-t border-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div>
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Playex" className="h-10" />
              <span className="ml-2 text-2xl font-bold text-[#82BC87]">Playex</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Your premier destination for streaming movies and TV shows with an immersive experience.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-[#E4D981] text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/movies" className="text-gray-400 hover:text-white transition duration-300">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/tv-shows" className="text-gray-400 hover:text-white transition duration-300">
                  TV Shows
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-400 hover:text-white transition duration-300">
                  Trending
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account */}
          <div>
            <h3 className="text-[#E4D981] text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition duration-300">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-gray-400 hover:text-white transition duration-300">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-white transition duration-300">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/watch-history" className="text-gray-400 hover:text-white transition duration-300">
                  Watch History
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-[#E4D981] text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/FAQ" className="text-gray-400 hover:text-white transition duration-300">
                  FAQ
                </Link>

                </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition duration-300">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            &copy; {currentYear} Playex. All rights reserved.
          </p>
          <p className="text-gray-400">
            For any issues or inquires, contact us at <a href="contact.playex@gmail.com">our email</a>
          </p>

        </div>

        
      </div>
    </footer>
  );
};

export default Footer;