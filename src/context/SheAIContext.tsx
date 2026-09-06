import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { askCustomSheAIQuestion } from '../utils/sheAiEngine';

export interface SheAIMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  keyPoint?: string;
  disclaimer?: string;
  source?: 'groq' | 'deterministic';
}

interface SheAIContextValue {
  isOpen: boolean;
  openAssistant: (initialQuestion?: string) => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  messages: SheAIMessage[];
  sendMessage: (questionText: string) => Promise<void>;
  isLoading: boolean;
  prefilledQuestion: string;
  setPrefilledQuestion: (q: string) => void;
}

const INITIAL_WELCOME_MESSAGE: SheAIMessage = {
  id: 'welcome-0',
  role: 'assistant',
  text: "Hi! I'm SheAI, your financial learning companion. I can explain financial concepts, loan terms, credit-building steps, budgeting, emergency funds, and financial readiness in simple language.",
  keyPoint: "Ask any financial education question below or select a suggested topic to get started.",
  source: 'deterministic'
};

const SheAIContext = createContext<SheAIContextValue | undefined>(undefined);

export const SheAIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SheAIMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [prefilledQuestion, setPrefilledQuestion] = useState('');

  const openAssistant = useCallback((initialQuestion?: string) => {
    setIsOpen(true);
    if (initialQuestion) {
      setPrefilledQuestion(initialQuestion);
    }
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const sendMessage = useCallback(async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || isLoading) return;

    const userMsg: SheAIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setPrefilledQuestion('');

    try {
      const result = await askCustomSheAIQuestion(trimmed);
      const assistantMsg: SheAIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: result.text,
        keyPoint: result.keyPoint,
        disclaimer: result.disclaimer,
        source: result.source
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const { getEducationalFallback } = await import('../utils/scopeGuard');
      const fallback = getEducationalFallback(trimmed);
      const assistantMsg: SheAIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: fallback.answer,
        keyPoint: fallback.key_point,
        disclaimer: fallback.disclaimer,
        source: 'deterministic'
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Handle Escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeAssistant();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeAssistant]);

  return (
    <SheAIContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        messages,
        sendMessage,
        isLoading,
        prefilledQuestion,
        setPrefilledQuestion
      }}
    >
      {children}
    </SheAIContext.Provider>
  );
};

export const useSheAI = (): SheAIContextValue => {
  const context = useContext(SheAIContext);
  if (!context) {
    throw new Error('useSheAI must be used within a SheAIProvider');
  }
  return context;
};
