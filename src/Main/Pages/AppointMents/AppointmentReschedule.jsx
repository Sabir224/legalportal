import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Warning from '@mui/icons-material/Warning';
import { ApiEndPoint } from '../Component/utils/utlis';

export default function RescheduleConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canReschedule, setCanReschedule] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { phone, name } = useParams();
  const ref = searchParams.get('ref');

  const convertTo12HourFormat = (time) => {
    if (!time) return '';
    if (typeof time !== 'string') return String(time);
    if (time.includes('AM') || time.includes('PM')) return time;

    const timeParts = time.split(':');
    if (timeParts.length < 2) return time;

    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1].split(' ')[0];
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${hours}:${minutes.padStart(2, '0')} ${period}`;
  };

  const fetchAppointmentData = async () => {
    try {
      const { data: responseData } = await axios.get(`${ApiEndPoint}payments/paymentData/${ref}`);
      if (responseData?.success && responseData.data) {
        const { payment, lawyer } = responseData.data;
        if (payment?.meetingDetails) {
          const appointmentDate = new Date(payment.meetingDetails.date);
          const now = new Date();
          const timeDiff = (appointmentDate - now) / (1000 * 60);
          setConfirmationData({
            lawyer,
            service: payment.serviceType,
            method: payment.consultationType,
            paymentMethod: payment.paymentMethod,
            date: appointmentDate,
            slot: payment.meetingDetails.slot,
            meetingLink: payment.meetingDetails.meetingUrl,
            fee: payment.amount,
          });
          setCanReschedule(timeDiff > 30);
        }
      }
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ref) fetchAppointmentData();
  }, [ref]);

  const handleReschedule = () => {
    if (!canReschedule) return;
    setShowConfirmDialog(true);
  };

  const confirmReschedule = async () => {
    setShowConfirmDialog(false);
    // await axios.post(`${ApiEndPoint}payments/update-status`, {
    //   paymentId: paymentResponse?.paymentId,
    //   meetingDetails: '',
    // });
    navigate(
      `/clientAppointMent/${encodeURIComponent(phone)}/${encodeURIComponent(
        name.replace(/\s+/g, '-')
      )}?ref=${encodeURIComponent(ref)}`
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress sx={{ color: '#d4af37' }} />
      </Box>
    );
  }

  if (!confirmationData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          background: 'linear-gradient(135deg, #0f172a, #071029)',
        }}
      >
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1b2a47, #0f172a)',
            color: 'white',
            borderRadius: 3,
            maxWidth: 700,
            mx: 'auto',
          }}
        >
          <Warning sx={{ fontSize: 40, mb: 1, color: '#d4af37' }} />
          <Typography variant="h6" gutterBottom sx={{ color: '#d4af37' }}>
            Unable to load appointment details
          </Typography>
          <Button
            onClick={() => navigate('/')}
            variant="outlined"
            sx={{
              color: '#d4af37',
              borderColor: '#d4af37',
              mt: 2,
              '&:hover': { borderColor: '#c19b2e', color: '#c19b2e' },
            }}
          >
            Return to Home
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 720 }}>
        {/* Main Card - header INCLUDED inside this Paper */}
        <Paper
          sx={{
            p: 3,
            background: 'linear-gradient(135deg, #1b2a47, #0f172a)',
            borderRadius: 3,
            border: '1px solid #d4af37',
            boxShadow: '0px 8px 30px rgba(0,0,0,0.5)',
            color: 'white',
          }}
        >
          {/* Header (inside the Card) */}
          <Box sx={{ textAlign: 'center', mb: 3, borderRadius: 2, p: 1 }}>
            <CheckCircle sx={{ fontSize: 48, color: canReschedule ? '#4CAF50' : '#ff9800', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
              {canReschedule ? 'Reschedule Your Appointment' : 'Reschedule Not Available'}
            </Typography>
            <Typography sx={{ mt: 0.5, color: '#d4af37' }}>
              {canReschedule
                ? 'You can reschedule until 30 minutes before the appointment.'
                : 'This appointment starts within 30 minutes and can no longer be rescheduled.'}
            </Typography>
          </Box>

          {/* Lawyer Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={confirmationData.lawyer?.ProfilePicture}
              sx={{ width: 72, height: 72, border: '2px solid #d4af37' }}
            />
            <Box>
              <Typography variant="h6">{confirmationData.lawyer?.UserName}</Typography>
              <Typography variant="body2" sx={{ color: '#d4af37' }}>
                {confirmationData.lawyer?.specialty}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3, backgroundColor: '#d4af37' }} />

          {/* Appointment Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {[
              { label: 'Service', value: confirmationData.service },
              { label: 'Consultation Type', value: confirmationData.method === 'InPerson' ? 'In-Person' : 'Online' },
              {
                label: 'Date & Time',
                value: `${confirmationData.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })} • ${convertTo12HourFormat(confirmationData.slot?.startTime)}`,
              },
              {
                label: 'Payment Method',
                value: confirmationData.paymentMethod === 'PayInOffice' ? 'Pay at Office' : 'Credit Card',
              },
            ].map((item, idx) => (
              <Box key={idx}>
                <Typography variant="body2" sx={{ color: '#d4af37' }}>
                  {item.label}
                </Typography>
                <Typography fontWeight="medium">{item.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => setShowConfirmDialog(true)}
            disabled={!canReschedule}
            sx={{
              mt: 3,
              backgroundColor: canReschedule ? '#d4af37' : '#6d6d6d',
              color: '#18273e',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: canReschedule ? '#c19b2e' : '#6d6d6d' },
            }}
          >
            {canReschedule ? 'Reschedule Appointment' : 'Reschedule Not Available'}
          </Button>
        </Paper>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#18273e',
            color: 'white',
            border: '1px solid #d4af37',
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: '#d4af37', fontWeight: 'bold' }}>Confirm Reschedule</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reschedule your appointment with {confirmationData.lawyer?.UserName}?
          </Typography>
          <Typography sx={{ mt: 1, fontSize: '0.9rem', color: '#aaaaaa' }}>
            Current appointment: {confirmationData.date.toLocaleDateString()} at{' '}
            {convertTo12HourFormat(confirmationData.slot?.startTime)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} sx={{ color: '#d4af37' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowConfirmDialog(false);
              confirmReschedule();
            }}
            variant="contained"
            sx={{
              backgroundColor: '#d4af37',
              color: '#18273e',
              '&:hover': { backgroundColor: '#c19b2e' },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
