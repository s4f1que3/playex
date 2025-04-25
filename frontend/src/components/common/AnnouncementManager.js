import React from 'react';
import MediaAnnouncement from './MediaAnnouncement';
import SystemAnnouncement from './SystemAnnouncement';

const announcementConfig = {
  mediaAnnouncement: 'display', 
  systemAnnouncement: 'hide' 
};

const AnnouncementManager = () => {
  return (
    <>
      {announcementConfig.mediaAnnouncement === 'display' && <MediaAnnouncement />}
      {announcementConfig.systemAnnouncement === 'display' && <SystemAnnouncement />}
    </>
  );
};

export default AnnouncementManager;
