
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#6200EE', // A strong, modern purple
    },
    secondary: {
      main: '#03DAC6', // A vibrant, contrasting teal
    },
    background: {
      default: '#F5F5F5', // A light grey for a clean, airy feel
      paper: '#FFFFFF',
    },
    text: {
        primary: '#333333',
        secondary: '#555555',
    }
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#6200EE',
    },
    h5: {
        fontWeight: 600,
    },
     h6: {
      fontWeight: 600,
    },
  },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none', 
                    padding: '10px 20px', 
                },
                containedPrimary: {
                     boxShadow: '0 3px 5px 2px rgba(98, 0, 238, .3)', // Subtle glow
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                     boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)', // Soft, modern shadow
                }
            }
        },
        MuiCard: {
             styleOverrides: {
                root: {
                    borderRadius: '12px',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                         boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.12)',
                    }
                }
            }
        },
         MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none', // Flat, modern app bar
                    borderBottom: '1px solid #e0e0e0',
                }
            }
        }
  }
});

export default theme;
