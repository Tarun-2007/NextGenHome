
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import { locationData } from '../data/locations';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyArea, setPropertyArea] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [isOtherState, setIsOtherState] = useState(false);

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setPropertyType('');
    setPropertyArea('');
    setSelectedState('');
    setSelectedCity('');
    setCities([]);
    setIsOtherState(false);
  };

  useEffect(() => {
    if (selectedState && selectedState !== 'Other') {
      setCities(locationData[selectedState] || []);
      setSelectedCity('');
      setIsOtherState(false);
    } else if (selectedState === 'Other') {
      setCities([]);
      setSelectedCity('');
      setIsOtherState(true);
    }
  }, [selectedState]);

  const handleLogin = () => {
    if (!email || !password) {
      showNotification('Please enter your email and password.', 'error');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      login(user);
      showNotification(`Welcome back, ${user.fullName}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } else {
      showNotification('Invalid email or password.', 'error');
    }
  };

  const handleRegister = () => {
    if (!email || !password || !fullName || !propertyType || !propertyArea || !selectedState || !selectedCity) {
      showNotification('Please fill out all fields.', 'error');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find((u) => u.email === email)) {
      showNotification('An account with this email already exists.', 'error');
      return;
    }

    const newUser = {
      email,
      password, // In a real app, this should be hashed
      fullName,
      propertyType,
      propertyArea,
      state: selectedState,
      city: selectedCity,
      role: 'user',
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    login(newUser);
    showNotification('Account created successfully!');
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1, // Allow the box to grow and fill the space
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '15px',
          width: '100%',
          maxWidth: isRegistering ? '700px' : '400px',
          transition: 'max-width 0.4s ease-in-out',
        }}
      >
        <Typography component="h1" variant="h4" color="primary" gutterBottom align="center">
          {isRegistering ? 'Create Account' : 'Login'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {isRegistering && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={isRegistering ? 6 : 12}>
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={isRegistering ? 6 : 12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            {isRegistering && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Property Type"
                    variant="outlined"
                    fullWidth
                    required
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Property Area (sq. ft.)"
                    variant="outlined"
                    fullWidth
                    required
                    value={propertyArea}
                    onChange={(e) => setPropertyArea(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>State</InputLabel>
                    <Select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      label="State"
                    >
                      {Object.keys(locationData).map((state) => (
                        <MenuItem key={state} value={state}>
                          {state}
                        </MenuItem>
                      ))}
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {isOtherState ? (
                    <TextField
                      label="City"
                      variant="outlined"
                      fullWidth
                      required
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    />
                  ) : (
                    <FormControl fullWidth required disabled={!selectedState}>
                      <InputLabel>City</InputLabel>
                      <Select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        label="City"
                      >
                        {cities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, py: 1.5 }}
              >
                {isRegistering ? 'Register' : 'Login'}
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 1 }}>
              <Button onClick={() => { setIsRegistering(!isRegistering); clearForm(); }}>
                {isRegistering
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
