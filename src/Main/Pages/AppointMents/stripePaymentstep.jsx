// import React, { useState } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Divider,
//   CircularProgress,
//   Paper,
//   Grid,
//   InputAdornment,
// } from '@mui/material';
// import { Email, Phone, Person } from '@mui/icons-material';
// import axios from 'axios';
// import { ApiEndPoint } from '../Component/utils/utlis';

// const StripePaymentStep = ({ onPaymentSuccess, lawyerId, amount, selectedLawyer, serviceType }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: '',
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [cardComplete, setCardComplete] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleCardChange = (event) => {
//     setCardComplete(event.complete);
//   };

//   const handlePayment = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!stripe || !elements) {
//       setError('Stripe not initialized');
//       setLoading(false);
//       return;
//     }

//     try {
//       const paymentData = {
//         ...form,
//         amount,
//         serviceType,
//         lawyerId,
//       };

//       const { data } = await axios.post(`${ApiEndPoint}payments/create-payment-intent`, paymentData);

//       const { clientSecret, paymentId } = data;

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement),
//           billing_details: {
//             name: form.name,
//             email: form.email,
//             phone: form.phone,
//           },
//         },
//       });

//       if (result.error) {
//         setError(result.error.message);
//       } else {
//         if (result.paymentIntent.status === 'succeeded') {
//           await axios.post(`${ApiEndPoint}/payments/update-status`, {
//             paymentId,
//             status: 'paid',
//           });

//           onPaymentSuccess({
//             ...paymentData,
//             paymentId,
//             paymentIntent: result.paymentIntent,
//           });
//         } else {
//           setError('Payment processing failed');
//         }
//       }
//     } catch (err) {
//       console.error('Payment error:', err);
//       setError(err.response?.data?.message || 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isFormValid = () => {
//     return form.name.trim() && form.email.match(/.+\@.+\..+/) && form.phone.trim() && cardComplete;
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
//       <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
//         Payment Details
//       </Typography>

//       <Box mb={3}>
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <Typography variant="subtitle2" color="text.secondary">
//               Lawyer
//             </Typography>
//             <Typography variant="body1">{selectedLawyer?.UserName || 'Not selected'}</Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Typography variant="subtitle2" color="text.secondary">
//               Service
//             </Typography>
//             <Typography variant="body1">{serviceType || 'Not specified'}</Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Divider sx={{ my: 1 }} />
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="subtitle2" color="text.secondary">
//               Amount
//             </Typography>
//             <Typography variant="h6" color="primary">
//               ${amount.toFixed(2)}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Box>

//       <form onSubmit={handlePayment}>
//         <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
//           Your Information
//         </Typography>

//         <TextField
//           name="name"
//           label="Full Name"
//           fullWidth
//           value={form.name}
//           onChange={handleChange}
//           margin="normal"
//           required
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Person color="action" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <TextField
//           name="email"
//           label="Email"
//           fullWidth
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           margin="normal"
//           required
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Email color="action" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <TextField
//           name="phone"
//           label="Phone Number"
//           fullWidth
//           value={form.phone}
//           onChange={handleChange}
//           margin="normal"
//           required
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <Phone color="action" />
//               </InputAdornment>
//             ),
//           }}
//         />

//         <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
//           Card Details
//         </Typography>

//         <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
//           <CardElement
//             options={{
//               style: {
//                 base: {
//                   fontSize: '16px',
//                   color: '#424770',
//                   '::placeholder': {
//                     color: '#aab7c4',
//                   },
//                 },
//                 invalid: {
//                   color: '#9e2146',
//                 },
//               },
//             }}
//             onChange={handleCardChange}
//           />
//         </Paper>

//         {error && (
//           <Typography color="error" sx={{ mb: 2 }}>
//             {error}
//           </Typography>
//         )}

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           size="large"
//           sx={{ mt: 2 }}
//           disabled={loading || !isFormValid()}
//         >
//           {loading ? <CircularProgress size={24} color="inherit" /> : `Pay $${amount.toFixed(2)}`}
//         </Button>
//       </form>
//     </Paper>
//   );
// };

// export default StripePaymentStep;
