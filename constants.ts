
import { Platform } from './types';

export interface ExtendedPlatform extends Platform {
  url: string;
  engines: {
    studio: { available: boolean; url: string; statusNote?: string };
    spribe: { available: boolean; url: string };
  };
}

export const PLATFORMS: ExtendedPlatform[] = [
  { 
    id: '1xBet', 
    name: '1xbet', 
    color: '#004a99', 
    logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968958.png',
    url: 'https://1xbet.com/',
    engines: { 
      studio: { 
        available: true, 
        url: 'https://1xbet.com/fr/slots/game/141085/aviator',
        statusNote: "Aviator Studio 1xbet" 
      }, 
      spribe: { 
        available: true, 
        url: 'https://1xbet.com/fr/slots/game/52358/aviator' 
      } 
    }
  },
  { 
    id: 'Melbet', 
    name: 'Melbet', 
    color: '#f5c400', 
    logo: 'https://cdn-icons-png.flaticon.com/512/10709/10709674.png',
    url: 'https://melbet.com/',
    engines: { 
      studio: { available: true, url: 'https://melbet.com/' }, 
      spribe: { available: true, url: 'https://melbet.com/' } 
    }
  },
  { 
    id: 'Bet261', 
    name: 'Bet261', 
    color: '#00a651', 
    logo: 'https://cdn-icons-png.flaticon.com/512/11516/11516447.png',
    url: 'https://bet261.mg/',
    engines: { 
      studio: { 
        available: true, 
        url: 'https://bet261.mg/instant-games/llc/Aviator', 
        statusNote: "Aviator Studio Bet261" 
      }, 
      spribe: { 
        available: false,
        url: '' 
      } 
    }
  }
];

export const OFFICIAL_CONTACTS = [
  { 
    id: 'facebook_mahandry',
    label: 'Facebook',
    val: 'Mahandry Hery RANDRIAMALALA',
    link: 'https://www.facebook.com/mahandry.hery.randriamalala',
    icon: 'Facebook'
  },
  { 
    id: 'whatsapp_direct', 
    label: 'WhatsApp', 
    val: '+261 33 67 561 85', 
    link: 'https://wa.me/261336756185',
    icon: 'MessageCircle'
  }
];
