'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useChatBot } from '@/hooks/useChatBot';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatSuggestions from './ChatSuggestions';
import ChatBotLogo from './ChatBotLogo';
import type { ChatMessage as ChatMessageType } from '@/types/chat';

interface ChatWidgetProps {
  botName: string;
  greetingMessage: string;
  humanHandoffEnabled: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring' as const, damping: 30, stiffness: 300, mass: 0.8 },
  },
  exit: {
    opacity: 0, scale: 0.97, y: 10,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

export default function ChatWidget({ botName }: ChatWidgetProps) {
  const { isOpen, messages, isTyping, addMessage, toggle } = useChat();
  const { processUserMessage, sendWelcomeMessage } = useChatBot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const welcomeSentRef = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !welcomeSentRef.current && messages.length === 0) {
      sendWelcomeMessage();
      welcomeSentRef.current = true;
    }
  }, [isOpen, messages.length, sendWelcomeMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    const userMsg: ChatMessageType = {
      id: `user-${Date.now()}`,
      conversationId: 'pending',
      sender: 'user',
      type: 'text',
      text,
      createdAt: new Date().toISOString(),
    };
    addMessage(userMsg);
    const pageUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const pageTitle = typeof window !== 'undefined' ? document.title : '';
    await processUserMessage(text, pageUrl, pageTitle);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="chat-widget"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[390px] max-w-[calc(100vw-2rem)] origin-bottom-right"
        >
          {/* Outer glow */}
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 blur-2xl pointer-events-none" />

          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-2xl p-[1.5px] pointer-events-none">
            <motion.div
              className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 via-rose-400 to-indigo-500"
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ backgroundSize: '200% 200%' }}
            />
          </div>

          {/* Main container — fixed height so messages never get clipped */}
          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl flex flex-col h-[560px] shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">

            {/* Header */}
            <div className="relative overflow-hidden flex-shrink-0">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              />
              <div className="relative px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ChatBotLogo size="sm" showGlow={false} />
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-1.5">
                        {botName}
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      </div>
                      <div className="text-[10px] text-indigo-200 flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                        Online · Parts Assistant
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={toggle}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages — flex-1 fills remaining space, overflow-y-auto scrolls */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto py-3 space-y-1 bg-gradient-to-b from-indigo-50/30 to-transparent dark:from-indigo-950/10 min-h-0"
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  <ChatMessage message={msg} />
                  {msg.quickReplies && msg.sender === 'bot' && (
                    <div className="pl-12 pr-3 pt-1">
                      <ChatSuggestions
                        suggestions={msg.quickReplies}
                        onSelect={handleSend}
                      />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 px-3 py-1">
                  <ChatBotLogo size="sm" animated={false} showGlow={false} />
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700/50">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="px-4 py-1.5 border-t border-gray-100/50 dark:border-gray-800/50 bg-gray-50/30 dark:bg-gray-900/30 flex-shrink-0">
              <div className="text-center text-[9px] text-gray-400 dark:text-gray-500 tracking-wider font-medium flex items-center justify-center gap-1">
                <Zap className="w-2.5 h-2.5 text-indigo-400" />
                Powered by <span className="font-bold text-indigo-500">{botName}</span>
              </div>
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={isTyping} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
