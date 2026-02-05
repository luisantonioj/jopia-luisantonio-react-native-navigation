// src/context/ThemeContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string;
    text: string;
    cardBackground: string;
    buttonBackground: string;
    buttonText: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = {
    light: {
      background: '#FFFFFF',
      text: '#000000',
      cardBackground: '#F5F5F5',
      buttonBackground: '#007AFF',
      buttonText: '#FFFFFF',
      border: '#E0E0E0',
    },
    dark: {
      background: '#1C1C1E',
      text: '#FFFFFF',
      cardBackground: '#2C2C2E',
      buttonBackground: '#0A84FF',
      buttonText: '#FFFFFF',
      border: '#3A3A3C',
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: colors[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};