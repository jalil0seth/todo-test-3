import React from 'react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';

interface MessageProps {
  text: string;
  isBot: boolean;
}

export function Message({ text, isBot }: MessageProps) {
  return (
    <div className={clsx('flex', isBot ? 'justify-start' : 'justify-end')}>
      <div
        className={clsx(
          'max-w-[80%] p-3 rounded-lg shadow-sm',
          isBot 
            ? 'bg-gradient-to-r from-[#f6f6ef] to-white' 
            : 'bg-gradient-to-r from-[#ff6600] to-[#ff8533] text-white'
        )}
      >
        <div className={clsx(
          'prose prose-sm max-w-none',
          !isBot && 'prose-invert'
        )}>
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}