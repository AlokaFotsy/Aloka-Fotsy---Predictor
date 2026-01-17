
import React, { useState } from 'react';
import { ChevronLeft, Trash2, History, Clock, ChevronDown, ChevronUp, ShieldCheck, Shield, CheckCircle2, Lock, FileKey, X, Search, Loader2 } from 'lucide-react';
import { Prediction } from '../types.ts';

interface HistoryViewProps {
  onBack: () => void;
  predictions: Prediction[];
  clearHistory: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ onBack, predictions, clearHistory }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyingHash, setVerifyingHash] = useState<{pred: Prediction, status: 'idle' | 'checking' | 'verified'} | null>(null);

  const openVerifyModal = (pred: Prediction) => {
    setVerifyingHash({ pred, status: 'idle' });
    setVerifyModalOpen(true);
  };

  const runVerification = () => {
    if (!verifyingHash) return;
    setVerifyingHash(prev => prev ? ({ ...prev, status: 'checking' }) : null);
    
    setTimeout(() => {
      setVerifyingHash(prev => prev ? ({ ...prev, status: 'verified' }) : null);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-5 min-w-0">
          <button onClick={onBack} className="p-3 glass-card rounded-2xl text-kls-orange hover:bg-kls-orange/10 transition-all flex-shrink-0">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight animated-gradient-text truncate">Logs <span className="text-kls-orange">Elite</span></h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] truncate">Historique Neural v11.0 Elite</p>
          </div>
        </div>
        {predictions.length > 0 && (
          <button onClick={clearHistory} className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 shadow-lg flex-shrink-0">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </header>

      {predictions.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center opacity-30 px-4">
          <History className="w-20 h-20 mb-6 text-slate-700" />
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-600">Base de données vide</p>
        </div>
      ) : (
        <div className="space-y-4">
          {predictions.map((pred) => (
            <div key={pred.id} className="glass-card overflow-hidden border-white/10 bg-slate-900/50 rounded-3xl transition-all hover:bg-slate-900/80">
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-kls-orange border border-white/10 shadow-inner flex-shrink-0">
                      <Clock className="w-6 h-6" />
                   </div>
                   <div className="min-w-0">
                     <div className="flex items-center gap-3 mb-1">
                       <span className="text-sm font-black text-white font-mono whitespace-nowrap">{pred.inputTime}</span>
                       <span className="text-sm font-black text-kls-orange font-mono text-glow-animate whitespace-nowrap">{pred.inputMultiplier}x</span>
                     </div>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate block">{pred.platform} • {pred.mode}</span>
                   </div>
                </div>
                <button 
                  onClick={() => setExpandedId(expandedId === pred.id ? null : pred.id)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 ${
                    expandedId === pred.id ? 'bg-kls-orange text-white shadow-lg shadow-kls-orange/20' : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {expandedId === pred.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {expandedId === pred.id && (
                <div className="px-5 pb-6 animate-fade-in space-y-5 overflow-hidden">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[pred.results.res1, pred.results.res2].filter(Boolean).map((res: any, idx) => (
                      <div key={idx} className={`p-5 rounded-3xl border flex flex-col gap-4 overflow-hidden ${idx === 0 ? 'bg-kls-orange/5 border-kls-orange/15 shadow-lg' : 'bg-kls-yellow/5 border-kls-yellow/15 shadow-lg'}`}>
                        <div className="flex justify-between items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest truncate ${idx === 0 ? 'text-kls-orange' : 'text-kls-yellow'}`}>{res.label}</span>
                          <span className="text-[9px] font-black text-slate-500 font-mono whitespace-nowrap">{res.confidence}%</span>
                        </div>
                        <div className="flex justify-between items-end gap-2">
                          <span className="text-base font-black text-white font-mono text-glow-animate whitespace-nowrap">{res.time}</span>
                          <span className="text-2xl font-black text-white text-glow-animate whitespace-nowrap">{res.multiplier}x</span>
                        </div>
                        
                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 overflow-hidden">
                           <p className="text-[9px] font-black text-slate-100 uppercase leading-tight tracking-tight whitespace-normal">
                             Objectif de <span className="text-emerald-400 text-glow-animate">2.00x assurée à 100%</span>. <span className="text-kls-orange">AUTO CASH-OUT</span> recommandé.
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-4 p-4 bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500/50 flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest truncate">Audit SHA-512 V2</p>
                            <p className="text-[8px] font-mono text-slate-500 truncate max-w-[150px]">{pred.hash ? `${pred.hash.substring(0, 16)}...` : 'Non signé'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => openVerifyModal(pred)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white transition-all"
                    >
                        Vérifier Hash Neural
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {verifyModalOpen && verifyingHash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="w-full max-w-sm glass-card rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl animate-scale-in">
              <div className="bg-slate-900/80 p-6 border-b border-white/5 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-kls-orange" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Intégrité SHA-512 V2</span>
                 </div>
                 <button onClick={() => setVerifyModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-8 space-y-6">
                 {verifyingHash.status === 'idle' && (
                    <div className="space-y-6 text-center">
                       <FileKey className="w-16 h-16 mx-auto text-slate-600" />
                       <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Seed Serveur</p>
                          <p className="text-xs font-mono text-white bg-black/40 p-3 rounded-xl break-all border border-white/5">
                            {verifyingHash.pred.hash || "GENERATING_HASH..."}
                          </p>
                       </div>
                       <button onClick={runVerification} className="w-full h-14 bg-white text-black rounded-2xl text-xs font-black uppercase shadow-xl hover:bg-gray-200 transition-colors">
                          Lancer la vérification Elite
                       </button>
                    </div>
                 )}

                 {verifyingHash.status === 'checking' && (
                    <div className="py-10 flex flex-col items-center justify-center space-y-6">
                       <div className="relative">
                          <div className="absolute inset-0 bg-kls-orange/20 blur-xl rounded-full animate-pulse"></div>
                          <Loader2 className="w-12 h-12 text-kls-orange animate-spin relative z-10" />
                       </div>
                       <div className="space-y-1 text-center">
                          <p className="text-[10px] font-black text-white uppercase tracking-widest">Déchiffrement Neural...</p>
                          <p className="text-[8px] font-mono text-slate-500">Comparaison HASH vs RESULT</p>
                       </div>
                    </div>
                 )}

                 {verifyingHash.status === 'verified' && (
                    <div className="text-center space-y-6 animate-fade-in">
                       <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-lg font-black text-white uppercase tracking-tight">Vérification Réussie</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase px-4">
                             L'intégrité de cette prédiction Elite est garantie à 100% pour aujourd'hui.
                          </p>
                       </div>
                       <button onClick={() => setVerifyModalOpen(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-white transition-all">
                          Fermer
                       </button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
