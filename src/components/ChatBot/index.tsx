import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChatState } from './useChatState';

export function ChatBot() {
  const [{ messages, isLoading }, { addMessage }] = useChatState();

  return (
    <div className="flex flex-col h-full font-droid bg-[#f6f6ef]">
      <ChatHeader />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput onSend={addMessage} disabled={isLoading} />
    </div>
  );
}