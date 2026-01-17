
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Users, Headset, MessageCircle, Shield, CheckCircle2, User, Loader2, Globe } from 'lucide-react';
import { chatWithAssistant } from '../services/gemini.ts';
import { useToast } from './ToastProvider.tsx';

interface Message {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
  isAdmin?: boolean;
  timestamp: string;
}

interface LiveChatViewProps {
  onBack: () => void;
  currentUser: string | null;
}

const MOCK_USERS = ['Kevin_Bet', 'Mahandry22', 'Fotsy_Pro', 'Winner_Mada', 'Aviator_King', 'Joda_X', 'Elite_Member'];
const MOCK_MESSAGES = [
  'Signal validé sur Bet261 ! ✅', 
  'Merci Aloka pour le 5x 🚀', 
  'Attention crash probable vers 1.20', 
  'Le predictor est en feu ce soir 🔥', 
  'Qui a testé le mode Rose ?', 
  'Retrait validé, merci la team', 
  'Patience les gars, attendez le signal'
];

const LiveChatView: React.FC<LiveChatViewProps> = ({ onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'support'>('global');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'SYSTÈME', text: 'Bienvenue sur le canal sécurisé Aloka Fotsy.', isUser: false, isAdmin: true, timestamp: new Date().toLocaleTimeString().slice(0,5) }
  ]);
  const [supportMessages, setSupportMessages] = useState<Message[]>([
    { id: 's1', sender: 'Agent Elite', text: 'Bonjour. Je suis votre agent de support dédié. Comment puis-je vous aider ?', isUser: false, isAdmin: true, timestamp: new Date().toLocaleTimeString().slice(0,5) }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, supportMessages, activeTab]);

  useEffect(() => {
    if (activeTab === 'global') {
      const interval = setInterval(() => {
        if (Math.random() > 0.6) {
          const randomUser = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
          const randomMsg = MOCK_MESSAGES[Math.floor(Math.random() * MOCK_MESSAGES.length)];
          const newMsg: Message = {
            id: Date.now().toString(),
            sender: randomUser,
            text: randomMsg,
            isUser: false,
            timestamp: new Date().toLocaleTimeString().slice(0,5)
          };
          setMessages(prev => [...prev.slice(-50), newMsg]);
        }
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: currentUser || 'Moi',
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString().slice(0,5)
    };

    setInput('');

    if (activeTab === 'global') {
      setMessages(prev => [...prev, userMsg]);
    } else {
      setSupportMessages(prev => [...prev, userMsg]);
      setIsTyping(true);
      
      try {
        const history = supportMessages.map(m => ({ role: m.isUser ? 'user' : 'model', content: m.text }));
        const contextMsg = `Agissez en tant qu'agent de support pour Aloka Fotsy. Répondez de façon courte et pro en Français. Question : ${input}`;
        
        const responseText = await chatWithAssistant(contextMsg, history);
        
        const agentMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'Agent Elite',
          text: responseText,
          isUser: false,
          isAdmin: true,
          timestamp: new Date().toLocaleTimeString().slice(0,5)
        };
        setSupportMessages(prev => [...prev, agentMsg]);
      } catch (error) {
         const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'Système',
          text: "Désolé, nos agents sont momentanément indisponibles. Veuillez réessayer plus tard.",
          isUser: false,
          isAdmin: true,
          timestamp: new Date().toLocaleTimeString().slice(0,5)
        };
        setSupportMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const currentList = activeTab === 'global' ? messages : supportMessages;

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in max-w-full">
      <header className="flex items-center gap-4 mb-6 flex-none">
        <button onClick={onBack} className="p-3 glass-card rounded-xl text-kls-cyan hover:bg-white/10 transition-all flex-shrink-0">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-white uppercase tracking-tight">Live <span className="text-kls-cyan">Support</span></h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{activeTab === 'global' ? '124 Opérateurs Connectés' : 'Agent Elite en ligne'}</p>
          </div>
        </div>
      </header>

      <div className="flex p-1 bg-white/5 rounded-2xl mb-4 border border-white/5 flex-none">
        <button 
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            activeTab === 'global' ? 'bg-kls-cyan text-black shadow-lg' : 'text-slate-500 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" /> Communauté
        </button>
        <button 
          onClick={() => setActiveTab('support')}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            activeTab === 'support' ? 'bg-kls-orange text-white shadow-lg' : 'text-slate-500 hover:text-white'
          }`}
        >
          <Headset className="w-4 h-4" /> Support VIP
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 glass-card rounded-[2rem] border-white/10 p-4 overflow-y-auto space-y-3 custom-scrollbar relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
        
        {currentList.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'} animate-slide-up`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              {!msg.isUser && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border ${
                  msg.isAdmin ? 'bg-kls-orange text-white border-kls-orange/30' : 'bg-white/10 text-slate-400 border-white/10'
                }`}>
                  {msg.isAdmin ? <Shield className="w-4 h-4" /> : msg.sender[0]}
                </div>
              )}
              
              <div className={`p-3 rounded-2xl text-xs leading-relaxed break-words shadow-lg ${
                msg.isUser 
                  ? 'bg-kls-cyan text-black rounded-tr-none' 
                  : msg.isAdmin 
                    ? 'bg-slate-800 text-white border border-kls-orange/20 rounded-tl-none' 
                    : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
              }`}>
                {!msg.isUser && (
                  <span className={`block text-[8px] font-black uppercase mb-1 ${msg.isAdmin ? 'text-kls-orange' : 'text-slate-500'}`}>
                    {msg.sender}
                  </span>
                )}
                {msg.text}
                <span className={`block text-[8px] font-bold mt-1 opacity-50 text-right ${msg.isUser ? 'text-black' : 'text-slate-400'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && activeTab === 'support' && (
           <div className="flex justify-start animate-fade-in">
             <div className="bg-white/5 px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-2 border border-white/5">
                <Loader2 className="w-3 h-3 text-kls-orange animate-spin" />
                <span className="text-[9px] text-slate-500 font-bold uppercase">L'agent rédige...</span>
             </div>
           </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-3 flex-none">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={activeTab === 'global' ? "Message à la communauté..." : "Décrivez votre demande..."}
          className="flex-1 bg-slate-900/80 border border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-white outline-none focus:border-kls-cyan/50 transition-all placeholder:text-slate-600 shadow-xl"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
             activeTab === 'global' ? 'bg-kls-cyan text-black hover:bg-kls-cyan/90' : 'bg-kls-orange text-white hover:bg-kls-orange/90'
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default React.memo(LiveChatView);
