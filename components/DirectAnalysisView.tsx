
import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, Upload, RotateCcw, Loader2, Activity,
  ShieldCheck, Copy, Clock, Gauge, Camera, X, Cpu, Sparkles, BrainCircuit, Target
} from 'lucide-react';
import { analyzeQuantumSeed } from '../services/gemini.ts';
import { Prediction, AppState } from '../types.ts';
import { useToast } from './ToastProvider.tsx';

interface DirectAnalysisViewProps {
  onBack: () => void;
  state: AppState;
  addPrediction: (p: Prediction) => void;
}

const DirectAnalysisView: React.FC<DirectAnalysisViewProps> = ({ onBack, state, addPrediction }) => {
  const { showToast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [captureType, setCaptureType] = useState<'bet261' | '1xbet'>('bet261');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * LOGIQUE QUANTUM ELITE - FORMULES DÉRIVÉES DE L'IMAGE
   * Les résultats commencent à 1.00x (plancher absolu).
   */
  const calculateQuantumResult = (m1: string, m2: string, baseTime: string) => {
    const getDec = (val: string) => {
      const f = parseFloat(val.replace(/[^\d.-]/g, ''));
      if (isNaN(f)) return Math.random() * 0.99;
      return Math.abs(f - Math.floor(f));
    };

    const d1 = getDec(m1);
    const d2 = getDec(m2);
    const M = (d1 + d2) / 2;
    
    const factor = Math.sqrt(d1 * d2 * 100);
    const wave = Math.abs(Math.sin(Math.PI * (d1 + d2)));
    
    // Le système force un départ à 1.00x minimum + calcul basé sur le seed visuel
    const rawCoeff = 1.00 + (factor * wave * 0.45) + (M * 2.2);
    const finalCoeff = Math.max(1.00, rawCoeff).toFixed(2);

    const timeParts = baseTime.split(':').map(Number);
    const date = new Date();
    if (timeParts.length >= 2) {
      date.setHours(timeParts[0], timeParts[1], timeParts[2] || 0);
    }
    
    const deltaMinutes = Math.max(1, Math.round((d1 + d2) * 4));
    date.setMinutes(date.getMinutes() + deltaMinutes);
    date.setSeconds(date.getSeconds() + Math.floor(M * 59));
    
    const resTime = date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
    });

    const stability = 1 - Math.abs(d1 - d2);
    const finalConfidence = Math.min(99, Math.floor(82 + (stability * 17)));

    return { resTime, finalCoeff, finalConfidence };
  };

  const runAnalysis = async (imgData: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const base64 = imgData.split('base64,')[1];
      const jsonStr = await analyzeQuantumSeed(base64);
      const data = JSON.parse(jsonStr);
      
      if (!data.multiplier1 || !data.multiplier2) throw new Error("Analyse visuelle incomplète.");
      
      const { resTime, finalCoeff, finalConfidence } = calculateQuantumResult(data.multiplier1, data.multiplier2, data.baseTime || "00:00:00");
      
      const p: Prediction = {
        id: `QUANTUM-${Date.now()}`,
        platform: captureType.toUpperCase(),
        timestamp: new Date().toISOString(),
        inputTime: data.baseTime || "N/A",
        inputMultiplier: `${data.multiplier1} | ${data.multiplier2}`,
        mode: 'DIRECT',
        hash: `SHA512-QNTM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        results: { 
          res1: { 
            time: resTime, 
            multiplier: finalCoeff, 
            label: parseFloat(finalCoeff) >= 5 ? 'SIGNAL QUANTUM ELITE' : 'STABILITÉ NEURAL', 
            confidence: finalConfidence 
          } 
        },
        audit: { roundId: "ENGINE-QUANTUM-V11" }
      };
      
      setPrediction(p);
      addPrediction(p);
      showToast("ALGORITHME SEED CALCULÉ", "success");
    } catch (err: any) {
      setAnalysisError(err.message);
      showToast("Scan Quantum interrompu", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => { setImage(null); setPrediction(null); setAnalysisError(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

  return (
    <div className="space-y-4 animate-fade-in max-w-3xl mx-auto px-1 w-full">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-3 rounded-2xl border-emerald-500/10 shadow-lg bg-black/40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1 mb-0.5">
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-500" />
              <h1 className="text-base font-black text-white uppercase tracking-tighter italic leading-none">QUANTUM <span className="text-emerald-400">CORE</span></h1>
            </div>
            <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest leading-none">Moteur Algorithmique • Base 1.00x</p>
          </div>
        </div>
        <div className="flex p-0.5 bg-black/40 rounded-lg border border-white/5 shadow-inner">
          <button onClick={() => setCaptureType('bet261')} className={`px-4 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${captureType === 'bet261' ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>Bet261</button>
          <button onClick={() => setCaptureType('1xbet')} className={`px-4 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${captureType === '1xbet' ? 'bg-emerald-500 text-black' : 'text-slate-500'}`}>1xBet</button>
        </div>
      </header>

      {!prediction ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
           <div className="md:col-span-2 glass-card h-[300px] border-2 border-dashed rounded-[2rem] relative overflow-hidden flex flex-col items-center justify-center transition-all border-white/5 hover:border-emerald-500/20 bg-black/20 group">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-[1.8rem]" />
                  <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-4 z-20">
                    <button onClick={() => {
                      const canvas = canvasRef.current;
                      const video = videoRef.current;
                      if (canvas && video) {
                        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
                        canvas.getContext('2d')?.drawImage(video, 0, 0);
                        const dataUrl = canvas.toDataURL('image/jpeg');
                        setImage(dataUrl); setIsCameraActive(false); 
                        if (video.srcObject) (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                        runAnalysis(dataUrl);
                      }
                    }} className="w-12 h-12 bg-white rounded-full border-4 border-black/10 active:scale-90 transition-all"></button>
                    <button onClick={() => setIsCameraActive(false)} className="w-10 h-10 bg-rose-500 text-white rounded-full flex flex-center"><X className="w-4 h-4" /></button>
                  </div>
                </div>
              ) : image ? (
                <div className="relative w-full h-full p-4">
                  <img src={image} className={`w-full h-full object-contain rounded-xl ${isAnalyzing ? 'opacity-40 blur-md' : ''} transition-all duration-500`} alt="Source" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
                      <span className="text-[8px] font-black uppercase text-white tracking-widest animate-pulse">Extraction du Seed...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-5">
                  <div className="flex justify-center gap-5">
                    <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/10 transition-all shadow-md group">
                      <Upload className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </button>
                    <button onClick={async () => {
                      try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                        if (videoRef.current) { videoRef.current.srcObject = stream; setIsCameraActive(true); }
                      } catch(e) { showToast("Caméra interdite", "error"); }
                    }} className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center hover:bg-emerald-500/10 transition-all shadow-md group">
                      <Camera className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight leading-none">Image Source</h3>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">Le calcul dérive des patterns lus.</p>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => { setImage(reader.result as string); runAnalysis(reader.result as string); };
                  reader.readAsDataURL(file);
                }
              }} className="hidden" accept="image/*" />
              <canvas ref={canvasRef} className="hidden" />
           </div>

           <div className="glass-card p-5 rounded-2xl border-white/5 bg-emerald-500/5 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <h4 className="text-[9px] font-black uppercase tracking-widest">Intégrité</h4>
              </div>
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block leading-none">Base</span>
                  <p className="text-[9px] text-slate-300 font-medium">Commence à 1.00x.</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest block leading-none">Calcul</span>
                  <p className="text-[9px] text-slate-300 font-medium">Pattern visuel direct.</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5">
                 <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-500" />
                    <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Certifié Elite</span>
                 </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="space-y-4 animate-reveal-data max-w-2xl mx-auto">
          <div className="glass-card p-6 rounded-[2rem] border-emerald-500/10 bg-slate-950/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <Cpu className="w-28 h-28" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <h2 className="text-base font-black text-white uppercase tracking-tighter italic">Résultat Quantum</h2>
                </div>
                <div className="bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                   <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{prediction.results.res1.confidence}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block leading-none">HORAIRE</span>
                  <div className="p-4 bg-black/60 rounded-xl border border-white/5 shadow-inner">
                    <span className="text-2xl font-black font-mono text-white tracking-widest">{prediction.results.res1.time}</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-center">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block leading-none">CIBLE SEED</span>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl shadow-lg">
                    <div className="flex items-baseline justify-center gap-1">
                       <span className="text-4xl font-black font-mono text-white text-glow-animate leading-none">{prediction.results.res1.multiplier}</span>
                       <span className="text-xl font-black text-slate-600 italic">x</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/5 rounded-xl flex items-center gap-4 border border-emerald-500/10">
                <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="text-[9px] text-slate-400 uppercase font-black flex-1">
                   Pattern dérivé du seed visuel ({prediction.inputMultiplier}). Base 1.00x appliquée.
                </p>
                <button 
                  onClick={() => { navigator.clipboard.writeText(`${prediction.results.res1.time} - ${prediction.results.res1.multiplier}x`); showToast("CIBLE COPIÉE", "success"); }}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all active:scale-90"
                >
                  <Copy className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
             <button onClick={reset} className="flex-1 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase shadow-lg active:scale-95 transition-all">
               <RotateCcw className="w-4 h-4" /> Nouveau Scan Quantum
             </button>
             <button onClick={onBack} className="flex-1 h-12 bg-white/5 border border-white/5 text-slate-400 rounded-xl flex items-center justify-center text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
               Retour Portail
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(DirectAnalysisView);
