
import React from 'react';
import { 
  ChevronLeft, Terminal, Cpu, ShieldCheck, Database, 
  Settings as SettingsIcon, Activity, Key, Globe, Layout, Smartphone,
  User, ChevronRight, Palette, ImageIcon, Upload, Trash2, ShieldAlert, Sparkles, Facebook,
  Bell, BellRing, BellOff, MessageSquare, Zap
} from 'lucide-react';
import { AppState, ThemeType } from '../types.ts';
import { useToast } from './ToastProvider.tsx';

interface SettingsViewProps {
  onBack: () => void;
  state: AppState;
  onNavigate: (view: string) => void;
  changeTheme: (theme: ThemeType) => void;
  onUpdateNotifications: (key: keyof AppState['notifications'], val: boolean) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, state, onNavigate, changeTheme, onUpdateNotifications }) => {
  const { showToast } = useToast();

  const systemMetrics = [
    { label: 'KERNEL', val: '11.0.2-CORE', icon: Terminal, color: 'text-kls-cyan' },
    { label: 'PULSE', val: 'SYNCHRONISÉ', icon: Sparkles, color: 'text-emerald-400' },
    { label: 'ENCRYPTION', val: 'SHA-512-ELITE', icon: ShieldCheck, color: 'text-kls-orange' },
    { label: 'MOTEUR IA', val: 'NEURAL-GEMINI-3', icon: Cpu, color: 'text-kls-yellow' },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-24 px-1 max-w-full overflow-x-hidden">
      <header className="flex items-center gap-6 min-w-0">
        <button onClick={onBack} className="p-4 glass-card rounded-2xl text-kls-orange hover:bg-kls-orange/10 transition-all shadow-xl flex-shrink-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="min-w-0">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight animated-gradient-text truncate">Config <span className="text-kls-orange">Elite</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] truncate">Panneau de Contrôle Aloka v11.0</p>
        </div>
      </header>

      {/* Profil Premium */}
      <button 
        onClick={() => onNavigate('profile')}
        className="w-full text-left glass-card p-10 flex items-center justify-between border-white/10 rounded-[3rem] relative overflow-hidden group hover:border-kls-orange/40 transition-all"
      >
        <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
          <ShieldCheck className="w-56 h-56" />
        </div>
        <div className="flex items-center gap-8 z-10 min-w-0 overflow-hidden">
          <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center relative shadow-inner flex-shrink-0">
            <User className="w-10 h-10 text-slate-500 group-hover:text-kls-orange transition-colors" />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter text-glow-animate truncate">{state.currentUser}</h3>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] truncate block">Mon Profil & Sécurité</span>
          </div>
        </div>
        <ChevronRight className="w-8 h-8 text-slate-600 group-hover:text-kls-orange transition-all" />
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
           {/* Section Notifications */}
           <div className="flex items-center gap-4">
             <BellRing className="w-5 h-5 text-kls-cyan flex-shrink-0" />
             <h2 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Centre de Notifications</h2>
           </div>
           <div className="glass-card p-8 rounded-[2.5rem] border-white/5 space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-kls-cyan/30 transition-all">
                <div className="flex items-center gap-4">
                  {/* Added missing Zap icon */}
                  <Zap className="w-5 h-5 text-kls-orange" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">Signaux ELITE</h4>
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Alerte lors de signaux haute fiabilité</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateNotifications('eliteSignals', !state.notifications.eliteSignals)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${state.notifications.eliteSignals ? 'bg-kls-cyan' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${state.notifications.eliteSignals ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-tight">Alertes Crash</h4>
                    <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Notification de crash imminent</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdateNotifications('crashAlerts', !state.notifications.crashAlerts)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${state.notifications.crashAlerts ? 'bg-rose-500' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${state.notifications.crashAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
           </div>

           <div className="flex items-center gap-4">
             <SettingsIcon className="w-5 h-5 text-slate-600 flex-shrink-0" />
             <h2 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Métriques Elite</h2>
           </div>
           <div className="grid grid-cols-2 gap-6">
              {systemMetrics.map((m, i) => (
                <div key={i} className="glass-card p-8 rounded-[2.5rem] space-y-6 border-white/5 hover:border-white/15 transition-all text-center">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${m.color} shadow-lg mx-auto`}>
                      <m.icon className="w-6 h-6" />
                   </div>
                   <div className="overflow-hidden">
                      <span className="text-[10px] text-slate-600 block uppercase font-black tracking-widest mb-1 truncate">{m.label}</span>
                      <span className="text-[12px] font-black text-white font-mono truncate block">{m.val}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-8">
           <div className="flex items-center gap-4">
             <Database className="w-5 h-5 text-slate-600 flex-shrink-0" />
             <h2 className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Menu Tactique</h2>
           </div>
           <div className="space-y-4">
             <button onClick={() => onNavigate('social')} className="w-full flex items-center gap-8 p-8 glass-card rounded-[2.5rem] hover:bg-white/10 transition-all group border-white/10 shadow-lg active:scale-[0.98]">
               <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 shadow-lg group-hover:scale-110 transition-transform">
                 <Facebook className="w-7 h-7" />
               </div>
               <span className="text-sm text-slate-200 uppercase tracking-[0.2em] font-black group-hover:text-white truncate">INFOS & RÉSEAUX</span>
               <ChevronRight className="w-6 h-6 ml-auto text-slate-600 group-hover:text-kls-orange transition-all" />
             </button>

             <button onClick={() => onNavigate('wallpaper')} className="w-full flex items-center gap-8 p-8 glass-card rounded-[2.5rem] hover:bg-white/10 transition-all group border-white/10 shadow-lg active:scale-[0.98]">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-kls-orange shadow-lg group-hover:scale-110 transition-transform">
                 <ImageIcon className="w-7 h-7" />
               </div>
               <span className="text-sm text-slate-200 uppercase tracking-[0.2em] font-black group-hover:text-white truncate">FOND D'ÉCRAN</span>
               <ChevronRight className="w-6 h-6 ml-auto text-slate-600 group-hover:text-kls-orange transition-all" />
             </button>
             
             <button onClick={() => onNavigate('profile')} className="w-full flex items-center gap-8 p-8 glass-card rounded-[2.5rem] hover:bg-white/10 transition-all group border-white/10 shadow-lg active:scale-[0.98]">
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-500 shadow-lg group-hover:scale-110 transition-transform">
                 <ShieldAlert className="w-7 h-7" />
               </div>
               <span className="text-sm text-slate-200 uppercase tracking-[0.2em] font-black group-hover:text-white truncate">SÉCURITÉ NOYAU</span>
               <ChevronRight className="w-6 h-6 ml-auto text-slate-600 group-hover:text-kls-orange transition-all" />
             </button>

             {[
               { id: 'methodology', label: 'PROTOCOLE ELITE', icon: Key, color: 'text-kls-cyan' },
               { id: 'about', label: 'HISTORIQUE ALOKA', icon: Globe, color: 'text-kls-yellow' },
             ].map((op, i) => (
               <button key={i} onClick={() => onNavigate(op.id)} className="w-full flex items-center gap-8 p-8 glass-card rounded-[2.5rem] hover:bg-white/10 transition-all group border-white/10 shadow-lg active:scale-[0.98]">
                 <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${op.color} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                   <op.icon className="w-7 h-7" />
                 </div>
                 <span className="text-sm text-slate-200 uppercase tracking-[0.2em] font-black group-hover:text-white truncate">{op.label}</span>
                 <ChevronRight className="w-6 h-6 ml-auto text-slate-600 group-hover:text-kls-orange transition-all flex-shrink-0" />
               </button>
             ))}
           </div>
        </div>
      </div>
      
      <div className="text-center pt-24 opacity-20">
        <p className="text-[11px] font-black tracking-[1.5em] text-slate-500 uppercase truncate">Aloka Elite Pulse © 2025</p>
      </div>
    </div>
  );
};

export default SettingsView;
