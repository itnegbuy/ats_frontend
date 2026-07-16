'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useSiteConfig, DEFAULT_CHAT_CONFIG } from '@/hooks/useSiteConfig';
import type { ChatConfig } from '@/types/chat';
import ChatButton from './ChatButton';
import WhatsAppButton from './WhatsAppButton';

const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false });

function getChatConfigSafe(config: { chat?: ChatConfig } | null): ChatConfig {
  return config?.chat || DEFAULT_CHAT_CONFIG;
}

const NOTIFICATION_INTERVAL = 45000;
const NOTIFICATION_DURATION = 8000;

export default function ChatProvider() {
  const { isOpen, toggle } = useChat();
  const { config } = useSiteConfig();
  const [mounted, setMounted] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const showNotification = useCallback(() => {
    if (!isOpen) setNotifVisible(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) { setNotifVisible(false); return; }
    const initial = setTimeout(showNotification, 8000);
    const interval = setInterval(showNotification, NOTIFICATION_INTERVAL);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [isOpen, showNotification]);

  useEffect(() => {
    if (!notifVisible) return;
    const timer = setTimeout(() => setNotifVisible(false), NOTIFICATION_DURATION);
    return () => clearTimeout(timer);
  }, [notifVisible]);

  const chatConfig = getChatConfigSafe(config);
  const showChat = chatConfig.chatbotEnabled !== false;
  const showWhatsApp = chatConfig.whatsappEnabled !== false;

  if (!mounted) return null;
  if (!showChat && !showWhatsApp) return null;

  const whatsappUrl = chatConfig.whatsappNumber
    ? `https://wa.me/${chatConfig.whatsappNumber.replace(/[^0-9]/g, '')}`
    : '#';

  return (
    <>
      {showChat && (
        <ChatWidget
          botName={chatConfig.botName}
          greetingMessage={chatConfig.greetingMessage}
          humanHandoffEnabled={chatConfig.humanHandoffEnabled}
        />
      )}

      <AnimatePresence>
        {notifVisible && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-6 z-50 max-w-xs"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-silver p-4 relative">
              <button
                onClick={() => setNotifVisible(false)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-silver/60 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-text-muted" />
              </button>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-semibold text-navy mb-1">
                    Need a part?
                  </p>
                  <p className="text-xs text-text-muted leading-snug mb-3">
                    Search our catalog or talk to our team. We usually get back within a few hours.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { toggle(); setNotifVisible(false); }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy text-white hover:bg-navy-dark transition-colors"
                    >
                      Chat Now
                    </button>
                    {showWhatsApp && chatConfig.whatsappNumber && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {showChat && (
          <ChatButton isOpen={isOpen} onClick={toggle} />
        )}
        {showWhatsApp && (
          <WhatsAppButton
            number={chatConfig.whatsappNumber}
            mode={chatConfig.whatsappMode}
            businessPhoneId={chatConfig.whatsappBusinessPhoneId}
            businessToken={chatConfig.whatsappBusinessToken}
          />
        )}
      </div>
    </>
  );
}
