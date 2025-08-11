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
  GlobalStyles,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  HelpOutline,
  ExpandMore,
  WhatsApp,
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
  const [helpOpen, setHelpOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PayOnline');
  const dateOptions = {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const steps = [
    'Service Type',
    'Select Lawyer',
    'Choose Date & Time',
    'Consultation Method',
    'Payment',
    'Confirm Appointment',
    'Success', // Add this
  ];
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
            setService(payment.serviceType || '');
            setMethod(payment.consultationType || '');
            setPaymentMethod(payment.paymentMethod || 'Card');
          }

          if (lawyer) setSelectedLawyer(lawyer);

          // Determine step based on payment method and status
          if (payment) {
            // Case 1: Pay at Office - skip to confirmation if meeting details exist
            if (payment.paymentMethod === 'PayInOffice') {
              if (payment.meetingDetails) {
                setConfirmationData({
                  lawyer: lawyer,
                  service: payment.serviceType,
                  method: payment.consultationType,
                  paymentMethod: payment.paymentMethod,
                  date: new Date(payment.meetingDetails.date),
                  slot: payment.meetingDetails.slot,
                  meetingLink: payment.meetingDetails.meetingUrl,
                });
                setActiveStep(6); // Confirmation
              } else {
                // No meeting details yet - proceed to scheduling
                setActiveStep(2); // Date & Time selection
              }
            }
            // Case 2: Online Payment - check payment status
            else if (payment.paymentMethod === 'Card') {
              if (payment.status === 'paid') {
                if (payment.meetingDetails) {
                  // Complete booking - show confirmation
                  setConfirmationData({
                    lawyer: lawyer,
                    service: payment.serviceType,
                    method: payment.consultationType,
                    paymentMethod: payment.paymentMethod,
                    date: new Date(payment.meetingDetails.date),
                    slot: payment.meetingDetails.slot,
                    meetingLink: payment.meetingDetails.meetingUrl,
                  });
                  setActiveStep(6); // Confirmation
                } else {
                  // Paid but no meeting - skip to date/time selection
                  setActiveStep(2); // Date & Time
                }
              } else {
                // Not paid yet - go to payment step
                setActiveStep(4); // Payment
              }
            }
          } else {
            // No payment record - start from beginning
            setActiveStep(0); // Service selection
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
          // Filter lawyers based on selected service (expertise) and available slots
          const filteredLawyers = response.data.lawyers.filter((lawyer) => {
            // 1. Check if lawyer matches selected service expertise
            const matchesExpertise = !service || lawyer.specialty.toLowerCase().includes(service.toLowerCase());

            // 2. Check if lawyer has available slots
            const hasSlots = lawyer.hasAvailableSlots;

            return matchesExpertise && hasSlots;
          });

          setLawyers(filteredLawyers);
        }
      } catch (err) {
        setError('Failed to fetch lawyers. Please try again.');
        console.error('Error fetching lawyers:', err);
      } finally {
        setLoading(false);
      }
    };

    // Changed from activeStep >= 2 to activeStep >= 1 since Select Lawyer is now Step 1
    if (activeStep >= 1 && lawyers.length === 0 && service) {
      fetchLawyers();
    }
  }, [activeStep, service, lawyers.length]); // Added lawyers.length to dependencies

  // Fetch appointments when lawyer is selected (for Date/Time step)
  const fetchAppointments = async (lawyerId, date) => {
    if (!lawyerId) return;

    setLoading(true);
    try {
      const appointmentsRes = await axios.get(`${ApiEndPoint}appointments/${lawyerId}`);

      if (!appointmentsRes.data || appointmentsRes.data.length === 0) {
        setError('No appointment data found.');
        setAppoinmentDetails(null);
        return;
      }

      // Combine all available slots from different appointment records
      const combinedAppointmentData = appointmentsRes.data.reduce((acc, element) => {
        if (element.availableSlots) {
          acc.availableSlots = [...(acc.availableSlots || []), ...element.availableSlots];
        }
        return acc;
      }, {});

      setAppoinmentDetails(combinedAppointmentData);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No appointments found for the selected lawyer.');
      } else {
        setError('An error occurred while fetching appointments.');
        console.error('Error fetching appointments:', err);
      }
      setAppoinmentDetails(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Changed from activeStep >= 3 to activeStep >= 2 since Date/Time is now Step 2
    if (activeStep >= 2 && selectedLawyer) {
      fetchAppointments(selectedLawyer._id);
    }
  }, [activeStep, selectedLawyer]); // Removed selectedDate from dependencies

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

  const handleNext = () => {
    // For free appointments after method selection
    if (activeStep === 3 && (selectedLawyer?.price === '0' || selectedLawyer?.price === '')) {
      setActiveStep(5); // Skip to confirmation
    }
    // For paid appointments that just need to select time slot
    else if (activeStep === 2 && data?.payment?.status === 'paid' && !data?.payment?.meetingDetails) {
      setActiveStep(5); // Skip to confirmation after selecting time
    } else {
      setActiveStep(activeStep + 1); // Normal step progression
    }
  };
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
      `${subject} on ${new Intl.DateTimeFormat('en-US', dateOptions).format(selectedDate)} at ${convertTo12HourFormat(
        selectedSlot?.startTime
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
    console.group('🔵 handleConfirmPayment - Start');
    console.log('Initial state:', {
      paymentForm,
      selectedLawyer,
      selectedSlot,
      selectedDate,
      method,
      paymentMethod,
      service,
      clientMessage,
    });

    try {
      // Common payment data
      const paymentData = {
        name: paymentForm.name,
        phone: paymentForm.phone,
        email: paymentForm.email,
        amount: Number(selectedLawyer?.price) || 200,
        serviceType: service,
        lawyerId: selectedLawyer?._id,
        consultationType: method,
        paymentMethod: paymentMethod === 'PayInOffice' ? 'PayInOffice' : 'Card',
        uniqueLinkId: ref || '',
        appointmentLink: window.location.href,
      };

      console.log('📦 Payment Data Prepared:', paymentData);

      // Handle Pay at Office flow (only for InPerson consultation)
      // In the main handleConfirmPayment function, replace the error throwing with:
      if (method === 'InPerson' && paymentMethod === 'PayInOffice') {
        console.log('⚙️ Processing InPerson PayInOffice flow');
        await handlePayInOfficeFlow(paymentData);
      } else if (paymentMethod === 'PayOnline') {
        console.log('⚙️ Processing Card Payment flow');
        await handleCardPaymentFlow(paymentData);
      } else {
        const errorMsg = `Unsupported combination: Consultation type ${method} with payment method ${paymentMethod}`;
        console.error('❌', errorMsg);
        setPaymentError('This payment method is not available for the selected consultation type');
        throw new Error(errorMsg);
      }

      throw new Error('Invalid payment method or consultation type combination');
    } catch (err) {
      console.error('❌ Main Error Handler:', {
        error: err,
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
      });
      setPaymentError(err.message || 'Payment processing failed');

      if (err.response) {
        console.error('🔍 Response Details:', {
          status: err.response.status,
          headers: err.response.headers,
          data: err.response.data,
        });
      }
    } finally {
      console.log('🏁 Final Cleanup - Setting isProcessing to false');
      setIsProcessing(false);
      console.groupEnd();
    }
  };

  // Helper function to handle Pay at Office flow
  const handlePayInOfficeFlow = async (paymentData) => {
    console.log('🔄 Calling create-payment-intent API');
    let paymentResponse;
    try {
      const response = await axios.post(`${ApiEndPoint}payments/create-payment-intent`, paymentData);
      console.log('✅ create-payment-intent Response:', response.data);
      paymentResponse = response.data;

      await axios.post(`${ApiEndPoint}payments/update-status`, {
        paymentId: paymentResponse?.paymentId,
        meetingDetails: {
          meetingUrl: 'meetingbooked',
          date: selectedDate,
          slot: selectedSlot,
        },
      });

      if (paymentResponse.isDuplicate) {
        console.log('🔄 Duplicate payment detected, using existing payment:', paymentResponse.paymentId);
      }
    } catch (err) {
      console.error('❌ create-payment-intent Error:', err.response?.data || err.message);
      throw err;
    }

    // Update slot booking
    console.group('📌 Updating Slot Booking for In-Person');
    const updatedSlot = {
      slot: selectedSlot?._id,
      isBooked: true,
      publicBooking: {
        name: paymentForm.name,
        phone: paymentForm.phone,
      },
    };

    console.log('🔄 Calling crmBookappointments PATCH with:', updatedSlot);
    try {
      const slotUpdateResponse = await axios.patch(
        `${ApiEndPoint}crmBookappointments/${selectedLawyer?._id}/${selectedSlot?._id}`,
        updatedSlot
      );
      console.log('✅ Slot Update Success:', slotUpdateResponse.data);
    } catch (slotErr) {
      console.error('❌ Slot Update Failed:', {
        error: slotErr.message,
        response: slotErr.response?.data,
        config: {
          url: slotErr.config?.url,
          data: slotErr.config?.data,
        },
      });
      throw slotErr;
    }
    console.groupEnd();

    // Send confirmation emails
    await sendConfirmationEmails(paymentResponse.paymentId);

    // Proceed to confirmation
    const confirmationPayload = {
      lawyer: selectedLawyer,
      service,
      method,
      paymentMethod: 'PayInOffice',
      paymentRecord: { _id: paymentResponse.paymentId },
      ...(selectedDate && { date: selectedDate }),
      ...(selectedSlot && { slot: selectedSlot }),
      clientMessage,
    };
    console.log('📝 Setting Confirmation Data:', confirmationPayload);
    setConfirmationData(confirmationPayload);

    console.log('➡️ Moving to Step 5');
    setActiveStep(5);
  };

  // Helper function to handle card payments (both Online and InPerson consultations)
  const handleCardPaymentFlow = async (paymentData) => {
    // Create payment method
    const cardElement = elements.getElement(CardElement);

    const { error: pmError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: paymentForm.name,
        email: paymentForm.email,
        phone: paymentForm.phone,
      },
    });

    if (pmError) {
      setPaymentError(pmError.message);
      throw new Error(pmError.message);
    }

    // Create payment intent
    const { data } = await axios.post(`${ApiEndPoint}payments/create-payment-intent`, paymentData);
    const { clientSecret, paymentId } = data;

    // Confirm payment
    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: stripePaymentMethod?.id,
    });

    if (confirmError) {
      setPaymentError(confirmError.message);
      throw new Error(confirmError.message);
    }

    if (paymentIntent.status !== 'succeeded') {
      const errorMsg = `Unexpected status: ${paymentIntent.status}`;
      setPaymentError(errorMsg);
      throw new Error(errorMsg);
    }

    // Prepare all data to save
    const paymentUpdateData = {
      paymentId,
      status: 'paid',
      paymentIntentId: paymentIntent.id,
      paymentMethodId: paymentIntent.payment_method,
      ...(method !== 'Online' && {
        meetingDetails: {
          ...(selectedDate && { date: selectedDate }),
          ...(selectedSlot && { slot: selectedSlot }),
        },
      }),
    };

    // Update payment with all details
    await axios.post(`${ApiEndPoint}payments/update-status`, paymentUpdateData);

    // For InPerson with Card payment, update the slot
    if (method === 'InPerson') {
      const updatedSlot = {
        slot: selectedSlot?._id,
        isBooked: true,
        publicBooking: {
          name: paymentForm.name,
          phone: paymentForm.phone,
        },
      };

      await axios.patch(`${ApiEndPoint}crmBookappointments/${selectedLawyer?._id}/${selectedSlot?._id}`, updatedSlot);
      // Send confirmation emails
      await sendConfirmationEmails(paymentId);
    }

    // Store confirmation data for the UI
    setConfirmationData({
      lawyer: selectedLawyer,
      service,
      method,
      paymentMethod: 'Card',
      ...(selectedDate && { date: selectedDate }),
      ...(selectedSlot && { slot: selectedSlot }),
      clientMessage,
      paymentRecord: { _id: paymentId },
    });

    // Move to confirmation step
    setActiveStep(5);
  };

  // Helper function to send confirmation emails
  const sendConfirmationEmails = async (paymentId) => {
    console.group('📧 Sending Confirmation Emails');
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(selectedDate);
    try {
      // Send lawyer email
      console.log('🔄 Sending Lawyer Email');
      const lawyerEmailPayload = {
        to: selectedLawyer?.Email,
        subject: `New ${method === 'Online' ? 'Online' : 'In-Person'} Appointment with ${paymentForm.name}`,
        text: 'Appointment details',
        mailmsg: {
          lawyerDetails: selectedLawyer,
          clientDetails: {
            UserName: paymentForm.name,
            Phone: paymentForm.phone,
            Email: paymentForm.email,
          },
          selectedTime: selectedTime,
          formattedDate: formattedDate,
          clientMessage,
          isInPerson: method === 'InPerson',
          officeAddress: '1602, H Hotel, Sheikh Zayed Road, Dubai',
          ...(method === 'Online' && { meetingUrl: 'Will be sent separately' }),
        },
        isClientEmail: false,
      };

      const lawyerEmailResponse = await axios.post(`${ApiEndPoint}crm-meeting`, lawyerEmailPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('✅ Lawyer Email Response:', lawyerEmailResponse.data);

      // Send client email if email provided
      if (paymentForm.email) {
        console.log('🔄 Sending Client Email');
        const clientEmailResponse = await axios.post(`${ApiEndPoint}crm-meeting`, {
          to: paymentForm.email,
          subject: `Your ${method === 'Online' ? 'Online' : 'In-Person'} Appointment Confirmation`,
          text: 'Appointment details',
          clientWhatsApp: phone,
          mailmsg: {
            lawyerDetails: selectedLawyer,
            clientDetails: {
              UserName: paymentForm.name,
              Phone: paymentForm.phone,
              Email: paymentForm.email,
            },
            selectedTime: selectedTime,
            formattedDate: formattedDate,
            clientMessage,
            isInPerson: method === 'InPerson',
            officeAddress: '1602, H Hotel, Sheikh Zayed Road, Dubai',
            rescheduleLink: `${window.location.origin}/reschedule/${encodeURIComponent(phone)}/${encodeURIComponent(
              name.replace(/\s+/g, '-')
            )}?ref=${encodeURIComponent(paymentId)}`,
            ...(method === 'Online' && { meetingUrl: 'Will be sent separately' }),
          },
          isClientEmail: true,
        });
        console.log('✅ Client Email Sent:', clientEmailResponse.data);
      } else {
        console.log('ℹ️ No client email provided - skipping client email');
      }
    } catch (emailErr) {
      console.error('❌ Email Sending Failed:', {
        error: emailErr.message,
        response: emailErr.response?.data,
      });
      // Continue even if email fails
    }
    console.groupEnd();
  };

  const handleConfirm = async () => {
    if (!selectedLawyer || !selectedDate || !selectedSlot) {
      console.error('❌ Missing required data for booking:', {
        selectedLawyer,
        selectedDate,
        selectedSlot,
      });
      return;
    }

    if (selectedSlot?.isBooked) {
      setPopupcolor('popupconfirm');
      setPopupmessage('This slot has already been booked. Please choose another one.');
      return;
    }

    setIsLoading(true);
    setIsPopupVisiblecancel(false);

    let meetingCreated = false;
    let slotUpdated = false;
    let meetingUrl = '';
    let emailSent = false;

    try {
      console.group('🔁 Booking Process Started');

      const meetingDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];

      const startTime24 = convertTo24Hour(selectedSlot.startTime);
      const endTime24 = convertTo24Hour(selectedSlot.endTime);
      const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(selectedDate);

      let startDateTime = new Date(`${meetingDate}T${startTime24}:00Z`);
      let endDateTime = new Date(`${meetingDate}T${endTime24}:00Z`);

      if (endDateTime <= startDateTime) {
        endDateTime.setDate(endDateTime.getDate() + 1);
      }

      const meetingDetails = {
        summary: 'Legal Consultation',
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        timeZone: 'Asia/Dubai',
      };

      // 🔹 Step 1: Create Teams Meeting
      try {
        console.group('📅 Creating Microsoft Teams Meeting');
        const meetingResponse = await axios.post(`${ApiEndPoint}CreateTeamMeeting`, meetingDetails);
        meetingCreated = true;
        meetingUrl = meetingResponse.data.meetingLink;
        setMeetingLink(meetingUrl);
        console.log('✅ Meeting created:', meetingUrl);
        console.groupEnd();
      } catch (err) {
        console.group('❌ Meeting Creation Failed');
        console.error('Error:', err.response?.data || err.message);
        console.groupEnd();
        throw new Error('Failed to create meeting link.');
      }

      // 🔹 Step 2: Send Email
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
          UserName: paymentForm.name,
          Phone: paymentForm.phone,
        },
        selectedTime: selectedSlot.startTime,
        formattedDate: formattedDate,
      };

      const requestBody = {
        to: selectedLawyer?.Email,
        subject: `New Appointment Booking - ${service}`,
        client: {
          user: {
            UserName: paymentForm.name,
            Phone: paymentForm,
          },
        },
        mailmsg: emailData,
        text: '',
        html: null,
      };
      try {
        console.group('📧 Sending Email Notification');
        const emailResponse = await axios.post(`${ApiEndPoint}crm-meeting`, requestBody);
        emailSent = true;
        console.log('✅ Lawyer  Email sent:', emailResponse.data);
        if (paymentForm.email) {
          console.log('🔄 Sending Client Email');
          const clientEmailResponse = await axios.post(`${ApiEndPoint}crm-meeting`, {
            to: paymentForm?.email,
            subject: `Your ${method === 'Online' ? 'Online' : 'In-Person'} Appointment Confirmation`,
            clientWhatsApp: phone,
            text: 'Appointment details',
            mailmsg: {
              lawyerDetails: selectedLawyer,
              clientDetails: {
                UserName: paymentForm?.name,
                Phone: paymentForm?.phone,
                Email: paymentForm?.email,
              },
              meetingLink: meetingUrl,
              selectedTime: selectedSlot.startTime,
              formattedDate: formattedDate,
              clientMessage,
              isInPerson: method === 'InPerson',
              officeAddress: '1602, H Hotel, Sheikh Zayed Road, Dubai',
              rescheduleLink: `${window.location.origin}/reschedule?appointmentId=${ref}`,
              ...(method === 'Online' && { meetingUrl: 'Will be sent separately' }),
            },
            isClientEmail: true,
          });
          console.log('✅ Client Email Sent:', clientEmailResponse.data);
          console.groupEnd();
        }
      } catch (emailErr) {
        console.group('⚠️ Email Failed');
        console.warn('Email error:', emailErr.response?.data || emailErr.message);
        console.groupEnd();
      }

      // 🔹 Step 3: Update Appointment Slot
      const slotId = selectedSlot?._id;
      if (!slotId) throw new Error('Missing slot ID');

      try {
        console.group('📌 Updating Slot Booking');
        const updatedSlot = {
          slot: slotId,
          isBooked: true,
          publicBooking: {
            name: paymentForm.name,
            phone: phone,
          },
          meetingLink: meetingUrl,
        };

        const responseupdate = await axios.patch(
          `${ApiEndPoint}crmBookappointments/${selectedLawyer?._id}/${slotId}`,
          updatedSlot
        );
        slotUpdated = true;
        console.log('✅ Slot updated:', responseupdate.data);
        console.groupEnd();
      } catch (err) {
        console.group('❌ Slot Update Failed');
        console.error('Error:', err.response?.data || err.message);
        console.groupEnd();
        throw new Error('Failed to update slot');
      }

      // 🔹 Step 4: Store Confirmation
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

      // 🔹 Step 5: Payment Update
      try {
        console.group('💰 Updating Payment Status');
        await axios.post(`${ApiEndPoint}payments/update-status`, {
          paymentId: data?.payment?._id,
          meetingDetails: {
            meetingUrl: meetingUrl,
            date: selectedDate,
            slot: selectedSlot,
          },
        });
        console.log('✅ Payment status updated');
        console.groupEnd();
      } catch (err) {
        console.group('⚠️ Payment Update Failed');
        console.error('Payment update error:', err.response?.data || err.message);
        console.groupEnd();
      }

      // Final popup message
      setIsEmailSent(true);
      setPopupcolor('popupconfirm');
      setPopupmessage(emailSent ? 'Meeting scheduled successfully!' : 'Meeting scheduled, but email was not sent.');

      setTimeout(() => {
        setIsPopupVisible(false);
        // Optionally move to a success step
        setActiveStep(6); // If you have a success step
      }, 2000);

      console.groupEnd(); // End main booking group
    } catch (err) {
      console.group('❌ Booking Process Failed');
      console.error('General Error:', err.message, err.stack);
      console.groupEnd();

      let errorMsg = 'Failed to book appointment. Please try again.';
      if (slotUpdated && !emailSent) {
        errorMsg = 'Slot was booked, but confirmation email failed to send.';
      } else if (meetingCreated && !slotUpdated) {
        errorMsg = 'Meeting was created, but slot booking failed.';
      }

      setError(errorMsg);
      setPopupcolor('popupconfirm');
      setPopupmessage(errorMsg);
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 3000);
    } finally {
      setIsLoading(false);
      console.log('📤 Booking process completed (success or error).');
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
  const handleFreeTimeSelection = (slot) => {
    setSelectedSlot(slot);
    setSelectedTime(slot.startTime);
  };
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Service Type
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              What legal service do you need?
            </Typography>
            <FormControl fullWidth>
              <InputLabel
                shrink={true}
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

      case 1: // Select Lawyer
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
                            <Typography variant="body2" sx={{ color: '#d4af37', fontWeight: 600 }}>
                              <Box component="span" sx={{ mr: 0.5 }}>
                                AED
                              </Box>
                              {lawyer.price || 200}/hr
                            </Typography>
                          </Box>
                        </Box>

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
                            label="Service"
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

      case 2: // Choose Date & Time
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

            {/* Personal Info Form for Free Appointments */}
            {selectedLawyer?.price === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
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
                  Your Information
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
                  availableSlotsMap[selectedDate.toDateString()]
                    ?.filter((slot) => !slot.isBooked) // ✅ Only include unbooked slots
                    .map((slot) => (
                      <button
                        key={slot._id}
                        onClick={() => {
                          if (selectedLawyer?.price === 0 || selectedLawyer?.price === '') {
                            handleFreeTimeSelection(slot);
                          } else {
                            handleTimeClick(slot.startTime, slot);
                          }
                        }}
                        className="time-button"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '5px',
                          border: '1px solid #d4af37',
                          background: selectedTime === slot.startTime ? '#d2a85a' : '#16213e',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: 'clamp(0.7rem, 2vw, 0.8rem)',
                          width: '100%',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedTime !== slot.startTime) {
                            e.target.style.background = '#d2a85a';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTime !== slot.startTime) {
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

            {/* Confirmation Button for Free Appointments */}
            {selectedLawyer?.price === '0' ||
              (selectedLawyer?.price === '' && selectedSlot && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleConfirm}
                    disabled={
                      !paymentForm.name || !paymentForm.email || !paymentForm.phone || !selectedSlot || isProcessing
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
                        Confirming...
                      </>
                    ) : (
                      `Confirm Free Appointment`
                    )}
                  </Button>
                </Box>
              ))}
          </Box>
        );

      case 3: // Consultation Method (Location)
        return (
          <Box sx={{ my: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
              How would you like to consult?
            </Typography>
            <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
              {/* In-Person Option */}
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
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography fontWeight="medium" sx={{ color: 'white' }}>
                          In-Person Meeting
                        </Typography>
                        {method === 'InPerson' && (
                          <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                            <ExpandMore />
                          </IconButton>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        Meet at our office or your preferred location
                      </Typography>

                      {method === 'InPerson' && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                          <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                            Payment Method:
                          </Typography>
                          <RadioGroup
                            value={paymentMethod}
                            onChange={(e) => {
                              setPaymentMethod(e.target.value);
                              // Clear card details if switching to PayInOffice
                              if (e.target.value === 'PayInOffice') {
                                try {
                                  const cardElement = elements.getElement(CardElement);
                                  if (cardElement) {
                                    cardElement.clear();
                                  }
                                } catch (error) {
                                  console.warn('Failed to clear card element:', error);
                                }
                              }
                            }}
                            sx={{
                              '& .MuiRadio-root': {
                                color: '#d4af37', // Radio button color
                                '&.Mui-checked': {
                                  color: '#d4af37', // Checked state color
                                },
                              },
                              '& .MuiFormControlLabel-label': {
                                color: 'white', // Label color
                              },
                            }}
                          >
                            <FormControlLabel
                              value="PayInOffice"
                              control={<Radio />}
                              label={<Typography sx={{ color: 'white' }}>Pay at Office</Typography>}
                              sx={{ mb: 1 }}
                            />
                            <FormControlLabel
                              value="PayOnline"
                              control={<Radio />}
                              label={<Typography sx={{ color: 'white' }}>Pay Online Now</Typography>}
                            />
                          </RadioGroup>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Online Option */}
              <Card
                variant="outlined"
                sx={{
                  borderColor: method === 'Online' ? '#d4af37' : 'divider',
                  backgroundColor: method === 'Online' ? 'rgba(212, 175, 55, 0.1)' : '#18273e',
                  '&:hover': {
                    borderColor: '#d4af37',
                  },
                }}
                onClick={() => {
                  setMethod('Online');
                  setPaymentMethod('PayOnline'); // Force PayOnline for online consultations
                }}
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
                      <Typography variant="body2" sx={{ color: '#d4af37', mt: 1 }}>
                        Payment will be processed online
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </RadioGroup>
          </Box>
        );
      case 4:
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
              {method === 'InPerson' && paymentMethod === 'PayInOffice'
                ? 'Complete Your Booking'
                : 'Complete Your Payment'}
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
                      Total Amount:
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#d4af37',
                        fontWeight: 'bold',
                        marginLeft: '10px',
                      }}
                    >
                      {'  '}AED {selectedLawyer?.price || 200}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Personal Info Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                borderRadius: '12px',
                mb: 4,
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
              <GlobalStyles
                styles={{
                  '.personal-info-scope input:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 1000px #18273e inset',
                    WebkitTextFillColor: 'white',
                    caretColor: 'white',
                    transition: 'background-color 5000s ease-in-out 0s',
                  },
                  '.personal-info-scope input:-webkit-autofill:focus': {
                    WebkitBoxShadow: '0 0 0 1000px #18273e inset',
                    WebkitTextFillColor: 'white',
                  },
                }}
              />
              <Grid className="personal-info-scope" container spacing={2}>
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline fontSize="small" sx={{ color: '#d4af37' }} />
                        </InputAdornment>
                      ),
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

            {/* Payment Section */}
            {method === 'InPerson' && paymentMethod === 'PayInOffice' ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  You'll pay AED {selectedLawyer?.price || 200} at the office on your appointment date
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing || !paymentForm.name || !paymentForm.email || !paymentForm.phone}
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
                    'Confirm Booking'
                  )}
                </Button>
              </Box>
            ) : (
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
                  {elements ? (
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
                  ) : (
                    <CircularProgress size={24} />
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

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={handleConfirmPayment}
                    disabled={
                      isProcessing ||
                      !paymentForm.name ||
                      !paymentForm.email ||
                      !paymentForm.phone ||
                      !cardComplete ||
                      !elements
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
                      `Pay ${selectedLawyer?.price || 200} AED Now`
                    )}
                  </Button>
                </Box>
              </Paper>
            )}
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
              Confirm Your Appointment
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
                    • {convertTo12HourFormat(selectedSlot?.startTime)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Fee
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    AED {selectedLawyer?.price || 'AED 200'}
                  </Typography>
                </Box>
              </Box>
              {method !== 'InPerson' && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={() => {
                      setPopupmessage(
                        `Confirm ${service} consultation with ${selectedLawyer?.UserName} on ${new Intl.DateTimeFormat(
                          'en-US',
                          options
                        ).format(selectedDate)} at ${convertTo12HourFormat(selectedSlot?.startTime)}?`
                      );
                      setPopupcolor('popup');
                      setIsPopupVisible(true);
                      setIsPopupVisiblecancel(true);
                    }}
                    sx={{
                      backgroundColor: '#d4af37',
                      color: '#18273e',
                      fontWeight: 'bold',
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: '#c19b2e',
                      },
                    }}
                  >
                    Confirm Appointment
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>
        );

      case 6: // Success Step
        return (
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <CheckCircle sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
            <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
              Appointment Confirmed!
            </Typography>
            {/* Add any additional success message or details */}
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4, position: 'relative' }}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Need help? Contact us" arrow disableInteractive disablePortal>
          <IconButton
            onClick={() => setHelpOpen(true)}
            sx={{
              backgroundColor: '#d4af37',
              color: '#18273e',
              '&:hover': {
                backgroundColor: '#c19b2e',
              },
            }}
          >
            <HelpOutline />
          </IconButton>
        </Tooltip>
      </Box>
      {/* Help Dialog */}
      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#18273e', // dark navy background
            color: '#fff', // white text
            borderRadius: 3,
            border: '2px solid #d4af37',
            boxShadow: 10,
            p: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: '#d4af37', fontWeight: 'bold' }}>Need Help?</DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Contact our support team for assistance:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              href="tel:+9714332205928"
              sx={{
                justifyContent: 'flex-start',
                color: '#d4af37',
                borderColor: '#d4af37',
                '&:hover': {
                  backgroundColor: '#d4af37',
                  color: '#18273e',
                },
              }}
            >
              Call us: +9714332205928
            </Button>

            <Button
              variant="outlined"
              startIcon={<Email />}
              href="mailto:support@aws-legalgroup.com"
              sx={{
                justifyContent: 'flex-start',
                color: '#d4af37',
                borderColor: '#d4af37',
                '&:hover': {
                  backgroundColor: '#d4af37',
                  color: '#18273e',
                },
              }}
            >
              Email us: support@aws-legalgroup.com
            </Button>

            <Button
              variant="outlined"
              startIcon={<WhatsApp />} // Make sure to import WhatsApp icon from @mui/icons-material
              href="https://wa.me/+9714332205928" // Replace with your WhatsApp number
              target="_blank"
              sx={{
                justifyContent: 'flex-start',
                color: '#d4af37',
                borderColor: '#d4af37',
                '&:hover': {
                  backgroundColor: '#d4af37',
                  color: '#18273e',
                },
              }}
            >
              WhatsApp: +9714332205928
            </Button>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setHelpOpen(false)}
            sx={{
              color: '#d4af37',
              '&:hover': {
                backgroundColor: '#d4af37',
                color: '#18273e',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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
                  {subject} on {new Intl.DateTimeFormat('en-US', options).format(selectedDate)} at{' '}
                  {convertTo12HourFormat(selectedSlot?.startTime)}
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
          {activeStep === steps.length - 1 ? (
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
          ) : (
            // Show Next button only for steps 0-3 (Service Type, Select Lawyer, Date & Time, Consultation Method)
            activeStep < 4 && (
              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                onClick={handleNext}
                disabled={
                  loading ||
                  (activeStep === 0 && !service) ||
                  (activeStep === 1 && !selectedLawyer) ||
                  (activeStep === 2 && (!selectedDate || !selectedSlot)) ||
                  (activeStep === 3 && !method)
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
            )
          )}
        </Box>
      </Paper>
    </Box>
  );
}

// Wrap with Stripe Elements provider
export default LegalConsultationStepper;
