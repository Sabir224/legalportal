import React, { useEffect, useState } from 'react';
import '../../../style/LawyerProfile.css';
import '../../../style/PortalTheme.css';

import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { ApiEndPoint } from '../../Pages/Component/utils/utlis';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import { ApiEndPoint } from "../../utils/utils";
import Contactprofile from '../Images/CHAT.png';

import ViewBookLawyerSlot from '../Component/ViewBookSlot';
import { Col, Row } from 'react-bootstrap';

import Dropdown from '../Component/Dropdown';
import SocketService from '../../../SocketService';

const PublicAppointment = ({ token }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState('');
  const [lawyerDetails, setLawyersDetails] = useState([]);
  const [ClientDetails, setClientDetails] = useState([]);
  const [user, setUser] = useState();
  const [selectedService, setSelectedService] = useState('All Services');
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isLawyerDropdownOpen, setIsLawyerDropdownOpen] = useState(false);

  const [date, setdate] = useState(null);
  const [getDay, setDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [popupmessage, setpopupmessage] = useState();
  const [popupcolor, setpopupcolor] = useState('popup');
  const [email, setEmail] = useState('raheemakbar999@gmail.com');
  const [subject, setSubject] = useState('Meeting Confirmation');

  const storedEmail = sessionStorage.getItem('Email');
  const [isEditing, setIsEditing] = useState(false);
  const [isCalender, setIsCalender] = useState(true);
  const [IsCalenderView, setCalenderView] = useState(false);
  const [slotbookuserid, setslotbookuserid] = useState('');

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('')}`;

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisiblecancel, setisPopupVisiblecancel] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [bgcolor, setbgcolor] = useState('green');
  const [AllLawyer, setAllLawyer] = useState([]);
  let alluser = { UserName: 'All' };
  const options = { weekday: 'long', month: 'long', day: 'numeric' }; // Format options
  let data;

  const [appointmentDetails, setAppointmentDetails] = useState({
    availableSlots: [],
  });

  const [DatabaseappointmentDetails, setDataAppointmentDetails] = useState();
  const [newTime, setNewTime] = useState(null);
  const [newStartTime, setNewStartTime] = useState(null);
  const [newEndTime, setNewEndTime] = useState(null);
  const [Updatedetails, setUpdatedetails] = useState();
  const [deleteslot, setdeleteslot] = useState();
  const [updatespecifcslot, setupdateslot] = useState();

  const [pic, setPic] = useState();
  const [profilePicBase64, setProfilePicBase64] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);

  const [ClientMessage, setClientMessage] = useState('');
  const [username, setUserName] = useState(user?.UserName);
  const [Bio, setBio] = useState(lawyerDetails?.Bio);
  const [Position, setPosition] = useState(lawyerDetails?.Position);
  const [Address, setAddress] = useState(lawyerDetails?.Address);
  const [phoneNumber, setPhoneNumber] = useState(lawyerDetails?.Contact);
  const [Editemail, setEditEmail] = useState(user?.Email);
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectfile, setselectfile] = useState('');
  const [activeTab, setActiveTab] = useState(token?.Role === 'lawyer' ? 'addslot' : 'ViewBookedSlot');
  const [showFiles, setShowFiles] = useState(false);

  const [message, setMessage] = useState('');
  const [isAddedorUpdated, setIsAddedorUpdated] = useState(false);
  const [IsAddpop, setIsAddpop] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState({ UserName: 'All' });
  const [showModal, setShowModal] = useState(false);
  const [meetingLink, setmeetingLink] = useState(null);
  const [slotLawyer, setSlotLawyer] = useState(null);

  const handleClose = () => {
    setShowModal(false);
  };
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
    setTimeout(() => setbgcolor(''), 2000);
    // ✅ Hide message after 5 seconds
  };

  useEffect(() => {
    if (!SocketService.socket || !SocketService.socket.connected) {
      console.log('🔌 Connecting to socket...');
      SocketService.socket.connect();
    }

    const handleMessagesDelivered = (data) => {
      fetchLawyerDetails();
    };

    SocketService.socket.off('slotHasBooked', handleMessagesDelivered);
    SocketService.onBookAppointment(handleMessagesDelivered);
  }, []);
  const hanldeEdit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Creating FormData object
    const formData = new FormData();
    formData.append('UserName', username);
    formData.append('Contact', phoneNumber);
    formData.append('Position', Position);
    formData.append('Bio', Bio);
    formData.append('Address', Address);
    formData.append('Role', token?.Role);

    formData.append('file', selectfile ? selectfile : null);

    try {
      const response = await axios.put(
        `${ApiEndPoint}users/updateLawyerDetails/${Editemail}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } } // Set content type
      );

      // alert("Lawyer details updated successfully!");

      if (typeof handleEdting === 'function') {
        handleEdting(); // Ensure `handleEdting` is defined before calling it
      }

      console.log('Updated Data:', response.data);
    } catch (error) {
      console.error('Update failed:', error.response?.data || error);
      //   alert("Failed to update lawyer details.");
    }
  };

  const handleCancel = async (e) => {
    setIsEditing(!isEditing);
  };

  // const handleFileInputChange = (event) => {
  //     console.log(event)
  //     const file = event.target.files[0];
  //     if (file) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //             const base64String = reader.result.split(",")[1];
  //             console.log("Base64:", base64String);
  //             setProfilePicBase64(base64String);
  //         };
  //         reader.readAsDataURL(file);
  //     }
  // };

  const availableSlotsMap =
    appointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      acc[dateStr] = slot.slots;
      return acc;
    }, {}) || {};

  const ExistSlotsMap =
    DatabaseappointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      acc[dateStr] = slot.slots;
      return acc;
    }, {}) || {};

  // const handleDateClick = (date) => {
  //     setSelectedDate(date);
  //     setSelectedTime(null); // Reset time selection when date changes
  //   };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('appointments'));
    if (storedAppointments) {
      setAppointmentDetails(storedAppointments);
    }
  }, []);

  useEffect(() => {
    //  setUser(global.User)
    setPic(user?.profilepic);
    handleGetFreeSlots(new Date());
    localStorage.setItem('appointments', JSON.stringify(appointmentDetails));
  }, []);

  const handleStartTimeChange = (time) => {
    setNewStartTime(time);
    setNewEndTime(new Date(time.getTime() + 60 * 60000)); // Default end time +30 mins
  };

  const generateMultipleTimeSlots = (startTime, endTime, formatTime) => {
    const slots = [];
    let current = new Date(startTime);
    const end = new Date(endTime);

    while (current < end) {
      let nextSlot = new Date(current.getTime() + 60 * 60000); // Move forward 60 minutes

      if (nextSlot > end) {
        nextSlot = new Date(end); // Adjust last slot
      }

      slots.push({
        startTime: formatTime(current),
        endTime: formatTime(nextSlot),
        isBooked: false,
      });

      if (nextSlot.getTime() === end.getTime()) {
        break;
      }

      current = new Date(nextSlot);
    }

    return slots;
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // const handleAddTimeSlot = async () => {
  //     if (selectedDate && newStartTime && newEndTime) {
  //         // ✅ Custom 12-hour AM/PM time formatter
  //         const formatTime = (date) => {
  //             let hours = date.getHours();
  //             let minutes = date.getMinutes();
  //             const ampm = hours >= 12 ? "PM" : "AM";
  //             hours = hours % 12 || 12; // convert 0 to 12
  //             minutes = minutes < 10 ? "0" + minutes : minutes;
  //             return `${hours}:${minutes} ${ampm}`;
  //         };

  //         console.log(newStartTime, "      =       ", newEndTime)
  //         if (newEndTime <= newStartTime) {
  //             return;
  //         }

  //         // ✅ Updated generateMultipleTimeSlots should use custom formatTime
  //         const newSlots = await generateMultipleTimeSlots(
  //             newStartTime,
  //             newEndTime,
  //             formatTime // pass it in if needed
  //         );

  //         let updatedAppointmentDetails;
  //         await setAppointmentDetails((prevDetails) => {
  //             const updatedSlots = [...prevDetails.availableSlots];
  //             const existingSlotIndex = updatedSlots.findIndex(
  //                 (slot) => slot.date === selectedDate.toDateString()
  //             );

  //             if (existingSlotIndex > -1) {
  //                 const existingSlots = updatedSlots[existingSlotIndex].slots;
  //                 newSlots.forEach((newSlot) => {
  //                     const slotExists = existingSlots.some(
  //                         (slot) => slot.startTime === newSlot.startTime
  //                     );
  //                     if (!slotExists) {
  //                         existingSlots.push(newSlot);
  //                     }
  //                 });
  //             } else {
  //                 updatedSlots.push({
  //                     date: selectedDate.toDateString(),
  //                     slots: newSlots,
  //                 });
  //             }

  //             updatedAppointmentDetails = { availableSlots: updatedSlots };
  //             return updatedAppointmentDetails;
  //         });

  //         await sleep(1000);

  //         setNewStartTime(null);
  //         setNewEndTime(null);

  //         const formatDate = (date) => {
  //             const year = date.getFullYear();
  //             const month = String(date.getMonth() + 1).padStart(2, "0");
  //             const day = String(date.getDate()).padStart(2, "0");
  //             return `${year}-${month}-${day}`;
  //         };

  //         console.log("Updated Appointment Details:", updatedAppointmentDetails);

  //         const formattedSlots = {
  //             availableSlots: updatedAppointmentDetails.availableSlots?.map((slot) => ({
  //                 date: formatDate(new Date(slot.date)),
  //                 slots: slot.slots?.map((slotTime) => ({
  //                     startTime: convertTo24HourFormat(slotTime.startTime),
  //                     endTime: convertTo24HourFormat(slotTime.endTime),
  //                     isBooked: slotTime.isBooked,
  //                 })),
  //             })),
  //         };

  //         console.log("Formatted Slots for API:", formattedSlots);

  //         try {
  //             const response = await axios.post(
  //                 `${ApiEndPoint}appointment/${user?._id}/add-availability`,
  //                 formattedSlots,
  //                 {
  //                     headers: {
  //                         "Content-Type": "application/json",
  //                     },
  //                 }
  //             );

  //             console.log("Post Appointment Data:", response.data);
  //             setError(null);
  //             if (response.data?.errorCode === 400) {
  //                 setbgcolor("red");
  //                 showMessage(response.data.message);
  //             } else {
  //                 setbgcolor("green");
  //                 await setIsAddpop(true);
  //                 setpopupcolor("popupconfirm");
  //                 await setIsAddedorUpdated(true);
  //                 setTimeout(() => {
  //                     setpopupcolor("popup");
  //                     setIsAddpop(false);
  //                     setIsAddedorUpdated(false);
  //                 }, 2000);
  //             }

  //             fetchLawyerDetails();
  //             setAppointmentDetails({ availableSlots: [] });
  //         } catch (error) {
  //             console.error(
  //                 "Error adding availability:",
  //                 error.response?.data || error.message
  //             );
  //             setError(error.message);
  //         }
  //     } else {
  //         // alert("Please select a date, start time, and end time");
  //     }
  // };

  const updateSlot = async () => {
    // slot update when is note
    let start = new Date(newStartTime);
    let end = new Date(newEndTime);
    const lawyerId = user?._id;
    const updatedSlot = {
      startTime: start.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      endTime: end.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      isBooked: false,
    };
    let slot = updatespecifcslot._id;
    // console.log("updatedSlot =", updatedSlot)
    // console.log("updatespecifcslot", slot)
    try {
      const response = await fetch(`${ApiEndPoint}appointments/${lawyerId}/${slot}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSlot),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update slot');
      }

      if (data?.errorCode === 400) {
        setbgcolor('red');
        showMessage(data.message);
      } else {
        setbgcolor('green');
        await setIsAddpop(true);
        setpopupcolor('popupconfirm');
        await setIsAddedorUpdated(true); // Set email sent confirmation
        setTimeout(() => {
          setpopupcolor('popup');
          setIsAddpop(false);
          // Close popup after showing confirmation
          setIsAddedorUpdated(false); // Reset confirmation state after a delay
        }, 2000);
      }

      fetchLawyerDetails();
      setEditingSlotIndex(null);
      setNewStartTime(null);
      setNewEndTime(null);
      setSelectedTime(null);
      console.log('Slot updated successfully:', data);
    } catch (error) {
      console.error('Error updating slot:', error.message);
    }
  };

  // const handleUpdateTimeSlot = () => {
  //   if (!newStartTime || !newEndTime || editingSlotIndex === null) {
  //     if (!window.alertTriggered) {
  //       window.alertTriggered = true;
  //       alert("Please select a valid start and end time.");
  //       setTimeout(() => {
  //         window.alertTriggered = false;
  //       }, 500);
  //     }
  //     return;
  //   }

  //   let slotUpdated = false; // Flag to track if a slot was updated

  //   const selectedDateStr = selectedDate.toDateString();
  //   const selectedDateSlots = appointmentDetails.availableSlots.find(
  //     (slot) => slot.date === selectedDateStr
  //   );

  //   if (!selectedDateSlots) return appointmentDetails;

  //   const newStartFormatted = newStartTime.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });
  //   const newEndFormatted = newEndTime.toLocaleTimeString([], {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: true,
  //   });

  //   const slotExists = selectedDateSlots.slots.some(
  //     (slot, index) =>
  //       index !== editingSlotIndex &&
  //       slot.startTime === newStartFormatted &&
  //       slot.endTime === newEndFormatted
  //   );

  //   if (slotExists) {
  //     if (!window.alertTriggered) {
  //       window.alertTriggered = true;
  //       alert("This time slot already exists! Update not allowed.");
  //       setTimeout(() => {
  //         window.alertTriggered = false;
  //       }, 500);
  //     }
  //     return appointmentDetails;
  //   }

  //   setAppointmentDetails((prevDetails) => {
  //     const updatedSlots = [...prevDetails.availableSlots];

  //     // Update slot
  //     selectedDateSlots.slots[editingSlotIndex] = {
  //       startTime: newStartFormatted,
  //       endTime: newEndFormatted,
  //       isBooked: false,
  //     };

  //     selectedDateSlots.slots.sort(
  //       (a, b) =>
  //         new Date(`1970/01/01 ${a.startTime}`) -
  //         new Date(`1970/01/01 ${b.startTime}`)
  //     );

  //     slotUpdated = true; // Set flag to true when update is successful
  //     return { availableSlots: updatedSlots };
  //   });

  //   if (slotUpdated) {
  //     setTimeout(() => alert("Time slot updated successfully!"), 100); // Show success alert
  //   }

  //   setEditingSlotIndex(null);
  //   setNewStartTime(null);
  //   setNewEndTime(null);
  // };

  useEffect(() => {
    fetchLawyerDetails();
  }, []);

  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // fetch("http://172.16.18.250:8080/api/upload") // Replace with your API URL
    //     .then((response) => response.json())
    //     .then((data) => setImageUrl(data.imageUrl)) // Adjust based on API response
    //     .catch((error) => console.error("Error fetching image:", error));
  }, []);

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    let period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for AM times
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  const fetchLawyerDetails = async () => {
    let lawyerId = '';
    try {
      const response = await axios.get(`${ApiEndPoint}geLawyerDetails/${token.email}`); // API endpoint
      setUser(response.data.user);
      await setLawyersDetails(response.data.lawyerDetails);
      lawyerId = response.data?.user._id;
      console.log('lawyers data ', response.data, lawyerId);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }

    try {
      console.log('Fetching all booked appointments');
      const response = await axios.get(`${ApiEndPoint}GetAllBookAppointments`);

      if (!response.data || response.data.length === 0) {
        throw new Error('No appointment data found');
      }

      let temp = {
        availableSlots: {},
      };

      response.data.forEach((element) => {
        if (element.availableSlots) {
          element.availableSlots.forEach((slot) => {
            if (!temp.availableSlots[slot.date]) {
              temp.availableSlots[slot.date] = [];
            }

            temp.availableSlots[slot.date] = [
              ...temp.availableSlots[slot.date],
              ...slot.slots?.map((s) => ({
                startTime: convertTo12HourFormat(s.startTime),
                endTime: convertTo12HourFormat(s.endTime),
                isBooked: s.isBooked,
                byBook: s.byBook,
                meetingLink: s.meetingLink,
                FklawyerId: s.lawyerId,
                _id: s._id,
              })),
            ];
          });
        }
      });

      // Convert the object into an array format for consistency
      temp.availableSlots = Object.entries(temp.availableSlots).map(([date, slots]) => ({
        date,
        slots,
      }));

      console.log('Formatted Appointment Details', temp);
      setDataAppointmentDetails(temp);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booked appointments:', err);
      setError(err.message);
      setLoading(false);
    }

    // try {
    //   const response = await axios.get(
    //     `${ApiEndPoint}getClientDetails?Email=${storedEmail}`
    //   );
    //   // API endpoint
    //   setClientDetails(response.data);
    //   console.log("clint data ", response.data);
    //   setLoading(false);
    // } catch (err) {
    //   setError(err.message);
    //   setLoading(false);
    // }

    if (token?.Role === 'lawyer') {
      try {
        console.log('lawyer id', lawyerDetails);
        const response = await axios.get(`${ApiEndPoint}appointments/${lawyerId}`);

        if (!response.data || response.data.length === 0) {
          throw new Error('No appointment data found');
        }

        let temp = {
          FkLawyerId: response.data[0].FkLawyerId,
          availableSlots: {},
        };

        response.data.forEach((element) => {
          if (element.availableSlots) {
            element.availableSlots.forEach((slot) => {
              if (!temp.availableSlots[slot.date]) {
                temp.availableSlots[slot.date] = [];
              }

              temp.availableSlots[slot.date] = [
                ...temp.availableSlots[slot.date],
                ...slot.slots?.map((s) => ({
                  startTime: convertTo12HourFormat(s.startTime),
                  endTime: convertTo12HourFormat(s.endTime),
                  isBooked: s.isBooked,
                  byBook: s.byBook,
                  meetingLink: s.meetingLink,
                  _id: s._id,
                })),
              ];
            });
          }
        });

        // Convert the object into an array format for consistency
        temp.availableSlots = Object.entries(temp.availableSlots).map(([date, slots]) => ({
          date,
          slots,
        }));

        console.log('Formatted Appointment Details', temp);
        setDataAppointmentDetails(temp);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.get(`${ApiEndPoint}getAllLawyers`);
        if (!response.data || response.data.length === 0) {
          throw new Error('No appointment data found');
        }
        await setAllLawyer(response.data?.lawyers);
        console.log('Formatted Appointments:', AllLawyer);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const generateCalendarDates = () => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill the first week with empty slots until the first day
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    // Add all the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  };

  // Move to the previous month
  const prevMonth = () => {
    setSelectedDate();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Move to the next month
  const nextMonth = () => {
    setSelectedDate();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (date) setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when the date changes
  };

  useEffect(() => {
    setUser(sessionStorage.getItem('User'));

    // console.log(" dfsd", global.User.UserName);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const months = ['January', 'February', 'March', 'April'];
  const days = [
    { date: '08', day: 'Mon' },
    { date: '09', day: 'Tue' },
    { date: '10', day: 'Wed' },
    { date: '11', day: 'Thu' },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset the time when the date changes
  };

  //   const handleTimeSelect = (time) => {
  //     setSelectedTime(time);
  //   };

  const timeSlots = ['02:00 PM', '03:00 PM', '04:00 PM', '08:00 AM']; // Example time slots

  const handleDayClick = (day) => {
    setdate(day.date);
    setDay(day.day);
    setSelectedTime();
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };
  const handleBookTimeClick = (slot) => {
    setCalenderView(true);
  };

  const handleOpenPopup = (lawyerDetails, slot) => {
    setpopupmessage(
      `${subject} on ${new Intl.DateTimeFormat('en-US', options).format(selectedDate)} at ${slot?.startTime}?`
    );
    setSelectedSlot(slot);
    setSlotLawyer(lawyerDetails);
    setpopupcolor('popup');
    setisPopupVisiblecancel(true);
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 500);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [isEmailSent, setIsEmailSent] = useState(false); // Email sent confirmation

  const handleConfirm = async () => {
    setIsLoading(true);
    // Show loader
    try {
      await handleBookSlot(slotLawyer, selectedSlot);
      // Call the function to send the email
      setIsEmailSent(true);
      setClientMessage(''); // Set email sent confirmation
      setTimeout(() => {
        setIsPopupVisible(false); // Close popup after showing confirmation
        setIsEmailSent(false); // Reset confirmation state after a delay
      }, 8000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setpopupmessage('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const handleDelete = async (lawyerId, slotId) => {
    console.log(lawyerId, '         ', slotId);
    try {
      const response = await axios.delete(`${ApiEndPoint}delete-slot/${lawyerId}/${slotId}`);

      if (!response.ok) {
        setisPopupVisiblecancel(false);
        setpopupcolor('popupconfirm');
        setpopupmessage(
          isPopupVisible
            ? `Slot is  not deleted ${response.status}`
            : new Intl.DateTimeFormat('en-US', options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
      } else {
        const data = await response.json();
        console.log('Delete successfully:', data);
        setResponseData(data);
        setisPopupVisiblecancel(false);
        setpopupcolor('popupconfirm');
        setpopupmessage(
          isPopupVisible
            ? 'Delete successfully'
            : new Intl.DateTimeFormat('en-US', options).format(selectedDate)
            ? 'Delete successfully'
            : new Intl.DateTimeFormat('en-US', options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
        // Assuming setResponseData is a state updater
        console.log('Delete successfully:', data);
      }
      console.log('Slot deleted successfully:', response.data);
      fetchLawyerDetails();
      return response.data;
    } catch (error) {
      console.error('Error deleting slot:', error.response?.data || error.message);
      throw error;
    }
  };

  const handleEdting = async (value) => {
    let temp = {
      user: user,
      lawyerDetails: lawyerDetails,
    };
    await setUserName(user?.UserName);
    await setBio(lawyerDetails?.Bio);
    await setPosition(lawyerDetails?.Position);
    await setAddress(lawyerDetails?.Address);
    await setPhoneNumber(lawyerDetails?.Contact);
    await setEditEmail(user?.Email);
    await setShowWarning(false);
    await setErrorMessage('');

    await setUpdatedetails(temp);
    fetchLawyerDetails();
    setIsEditing(value);
  };
  const handleshowcalender = async (value) => {
    setIsCalender(value);
  };

  const handleFileInputUpdateChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      setselectfile(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        console.log('Base64:', base64String);
        setProfilePicBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result;
        setProfilePicBase64(base64String);
        setPic(base64String);

        // Prepare FormData to send the file
        const formData = new FormData();
        formData.append('Email', 'sabir@biit.edu.pk'); // Assuming `user.Email` exists
        formData.append('file', file);

        try {
          const response = await axios.post(`${ApiEndPoint}userUpdate`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('File uploaded successfully:', response.data);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleFileInputChange = (event) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //             const base64String = reader.result;
  //             setProfilePicBase64(base64String);
  //             setPic(base64String);
  //         };
  //         reader.readAsDataURL(file);
  //     }
  // };

  const handleProfilePicClick = () => {
    document.getElementById('profilePicInput').click();
    if (isEditing) {
      document.getElementById('profilePicUpdate').click();
    }
  };

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '100px',
    height: '100px',
    marginTop: '20px',
  };

  const profilePicStyle = {
    width: '100%',
    height: '100%',
    border: '1px solid #d3b386',
    borderRadius: '50%',
    boxShadow: '#85929e 0px 2px 5px',
    backgroundImage: pic ? `url(${pic})` : `url(${Contactprofile})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    border: '2px solid #d4af37',
  };
  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector('.camera-overlay').style.display = 'flex';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector('.camera-overlay').style.display = 'none';
  };
  const cameraOverlayStyle = {
    display: 'flex',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#d3b386',
    fontSize: '24px',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  };

  const availableDatesInfo =
    appointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      const hasBookedSlot = slot.slots.some((timeSlot) => timeSlot.isBooked);
      acc[dateStr] = { isAvailable: true, hasBookedSlot };
      return acc;
    }, {}) || {};

  const handleRemoveSlot = (slotId) => {
    setAppointmentDetails((prevDetails) => {
      const updatedSlots = prevDetails.availableSlots.map((daySlot) => ({
        ...daySlot,
        slots: daySlot.slots.filter((slot) => slot._id !== slotId),
      }));
      return { availableSlots: updatedSlots };
    });
  };

  //  for Book slots

  // Handle date selection

  const BookDatesInfo =
    appointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      const hasBookedSlot = slot.slots.some((timeSlot) => timeSlot.isBooked);
      acc[dateStr] = { isAvailable: true, hasBookedSlot };
      return acc;
    }, {}) || {};

  const calendarDates = generateCalendarDates();

  const lawyers = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  const handleSelect = async (selectedOption) => {
    setSelectedLawyer(selectedOption);

    if (!isCalender) {
      console.log('Selected:', selectedOption);
      setSelectedLawyer(selectedOption);
      if (selectedOption?.UserName === 'All') {
        fetchLawyerDetails();
      } else {
        try {
          console.log('lawyer id', selectedOption);
          const response = await axios.get(`${ApiEndPoint}appointments/${selectedOption?._id}`);

          if (!response.data || response.data.length === 0) {
            throw new Error('No appointment data found');
          }

          let temp = {
            FkLawyerId: response.data[0].FkLawyerId,
            availableSlots: {},
          };

          response.data.forEach((element) => {
            if (element.availableSlots) {
              element.availableSlots.forEach((slot) => {
                if (!temp.availableSlots[slot.date]) {
                  temp.availableSlots[slot.date] = [];
                }

                temp.availableSlots[slot.date] = [
                  ...temp.availableSlots[slot.date],
                  ...slot.slots.map((s) => ({
                    startTime: convertTo12HourFormat(s.startTime),
                    endTime: convertTo12HourFormat(s.endTime),
                    isBooked: s.isBooked,
                    byBook: s.byBook,
                    meetingLink: s.meetingLink,
                    _id: s._id,
                  })),
                ];
              });
            }
          });

          // Convert the object into an array format for consistency
          temp.availableSlots = Object.entries(temp.availableSlots).map(([date, slots]) => ({
            date,
            slots,
          }));

          console.log('Formatted Appointment Details', temp);
          setDataAppointmentDetails(temp);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    } else {
      if (selectedOption?.UserName === 'All') {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        axios
          .get(`${ApiEndPoint}GetAllFreeAppointments/${formattedDate}`)
          .then((res) => {
            console.log(res.data);
            setAllSlots(res.data);
          })
          .catch((err) => console.error(err));
      } else {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        axios
          .get(`${ApiEndPoint}GetAllFreeAppointments/${formattedDate}?lawyerId=${selectedOption?._id}`)
          .then((res) => {
            console.log(res.data);
            setAllSlots(res.data);
          })
          .catch((err) => console.error(err));
      }
    }
  };
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    return date < today;
  };
  const handleGetFreeSlots = (date) => {
    console.log('selectedLawyer=', selectedLawyer);
    let apiaddress;
    const formattedDate = date.toISOString().split('T')[0];
    if (selectedLawyer?.UserName !== 'All') {
      apiaddress = `GetAllFreeAppointments/${formattedDate}?lawyerId=${selectedLawyer?._id}`;
    } else {
      apiaddress = `GetAllFreeAppointments/${formattedDate}`;
    }
    axios
      .get(`${ApiEndPoint}${apiaddress}`)
      .then((res) => {
        console.log(res.data);
        setAllSlots(res.data);
      })
      .catch((err) => console.error(err));
  };

  const [filteredSlots, setAllSlots] = useState([]);

  const handleBookSlot = async (lawyerData, slot) => {
    console.log('Slot=', slot);
    console.log('lawyerData=', lawyerData);
    const meetingDate =
      selectedDate instanceof Date
        ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] // Extract YYYY-MM-DD
        : new Date(selectedDate).toISOString().split('T')[0];

    console.log('Corrected Meeting Date:', meetingDate);

    function convertTo24Hour(timeStr) {
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
    }

    // Combine formatted date with slot times
    const selectedStartTime = new Date(`${meetingDate}T${convertTo24Hour(slot?.startTime)}:00`);
    const selectedEndTime = new Date(`${meetingDate}T${convertTo24Hour(slot?.endTime)}:00`);
    console.log('startTime :', selectedStartTime);

    // Meeting details
    const meetingDetails = {
      summary: 'Scheduled Meeting',
      startTime: selectedStartTime.toISOString(),
      endTime: selectedEndTime.toISOString(),
      timeZone: 'Asia/Dubai', // UAE Time Zone
    };

    console.log('Meeting Details:', meetingDetails);
    console.log('time ', slot);

    let meeting = null;
    console.log(`Meeting Created Request: ${JSON.stringify(meetingDetails)}`);

    try {
      const response = await fetch(`${ApiEndPoint}CreateTeamMeeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json(); // Parse JSON response
      await setmeetingLink(responseData.meetingLink); // Extract Google Meet link
      meeting = responseData.meetingLink;
      console.log(`Meeting Created: ${responseData.meetingLink}`);
      // const responseData = await response.json(); // Parse JSON response
      // await setmeetingLink(responseData.googleMeetLink); // Extract Google Meet link
      // meeting = responseData.googleMeetLink;
      // console.log(`Meeting Created: ${responseData.googleMeetLink}`);
    } catch (error) {
      console.error('Error creating meeting:', error.message);
    }

    const lawyerId = lawyerData?._id;

    console.log('time ', slot);
    let updatedSlot = {
      slot: slot?._doc?._id,
      isBooked: true,
      byBook: token?._id,
      meetingLink: meeting,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(selectedDate);
    console.log('ClientDetails FOr Mails:', lawyerData?.LawyerDetails);
    let mailmsg = {
      // ClientDetails: ClientDetails.user,
      ClientDetails: token,
      lawyerDetails: lawyerData?.LawyerDetails,
      selectedTime: new Date(selectedStartTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      formattedDate: formattedDate,
      ClientMessage: ClientMessage,
      AssignedUsers: [],
      meetingLink: meeting,
    };

    console.log('mailmsg = ', mailmsg);
    const requestBody = {
      to: email,
      subject: subject,
      client: ClientDetails,
      mailmsg: mailmsg,
      usercall: 'receptionist',
      text: `
                 <strong>Client Message:</strong>
                  <p></p>
                Please note that <strong></strong> has scheduled a meeting with you at
                <strong>${selectedStartTime}</strong> on <strong>${formattedDate}</strong>.
              `,
      // `Please note that ${ClientDetails.user.UserName}  has scheduled a meeting with you at ${selectedTime} on ${formattedDate} <br>   <p><br> Client Message:${ClientMessage}</p>`,
      html: null,
    };
    console.log('Sending mail...');

    try {
      const response = await fetch(`${ApiEndPoint}send-mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response received');

      if (!response.ok) {
        setisPopupVisiblecancel(false);
        setpopupcolor('popupconfirm');
        setpopupmessage(
          isPopupVisible
            ? `Meeting Schedule mail not end ${response.status}`
            : new Intl.DateTimeFormat('en-US', options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const responseupdate = await fetch(`${ApiEndPoint}Bookappointments/${lawyerId}/${slot?._doc?._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSlot),
        });
        SocketService.bookAppointment(updatedSlot);

        const update = await responseupdate.json();
        console.log('Mail sent successfully:', update);

        if (!responseupdate.ok) {
          throw new Error(update.message || 'Failed to update slot');
        }

        await handleGetFreeSlots(selectedDate);
        console.log('Slot updated successfully:', update);

        const data = await response.json();
        console.log('Mail sent successfully:', data);
        setResponseData(data);
        setisPopupVisiblecancel(false);
        setpopupcolor('popupconfirm');
        setpopupmessage(
          isPopupVisible
            ? 'Meeting Schedule mail is send'
            : new Intl.DateTimeFormat('en-US', options).format(selectedDate)
            ? 'Meeting Schedule mail is send'
            : new Intl.DateTimeFormat('en-US', options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
        // Assuming setResponseData is a state updater
      }
    } catch (error) {
      console.error('Error in POST request:', error.message || error);
    }
  };

  return (
    <div
      className="card container-fluid p-0"
      style={{
        maxHeight: '99vh',
        maxWidth: '100vw',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      <Row className="m-0  gap-3 gap-md-5 justify-content-center" style={{ maxHeight: '99vh' }}>
        <Col
          xs={12}
          md={10}
          lg={10}
          className="card border rounded p-3 mb-3 mt-3"
          style={{
            background: '#001f3f',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '100%',
            minHeight: '300px',
          }}
        >
          {/* Dropdowns container - side by side */}
          <div className="d-flex justify-content-center gap-3 mb-3" style={{ zIndex: 2 }}>
            {/* Legal Services Dropdown */}
            <div style={{ flex: 1, maxWidth: '300px' }}>
              <Dropdown
                options={[
                  'All Services',
                  'Family Law',
                  'Criminal Law',
                  'Corporate Law',
                  'Immigration',
                  'Real Estate',
                  'Intellectual Property',
                  'Bankruptcy',
                  'Personal Injury',
                ]}
                onSelect={(service) => setSelectedService(service)}
                onToggle={(isOpen) => {
                  if (isOpen) setIsLawyerDropdownOpen(false);
                }}
                isOpen={isServiceDropdownOpen}
                onMenuToggle={(isOpen) => setIsServiceDropdownOpen(isOpen)}
                style={{ width: '100%' }}
                placeholder="Select Legal Service Type"
              />
            </div>

            {/* Lawyer Dropdown */}
            <div style={{ flex: 1, maxWidth: '300px' }}>
              <Dropdown
                options={[alluser, ...AllLawyer]}
                onSelect={handleSelect}
                onToggle={(isOpen) => {
                  if (isOpen) setIsServiceDropdownOpen(false);
                }}
                isOpen={isLawyerDropdownOpen}
                onMenuToggle={(isOpen) => setIsLawyerDropdownOpen(isOpen)}
                style={{ width: '100%' }}
                placeholder="Select a Lawyer"
              />
            </div>
          </div>

          <div className="calendar-container d-flex mb-4 justify-content-center align-items-center">
            <style>
              {`
          .react-datepicker {
            background-color: #18273e !important;
            color: white !important;
            border: 1px solid #d4af37 !important;
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
        `}
            </style>

            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                handleGetFreeSlots(date);
                setSelectedDate(date);
              }}
              inline
            />
          </div>
          {/* Slots list */}
          <div
            style={{
              background: '#16213e',
              border: '1px solid #d4af37',
              borderRadius: '8px',
              padding: '10px',
              maxWidth: '100%',
              minWidth: '150px',
              maxHeight: '42vh',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            <h5
              style={{
                color: '#d4af37',
                fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                marginBottom: '1rem',
              }}
            >
              Free Slots for {selectedDate?.toDateString() || 'Select a Date'}
            </h5>

            {filteredSlots.length > 0 ? (
              filteredSlots.map((lawyerData, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: '20px',
                    border: '1px solid #d4af37',
                    borderRadius: '10px',
                    padding: '15px',
                    backgroundColor: '#16213e',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      color: '#d4af37',
                      marginBottom: '10px',
                    }}
                  >
                    {lawyerData.lawyerName}
                  </div>

                  <div style={{ width: '100%', overflowX: 'auto' }}>
                    <table
                      style={{
                        width: '100%',
                        minWidth: '150px',
                        borderCollapse: 'collapse',
                        color: 'white',
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: '1px solid #d4af37' }}>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#d4af37' }}>Start Time</th>
                          <th style={{ textAlign: 'left', padding: '8px', color: '#d4af37' }}>End Time</th>
                          <th style={{ textAlign: 'center', padding: '8px', color: '#d4af37' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lawyerData.slots
                          .filter((slot) => !slot.isBooked)
                          .map((slot, idx) => (
                            <tr key={idx}>
                              <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{slot.startTime}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #333' }}>{slot.endTime}</td>
                              <td style={{ padding: '8px', borderBottom: '1px solid #333', textAlign: 'center' }}>
                                <button
                                  onClick={() => {
                                    handleOpenPopup(lawyerData, slot);
                                  }}
                                  style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#d4af37',
                                    color: '#18273e',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
                                  }}
                                >
                                  Book
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#ccc' }}>No available slots for selected date.</p>
            )}
          </div>

          {/* Calendar Below */}
        </Col>
      </Row>

      {/* Popup Modals */}
      {/* {isPopupVisible && (
                <div className="popup-overlay">
                    <div className={popupcolor}>
                        {!isLoading && !isEmailSent && (
                            <>
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        marginBottom: "5px",
                                        color: 'white'
                                    }}
                                >
                                    {popupmessage}
                                </h3>

                                {isPopupVisiblecancel && (
                                    <div className="popup-actions d-flex justify-content-center gap-3 mt-3">
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
                                <p>Deleting...</p>
                                <div className="spinner"></div>
                            </div>
                        )}
                        {isEmailSent && (
                            <div className="confirmation">
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    size="3x"
                                    color="white"
                                    className="m-2"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )} */}

      <div>
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
                    value={ClientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    style={{
                      width: '90%',
                      minHeight: '100px', // Adjust height as needed
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      margin: '10px 0',
                      resize: 'vertical', // Allows resizing if needed
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
                  <div className="spinner"></div> {/* You can style a spinner here */}
                </div>
              )}
              {isEmailSent && (
                <div className="confirmation">
                  <FontAwesomeIcon icon={faCheck} size="3x" color="white" className="m-2" />

                  {/* <h3>✔ Meeting Scheduled Successfully!</h3> */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <ViewBookLawyerSlot
        isOpen={IsCalenderView}
        onClose={(value) => setCalenderView(value)}
        slotbookuserid={slotbookuserid}
      />
    </div>
  );
};

export default PublicAppointment;
