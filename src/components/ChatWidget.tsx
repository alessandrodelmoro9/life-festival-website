import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, ExternalLink, GripHorizontal, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'bot';
  text: string;
  images?: string[];
  links?: string[];
}

const ChatWidget: React.FC = () => {
  const [isFullPage, setIsFullPage] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle scrolling when messages or fullpage mode changes
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
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
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
        text: "Curatore AI momentaneamente offline. Sto ripristinando la connessione, riprova tra poco!" 
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-life-cream/95 backdrop-blur-md border border-life-blue/10 shadow-2xl rounded-full px-4 md:px-6 py-2 md:py-3 flex items-center gap-4 md:gap-8 w-full md:w-auto group"
            >
              <div className="cursor-grab active:cursor-grabbing text-life-blue/30 group-hover:text-life-blue transition-colors border-r border-life-blue/10 pr-4 md:pr-6">
                <GripHorizontal className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </div>
              
              <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2 md:gap-4 min-w-[300px] md:min-w-[400px]">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Chiedimi qualunque cosa sul life design festival..."
                  className="bg-transparent border-none outline-none font-body text-sm md:text-base flex-1 placeholder:text-life-blue/40 text-life-blue tracking-[-0.04em]"
                />
                <button type="submit" className="bg-life-blue text-white p-2 md:p-3 rounded-full hover:bg-life-pink hover:scale-110 active:scale-95 transition-all shadow-lg">
                  <Send className="w-4 h-4 md:w-[18px] md:h-[18px]" />
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
            className="bg-life-blue text-white p-4 rounded-2xl shadow-2xl active:scale-90 transition-transform"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* --- FULL PAGE CONVERSATION VIEW --- */}
      <AnimatePresence>
        {isFullPage && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[10010] bg-life-cream flex flex-col"
          >
            {/* Full Page Header */}
            <div className="bg-white/80 backdrop-blur-md border-b border-life-blue/10 p-4 md:p-6 flex items-center justify-between">
              <button 
                onClick={() => setIsFullPage(false)}
                className="flex items-center gap-2 text-life-blue font-body text-xs uppercase tracking-widest hover:opacity-70 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna al sito
              </button>
              
              <div className="flex flex-col items-center">
                <h2 className="font-display text-xs tracking-[0.2em] uppercase text-life-blue">AI Curator</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-body italic opacity-50 tracking-widest uppercase">Edizione 2026</span>
                </div>
              </div>

              <div className="hidden md:block w-24" />
            </div>

            {/* Conversation Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:px-[20%] space-y-10 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}
                >
                  <div className={cn(
                    "max-w-[85%] md:max-w-[75%] p-6 font-body text-sm md:text-base leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-life-blue text-white rounded-3xl rounded-tr-none shadow-xl" 
                      : "bg-white text-life-blue border border-life-blue/5 rounded-3xl rounded-tl-none shadow-sm"
                  )}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-headings:text-life-blue prose-strong:text-life-blue prose-strong:font-bold prose-table:border-collapse prose-table:w-full prose-td:border prose-td:border-life-blue/10 prose-td:p-2 prose-th:bg-life-blue/5 prose-th:p-2 prose-a:text-life-blue prose-a:underline">
                        <ReactMarkdown 
                          components={{
                            a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {msg.role === 'bot' && (
                    <div className="mt-6 w-full max-w-[85%] md:max-w-[75%] space-y-6">
                      {msg.images && msg.images.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
                          {msg.images.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              className="h-56 md:h-80 rounded-2xl border border-life-blue/10 bg-life-black object-contain p-2 shadow-lg snap-center"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          ))}
                        </div>
                      )}
                      
                      {msg.links && msg.links.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                          {msg.links.map((link, idx) => (
                            <a 
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 bg-white border border-life-blue/10 text-[10px] text-life-blue px-6 py-4 rounded-xl hover:bg-life-blue hover:text-white transition-all uppercase tracking-widest font-body shadow-md group"
                            >
                              <img 
                                src={`https://www.google.com/s2/favicons?domain=${new URL(link).hostname}&sz=32`} 
                                alt="" 
                                className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                              <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100" />
                              {link.includes('eventbrite') ? 'Acquista Ticket' : 'Visita Sito'}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex gap-2 p-4">
                  <div className="w-2 h-2 bg-life-blue/20 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-life-blue/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-life-blue/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-6 md:p-10 bg-white/50 backdrop-blur-xl border-t border-life-blue/5">
              <div className="max-w-3xl mx-auto relative flex items-center">
                <form onSubmit={handleSendMessage} className="w-full relative">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Chiedi qualcos'altro..."
                    className="w-full bg-white border border-life-blue/10 rounded-2xl px-8 py-5 pr-20 text-sm md:text-lg font-body outline-none text-life-blue shadow-2xl focus:border-life-blue/30 transition-all"
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-life-blue text-white p-3.5 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg">
                    <Send className="w-6 h-6" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
