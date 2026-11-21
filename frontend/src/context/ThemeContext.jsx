import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const GODADDY_THEMES = [
  {
    id: 'pulse',
    name: 'GoDaddy Pulse',
    tagline: 'Modern & Bold',
    primaryColor: '#111111',
    accentColor: '#00838C',
    accentBg: '#E6F7F8',
    description: 'High-contrast obsidian & GoDaddy signature brand teal with energetic CTAs.'
  },
  {
    id: 'citadel',
    name: 'GoDaddy Citadel',
    tagline: 'Corporate Pro',
    primaryColor: '#0F2942',
    accentColor: '#1D4ED8',
    accentBg: '#EFF6FF',
    description: 'Executive clinical navy, crisp slate panels, and authoritative structure.'
  },
  {
    id: 'minimal',
    name: 'GoDaddy Minimal',
    tagline: 'Pure Paper & Mono',
    primaryColor: '#18181B',
    accentColor: '#3F3F46',
    accentBg: '#F4F4F5',
    description: 'Ultra-clean editorial whitespace, stark black typography, and hairline borders.'
  }
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('godaddy_theme') || 'pulse';
  });

  useEffect(() => {
    localStorage.setItem('godaddy_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const currentTheme = GODADDY_THEMES.find(t => t.id === theme) || GODADDY_THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, themes: GODADDY_THEMES }}>
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
