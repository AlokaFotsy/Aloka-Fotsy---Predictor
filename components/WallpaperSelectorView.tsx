
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Upload, CheckCircle2, Trash2, Image as ImageIcon, Loader2, Video } from 'lucide-react';
import { useToast } from './ToastProvider.tsx';

interface WallpaperSelectorViewProps {
  onBack: () => void;
  onSelect: (wallpaper: string | null) => void;
  currentWallpaper: string | null;
  isFirstLaunch?: boolean;
}

const WallpaperSelectorView: React.FC<WallpaperSelectorViewProps> = ({ onBack, onSelect, currentWallpaper, isFirstLaunch }) => {
  const { showToast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isVideoFile = (data: string | null) => {
    if (!data) return false;
    return data.includes('video') || data.startsWith('data:video') || data.endsWith('.mp4') || data.endsWith('.webm');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      showToast("Format non supporté (Images et Vidéos uniquement).", "error");
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB Soft Limit
        showToast("Le fichier est volumineux. Le chargement peut prendre quelques instants.", "warning");
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setIsProcessing(false);
      showToast(file.type.startsWith('video/') ? "Fond Vidéo Chargé" : "Fond Image Chargé", "success");
    };
    reader.onerror = () => {
      setIsProcessing(false);
      showToast("Erreur de lecture du média.", "error");
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    onSelect(preview || currentWallpaper);
    showToast("FOND D'ÉCRAN APPLIQUÉ", "success");
    if (!isFirstLaunch) onBack();
  };

  const currentMedia = preview || currentWallpaper;
  const isCurrentlyVideo = isVideoFile(currentMedia);

  useEffect(() => {
    if (videoRef.current && isCurrentlyVideo) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        if (videoRef.current) videoRef.current.muted = true;
      });
    }
  }, [currentMedia, isCurrentlyVideo]);

  return (
    <div className={`h-full w-full flex flex-col items-center justify-center p-6 ${isFirstLaunch ? 'animate-fade-in' : ''}`}>
      <div className="w-full max-w-2xl glass-card rounded-[4rem] p-12 space-y-10 relative overflow-hidden border border-white/10 shadow-2xl bg-slate-950/60 backdrop-blur-2xl">
        <div className="text-center space-y-4 mb-4">
           <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto border border-white/10 shadow-inner">
             <ImageIcon className="w-8 h-8 text-kls-cyan" />
           </div>
           <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
             {isFirstLaunch ? "Moteur Visuel" : "Changer l'Arrière-plan"}
           </h1>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.4em] leading-relaxed">
             Support Universel : Vidéos avec Audio & Images
           </p>
        </div>
        
        {!isFirstLaunch && (
          <button onClick={onBack} className="absolute top-12 left-12 p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-all border border-white/5 shadow-xl">
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        <div 
          className={`relative h-96 w-full rounded-[3.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer group ${currentMedia ? 'border-kls-cyan bg-black/40' : 'border-white/10 hover:border-kls-cyan/50 hover:bg-white/5'}`}
          onClick={() => fileInputRef.current?.click()}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-8">
               <Loader2 className="w-20 h-20 animate-spin text-kls-cyan" />
               <span className="text-xs font-black uppercase text-kls-cyan animate-pulse tracking-widest">Initialisation...</span>
            </div>
          ) : currentMedia ? (
            <>
              {isCurrentlyVideo ? (
                <video ref={videoRef} src={currentMedia!} autoPlay loop muted={false} playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={currentMedia!} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Preview" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                 <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-2xl scale-90 group-hover:scale-100 transition-transform flex flex-col items-center gap-3">
                    {isCurrentlyVideo ? <Video className="w-12 h-12 text-white" /> : <ImageIcon className="w-12 h-12 text-white" />}
                    <span className="block text-[10px] font-black text-white uppercase tracking-widest">Parcourir les fichiers</span>
                 </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-8">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mx-auto border border-white/10 group-hover:bg-kls-cyan/10 group-hover:border-kls-cyan/30 transition-all shadow-inner">
                <Upload className="w-12 h-12 text-slate-500 group-hover:text-kls-cyan" />
              </div>
              <div className="space-y-3">
                 <span className="block text-sm font-black uppercase text-slate-300 tracking-widest">Définir l'Ambiance Nexus</span>
                 <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-tight">MP4, WEBM, JPG, PNG acceptés</span>
              </div>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            className="hidden" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button 
            onClick={handleConfirm}
            disabled={!currentMedia}
            className="h-20 bg-white text-black font-black rounded-[2rem] uppercase text-xs shadow-2xl transition-all active:scale-95 hover:bg-gray-100 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            <CheckCircle2 className="w-6 h-6" />
            Appliquer Immédiatement
          </button>
          
          <button 
            onClick={() => { setPreview(null); onSelect(null); if (!isFirstLaunch) onBack(); }}
            className="h-20 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black rounded-[2rem] uppercase text-xs hover:bg-rose-500/20 transition-all flex items-center justify-center gap-4 shadow-xl"
          >
            <Trash2 className="w-6 h-6" />
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default WallpaperSelectorView;
