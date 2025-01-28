import React, { useEffect, useState } from "react";
import "../../style/LawyerProfile.css";
import { Alert } from "bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faCalendar,
  faCheck,
  faHome,
  faMailBulk,
  faMailReply,
  faMessage,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ApiEndPoint } from "../../utils/utils";

const LawyerProfile = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState("");
  const [lawyerDetails, setLawyersDetails] = useState([]);
  const [ClientDetails, setClientDetails] = useState([]);
  const [user, setUser] = useState([global.User]);

  const [date, setdate] = useState(null);
  const [getDay, setDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [popupmessage, setpopupmessage] = useState();
  const [popupcolor, setpopupcolor] = useState("popup");
  const [email, setEmail] = useState("raheemakbar999@gmail.com");
  const [subject, setSubject] = useState("Meeting Confirmation");

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent("")}`;

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisiblecancel, setisPopupVisiblecancel] = useState(true);
  const [selectedDate, setSelectedDate] = useState();
  const [AppointmentDetails, setAppoinmentDetails] = useState(new Date());

  const options = { weekday: "long", month: "long", day: "numeric" }; // Format options
  let data;
  useEffect(() => {
    fetchLawyerDetails();
  }, [user, AppointmentDetails]);

  const fetchLawyerDetails = async () => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}appointments/678cef7dd814e650e7fe5544`
      ); // API endpoint
      console.log("msdasda", response.data[0]);
      setAppoinmentDetails(response.data[0]);
      data = response.data[0];
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    try {
      const response = await axios.get(
        `${ApiEndPoint}users/geLawyerDetails?Email=taha@gmail.com`
      ); // API endpoint
      setUser(response.data.user);
      setLawyersDetails(response.data.lawyerDetails);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    try {
      const response = await axios.get(
        `${ApiEndPoint}users/getClientDetails?Email=Raheem@gmail.com`
      ); // API endpoint
      setClientDetails(response.data);
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

    console.log(" dfsd", global.User.UserName);
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

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleOpenPopup = () => {
    setpopupmessage(
      `${subject} on ${new Intl.DateTimeFormat("en-US", options).format(
        selectedDate
      )} at ${selectedTime}?`
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
    setIsLoading(true); // Show loader
    try {
      await handleSchedule(); // Call the function to send the email
      setIsEmailSent(true); // Set email sent confirmation
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

  const handleSchedule = async () => {
    // if (selectedDate && selectedTime) {
    // setpopupmessage(`${subject} on ${new Intl.DateTimeFormat('en-US', options).format(selectedDate)} at ${selectedTime} ?`)

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      selectedDate
    );
    const requestBody = {
      to: email,
      subject: subject,
      client: ClientDetails,
      text: ` Please note that ${ClientDetails.user.UserName}  has scheduled a meeting with you at ${selectedTime} on ${formattedDate} `,
      html: null,
    };

    console.log("Sending mail...");

    try {
      const response = await fetch("${ApiEndPoint}send-mail", {
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
      }

      const data = await response.json();
      setResponseData(data);
      setisPopupVisiblecancel(false);
      setpopupcolor("popupconfirm");
      setpopupmessage(
        isPopupVisible
          ? "Meeting Schedule mail is send"
          : new Intl.DateTimeFormat("en-US", options).format(selectedDate)
      );
      setTimeout(() => {
        setIsPopupVisible(false);
      }, 3000);
      // Assuming setResponseData is a state updater
      console.log("Mail sent successfully:", data);
    } catch (error) {
      console.error("Error in POST request:", error.message || error);
    }

    // alert(`Meeting scheduled on  ${selectedDate.day} at ${selectedTime}`);
    // } else {
    //   alert("Please select both a day and time to schedule a meeting.");
    // }
  };

  data = {
    _id: "6793988d3743e4374be812ae",
    FkLawyerId: {
      _id: "678cef7dd814e650e7fe5544",
    },
    availableSlots: [
      {
        date: "2025-01-25",
        slots: [
          {
            startTime: "10:00",
            endTime: "11:00",
            isBooked: false,
            _id: "6793988d3743e4374be812b0",
          },
          {
            startTime: "11:00",
            endTime: "12:00",
            isBooked: false,
            _id: "6793988d3743e4374be812b1",
          },
        ],
        _id: "6793988d3743e4374be812af",
      },
      {
        date: "2025-01-26",
        slots: [
          {
            startTime: "14:00",
            endTime: "15:00",
            isBooked: true,
            _id: "6793988d3743e4374be812b3",
          },
          {
            startTime: "15:00",
            endTime: "16:00",
            isBooked: false,
            _id: "6793988d3743e4374be812b4",
          },
        ],
        _id: "6793988d3743e4374be812b2",
      },
    ],
    __v: 0,
  };
  const availableSlotsMap = data.availableSlots.reduce((acc, slot) => {
    const dateStr = new Date(slot.date).toDateString();
    acc[dateStr] = slot.slots; // Store slots by date
    return acc;
  }, {});
  const availableDatesInfo = data.availableSlots.reduce((acc, slot) => {
    const dateStr = new Date(slot.date).toDateString();
    const hasBookedSlot = slot.slots.some((timeSlot) => timeSlot.isBooked); // Check for booked slots
    acc[dateStr] = { isAvailable: true, hasBookedSlot };
    return acc;
  }, {});

  return (
    <div
      className="border rounded row gap-5 justify-content-center ms-1 mb-3"
      style={{
        width: "92%",
        maxHeight: "83vh",
        overflowY: "auto",
        padding: 14,
        boxShadow: "5px 5px 5px gray",
      }}
    >
      {/* <div className="row gap-5 justify-content-center "  > */}
      <div
        className="slots-section col-5 "
        style={{ boxShadow: "5px 5px 5px gray" }}
      >
        <div className="profile-section">
          <div
            className="lawyer-picture "
            style={{
              border: "2px solid #d4af37",
              // alignSelf: 'center',
              textAlign: "center",
            }}
          >
            Lawyer's Picture
          </div>
          <div className="lawyer-details">
            <h2>{user.UserName}</h2>
            <p>{lawyerDetails.Position}</p>
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
                  {user.Email}
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
              <p className="ms-2 m-1">{lawyerDetails.Contact}</p>
            </div>

            <div className="d-flex">
              <FontAwesomeIcon
                icon={faAddressCard}
                size="1x"
                color="white"
                className="m-2"
              />
              <p style={{ height: 50, fontSize: 12 }} className="ms-2 m-1 ">
                {/* Address: [Your Name], [Street Address], [Apartment/Suite Number], [City], [State] [ZIP Code], [Country] */}
                {lawyerDetails.Address}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="slots-section col-5 "
        style={{ boxShadow: "5px 5px 5px gray" }}
      >
        <div>
          {isPopupVisible && (
            <div className="popup-overlay">
              <div className={popupcolor}>
                {!isLoading && !isEmailSent && (
                  <>
                    <h3>{popupmessage}</h3>
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
          <div>
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
            Prev
          </button>
          <h3>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="calender-button">
            Next
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

        {/* Calendar Grid */}
        {/* <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {calendarDates.map((date, index) => (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={date ? "calendarDates" : "calendarEmpty"}
              style={{

                border: selectedDate?.getDate() === date?.getDate() ? '2px solid white' : '1px solid #001f3f',
                borderRadius: '5px',
                cursor: date ? 'pointer' : 'default',
                background: selectedDate?.getDate() === date?.getDate() ? '#d2a85a' : '',
                color: selectedDate?.getDate() === date?.getDate() ? '#001f3f' : 'white',
              }}
            >
              {date ? date.getDate() : ''}
            </div>
          ))}
        </div> */}

        {/*        

        <div>
          <h5>Available Times:</h5>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeClick(time)}
                className="time-button"
                disabled={!selectedDate}
                style={{
                  padding: '2px 10px',
                  borderRadius: '5px',
                  border: selectedTime === time ? '2px solid white' : '1px solid #d4af37',
                  background: selectedTime === time ? '#d2a85a' : '',
                  color: selectedTime == time ? '#16213e' : 'white',
                  cursor: selectedDate ? 'pointer' : 'not-allowed',
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div> */}

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
                  className={`calendarDates ${
                    isAvailableDate ? "availableDate" : ""
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
                    height: "40px", // Ensure consistent height
                  }}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>

          {/* <div>
            <h5>Available Times:</h5>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {timeSlots.map((time) => {
                // Check if the time slot is booked
                const isBookedSlot = selectedDate && data.availableSlots.some((slot) => {
                  const dateStr = new Date(slot.date).toDateString();
                  return (
                    dateStr === selectedDate.toDateString() &&
                    slot.slots.some((timeSlot) => timeSlot.startTime === time && timeSlot.isBooked)
                  );
                });

                return (
                  <button
                    key={time}
                    onClick={() => handleTimeClick(time)}
                    className="time-button"
                    disabled={!selectedDate}
                    style={{
                      padding: '2px 10px',
                      borderRadius: '5px',
                      border: (selectedTime === time && isBookedSlot)? '2px solid white' : '1px solid #d4af37',
                      background: isBookedSlot
                        ? 'green' // Green for booked slots
                        : selectedTime === time
                          ? '#d2a85a' // Highlight selected slot
                          : '',
                      color: isBookedSlot ? 'white' : selectedTime === time ? '#16213e' : 'white',
                      cursor: selectedDate ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
             */}
        </div>

        <div>
          <div>
            <h5>Available Times:</h5>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {selectedDate ? (
                availableSlotsMap[selectedDate.toDateString()]?.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => handleTimeClick(slot.startTime)}
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
                    }}
                    disabled={slot.isBooked}
                    onMouseEnter={(e) => {
                      if (!slot.isBooked && selectedTime !== slot.startTime) {
                        e.target.style.background = "#d4af37"; // Hover background (light golden)
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
                ))
              ) : (
                <p style={{ color: "gray" }}>
                  Select a date to view available times.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          className="schedule-button"
          style={{
            boxShadow: "5px 5px 5px gray",
            border: "2px solid #d4af37",
            borderRadius: "6px",
          }}
          onClick={handleOpenPopup}
        >
          Schedule Meeting
        </button>
      </div>
      {/* </div> */}
    </div>
  );
};

export default LawyerProfile;
