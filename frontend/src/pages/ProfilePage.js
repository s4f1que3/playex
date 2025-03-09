// File: frontend/src/pages/ProfilePage.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/common/Spinner';

const ProfilePage = () => {
  const { currentUser, updateProfile, changePassword, deleteAccount, logout } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    delete: false
  });
  
  const [errors, setErrors] = useState({
    profile: null,
    password: null,
    delete: null
  });
  
  const [success, setSuccess] = useState({
    profile: false,
    password: false
  });
  
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
    
    // Clear error and success when form changes
    setErrors({ ...errors, profile: null });
    setSuccess({ ...success, profile: false });
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
    
    // Clear error and success when form changes
    setErrors({ ...errors, password: null });
    setSuccess({ ...success, password: false });
  };
  
  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!profileForm.username.trim() || !profileForm.email.trim()) {
      setErrors({ ...errors, profile: 'Username and email are required.' });
      return;
    }
    
    setLoading({ ...loading, profile: true });
    setErrors({ ...errors, profile: null });
    
    try {
      await updateProfile(profileForm);
      setSuccess({ ...success, profile: true });
    } catch (error) {
      setErrors({ 
        ...errors, 
        profile: error.response?.data?.message || 'Failed to update profile.' 
      });
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };
  
  // Handle password form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setErrors({ ...errors, password: 'All password fields are required.' });
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrors({ ...errors, password: 'New passwords do not match.' });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setErrors({ ...errors, password: 'New password must be at least 8 characters.' });
      return;
    }
    
    setLoading({ ...loading, password: true });
    setErrors({ ...errors, password: null });
    
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setSuccess({ ...success, password: true });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setErrors({ 
        ...errors, 
        password: error.response?.data?.message || 'Failed to change password.' 
      });
    } finally {
      setLoading({ ...loading, password: false });
    }
  };
  
  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== currentUser.username) {
      setErrors({ ...errors, delete: 'Username does not match.' });
      return;
    }
    
    setLoading({ ...loading, delete: true });
    setErrors({ ...errors, delete: null });
    
    try {
      await deleteAccount();
      logout();
      // Redirect happens automatically through Protected Route
    } catch (error) {
      setErrors({ 
        ...errors, 
        delete: error.response?.data?.message || 'Failed to delete account.' 
      });
      setLoading({ ...loading, delete: false });
    }
  };
  
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="large" />
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
      
      {/* Profile Section */}
      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
        
        <form onSubmit={handleProfileSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="form-input"
              />
            </div>
            
            {errors.profile && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded">
                {errors.profile}
              </div>
            )}
            
            {success.profile && (
              <div className="bg-green-900 bg-opacity-20 border border-green-800 text-green-200 px-4 py-3 rounded">
                Profile updated successfully.
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading.profile}
                className="btn-primary w-full"
              >
                {loading.profile ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
      
      {/* Password Section */}
      <section className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
        
        <form onSubmit={handlePasswordSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="form-input"
              />
            </div>
            
            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="form-input"
              />
            </div>
            
            {errors.password && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded">
                {errors.password}
              </div>
            )}
            
            {success.password && (
              <div className="bg-green-900 bg-opacity-20 border border-green-800 text-green-200 px-4 py-3 rounded">
                Password changed successfully.
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading.password}
                className="btn-primary w-full"
              >
                {loading.password ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
      
      {/* Delete Account Section */}
      <section className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Delete Account</h2>
        
        <p className="text-gray-300 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
        >
          Delete Account
        </button>
      </section>
      
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Account Deletion</h3>
            
            <p className="text-gray-300 mb-4">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            
            <p className="text-gray-300 mb-4">
              To confirm, please type your username: <span className="font-bold">{currentUser.username}</span>
            </p>
            
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              className="form-input mb-4"
              placeholder="Enter your username"
            />
            
            {errors.delete && (
              <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-200 px-4 py-3 rounded mb-4">
                {errors.delete}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmation('');
                  setErrors({ ...errors, delete: null });
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDeleteAccount}
                disabled={loading.delete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                {loading.delete ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Delete Permanently'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;