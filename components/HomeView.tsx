
import React from 'react';
import { 
  Activity, Zap, ArrowUpRight, 
  Settings, Wifi, Lock, PlayCircle, Sparkles,
  ExternalLink, Gauge, TrendingUp, Cpu, BrainCircuit, ShieldCheck, Box,
  ChevronRight
} from 'lucide-react';
import { AppState } from '../types.ts';
import { PLATFORMS } from '../constants.ts';

interface HomeViewProps {
  state: AppState;
  onNavigate: (view: string) => void;
  syncPlatform: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ state, onNavigate, syncPlatform }) => {
  const activePlatform = PLATFORMS.find(p => p.id === state.syncedPlatform);
  const activeUrl = state.syncedEngine === 'Studio' ? activePlatform?.engines.studio.url : activePlatform?.engines.spribe.url;
  const lastPrediction = state.predictions[0];

  const handleLaunchGame = () => {
    if (activeUrl) window.open(activeUrl, '_blank', 'noopener,noreferrer');
    else syncPlatform();
  };

  return (
    <div className="space-y-5 animate-fade-in pb-10 max-w-4xl mx-auto flex flex-col items-center w-full">
      
      {/* STATUS HEADER - PLUS COMPACT */}
      <div className="w-full flex flex-col sm:flex-row gap-2 justify-between items-center bg-black/50 p-3 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-white uppercase tracking-widest leading-none">Nexus v11.0 Actif</span>
            <span className="text-[5px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Liaison SHA-512</span>
          </div>
          <div className="h-4 w-px bg-white/10 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-1">
            <Wifi className="w-2.5 h-2.5 text-kls-cyan" />
            <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Connecté</span>
          </div>
        </div>
        <div className="bg-kls-cyan/10 px-2 py-0.5 rounded-lg border border-kls-cyan/20">
           <span className="text-[7px] font-black text-kls-cyan uppercase tracking-widest">Flux Neural Elite</span>
        </div>
      </div>

      {/* DISPLAY PRÉDICTION - COMPACT */}
      <div className="w-full glass-card p-5 rounded-[2rem] border-emerald-500/20 bg-black/40 flex flex-col lg:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-xl animate-scale-in">
         <div className="flex flex-col md:flex-row items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-md">
              <Gauge className="w-8 h-8 text-emerald-500" />
            </div>
            <div className="text-center md:text-left">
               <h4 className="text-[7px] font-black text-slate-500 uppercase tracking-[0.3em] mb-0.5">SIGNAL RÉCENT DÉTECTÉ</h4>
               <p className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none flex items-baseline justify-center md:justify-start">
                {lastPrediction ? (
                  <>
                    <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)] font-mono">
                      {lastPrediction.results.res1.multiplier}
                    </span>
                    <span className="text-xl sm:text-2xl md:text-3xl ml-1.5 text-slate-700 italic font-black">x</span>
                  </>
                ) : (
                  <span className="text-slate-800 tracking-widest font-mono">0.00x</span>
                )}
               </p>
            </div>
         </div>
         <div className="flex flex-col items-center lg:items-end gap-2 relative z-10">
            <div className="flex flex-col items-center lg:items-end">
               <div className="bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 mb-1">
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Confiance : {lastPrediction ? lastPrediction.results.res1.confidence : "0"}%</span>
               </div>
               <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: lastPrediction ? `${lastPrediction.results.res1.confidence}%` : '0%' }}></div>
               </div>
            </div>
            <div className="flex items-center gap-1">
               <ShieldCheck className="w-3 h-3 text-slate-500" />
               <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic">{lastPrediction ? lastPrediction.results.res1.label : "En attente de flux"}</span>
            </div>
         </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MODULE PREDICTOR DE FLUX NEURAL */}
        <div className="relative group cursor-pointer w-full" onClick={() => onNavigate('screenshot')}>
          <div className="glass-card h-full rounded-[1.75rem] border-white/5 p-6 relative overflow-hidden flex flex-col justify-between hover:border-kls-orange/30 transition-all bg-black/60 shadow-lg min-h-[220px] active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
              <Zap className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-kls-orange rounded-xl mb-4 shadow-md">
                <Zap className="w-3 h-3 text-white" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Standard Core</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-2">Predictor de <br/><span className="text-kls-orange">Flux Neural</span></h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest max-w-[180px]">Moteur prédictif basé sur l'analyse de flux séquentiel.</p>
            </div>
            <div className="flex items-center justify-between relative z-10 pt-4">
               <div className="flex items-center gap-1 text-kls-orange font-black text-[7px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Accéder au Predictor <ChevronRight className="w-3 h-3" />
               </div>
               <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-slate-700">
                 <ArrowUpRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        </div>

        {/* MODULE MOTEUR ALGORITHMIQUE SEED */}
        <div className="relative group cursor-pointer w-full" onClick={() => onNavigate('direct_analysis')}>
          <div className="glass-card h-full rounded-[1.75rem] border-emerald-500/10 p-6 relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/30 transition-all bg-emerald-500/5 shadow-lg min-h-[220px] active:scale-[0.98]">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
              <Cpu className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 rounded-xl mb-4 shadow-md">
                <BrainCircuit className="w-3 h-3 text-white" />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">Quantum Engine</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-2">Moteur <br/><span className="text-emerald-400">Algorithmique Seed</span></h2>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest max-w-[180px]">Calcul déterministe par décimales de l'image de référence.</p>
            </div>
            <div className="flex items-center justify-between relative z-10 pt-4">
               <div className="flex items-center gap-1 text-emerald-500 font-black text-[7px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  Lancer le Moteur <ChevronRight className="w-3 h-3" />
               </div>
               <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-slate-700 shadow-md">
                 <ArrowUpRight className="w-4 h-4" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full pt-1">
         <button onClick={handleLaunchGame} className="w-full h-12 bg-kls-cyan text-black rounded-[1.5rem] flex items-center justify-center gap-3 text-[9px] font-black uppercase shadow-xl hover:bg-kls-cyan/90 transition-all group">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{activePlatform ? `LANCER ${activePlatform.name}` : 'SYNCHRONISER PLATEFORME'}</span>
         </button>
      </div>
    </div>
  );
};

export default HomeView;
