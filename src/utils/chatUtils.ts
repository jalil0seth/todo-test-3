import { Message } from '../components/ChatBot/types';

export const createMessage = (text: string, isBot: boolean): Message => ({
  id: crypto.randomUUID(),
  text,
  isBot,
  createdAt: new Date()
});

export const formatInitialPrompt = () => `
# Task Assistant Capabilities

Please describe your capabilities as a task management assistant.
Focus on:
- Core features
- Main benefits
- Key functionalities

Format as markdown with clear sections and bullet points.
`;