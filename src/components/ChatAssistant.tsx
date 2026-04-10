import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { geminiService, PatientData } from '../services/geminiService';

interface ChatAssistantProps {
  patient: PatientData;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ patient }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await geminiService.chatWithTwin(patient, userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error processing that request." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-bottom border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">DiagnOSis Assistant</h3>
          <p className="text-[10px] text-slate-500">AI-Powered Clinical Insights</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">How can I help with this patient twin?</p>
              <p className="text-xs text-slate-500 mt-1">Ask about risks, medications, or simulation results.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
              {['Summarize key risks', 'Check drug interactions', 'Explain risk trend'].map((q) => (
                <button 
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors text-left"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3 max-w-[85%]",
              m.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-slate-200" : "bg-indigo-100 text-indigo-600"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-3 rounded-2xl text-sm leading-relaxed",
              m.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-slate-100 text-slate-700 rounded-tl-none"
            )}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="relative">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the assistant..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
