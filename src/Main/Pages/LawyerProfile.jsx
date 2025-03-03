import React, { useEffect, useState } from "react";
import "../../style/LawyerProfile.css";
import "../../style/PortalTheme.css";
import { Alert } from "bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faArrowCircleRight,
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
} from "@fortawesome/free-solid-svg-icons";
import {
  BsInfo,
  BsInfoCircle,
  BsPerson,
  BsPersonAdd,
  BsPersonCircle,
  BsPostage,
  BsStackOverflow,
} from "react-icons/bs";
import loginStyle from "../../style/LawyerProfile.css";
import { MdOutlineAttachEmail } from "react-icons/md";
import {
  FaAddressCard,
  FaBusinessTime,
  FaChair,
  FaInfoCircle,
  FaMailBulk,
  FaPen,
} from "react-icons/fa";
import PhoneInput from "react-phone-input-2";

import defaultProfilePic from "../Pages/Component/assets/icons/person.png";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ApiEndPoint } from "./Component/utils/utlis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { width } from "@fortawesome/free-solid-svg-icons/faComment";
// import { ApiEndPoint } from "../../utils/utils";
import Contactprofile from "./Images/CHAT.png";
import { FaCamera, FaEdit, FaLock } from "react-icons/fa";
import ContactFormModal, { ContactForm } from "../../Component/ContactForm";
import { BsPen } from "react-icons/bs";

