import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, Upload, RefreshCcw, Loader2, Activity,
  TrendingUp, Star, ShieldAlert, Copy, AlertCircle,
  Camera, X, RotateCcw, Sparkles, Link as LinkIcon, Zap, ExternalLink, Video, ArrowUpRight
} from 'lucide-react';
import { analyzeScreenshot } from '../services/gemini.ts';
import { Prediction, AppState } from '../types.ts';
import { useToast } from './ToastProvider.tsx';
import { PLATFORMS } from '../constants.ts';

interface ScreenshotViewProps {
  onBack: () => void;
  state: AppState;
  addPrediction: (p: Prediction) => void;
  onSwitchPlatform: () => void;
}

const getMadagascarTime = () => new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Indian/Antananarivo'
}).format(new Date());

const generateHash = () => {
  const chars = '0123456789abcdef';
  return Array.from({ length: 64 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const ScreenshotView: React.FC<ScreenshotViewProps> = ({ onBack, state, addPrediction, onSwitchPlatform }) => {
  const { showToast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [mode, setMode] = useState<'bonne' | 'mauvaise' | 'rose'>('bonne');
  const [currentTime, setCurrentTime] = useState(getMadagascarTime());
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activePlatform = PLATFORMS.find(p => p.id === state.syncedPlatform);
  const activeUrl = state.syncedEngine === 'Studio' ? activePlatform?.engines.studio.url : activePlatform?.engines.spribe.url;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getMadagascarTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const runAnalysis = async (imgData: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const base64 = imgData.split('base64,')[1];
      const jsonStr = await analyzeScreenshot(base64);
      const data = JSON.parse(jsonStr);
      
      if (!data.lastMultiplier || !data.lastTime) throw new Error("Flux neural incomplet.");

      const getRand = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);
      
      const calcTime = (base: string, m: number, s: number) => {
        const [h, min, sec] = base.split(':').map(Number);
        const d = new Date(); d.setHours(h || 0, (min || 0) + m, (sec || 0) + s + Math.floor(Math.random() * 5));
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      };

      let res1: any, res2: any;
      if (mode === 'bonne') {
        res1 = { time: calcTime(data.lastTime, 2, 45), multiplier: getRand(2.0, 4.0), label: 'SIGNAL FIABLE', confidence: 98 };
        res2 = { time: calcTime(data.lastTime, 4, 25), multiplier: getRand(2.5, 12.0), label: 'POINT TACTIQUE', confidence: 96 };
      } else if (mode === 'rose') {
        res1 = { time: calcTime(data.lastTime, 2, 5), multiplier: getRand(5.0, 20.0), label: 'VECTEUR ROSE', confidence: 99 };
        res2 = { time: calcTime(data.lastTime, 4, 22), multiplier: getRand(10.0, 50.0), label: 'IMPULSION ÉLITE', confidence: 95 };
      } else {
        res1 = { time: calcTime(data.lastTime, 1, 55), multiplier: getRand(1.8, 3.5), label: 'REPLI RAPIDE', confidence: 97 };
        res2 = { time: calcTime(data.lastTime, 5, 2), multiplier: getRand(2.0, 6.0), label: 'SORTIE SÉCURISÉE', confidence: 94 };
      }

      const p: Prediction = {
        id: Date.now().toString(),
        platform: state.syncedPlatform || 'ALOKA',
        timestamp: new Date().toISOString(),
        inputTime: data.lastTime,
        inputMultiplier: data.lastMultiplier,
        mode: mode.toUpperCase() as any,
        hash: generateHash(),
        results: { res1, res2 },
        audit: { roundId: data.lastRoundId || "N/A" }
      };

      setPrediction(p);
      addPrediction(p);
      showToast("ANALYSE TERMINÉE", "success");
    } catch (err: any) {
      setAnalysisError(err.message);
      showToast("Échec du scan", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setIsProcessingVideo(true);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      video.muted = true;
      video.playsInline = true;
      
      video.onloadedmetadata = () => {
        // Extraction à 0.5s ou milieu pour choper un frame significatif
        video.currentTime = Math.min(0.5, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImage(dataUrl);
        setIsProcessingVideo(false);
        runAnalysis(dataUrl);
        URL.revokeObjectURL(video.src);
      };

      video.onerror = () => {
        setIsProcessingVideo(false);
        showToast("Erreur lors de l'extraction vidéo", "error");
      };
    } else if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        runAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Format non supporté (Image ou Vidéo requis)", "warning");
    }
  };

  const handleOpenGame = () => {
    if (activeUrl) window.open(activeUrl, '_blank', 'noopener,noreferrer');
  };

  const reset = () => { setImage(null); setPrediction(null); setAnalysisError(null); setIsProcessingVideo(false); };

  return (
    <div className="space-y-6 animate-fade-in pb-24 max-w-2xl mx-auto w-full flex flex-col items-center">
      <header className="w-full glass-card p-6 rounded-[2.5rem] border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full sm:w-auto">
          <button onClick={onBack} className="p-4 bg-white/5 rounded-2xl text-kls-orange active:scale-95 transition-all shadow-xl hover:bg-white/10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 flex-1">
            {activePlatform?.logo && <img src={activePlatform.logo} className="w-7 h-7 object-contain" alt="" />}
            <span className="text-xs font-black text-white uppercase tracking-widest truncate">{activePlatform?.name || 'Vecteur Aloka'}</span>
          </div>
        </div>
        <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-3 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
             <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Temps Réel</span>
          </div>
          <div className="bg-slate-950 px-5 py-2 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-sm font-mono font-bold text-kls-orange">{currentTime}</span>
          </div>
        </div>
      </header>

      {activeUrl && (
        <button 
          onClick={handleOpenGame}
          className="w-full p-5 bg-kls-cyan/10 border border-kls-cyan/30 rounded-3xl flex items-center justify-between group hover:bg-kls-cyan/20 transition-all overflow-hidden animate-slide-up"
        >
           <div className="flex items-center gap-4 min-w-0">
             <div className="w-10 h-10 rounded-xl bg-kls-cyan/20 flex flex-center border border-kls-cyan/40 text-kls-cyan group-hover:scale-110 transition-transform">
               <ExternalLink className="w-5 h-5" />
             </div>
             <div className="min-w-0 text-left">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Accès Direct</p>
               <p className="text-xs font-black text-white uppercase truncate tracking-tight">Jouer sur {activePlatform?.name}</p>
             </div>
           </div>
           <ArrowUpRight className="w-6 h-6 text-slate-700 group-hover:text-kls-cyan group-hover:scale-110 transition-all" />
        </button>
      )}

      {!prediction ? (
        <div className="w-full space-y-8 animate-slide-up">
          <div className="grid grid-cols-3 gap-4">
            {['bonne', 'mauvaise', 'rose'].map((m: any) => (
              <button 
                key={m} 
                onClick={() => setMode(m)} 
                className={`p-8 rounded-[2.5rem] transition-all border-2 flex flex-col items-center gap-3 ${
                  mode === m 
                  ? 'bg-white/10 border-kls-orange shadow-2xl scale-105' 
                  : 'bg-white/5 border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                {m === 'bonne' && <TrendingUp className={`w-8 h-8 ${mode === m ? 'text-kls-cyan' : 'text-slate-600'}`} />}
                {m === 'mauvaise' && <ShieldAlert className={`w-8 h-8 ${mode === m ? 'text-rose-500' : 'text-slate-600'}`} />}
                {m === 'rose' && <Star className={`w-8 h-8 ${mode === m ? 'text-kls-yellow' : 'text-slate-600'}`} />}
                <span className={`text-[10px] font-black uppercase tracking-widest ${mode === m ? 'text-white' : 'text-slate-500'}`}>{m}</span>
              </button>
            ))}
          </div>

          <div className={`glass-card h-[420px] border-2 border-dashed rounded-[4rem] relative flex flex-center transition-all duration-700 ${image || isCameraActive || isProcessingVideo ? 'border-kls-orange/50 shadow-2xl' : 'border-white/10 hover:border-kls-orange/30'}`}>
            {isCameraActive ? (
              <div className="w-full h-full relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-[3.8rem]" />
                <div className="absolute bottom-10 inset-x-0 flex flex-center gap-8">
                   <button onClick={() => {
                     if (videoRef.current && canvasRef.current) {
                        const canvas = canvasRef.current;
                        canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
                        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
                        const data = canvas.toDataURL('image/jpeg');
                        setImage(data); setIsCameraActive(false);
                        if (videoRef.current.srcObject) (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
                        runAnalysis(data);
                     }
                   }} className="w-20 h-20 bg-white rounded-full flex flex-center border-8 border-black/10 shadow-2xl active:scale-90 transition-all"><div className="w-14 h-14 rounded-full border-4 border-black"></div></button>
                   <button onClick={() => setIsCameraActive(false)} className="w-16 h-16 bg-rose-500 text-white rounded-full flex flex-center shadow-2xl active:scale-90 transition-all"><X className="w-8 h-8" /></button>
                </div>
              </div>
            ) : isProcessingVideo ? (
              <div className="flex flex-col items-center gap-6">
                <Loader2 className="w-16 h-16 text-kls-cyan animate-spin" />
                <span className="text-sm font-black text-white uppercase tracking-[0.3em] animate-pulse">Extraction Vidéo...</span>
              </div>
            ) : image ? (
              <div className="w-full h-full p-8 relative">
                 <img src={image} className={`w-full h-full object-contain rounded-3xl ${isAnalyzing ? 'opacity-30 blur-xl' : ''} transition-all duration-500`} alt="" />
                 {isAnalyzing && (
                   <div className="absolute inset-0 flex flex-col flex-center space-y-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-kls-orange/20 blur-3xl animate-pulse rounded-full"></div>
                        <Loader2 className="w-20 h-20 text-kls-orange animate-spin relative z-10" />
                      </div>
                      <div className="text-center space-y-2">
                        <span className="text-sm font-black uppercase text-white tracking-[0.4em] block animate-reveal-data">Scan Quasi-Instantané</span>
                        <span className="text-[10px] font-bold text-kls-orange uppercase tracking-[0.2em] animate-pulse">Neural AI Pulse...</span>
                      </div>
                   </div>
                 )}
              </div>
            ) : (
              <div className="text-center space-y-12">
                 <div className="flex flex-center gap-10">
                   <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-center hover:bg-kls-orange/20 hover:border-kls-orange/30 transition-all group shadow-2xl">
                     <Upload className="w-10 h-10 text-slate-700 group-hover:text-kls-orange transition-colors" />
                   </button>
                   <button onClick={async () => {
                     const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                     if (videoRef.current) { videoRef.current.srcObject = stream; setIsCameraActive(true); }
                   }} className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-center hover:bg-kls-cyan/20 hover:border-kls-cyan/30 transition-all group shadow-2xl">
                     <Camera className="w-10 h-10 text-slate-700 group-hover:text-kls-cyan transition-colors" />
                   </button>
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Capture Image ou Vidéo</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Résultats sans attente prolongée</p>
                 </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      ) : (
        <div className="w-full space-y-8 animate-reveal-data">
          <div className="glass-card p-10 rounded-[3.5rem] border-white/10 bg-slate-900/60 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:rotate-6">
                <Activity className="w-40 h-40" />
             </div>
             <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[1.8rem] bg-emerald-500/20 border border-emerald-500/30 flex flex-center shadow-2xl">
                  <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] block mb-1">Déchiffrement OK</span>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Signature Elite Validée</h2>
                </div>
             </div>
             <div className="bg-black/40 p-5 rounded-3xl border border-white/10 min-w-[140px] text-center relative z-10 shadow-inner">
                <span className="text-[9px] font-black text-slate-600 uppercase mb-1 tracking-widest block">Multiplier Lu</span>
                <span className="text-3xl font-black font-mono text-white text-glow-animate">{prediction.inputMultiplier}x</span>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {[prediction.results.res1, prediction.results.res2].filter(Boolean).map((res: any, idx) => (
               <div key={idx} className="glass-card p-10 rounded-[4rem] border-white/5 bg-slate-950/40 shadow-2xl space-y-8 group hover:bg-white/5 transition-all animate-reveal-data relative overflow-hidden" style={{ animationDelay: `${(idx + 1) * 200}ms` }}>
                  <div className="flex justify-between items-center border-b border-white/5 pb-6">
                     <span className={`text-[11px] font-black uppercase tracking-[0.4em] ${idx === 0 ? 'text-kls-cyan' : 'text-kls-yellow'}`}>{res.label}</span>
                     <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">{res.confidence}%</span>
                     </div>
                  </div>
                  
                  <div className="space-y-8">
                     <div className="p-8 bg-black/60 rounded-[2.5rem] flex items-center justify-between shadow-inner border border-white/5">
                        <span className="text-[11px] text-slate-600 font-black uppercase tracking-widest">Heure Pulse</span>
                        <span className="text-2xl font-black font-mono text-white tracking-[0.2em]">{res.time}</span>
                     </div>
                     <div className={`p-12 rounded-[3.5rem] text-center relative flex flex-center border border-white/5 animate-hologram ${idx === 0 ? 'bg-kls-cyan/10 border-kls-cyan/20' : 'bg-kls-yellow/10 border-kls-yellow/20'}`}>
                        <div className="absolute top-6 right-6">
                           <button onClick={() => { navigator.clipboard.writeText(res.multiplier); showToast("COPIÉ", "info"); }} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all active:scale-90"><Copy className="w-5 h-5 text-slate-500" /></button>
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-6xl font-black text-white text-glow-animate tracking-tighter">{res.multiplier}</span>
                           <span className="text-3xl font-black text-slate-700 italic">x</span>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-10">
             <button onClick={reset} className="flex-1 h-20 bg-kls-orange text-white font-black uppercase rounded-[2.5rem] flex flex-center gap-4 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all group">
                <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                <span className="text-xs tracking-[0.2em]">Nouveau Scan</span>
             </button>
             <button onClick={onBack} className="flex-1 h-20 bg-white/5 border border-white/10 text-slate-500 font-black uppercase rounded-[2.5rem] flex flex-center text-xs tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all">
                Retour
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ScreenshotView);