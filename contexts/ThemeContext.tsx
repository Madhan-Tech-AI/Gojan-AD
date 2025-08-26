import React, { createContext, useContext, ReactNode } from 'react';

const emeraldDepthTheme = {
  primary: '#28623A',
  secondary: '#0F2027',
  accent: '#4A7C59',
  background: '#0F2027',
  surface: '#1A2F38',
  textPrimary: '#FFFFFF',
  textSecondary: '#B8C5CC',
  border: '#2A3F4A',
  error: '#E53E3E',
  success: '#38A169',
  warning: '#D69E2E',
  card: '#1A2F38',
  cardBorder: '#2A3F4A',
  buttonPrimary: '#28623A',
  buttonSecondary: '#4A7C59',
  statusPending: '#FEF3C7',
  statusConfirmed: '#D1FAE5',
  statusCancelled: '#FEE2E2',
  statusApproved: '#D1FAE5',
  statusRejected: '#FEE2E2',
};

interface ThemeContextType {
  colors: typeof emeraldDepthTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider
      value={{
        colors: emeraldDepthTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}