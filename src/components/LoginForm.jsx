// src/components/LoginForm.jsx
import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from '@mui/material';

function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:8081/api/auth/authenticateuser', {
        ...formData,
        isSignup: false
      });

      setMessage({
        text: response.data.message,
        type: 'success'
      });

      // If login is successful, pass the user data to parent component
      if (response.data.success) {
        onLoginSuccess(response.data.user);
      }
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || 'Error connecting to server',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400,
          margin: '0 auto'
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Login
        </Typography>

        <TextField
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />

        <TextField
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>

        {message && (
          <Alert severity={message.type} sx={{ mt: 2 }}>
            {message.text}
          </Alert>
        )}
      </Box>
    </Paper>
  );
}

export default LoginForm;