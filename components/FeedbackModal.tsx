
import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => Promise<void>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
        setError('Feedback cannot be empty.');
        return;
    }
    setError('');
    await onSubmit(feedback);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      // Reset state for next time
      setSubmitted(false);
      setFeedback('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
        {submitted ? (
             <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
                <p className="text-gray-400">Your feedback has been received.</p>
            </div>
        ) : (
            <>
                <h2 className="text-2xl font-bold text-white mb-2">Share Your Feedback</h2>
                <p className="text-gray-400 mb-6">We'd love to hear your thoughts on the Shadow Fight Agent.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Your feedback..."
                        className="w-full bg-gray-700 text-white rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        required
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
                            >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
                            >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </>
        )}
      </div>
       <style>{`
          @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default FeedbackModal;
