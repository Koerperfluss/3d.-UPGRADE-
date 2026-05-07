import React from 'react';
import { ChatBubbleIcon } from './IconComponents';

interface ChatbotFABProps {
  onOpen: () => void;
}

export const ChatbotFAB: React.FC<ChatbotFABProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 bg-brand-primary hover:bg-brand-primary-dark text-brand-text-on-light rounded-full p-4 shadow-lg transform hover:scale-110 transition-all duration-200 ease-in-out z-[999]"
      aria-label="Öffne den Assistenten"
      title="Assistent öffnen"
    >
      <ChatBubbleIcon className="w-8 h-8" />
    </button>
  );
};