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
} from '@mui/material';
import {
  PersonOutline,
  Schedule,
  LocationOn,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  CalendarToday,
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { ApiEndPoint } from '../Component/utils/utlis';
import { flex } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const steps = ['Consultation Method', 'Service Type', 'Select Lawyer', 'Choose Date & Time', 'Confirmation'];

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

export default function LegalConsultationStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [method, setMethod] = React.useState('');
  const [service, setService] = React.useState('');
  const [selectedLawyer, setSelectedLawyer] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [lawyers, setLawyers] = React.useState([]);
  const [appointmentSlots, setAppointmentSlots] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [clientMessage, setClientMessage] = React.useState('');
  const [meetingLink, setMeetingLink] = React.useState('');
  const [confirmationData, setConfirmationData] = React.useState(null);

  // Popup states
  const [isPopupVisible, setIsPopupVisible] = React.useState(false);
  const [popupcolor, setPopupcolor] = React.useState('popup');
  const [popupmessage, setPopupmessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEmailSent, setIsEmailSent] = React.useState(false);
  const [isPopupVisiblecancel, setIsPopupVisiblecancel] = React.useState(true);

  const services = [
    { name: 'Divorce', description: 'Marriage dissolution and related matters' },
    { name: 'Property', description: 'Real estate transactions and disputes' },
    { name: 'Criminal', description: 'Defense and legal representation' },
    { name: 'Immigration', description: 'Visa and citizenship processes' },
    { name: 'Corporate', description: 'Business formation and compliance' },
  ];

  // Fetch lawyers from API
  React.useEffect(() => {
    const fetchLawyers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${ApiEndPoint}getAllLawyers`);
        console.log('LAWyers:', response.data.lawyers);
        if (response.data && response.data.lawyers) {
          setLawyers(response.data.lawyers);
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
  const fetchAppointments = async (lawyerId, date) => {
    if (!lawyerId) return;

    setLoading(true);
    try {
      let response;
      if (lawyerId === 'All') {
        const formattedDate = date.toISOString().split('T')[0];
        response = await axios.get(`${ApiEndPoint}GetAllFreeAppointments/${formattedDate}`);
      } else {
        const formattedDate = date.toISOString().split('T')[0];
        response = await axios.get(`${ApiEndPoint}GetAllFreeAppointments/${formattedDate}?lawyerId=${lawyerId}`);

        console.log('LawyersAppointments:', response.data);
      }

      if (response.data) {
        setAppointmentSlots(response.data);
      }
    } catch (err) {
      setError('Failed to fetch appointment slots. Please try again.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeStep >= 3 && selectedLawyer && selectedDate) {
      fetchAppointments(selectedLawyer._id, selectedDate);
    }
  }, [activeStep, selectedLawyer, selectedDate]);

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const adjustedHours = hours % 12 || 12;
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

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

  const handleOpenPopup = (lawyer, slot) => {
    setSelectedLawyer(lawyer);
    setSelectedSlot(slot);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long', // e.g., Monday
      year: 'numeric',
      month: 'long', // e.g., July
      day: 'numeric',
    });

    const formattedTime = new Date(`1970-01-01T${slot.startTime}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    setPopupmessage(`Confirm appointment with ${lawyer.lawyerName} on ${formattedDate} at ${formattedTime}?`);

    setPopupcolor('popup');
    setIsPopupVisible(true);
    setIsPopupVisiblecancel(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setClientMessage('');
  };
  // Frontend request body construction

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
      const slotId = selectedSlot?._doc?._id;
      if (!slotId) {
        console.error('Missing slot ID in selectedSlot:', selectedSlot);
        throw new Error('Missing slot ID');
      }

      let updatedSlot = {
        slot: slotId,
        isBooked: true,
        publicBooking: {
          name: 'Client Name',
          phone: '6768900909',
        }, // TODO: Replace with actual user ID
        meetingLink: meetingUrl,
      };

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
      // Frontend request body construction
      console.log('Lawyer:', selectedLawyer);
      const emailData = {
        to: selectedLawyer?.LawyerDetails?.Email,
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
          UserName: 'Client Name', // Replace with dynamic value if available
          Phone: '997899090909', // Replace with dynamic value if available
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
        to: 'sabir@biit.edu.pk' || selectedLawyer?.LawyerDetails?.Email,
        subject: `New Appointment Booking - ${service}`,
        client: {
          user: {
            UserName: 'Client Name', // Same as above
            Phone: '997899090909', // Same as above
          },
        },
        mailmsg: emailData,
        text: `
New Appointment Notification
---------------------------

Service: ${service}
Client: Client Name
Date: ${emailData.formattedDate}
Time: ${selectedSlot.startTime}

Meeting Link: ${meetingUrl}

Client Phone: 997899090909
${clientMessage ? `Message: ${clientMessage}` : ''}
`,
        html: null,
      };

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
  // Return true if date is in available appointment list
  const isDateWithAvailableSlots = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return appointmentSlots.some(
      (slotGroup) => slotGroup.date === formattedDate && slotGroup.slots.some((slot) => !slot.isBooked)
    );
  };
  const availableDates = appointmentSlots
    .filter((group) => group.slots.some((slot) => !slot.isBooked))
    .map((group) => new Date(group.date));

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
              <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Select a service</InputLabel>
              <Select
                value={service}
                onChange={(e) => setService(e.target.value)}
                label="Select a service"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d4af37',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#d4af37',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      backgroundColor: '#18273e',
                      color: 'white',
                      border: '1px solid #d4af37',
                      '& .MuiMenuItem-root': {
                        '&:hover': {
                          backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(212, 175, 55, 0.4)',
                        },
                      },
                    },
                  },
                }}
              >
                {services.map((service) => (
                  <MenuItem key={service.name} value={service.name}>
                    <Box>
                      <Typography fontWeight="medium" sx={{ color: 'white' }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {lawyers.map((lawyer) => (
                <Card
                  key={lawyer._id}
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderColor: selectedLawyer?._id === lawyer._id ? '#d4af37' : 'divider',
                    backgroundColor: selectedLawyer?._id === lawyer._id ? 'rgba(212, 175, 55, 0.1)' : '#18273e',
                    '&:hover': {
                      borderColor: '#d4af37',
                    },
                  }}
                  onClick={() => setSelectedLawyer(lawyer)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={lawyer.ProfilePicture} sx={{ width: 56, height: 56 }} />
                      <Box flexGrow={1}>
                        <Typography fontWeight="medium" sx={{ color: 'white' }}>
                          {lawyer.UserName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {lawyer.specialty} • {lawyer.experience} experience
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Typography sx={{ color: '#d4af37', fontWeight: 'medium' }}>
                            ${lawyer.price || 200}/hr
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ my: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
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

            {/* Calendar */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: '#d4af37',
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#18273e',
                }}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    fetchAppointments(selectedLawyer._id, date);
                  }}
                  inline
                  minDate={new Date()} // disables past dates
                  highlightDates={availableDates} // visually highlight dates with free slots
                  calendarClassName="custom-calendar"
                  dayClassName={(date) => (date.getMonth() !== selectedDate.getMonth() ? 'outside-month' : undefined)}
                />
              </Box>
            </Box>

            {/* Time Slots */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: '#d4af37',
                borderRadius: 2,
                p: 2,
                maxHeight: 300,
                overflowY: 'auto',
                backgroundColor: '#18273e',
                color: 'white',
              }}
            >
              <Typography variant="subtitle1" gutterBottom sx={{ color: '#d4af37' }}>
                Available Slots on {selectedDate.toLocaleDateString()}
              </Typography>

              {appointmentSlots.length > 0 ? (
                appointmentSlots.map((lawyerData, i) => (
                  <Box key={i} sx={{ mb: 3 }}>
                    <Typography fontWeight="medium" sx={{ mb: 1, color: 'white' }}>
                      {lawyerData.lawyerName}
                    </Typography>

                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: '#d4af37' }}>Start Time</TableCell>
                          <TableCell sx={{ color: '#d4af37' }}>End Time</TableCell>
                          <TableCell align="center" sx={{ color: '#d4af37' }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lawyerData.slots
                          .filter((slot) => !slot.isBooked)
                          .map((slot, idx) => (
                            <TableRow
                              key={idx}
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                },
                                '& .MuiTableCell-root': {
                                  color: 'white',
                                  borderColor: 'rgba(212, 175, 55, 0.3)',
                                },
                              }}
                            >
                              <TableCell>{slot.startTime}</TableCell>
                              <TableCell>{slot.endTime}</TableCell>
                              <TableCell align="center">
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => handleOpenPopup(lawyerData, slot)}
                                  sx={{
                                    backgroundColor: '#d4af37',
                                    color: '#18273e',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                      backgroundColor: '#c19b2e',
                                    },
                                  }}
                                >
                                  Book
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: '#d4af37' }}>No available slots for selected date.</Typography>
              )}
            </Box>
          </Box>
        );
      case 4:
        return (
          <Box sx={{ my: 3 }}>
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
                <Avatar src={confirmationData?.lawyer?.image} sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {confirmationData?.lawyer?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    {confirmationData?.lawyer?.specialty}
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
                    {confirmationData?.service}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Consultation Type
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {confirmationData?.method === 'InPerson' ? 'In-Person' : 'Online'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Date & Time
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    {confirmationData?.date?.toLocaleDateString()} • {confirmationData?.slot?.startTime}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#d4af37' }}>
                    Fee
                  </Typography>
                  <Typography fontWeight="medium" sx={{ color: 'white' }}>
                    ${confirmationData?.lawyer?.price}
                  </Typography>
                </Box>
              </Box>

              {confirmationData?.method === 'Online' && (
                <>
                  <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#d4af37' }}>
                      Meeting Link
                    </Typography>
                    <Typography fontWeight="medium">
                      <a
                        href={confirmationData?.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#d4af37' }}
                      >
                        Join Meeting
                      </a>
                    </Typography>
                  </Box>
                </>
              )}

              {confirmationData?.clientMessage && (
                <>
                  <Divider sx={{ my: 2, backgroundColor: '#d4af37' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#d4af37' }}>
                      Your Message
                    </Typography>
                    <Typography fontWeight="medium" sx={{ color: 'white' }}>
                      {confirmationData.clientMessage}
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
      <style>
        {`
          .custom-calendar {
            background-color: #18273e;
            color: white;
            border: 1px solid #d4af37;
            border-radius: 10px;
            padding: 10px;
          }
          .react-datepicker__day,
          .react-datepicker__day-name,
          .react-datepicker__current-month {
            color: white !important;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--keyboard-selected {
            background-color: #d4af37 !important;
            color: #18273e !important;
          }
          .react-datepicker__header {
            background-color: #18273e !important;
            border-bottom: 1px solid #d4af37 !important;
          }
          .react-datepicker__navigation-icon::before {
            border-color: white !important;
          }
          .react-datepicker__day:hover {
            background-color: white !important;
            color: black !important;
          }
          .popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          .popup {
            background-color: #18273e;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 400px;
            text-align: center;
            color: white;
            border: 1px solid #d4af37;
          }
          .popupconfirm {
            background-color: #4CAF50;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 400px;
            text-align: center;
            color: white;
            border: 1px solid #d4af37;
          }
          .popup-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
          }
          .confirm-btn {
            background-color: #d4af37;
            color: #18273e;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            &:hover {
              background-color: #c19b2e;
            }
          }
          .cancel-btn {
            background-color: #f44336;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
          }
          .loading-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          .spinner {
            border: 4px solid rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            border-top: 4px solid #d4af37;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .confirmation {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          
.react-datepicker__day--disabled {
  color: white;
  background-color: #c2bfbf6f !important;
  cursor: not-allowed;
  opacity: 0.5;
}

.react-datepicker__day.outside-month {
  color: #888 !important;
  opacity: 0.3;
  pointer-events: none;
}

        `}
      </style>

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
                    border: '1px solid #d4af37',
                    borderRadius: '6px',
                    margin: '10px 0',
                    resize: 'vertical',
                    backgroundColor: '#18273e',
                    color: 'white',
                  }}
                ></textarea>

                {isPopupVisiblecancel && (
                  <div className="popup-actions">
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
              <div className="loading-indicator">
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
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={({ active, completed, icon }) => (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: completed
                        ? '#d4af37'
                        : active
                        ? 'rgba(212, 175, 55, 0.2)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: completed ? '#18273e' : active ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 'bold',
                      border: active ? '1px solid #d4af37' : 'none',
                    }}
                  >
                    {icon}
                  </Box>
                )}
                sx={{
                  '& .MuiStepLabel-label': {
                    color: activeStep >= index ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-completed': {
                      color: '#d4af37',
                    },
                    '&.Mui-active': {
                      color: '#d4af37',
                    },
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: activeStep >= index ? '#d4af37' : 'rgba(255, 255, 255, 0.7)',
                    fontWeight: activeStep === index ? 'bold' : 'normal',
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 300 }}>{renderStepContent(activeStep)}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
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
              onClick={handleReset}
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
