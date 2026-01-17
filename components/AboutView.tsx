
import React from 'react';
import { ChevronLeft, User, MapPin, Calendar, Award, Code } from 'lucide-react';

interface AboutViewProps {
  onBack: () => void;
}

const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in px-1 max-w-full overflow-x-hidden">
      <header className="flex items-center gap-4 min-w-0">
        <button onClick={onBack} className="p-3 glass-card rounded-full hover:bg-white/5 transition-all flex-shrink-0">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black uppercase truncate">À Propos</h1>
      </header>

      <div className="space-y-6 overflow-hidden">
        <div className="glass-card p-8 rounded-[3rem] border border-white/10 overflow-hidden">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 to-purple-500 p-1 flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
                <User className="w-12 h-12 text-cyan-400" />
              </div>
            </div>
            <div className="min-w-0 w-full overflow-hidden">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight truncate">Mahandry RANDRIAMALALA</h2>
              <p className="text-cyan-400 font-black text-xs uppercase tracking-widest truncate">Fondateur & Lead - Aloka Fotsy</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: MapPin, label: 'Lieu', val: 'Antananarivo' },
              { icon: Calendar, label: 'Date', val: '21 Avril 2005' },
              { icon: Award, label: 'Expertise', val: 'Expertise IA' },
              { icon: Code, label: 'Noyau', val: 'SHA-512 & Neural' }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 p-4 rounded-2xl flex items-center gap-4 overflow-hidden border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <span className="text-[10px] font-black text-slate-600 uppercase block truncate">{item.label}</span>
                  <span className="text-sm font-bold text-slate-200 truncate block">{item.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-[3rem] border border-white/10 space-y-4 overflow-hidden">
          <h3 className="font-black text-xl text-purple-400 uppercase truncate">Vision Aloka Fotsy</h3>
          <p className="text-sm text-slate-400 leading-relaxed break-words overflow-hidden">
            Aloka Fotsy est née de la volonté de démocratiser l'analyse de données SHA-512 pour les jeux de crash. Notre mission est de fournir des outils de précision chirurgicale pour les opérateurs avertis.
          </p>
          <div className="pt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-black rounded-full border border-cyan-500/20 uppercase whitespace-nowrap">Précision</span>
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black rounded-full border border-purple-500/20 uppercase whitespace-nowrap">Fiabilité</span>
            <span className="px-3 py-1 bg-rose-500/10 text-rose-400 text-[10px] font-black rounded-full border border-rose-500/20 uppercase whitespace-nowrap">IA v9.2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
