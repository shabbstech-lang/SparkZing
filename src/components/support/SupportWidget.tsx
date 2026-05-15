import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare, X, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '@/lib/firebase';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      text: "Hi there! I'm the Spark Zing AI assistant. How can I help you with our artisanal snacks today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const currentUser = auth.currentUser;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: `You are a helpful customer support agent for 'Spark Zing', an artisanal handmade snack company. 
          The user is ${currentUser?.displayName || 'a customer'}.
          Our snacks include Spicy Cassava Chips, Honey Roasted Almonds, Dried Mango Slices, and Ancient Grain Crackers.
          Answer their questions politely. If they ask about orders, tell them our kitchen is busy crafting fresh batches!
          Keep responses concise as this is a small chat widget.` },
          { text: input }
        ],
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: response.text || "I'm sorry, I couldn't process that. Can you try again?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'bot',
        text: "Oops! Something went wrong. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-spark-orange rounded-xl">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Spark Support</h3>
                  <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    AI ACTIVE
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Minus className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/30"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px]",
                    m.role === 'bot' ? "bg-spark-orange text-white" : "bg-slate-200 text-slate-500"
                  )}>
                    {m.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className={cn(
                      "p-3 rounded-2xl text-[13px] leading-relaxed",
                      m.role === 'bot' 
                        ? "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm" 
                        : "bg-deep-charcoal text-white rounded-tr-none"
                    )}>
                      {m.text}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 items-center">
                  <div className="w-7 h-7 rounded-full bg-spark-orange text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="relative"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-spark-orange/20 focus:border-spark-orange transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 top-1.5 p-2 bg-spark-orange text-white rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300",
          isOpen ? "bg-white text-slate-800 rotate-90" : "bg-spark-orange text-white"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
