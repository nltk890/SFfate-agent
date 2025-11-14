
import React from 'react';

interface PromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromptsModal: React.FC<PromptsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const prompts = [
    "Who is the main antagonist in Shadow Fight 2?",
    "Explain the lore behind the Gates of Shadows.",
    "What is the role of May in the storyline?",
    "Can you describe the different factions in Shadow Fight 3?",
    "What are Shadow Orbs and how do they work?",
    "Tell me about the history of the Legion.",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Example Prompts</h2>
        <p className="text-gray-400 mb-6">
          Here are some questions you can ask to get started:
        </p>
        <ul className="space-y-3 list-disc list-inside text-gray-300 mb-8">
          {prompts.map((prompt, index) => (
            <li key={index}><i className="text-gray-400">"{prompt}"</i></li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300"
        >
          Got it
        </button>
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

export default PromptsModal;
