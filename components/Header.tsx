
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoutIcon, LightbulbIcon, FeedbackIcon } from './icons';

interface HeaderProps {
    onPromptsClick: () => void;
    onFeedbackClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPromptsClick, onFeedbackClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 text-white">
      <h1 className="text-2xl font-bold tracking-wider">Shadow Fight Agent</h1>
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName || 'Guest'}`}
              alt={user.displayName || 'User Avatar'}
              className="w-10 h-10 rounded-full border-2 border-gray-600"
            />
            <span className="hidden sm:inline font-medium">{user.displayName}</span>
          </div>
          <button
            onClick={onPromptsClick}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-yellow-500/50 transition-colors duration-300"
            title="Best Prompts"
          >
            <LightbulbIcon className="w-5 h-5" />
          </button>
           <button
            onClick={onFeedbackClick}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-green-500/50 transition-colors duration-300"
            title="Give Feedback"
          >
            <FeedbackIcon className="w-5 h-5" />
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-full bg-gray-700/50 hover:bg-red-500/50 transition-colors duration-300"
            title="Logout"
          >
            <LogoutIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
