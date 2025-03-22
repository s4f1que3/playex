const USER_PROFILE_KEY = 'playex_user_profile';

export const getUserProfile = () => {
  const profile = localStorage.getItem(USER_PROFILE_KEY);
  return profile ? JSON.parse(profile) : {
    username: 'Guest User',
    avatar: null
  };
};

export const updateUserProfile = (updates) => {
  const currentProfile = getUserProfile();
  // Store the raw updates without forcing a default value
  const newProfile = { 
    ...currentProfile, 
    ...updates
  };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
  return newProfile;
};

export const clearUserData = () => {
  const keysToKeep = ['hasLoaded']; // Add any keys you want to preserve
  const preservedData = {};

  // Save data we want to keep
  keysToKeep.forEach(key => {
    preservedData[key] = localStorage.getItem(key);
  });

  // Clear all localStorage
  localStorage.clear();

  // Restore preserved data
  Object.entries(preservedData).forEach(([key, value]) => {
    if (value) localStorage.setItem(key, value);
  });
};
