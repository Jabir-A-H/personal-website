'use client';

import { useState, useEffect } from 'react';
import { useDarkMode } from '@/components/DarkModeProvider';

export function useGameTheme() {
  const { isDark: siteIsDark } = useDarkMode();
  const [isDark, setIsDark] = useState(siteIsDark);

  useEffect(() => {
    setIsDark(siteIsDark);
  }, [siteIsDark]);

  return { isDark, toggle: () => setIsDark(d => !d) };
}
