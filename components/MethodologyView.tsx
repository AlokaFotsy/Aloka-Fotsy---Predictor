
import React from 'react';
import { ChevronLeft, ShieldCheck, Zap, Activity, Star, Info } from 'lucide-react';

interface MethodologyViewProps {
  onBack: () => void;
}

const MethodologyView: React.FC<MethodologyViewProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in px-1 max-w-full overflow-x-hidden">
      <header className="flex items-center gap-4 min-w-0">
        <button onClick={onBack} className="p-3 glass-card rounded-full hover:bg-white/5 transition-all flex-shrink-0">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black uppercase truncate">Protocoles Elite v11.0</h1>
      </header>

      <div className="glass-card p-8 rounded-[3rem] border border-white/10 space-y-10 overflow-hidden">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-kls-cyan uppercase tracking-widest">Calculs Elite Spribe</h2>
          <p className="text-slate-500 text-sm italic">Analyse mathématique stricte pour Aviator</p>
        </div>

        <div className="space-y-8 relative">
          <div className="absolute left-6 top-4 bottom-4 w-1 bg-gradient-to-b from-kls-cyan via-kls-orange to-kls-yellow opacity-10 hidden sm:block"></div>

          {[
            { 
              icon: Zap, 
              title: 'Calcul « BON »', 
              range: "Entrée : 2.00x - 10.00x",
              desc: 'Sortie 1 : +2m 45s (2.00x - 4.00x). Sortie 2 : +4m 25s (2.00x - 10.00x).', 
              color: 'text-kls-cyan',
              bg: 'bg-kls-cyan/10'
            },
            { 
              icon: Activity, 
              title: 'Calcul « MAUVAISE »', 
              range: "Entrée : 2.00x - 5.99x",
              desc: 'Sortie 1 : +1m 55s (2.00x - 4.00x). Sortie 2 : +5m 02s (2.00x - 8.00x).', 
              color: 'text-rose-400',
              bg: 'bg-rose-400/10'
            },
            { 
              icon: Star, 
              title: 'Calcul « ROSE »', 
              range: "Entrée : 10.00x - 30.99x",
              desc: 'Sortie 1 : +2m 05s (3.00x - 10.00x). Sortie 2 : +4m 22s (3.00x - 15.00x).', 
              color: 'text-kls-yellow',
              bg: 'bg-kls-yellow/10'
            }
          ].map((item, i) => (
            <div key={i} className="relative sm:pl-16 flex flex-col sm:block items-center text-center sm:text-left">
              <div className={`sm:absolute left-0 top-0 w-12 h-12 rounded-2xl border border-white/5 flex items-center justify-center ${item.color} ${item.bg} mb-4 sm:mb-0`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                <h4 className="font-black text-white uppercase tracking-wide truncate">{item.title}</h4>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${item.color} border-current opacity-60`}>{item.range}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed break-words">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
          <div className="flex items-center gap-3 mb-3">
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
             <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest">Règle de Validation</h4>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-black italic">
            "Si les données du calcul d'analyse de prédiction ne correspondent pas à ces critères ou sont incorrectes, le calcul échouera et affichera une erreur."
          </p>
        </div>
      </div>
    </div>
  );
};

export default MethodologyView;
