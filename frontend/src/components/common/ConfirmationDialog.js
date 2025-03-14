import React from 'react';

const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 overflow-hidden border border-gray-700">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-xl font-medium text-white">{title}</h3>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-300 mb-4">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-end mt-4">
            <button
              onClick={onCancel}
              className="text-[#E4D981] hover:text-[#f0e7a3] py-2 px-4 transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-[#82BC87] hover:bg-opacity-80 text-white px-6 py-2 rounded transition duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