const LawyerProfile = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState("");
  const [lawyerDetails, setLawyersDetails] = useState([]);
  const [ClientDetails, setClientDetails] = useState([]);
  const [user, setUser] = useState();

  const [date, setdate] = useState(null);
  const [getDay, setDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [popupmessage, setpopupmessage] = useState();
  const [popupcolor, setpopupcolor] = useState("popup");
  const [email, setEmail] = useState("raheemakbar999@gmail.com");
  const [subject, setSubject] = useState("Meeting Confirmation");

  const storedEmail = sessionStorage.getItem("Email");
  const [isEditing, setIsEditing] = useState(false);

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent("")}`;

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisiblecancel, setisPopupVisiblecancel] = useState(true);
  const [selectedDate, setSelectedDate] = useState();
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);

  const options = { weekday: "long", month: "long", day: "numeric" }; // Format options
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

  const [username, setUserName] = useState(user?.UserName);
  const [Bio, setBio] = useState(lawyerDetails?.Bio);
  const [Position, setPosition] = useState(lawyerDetails?.Position);
  const [Address, setAddress] = useState(lawyerDetails?.Address);
  const [phoneNumber, setPhoneNumber] = useState(lawyerDetails?.Contact);
  const [Editemail, setEditEmail] = useState(user?.Email);
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectfile, setselectfile] = useState("");

  const [message, setMessage] = useState("");
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
    // ✅ Hide message after 5 seconds
  };

  const hanldeEdit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Creating FormData object
    const formData = new FormData();
    formData.append("UserName", username);
    formData.append("Contact", phoneNumber);
    formData.append("Position", Position);
    formData.append("Bio", Bio);
    formData.append("Address", Address);

    formData.append("file", selectfile ? selectfile : null);

    try {
      const response = await axios.put(
        `${ApiEndPoint}users/updateLawyerDetails/${Editemail}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } } // Set content type
      );

      alert("Lawyer details updated successfully!");

      if (typeof handleEdting === "function") {
        handleEdting(); // Ensure `handleEdting` is defined before calling it
      }

      console.log("Updated Data:", response.data);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error);
      alert("Failed to update lawyer details.");
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
    const storedAppointments = JSON.parse(localStorage.getItem("appointments"));
    if (storedAppointments) {
      setAppointmentDetails(storedAppointments);
    }
  }, []);

  useEffect(() => {
    //  setUser(global.User)
    setPic(user?.profilepic);
    localStorage.setItem("appointments", JSON.stringify(appointmentDetails));
  }, []);

  const handleStartTimeChange = (time) => {
    setNewStartTime(time);
    setNewEndTime(new Date(time.getTime() + 15 * 60000)); // Default end time +30 mins
  };

  const generateMultipleTimeSlots = (startTime, endTime) => {
    const slots = [];
    let current = new Date(startTime);
    const end = new Date(endTime);

    while (current < end) {
      let nextSlot = new Date(current);
      nextSlot.setMinutes(current.getMinutes() + 15); // Move forward 15 minutes

      if (nextSlot > end) {
        nextSlot = new Date(end); // Adjust last slot
      }

      slots.push({
        startTime: current.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        endTime: nextSlot.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
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

  const handleAddTimeSlot = async () => {
    if (selectedDate && newStartTime && newEndTime) {
      const formatTime = (date) =>
        date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      if (newEndTime <= newStartTime) {
        //alert("End time must be after start time!");
        return;
      }

      const newSlots = await generateMultipleTimeSlots(newStartTime, newEndTime);

      // Use a Promise to wait for state update
      let updatedAppointmentDetails;
      await setAppointmentDetails((prevDetails) => {
        const updatedSlots = [...prevDetails.availableSlots];
        const existingSlotIndex = updatedSlots.findIndex(
          (slot) => slot.date === selectedDate.toDateString()
        );

        if (existingSlotIndex > -1) {
          const existingSlots = updatedSlots[existingSlotIndex].slots;
          newSlots.forEach((newSlot) => {
            const slotExists = existingSlots.some(
              (slot) => slot.startTime === newSlot.startTime
            );
            if (!slotExists) {
              existingSlots.push(newSlot);
            }
          });
        } else {
          updatedSlots.push({
            date: selectedDate.toDateString(),
            slots: newSlots,
          });
        }

        updatedAppointmentDetails = { availableSlots: updatedSlots };
        return updatedAppointmentDetails;
      });

      // Ensure state update before proceeding
      await sleep(1000);

      setNewStartTime(null);
      setNewEndTime(null);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
        const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
        return `${year}-${month}-${day}`;
      };

      console.log("Updated Appointment Details:", updatedAppointmentDetails);

      // Use the updated appointment details instead of the outdated state
      const formattedSlots = {
        availableSlots: updatedAppointmentDetails.availableSlots.map((slot) => ({
          date: formatDate(new Date(slot.date)), // Convert date to YYYY-MM-DD
          slots: slot.slots.map((slotTime) => ({
            startTime: convertTo24HourFormat(slotTime.startTime),
            endTime: convertTo24HourFormat(slotTime.endTime),
            isBooked: slotTime.isBooked,
          })),
        })),
      };

      console.log("Formatted Slots for API:", formattedSlots);

      try {
        const response = await axios.post(
          `${ApiEndPoint}appointment/6799cd3a1aa12d0a863a32e0/add-availability`,
          formattedSlots,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Post Appointment Data:", response.data);
        showMessage(response.data.message)
        fetchLawyerDetails();
        setAppointmentDetails({ availableSlots: [] });
      } catch (error) {
        console.error(
          "Error adding availability:",
          error.response?.data || error.message
        );
        throw error;
      }
    } else {
      alert("Please select a date, start time, and end time");
    }
  };


  const updateSlot = async () => {
    // slot update when is note
    let start = new Date(newStartTime)
    let end = new Date(newEndTime)
    const lawyerId = lawyerDetails._id
    const updatedSlot = {
      startTime: start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      endTime: end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      isBooked: false
    };
    let slot = updatespecifcslot._id
    // console.log("updatedSlot =", updatedSlot)
    // console.log("updatespecifcslot", slot)
    try {
      const response = await fetch(`http://localhost:5001/api/appointments/${lawyerId}/${slot}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedSlot)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update slot");
      }
      fetchLawyerDetails();
      setEditingSlotIndex(null);
      setNewStartTime(null);
      setNewEndTime(null);
      setSelectedTime(null)
      showMessage(data.message)
      console.log("Slot updated successfully:", data);
    } catch (error) {
      console.error("Error updating slot:", error.message);
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

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // fetch("http://172.16.18.250:8080/api/upload") // Replace with your API URL
    //     .then((response) => response.json())
    //     .then((data) => setImageUrl(data.imageUrl)) // Adjust based on API response
    //     .catch((error) => console.error("Error fetching image:", error));
  }, []);

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for AM times
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  const fetchLawyerDetails = async () => {
    let lawyerId = ''
    try {
      const response = await axios.get(
        `${ApiEndPoint}users/geLawyerDetails/wissam@awsyounus.com`
      ); // API endpoint
      setUser(response.data.user);
      await setLawyersDetails(response.data.lawyerDetails);
      lawyerId = response.data.lawyerDetails._id
      console.log("lawyers data ", response.data, lawyerId);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }


    try {
      console.log("lawyer id", lawyerDetails)
      const response = await axios.get(
        `${ApiEndPoint}appointments/${lawyerId}`
      );

      if (!response.data || response.data.length === 0) {
        throw new Error("No appointment data found");
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
                _id: s._id,
              })),
            ];
          });
        }
      });

      // Convert the object into an array format for consistency
      temp.availableSlots = Object.entries(temp.availableSlots).map(
        ([date, slots]) => ({
          date,
          slots,
        })
      );

      console.log("Formatted Appointment Details", temp);
      setDataAppointmentDetails(temp);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    } try {
      const response = await axios.get(
        `${ApiEndPoint}users/getClientDetails?Email=${storedEmail}`
      );
      // API endpoint
      setClientDetails(response.data);
      console.log("clint data ", response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
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

  const calendarDates = generateCalendarDates();
  // Move to the previous month
  const prevMonth = () => {
    setSelectedDate();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Move to the next month
  const nextMonth = () => {
    setSelectedDate();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (date) setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when the date changes
  };

  useEffect(() => {
    setUser(sessionStorage.getItem("User"));

    // console.log(" dfsd", global.User.UserName);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const months = ["January", "February", "March", "April"];
  const days = [
    { date: "08", day: "Mon" },
    { date: "09", day: "Tue" },
    { date: "10", day: "Wed" },
    { date: "11", day: "Thu" },
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset the time when the date changes
  };

  //   const handleTimeSelect = (time) => {
  //     setSelectedTime(time);
  //   };

  const timeSlots = ["02:00 PM", "03:00 PM", "04:00 PM", "08:00 AM"]; // Example time slots

  const handleDayClick = (day) => {
    setdate(day.date);
    setDay(day.day);
    setSelectedTime();
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleOpenPopup = (item) => {
    setpopupmessage(
      `Are you sure that you want to delete the slot of ${item.startTime} - ${item.endTime}?`
    );
    setdeleteslot(item)
    setpopupcolor("popup");
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
    setIsLoading(true); // Show loader

    try {
      await handleDelete(lawyerDetails._id, deleteslot._id); // Call the function to send the email
      setIsEmailSent(true); // Set email sent confirmation
      setTimeout(() => {
        setIsPopupVisible(false); // Close popup after showing confirmation
        setIsEmailSent(false); // Reset confirmation state after a delay
      }, 1000);
    } catch (error) {
      console.error("Failed to Delete:", error);
      setpopupmessage("Failed to delete slot Please try again.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };
  const convertTo24HourFormat = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(Number(hours) + 12);
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}`; // Returns HH:MM format
  };


  const handleDelete = async (lawyerId, slotId) => {
    console.log(lawyerId, "         ", slotId)
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/delete-slot/${lawyerId}/${slotId}`
      );


      if (!response.ok) {
        setisPopupVisiblecancel(false);
        setpopupcolor("popupconfirm");
        setpopupmessage(
          isPopupVisible
            ? `Slot is  not deleted ${response.status}`
            : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
      } else {
        const data = await response.json();
        console.log("Delete successfully:", data);
        setResponseData(data);
        setisPopupVisiblecancel(false);
        setpopupcolor("popupconfirm");
        setpopupmessage(
          isPopupVisible
            ? "Delete successfully"
            : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
              ? "Delete successfully"
              : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
        // Assuming setResponseData is a state updater
        console.log("Delete successfully:", data);
      }
      console.log("Slot deleted successfully:", response.data);
      fetchLawyerDetails()
      return response.data;
    } catch (error) {
      console.error("Error deleting slot:", error.response?.data || error.message);
      throw error;
    }
    // try {
    //   const response = await fetch(`${ApiEndPoint}send-mail`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(requestBody),
    //   });

    //   console.log("Response received");

    //   if (!response.ok) {
    //     setisPopupVisiblecancel(false);
    //     setpopupcolor("popupconfirm");
    //     setpopupmessage(
    //       isPopupVisible
    //         ? `Meeting Schedule mail not end ${response.status}`
    //         : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
    //     );
    //     setTimeout(() => {
    //       setIsPopupVisible(false);
    //     }, 3000);
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   } else {
    //     const data = await response.json();
    //     console.log("Mail sent successfully:", data);
    //     setResponseData(data);
    //     setisPopupVisiblecancel(false);
    //     setpopupcolor("popupconfirm");
    //     setpopupmessage(
    //       isPopupVisible
    //         ? "Meeting Schedule mail is send"
    //         : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
    //           ? "Meeting Schedule mail is send"
    //           : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
    //     );
    //     setTimeout(() => {
    //       setIsPopupVisible(false);
    //     }, 3000);
    //     // Assuming setResponseData is a state updater
    //     console.log("Mail sent successfully:", data);
    //   }
    // } catch (error) {
    //   console.error("Error in POST request:", error.message || error);
    // }

    // alert(`Meeting scheduled on  ${selectedDate.day} at ${selectedTime}`);
    // } else {
    //   alert("Please select both a day and time to schedule a meeting.");
    // }
  };

  // const handleSchedule = async () => {
  //   const formatDate = (date) => {
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
  //     const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
  //     return `${year}-${month}-${day}`;
  //   };

  //   console.log("show appointment", appointmentDetails);
  //   const formattedSlots = {
  //     availableSlots: appointmentDetails.availableSlots.map((slot) => ({
  //       date: formatDate(new Date(slot.date)), // Convert date to YYYY-MM-DD
  //       slots: slot.slots.map((slotTime) => ({
  //         startTime: convertTo24HourFormat(slotTime.startTime),
  //         endTime: convertTo24HourFormat(slotTime.endTime),
  //         isBooked: slotTime.isBooked,
  //       })),
  //     })),
  //   };

  //   // Function to convert 12-hour time to 24-hour format

  //   console.log("formattedSlots :", formattedSlots);

  //   try {
  //     const response = await axios.post(
  //       `${ApiEndPoint}appointment/67a2275aa70023929b5a3d3e/add-availability`,
  //       formattedSlots,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("Post Appoinmtent Data :", response.data);
  //     fetchLawyerDetails()
  //     setAppointmentDetails({
  //       availableSlots: [],
  //     })
  //   } catch (error) {
  //     console.error(
  //       "Error adding availability:",
  //       error.response?.data || error.message
  //     );
  //     throw error;
  //   }
  // };



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
    await setErrorMessage("");

    await setUpdatedetails(temp);
    fetchLawyerDetails();
    setIsEditing(value);
  };

  const handleFileInputUpdateChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      setselectfile(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        console.log("Base64:", base64String);
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
        formData.append("Email", "sabir@biit.edu.pk"); // Assuming `user.Email` exists
        formData.append("file", file);

        try {
          const response = await axios.post(
            `${ApiEndPoint}userUpdate`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("File uploaded successfully:", response.data);
        } catch (error) {
          console.error("Error uploading file:", error);
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
    document.getElementById("profilePicInput").click();
    if (isEditing) {
      document.getElementById("profilePicUpdate").click();
    }
  };


  const containerStyle = {
    position: "relative",
    display: "inline-block",
    width: "100px",
    height: "100px",
    marginTop: "20px",
  };

  const profilePicStyle = {
    width: "100%",
    height: "100%",
    border: "1px solid #d3b386",
    borderRadius: "50%",
    boxShadow: "#85929e 0px 2px 5px",
    backgroundImage: pic ? `url(${pic})` : `url(${Contactprofile})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
    border: "2px solid #d4af37",
  };
  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector(".camera-overlay").style.display = "flex";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector(".camera-overlay").style.display = "none";
  };
  const cameraOverlayStyle = {
    display: "flex",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#d3b386",
    fontSize: "24px",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.3)",
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


  return (
    <div
      className="border rounded row gap-5 justify-content-center ms-1 mb-3 mt-2"
      style={{
        width: "100%",
        maxHeight: "83vh",
        overflowY: "auto",
        padding: 10,
        boxShadow: "5px 5px 5px gray",
      }}
    >
      <div
        className="slots-section col-5 mt-3"
        style={{ boxShadow: "5px 5px 5px gray" }}
      >
        {isEditing ? (
          <form className="Theme3">
            <div className="mb-2 text-center  avatar-container">
              <label htmlFor="profilePicInput">
                <img
                  src={
                    user?.ProfilePicture
                      ? profilePicBase64
                        ? `data:image/jpeg;base64,${profilePicBase64}`
                        : user?.ProfilePicture
                      : defaultProfilePic
                  }
                  alt="Profile"
                  style={{
                    // maxWidth: "80px",
                    // maxHeight: "80px",
                    // minWidth: "50px",
                    // minHeight: "50px",
                    border: "2px solid #d4af37",
                    textAlign: "center",
                    padding: "3px",
                    borderRadius: "50%", // Use 50% for a perfect circle
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "1px solid #18273e",
                    boxShadow: "#18273e 0px 2px 5px",
                  }}
                  className="avatar-img"
                  onClick={() =>
                    document.getElementById("profilePicUpdate").click()
                  }
                />
              </label>
              <input
                type="file"
                accept="image/*"
                id="profilePicUpdate"
                onChange={handleFileInputUpdateChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="text-start d-flex flex-column gap-3">
              {/* Name Field */}
              <div className="d-flex gap-4">
                <div>
                  <label className="form-label font-weight-bold">
                    <p
                      className="ml-3 fw-bold"
                      style={{
                        marginLeft: "3px",
                        letterSpacing: 2,
                        fontSize: 12,
                        color: "#fff",
                      }}
                    >
                      Name
                    </p>
                  </label>
                  <div
                    className="input-group bg-soft-light rounded-2"
                    style={{ marginTop: -8 }}
                  >
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgb(101, 103, 105)",
                        color: " #d4af37",
                      }}
                    >

                      <img
                        src={require(`../../../src/Component/Images/Profile.png`)}
                        style={{ height: "20px" }}
                      />

                    </span>
                    <input
                      className={
                        loginStyle["form-control-1"] +
                        " form-control-md form-control"
                      }
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgb(101, 103, 105)",
                        color: "white",
                      }}
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      id="Name"
                      name="username"
                      placeholder="Enter Name"
                      type="text"
                      title="Please Enter Client Name"
                      onFocus={(e) => (
                        (e.target.style.borderColor = "#d2a85a"),
                        (e.target.style.color = "white")
                      )}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgb(101, 103, 105)")
                      }
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="text-start">
                  <label className="form-label font-weight-bold">
                    <p
                      className="fw-bold"
                      style={{
                        marginLeft: "3px",
                        letterSpacing: 2,
                        fontSize: 12,
                        color: "white",
                      }}
                    >
                      Email
                    </p>
                  </label>
                  <div
                    className="input-group bg-soft-light rounded-2"
                    style={{ marginTop: -8 }}
                  >
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgb(101, 103, 105)",
                        border: "1px solid rgb(101, 103, 105)",
                        color: " #d4af37",
                      }}
                    >
                      <img
                        src={require(`../../../src/Component/Images/Email.png`)}
                        style={{ height: "13px" }}
                      />
                    </span>
                    <input
                      className={
                        loginStyle["form-control-1"] +
                        " form-control-md form-control"
                      }
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgb(101, 103, 105)",
                        color: "white",
                      }}
                      value={Editemail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      id="Email"
                      name="email"
                      placeholder="Enter Email"
                      type="email"
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                      title="Enter a valid email address"
                      onFocus={(e) => (e.target.style.borderColor = "#d2a85a")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgb(101, 103, 105)")
                      }
                      required
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex gap-4">
                <div className="text-start">
                  <label className="form-label font-weight-bold">
                    <p
                      className="fw-bold"
                      style={{
                        marginLeft: "3px",
                        color: "white",
                        letterSpacing: 2,
                        fontSize: 12,
                      }}
                    >
                      Position
                    </p>
                  </label>
                  <div
                    className="input-group bg-soft-light rounded-2"
                    style={{ marginTop: -9 }}
                  >
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgb(101, 103, 105)",
                        color: " #d4af37",
                      }}
                    >
                      <img
                        src={require(`../../../src/Component/Images/Profession.png`)}
                        style={{ height: "13px" }}
                      />
                    </span>
                    <input
                      className={
                        loginStyle["form-control-1"] +
                        " form-control-md form-control"
                      }
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid rgb(101, 103, 105)",
                        color: "#fff",
                      }}
                      value={Position}
                      onChange={(e) => setPosition(e.target.value)}
                      id="Position"
                      name="Position"
                      placeholder="Enter Position"
                      type="text"
                      title="Enter a valid Position "
                      onFocus={(e) => (e.target.style.borderColor = "#d2a85a")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgb(101, 103, 105)")
                      }
                      required
                    />
                  </div>
                </div>

                <div className="text-start">
                  <label
                    className="form-label font-weight-bold "
                    style={{ marginBottom: "-0.4rem" }}
                  >
                    <p
                      className="fw-bold simple-text"
                      style={{
                        marginLeft: "3px",
                        letterSpacing: 2,
                        fontSize: 12,
                      }}
                    >
                      Contact Number
                    </p>
                  </label>
                  <div
                    className="input-group bg-soft-light rounded-2"
                    style={{ marginTop: -8 }}
                  >
                    <PhoneInput
                      containerClass={
                        loginStyle["form-control-1"] + "form-control-md"
                      }
                      inputProps={{
                        name: "phone",
                        required: true,
                        onFocus: (e) =>
                          (e.target.style.borderColor = "#d2a85a"),
                        onBlur: (e) =>
                          (e.target.style.borderColor = "rgb(101, 103, 105)"),
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      enableSearch={true}
                      searchStyle={{
                        width: "99%",
                      }}
                      disableSearchIcon={true}
                      inputStyle={{
                        width: "100%",
                        border: "1px solid",
                        boxShadow: "none",
                        height: "37px", // Matches Email input height
                        backgroundColor: "transparent",
                        border: "1px solid rgb(101, 103, 105)",
                        color: "#fff",
                        paddingLeft: "40px", // Ensures alignment with email input icon
                      }}
                      buttonStyle={{
                        backgroundColor: "transparent",
                        border: "none",
                        position: "absolute",
                        // left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                      country={"ae"} // Set default country to UAE
                      value={phoneNumber}
                      onChange={(phone) => setPhoneNumber(phone)}
                    />
                  </div>
                </div>
              </div>
              <div className="text-start">
                <label className="form-label font-weight-bold">
                  <p
                    className=" fw-bold"
                    style={{
                      color: "white",
                      marginLeft: "3px",
                      letterSpacing: 2,
                      fontSize: 12,
                    }}
                  >
                    Bio
                  </p>
                </label>
                <div
                  className="input-group bg-soft-light rounded-2"
                  style={{ marginTop: -8 }}
                >
                  <span
                    className="input-group-text"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgb(101, 103, 105)",
                      color: " #d4af37",
                    }}
                  >
                    <img
                      src={require(`../../../src/Component/Images/Bio.png`)}
                      style={{ height: "20px" }}
                    />
                  </span>
                  <textarea
                    className={
                      loginStyle["form-control-1"] +
                      " form-control-md form-control"
                    }
                    value={Bio}
                    onChange={(e) => setBio(e.target.value)}
                    id="Bio"
                    name="Bio"
                    placeholder="Enter Bio"
                    type="text"
                    title="Enter a Bio "
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgb(101, 103, 105)",
                      color: "#fff",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#d2a85a")}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgb(101, 103, 105)")
                    }
                    required
                  />
                </div>
              </div>
              <div className="text-start">
                <label className="form-label font-weight-bold">
                  <p
                    className=" fw-bold"
                    style={{
                      marginLeft: "3px",
                      color: "white",
                      letterSpacing: 2,
                      fontSize: 12,
                    }}
                  >
                    Address
                  </p>
                </label>
                <div
                  className="input-group bg-soft-light rounded-2"
                  style={{ marginTop: -8 }}
                >
                  <span
                    className="input-group-text"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgb(101, 103, 105)",
                      color: " #d4af37",
                    }}
                  >
                    <img
                      src={require(`../../../src/Component/Images/Address.png`)}
                      style={{ height: "20px" }}
                    />
                  </span>
                  <textarea
                    className={
                      loginStyle["form-control-1"] +
                      " form-control-md form-control"
                    }
                    value={Address}
                    onChange={(e) => setAddress(e.target.value)}
                    id="Address"
                    name="Address"
                    placeholder="Enter Address"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgb(101, 103, 105)",
                      color: "#fff",
                    }}
                    type="text"
                    title="Enter a Address "
                    onFocus={(e) => (e.target.style.borderColor = "#d2a85a")}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgb(101, 103, 105)")
                    }
                    required
                  />
                </div>
              </div>

              {/* Phone Number Field */}

              {/* Submit Button */}
              <div className="button-container gap-2 d-flex justify-content-center">
                {showWarning && (
                  <p
                    style={{ marginTop: -25 }}
                    className="text-danger fs-6 mt-0.1rem"
                  >
                    {errorMessage}
                  </p>
                )}
                <button
                  className={
                    loginStyle["btn-color"] + " btn simple-text text-light"
                  }
                  type="submit"
                  style={{
                    border: "1px solid rgb(101, 103, 105)",
                    backgroundColor: "#18273e",
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#18273e";
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d3b386";
                  }}
                  onClick={hanldeEdit}
                >
                  Update
                </button>
                <button
                  className={
                    loginStyle["btn-color"] + " btn simple-text text-light"
                  }
                  type="submit"
                  style={{
                    backgroundColor: "#18273e",
                    border: "1px solid rgb(101, 103, 105)",
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#18273e";
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d3b386";
                  }}
                  onClick={handleCancel}
                >
                  cancel
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="profile-section">
            <div className="d-flex flex-row align-items-center m-0">
              {/* <div style={containerStyle}> */}
              {/* <div
                                    className="profile-pic"
                                    style={profilePicStyle}
                                //   onMouseEnter={handleMouseEnter}
                                // onMouseLeave={handleMouseLeave}
                                // onClick={handleProfilePicClick} // Trigger file input click
                                > */}
              {/* <label htmlFor="profilePicInput"> */}
              <img
                src={
                  user?.ProfilePicture
                    ? `${user?.ProfilePicture}`
                    : defaultProfilePic
                }
                alt="Profile"
                style={{
                  border: "2px solid #d4af37",
                  textAlign: "center",
                  padding: "3px",
                  borderRadius: "50%", // Use 50% for a perfect circle
                  width: "100px",
                  height: "100px",
                  display: "flex", // Use flexbox for centering
                  alignItems: "center", // Vertically center the icon
                  justifyContent: "center", // Horizontally center the icon
                }}
                className="avatar-img"
              />
              {/* </label> */}
              {/* <div className="camera-overlay" style={cameraOverlayStyle}>
                                    <FaCamera />
                                </div> */}
              {/* </div> */}

              {/* <input
                                type="file"
                                accept="image/*"
                                id="profilePicInput"
                                onChange={handleFileInputChange}
                                style={{ display: "none" }}
                            /> */}
              {/* </div> */}

              <div className="d-flex flex-column justify-content-center gap-2">
                <div className="d-flex align-items-center p-2 gap-1 m-0">
                  <div>
                    <h2 style={{ color: "#d4af37" }}>{user?.UserName}</h2>
                    <p style={{ color: "#d4af37" }}>{lawyerDetails?.Position}</p>
                  </div>
                  <button
                    className="btn-update"
                    onClick={() => handleEdting(!isEditing)}
                  >
                    <FaPen />
                  </button>
                </div>
              </div>
            </div>

            <div className="lawyer-details mt-1">
              <div
                className="d-flex"
                style={{ width: "auto", height: "55%", overflowY: "auto" }}
              >
                <p>{lawyerDetails.Bio}</p>
              </div>
              <div className="d-flex">
                <FontAwesomeIcon
                  icon={faMailBulk}
                  size="1x"
                  className="simple-text m-2"
                />
                <p className="ms-2 m-1 ">
                  <a href={mailtoLink} className="simple-text">
                    {user?.Email}
                  </a>
                </p>
              </div>
              <div className="d-flex">
                <FontAwesomeIcon
                  icon={faPhone}
                  size="1x"
                  color="white"
                  className="m-2"
                />
                <p className="ms-2 m-1">{lawyerDetails?.Contact}</p>
              </div>

              <div className="d-flex">
                <FontAwesomeIcon
                  icon={faAddressCard}
                  size="1x"
                  color="white"
                  className="m-2 "
                />
                <p style={{ height: 50, fontSize: 12 }} className="ms-2 m-1 ">
                  {/* Address: [Your Name], [Street Address], [Apartment/Suite Number], [City], [State] [ZIP Code], [Country] */}
                  {lawyerDetails?.Address}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className="slots-section col-5  mt-3"
        style={{ boxShadow: "5px 5px 5px gray" }}
      >
        <div>
          {isPopupVisible && (
            <div className="popup-overlay">
              <div className={popupcolor}>
                {!isLoading && !isEmailSent && (
                  <>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>
                      {popupmessage}
                    </h3>

                    {isPopupVisiblecancel && (
                      <div className="popup-actions d-flex justify-content-center gap-3 mt-3">
                        <button className="confirm-btn" onClick={handleConfirm}>
                          Yes
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleClosePopup}
                        >
                          No
                        </button>
                      </div>
                    )}
                  </>
                )}
                {isLoading && (
                  <div className="loading-indicator">
                    <p>Deleting...</p>
                    <div className="spinner"></div>{" "}
                    {/* You can style a spinner here */}
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

                    {/* <h3>✔ Meeting Scheduled Successfully!</h3> */}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Month Selector */}
        <div
          className="d-flex "
          style={{ marginBottom: "2px", justifyContent: "space-between" }}
        >
          <div style={{ color: " #d4af37" }}>
            <h2>Available Slots</h2>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button className="calender-button simple-text" onClick={prevMonth}>
            <FontAwesomeIcon icon={faArrowLeft} size="1x" />
          </button>
          <h3>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="simple-text calender-button">
            <FontAwesomeIcon icon={faArrowRight} size="1x" />
          </button>
        </div>

        {/* Days of the Week */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="Calendarday"
              style={{
                border: "1px solid #d2a85a",
                margin: 3,
                width: "calc(100% / 7)",
                textAlign: "center",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {calendarDates.map((date, index) => (
            <div
              key={index}
              onClick={() => date && handleDateClick(date)} // Prevent clicks on empty dates
              className={date ? "calendarDates" : ""}
              style={{
                border: date
                  ? selectedDate?.getDate() === date?.getDate()
                    ? "2px solid white"
                    : "1px solid #001f3f"
                  : "none",
                borderRadius: date ? "5px" : "0px",
                cursor: date ? "pointer" : "default",
                background: date
                  ? selectedDate?.getDate() === date?.getDate()
                    ? "#d2a85a"
                    : ""
                  : "transparent", // ✅ Make empty slots transparent
                color: date
                  ? selectedDate?.getDate() === date?.getDate()
                    ? "#001f3f"
                    : "white"
                  : "transparent", // ✅ Hide text for empty slots
                width: "calc(100% / 7)",
                height: "40px", // Set consistent height
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              {date ? date.getDate() : ""}
            </div>
          ))}
        </div>

        {selectedDate && (
          <div>
            <h5 style={{ color: " #d4af37" }}>Existing Slots:</h5>
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              {ExistSlotsMap[selectedDate.toDateString()]?.map((slot, index) => (
                <div key={slot._id} style={{ position: "relative", display: "inline-block" }}>
                  <button
                    onClick={() => {
                      setNewStartTime(
                        new Date(
                          `${selectedDate.toDateString()} ${slot.startTime}`
                        )
                      );
                      setNewEndTime(
                        new Date(`${selectedDate.toDateString()} ${slot.endTime}`)
                      );
                      setEditingSlotIndex(index);
                      handleTimeClick(slot.startTime)
                      setupdateslot(slot)
                    }}
                    className="time-button"
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "1px solid #d4af37",
                      background: slot.isBooked
                        ? "green" // Green if booked
                        : selectedTime === slot.startTime
                          ? "#d2a85a" // Golden when selected
                          : "#16213e", // Default background
                      color: "white",
                      cursor: slot.isBooked ? "not-allowed" : "pointer",
                      fontSize: 12,
                      position: "relative",
                    }}
                    disabled={slot.isBooked}
                    onMouseEnter={(e) => {
                      if (!slot.isBooked && selectedTime !== slot.startTime) {
                        e.target.style.background = "#c0a262"; // Hover background (light golden)
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!slot.isBooked && selectedTime !== slot.startTime) {
                        e.target.style.background = "#16213e"; // Reset to default
                      }
                    }}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>

                  {/* Close Icon (❌) */}
                  {!slot.isBooked && (
                    <span
                      onClick={() => handleOpenPopup(slot)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#18273e",
                        // border:"2px solid #c0a262",
                        color: "white",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "flex",
                        justifyContent: "center",
                        padding: '2px',
                        alignItems: "center",
                        fontSize: "12px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onMouseEnter={(e) => {
                        if (!slot.isBooked && selectedTime !== slot.startTime) {
                          e.target.style.background = "#c0a262"; // Hover background (light golden)
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!slot.isBooked && selectedTime !== slot.startTime) {
                          e.target.style.background = "#16213e"; // Reset to default
                        }
                      }}
                    >
                      ❌
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* {availableSlotsMap[selectedDate.toDateString()]?.map(
              (slot, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setNewStartTime(
                      new Date(
                        `${selectedDate.toDateString()} ${slot.startTime}`
                      )
                    );
                    setNewEndTime(
                      new Date(`${selectedDate.toDateString()} ${slot.endTime}`)
                    );
                    setEditingSlotIndex(index); // ✅ FIX: Set index when editing
                  }}
                  disabled={slot.isBooked}
                >
                  {slot.startTime} - {slot.endTime}{" "}
                  {slot.isBooked ? "(Booked)" : ""}
                </button>
              )
            )} */}
          </div>
        )}

        {selectedDate && (
          <div style={{ position: "relative" }}>
            <h5 style={{ color: "#d4af37" }}>
              {editingSlotIndex !== null ? "Edit Slot" : "Add New Slot"}
            </h5>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

              {/* Start Time Picker */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                <label className="simple-text" style={{ marginBottom: "5px", textAlign: "center" }}>
                  Start Time:
                </label>
                <DatePicker
                  selected={newStartTime}
                  onChange={handleStartTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Start Time"
                  dateFormat="h:mm aa"
                  className="small-datepicker"
                  id="start-time-picker"
                  style={{
                    border: message ? "2px solid red" : "1px solid #ccc",
                    transition: "border 0.3s ease-in-out",
                  }}
                // ref={(input) => message && input && input.setFocus()} // Auto-focus if message exists
                />

                {/* ✅ Message appears just below the DatePicker */}
                {message && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%", // Slightly below the DatePicker
                      left: "50%",
                      // transform: "translateX(-50%)",
                      backgroundColor: "rgba(255, 0, 0, 0.9)",
                      color: "white",
                      padding: "10px",
                      borderRadius: "8px",
                      textAlign: "center",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                      zIndex: 9999,
                      minWidth: "20vw",
                      marginTop: "5px",
                    }}
                  >
                    {message}
                  </div>
                )}
              </div>

              {/* End Time Picker */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <label className="simple-text" style={{ marginBottom: "5px", textAlign: "center" }}>
                  End Time:
                </label>
                <DatePicker
                  selected={newEndTime}
                  onChange={(time) => setNewEndTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="End Time"
                  dateFormat="h:mm aa"
                  className="small-datepicker"
                  disabled={editingSlotIndex !== null}
                />
              </div>

              {/* Add or Update Button */}
              <button
                onClick={editingSlotIndex !== null ? updateSlot : handleAddTimeSlot}
                style={{
                  height: "30px",
                  borderRadius: 6,
                  alignSelf: "center",
                  width: 80,
                  marginTop: "25px",
                }}
              >
                {editingSlotIndex !== null ? "Update" : "Add"}
              </button>
            </div>
          </div>
        )}



      </div>
      {/* <ContactFormModal isOpen={isEditing} onClose={(value) => handleEdting(value)} updateData={Updatedetails} /> */}

      {/* <div style={{ textAlign: "center" }}>
        <button
          className="schedule-button"
          style={{
            boxShadow: "5px 5px 5px gray",
            border: "2px solid #d4af37",
            borderRadius: "6px",
          }}
          onClick={handleSchedule}
        >
          Save Schedule
        </button>
      </div> */}
      {/* </div> */}
    </div>
  );
};

export default LawyerProfile;
