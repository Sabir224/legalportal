import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

const PaymentConfirmationDialog = ({ open, onCancel, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      PaperProps={{
        sx: {
          textAlign: 'center',
          p: 3,
          borderRadius: '12px',
          border: '2px solid #d4af37',
          backgroundColor: 'rgba(24, 39, 62, 0.95)', // dark blue bg
          color: 'white', // white text
        },
      }}
    >
      <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#d4af37' }}>
        Confirm Payment
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{
            textAlign: 'center',
            fontSize: '1rem',
            color: 'white',
            mb: 2,
          }}
        >
          Are you sure you want to <b style={{ color: '#d4af37' }}>mark this payment as paid</b>?
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            borderColor: '#d4af37',
            color: '#d4af37',
            '&:hover': { borderColor: '#fff', color: '#fff' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#d4af37',
            color: '#18273e',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#b8962f' },
          }}
          autoFocus
        >
          Yes, Mark Paid
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentConfirmationDialog;
