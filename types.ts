
export type ThemeType = 'sakura' | 'amber' | 'emerald';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

export interface Platform {
  id: string;
  name: string;
  color: string;
  logo: string;
  link?: string;
  disabled?: boolean;
}

export interface ColorSignal {
  time: string;
  multiplier: string;
  label: string;
  confidence: number;
  safetyMultiplier?: string; 
}

export interface Prediction {
  id: string;
  platform: string;
  engine?: 'Studio' | 'Spribe';
  game?: 'Aviator' | 'JetX' | 'Cosmox';
  timestamp: string;
  inputTime: string;
  inputMultiplier: string;
  mode: 'BONNE' | 'MAUVAISE' | 'ROSE' | 'DIRECT';
  hash: string;
  results: {
    res1: ColorSignal;
    res2?: ColorSignal;
  };
  audit: {
    roundId: string;
  };
}

export interface AppState {
  isAuthenticated: boolean;
  isVerified: boolean;
  hasAcceptedWallpaper: boolean;
  hasSeenSubscription: boolean;
  usedActivationCodes: string[];
  currentUser: string | null;
  currentView: string;
  syncedPlatform: string | null;
  syncedEngine: 'Studio' | 'Spribe' | null;
  syncedGame: 'Aviator' | 'JetX' | 'Cosmox' | null;
  theme: ThemeType;
  predictions: Prediction[];
  dashboardHistory: any[];
  customWallpaper: string | null;
  isLightBg: boolean;
  notifications: {
    eliteSignals: boolean;
    crashAlerts: boolean;
  };
}
