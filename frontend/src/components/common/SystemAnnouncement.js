import React, { useState, useEffect } from 'react';

const SystemAnnouncement = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnnouncement(false);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer);
  }, []);
  
  if (!showAnnouncement) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white mb-4 md:mb-0">
          <p>
            🔔 Please feel free to share this website with your friends. The official domain will be here soon! 
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemAnnouncement;