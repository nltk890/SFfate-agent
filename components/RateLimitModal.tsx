
import React from 'react';

interface RateLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RateLimitModal: React.FC<RateLimitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Daily Limit Reached</h2>
        <p className="text-gray-400 mb-6">
          You have reached your daily message limit. Please come back tomorrow to continue your conversation.
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default RateLimitModal;
