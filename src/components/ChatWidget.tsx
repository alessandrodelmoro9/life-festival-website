import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, GripHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'bot';
  text: string;
  images?: string[];
  links?: string[];
}

const ChatWidget: React.FC = () => {
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const [isFullPage, setIsFullPage] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFullPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullPage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isFullPage]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setPrompt('');
    setIsFullPage(true);
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userText,
          session_id: sessionId
        }),
      });

      if (!response.ok) throw new Error('Backend offline');

      const data = await response.json();
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: data.text,
        images: data.images,
        links: data.links
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: 'bot', 
        text: "Il Curatore AI si sta collegando... La prima richiesta potrebbe richiedere un minuto di attesa. Grazie per la pazienzaə." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* --- DESKTOP: DRAGGABLE BAR --- */}
      <AnimatePresence>
        {!isFullPage && (
          <div className="hidden md:block fixed bottom-40 left-1/2 -translate-x-1/2 z-[10005] w-[95%] md:w-auto pointer-events-auto">
            <motion.div
              drag
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white border border-life-brown/20 shadow-2xl rounded-full px-6 py-2 flex items-center gap-4 min-w-[450px] cursor-grab active:cursor-grabbing group"
            >
              <div className="text-life-brown/30 group-hover:text-life-brown transition-colors">
                <GripHorizontal className="w-5 h-5" />
              </div>

              <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-4">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Fai una domanda sul festival"
                  className="bg-transparent border-none outline-none font-display text-sm flex-1 placeholder:text-life-brown/30 text-life-black tracking-tight"
                />

                <button 
                  type="submit" 
                  className="relative w-10 h-10 shrink-0 transition-all active:scale-95 group/btn"
                >
                  <img 
                    src="/assets/chatbot/Freccia Disable.svg" 
                    alt="" 
                    className={cn(
                      "absolute inset-0 w-full h-full object-contain transition-all duration-300",
                      prompt.trim() ? "opacity-0 scale-90" : "opacity-100 scale-100 group-hover/btn:opacity-0 group-hover/btn:scale-90"
                    )}
                  />
                  <img 
                    src="/assets/chatbot/Freccia Active state.svg" 
                    alt="Invia" 
                    className={cn(
                      "absolute inset-0 w-full h-full object-contain transition-all duration-300",
                      prompt.trim() ? "opacity-100 scale-[1.4]" : "opacity-0 scale-90 group-hover/btn:opacity-100 group-hover/btn:scale-[1.4]"
                    )}
                  />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MOBILE: FLOATING BUTTON --- */}
      {!isFullPage && (
        <div className="md:hidden fixed bottom-28 right-6 z-[10005]">
          <button
            onClick={() => setIsFullPage(true)}
            className="active:scale-90 transition-all"
          >
            <img 
              src="/assets/chatbot/Chatbot Blu.svg" 
              alt="Chat" 
              className="w-16 h-16 object-contain" 
            />
          </button>
        </div>
      )}

      {/* --- FULL PAGE CONVERSATION VIEW --- */}
      <AnimatePresence>
        {isFullPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10010] bg-life-cream flex flex-col overflow-hidden"
          >
            {/* Scroll Container */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth">
              
              {/* Floating Header */}
              <div className="sticky top-0 p-4 md:p-6 flex items-center justify-between z-20 bg-life-cream/40 backdrop-blur-sm pointer-events-none">
                <button 
                  onClick={() => setIsFullPage(false)}
                  className="pointer-events-auto flex items-center gap-4 text-life-black font-display font-bold text-[11px] uppercase tracking-[-0.02em] hover:opacity-70 transition-opacity"
                >
                  <img src="/assets/chatbot/Freccia pulita.svg" alt="" className="w-5 h-5" />
                  TORNA AL SITO
                </button>
              </div>

              {/* Content Area */}
              <div className="max-w-5xl mx-auto px-4 md:px-0 py-4 md:py-8 space-y-16 md:space-y-24">
                
                {/* Hero Greeting */}
                {messages.length === 0 && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center space-y-8 pt-8"
                  >
                    <img 
                      src="/assets/chatbot/Welcome.svg" 
                      alt="Welcome to Life 2026" 
                      className="w-[60%] md:w-full max-w-[400px] h-auto"
                    />
                    <p className="hidden md:block font-display text-life-brown text-xl md:text-2xl uppercase tracking-[0.4em]">
                      Curatore AI del Festival
                    </p>
                  </motion.div>
                )}

                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className={cn("flex flex-col w-full", msg.role === 'user' ? "items-end" : "items-start")}
                  >
                    {msg.role === 'user' ? (
                      <div className="bg-life-pink text-life-black p-5 px-8 rounded-[28px] shadow-xl max-w-[90%] md:max-w-[60%] font-display font-medium text-base md:text-lg tracking-tight normal-case leading-snug">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="w-full space-y-12">
                        {/* AI Text Body */}
                        <div className="font-body text-life-black text-lg md:text-[20px] leading-[1.6] tracking-tight prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-headings:text-life-black">
                          <ReactMarkdown 
                            components={{
                              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-life-brown underline decoration-life-pink underline-offset-4 hover:text-life-pink transition-colors" />,
                              h1: ({ node, ...props }) => <h1 {...props} style={{ letterSpacing: '-0.02em' }} className="text-3xl md:text-5xl mb-8 mt-12 font-display font-bold text-life-black" />,
                              h2: ({ node, ...props }) => <h2 {...props} style={{ letterSpacing: '-0.02em' }} className="text-2xl md:text-3xl mb-6 mt-10 font-display font-bold text-life-black" />,
                              h3: ({ node, ...props }) => <h3 {...props} style={{ letterSpacing: '-0.02em' }} className="text-xl md:text-2xl mb-4 mt-8 font-display font-bold text-life-black" />,
                              p: ({ node, ...props }) => <p {...props} style={{ fontFamily: "'Automat Grotesk', sans-serif", letterSpacing: '-0.02em' }} className="mb-6 text-lg md:text-[20px]" />,
                              ul: ({ node, ...props }) => <ul {...props} className="mb-10 space-y-4 list-none" />,
                              ol: ({ node, ...props }) => <ol {...props} className="mb-10 space-y-4 list-decimal ml-6" />,
                              li: ({ node, ...props }) => <li {...props} style={{ fontFamily: "'Automat Grotesk', sans-serif", letterSpacing: '-0.02em' }} className="relative pl-6 text-lg md:text-[20px] before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-2 before:h-2 before:bg-life-pink before:rounded-none" />
                            }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>

                        {/* Bot Assets Grid */}
                        {msg.images && msg.images.length > 0 && (
                          <div className={cn(
                            "flex flex-wrap gap-4 md:gap-6 w-full",
                            msg.images.some(img => img.includes('composite') || img.includes('Partner')) 
                              ? "flex-col" 
                              : "flex-row"
                          )}>
                            {msg.images.map((img, idx) => {
                              const isComposite = img.includes('composite') || img.includes('Partner');
                              return (
                                <div
                                  key={idx}
                                  className={cn(
                                    "relative overflow-hidden border border-life-brown/10 bg-life-black shadow-2xl flex items-center justify-center",
                                    isComposite ? "w-full rounded-[24px]" : "w-fit rounded-none"
                                  )}
                                >
                                  <img 
                                    src={img} 
                                    className={cn(
                                      "object-contain transition-transform duration-700",
                                      isComposite ? "w-full h-auto max-h-[600px] p-2" : "h-56 md:h-64 w-auto p-0"
                                    )}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                        
                        {/* Links Section */}
                        {msg.links && msg.links.length > 0 && (
                          <div className="flex flex-wrap gap-4 pt-4">
                            {msg.links.map((link, idx) => (
                              <a 
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 bg-white border border-life-brown/20 text-[11px] text-life-black px-6 py-2.5 md:py-3.5 rounded-xl hover:bg-life-pink hover:text-life-black transition-all uppercase tracking-[-0.02em] font-display font-bold shadow-xl active:scale-95 group"
                              >
                                <img 
                                  src={`https://www.google.com/s2/favicons?domain=${new URL(link).hostname}&sz=64`} 
                                  alt="" 
                                  className="w-4 h-4 rounded-sm transition-all"
                                />
                                {link.includes('eventbrite') ? 'Tickets' : 'Website'}
                                <ArrowUp className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 p-6 pb-24">
                    <div className="w-3 h-3 bg-life-pink rounded-none animate-bounce" />
                    <div className="w-3 h-3 bg-life-pink rounded-none animate-bounce [animation-delay:0.2s]" />
                    <div className="w-3 h-3 bg-life-pink rounded-none animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}

                <div className="h-32" />
              </div>

              {/* Floating Footer */}
              <div className="sticky bottom-0 p-4 pb-12 md:p-8 flex justify-center items-center z-20 pointer-events-none">
                <div className="w-full max-w-4xl relative pointer-events-auto">
                  <form onSubmit={handleSendMessage} className="relative flex items-center group">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Fai una domanda sul festival"
                      className="w-full bg-white/90 backdrop-blur-md border border-life-brown/20 rounded-full px-10 py-5 pr-20 text-lg md:text-xl font-display outline-none text-life-black placeholder:text-life-brown/30 focus:border-life-brown transition-all shadow-none tracking-tight"
                    />

                    <button 
                      type="submit" 
                      className="absolute right-3.5 w-12 h-12 shrink-0 transition-all active:scale-95 group/btn"
                    >
                      <img 
                        src="/assets/chatbot/Freccia Disable.svg" 
                        alt="" 
                        className={cn(
                          "absolute inset-0 w-full h-full object-contain transition-all duration-300",
                          prompt.trim() ? "opacity-0 scale-90" : "opacity-100 scale-100 group-hover/btn:opacity-0 group-hover/btn:scale-90"
                        )}
                      />
                      <img 
                        src="/assets/chatbot/Freccia Active state.svg" 
                        alt="Invia" 
                        className={cn(
                          "absolute inset-0 w-full h-full object-contain transition-all duration-300",
                          prompt.trim() ? "opacity-100 scale-[1.4]" : "opacity-0 scale-90 group-hover/btn:opacity-100 group-hover/btn:scale-[1.4]"
                        )}
                      />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
