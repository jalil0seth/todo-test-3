import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { chatStyles } from './styles';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={chatStyles.input.container}>
      <div className={chatStyles.input.wrapper}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className={chatStyles.input.field}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          className={chatStyles.input.button}
          disabled={disabled}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}