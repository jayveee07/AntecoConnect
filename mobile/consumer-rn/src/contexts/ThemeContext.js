import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [mode, setMode] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((v) => { if (v) setMode(v); });
  }, []);

  const toggle = async (m) => {
    const next = m || (mode === 'dark' ? 'light' : 'dark');
    setMode(next);
    await AsyncStorage.setItem('theme', next);
  };

  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
