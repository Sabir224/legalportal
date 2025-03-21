import React, { useEffect, useState } from "react";
import "../../style/LawyerProfile.css";
import { Alert } from "bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ApiEndPoint } from "./Component/utils/utlis";
import {
  Button,
  Card,
  Col,
  Modal,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  BsCalendar,
  BsCalendar2,
  BsCalendar2Plus,
  BsSend,
  BsSendFill,
  BsSendPlusFill,
} from "react-icons/bs";
// import { ApiEndPoint } from "../../utils/utils";

const ClientAppointment = ({ token }) => {
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
  const [ClientMessage, setClientMessage] = useState("");
  const [selectedslot, setslot] = useState("");

  const storedEmail = sessionStorage.getItem("Email");

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent("")}`;

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisiblecancel, setisPopupVisiblecancel] = useState(true);
  const [selectedDate, setSelectedDate] = useState();
  const [appointmentDetails, setAppoinmentDetails] = useState(null);
  const [meetingLink, setmeetingLink] = useState(null);
  const options = { weekday: "long", month: "long", day: "numeric" }; // Format options
  let data;
  useEffect(() => {
    fetchLawyerDetails();
  }, []);

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetch("http://172.16.18.250:8080/api/upload") // Replace with your API URL
      .then((response) => response.json())
      .then((data) => setImageUrl(data.imageUrl)) // Adjust based on API response
      .catch((error) => console.error("Error fetching image:", error));
  }, []);

  const fetchLawyerDetails = async () => {
    let lawyerid;
    try {
      const response = await axios.get(
        `${ApiEndPoint}geLawyerDetails/basil@aws-legalgroup.com`
      ); // API endpoint
      setUser(response.data.user);
      setLawyersDetails(response.data.lawyerDetails);
      lawyerid = response.data.user?._id;
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }

    try {
      const response = await axios.get(
        `${ApiEndPoint}appointments/${lawyerid}`
      );

      if (!response.data || response.data.length === 0) {
        throw new Error("No appointment data found");
      }

      let temp = { ...response.data[0] }; // Clone to avoid mutation issues

      response.data.forEach((element) => {
        if (element.availableSlots) {
          temp.availableSlots = [
            ...(temp.availableSlots || []),
            ...element.availableSlots,
          ];
        }
      });

      setAppoinmentDetails(temp);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }

    try {
      const response = await axios.get(
        `${ApiEndPoint}getClientDetails/${token.email}`
      );
      // API endpoint
      // API endpoint
      setClientDetails(response.data);
      // console.log("clint data ", response.data);
      // console.log("clint data ", response.data);
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
    setUser(global.User);

    console.log(" dfsd", global.User?.UserName);
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

  // const sendEmail = (e) => {
  //   e.preventDefault();

  //   window.Email.send({
  //     Host: 'smtp.your-email-provider.com', // e.g., smtp.gmail.com
  //     Username: 'your-email@example.com',  // Your email
  //     Password: 'your-email-password',    // Your email password
  //     To: 'recipient-email@example.com',  // Recipient email
  //     From: formData.email,               // Sender email (from form)
  //     Subject: `Message from ${formData.name}`,
  //     Body: formData.message,
  //   })
  //     .then(() => {
  //       alert('Email sent successfully!');
  //       setFormData({ name: '', email: '', message: '' }); // Reset form
  //     })
  //     .catch((error) => {
  //       console.error('Email send failed:', error);
  //       alert('Failed to send email. Please try again.');
  //     });
  // };

  const months = ["January", "February", "March", "April"];
  const days = [
    { date: "08", day: "Mon" },
    { date: "09", day: "Tue" },
    { date: "10", day: "Wed" },
    { date: "11", day: "Thu" },
  ];
  // const hours = ["02:00 PM", "03:00 PM", "04:00 PM", "08:00 AM"];

  // const [selectedTime, setSelectedTime] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset the time when the date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const timeSlots = ["02:00 PM", "03:00 PM", "04:00 PM", "08:00 AM"]; // Example time slots

  const handleDayClick = (day) => {
    setdate(day.date);
    setDay(day.day);
    setSelectedTime();
  };

  const handleTimeClick = (time, slot) => {
    setslot(slot);
    setSelectedTime(time);
  };

  const handleOpenPopup = () => {
    setpopupmessage(
      `${subject} on ${new Intl.DateTimeFormat("en-US", options).format(
        selectedDate
      )} at ${convertTo12HourFormat(selectedTime)}?`
    );

    setpopupcolor("popup");
    setisPopupVisiblecancel(true);
    setTimeout(() => {
      setIsPopupVisible(true);
    }, 500);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  // const handleConfirm = () => {
  //   handleSchedule();
  // };

  const [isLoading, setIsLoading] = useState(false); // Loader state
  const [isEmailSent, setIsEmailSent] = useState(false); // Email sent confirmation

  const handleConfirm = async () => {
    setIsLoading(true);
    // Show loader
    try {
      await handleSchedule();
      // Call the function to send the email
      setIsEmailSent(true);
      setClientMessage(""); // Set email sent confirmation
      setTimeout(() => {
        setIsPopupVisible(false); // Close popup after showing confirmation
        setIsEmailSent(false); // Reset confirmation state after a delay
      }, 8000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setpopupmessage("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const convertTo12HourFormat = (timeString) => {
    let [hours, minutes] = timeString.split(":");
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert 0 to 12 for AM, and 13-23 to 1-11

    return `${hours}:${minutes} ${ampm}`; // Returns HH:MM AM/PM format
  };

  const handleSchedule = async () => {
    


    const { startTime, endTime } = selectedslot;


    // Ensure selectedDate is a valid Date object
    const meetingDate = selectedDate instanceof Date
      ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0] // Extract YYYY-MM-DD
      : new Date(selectedDate).toISOString().split("T")[0];

    console.log("Corrected Meeting Date:", meetingDate);


    // Combine formatted date with slot times
    const selectedStartTime = new Date(`${meetingDate}T${startTime}:00`);
    const selectedEndTime = new Date(`${meetingDate}T${endTime}:00`);
    console.log("startTime :", selectedStartTime);

   


        // Meeting details
  //  const preserveLocalTimeISO = (date) => {
  //   return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
  // };
  
  // // Preserve the original time while formatting as ISO
  // const meetingDetails = {
  //   summary: "Scheduled Meeting",
  //   startTime: preserveLocalTimeISO(selectedStartTime), // Keeps time unchanged
  //   endTime: preserveLocalTimeISO(selectedEndTime),
  //   timeZone: "Asia/Dubai", // UAE Time Zone
  // };
  
  // console.log("Meeting Details:", meetingDetails);
  

    
    // Meeting details
    const meetingDetails = {
      summary: "Scheduled Meeting",
      startTime: selectedStartTime.toISOString(),
      endTime: selectedEndTime.toISOString(),
      timeZone: "Asia/Dubai", // UAE Time Zone
    };

    console.log("Meeting Details:", meetingDetails);
 console.log("time ", selectedslot);

    let meeting = null;
    console.log(`Meeting Created Request: ${JSON.stringify(meetingDetails)}`);

    try {
      const response = await fetch(`${ApiEndPoint}createmeeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json(); // Parse JSON response
      await setmeetingLink(responseData.googleMeetLink); // Extract Google Meet link
      meeting = responseData.googleMeetLink;
      console.log(`Meeting Created: ${responseData.googleMeetLink}`);
    } catch (error) {
      console.error("Error creating meeting:", error.message);
    }

    const lawyerId = user?._id;

    let slot = selectedslot?._id;
    console.log("time ", slot);
    // console.log("updatedSlot =", updatedSlot)
    // console.log("updatespecifcslot", slot)
    let updatedSlot = {
      isBooked: true,
      byBook: ClientDetails.user?._id,
      meetingLink: meeting,
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      selectedDate
    );
    let mailmsg = {
      // ClientDetails: ClientDetails.user,
      ClientDetails: ClientDetails.user,
      lawyerDetails: user,
      selectedTime: convertTo12HourFormat(selectedTime),
      formattedDate: formattedDate,
      ClientMessage: ClientMessage,
      meetingLink: meeting,
    };
    const requestBody = {
      to: email,
      subject: subject,
      client: ClientDetails,
      mailmsg: mailmsg,
      text: `
         <strong>Client Message:</strong>
          <p>${ClientMessage}</p>
        Please note that <strong>${
          ClientDetails.user?.UserName
        }</strong> has scheduled a meeting with you at
        <strong>${convertTo12HourFormat(
          selectedTime
        )}</strong> on <strong>${formattedDate}</strong>.
      `,
      // `Please note that ${ClientDetails.user.UserName}  has scheduled a meeting with you at ${selectedTime} on ${formattedDate} <br>   <p><br> Client Message:${ClientMessage}</p>`,
      html: null,
    };
    console.log("Sending mail...");

    try {
      const response = await fetch(`${ApiEndPoint}send-mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response received");

      if (!response.ok) {
        setisPopupVisiblecancel(false);
        setpopupcolor("popupconfirm");
        setpopupmessage(
          isPopupVisible
            ? `Meeting Schedule mail not end ${response.status}`
            : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const responseupdate = await fetch(
          `${ApiEndPoint}Bookappointments/${lawyerId}/${slot}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedSlot),
          }
        );

        const update = await responseupdate.json();

        if (!responseupdate.ok) {
          throw new Error(data.message || "Failed to update slot");
        }

        await fetchLawyerDetails();
        console.log("Slot updated successfully:", update);

        const data = await response.json();
        console.log("Mail sent successfully:", data);
        setResponseData(data);
        setisPopupVisiblecancel(false);
        setpopupcolor("popupconfirm");
        setpopupmessage(
          isPopupVisible
            ? "Meeting Schedule mail is send"
            : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
            ? "Meeting Schedule mail is send"
            : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
        );
        setTimeout(() => {
          setIsPopupVisible(false);
        }, 3000);
        // Assuming setResponseData is a state updater
      }
    } catch (error) {
      console.error("Error in POST request:", error.message || error);
    }

  };

  // data = {
  //   _id: "6793988d3743e4374be812ae",
  //   FkLawyerId: {
  //     _id: "678cef7dd814e650e7fe5544",
  //   },
  //   availableSlots: [
  //     {
  //       date: "2025-01-25",
  //       slots: [
  //         {
  //           startTime: "10:00",
  //           endTime: "11:00",
  //           isBooked: false,
  //           _id: "6793988d3743e4374be812b0",
  //         },
  //         {
  //           startTime: "11:00",
  //           endTime: "12:00",
  //           isBooked: false,
  //           _id: "6793988d3743e4374be812b1",
  //         },
  //       ],
  //       _id: "6793988d3743e4374be812af",
  //     },
  //     {
  //       date: "2025-01-26",
  //       slots: [
  //         {
  //           startTime: "14:00",
  //           endTime: "15:00",
  //           isBooked: true,
  //           _id: "6793988d3743e4374be812b3",
  //         },
  //         {
  //           startTime: "15:00",
  //           endTime: "16:00",
  //           isBooked: false,
  //           _id: "6793988d3743e4374be812b4",
  //         },
  //       ],
  //       _id: "6793988d3743e4374be812b2",
  //     },
  //   ],
  //   __v: 0,
  // };
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

  return (
    <div
      className="border rounded row gap-5 justify-content-center ms-1 mt-2"
      style={{
        width: "100%",
        height: "85vh",
        overflowY: "auto",
        // padding: 10,
        boxShadow: "5px 5px 5px gray",
      }}
    >
      {/* <div className="row gap-5 justify-content-center "  > */}
      <div
        className="slots-section col-5 mt-3"
        style={{
          boxShadow: "5px 5px 5px gray",
          overflowY: "auto",
          maxHeight: "500px",
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "#d2a85a #16213e",
        }}
      >
        <div className="profile-section">
          <div className="d-flex flex-row">
            {/* <div
              className="client-picture mb-3"
              style={{
                border: "2px solid #d4af37",
                textAlign: "center",
                padding: "10px",
                borderRadius: "50%", // Use 50% for a perfect circle
                width: "100px",
                height: "100px",
                display: "flex", // Use flexbox for centering
                alignItems: "center", // Vertically center the icon
                justifyContent: "center", // Horizontally center the icon
              }}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="rounded-circle"
                style={{ fontSize: "48px" }} // Adjust the size of the icon
              />
            </div> */}
            <img
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
              src={
                user?.ProfilePicture ? (
                  `${user?.ProfilePicture}`
                ) : (
                  <div
                    className="client-picture mb-3"
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
                  >
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="rounded-circle"
                      style={{ fontSize: "48px" }} // Adjust the size of the icon
                    />
                  </div>
                )
              }
              alt="Profile"
              className="avatar-img"
            />
            <div className="d-flex flex-column justify-content-center p-2">
              <h2 style={{ color: " #d4af37" }}>{user?.UserName}</h2>
              <p style={{ color: "#d4af37" }}>{lawyerDetails?.Position}</p>
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
                color="white"
                className="m-2"
              />
              <p className="ms-2 m-1">
                <a href={mailtoLink} style={{ color: "white" }}>
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
                className="m-2"
              />
              <p style={{ height: 50 }} className="ms-2 m-1 ">
                {/* Address: [Your Name], [Street Address], [Apartment/Suite Number], [City], [State] [ZIP Code], [Country] */}
                {lawyerDetails?.Address}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="slots-section col-5  mt-3"
        style={{
          boxShadow: "5px 5px 5px gray",
          overflowY: "auto",
          maxHeight: "500px",
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "#d2a85a #16213e",
        }}
      >
        <div>
          {isPopupVisible && (
            <div className="popup-overlay">
              <div className={popupcolor}>
                {!isLoading && !isEmailSent && (
                  <>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      {popupmessage}
                    </h3>
                    <textarea
                      placeholder="Text Message (Optional)"
                      value={ClientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      style={{
                        width: "90%",
                        minHeight: "100px", // Adjust height as needed
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        margin: "10px 0",
                        resize: "vertical", // Allows resizing if needed
                      }}
                    ></textarea>

                    {isPopupVisiblecancel && (
                      <div className="popup-actions d-flex justify-content-center">
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
                    <p>Sending...</p>
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
          <button className="calender-button" onClick={prevMonth}>
            <FontAwesomeIcon icon={faArrowLeft} size="1x" color="white" />
          </button>
          <h3>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="calender-button">
            <FontAwesomeIcon icon={faArrowRight} size="1x" color="white" />
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
                border: " 1px solid #d2a85a",
                margin: 3,
                width: "calc(100% / 7)",
                textAlign: "center",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {calendarDates.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={index}
                    className="calendarEmpty"
                    style={{
                      width: "calc(100% / 7)",
                      height: "40px", // Consistent height for empty cells
                    }}
                  ></div>
                );
              }

              const dateStr = date.toDateString();
              const dateInfo = availableDatesInfo[dateStr] || {};
              const isAvailableDate = dateInfo.isAvailable;

              return (
                <div
                  key={index}
                  onClick={isAvailableDate ? () => handleDateClick(date) : null} // Disable click for unavailable dates
                  className={`calendarDates ${isAvailableDate ? "availableDate" : ""
                    }`}
                  style={{
                    border:
                      selectedDate?.getDate() === date?.getDate()
                        ? "2px solid white"
                        : "2px solid rgb(2, 30, 58)",
                    borderRadius: "5px",
                    color: isAvailableDate ? "" : "gray",
                    cursor: isAvailableDate ? "pointer" : "not-allowed", // Indicate disabled dates
                    background:
                      selectedDate?.getDate() === date?.getDate()
                        ? "#d2a85a"
                        : "",
                    // color: selectedDate?.getDate() === date?.getDate() ? 'black' : "",
                    textAlign: "center",
                    lineHeight: "40px",
                    height: "40px",
                    fontSize: 12, // Ensure consistent height
                  }}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div>
            <h5 style={{ color: " #d4af37" }}>Available Times:</h5>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {selectedDate ? (
                availableSlotsMap[selectedDate.toDateString()]?.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => handleTimeClick(slot.startTime, slot)}
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
                      fontSize: 11,
                      width: 130,
                    }}
                    disabled={slot.isBooked}
                    onMouseEnter={(e) => {
                      if (!slot.isBooked && selectedTime !== slot.startTime) {
                        e.target.style.background = "#d2a85a"; // Hover background (light golden)
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!slot.isBooked && selectedTime !== slot.startTime) {
                        e.target.style.background = "#16213e"; // Reset to default
                      }
                    }}
                  >
                    {convertTo12HourFormat(slot.startTime)} -{" "}
                    {convertTo12HourFormat(slot.endTime)}
                  </button>
                ))
              ) : (
                <p style={{ color: "gray" }}>
                  Select a date to view available times.
                </p>
              )}
            </div>
          </div>
        </div>

        {selectedTime && (
          <div
            style={{
              position: "fixed",
              bottom: "70px",
              right: "110px",
              zIndex: 1000,
              width: 60,
              height: 60,
              boxShadow: "5px 5px 5px black",
              borderRadius: "50%",
              border: "1px solid #d2a85a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: " #d2a85a",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#16213e"; // Reset to default
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#d2a85a"; // Hover background (light golden)
            }}
            onClick={() => handleOpenPopup()}
          >
            {/* <Button

              variant="primary"
              style={{
                // width: 'auto',
                boxShadow: "5px 5px 5px black",
                border: "1px solid #d2a85a",
                backgroundColor: " #16213e",
                 
                // display: "flex",
                // alignItems: "center",
                // justifyContent: "center",
                
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#d2a85a"; // Hover background (light golden)

              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#16213e"; // Reset to default
              }}
              onClick={() => handleOpenPopup()}
            > */}
            <BsCalendar2Plus
              style={
                {
                  //  padding: "15px 20px",
                }
              }
              color="white"
            />
            {/* </Button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAppointment;
