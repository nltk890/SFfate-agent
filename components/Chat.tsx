import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import Header from './Header';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import RateLimitModal from './RateLimitModal';
import PromptsModal from './PromptsModal';
import FeedbackModal from './FeedbackModal';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { queryAgent } from '../services/agentService';
import { Message } from '../types';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { messages, addMessage, isRateLimited, remainingMessages, addFeedback } = useFirestore(user);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState(false);
  const [showPromptsModal, setShowPromptsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !user) return;
    
    if (user && !user.isGuest && isRateLimited) {
        setShowRateLimitModal(true);
        return;
    }

    // Fix: Add user's displayName to the message object to be used for the avatar seed.
    const userMessage: Omit<Message, 'id'> = {
      text,
      sender: 'user',
      timestamp: Timestamp.now(),
      userAvatar: user.photoURL,
      displayName: user.displayName,
    };
    await addMessage(userMessage);

    setIsAgentTyping(true);
    
    const agentResponseText = await queryAgent(text);
    
    const agentMessage: Omit<Message, 'id'> = {
        text: agentResponseText,
        sender: 'agent',
        timestamp: Timestamp.now(),
    };
    
    // Only add agent message and update rate limit if the response is not an error message
    if (!agentResponseText.toLowerCase().includes('sorry, i encountered an error')) {
        await addMessage(agentMessage);
    }
    setIsAgentTyping(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-2 sm:p-4">
      <Header 
        onPromptsClick={() => setShowPromptsModal(true)}
        onFeedbackClick={() => setShowFeedbackModal(true)}
      />
      {user?.isGuest && (
        <div className="bg-yellow-500/20 text-yellow-200 text-sm text-center p-2 rounded-lg mb-2 border border-yellow-500/30">
            You are in guest mode. Your chat history will not be saved.
        </div>
      )}
      <div className="flex-1 flex flex-col bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <MessageList messages={messages} isAgentTyping={isAgentTyping} />
        <MessageInput onSendMessage={handleSendMessage} disabled={isAgentTyping} remainingMessages={remainingMessages} isGuest={user?.isGuest ?? false}/>
      </div>
      <RateLimitModal 
        isOpen={showRateLimitModal}
        onClose={() => setShowRateLimitModal(false)}
      />
      <PromptsModal 
        isOpen={showPromptsModal}
        onClose={() => setShowPromptsModal(false)}
      />
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={addFeedback}
      />
    </div>
  );
};

export default Chat;
