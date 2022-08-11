import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ITheme {
  theme: string | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ITheme>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string | null>(null);

  if (typeof window !== 'undefined' && theme === null) {
    const localTheme = localStorage.getItem('theme');
    if (localTheme !== null) {
      setTheme(localTheme);
    } else {
      setTheme('light');
    }
  }

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const memoedValue = useMemo(
    () => ({ theme, toggleTheme }),
    // eslint-disable-next-line
    [theme]
  );

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.className = 'light-theme';
    } else {
      document.documentElement.className = 'dark-theme';
    }

    theme && localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={memoedValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme() {
  return useContext(ThemeContext);
}
