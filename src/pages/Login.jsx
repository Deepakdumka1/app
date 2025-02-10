import React, { useState } from 'react';

import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Facebook as FacebookIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    try {
      console.log(`Logging in with ${provider}`);
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="lg" className="login-container">
      <Box className="login-wrapper">
        <Paper elevation={3} className="login-paper">
          <Box className="login-content">
            <Box className="login-left">
              <Box className="login-header">
                <SchoolIcon className="login-logo" />
                <Typography variant="h4" className="login-title">
                  {isLogin ? 'Welcome Back!' : 'Join Us Today'}
                </Typography>
                <Typography variant="body1" color="textSecondary" className="login-subtitle">
                  {isLogin 
                    ? 'Continue your learning journey'
                    : 'Start your learning adventure'
                  }
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" className="login-alert">
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} className="login-form">
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="login-input"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon className="input-icon" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon className="input-icon" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon className="input-icon" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <Box className="social-login">
                  <Divider>
                    <Typography variant="body2" color="textSecondary">
                      Or continue with
                    </Typography>
                  </Divider>
                  
                  <Box className="social-buttons">
                    <Button
                      variant="outlined"
                      className="google-button"
                      onClick={() => handleSocialLogin('Google')}
                      startIcon={<GoogleIcon />}
                    >
                      Google
                    </Button>
                    <Button
                      variant="outlined"
                      className="github-button"
                      onClick={() => handleSocialLogin('GitHub')}
                      startIcon={<GitHubIcon />}
                    >
                      GitHub
                    </Button>
                    {/* <Button
                      variant="outlined"
                      className="facebook-button"
                      onClick={() => handleSocialLogin('Facebook')}
                      startIcon={<FacebookIcon />}
                    >
                      Facebook
                    </Button> */}
                  </Box>
                </Box>
              </Box>

              <Box className="switch-mode">
                <Typography variant="body2">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <Button
                    onClick={() => setIsLogin(!isLogin)}
                    className="switch-button"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Button>
                </Typography>
              </Box>
            </Box>

            {!isMobile && (
              <Box className="login-right">
                <Box className="feature-highlights">
                  <Typography variant="h3" className="highlight-title">
                    Campus Connect
                  </Typography>
                  <Typography variant="h6" className="highlight-subtitle">
                    Where Learning Meets Community
                  </Typography>
                  <Box className="highlight-points">
                    <Typography variant="body1">✨ Real-time collaboration</Typography>
                    <Typography variant="body1">🎯 Subject-focused study groups</Typography>
                    <Typography variant="body1">📚 Resource sharing</Typography>
                    <Typography variant="body1">🎥 Video study sessions</Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 