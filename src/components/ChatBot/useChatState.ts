import { useState, useCallback, useEffect } from 'react';
import { Message, ChatState, ChatActions } from './types';
import { getGeminiResponse } from '../../lib/gemini';
import { formatPrompt } from '../../utils/promptUtils';
import { createMessage, formatInitialPrompt } from '../../utils/chatUtils';

export function useChatState(): [ChatState, ChatActions] {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: true
  });

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await getGeminiResponse(formatInitialPrompt());
        setState({
          messages: [createMessage(response, true)],
          isLoading: false
        });
      } catch (error) {
        console.error('Error initializing chat:', error);
        setState({
          messages: [createMessage("Failed to initialize chat. Please try again.", true)],
          isLoading: false
        });
      }
    };

    initializeChat();
  }, []);

  const handleUserMessage = useCallback(async (text: string) => {
    // Add user message immediately
    const userMessage = createMessage(text, false);
    setState(prev => ({
      messages: [...prev.messages, userMessage],
      isLoading: true
    }));

    try {
      // Get AI response
      const formattedPrompt = formatPrompt(text);
      const response = await getGeminiResponse(formattedPrompt);
      
      // Add AI response
      setState(prev => ({
        messages: [...prev.messages, createMessage(response, true)],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error getting response:', error);
      setState(prev => ({
        messages: [
          ...prev.messages,
          createMessage("I apologize, but I couldn't process your request at the moment.", true)
        ],
        isLoading: false
      }));
    }
  }, []);

  return [
    state,
    {
      addMessage: handleUserMessage,
      setLoading: useCallback((loading: boolean) => 
        setState(prev => ({ ...prev, isLoading: loading })), 
      [])
    }
  ];
}