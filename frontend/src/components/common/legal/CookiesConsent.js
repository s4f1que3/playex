// File: frontend/src/components/common/CookieConsent.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const location = useLocation();
  
  const allowedPaths = ['/privacy', '/terms'];
  
  useEffect(() => {
    const hasConsented = localStorage.getItem('storageConsent');
    const isAllowedPath = allowedPaths.includes(location.pathname);
    
    if (!hasConsented) {
      setShowConsent(!isAllowedPath);
    }
  }, [location.pathname]);
  
  const handleAccept = () => {
    localStorage.setItem('storageConsent', 'true');
    setShowConsent(false);
  };
  
  const handleLearnMore = (e) => {
    const linkPath = e.currentTarget.getAttribute('href');
    if (allowedPaths.includes(linkPath)) {
      setShowConsent(false);
    }
  };
  
  if (!showConsent) return null;
  
  return (
    <div className="cookies-consent">
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-xl font-medium text-white">Cookies Consent</h3>
          </div>
          
          <div className="px-6 py-4">
            <p className="text-gray-300 mb-4">
              We use cookies and local storage to enhance your experience, save your preferences, 
              and remember your favorites and watchlist. By continuing to use Playex,
              you agree to our <Link onClick={handleLearnMore} to="/privacy" className="text-[#82BC87] hover:text-[#E4D981]">Privacy Policy</Link> and
              <Link onClick={handleLearnMore} to="/terms" className="text-[#82BC87] hover:text-[#E4D981]"> Terms and Conditions</Link>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
              <Link 
                onClick={handleLearnMore}
                to="/privacy" 
                className="text-[#E4D981] hover:text-white py-2 text-center"
              >
                Learn More
              </Link>
              <button
                onClick={handleAccept}
                className="bg-[#82BC87] hover:bg-opacity-80 text-white px-6 py-2 rounded"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;