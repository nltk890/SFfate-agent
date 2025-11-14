
import React from 'react';
import { Message } from '../types';
import { AGENT_AVATAR_URL } from '../constants';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const time = message.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const avatarUrl = isUser 
    ? message.userAvatar || `https://api.dicebear.com/8.x/initials/svg?seed=${message.displayName || 'User'}`
    : AGENT_AVATAR_URL;

  return (
    <div
      className={`flex items-end gap-3 ${isUser ? 'justify-end' : ''} animate-fade-in-up`}
    >
      {!isUser && (
        <img src={avatarUrl} alt="Agent" className="w-8 h-8 rounded-full self-start" />
      )}
      <div className={`group relative px-4 py-3 rounded-2xl max-w-xs md:max-w-md break-words transition-all duration-300 ${
          isUser
            ? 'bg-indigo-600 rounded-br-none'
            : 'bg-gray-700 rounded-bl-none'
        }`}
      >
        <p className="text-white whitespace-pre-wrap">{message.text}</p>
        
        {isUser ? (
            <span className="absolute top-1 -left-16 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {time}
            </span>
        ) : (
            <span className="absolute bottom-1 -right-16 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {time}
            </span>
        )}
      </div>
      {isUser && (
        <img src={avatarUrl} alt="User" className="w-8 h-8 rounded-full self-start" />
      )}
       <style>{`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default MessageComponent;
