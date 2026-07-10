import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'astra';
  text: string;
  timestamp: string;
}

export interface AstraState {
  messages: ChatMessage[];
  isProcessing: boolean;
  currentStep: string;
  selectedModel: string;
  ollamaStatus: 'online' | 'offline' | 'checking';
  lastActionReports: unknown[];

  // Placeholder actions (no business logic)
  sendMessage: (text: string) => void;
  clearHistory: () => void;
  setSelectedModel: (model: string) => void;
}

export const useAstraStore = create<AstraState>(set => ({
  messages: [],
  isProcessing: false,
  currentStep: 'idle',
  selectedModel: 'gemini-2.5-flash',
  ollamaStatus: 'online',
  lastActionReports: [],

  sendMessage: (text) =>
    set(state => ({
      messages: [
        ...state.messages,
        { id: 'msg-' + Date.now(), sender: 'user', text, timestamp: new Date().toISOString() },
      ],
    })),
  clearHistory: () => set({ messages: [] }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
}));
