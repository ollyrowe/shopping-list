import React, { use, useMemo } from 'react';
import { MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { theme } from '@/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: ColorScheme.System,
  });

  const forcedColorScheme = colorScheme === ColorScheme.System ? undefined : colorScheme;

  const value = useMemo(() => ({ colorScheme, setColorScheme }), [colorScheme, setColorScheme]);

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto" forceColorScheme={forcedColorScheme}>
      <ThemeContext value={value}>{children}</ThemeContext>
    </MantineProvider>
  );
};

export default ThemeProvider;

export enum ColorScheme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

interface ThemeContextValue {
  colorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  colorScheme: ColorScheme.System,
  setColorScheme: () => {},
});

export const useTheme = () => {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
