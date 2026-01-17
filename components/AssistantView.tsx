
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, Send, MessageSquare, Loader2, Languages, AlertTriangle } from 'lucide-react';
import { chatWithAssistant, translateContent } from '../services/gemini.ts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  translation?: string;
  isTranslating?: boolean;
}

interface AssistantViewProps {
  onBack: () => void;
}

const AssistantView: React.FC<AssistantViewProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Identification confirmée. Je suis l'Expert IA Aloka Neural. Prêt pour l'analyse tactique v11.0 du flux aujourd'hui." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
      const response = await chatWithAssistant(userMessage, history);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err: any) {
      const errorMessage = err.message || "Erreur de connexion au noyau Neural.";
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ ERREUR NEURAL : ${errorMessage}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages]);

  const handleTranslate = async (index: number) => {
    const msg = messages[index];
    if (msg.translation || msg.isTranslating) return;

    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTranslating: true } : m));

    try {
      const translation = await translateContent(msg.content, "Malagasy");
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, translation, isTranslating: false } : m));
    } catch (err) {
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, isTranslating: false } : m));
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in px-1 max-w-full overflow-hidden">
      <header className="flex items-center gap-6 mb-8 flex-none min-w-0">
        <button onClick={onBack} className="p-4 glass-card rounded-2xl hover:bg-white/10 transition-all shadow-xl active:scale-95 flex-shrink-0">
          <ChevronLeft className="w-6 h-6 text-kls-cyan" />
        </button>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none truncate">Aloka <span className="text-kls-cyan">Neural IA</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 truncate">Conseiller tactique Elite v11.0</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-10 min-w-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-scale-in max-w-full overflow-hidden`}>
            <div className={`max-w-[90%] p-6 rounded-3xl text-sm leading-relaxed shadow-xl border overflow-hidden break-words flex flex-col gap-3 ${
              msg.role === 'user' 
              ? 'bg-kls-cyan text-black font-semibold rounded-tr-none border-kls-cyan/30' 
              : msg.content.startsWith('⚠️') 
                ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 rounded-tl-none'
                : 'glass-card text-slate-200 border-white/10 rounded-tl-none'
            }`}>
              {msg.content.startsWith('⚠️') && <AlertTriangle className="w-5 h-5 mb-1" />}
              <div className="whitespace-pre-wrap normal-case font-medium">{msg.content}</div>
              
              {msg.translation && (
                <div className="pt-3 border-t border-white/10 animate-fade-in italic text-slate-400 text-xs">
                  <span className="text-[8px] font-black uppercase tracking-widest text-kls-cyan block mb-1">Traduction Aloka (Malagasy)</span>
                  <div className="normal-case leading-relaxed not-italic text-slate-300">{msg.translation}</div>
                </div>
              )}

              {msg.role === 'assistant' && !msg.translation && !msg.content.startsWith('⚠️') && (
                <button 
                  onClick={() => handleTranslate(i)}
                  disabled={msg.isTranslating}
                  className="self-end mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50 group"
                >
                  {msg.isTranslating ? (
                    <Loader2 className="w-3 h-3 animate-spin text-kls-cyan" />
                  ) : (
                    <Languages className="w-3 h-3 text-kls-cyan group-hover:rotate-12 transition-transform" />
                  )}
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Traduire en Malagasy</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-fade-in">
            <div className="glass-card p-4 rounded-2xl flex items-center gap-3 border-white/10">
              <Loader2 className="w-4 h-4 animate-spin text-kls-cyan flex-shrink-0" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse truncate">Analyse Neural en cours...</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-8 flex gap-3 flex-none bg-slate-900/60 p-2 rounded-3xl border border-white/10 shadow-2xl focus-within:border-kls-cyan/30 transition-all overflow-hidden">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Posez votre question technique Neural..."
          className="flex-1 bg-transparent px-4 sm:px-6 py-4 text-white outline-none font-medium text-sm placeholder:text-slate-600 min-w-0"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()}
          className="w-14 h-14 bg-kls-cyan rounded-2xl flex items-center justify-center disabled:opacity-50 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-kls-cyan/20 flex-shrink-0"
        >
          <Send className="w-6 h-6 text-black" />
        </button>
      </form>
    </div>
  );
};

export default React.memo(AssistantView);
