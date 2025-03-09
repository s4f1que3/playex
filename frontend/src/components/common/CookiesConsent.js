// File: frontend/src/components/common/CookieConsent.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowConsent(false);
  };
  
  if (!showConsent) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white mb-4 md:mb-0">
          <p>
            We use cookies and local storage to enhance your experience. By continuing to use Playex,
            you agree to our <Link to="/cookies" className="text-[#82BC87] hover:text-[#E4D981]">Cookie Policy</Link>.
          </p>
        </div>
        <div className="flex space-x-4">
          <Link to="/cookies" className="text-[#E4D981] hover:text-white">
            Learn More
          </Link>
          <button
            onClick={handleAccept}
            className="bg-[#82BC87] hover:bg-opacity-80 text-white px-4 py-2 rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;