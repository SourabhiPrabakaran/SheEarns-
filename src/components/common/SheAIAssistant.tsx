import React, { useState, useRef, useEffect } from 'react';
import { useSheAI } from '../../context/SheAIContext';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Lightbulb,
  Bot
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'What is APR?',
  'What is collateral?',
  'How does a credit score work?',
  'What is an emergency fund?',
  'How can I build good financial habits?'
];

export const SheAIAssistant: React.FC = () => {
  const {
    isOpen,
    toggleAssistant,
    closeAssistant,
    messages,
    sendMessage,
    isLoading,
    prefilledQuestion,
    setPrefilledQuestion
  } = useSheAI();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync prefilled question when provided by contextual entry points
  useEffect(() => {
    if (prefilledQuestion) {
      setInputVal(prefilledQuestion);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [prefilledQuestion]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputVal).trim();
    if (!q || isLoading) return;
    sendMessage(q);
    setInputVal('');
    setPrefilledQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Refined Cohesive Floating Assistant Launcher */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={toggleAssistant}
          className={`group flex items-center gap-2 sm:gap-2.5 p-1.5 pl-3.5 sm:pl-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50] focus-visible:ring-offset-2 ${
            isOpen
              ? 'bg-stone-900 border-stone-700 text-white hover:bg-black'
              : 'bg-[#1e191b] border-[#dbc38e]/40 text-white hover:bg-black hover:scale-[1.03] active:scale-[0.97]'
          }`}
          aria-label={isOpen ? 'Close SheAI Assistant' : 'Open SheAI Financial Assistant'}
          title={isOpen ? 'Close SheAI' : 'Ask SheAI Financial Assistant'}
        >
          <span className="flex items-center gap-1.5 text-xs font-sans font-medium tracking-normal text-stone-200 group-hover:text-white transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#dbc38e] group-hover:rotate-12 transition-transform duration-300" />
            <span className={isOpen ? 'inline' : 'hidden sm:inline'}>
              {isOpen ? 'Close SheAI' : 'Ask SheAI'}
            </span>
          </span>

          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isOpen
                ? 'bg-white/20 text-white rotate-90'
                : 'bg-white/10 group-hover:bg-[#762e50] text-[#dbc38e] group-hover:text-white'
            }`}
          >
            {isOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Bot className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#762e50] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#762e50]"></span>
                </span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="sheai-title"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] max-h-[calc(100vh-7.5rem)] bg-white rounded-3xl shadow-2xl border border-[#ece6de] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 text-left"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-[#1e191b] text-white flex items-center justify-between shrink-0 border-b border-[#352c31]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#2c2428] border border-[#dbc38e]/40 flex items-center justify-center text-[#dbc38e]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 id="sheai-title" className="font-display font-bold text-base text-white">
                    SheAI ✦
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#382b32] text-[#dbc38e] border border-[#4d3a44]">
                    AI Assistant
                  </span>
                </div>
                <p className="text-[11px] text-stone-300">
                  Your financial learning companion
                </p>
              </div>
            </div>

            <button
              onClick={closeAssistant}
              className="w-8 h-8 rounded-full hover:bg-white/10 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              title="Close (Esc)"
              aria-label="Close SheAI dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf8f5]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] bg-[#1e191b] text-white text-xs sm:text-sm px-4 py-2.5 rounded-2xl rounded-br-xs shadow-xs leading-relaxed">
                    {msg.text}
                  </div>
                ) : (
                  <div className="max-w-[92%] bg-white border border-[#ece6de] p-4 rounded-2xl rounded-tl-xs shadow-xs space-y-3">
                    {/* Header tag */}
                    <div className="flex items-center justify-between gap-2 pb-1 border-b border-stone-100">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#762e50]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>SheAI</span>
                      </div>
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">
                        {msg.source === 'groq' ? 'Live AI' : 'Verified Fact'}
                      </span>
                    </div>

                    {/* Main text */}
                    <div className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line font-normal">
                      {msg.text}
                    </div>

                    {/* Key point highlight */}
                    {msg.keyPoint && (
                      <div className="p-3 rounded-xl bg-[#faf5f7] border border-[#e9d0dc] text-xs text-stone-800 flex items-start gap-2">
                        <span className="text-[#762e50] font-bold text-sm shrink-0">💡</span>
                        <div>
                          <strong className="text-[#1e191b] block">Key Takeaway:</strong>
                          <span className="text-stone-700">{msg.keyPoint}</span>
                        </div>
                      </div>
                    )}

                    {/* Educational disclaimer */}
                    {msg.disclaimer && (
                      <p className="text-[10px] text-stone-500 italic pt-1 border-t border-stone-100 leading-normal">
                        {msg.disclaimer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-white border border-[#ece6de] px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2 text-xs text-stone-600">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#762e50]" />
                  <span>SheAI is synthesizing your answer...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Question Chips (Collapsible / Compact) */}
          <div className="p-2.5 bg-white border-t border-[#ece6de] space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 px-1">
              <Lightbulb className="w-3 h-3 text-[#762e50]" />
              <span>Suggested Topics:</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-full bg-[#faf8f5] hover:bg-stone-100 border border-[#ece6de] text-stone-700 text-[11px] font-medium whitespace-nowrap transition cursor-pointer hover:border-stone-400 shrink-0 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white border-t border-[#ece6de]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask SheAI a financial question..."
                disabled={isLoading}
                aria-label="Financial question input"
                className="flex-1 px-4 py-2.5 rounded-full bg-[#faf8f5] border border-[#ece6de] text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#762e50] focus:border-transparent disabled:opacity-50"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputVal.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-[#1e191b] hover:bg-black text-white flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#762e50]"
                title="Send Question (Enter)"
                aria-label="Send question to SheAI"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            <p className="text-[10px] text-stone-500 text-center mt-2">
              SheAI provides educational guidance only. Never share sensitive account credentials.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
