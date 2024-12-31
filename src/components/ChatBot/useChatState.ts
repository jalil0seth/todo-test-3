import { useState, useCallback, useEffect } from 'react';
import { Message, ChatState, ChatActions } from './types';
import { getGeminiResponse } from '../../lib/gemini';

export function useChatState(): [ChatState, ChatActions] {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: true
  });

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await getGeminiResponse("What can you help me with as a task assistant?");
        setState({
          messages: [{
            id: '1',
            text: response,
            isBot: true,
            createdAt: new Date()
          }],
          isLoading: false
        });
      } catch (error) {
        setState({
          messages: [{
            id: '1',
            text: "Hi! I'm your task assistant. How can I help you?",
            isBot: true,
            createdAt: new Date()
          }],
          isLoading: false
        });
      }
    };

    initializeChat();
  }, []);

  const addMessage = useCallback((text: string, isBot: boolean) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        id: crypto.randomUUID(),
        text,
        isBot,
        createdAt: new Date()
      }]
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const handleUserMessage = useCallback(async (text: string) => {
    addMessage(text, false);
    setLoading(true);

    try {
      const response = await getGeminiResponse(text);
      addMessage(response, true);
    } catch (error) {
      addMessage("I'm sorry, I couldn't process your request.", true);
    } finally {
      setLoading(false);
    }
  }, [addMessage, setLoading]);

  return [
    state,
    {
      addMessage: handleUserMessage,
      setLoading
    }
  ];
}