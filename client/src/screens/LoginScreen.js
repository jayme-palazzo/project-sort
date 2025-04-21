import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  AlertTitle,
  InputAdornment,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/inventory');
    } catch (error) {
      const errorType = error.response?.data?.errorType;
      const errorMessage = error.response?.data?.message;

      setError({
        type: errorType,
        message: errorMessage || 'An error occurred during login.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderErrorAlert = () => {
    if (!error) return null;

    return (
      <Collapse in={!!error}>
        <Alert 
          severity={error.type === 'EMAIL_NOT_FOUND' ? 'info' : 'error'}
          sx={{ mb: 2 }}
          action={
            error.type === 'EMAIL_NOT_FOUND' && (
              <Button
                color="inherit"
                size="small"
                component={RouterLink}
                to="/register"
              >
                Register
              </Button>
            )
          }
        >
          <AlertTitle>
            {error.type === 'EMAIL_NOT_FOUND' ? 'Account Not Found' : 
             error.type === 'INVALID_PASSWORD' ? 'Invalid Password' : 
             'Error'}
          </AlertTitle>
          {error.message}
        </Alert>
      </Collapse>
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Login to Prism
          </Typography>
          
          {renderErrorAlert()}

          <Box component="form" onSubmit={handleSubmit} noValidate>
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
              error={error?.type === 'EMAIL_NOT_FOUND'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error?.type === 'INVALID_PASSWORD'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginScreen;
