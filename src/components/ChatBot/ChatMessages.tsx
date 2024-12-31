import React from 'react';
import { Message } from './types';
import { ChatMessage } from './ChatMessage';
import { LoadingIndicator } from './LoadingIndicator';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}