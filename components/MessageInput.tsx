
import React, { useState, KeyboardEvent } from 'react';
import { SendIcon } from './icons';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled: boolean;
  remainingMessages: number;
  isGuest: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled, remainingMessages, isGuest }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        <div className="relative">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the Shadow Fight universe..."
                className="w-full bg-gray-700 text-white rounded-2xl py-3 pl-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow disabled:opacity-50"
                rows={1}
                disabled={disabled}
            />
            <button
                onClick={handleSubmit}
                disabled={disabled || !text.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110"
            >
                <SendIcon className="w-5 h-5" />
            </button>
        </div>
        {!isGuest && (
            <p className="text-xs text-gray-500 text-center mt-2">
                {remainingMessages} messages remaining today.
            </p>
        )}
    </div>
  );
};

export default MessageInput;
