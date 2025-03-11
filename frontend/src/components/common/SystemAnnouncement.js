import React, { useState, useEffect } from 'react';

const SystemAnnouncement = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  
  useEffect(() => {
    // Check if the announcement should be shown
    // This could be fetched from an API or config file
    const announcementEnabled = true; // Set this to false to hide the announcement
    
    if (announcementEnabled) {
      setShowAnnouncement(true);
    }
  }, []);
  
  if (!showAnnouncement) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white mb-4 md:mb-0">
          <p>
            🔔 Important Announcement: This is an unfinished version of the website. 
            Some features such as signup/login may be temporarily unavailable. 
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemAnnouncement;