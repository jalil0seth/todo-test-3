import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput('');
    }
  };

  const removeTag = (e: React.MouseEvent, tagToRemove: string) => {
    e.stopPropagation();
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2" onClick={e => e.stopPropagation()}>
      <label className="block text-sm font-medium text-gray-700">
        Tags
      </label>
      <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white">
        {tags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            #{tag}
            <button
              onClick={(e) => removeTag(e, tag)}
              className="hover:text-blue-600"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            e.stopPropagation();
            setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          onClick={e => e.stopPropagation()}
          placeholder="Add tag..."
          className="flex-1 min-w-[120px] outline-none"
        />
      </div>
    </div>
  );
}