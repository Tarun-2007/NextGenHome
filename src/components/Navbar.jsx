
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#333' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="home"
          component={Link}
          to="/"
          sx={{ mr: 2 }}
        >
          <HomeIcon />
        </IconButton>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          NextGenHome
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          {user && (
            <Button color="inherit" component={Link} to="/recommendations">
              Recommendations
            </Button>
          )}
          {user && user.role === 'admin' && (
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          )}
          {user ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
