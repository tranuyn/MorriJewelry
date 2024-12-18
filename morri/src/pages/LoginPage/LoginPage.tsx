import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControlLabel,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import googleIcon from '../../assets/constant/google-icon.png';
import loginImage from '../../assets/constant/login.jpg';
import './LoginPage.css';

interface LoginFormState {
  email: string;
  password: string;
  showPassword: boolean;
  rememberMe: boolean;
  emailError: string;
  passwordError: string;
}

const Login: React.FC = () => {
  const [formState, setFormState] = useState<LoginFormState>({
    email: '',
    password: '',
    showPassword: false,
    rememberMe: false,
    emailError: '',
    passwordError: ''
  });

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (prop: keyof LoginFormState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormState(prev => ({
      ...prev,
      [prop]: value,
      ...(prop === 'email' && {
        emailError: value && !validateEmail(value) ? 'Email không hợp lệ' : ''
      }),
      ...(prop === 'password' && {
        passwordError: value && value.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : ''
      })
    }));
  };

  const handleClickShowPassword = () => {
    setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleRememberMe = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({ ...prev, rememberMe: event.target.checked }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Final validation before submit
    const emailError = !validateEmail(formState.email) ? 'Email không hợp lệ' : '';
    const passwordError = formState.password.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : '';

    setFormState(prev => ({
      ...prev,
      emailError,
      passwordError
    }));

    if (!emailError && !passwordError) {
      console.log('Form submitted:', formState);
    }
  };

  return (
    <Box className="login-page">
      <Box className="login-container">
        {/* Left side - Image */}
        <Box className="image-section">
          <img 
            src={loginImage} 
            alt="Jewelry Model" 
            className="side-image"
          />
        </Box>

        {/* Right side - Login Form */}
        <Box className="form-section">
          <Box className="form-container">
            <Typography component="h1" variant="h4" className="login-title" style={{ fontWeight: 1700 }}>
              <strong>Đăng nhập</strong>
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} className="login-form">
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                placeholder="Nhập email"
                variant="outlined"
                margin="normal"
                value={formState.email}
                onChange={handleChange('email')}
                error={!!formState.emailError}
                helperText={formState.emailError}
                className="form-field"
              />

              <TextField
                required
                fullWidth
                id="password"
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                type={formState.showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={formState.password}
                onChange={handleChange('password')}
                error={!!formState.passwordError}
                helperText={formState.passwordError}
                className="form-field"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />

              <Box className="form-controls">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formState.rememberMe}
                      onChange={handleRememberMe}
                      color="primary"
                    />
                  }
                  label="Ghi nhớ tài khoản"
                />
                <Button
                  variant="text"
                  className="forgot-password"
                >
                  Quên mật khẩu?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
              >
                Đăng nhập
              </Button>

              <Box className="divider-container">
                <Divider className="divider">
                  <Typography color="textSecondary">hoặc</Typography>
                </Divider>
              </Box>

              <Button
                    fullWidth
                    variant="outlined"
                    startIcon={
                        <img 
                        src= {googleIcon}
                        alt="Google Icon" 
                        className="google-icon" 
                        style={{ width: '20px', height: '20px' }} // Điều chỉnh kích thước nếu cần
                        />
                    }
                    className="google-button"
            >
                Đăng nhập bằng Google
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;