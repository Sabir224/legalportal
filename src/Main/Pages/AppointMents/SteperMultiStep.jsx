import * as React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Avatar,
  Card,
  CardContent,
  Divider,
  styled,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Grid,
  InputAdornment,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import {
  PersonOutline,
  Schedule,
  LocationOn,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  CalendarToday,
  ReceiptLong,
  Email,
  Phone,
  CreditCard,
  Person,
  Star,
  Language,
  AccessTime,
  Work,
  AttachMoney,
  StarBorder,
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { ApiEndPoint } from '../Component/utils/utlis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressCard,
  faArrowLeft,
  faArrowRight,
  faCalendar,
  faCheck,
  faHome,
  faMailBulk,
  faMailReply,
  faMessage,
  faPhone,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { isToday } from 'date-fns';
import { CardElement, useElements, useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import getStripe from '../Component/utils/stripeConfiguration';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

// Initialize Stripe

const steps = ['Consultation Method', 'Service Type', 'Select Lawyer', 'Payment', 'Choose Date & Time', 'Confirmation'];

const StyledStepIcon = styled('div')(({ theme, active }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: active ? theme.palette.primary.main : theme.palette.grey[300],
  color: active ? theme.palette.common.white : theme.palette.text.secondary,
  fontWeight: 'bold',
}));

const StepIcon = ({ active, completed, icon }) => {
  return (
    <StyledStepIcon active={active || completed}>{completed ? <CheckCircle fontSize="small" /> : icon}</StyledStepIcon>
  );
};

function LegalConsultationStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [method, setMethod] = React.useState('');
  const [service, setService] = React.useState('');
  const [selectedLawyer, setSelectedLawyer] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [lawyers, setLawyers] = React.useState([]);
  const [lawyersDetails, setLawyersDetails] = React.useState();
  const [appointmentSlots, setAppointmentSlots] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [clientMessage, setClientMessage] = React.useState('');
  const [meetingLink, setMeetingLink] = React.useState('');
  const [confirmationData, setConfirmationData] = React.useState(null);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [appointmentDetails, setAppoinmentDetails] = React.useState(null);
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const [selectedTime, setSelectedTime] = React.useState(null);
  const [subject, setSubject] = React.useState('Meeting Confirmation');
  const [isProcessing, setIsProcessing] = useState(false);

  // Stripe hooks
  const stripe = useStripe();
  const elements = useElements();
  const { phone, name } = useParams();
  const [paymentForm, setPaymentForm] = React.useState({
    name: '',
    email: '',
    phone: '',
  });

  const [cardComplete, setCardComplete] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState('');
  const [paymentLoading, setPaymentLoading] = React.useState(false);
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const ref = searchParams.get('ref');
  // Popup states
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [popupcolor, setPopupcolor] = React.useState('popup');
  const [popupmessage, setPopupmessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [isPopupVisiblecancel, setIsPopupVisiblecancel] = React.useState(true);
  const [linkData, setLinkData] = React.useState(null);
  const [initialDataLoaded, setInitialDataLoaded] = React.useState(false);

  const services = [
    { name: 'Divorce', description: 'Marriage dissolution and related matters' },
    { name: 'Property', description: 'Real estate transactions and disputes' },
    { name: 'Criminal', description: 'Defense and legal representation' },
    { name: 'Immigration', description: 'Visa and citizenship processes' },
    { name: 'Corporate', description: 'Business formation and compliance' },
  ];
  React.useEffect(() => {
    console.groupCollapsed('[Payment Data Fetch] Initializing fetch');
    let isMounted = true;

    const fetchData = async () => {
      try {
        const { data: responseData } = await axios.get(`${ApiEndPoint}payments/paymentData/${ref}`);

        if (!isMounted) return;

        if (responseData?.success && responseData.data) {
          setData(responseData.data);
          const { payment, lawyer } = responseData.data;

          // Always set available data
          if (payment) {
            setMethod(payment.consultationType || '');
            setService(payment.serviceType || '');
          }

          if (lawyer) setSelectedLawyer(lawyer);

          // Determine step based on payment status and data
          if (payment?.status === 'paid') {
            if (payment.meetingDetails) {
              // Complete booking - show confirmation
              setConfirmationData({
                lawyer: lawyer,
                service: payment.serviceType,
                method: payment.consultationType,
                date: new Date(payment.meetingDetails.date),
                slot: payment.meetingDetails.slot,
                meetingLink: payment.meetingDetails.meetingUrl,
              });
              setActiveStep(5); // Confirmation
            } else {
              // Paid but no meeting - show scheduling
              setActiveStep(4); // Choose Date & Time
            }
          } else {
            // Not paid yet - determine where to resume
            if (payment?.consultationType && payment?.serviceType) {
              if (lawyer) {
                setActiveStep(3); // Payment
              } else {
                setActiveStep(2); // Select Lawyer
              }
            } else {
              // Start from beginning if critical data missing
              setActiveStep(0); // Consultation Method
            }
          }
        }
      } catch (error) {
        if (isMounted) console.log('Failed to load payment data:', error);
      } finally {
        if (isMounted) setInitialDataLoaded(true);
      }
    };

    if (ref) fetchData();

    return () => {
      isMounted = false;
    };
  }, [ref]);

  // Debug effect for state changes
  React.useEffect(() => {
    console.groupCollapsed('[State Debug] Current State');
    console.log('Active Step:', activeStep);
    console.log('Method:', method);
    console.log('Service:', service);
    console.log(
      'Selected Lawyer:',
      selectedLawyer
        ? {
            id: selectedLawyer._id,
            name: selectedLawyer.UserName,
            specialty: selectedLawyer.specialty,
          }
        : null
    );
    console.log('Confirmation Data:', confirmationData);
    console.log('Meeting Link:', meetingLink);
    console.log('Initial Data Loaded:', initialDataLoaded);
    console.log(
      'API Data:',
      data
        ? {
            paymentStatus: data.payment?.status,
            hasMeeting: !!data.payment?.meetingDetails,
            lawyerName: data.lawyer?.UserName,
          }
        : null
    );
    console.groupEnd();
  }, [activeStep, method, service, selectedLawyer, confirmationData, meetingLink, initialDataLoaded, data]);
  // Fetch lawyers from API
  React.useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${ApiEndPoint}getAllLawyers`);
        if (response.data && response?.data?.lawyers) {
          console.log('Lawyers:', response.data?.lawyers);
          setLawyers(response?.data?.lawyers);
        }
      } catch (err) {
        setError('Failed to fetch lawyers. Please try again.');
        console.error('Error fetching lawyers:', err);
      } finally {
        setLoading(false);
      }
    };

    if (activeStep >= 2 && lawyers.length === 0) {
      fetchLawyers();
    }
  }, [activeStep]);

  // Fetch appointments when lawyer or date changes
  const fetchAppointments = async (lawyerId) => {
    if (!lawyerId) return;

    setLoading(true);
    try {
      const appointmentsRes = await axios.get(`${ApiEndPoint}appointments/${lawyerId}`);

      if (!appointmentsRes.data || appointmentsRes.data.length === 0) {
        setError('No appointment data found.');
        setAppoinmentDetails(null);
        return;
      }

      console.log('Appointments Data:', appointmentsRes.data);

      let temp = { ...appointmentsRes.data[0] };

      appointmentsRes.data.forEach((element) => {
        if (element.availableSlots) {
          temp.availableSlots = [...(temp.availableSlots || []), ...element.availableSlots];
        }
      });

      setAppoinmentDetails(temp);
      setError(null); // Clear any previous error
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('No appointments found for the selected lawyer.');
        setAppoinmentDetails(null);
      } else {
        setError('An error occurred while fetching appointments.');
        console.error('Error fetching appointments:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeStep >= 3 && selectedLawyer && selectedDate) {
      fetchAppointments(selectedLawyer._id, selectedDate);
    }
  }, [activeStep, selectedLawyer, selectedDate]);

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleReset = () => {
    setActiveStep(0);
    setMethod('');
    setService('');
    setSelectedLawyer(null);
    setSelectedDate(new Date());
    setSelectedSlot(null);
    setAppointmentSlots([]);
    setClientMessage('');
  };
  const regenerateAndRedirect = async () => {
    try {
      // Call your API to generate new link
      const res = await axios.post(`${ApiEndPoint}generateLink`, {
        phone,
        name,
      });

      if (res.data?.success && res.data?.link) {
        // Redirect to new link in same window
        window.location.href = res.data.link;
      } else {
        console.error('Failed to generate new link:', res.data);
      }
    } catch (err) {
      console.error('Error generating link:', err);
    }
  };
  const onResetClick = async () => {
    await regenerateAndRedirect(); // This will reload the page to new URL
    //The rest of handleReset() won't run because page reloads
  };
  // Navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      fetchAppointments(selectedLawyer._id);
    }
  };
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Time slot click handler
  const handleTimeClick = (time, slot) => {
    setSelectedTime(time);
    setSelectedSlot(slot);
  };

  // Convert to 12-hour format
  const convertTo12HourFormat = (time) => {
    // Handle null, undefined, or empty string cases
    if (!time) return '';

    // Handle cases where time is already in 12-hour format
    if (typeof time !== 'string') return String(time);
    if (time.includes('AM') || time.includes('PM')) return time;

    const timeParts = time.split(':');
    if (timeParts.length < 2) return time;

    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1].split(' ')[0]; // Handle cases with seconds or timezone

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${hours}:${minutes.padStart(2, '0')} ${period}`;
  };

  const generateCalendarDates = () => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();
  const handleOpenPopup = (lawyer, slot) => {
    setSelectedLawyer(lawyer);
    setSelectedSlot(slot);
    setPopupmessage(
      `${subject} on ${new Intl.DateTimeFormat('en-US', options).format(selectedDate)} at ${convertTo12HourFormat(
        selectedTime
      )}?`
    );
    setPopupcolor('popup');
    setIsPopupVisible(true);
    setIsPopupVisiblecancel(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setClientMessage('');
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      setPaymentError('Payment system not ready');
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Card details not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: paymentForm.name,
          email: paymentForm.email,
          phone: phone,
        },
      });

      if (pmError) {
        setPaymentError(pmError.message);
        setIsProcessing(false);
        return;
      }

      // Create payment intent with all necessary data
      const { data } = await axios.post(`${ApiEndPoint}payments/create-payment-intent`, {
        ...paymentForm,
        amount: Number(selectedLawyer?.price) || 200, // Ensures it's a number
        serviceType: service,
        lawyerId: selectedLawyer?._id,
        consultationType: method,
        uniqueLinkId: ref || '',
        appointmentLink: window.location.href,
      });

      const { clientSecret, paymentId } = data;

      // Confirm payment
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setPaymentError(confirmError.message);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Prepare all data to save
        const paymentUpdateData = {
          paymentId,
          status: 'paid',
          paymentIntentId: paymentIntent.id,
          paymentMethodId: paymentIntent.payment_method,
        };

        // Update payment with all details
        await axios.post(`${ApiEndPoint}payments/update-status`, paymentUpdateData);

        // Store confirmation data for the UI
        setConfirmationData({
          lawyer: selectedLawyer,
          service,
          method,
          ...(selectedDate && { date: selectedDate }),
          ...(selectedSlot && { slot: selectedSlot }),
          clientMessage,
        });

        // Move to next step (schedule meeting if not done, or confirmation)
        setActiveStep((prev) => prev + 1);
      } else {
        setPaymentError(`Unexpected status: ${paymentIntent.status}`);
      }
    } catch (err) {
      setPaymentError(err.response?.data?.message || 'Payment failed. Please try again.');
      console.error('Payment error:', {
        message: err.message,
        response: err.response?.data,
        stack: err.stack,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedLawyer || !selectedDate || !selectedSlot) {
      console.error('Missing required data for booking:', {
        selectedLawyer,
        selectedDate,
        selectedSlot,
      });
      return;
    }

    setIsLoading(true);
    setIsPopupVisiblecancel(false);

    try {
      console.log('Starting appointment booking process...');

      // Prepare meeting date and time
      const meetingDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      const startTime24 = convertTo24Hour(selectedSlot.startTime);
      const endTime24 = convertTo24Hour(selectedSlot.endTime);

      console.log('Meeting details:', {
        date: meetingDate,
        startTime: startTime24,
        endTime: endTime24,
      });

      const meetingDetails = {
        summary: 'Legal Consultation',
        startTime: new Date(`${meetingDate}T${startTime24}:00`).toISOString(),
        endTime: new Date(`${meetingDate}T${endTime24}:00`).toISOString(),
        timeZone: 'Asia/Dubai',
      };

      // 1. Create meeting
      console.log('Creating meeting...');
      const meetingResponse = await axios.post(`${ApiEndPoint}CreateTeamMeeting`, meetingDetails).catch((err) => {
        console.error('Error creating meeting:', err.response?.data || err.message);
        throw err;
      });

      const meetingUrl = meetingResponse.data.meetingLink;
      setMeetingLink(meetingUrl);
      console.log('Meeting created successfully. URL:', meetingUrl);

      // Prepare slot update
      const slotId = selectedSlot?._id;
      if (!slotId) {
        console.error('Missing slot ID in selectedSlot:', selectedSlot);
        throw new Error('Missing slot ID');
      }

      let updatedSlot = {
        slot: slotId,
        isBooked: true,
        publicBooking: {
          name: paymentForm.name,
          phone: phone,
        }, // TODO: Replace with actual user ID
        meetingLink: meetingUrl,
      };
      console.log('Update slot Data before sending....:', updatedSlot);
      // Prepare confirmation data
      const confirmation = {
        lawyer: selectedLawyer,
        service,
        method,
        date: selectedDate,
        slot: selectedSlot,
        meetingLink: meetingUrl,
        clientMessage,
      };
      setConfirmationData(confirmation);

      // 2. Send confirmation email
      console.log('Preparing email data...');

      console.log('Lawyer:', selectedLawyer);
      const emailData = {
        to: selectedLawyer?.Email,
        subject: `New Appointment Booking - ${service}`,
        clientMessage: clientMessage || 'No additional message provided',
        meetingDetails: {
          lawyerName: selectedLawyer.UserName,
          service: service,
          date: selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time: selectedSlot.startTime,
          meetingLink: meetingUrl,
        },
        lawyerDetails: {
          _id: selectedLawyer?._id,
          UserName: selectedLawyer?.lawyerName,
        },
        clientDetails: {
          UserName: paymentForm.name, // Replace with dynamic value if available
          Phone: phone, // Replace with dynamic value if available
        },
        selectedTime: selectedSlot.startTime,
        formattedDate: selectedDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };

      const requestBody = {
        to: selectedLawyer?.Email,
        subject: `New Appointment Booking - ${service}`,
        client: {
          user: {
            UserName: paymentForm.name, // Same as above
            Phone: phone, // Same as above
          },
        },
        mailmsg: emailData,
        text: ``,
        html: null,
      };
      console.log('Email Data before sending:', requestBody);
      // Plain text email generator (optional)

      console.log('Sending email...');
      const response = await axios.post(`${ApiEndPoint}crm-meeting`, requestBody).catch((err) => {
        console.error('Error sending email:', err.response?.data || err.message);
        throw err;
      });

      if (response.status !== 200) {
        console.error('Unexpected response status from email API:', response.status);
        setPopupcolor('popupconfirm');
        setPopupmessage(`Meeting Schedule mail not sent (${response.status})`);
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 3. Update appointment slot
      console.log('Updating appointment slot...');
      const responseupdate = await axios
        .patch(`${ApiEndPoint}crmBookappointments/${selectedLawyer._id}/${slotId}`, updatedSlot)
        .catch((err) => {
          console.error('Error updating appointment slot:', err.response?.data || err.message);
          throw err;
        });

      console.log('Appointment booked successfully:', responseupdate.data);
      setIsEmailSent(true);
      setPopupcolor('popupconfirm');
      setPopupmessage('Meeting scheduled successfully!');
      const updateResponse = await axios.post(`${ApiEndPoint}payments/update-status`, {
        paymentId: data?.payment?._id, // From your earlier API call
        meetingDetails: {
          meetingUrl: meetingUrl,
          date: selectedDate,
          slot: selectedSlot,
        },
      });

      // 3. Update confirmation data
      setConfirmationData((prev) => ({
        ...prev,
        meetingLink: meetingUrl,
      }));

      setTimeout(() => {
        setIsPopupVisible(false);
        handleNext();
      }, 2000);
    } catch (err) {
      console.error('Error in handleConfirm:', {
        error: err.message,
        stack: err.stack,
        response: err.response?.data,
      });

      setError('Failed to book appointment. Please try again.');
      setPopupcolor('popupconfirm');
      setPopupmessage('Failed to book appointment');

      setTimeout(() => {
        setIsPopupVisible(false);
      }, 3000);
    } finally {
      setIsLoading(false);
      console.log('Booking process completed (success or failure)');
    }
  };

  const DetailItem = ({ icon, label, value, highlight }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, whiteSpace: 'nowrap' }}>
      {icon}
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(255,255,255,0.6)',
          mr: 0.5,
        }}
      >
        {label}:
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: highlight ? '#d4af37' : 'rgba(255,255,255,0.85)',
          fontWeight: highlight ? 500 : 400,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
  const availableSlotsMap =
    appointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      acc[dateStr] = slot.slots;
      return acc;
    }, {}) || {};

  const availableDatesInfo =
    appointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      const hasBookedSlot = slot.slots.some((timeSlot) => timeSlot.isBooked);
      acc[dateStr] = { isAvailable: true, hasBookedSlot };
      return acc;
    }, {}) || {};
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
      '&:hover fieldset': { borderColor: '#d4af37' },
      '&.Mui-focused fieldset': { borderColor: '#d4af37' },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
      '&.Mui-focused': { color: '#d4af37' },
    },
    '& .MuiInputBase-input': {
      color: 'white',
      py: 1.5,
    },
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              How would you like to consult?
            </Typography>
            <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
              <Card
                variant="outlined"
                sx={{
                  mb: 2,
                  borderColor: method === 'InPerson' ? '#d4af37' : 'divider',
                  backgroundColor: method === 'InPerson' ? 'rgba(212, 175, 55, 0.1)' : '#18273e',
                  '&:hover': {
                    borderColor: '#d4af37',
                  },
                }}
                onClick={() => setMethod('InPerson')}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <LocationOn
                      sx={{
                        mr: 2,
                        color: method === 'InPerson' ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                    <Box>
                      <Typography fontWeight="medium" sx={{ color: 'white' }}>
                        In-Person Meeting
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Meet at our office or your preferred location
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card
                variant="outlined"
                sx={{
                  borderColor: method === 'Online' ? '#d4af37' : 'divider',
                  backgroundColor: method === 'Online' ? 'rgba(212, 175, 55, 0.1)' : '#18273e',
                  '&:hover': {
                    borderColor: '#d4af37',
                  },
                }}
                onClick={() => setMethod('Online')}
              >
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Schedule
                      sx={{
                        mr: 2,
                        color: method === 'Online' ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                      }}
                    />
                    <Box>
                      <Typography fontWeight="medium" sx={{ color: 'white' }}>
                        Online Consultation
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Video call from the comfort of your home
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </RadioGroup>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              What legal service do you need?
            </Typography>
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': { color: '#d4af37' },
                  '&.MuiInputLabel-shrink': { color: '#d4af37' },
                }}
              >
                Select a service
              </InputLabel>
              <Select
                value={service}
                onChange={(e) => setService(e.target.value)}
                displayEmpty
                label="Select a service"
                sx={{
                  color: 'white !important',
                  '& .MuiSelect-select': {
                    color: 'white !important',
                    backgroundColor: '#18273e !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37 !important',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37 !important',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37 !important',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#d4af37 !important',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      backgroundColor: '#18273e !important',
                      color: 'white !important',
                      border: '1px solid #d4af37 !important',
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(212, 175, 55, 0.2) !important',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(212, 175, 55, 0.3) !important',
                          color: '#ffffff !important',
                        },
                        '& .MuiTypography-body2': {
                          color: 'rgba(255, 255, 255, 0.7) !important',
                        },
                      },
                    },
                  },
                }}
              >
                {services.map((service) => (
                  <MenuItem key={service.name} value={service.name}>
                    <Box>
                      <Typography fontWeight="medium" sx={{ color: 'inherit !important' }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7) !important' }}>
                        {service.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Select your preferred lawyer
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4, color: '#d4af37' }} />}
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                height: '50vh',
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#d4af37',
                  borderRadius: '10px',
                },
              }}
            >
              {lawyers.map((lawyer) => (
                <Card
                  key={lawyer._id}
                  variant="outlined"
                  sx={{
                    minHeight: '100px',
                    cursor: 'pointer',
                    borderColor: selectedLawyer?._id === lawyer._id ? '#d4af37' : 'rgba(255,255,255,0.1)',
                    backgroundColor:
                      selectedLawyer?._id === lawyer._id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(15, 26, 47, 0.7)',
                    '&:hover': {
                      backgroundColor: 'rgba(212, 175, 55, 0.08)',
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                    },
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                  onClick={() => setSelectedLawyer(lawyer)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Avatar
                        src={lawyer.ProfilePicture}
                        sx={{
                          width: 64,
                          height: 64,
                          border: '2px solid #2c3e50',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          flexShrink: 0,
                        }}
                      />

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {/* Top row: Name + Price */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              sx={{
                                color: '#fff',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {lawyer.UserName}
                            </Typography>
                            {lawyer.position && (
                              <Typography variant="caption" sx={{ color: '#d4af37', fontWeight: 500 }}>
                                {lawyer.position}
                              </Typography>
                            )}
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              backgroundColor: 'rgba(212, 175, 55, 0.15)',
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              flexShrink: 0,
                            }}
                          >
                            <AttachMoney sx={{ fontSize: 16, color: '#d4af37' }} />
                            <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 600 }}>
                              {lawyer.price || 200}/hr
                            </Typography>
                          </Box>
                        </Box>

                        {/* Details row */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1.2,
                            mb: lawyer.bio ? 1 : 0,
                          }}
                        >
                          <DetailItem
                            icon={<Work sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                            label="Specialty"
                            value={lawyer.specialty}
                          />
                          <DetailItem
                            icon={<AccessTime sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                            label="Experience"
                            value={lawyer.experience}
                          />
                          <DetailItem
                            icon={<Language sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                            label="Languages"
                            value={lawyer.language || 'N/A'}
                          />
                          <DetailItem
                            icon={<LocationOn sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />}
                            label="Location"
                            value={lawyer.address.split(',')[0]}
                          />
                        </Box>

                        {/* Bio */}
                        {lawyer.bio && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.65)',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              lineHeight: 1.4,
                            }}
                          >
                            {lawyer.bio}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );
      case 3: // Payment Step
        return (
          <Box
            sx={{
              my: 4,
              color: 'white',
              maxWidth: '800px',
              mx: 'auto',
              px: { xs: 2, sm: 3 },
            }}
          >
            {/* Page Title */}
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: '#d4af37',
                fontWeight: 'bold',
                mb: 4,
                textAlign: 'center',
              }}
            >
              Complete Your Payment
            </Typography>

            {/* Summary Card */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#d4af37',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: '600',
                }}
              >
                <ReceiptLong fontSize="small" />
                Order Summary
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={selectedLawyer?.ProfilePicture}
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid #d4af37',
                      }}
                    />
                    <Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Lawyer
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 500,
                          color: 'white',
                        }}
                      >
                        {selectedLawyer?.UserName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Service
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'white' }}>
                    {service}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider
                    sx={{
                      borderColor: 'rgba(212, 175, 55, 0.3)',
                      my: 1,
                      borderBottomWidth: '1px',
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'transparent',
                      p: 2,
                      borderRadius: '8px',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      Total Amount
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#d4af37',
                        fontWeight: 'bold',
                      }}
                    >
                      ${selectedLawyer?.price || 200}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Form */}
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmPayment();
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {/* Personal Info Section */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '12px',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#d4af37',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: '600',
                  }}
                >
                  <PersonOutline fontSize="small" sx={{ color: '#d4af37' }} />
                  Personal Information
                </Typography>

                <Grid container spacing={2}>
                  {/* Full Name */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={paymentForm.name}
                      onChange={handlePaymentChange}
                      required
                      InputLabelProps={{
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          backgroundColor: '#18273e !important',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#d4af37',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#d4af37',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#d4af37',
                        },
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      name="email"
                      value={paymentForm.email}
                      onChange={handlePaymentChange}
                      required
                      InputLabelProps={{
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" sx={{ color: '#d4af37' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#d4af37',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#d4af37',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#d4af37',
                        },
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={paymentForm.phone}
                      onChange={handlePaymentChange}
                      required
                      InputLabelProps={{
                        style: {
                          color: 'rgba(255, 255, 255, 0.7)',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone fontSize="small" sx={{ color: '#d4af37' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          color: 'white',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.23)',
                          },
                          '&:hover fieldset': {
                            borderColor: '#d4af37',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#d4af37',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#d4af37',
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Card Payment Section */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '12px',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#d4af37',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: '600',
                  }}
                >
                  <CreditCard fontSize="small" sx={{ color: '#d4af37' }} />
                  Payment Details
                </Typography>

                <Box
                  sx={{
                    p: 2.5,
                    mb: 2,
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    borderRadius: '8px',
                    minHeight: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    '& .StripeElement': {
                      width: '100%',
                      padding: '10px 0',
                    },
                  }}
                >
                  {stripe && (
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#ffffff',
                            '::placeholder': { color: 'rgba(255, 255, 255, 0.6)' },
                            iconColor: '#d4af37',
                          },
                          invalid: {
                            color: '#ff5252',
                            iconColor: '#ff5252',
                          },
                        },
                        hidePostalCode: true,
                      }}
                      onChange={(e) => setCardComplete(e.complete)}
                    />
                  )}
                </Box>

                {paymentError && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      backgroundColor: 'rgba(255, 72, 66, 0.15)',
                      color: 'white',
                      border: '1px solid rgba(255, 72, 66, 0.5)',
                    }}
                  >
                    {paymentError}
                  </Alert>
                )}

                {/* Submit Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    disabled={
                      isProcessing || !paymentForm.name || !paymentForm.email || !paymentForm.phone || !cardComplete
                    }
                    sx={{
                      px: 3,
                      py: 1.2,
                      backgroundColor: '#d4af37',
                      color: '#18273e',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)',
                      '&:hover': { backgroundColor: '#c19b2e' },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(212, 175, 55, 0.4)',
                        color: '#18273e99',
                      },
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <CircularProgress size={20} sx={{ color: '#18273e', mr: 1.5 }} />
                        Processing...
                      </>
                    ) : (
                      `Pay $${selectedLawyer?.price || 200} Now`
                    )}
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        );

      case 4:
        return (
          <Box sx={{ my: 3, color: 'white' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              Select Date and Time
            </Typography>
            <Typography variant="body2" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Available times with {selectedLawyer?.UserName}
            </Typography>

            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4, color: '#d4af37' }} />}
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            {/* Custom Calendar */}
            <Box sx={{ mb: 3, border: '1px solid #d4af37', borderRadius: 2, p: 2, backgroundColor: '#18273e' }}>
              {/* Header Navigation */}
              <div className="d-flex justify-content-between align-items-center mt-5" style={{ gap: '10px' }}>
                <button className="calender-button" onClick={prevMonth}>
                  <FontAwesomeIcon icon={faArrowLeft} size="1x" color="white" />
                </button>
                <h3 className="text-white">
                  {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </h3>
                <button onClick={nextMonth} className="calender-button">
                  <FontAwesomeIcon icon={faArrowRight} size="1x" color="white" />
                </button>
              </div>
              {/* Days of the Week */}
              <div className="d-flex justify-content-between font-weight-bold my-2" style={{ gap: '3px' }}>
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="Calendarday"
                    style={{
                      border: '1px solid #d2a85a',
                      width: 'calc(100% / 7)',
                      textAlign: 'center',
                      color: 'white',
                      fontSize: 'clamp(0.6rem, 1.5vw, 0.8rem)',
                    }}
                  >
                    {day.substring(0, window.innerWidth < 400 ? 1 : 3)}
                  </div>
                ))}
              </div>
              {/* Calendar Dates */}
              <div className="d-flex flex-wrap">
                {(() => {
                  let firstAvailableSelected = false; // Local flag inside IIFE

                  return calendarDates.map((date, index) => {
                    if (!date) {
                      return (
                        <div
                          key={index}
                          className="calendarEmpty"
                          style={{ width: 'calc(100% / 7)', height: '40px' }}
                        ></div>
                      );
                    }

                    const dateStr = date.toDateString();
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const cellDate = new Date(date);
                    cellDate.setHours(0, 0, 0, 0);
                    const isFutureOrToday = cellDate >= today;
                    const dateInfo = availableDatesInfo[dateStr] || {};
                    const isAvailableDate = isFutureOrToday && dateInfo.isAvailable;

                    // ✅ Auto-select the first future/today available date if current date is NOT available
                    if (isAvailableDate && !selectedDate && !firstAvailableSelected) {
                      firstAvailableSelected = true;
                      setTimeout(() => handleDateClick(date), 0); // Call after render
                    }

                    const isSelected = selectedDate?.toDateString() === dateStr;

                    return (
                      <div
                        key={index}
                        onClick={isAvailableDate ? () => handleDateClick(date) : null}
                        className={`calendarDates ${isAvailableDate ? 'availableDate' : ''}`}
                        style={{
                          border: isSelected ? '2px solid white' : '2px solid rgb(2, 30, 58)',
                          borderRadius: '5px',
                          color: isAvailableDate ? 'white' : 'gray',
                          cursor: isAvailableDate ? 'pointer' : 'not-allowed',
                          background: isSelected ? '#d2a85a' : '',
                          textAlign: 'center',
                          lineHeight: '40px',
                          height: '40px',
                          fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                          width: 'calc(100% / 7)',
                        }}
                      >
                        {date.getDate()}
                      </div>
                    );
                  });
                })()}
              </div>
            </Box>

            {/* Time Slots */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: '#d4af37',
                borderRadius: 2,
                p: 2,
                maxHeight: 300,
                width: '100%',
                overflowY: 'auto',
                backgroundColor: '#18273e',
                color: 'white',
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#d4af37' }}>
                Available Slots
              </Typography>
              <Box
                className="gap-2"
                sx={{
                  marginLeft: '5px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                }}
              >
                {selectedDate ? (
                  availableSlotsMap[selectedDate.toDateString()]?.map((slot) => (
                    <button
                      key={slot._id}
                      onClick={() => {
                        handleTimeClick(slot.startTime, slot);
                        handleOpenPopup(selectedLawyer, slot);
                      }}
                      className="time-button"
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: '1px solid #d4af37',
                        background: slot.isBooked ? 'green' : selectedTime === slot.startTime ? '#d2a85a' : '#16213e',
                        color: 'white',
                        cursor: slot.isBooked ? 'not-allowed' : 'pointer',
                        fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                        width: '100%',
                      }}
                      disabled={slot.isBooked}
                      onMouseEnter={(e) => {
                        if (!slot.isBooked && selectedTime !== slot.startTime) {
                          e.target.style.background = '#d2a85a';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!slot.isBooked && selectedTime !== slot.startTime) {
                          e.target.style.background = '#16213e';
                        }
                      }}
                    >
                      {convertTo12HourFormat(slot.startTime)} - {convertTo12HourFormat(slot.endTime)}
                    </button>
                  ))
                ) : (
                  <Typography sx={{ color: '#d4af37' }}>Select a date to view available times</Typography>
                )}
              </Box>
            </Box>
          </Box>
        );

      case 5: // Confirmation Step
        return (
          <Box sx={{ my: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
              }}
            >
              <CheckCircle sx={{ mr: 1, color: '#4CAF50' }} />
              Appointment Confirmed
            </Typography>
            <Typography
              gutterBottom
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              Your consultation has been successfully scheduled
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mt: 3,
                border: '1px solid',
                borderColor: '#d4af37',
                borderRadius: 2,
                backgroundColor: '#18273e',
                color: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#d4af37' }}>
                Appointment Details
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar src={selectedLawyer?.ProfilePicture} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {selectedLawyer?.UserName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    {selectedLawyer?.specialty}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Service
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {service}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Consultation Type
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {method === 'InPerson' ? 'In-Person' : 'Online'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Date & Time
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {selectedDate?.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    • {convertTo12HourFormat(selectedSlot?.startTime || confirmationData.slot.startTime)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Fee
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {selectedLawyer?.price || '$200'}
                  </Typography>
                </Box>
              </Box>

              {method === 'Online' && (
                <>
                  <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#d4af37' }}>
                      Meeting Link
                    </Typography>
                    <Typography fontWeight="medium">
                      <a href={meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#d4af37' }}>
                        Join Meeting
                      </a>
                    </Typography>
                  </Box>
                </>
              )}

              {clientMessage && (
                <>
                  <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#d4af37' }}>
                      Your Message
                    </Typography>
                    <Typography fontWeight="medium" sx={{ color: 'white' }}>
                      {clientMessage}
                    </Typography>
                  </Box>
                </>
              )}

              <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />

              <Typography variant="body2" sx={{ mb: 1, color: '#d4af37' }}>
                A confirmation has been sent to your email.
              </Typography>
            </Paper>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4, position: 'relative' }}>
      {/* Popup Component */}
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className={popupcolor}>
            {!isLoading && !isEmailSent && (
              <>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: 'white',
                  }}
                >
                  {popupmessage}
                </h3>
                <textarea
                  placeholder="Text Message (Optional)"
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  style={{
                    width: '90%',
                    minHeight: '100px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    margin: '10px 0',
                    resize: 'vertical',
                  }}
                ></textarea>

                {isPopupVisiblecancel && (
                  <div className="popup-actions d-flex justify-content-center">
                    <button className="confirm-btn" onClick={handleConfirm}>
                      Yes
                    </button>
                    <button className="cancel-btn" onClick={handleClosePopup}>
                      No
                    </button>
                  </div>
                )}
              </>
            )}
            {isLoading && (
              <div className="loading-indicator" style={{ color: 'white' }}>
                <p>Sending...</p>
                <div className="spinner"></div>
              </div>
            )}
            {isEmailSent && (
              <div className="confirmation">
                <FontAwesomeIcon icon={faCheck} size="3x" color="white" className="m-2" />
              </div>
            )}
          </div>
        </div>
      )}

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: '#18273e',
          color: 'white',
          border: '1px solid #d4af37',
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            const isLastStep = index === steps.length - 1;
            const isStepActive = activeStep === index;
            const isStepCompleted = activeStep > index || (isLastStep && activeStep === index);

            return (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={({ icon }) => (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isStepCompleted
                          ? '#d4af37'
                          : isStepActive
                          ? 'rgba(212, 175, 55, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: isStepCompleted ? '#18273e' : isStepActive ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 'bold',
                        border: isStepActive ? '1px solid #d4af37' : 'none',
                      }}
                    >
                      {icon}
                    </Box>
                  )}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: isStepActive || isStepCompleted ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: isStepActive ? 'bold' : 'normal',
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Box sx={{ minHeight: 300 }}>{renderStepContent(activeStep)}</Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2,
          }}
        >
          {activeStep < steps.length - 1 ? (
            <Button
              endIcon={<ArrowForward />}
              variant="contained"
              onClick={handleNext}
              disabled={
                loading ||
                (activeStep === 0 && !method) ||
                (activeStep === 1 && !service) ||
                (activeStep === 2 && !selectedLawyer) ||
                (activeStep === 3 && (!selectedDate || !selectedSlot))
              }
              sx={{
                backgroundColor: '#d4af37',
                color: '#18273e',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#c19b2e',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(212, 175, 55, 0.5)',
                  color: 'rgba(24, 39, 62, 0.5)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#18273e' }} /> : 'Next'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={onResetClick}
              sx={{
                backgroundColor: '#d4af37',
                color: '#18273e',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#c19b2e',
                },
              }}
            >
              Book Another Appointment
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

// Wrap with Stripe Elements provider
export default LegalConsultationStepper;
