
import React, { useEffect, useRef } from 'react';
import MessageComponent from './Message';
import { Message } from '../types';
import { AGENT_AVATAR_URL } from '../constants';

interface MessageListProps {
  messages: Message[];
  isAgentTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isAgentTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAgentTyping]);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
      {messages.map((msg, index) => (
        <MessageComponent key={msg.id || index} message={msg} />
      ))}
      {isAgentTyping && (
        <div className="flex items-end gap-3 animate-fade-in">
          <img src={AGENT_AVATAR_URL} alt="Agent" className="w-8 h-8 rounded-full" />
          <div className="px-4 py-3 rounded-2xl rounded-bl-none bg-gray-700 max-w-xs md:max-w-md text-white">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
