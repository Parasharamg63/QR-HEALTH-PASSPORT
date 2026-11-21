import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const APP_THEMES = [
  {
    id: 'pulse',
    name: 'Modern Pulse',
    tagline: 'Modern & Bold',
    primaryColor: '#111111',
    accentColor: '#00838C',
    accentBg: '#E6F7F8',
    description: 'High-contrast obsidian & signature clinical teal with energetic CTAs.'
  },
  {
    id: 'citadel',
    name: 'Citadel Pro',
    tagline: 'Corporate Pro',
    primaryColor: '#0F2942',
    accentColor: '#1D4ED8',
    accentBg: '#EFF6FF',
    description: 'Executive clinical navy, crisp slate panels, and authoritative structure.'
  },
  {
    id: 'minimal',
    name: 'Minimal Slate',
    tagline: 'Pure Paper & Mono',
    primaryColor: '#18181B',
    accentColor: '#3F3F46',
    accentBg: '#F4F4F5',
    description: 'Ultra-clean editorial whitespace, stark black typography, and hairline borders.'
  }
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('health_passport_theme') || 'pulse';
  });

  useEffect(() => {
    localStorage.setItem('health_passport_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentTheme = APP_THEMES.find(t => t.id === theme) || APP_THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, themes: APP_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
