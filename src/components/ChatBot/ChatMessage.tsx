import React from 'react';
import { Message } from './types';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={clsx('flex', message.isBot ? 'justify-start' : 'justify-end')}>
      <div
        className={clsx(
          'max-w-[80%] p-3 rounded-lg shadow-sm',
          message.isBot 
            ? 'bg-gradient-to-r from-[#f6f6ef] to-white' 
            : 'bg-gradient-to-r from-[#ff6600] to-[#ff8533] text-white'
        )}
      >
        <div className={clsx(
          'prose prose-sm max-w-none',
          !message.isBot && 'prose-invert'
        )}>
          <ReactMarkdown>{message.text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}