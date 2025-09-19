import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { ApiEndPoint } from '../Component/utils/utlis';

export default function BookConsultation() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${ApiEndPoint}generateLink`, {
        phone: formData.phone,
        name: formData.name,
      });

      if (res.data?.fullUrl) {
        const redirectUrl = `${res.data.fullUrl}&source=website`;
        window.location.href = redirectUrl;
      } else {
        setError('Failed to generate link. Try again.');
      }
    } catch (err) {
      setError('Error generating link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <Modal
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
        slotProps={{
          backdrop: {
            style: {
              backgroundColor: 'rgba(211, 211, 211, 0.6)', // soft light gray with transparency
            },
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          '&.MuiBackdrop-root-MuiModal-backdrop': {
            backgroundColor: 'white !important',
          },
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1b2a47, #0f172a)',
            border: '1px solid #d4af37',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            width: 400,
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ color: '#d4af37', textAlign: 'center', mb: 2 }}>
            Enter Your Details
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="name"
              label="Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                // Label styles
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white', // keep same on focus; change to '#d4af37' if you want gold on focus
                },

                // Input + outline styles
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'gray', // normal
                  },
                  '&:hover fieldset': { borderColor: '#d4af37' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#d4af37', // same on focus (so blur and focus remain same)
                  },
                },
              }}
            />

            <TextField
              fullWidth
              type="tel"
              name="phone"
              label="Phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              sx={{
                mb: 2,
                // Label styles
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white', // keep same on focus; change to '#d4af37' if you want gold on focus
                },

                // Input + outline styles
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'gray', // normal
                  },
                  '&:hover fieldset': { borderColor: '#d4af37' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#d4af37', // same on focus (so blur and focus remain same)
                  },
                },
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#d4af37',
                  color: 'black',
                  '&:hover': { bgcolor: '#c19b2e' },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Next'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
