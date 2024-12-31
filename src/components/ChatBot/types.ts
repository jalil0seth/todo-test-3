export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  createdAt: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

export interface ChatActions {
  addMessage: (text: string, isBot: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export interface ChatMessageProps {
  message: Message;
}

export interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}