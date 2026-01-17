
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage, ToastType } from '../types.ts';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-8 right-8 z-[999] flex flex-col gap-4 pointer-events-none max-w-md w-full sm:w-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-4 p-6 rounded-[1.75rem] border backdrop-blur-2xl shadow-2xl transition-all duration-500 animate-slide-in-right ${
              toast.type === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
              toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
              'bg-kls-cyan/10 border-kls-cyan/20 text-kls-cyan'
            }`}
          >
            <div className="mt-1">
              {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              {toast.type === 'info' && <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="mt-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};
