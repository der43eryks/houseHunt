import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('admin-theme');
    return (savedTheme as Theme) || 'light';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('admin-theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--primary-bg', '#1e293b'); // Navy blue
      root.style.setProperty('--secondary-bg', '#334155'); // Darker navy
      root.style.setProperty('--text-primary', '#ffffff'); // White
      root.style.setProperty('--text-secondary', '#cbd5e1'); // Light gray
      root.style.setProperty('--accent-blue', '#3b82f6'); // Blue
      root.style.setProperty('--accent-red', '#ef4444'); // Red
      root.style.setProperty('--border-color', '#475569'); // Dark border
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--primary-bg', '#ffffff'); // White
      root.style.setProperty('--secondary-bg', '#f8fafc'); // Light gray
      root.style.setProperty('--text-primary', '#1e293b'); // Dark text
      root.style.setProperty('--text-secondary', '#64748b'); // Gray text
      root.style.setProperty('--accent-blue', '#3b82f6'); // Blue
      root.style.setProperty('--accent-red', '#ef4444'); // Red
      root.style.setProperty('--border-color', '#e2e8f0'); // Light border
    }
  }, [theme]);

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 