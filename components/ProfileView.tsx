
import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, Key, User, Save, AlertTriangle, Fingerprint, Lock, Eye, EyeOff } from 'lucide-react';
import { AppState } from '../types.ts';
import { useToast } from './ToastProvider.tsx';

interface ProfileViewProps {
  onBack: () => void;
  state: AppState;
  updateCredentials: (newId: string, newPass: string) => void;
}

const VALID_CODES = ['210405', '160808'];

const ProfileView: React.FC<ProfileViewProps> = ({ onBack, state, updateCredentials }) => {
  const { showToast } = useToast();
  const [newId, setNewId] = useState(state.currentUser || '');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newId.trim().length < 4) {
      setError("L'IDENTIFIANT EST TROP COURT.");
      return;
    }
    if (newPass.length < 4) {
      setError("LE MOT DE PASSE EST TROP COURT.");
      return;
    }
    if (newPass !== confirmPass) {
      setError("LES MOTS DE PASSE NE CORRESPONDENT PAS.");
      return;
    }
    if (!VALID_CODES.includes(activationCode)) {
      setError("CODE D'ACTIVATION INCORRECT.");
      return;
    }

    updateCredentials(newId, newPass);
    showToast("ACCÈS MIS À JOUR DÉFINITIVEMENT.", "success");
    onBack();
  };

  return (
    <div className="max-w-md mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex items-center gap-5">
        <button onClick={onBack} className="p-3 glass-card rounded-2xl text-kls-cyan hover:bg-white/10 transition-all shadow-xl">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Sécurité <span className="text-kls-cyan">Profil</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mise à jour immédiate</p>
        </div>
      </header>

      <div className="glass-card p-8 rounded-[3rem] border-white/10 bg-slate-900/50 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ID Système</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
              <input 
                type="text" value={newId} onChange={e => setNewId(e.target.value)}
                placeholder="NOUVEL ID"
                className="block w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-black text-white uppercase outline-none focus:border-kls-cyan/50"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
              <input 
                type={showPass ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="NOUVEAU PASS"
                className="block w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-sm font-black text-white outline-none focus:border-kls-cyan/50"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
              <input 
                type={showPass ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                placeholder="CONFIRMER PASS"
                className="block w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-black text-white outline-none focus:border-kls-cyan/50"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Validation (Activation Code)</label>
            <div className="relative group">
              <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-600" />
              <input 
                type="text" value={activationCode} onChange={e => setActivationCode(e.target.value)}
                placeholder="CODE D'ACTIVATION"
                className="block w-full h-14 bg-rose-500/5 border border-rose-500/20 rounded-2xl pl-12 pr-4 text-sm font-black text-white text-center outline-none focus:border-rose-500/50 font-mono"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          <button type="submit" className="w-full h-16 bg-white text-black rounded-2xl flex items-center justify-center gap-4 text-sm font-black uppercase shadow-2xl active:scale-95 transition-all">
            <Save className="w-6 h-6" /> Appliquer les changements
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileView;
