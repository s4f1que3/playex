import React from 'react';

const AlertOverlay = ({ title, message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-medium text-white">{title}</h3>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-300 mb-4">{message}</p>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="bg-cyan-500 hover:bg-opacity-80 text-white px-6 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertOverlay;
