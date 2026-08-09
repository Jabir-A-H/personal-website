'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext<{ isDark: boolean; toggle: () => void }>({ isDark: false, toggle: () => {} });

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    let initialDark = false;
    
    if (stored !== null) {
      initialDark = stored === 'true';
    } else {
      initialDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggle = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('darkMode', String(next));
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);
