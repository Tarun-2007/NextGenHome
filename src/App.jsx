
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DetailsPage from './pages/DetailsPage'; // Import DetailsPage
import { AuthContext } from './context/AuthContext';
import { db } from './firebase';
import { ThemeContext } from './context/ThemeContext';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const isFirebaseConfigured = () => {
  try {
    const projectId = db.app.options.projectId;
    return projectId && !projectId.includes('YOUR_PROJECT_ID');
  } catch (e) {
    return false;
  }
};

const FirebaseNotConfigured = () => (
  <Container sx={{ py: 8 }}>
    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#ffebee' }}>
      <Typography variant="h4" color="error" gutterBottom>
        Firebase Not Configured
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Please follow these steps:
      </Typography>
      <Box component="ol" sx={{ textAlign: 'left', display: 'inline-block' }}>
        <li>
          Open the <strong>`src/firebase.js`</strong> file in your editor.
        </li>
        <li>
          Replace the placeholder values with your actual Firebase project
          credentials.
        </li>
      </Box>
    </Paper>
  </Container>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const configured = isFirebaseConfigured();
  const { mode, toggleTheme, theme } = useContext(ThemeContext);
  const { user, logout, loading } = useContext(AuthContext);
  const showNavbar = location.pathname !== '/' && configured;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar
        position="static"
        sx={{ background: 'linear-gradient(to right, #4a148c, #880e4f)' }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            NextGenHome
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {showNavbar && (
            <>
              {user ? (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button color="inherit" onClick={() => navigate('/auth')}>
                  Login / Sign Up
                </Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {configured ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user" element={<UserPanel />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/details/:id" element={<DetailsPage />} /> {/* Add DetailsPage route */}
          </Routes>
        ) : (
          <Routes>
            <Route path="*" element={<FirebaseNotConfigured />} />
          </Routes>
        )}
      </Container>
    </MuiThemeProvider>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
