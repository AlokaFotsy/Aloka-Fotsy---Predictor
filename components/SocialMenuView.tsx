
import React from 'react';
import { ChevronLeft, Facebook, MessageCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface SocialMenuViewProps {
  onBack: () => void;
}

const SocialMenuView: React.FC<SocialMenuViewProps> = ({ onBack }) => {
  const socialLinks = [
    {
      id: 'facebook',
      label: 'Facebook',
      name: 'Mahandry Hery RANDRIAMALALA',
      url: 'https://www.facebook.com/mahandry.hery.randriamalala',
      icon: Facebook,
      color: 'bg-blue-600',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/512px-Facebook_Logo_%282019%29.png'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      name: '+261 33 67 561 85',
      url: 'https://wa.me/261336756185',
      icon: MessageCircle,
      color: 'bg-emerald-500',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/512px-WhatsApp.svg.png'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto pb-24">
      <header className="flex items-center gap-5">
        <button onClick={onBack} className="p-4 glass-card rounded-2xl text-kls-orange hover:bg-white/10 transition-all shadow-xl">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Infos ou <span className="text-kls-orange">Réseaux</span></h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Canaux officiels certifiés</p>
        </div>
      </header>

      <div className="space-y-4">
        {socialLinks.map((social) => (
          <a 
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block glass-card p-6 rounded-[2.5rem] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
              <social.icon className="w-40 h-40" />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 rounded-2xl bg-white/5 p-2 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-white/10 transition-colors">
                    <img src={social.logo} alt={social.label} className="w-full h-full object-contain" />
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{social.label}</span>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">{social.name}</h3>
                 </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${social.color} text-white shadow-lg group-hover:scale-110`}>
                 <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="glass-card p-8 rounded-[3rem] border-emerald-500/10 bg-emerald-500/5 flex items-center gap-6">
         <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 flex-shrink-0">
           <ShieldCheck className="w-7 h-7 text-emerald-500" />
         </div>
         <div className="space-y-1">
            <h4 className="text-xs font-black text-white uppercase tracking-tight">Créateur Certifié</h4>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Application développée par Mahandry Hery RANDRIAMALALA. Pour toute demande, contactez-moi via les réseaux officiels.
            </p>
         </div>
      </div>
    </div>
  );
};

export default SocialMenuView;
