
import React, { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import { 
  Terminal, X, ShieldCheck, LogOut, LayoutGrid, Menu, Activity, Headset, Zap, Loader2,
  Fingerprint, ChevronLeft, ChevronRight, Settings, Server, CheckCircle2, Globe, Cpu,
  CreditCard, Phone, MessageSquare, Eye, EyeOff, Upload, Camera, Facebook, Send, Link as LinkIcon,
  Sparkles, Bot, PlayCircle, Volume2, VolumeX, Image as ImageIcon, Box, Star, MousePointer2, User,
  MessageCircle, BarChart3, Info, Share2, History, Key, Palette, RefreshCw
} from 'lucide-react';
import { AppState } from './types.ts';
import { PLATFORMS } from './constants.ts';
import { ToastProvider, useToast } from './components/ToastProvider.tsx';

// Lazy loading for better performance
const HomeView = lazy(() => import('./components/HomeView.tsx'));
const ScreenshotView = lazy(() => import('./components/ScreenshotView.tsx'));
const DirectAnalysisView = lazy(() => import('./components/DirectAnalysisView.tsx'));
const AssistantView = lazy(() => import('./components/AssistantView.tsx'));
const LiveChatView = lazy(() => import('./components/LiveChatView.tsx'));
const SettingsView = lazy(() => import('./components/SettingsView.tsx'));
const MethodologyView = lazy(() => import('./components/MethodologyView.tsx'));
const AboutView = lazy(() => import('./components/AboutView.tsx'));
const ProfileView = lazy(() => import('./components/ProfileView.tsx'));
const WallpaperSelectorView = lazy(() => import('./components/WallpaperSelectorView.tsx'));
const SocialMenuView = lazy(() => import('./components/SocialMenuView.tsx'));
const HistoryView = lazy(() => import('./components/HistoryView.tsx'));

const VALID_CODES = ['210405', '091224', '16088'];
const RESET_CODE = '16088';
const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop";

const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [state, setState] = useState<AppState & { isPredictorUnlocked: boolean, registeredUsers: {id: string, pass: string}[] }>(() => {
    try {
      const saved = localStorage.getItem('aloka_nexus_stable_v11');
      if (saved) return JSON.parse(saved);
    } catch (e) { 
      console.error("Session Error", e); 
      localStorage.removeItem('aloka_nexus_stable_v11');
    }
    
    return {
      isAuthenticated: false,
      isVerified: true,
      hasAcceptedWallpaper: false,
      hasSeenSubscription: false,
      usedActivationCodes: [],
      currentUser: null,
      currentView: 'home',
      syncedPlatform: null,
      syncedEngine: null,
      syncedGame: 'Aviator',
      theme: 'orange' as any,
      predictions: [],
      dashboardHistory: [],
      isPredictorUnlocked: false,
      registeredUsers: [{ id: 'ADMIN', pass: 'ALOKA2025' }],
      customWallpaper: DEFAULT_WALLPAPER,
      isLightBg: false,
      notifications: {
        eliteSignals: true,
        crashAlerts: true
      }
    };
  });

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [selectedGameType, setSelectedGameType] = useState<'spribe' | 'studio' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth States
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [regId, setRegId] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState('');
  const [activationCode, setActivationCode] = useState('');

  // Persistent storage with quota safety
  useEffect(() => {
    try {
      localStorage.setItem('aloka_nexus_stable_v11', JSON.stringify(state));
    } catch (e) {
      const stateToSave = { ...state, customWallpaper: state.customWallpaper?.startsWith('data:') ? DEFAULT_WALLPAPER : state.customWallpaper };
      localStorage.setItem('aloka_nexus_stable_v11', JSON.stringify(stateToSave));
    }
  }, [state]);

  const isVideo = useCallback((url: string | null) => {
    if (!url) return false;
    return url.includes('video') || url.startsWith('data:video') || url.endsWith('.mp4') || url.endsWith('.webm');
  }, []);

  // Wallpaper Engine Sync
  useEffect(() => {
    const syncVideo = async () => {
      if (videoRef.current && isVideo(state.customWallpaper)) {
        videoRef.current.muted = isMuted;
        try {
          await videoRef.current.play();
        } catch (err) {
          if (!isMuted) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        }
      }
    };
    syncVideo();
  }, [state.customWallpaper, isMuted, state.hasAcceptedWallpaper, state.isAuthenticated, isVideo]);

  const unlockAudio = useCallback(() => {
    if (videoRef.current && isVideo(state.customWallpaper)) {
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => {});
    }
  }, [state.customWallpaper, isMuted, isVideo]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    unlockAudio();
    const cleanId = loginId.toUpperCase().trim();
    const user = state.registeredUsers.find(u => u.id === cleanId);
    if (user && user.pass === loginPass) {
      setState(prev => ({ ...prev, isAuthenticated: true, currentUser: user.id }));
      showToast("SESSION ÉTABLIE", "success");
    } else {
      showToast("IDENTIFIANTS INVALIDES", "error");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    unlockAudio();
    const cleanCode = activationCode.trim();
    if (state.usedActivationCodes.includes(cleanCode)) {
      showToast("CODE DÉJÀ EXPLOITÉ", "error");
      return;
    }
    if (!VALID_CODES.includes(cleanCode)) {
      showToast("CODE D'ACTIVATION INCORRECT", "error");
      return;
    }
    const cleanId = regId.toUpperCase().trim();
    const newUser = { id: cleanId, pass: regPass };
    setState(prev => ({ 
      ...prev, 
      registeredUsers: [...prev.registeredUsers, newUser],
      usedActivationCodes: [...prev.usedActivationCodes, cleanCode]
    }));
    showToast("COMPTE CRÉÉ AVEC SUCCÈS", "success");
    setAuthMode('login'); 
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    unlockAudio();
    const cleanId = loginId.toUpperCase().trim();
    const userIndex = state.registeredUsers.findIndex(u => u.id === cleanId);
    
    if (userIndex === -1) {
      showToast("UTILISATEUR NON TROUVÉ", "error");
      return;
    }
    if (regPass !== confirmPass) {
      showToast("LES MOTS DE PASSE NE CORRESPONDENT PAS", "error");
      return;
    }
    if (activationCode.trim() !== RESET_CODE) {
      showToast("CODE DE SÉCURITÉ 16088 REQUIS", "error");
      return;
    }

    const updatedUsers = [...state.registeredUsers];
    updatedUsers[userIndex].pass = regPass;
    setState(prev => ({ ...prev, registeredUsers: updatedUsers }));
    showToast("MOT DE PASSE RÉINITIALISÉ", "success");
    setAuthMode('login');
  };

  const navigateTo = (view: string) => {
    setIsMobileMenuOpen(false);
    unlockAudio();
    setState(prev => ({ ...prev, currentView: view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSync = () => {
    if (!selectedPlatformId || !selectedGameType) {
      showToast("SÉLECTION INCOMPLÈTE", "warning");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setState(prev => ({
        ...prev,
        isPredictorUnlocked: true,
        syncedPlatform: selectedPlatformId,
        syncedEngine: selectedGameType === 'spribe' ? 'Spribe' : 'Studio'
      }));
      setShowSyncModal(false);
      showToast("SYNCHRONISATION TERMINÉE", "success");
      const platform = PLATFORMS.find(p => p.id === selectedPlatformId);
      if (platform) window.open(platform.url, '_blank');
    }, 2000);
  };

  const handleUpdateNotifications = (key: keyof AppState['notifications'], val: boolean) => {
    setState(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: val }
    }));
    showToast("NOTIFICATIONS MISES À JOUR", "success");
  };

  const handleUpdateCredentials = (newId: string, newPass: string) => {
    const cleanId = newId.toUpperCase().trim();
    setState(prev => ({
      ...prev,
      currentUser: cleanId,
      registeredUsers: prev.registeredUsers.map(u => 
        u.id === prev.currentUser ? { id: cleanId, pass: newPass } : u
      )
    }));
    showToast("COMPTE MIS À JOUR", "success");
  };

  const currentIsVideo = isVideo(state.customWallpaper);

  // Vue Wallpaper accessible même sans auth
  if (state.currentView === 'wallpaper' && !state.isAuthenticated) {
    return (
      <Suspense fallback={<div className="flex flex-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-kls-cyan" /></div>}>
        <WallpaperSelectorView 
          onBack={() => navigateTo('home')} 
          onSelect={w => setState(s => ({...s, customWallpaper: w}))} 
          currentWallpaper={state.customWallpaper} 
        />
      </Suspense>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden font-sans transition-colors duration-700 ${state.isLightBg ? 'light-wallpaper text-slate-900' : 'text-white bg-black'}`}>
      
      {/* BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden">
        {currentIsVideo ? (
          <video 
            ref={videoRef}
            key={state.customWallpaper}
            autoPlay loop muted={isMuted} playsInline 
            className="absolute inset-0 w-full h-full object-cover scale-[1.01]"
            src={state.customWallpaper!}
            onError={() => setState(s => ({...s, customWallpaper: DEFAULT_WALLPAPER}))}
          />
        ) : (
          <div 
            key={state.customWallpaper}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-[1.01]" 
            style={{ backgroundImage: `url(${state.customWallpaper || DEFAULT_WALLPAPER})` }} 
          />
        )}
        <div className={`absolute inset-0 ${state.isLightBg ? 'bg-white/10' : 'bg-black/35'}`} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {!state.hasAcceptedWallpaper ? (
          <div className="flex-1 flex items-center justify-center p-4">
             <WallpaperSelectorView onBack={() => {}} onSelect={w => setState(s => ({...s, customWallpaper: w, hasAcceptedWallpaper: true}))} currentWallpaper={state.customWallpaper} isFirstLaunch={true} />
          </div>
        ) : !state.hasSeenSubscription ? (
          <div className="flex-1 flex items-center justify-center p-4">
             <div className="w-full max-w-lg glass-card rounded-[3rem] p-10 space-y-8 shadow-2xl bg-black/60 text-center border-white/10 animate-scale-in">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-kls-orange/20 rounded-2xl flex items-center justify-center mx-auto border border-kls-orange/30 shadow-lg">
                    <Star className="w-8 h-8 text-kls-orange animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Accès <span className="text-kls-orange">Elite</span></h2>
                  <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Preuve d'activation obligatoire</p>
                </div>
                <button 
                  onClick={() => {
                    const waNum = "261336756185";
                    const msg = encodeURIComponent("Bonjour Mahandry, je souhaite activer mon accès Elite.");
                    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
                    setState(prev => ({ ...prev, hasSeenSubscription: true }));
                  }}
                  className="w-full h-16 bg-emerald-600 text-white font-black rounded-3xl uppercase text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-emerald-500"
                >
                  <MessageCircle className="w-6 h-6" /> Contacter Mahandry
                </button>
             </div>
          </div>
        ) : !state.isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-4 relative">
             {/* Option fond d'écran sur Login */}
             <button 
                onClick={() => navigateTo('wallpaper')}
                className="absolute top-6 right-6 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-kls-cyan hover:bg-kls-cyan/10 transition-all shadow-xl active:scale-90 flex items-center gap-3 z-50"
             >
                <Palette className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Fond d'écran</span>
             </button>

             <div className="w-full max-w-sm p-10 glass-card rounded-[3.5rem] border-white/10 shadow-2xl text-center bg-black/60 animate-scale-in">
              <div className="mb-10 space-y-3">
                 <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10 shadow-lg">
                   <Fingerprint className="w-10 h-10 text-kls-cyan" />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter text-white">ALOKA <span className="text-kls-cyan">NEXUS</span></h2>
              </div>

              <div className="space-y-6">
                {authMode !== 'forgot' && (
                  <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5">
                    <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 text-[11px] font-black uppercase rounded-xl transition-all ${authMode === 'login' ? 'bg-white text-black shadow-md' : 'text-slate-500'}`}>Connexion</button>
                    <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 text-[11px] font-black uppercase rounded-xl transition-all ${authMode === 'register' ? 'bg-white text-black shadow-md' : 'text-slate-500'}`}>Enrôler</button>
                  </div>
                )}

                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <input type="text" placeholder="UTILISATEUR" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none uppercase font-black focus:border-kls-cyan/50 text-xs" required />
                    <div className="relative">
                        <input type={showLoginPass ? "text" : "password"} placeholder="MOT DE PASSE" value={loginPass} onChange={e => setLoginPass(e.target.value)} className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none font-black focus:border-kls-cyan/50 text-xs" required />
                        <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-500">
                          {showLoginPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <button type="button" onClick={() => setAuthMode('forgot')} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors block w-full text-right pr-2">Mot de passe oublié ?</button>
                    <button type="submit" className="w-full h-16 bg-white text-black font-black rounded-3xl uppercase text-[11px] shadow-xl active:scale-95 transition-all hover:bg-gray-100">OUVRIR SESSION</button>
                  </form>
                ) : authMode === 'register' ? (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="NOUVEL ID" value={regId} onChange={e => setRegId(e.target.value)} className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none font-black uppercase focus:border-kls-cyan/50 text-xs" required />
                    <div className="relative">
                      <input type={showRegPass ? "text" : "password"} placeholder="MOT DE PASSE" value={regPass} onChange={e => setRegPass(e.target.value)} className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none font-black focus:border-kls-cyan/50 text-xs" required />
                      <button type="button" onClick={() => setShowRegPass(!showRegPass)} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-500">
                        {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <input type="text" placeholder="CODE D'ACTIVATION" value={activationCode} onChange={e => setActivationCode(e.target.value)} className="w-full h-14 px-6 bg-kls-cyan/5 border border-kls-cyan/20 rounded-2xl text-kls-cyan text-center font-black tracking-widest outline-none text-xs" required />
                    <button type="submit" className="w-full h-16 bg-kls-cyan text-black font-black rounded-3xl uppercase text-[11px] shadow-xl active:scale-95 transition-all">CRÉER LE COMPTE</button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4 animate-reveal-data">
                    <div className="flex items-center gap-3 mb-6">
                      <button type="button" onClick={() => setAuthMode('login')} className="p-2 text-slate-500 hover:text-white transition-all"><ChevronLeft className="w-6 h-6" /></button>
                      <h3 className="text-xs font-black text-white uppercase tracking-widest">Récupération</h3>
                    </div>
                    <input type="text" placeholder="UTILISATEUR À RÉINITIALISER" value={loginId} onChange={e => setLoginId(e.target.value)} className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none uppercase font-black focus:border-kls-cyan/50 text-xs" required />
                    <input type="password" placeholder="NOUVEAU MOT DE PASSE" value={regPass} onChange={e => setRegPass(e.target.value)} className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none font-black focus:border-kls-cyan/50 text-xs" required />
                    <input type="password" placeholder="CONFIRMER PASS" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl text-white outline-none font-black focus:border-kls-cyan/50 text-xs" required />
                    <input type="text" placeholder="CODE DE SÉCURITÉ 16088" value={activationCode} onChange={e => setActivationCode(e.target.value)} className="w-full h-14 px-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-500 text-center font-black tracking-widest outline-none text-xs" required />
                    <button type="submit" className="w-full h-16 bg-white text-black font-black rounded-3xl uppercase text-[11px] shadow-xl active:scale-95 transition-all">VALIDER CHANGEMENT</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* NAVIGATION */}
            <header className="h-16 sticky top-0 z-[60] bg-black/60 backdrop-blur-md px-8 flex items-center justify-between border-b border-white/5 shadow-2xl">
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigateTo('home')}>
                <div className="w-10 h-10 bg-kls-cyan/10 rounded-xl flex items-center justify-center border border-kls-cyan/20 group-hover:bg-kls-cyan/20 transition-all">
                  <Box className="w-6 h-6 text-kls-cyan" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-black text-white uppercase tracking-tighter leading-none">ALOKA <span className="text-kls-cyan">NEXUS</span></span>
                  <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mt-1">v11.0 Quantum</span>
                </div>
              </div>
              
              <nav className="hidden xl:flex items-center bg-white/5 p-1 rounded-[1.8rem] border border-white/5">
                 {[
                   { id: 'home', label: 'Home', icon: LayoutGrid },
                   { id: 'screenshot', label: 'Predictor', icon: Zap },
                   { id: 'direct_analysis', label: 'Moteur', icon: Cpu },
                   { id: 'ai', label: 'Neural IA', icon: Bot },
                   { id: 'chat', label: 'Social', icon: MessageSquare },
                   { id: 'settings', label: 'Config', icon: Settings },
                 ].map(v => (
                   <button 
                     key={v.id} 
                     onClick={() => navigateTo(v.id)} 
                     className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       state.currentView === v.id ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
                     }`}
                   >
                     <v.icon className={`w-4 h-4 ${state.currentView === v.id ? 'text-black' : 'text-kls-cyan'}`} />
                     <span>{v.label}</span>
                   </button>
                 ))}
              </nav>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowSyncModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-kls-cyan hover:bg-white/10 transition-all active:scale-95"
                  title="Changer de plateforme"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Plateforme</span>
                </button>
                <button 
                  onClick={() => { setIsMuted(!isMuted); unlockAudio(); }} 
                  className={`p-2.5 rounded-xl border border-white/5 transition-all active:scale-95 ${isMuted ? 'text-rose-500 bg-rose-500/10 border-rose-500/20' : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'}`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setIsMobileMenuOpen(true)} 
                  className="xl:hidden p-2.5 text-white bg-white/5 rounded-xl border border-white/5 active:scale-95 transition-all"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button onClick={() => setState(prev => ({...prev, isAuthenticated: false}))} className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            </header>

            {/* SIDEBAR MOBILE */}
            {isMobileMenuOpen && (
              <div className="fixed inset-0 z-[100] xl:hidden flex justify-end">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
                <div className="relative w-80 bg-slate-950 border-l border-white/10 p-10 flex flex-col shadow-2xl animate-reveal-data h-full">
                  <div className="flex justify-between items-center mb-12">
                     <div className="flex items-center gap-4">
                        <Box className="w-6 h-6 text-kls-cyan" />
                        <span className="text-sm font-black uppercase text-white tracking-[0.2em]">MENU</span>
                     </div>
                     <button onClick={() => setIsMobileMenuOpen(false)} className="p-2.5 text-slate-400 hover:text-white bg-white/5 rounded-xl"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                    {[
                       { id: 'home', label: 'Home', icon: LayoutGrid },
                       { id: 'screenshot', label: 'Predictor', icon: Zap },
                       { id: 'direct_analysis', label: 'Moteur Quantum', icon: Cpu },
                       { id: 'ai', label: 'Assistant IA', icon: Bot },
                       { id: 'chat', label: 'Social', icon: MessageSquare },
                       { id: 'history', label: 'Historique', icon: History },
                       { id: 'settings', label: 'Paramètres', icon: Settings },
                    ].map(link => (
                      <button 
                        key={link.id}
                        onClick={() => navigateTo(link.id)}
                        className={`w-full flex items-center gap-5 p-5 rounded-2xl transition-all border ${state.currentView === link.id ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
                      >
                        <link.icon className={`w-6 h-6 ${state.currentView === link.id ? 'text-black' : 'text-kls-cyan'}`} />
                        <span className="text-[12px] font-black uppercase tracking-widest">{link.label}</span>
                      </button>
                    ))}
                    <button 
                      onClick={() => { setShowSyncModal(true); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-5 p-5 rounded-2xl text-kls-orange bg-kls-orange/5 border border-kls-orange/10 mt-4"
                    >
                      <RefreshCw className="w-6 h-6" />
                      <span className="text-[12px] font-black uppercase tracking-widest">Changer Plateforme</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <main className="flex-1 w-full max-w-[1200px] mx-auto p-6 md:p-10 relative z-10 overflow-y-auto custom-scrollbar">
              <Suspense fallback={<div className="flex flex-center h-96"><Loader2 className="w-12 h-12 animate-spin text-kls-cyan" /></div>}>
                {state.currentView === 'home' && <HomeView state={state} onNavigate={navigateTo} syncPlatform={() => setShowSyncModal(true)} />}
                {state.currentView === 'screenshot' && <ScreenshotView onBack={() => navigateTo('home')} state={state} addPrediction={p => setState(s => ({...s, predictions: [p, ...s.predictions]}))} onSwitchPlatform={() => setShowSyncModal(true)} />}
                {state.currentView === 'direct_analysis' && <DirectAnalysisView onBack={() => navigateTo('home')} state={state} addPrediction={p => setState(s => ({...s, predictions: [p, ...s.predictions]}))} />}
                {state.currentView === 'chat' && <LiveChatView onBack={() => navigateTo('home')} currentUser={state.currentUser} />}
                {state.currentView === 'ai' && <AssistantView onBack={() => navigateTo('home')} />}
                {state.currentView === 'history' && <HistoryView onBack={() => navigateTo('home')} predictions={state.predictions} clearHistory={() => setState(s => ({...s, predictions: []}))} />}
                {state.currentView === 'settings' && <SettingsView onBack={() => navigateTo('home')} state={state} onNavigate={navigateTo} changeTheme={() => {}} onUpdateNotifications={handleUpdateNotifications} />}
                {state.currentView === 'profile' && <ProfileView onBack={() => navigateTo('settings')} state={state} updateCredentials={handleUpdateCredentials} />}
                {state.currentView === 'wallpaper' && <WallpaperSelectorView onBack={() => navigateTo('settings')} onSelect={w => setState(s => ({...s, customWallpaper: w}))} currentWallpaper={state.customWallpaper} />}
                {state.currentView === 'social' && <SocialMenuView onBack={() => navigateTo('settings')} />}
                {state.currentView === 'methodology' && <MethodologyView onBack={() => navigateTo('settings')} />}
                {state.currentView === 'about' && <AboutView onBack={() => navigateTo('settings')} />}
              </Suspense>
            </main>

            <footer className="h-12 bg-black/40 backdrop-blur-md border-t border-white/5 px-10 flex items-center justify-between text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">
               <span className="text-kls-cyan">Nexus Quantum v11.0</span>
               <span className="text-white">© 2025 Mahandry RANDRIAMALALA</span>
            </footer>
          </>
        )}
      </div>

      {/* SYNC MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
           <div className="w-full max-w-sm glass-card rounded-[3rem] p-10 space-y-10 border-white/10 bg-slate-950/80 shadow-[0_0_120px_rgba(0,0,0,0.9)] animate-scale-in">
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                   <h2 className="text-2xl font-black uppercase tracking-tighter text-white">LIAISON <span className="text-kls-cyan">SYSTEM</span></h2>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Changer la cible plateforme</p>
                 </div>
                 <button onClick={() => setShowSyncModal(false)} className="p-3 text-slate-400 hover:text-rose-500 bg-white/5 rounded-2xl transition-all shadow-md"><X className="w-6 h-6" /></button>
              </div>

              <div className="space-y-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Plateforme Cible</span>
                <div className="grid grid-cols-3 gap-4">
                    {PLATFORMS.map((p) => (
                      <button key={p.id} onClick={() => setSelectedPlatformId(p.id)} className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-3 ${selectedPlatformId === p.id ? 'bg-kls-cyan/20 border-kls-cyan shadow-xl scale-110' : 'bg-white/5 border-transparent opacity-60 hover:opacity-100'}`}>
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex flex-center p-2 border border-white/5 shadow-inner">
                          <img src={p.logo} className="w-full h-full object-contain" alt={p.name} />
                        </div>
                        <span className="text-[9px] font-black text-white uppercase truncate w-full text-center leading-none tracking-tight">{p.name}</span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="space-y-5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">Moteur de Jeu</span>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setSelectedGameType('spribe')} disabled={selectedPlatformId === 'Bet261'} className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${selectedGameType === 'spribe' ? 'bg-kls-orange/20 border-kls-orange shadow-xl scale-110' : 'bg-white/5 border-transparent opacity-60 disabled:opacity-5'}`}>
                      <Zap className={`w-8 h-8 ${selectedGameType === 'spribe' ? 'text-kls-orange' : 'text-slate-600'}`} />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Spribe</span>
                    </button>
                    <button onClick={() => setSelectedGameType('studio')} className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 ${selectedGameType === 'studio' ? 'bg-kls-cyan/20 border-kls-cyan shadow-xl scale-110' : 'bg-white/5 border-transparent opacity-60'}`}>
                      <PlayCircle className={`w-8 h-8 ${selectedGameType === 'studio' ? 'text-kls-cyan' : 'text-slate-600'}`} />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest leading-none">Studio</span>
                    </button>
                </div>
              </div>

              <button onClick={handleSync} disabled={!selectedPlatformId || !selectedGameType || isVerifying} className="w-full h-16 bg-white text-black rounded-3xl flex items-center justify-center gap-4 text-xs font-black uppercase shadow-2xl active:scale-95 transition-all disabled:opacity-30 hover:bg-gray-100">
                 {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <LinkIcon className="w-6 h-6" />} Établir la Liaison
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => <ToastProvider><AppContent /></ToastProvider>;
export default App;
