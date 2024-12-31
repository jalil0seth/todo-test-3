import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChatState } from './useChatState';

export function ChatBot() {
  const [{ messages, isLoading }, { addMessage }] = useChatState();

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      addMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-full font-droid bg-[#f6f6ef]">
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}