// File: frontend/src/components/common/Spinner.js
import React from 'react';

const Spinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-3',
    large: 'h-16 w-16 border-4'
  };
  
  const colorClasses = {
    primary: 'border-t-cyan-500',
    secondary: 'border-t-indigo-400',
    accent: 'border-t-[#E6C6BB]'
  };
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-gray-700 ${colorClasses[color]}`}></div>
    </div>
  );
};

export default Spinner;