
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NotificationContext } from '../context/NotificationContext';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const AuthPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const { login } = useContext(AuthContext); // Get the login function
  const [email, setEmail] = useState('2400030561@kluniversity.in');
  const [password, setPassword] = useState('123456');
  const [confirmPassword, setConfirmPassword] = useState('123456');
  const [role, setRole] = useState('user');
  const [isRegistering, setIsRegistering] = useState(true);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const clearForm = () => {
    setEmail('2400030561@kluniversity.in');
    setPassword('123456');
    setConfirmPassword('123456');
    setRole('user');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  const validate = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (isRegistering && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    if (isRegistering) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        showNotification('Account created successfully! Please log in.', 'success');
        setIsRegistering(false);
        clearForm();
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          setEmailError('This email is already in use.');
        } else {
          showNotification(error.message, 'error');
        }
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userData = {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          role: role, // Add the selected role
        };
        login(userData); // Update the authentication context
        showNotification('Logged in successfully!', 'success');
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } catch (error) {
        showNotification('Invalid email or password.', 'error');
      }
    }
  };

  return (
    <Grid container component="main" sx={{ height: '90vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: isRegistering
            ? 'url(https://images.pexels.com/photos/2092474/pexels-photo-2092474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
            : 'url(https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            {isRegistering ? 'Get Started' : 'Welcome Back!'}
          </Typography>
          <Typography component="h2" variant="subtitle1" color="text.secondary">
            {isRegistering
              ? 'Join us to get personalized home improvement advice.'
              : 'Sign in to continue to your dashboard.'}
          </Typography>
          <Box component="form" onSubmit={handleAuthAction} noValidate sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
            />
            {isRegistering && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
              />
            )}
            {!isRegistering && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </Button>
            <Grid container justifyContent="center">
              <Button onClick={() => { setIsRegistering(!isRegistering); clearForm(); }}>
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthPage;
