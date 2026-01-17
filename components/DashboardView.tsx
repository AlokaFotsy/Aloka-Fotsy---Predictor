
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, TrendingUp, TrendingDown, Minus, Activity, Radio, BarChart3, Zap, RefreshCw, Loader2, AlertTriangle, Crosshair, ShieldCheck } from 'lucide-react';

interface DashboardViewProps {
  onBack: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onBack }) => {
  const [history, setHistory] = useState<{round: number, multiplier: number, confidence: number, risk: 'LOW' | 'MED' | 'HIGH'}[]>([]);
  const [stats, setStats] = useState({ avg: 0, crashRate: 0, streak: 0, trend: 'stable' as 'up' | 'down' | 'stable' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [hoveredData, setHoveredData] = useState<{round: number, multiplier: number, confidence: number, risk: string, x: number} | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generatePoint = (round: number) => {
        const isCrash = Math.random() < 0.35;
        const multiplier = parseFloat(isCrash ? (1.00 + Math.random() * 0.8).toFixed(2) : (1.8 + Math.random() * 8 + (Math.random() > 0.9 ? 20 : 0)).toFixed(2));
        const confidence = Math.floor(Math.random() * 15) + 85;
        const risk = multiplier < 1.5 ? 'HIGH' : multiplier < 2 ? 'MED' : 'LOW';
        return { round, multiplier, confidence, risk: risk as 'LOW' | 'MED' | 'HIGH' };
    };

    const initial = Array.from({length: 30}, (_, i) => generatePoint(18054000 - i)).reverse();
    setHistory(initial);

    const multipliers = initial.map(h => h.multiplier);
    const avg = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;
    setStats(prev => ({ ...prev, avg }));

    const interval = setInterval(() => {
      setIsUpdating(true);
      
      setTimeout(() => {
        setHistory(prev => {
          if (prev.length === 0) return prev;
          const nextRound = prev[prev.length - 1].round + 1;
          const newPoint = generatePoint(nextRound);
          const next = [...prev.slice(1), newPoint];
          
          const multipliers = next.map(h => h.multiplier);
          const avg = multipliers.reduce((a, b) => a + b, 0) / multipliers.length;
          const crashes = multipliers.filter(m => m < 2.00).length;
          
          let currentStreak = 0;
          for (let i = next.length - 1; i >= 0; i--) {
            if (next[i].multiplier < 2) currentStreak++;
            else break;
          }

          const firstHalf = multipliers.slice(0, 15).reduce((a,b) => a+b,0) / 15;
          const secondHalf = multipliers.slice(15).reduce((a,b) => a+b,0) / 15;
          const currentTrend = secondHalf > firstHalf * 1.05 ? 'up' : secondHalf < firstHalf * 0.95 ? 'down' : 'stable';

          setStats({ avg, crashRate: (crashes / next.length) * 100, streak: currentStreak, trend: currentTrend });
          return next;
        });
        
        setTimeout(() => setIsUpdating(false), 500);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const maxVal = history.length > 0 ? Math.max(...history.map(h => h.multiplier), 5) * 1.2 : 10;

  const points = history.length > 1 ? history.map((h, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 100 - (h.multiplier / maxVal) * 100;
    return `${x},${isNaN(y) ? 100 : y}`;
  }).join(' ') : "0,100 100,100";

  const areaPoints = `0,100 ${points} 100,100`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartRef.current || history.length === 0) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const index = Math.min(Math.max(Math.round((x / width) * (history.length - 1)), 0), history.length - 1);
    
    if (index >= 0 && index < history.length) {
        const data = history[index];
        const pointX = (index / (history.length - 1)) * width;
        setHoveredData({ ...data, x: pointX });
    }
  };

  const handleMouseLeave = () => setHoveredData(null);

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <header className="flex items-center gap-6">
        <button onClick={onBack} className="p-4 glass-card rounded-2xl text-kls-cyan hover:bg-white/10 active:scale-95 transition-all shadow-xl bg-black/40">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">LIVE <span className="text-kls-cyan text-glow">ANALYTICS</span></h1>
            {isUpdating && <Loader2 className="w-4 h-4 text-kls-cyan animate-spin" />}
          </div>
          <div className="flex items-center gap-2">
             <Radio className={`w-3 h-3 ${isUpdating ? 'text-kls-cyan animate-pulse' : 'text-rose-500 animate-pulse'}`} />
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">
               {isUpdating ? 'Synchronisation du flux...' : 'Flux télémétrique temps réel'}
             </p>
          </div>
        </div>
      </header>

      <div className={`glass-card p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden bg-black/40 ${isUpdating ? 'border-kls-cyan/30' : 'border-white/5'}`}>
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-kls-cyan/10 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-kls-cyan" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Tendance Multiplicateur</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Historique des 30 derniers tours</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Sûr</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Crash</span>
                </div>
            </div>
        </div>

        <div 
            ref={chartRef}
            className="relative h-64 w-full cursor-crosshair touch-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {[25, 50, 75].map(y => (
                    <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                ))}

                {history.length > 0 && (
                  <>
                    <path d={`M${areaPoints} Z`} fill="url(#chartGradient)" className="transition-all duration-500 ease-in-out" />
                    <path 
                        d={`M${points.replace(/ /g, ' L')}`} 
                        fill="none" 
                        stroke="#06b6d4" 
                        strokeWidth="1.5" 
                        vectorEffect="non-scaling-stroke" 
                        className="drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500 ease-in-out"
                    />
                    {history.map((h, i) => (
                        <circle 
                            key={`${h.round}-${i}`} 
                            cx={(i / (history.length - 1)) * 100} 
                            cy={100 - (h.multiplier / maxVal) * 100} 
                            r="1.2" 
                            fill={h.multiplier < 2 ? '#f43f5e' : '#22c55e'} 
                            className="transition-all duration-700 ease-elastic animate-reveal-data"
                            style={{ animationDelay: `${i * 15}ms` }}
                        />
                    ))}
                  </>
                )}

                {hoveredData && history.length > 1 && (
                    <line 
                        x1={(history.indexOf(history.find(h => h.round === hoveredData.round)!) / (history.length - 1)) * 100} 
                        y1="0" 
                        x2={(history.indexOf(history.find(h => h.round === hoveredData.round)!) / (history.length - 1)) * 100} 
                        y2="100" 
                        stroke="rgba(255,255,255,0.2)" 
                        strokeWidth="1" 
                        strokeDasharray="2 2"
                        vectorEffect="non-scaling-stroke"
                    />
                )}
            </svg>

            {hoveredData && (
                <div 
                    className="absolute z-20 top-0 pointer-events-none"
                    style={{ left: hoveredData.x, transform: 'translate(-50%, -10px)' }}
                >
                    <div className="bg-slate-900/95 backdrop-blur-md border border-white/15 p-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 min-w-[140px] animate-scale-in">
                         <div className="flex items-center gap-2 pb-2 border-b border-white/10 w-full justify-center">
                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Tour #{hoveredData.round}</span>
                         </div>
                         <div className="text-center">
                            <span className={`text-3xl font-black font-mono leading-none ${hoveredData.multiplier < 2 ? 'text-rose-500' : 'text-emerald-400 text-glow-animate'}`}>
                                {hoveredData.multiplier.toFixed(2)}x
                            </span>
                         </div>
                         <div className="grid grid-cols-2 gap-2 w-full pt-1">
                             <div className="bg-white/5 rounded-lg p-1.5 text-center">
                                 <span className="block text-[8px] font-bold text-slate-500 uppercase">Confiance</span>
                                 <span className="text-[10px] font-black text-kls-cyan">{hoveredData.confidence}%</span>
                             </div>
                             <div className={`rounded-lg p-1.5 text-center ${hoveredData.risk === 'HIGH' ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}>
                                 <span className="block text-[8px] font-bold text-slate-500 uppercase">Risque</span>
                                 <span className={`text-[10px] font-black uppercase ${hoveredData.risk === 'HIGH' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                     {hoveredData.risk === 'HIGH' ? 'HAUT' : 'BAS'}
                                 </span>
                             </div>
                         </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`glass-card p-10 relative overflow-hidden rounded-[2.5rem] group transition-all duration-500 bg-black/40 ${isUpdating ? 'border-kls-cyan/30' : 'border-white/5'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-kls-cyan/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Moyenne Mobile Globale</span>
            {isUpdating && <RefreshCw className="w-3 h-3 text-kls-cyan animate-spin opacity-50" />}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black text-white italic tracking-tighter text-glow">{stats.avg.toFixed(2)}</span>
            <span className="text-kls-cyan text-3xl font-black italic">x</span>
          </div>
        </div>

        <div className={`glass-card p-10 relative overflow-hidden rounded-[2.5rem] group transition-all duration-500 bg-black/40 ${isUpdating ? 'border-rose-500/30' : 'border-white/5'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Séquence Basse</span>
            {isUpdating && <Activity className="w-3 h-3 text-rose-500 animate-pulse opacity-50" />}
          </div>
          <div className="flex items-center gap-8">
             <span className={`text-7xl font-black italic tracking-tighter transition-colors ${stats.streak > 3 ? 'text-rose-500 text-glow' : 'text-white'}`}>
                {stats.streak}
             </span>
             <div className="space-y-3">
                <div className={`px-5 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest transition-all ${stats.streak > 3 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-lg shadow-rose-500/10' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                   {stats.streak > 3 ? 'Signal Alerte' : 'Statut Optimal'}
                </div>
                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest italic leading-none">Indice de Node</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardView);
