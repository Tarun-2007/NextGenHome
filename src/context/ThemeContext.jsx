
import React, { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#7E57C2' },
                secondary: { main: '#EC407A' },
                background: { default: '#f9f9f9', paper: '#ffffff' },
                text: { primary: '#212121', secondary: '#757575' },
              }
            : {
                primary: { main: '#9575CD' },
                secondary: { main: '#F06292' },
                background: { default: '#121212', paper: '#1E1E1E' },
                text: { primary: '#ffffff', secondary: '#bdbdbd' },
              }),
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: { fontWeight: 700 },
          h2: { fontWeight: 700 },
          h3: { fontWeight: 700 },
          h4: { fontWeight: 600 },
          h5: { fontWeight: 600 },
        },
        shape: {
            borderRadius: 8,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 'bold',
                    },
                    containedPrimary: {
                        boxShadow: '0 3px 5px 2px rgba(126, 87, 194, .3)',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
                        }
                    }
                }
            }
        }
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
