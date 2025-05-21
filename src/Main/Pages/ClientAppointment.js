import React, { useEffect, useState } from "react";
import "../../style/LawyerProfile.css";
import { Alert } from "bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import defaultProfilePic from "../Pages/Component/assets/icons/person.png";
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
import { ApiEndPoint, formatPhoneNumber } from "./Component/utils/utlis";
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
  BsArrowLeft,
  BsCalendar,
  BsCalendar2,
  BsCalendar2Plus,
  BsSend,
  BsSendFill,
  BsSendPlusFill,
} from "react-icons/bs";
import SocketService from "../../SocketService";
import { useSelector } from "react-redux";
import ErrorModal from "./AlertModels/ErrorModal";
// import { ApiEndPoint } from "../../utils/utils";

const ClientAppointment = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState("");
  const [ClientDetails, setClientDetails] = useState([]);
  const [lawyerDetails, setLawyersDetails] = useState([]);
  const [user, setUser] = useState();
  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const [date, setdate] = useState(null);
  const [getDay, setDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [popupmessage, setpopupmessage] = useState();
  const [popupcolor, setpopupcolor] = useState("popup");
  const [email, setEmail] = useState("taha@northern.edu.pk");
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
  const [pendingCaseData, setPendingCaseData] = useState(null);
  const [effectiveCaseInfo, setEffectiveCaseInfo] = useState(null);
  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);
  const [showFiles, setShowFiles] = useState(false);
  let data;

  const updateSlotStatus = (slotId) => {
    if (!appointmentDetails) return;

    // Create a deep copy to avoid mutating state directly
    const updatedDetails = {
      ...appointmentDetails,
      availableSlots: appointmentDetails.availableSlots.map((slot) =>
        slot.id === slotId ? { ...slot, isBooked: true } : slot
      ),
    };

    // Update state
    setAppoinmentDetails(updatedDetails);
  };
  useEffect(() => {
    if (!SocketService.socket || !SocketService.socket.connected) {
      console.log("🔌 Connecting to socket...");
      SocketService.socket.connect();
    }

    const handleMessagesDelivered = (data) => {
      fetchLawyerDetails();
    };

    SocketService.socket.off("slotHasBooked", handleMessagesDelivered);
    SocketService.onBookAppointment(handleMessagesDelivered);
  }, []);

  const [imageUrl, setImageUrl] = useState("");

  // useEffect(() => {
  //   fetch("http://172.16.18.250:8080/api/upload") // Replace with your API URL
  //     .then((response) => response.json())
  //     .then((data) => setImageUrl(data.imageUrl)) // Adjust based on API response
  //     .catch((error) => console.error("Error fetching image:", error));
  // }, []);

  useEffect(() => {
    const pendingCaseId = localStorage.getItem("pendingCaseId");
    const pendingUserId = localStorage.getItem("pendingUserId");

    if (pendingCaseId && pendingUserId) {
      setPendingCaseData({
        caseId: pendingCaseId,
        userId: pendingUserId,
      });
      setEffectiveCaseInfo({
        _id: pendingCaseId,
        ClientId: pendingUserId,
      });
    } else {
      setEffectiveCaseInfo(reduxCaseInfo);
    }

    // Initialize user from global if available
    if (global.User) {
      setUser(global.User);
    }
  }, []);

  // Sync with Redux when not using pending data
  useEffect(() => {
    if (!pendingCaseData && reduxCaseInfo) {
      setEffectiveCaseInfo(reduxCaseInfo);
    }
  }, [reduxCaseInfo, pendingCaseData]);

  const fetchLawyerDetails = async () => {
    setLoading(true);
    let lawyerid;

    try {
      // Use effectiveCaseInfo instead of direct caseInfo
      const caseIdToUse = effectiveCaseInfo?._id;
      if (!caseIdToUse) {
        throw new Error("Case ID not available");
      }

      // 1. Get lawyer ID from case
      const lawyerIdRes = await axios.get(
        `${ApiEndPoint}getCaseClientAndLawyerIds/${caseIdToUse}`
      );
      lawyerid = lawyerIdRes.data?.LawyerId;

      if (!lawyerid) {
        throw new Error("Lawyer ID not found");
      }

      // 2. Get lawyer details
      const lawyerDetailsRes = await axios.get(
        `${ApiEndPoint}getLawyerDetailsById/${lawyerid}`
      );
      setUser(lawyerDetailsRes.data?.user);
      setLawyersDetails(lawyerDetailsRes.data?.lawyerDetails);
      lawyerid = lawyerDetailsRes.data.user?._id;

      // 3. Get appointments
      const appointmentsRes = await axios.get(
        `${ApiEndPoint}appointments/${lawyerid}`
      );

      if (!appointmentsRes.data || appointmentsRes.data.length === 0) {
        throw new Error("No appointment data found");
      }

      let temp = { ...appointmentsRes.data[0] };
      appointmentsRes.data.forEach((element) => {
        if (element.availableSlots) {
          temp.availableSlots = [
            ...(temp.availableSlots || []),
            ...element.availableSlots,
          ];
        }
      });

      setAppoinmentDetails(temp);

      // 4. Get client details - use effectiveCaseInfo.ClientId
      const clientDetailsRes = await axios.get(
        `${ApiEndPoint}getClientDetailsByUserId/${effectiveCaseInfo?.ClientId}`
      );
      setClientDetails(clientDetailsRes.data);

      // Clear pending data if we used it successfully
      if (pendingCaseData) {
        localStorage.removeItem("pendingCaseId");
        localStorage.removeItem("pendingUserId");
        setPendingCaseData(null);
      }
    } catch (err) {
      console.error("Error fetching lawyer or client details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Socket connection effect - now uses effectiveCaseInfo
  useEffect(() => {
    if (!SocketService.socket || !SocketService.socket.connected) {
      console.log("🔌 Connecting to socket...");
      SocketService.socket.connect();
    }

    const handleMessagesDelivered = (data) => {
      fetchLawyerDetails();
    };

    SocketService.socket.off("slotHasBooked", handleMessagesDelivered);
    SocketService.onBookAppointment(handleMessagesDelivered);

    // Initial fetch
    if (effectiveCaseInfo?._id) {
      fetchLawyerDetails();
    }
  }, [effectiveCaseInfo?._id]);

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
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };
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
    const meetingDate =
      selectedDate instanceof Date
        ? new Date(
            selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split("T")[0] // Extract YYYY-MM-DD
        : new Date(selectedDate).toISOString().split("T")[0];

    console.log("Corrected Meeting Date:", meetingDate);

    // Combine formatted date with slot times
    const selectedStartTime = new Date(`${meetingDate}T${startTime}:00`);
    const selectedEndTime = new Date(`${meetingDate}T${endTime}:00`);
    console.log("startTime :", selectedStartTime);

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
      slot: slot,
      isBooked: true,
      byBook: ClientDetails.user?._id,
      meetingLink: meeting,
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      selectedDate
    );
    console.log("ClientDetails FOr Mails:", ClientDetails);
    let mailmsg = {
      // ClientDetails: ClientDetails.user,
      ClientDetails: ClientDetails?.user,
      lawyerDetails: user,
      selectedTime: convertTo12HourFormat(selectedTime),
      formattedDate: formattedDate,
      ClientMessage: ClientMessage,
      AssignedUsers: caseInfo?.AssignedUsers,
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
        SocketService.bookAppointment(updatedSlot);

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

  // return loading ? (
  //   <div className="d-flex justify-content-center align-items-center vh-100">
  //     <div className="text-center">
  //       <Spinner animation="border" variant="primary" />
  //       <p className="mt-2">Loading Lawyer details...</p>
  //     </div>
  //   </div>
  // ) : lawyerDetails && user && !loading ? (
  //   <div
  //     className="border rounded flex gap-5 justify-content-center ms-1 mt-2"
  //     style={{
  //       width: "100%",
  //       height: "85vh",
  //       overflowY: "auto",
  //       overflowX: "hidden",
  //       // padding: 10,
  //       boxShadow: "5px 0px 5px gray",
  //     }}
  //   >
  //     <div className="row gap-5 justify-content-center ms-1 mt-2">
  //       {/* <div className="row gap-5 justify-content-center "  > */}
  //       <div
  //         className="slots-section col-5 mt-3 mb-3"
  //         style={{
  //           boxShadow: "5px 5px 5px gray",
  //           overflowY: "auto",
  //           maxHeight: "500px",
  //           scrollbarWidth: "thin", // For Firefox
  //           scrollbarColor: "#d2a85a #16213e",
  //         }}
  //       >
  //         <div className="profile-section">
  //           <div className="d-flex flex-row">
  //             <img
  //               style={{
  //                 border: "2px solid #d4af37",
  //                 textAlign: "center",
  //                 padding: "3px",
  //                 borderRadius: "50%", // Use 50% for a perfect circle
  //                 width: "100px",
  //                 height: "100px",
  //                 display: "flex", // Use flexbox for centering
  //                 alignItems: "center", // Vertically center the icon
  //                 justifyContent: "center", // Horizontally center the icon
  //               }}
  //               src={
  //                 user?.ProfilePicture ? (
  //                   `${user?.ProfilePicture}`
  //                 ) : (
  //                   <div
  //                     className="client-picture mb-3"
  //                     style={{
  //                       border: "2px solid #d4af37",
  //                       textAlign: "center",
  //                       padding: "3px",
  //                       borderRadius: "50%", // Use 50% for a perfect circle
  //                       width: "100px",
  //                       height: "100px",
  //                       display: "flex", // Use flexbox for centering
  //                       alignItems: "center", // Vertically center the icon
  //                       justifyContent: "center", // Horizontally center the icon
  //                     }}
  //                   >
  //                     <FontAwesomeIcon
  //                       icon={faUserCircle}
  //                       className="rounded-circle"
  //                       style={{ fontSize: "48px" }} // Adjust the size of the icon
  //                     />
  //                   </div>
  //                 )
  //               }
  //               alt="Profile"
  //               className="avatar-img"
  //             />
  //             <div className="d-flex flex-column justify-content-center p-2">
  //               <h2 style={{ color: " #d4af37" }}>{user?.UserName}</h2>
  //               <p style={{ color: "#d4af37" }}>{lawyerDetails?.Position}</p>
  //             </div>
  //           </div>

  //           <div className="lawyer-details mt-1">
  //             <div
  //               className="d-flex"
  //               style={{ width: "auto", height: "55%", overflowY: "auto" }}
  //             >
  //               <p>{lawyerDetails.Bio}</p>
  //             </div>
  //             <div className="d-flex">
  //               <FontAwesomeIcon
  //                 icon={faMailBulk}
  //                 size="1x"
  //                 color="white"
  //                 className="m-2"
  //               />
  //               <p className="ms-2 m-1">
  //                 <a href={mailtoLink} style={{ color: "white" }}>
  //                   {user?.Email}
  //                 </a>
  //               </p>
  //             </div>
  //             <div className="d-flex">
  //               <FontAwesomeIcon icon={faPhone} className="m-2" />
  //               <p className="ms-2 m-1">
  //                 <a
  //                   href={`tel:${formatPhoneNumber(lawyerDetails?.Contact)}`}
  //                   style={{
  //                     textDecoration: "none",
  //                     color: "inherit",
  //                     display: "flex",
  //                     alignItems: "center",
  //                   }}
  //                 >
  //                   {formatPhoneNumber(lawyerDetails?.Contact)}
  //                 </a>
  //               </p>
  //             </div>

  //             <div className="d-flex">
  //               <FontAwesomeIcon
  //                 icon={faAddressCard}
  //                 size="1x"
  //                 color="white"
  //                 className="m-2"
  //               />
  //               <p style={{ height: 50 }} className="ms-2 m-1 ">
  //                 {/* Address: [Your Name], [Street Address], [Apartment/Suite Number], [City], [State] [ZIP Code], [Country] */}
  //                 {lawyerDetails?.Address}
  //               </p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //       <div
  //         className="slots-section col-5 mb-3 mt-3"
  //         style={{
  //           boxShadow: "5px 5px 5px gray",
  //           overflowY: "auto",
  //           maxHeight: "500px",
  //           scrollbarWidth: "thin", // For Firefox
  //           scrollbarColor: "#d2a85a #16213e",
  //         }}
  //       >
  //         <div>
  //           {isPopupVisible && (
  //             <div className="popup-overlay">
  //               <div className={popupcolor}>
  //                 {!isLoading && !isEmailSent && (
  //                   <>
  //                     <h3
  //                       style={{
  //                         fontSize: "18px",
  //                         fontWeight: "bold",
  //                         marginBottom: "5px",
  //                       }}
  //                     >
  //                       {popupmessage}
  //                     </h3>
  //                     <textarea
  //                       placeholder="Text Message (Optional)"
  //                       value={ClientMessage}
  //                       onChange={(e) => setClientMessage(e.target.value)}
  //                       style={{
  //                         width: "90%",
  //                         minHeight: "100px", // Adjust height as needed
  //                         padding: "8px",
  //                         border: "1px solid #ddd",
  //                         borderRadius: "6px",
  //                         margin: "10px 0",
  //                         resize: "vertical", // Allows resizing if needed
  //                       }}
  //                     ></textarea>

  //                     {isPopupVisiblecancel && (
  //                       <div className="popup-actions d-flex justify-content-center">
  //                         <button
  //                           className="confirm-btn"
  //                           onClick={handleConfirm}
  //                         >
  //                           Yes
  //                         </button>
  //                         <button
  //                           className="cancel-btn"
  //                           onClick={handleClosePopup}
  //                         >
  //                           No
  //                         </button>
  //                       </div>
  //                     )}
  //                   </>
  //                 )}
  //                 {isLoading && (
  //                   <div className="loading-indicator">
  //                     <p>Sending...</p>
  //                     <div className="spinner"></div>{" "}
  //                     {/* You can style a spinner here */}
  //                   </div>
  //                 )}
  //                 {isEmailSent && (
  //                   <div className="confirmation">
  //                     <FontAwesomeIcon
  //                       icon={faCheck}
  //                       size="3x"
  //                       color="white"
  //                       className="m-2"
  //                     />

  //                     {/* <h3>✔ Meeting Scheduled Successfully!</h3> */}
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           )}
  //         </div>

  //         {/* Month Selector */}
  //         <div
  //           className="d-flex "
  //           style={{ marginBottom: "2px", justifyContent: "space-between" }}
  //         >
  //           <div style={{ color: " #d4af37" }}>
  //             <h2>Available Slots</h2>
  //           </div>
  //         </div>

  //         <div
  //           style={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             alignItems: "center",
  //           }}
  //         >
  //           <button className="calender-button" onClick={prevMonth}>
  //             <FontAwesomeIcon icon={faArrowLeft} size="1x" color="white" />
  //           </button>
  //           <h3>
  //             {currentDate.toLocaleString("default", { month: "long" })}{" "}
  //             {currentDate.getFullYear()}
  //           </h3>
  //           <button onClick={nextMonth} className="calender-button">
  //             <FontAwesomeIcon icon={faArrowRight} size="1x" color="white" />
  //           </button>
  //         </div>

  //         {/* Days of the Week */}
  //         <div
  //           style={{
  //             display: "flex",
  //             justifyContent: "space-between",
  //             fontWeight: "bold",
  //             marginBottom: "5px",
  //           }}
  //         >
  //           {daysOfWeek.map((day) => (
  //             <div
  //               key={day}
  //               className="Calendarday"
  //               style={{
  //                 border: " 1px solid #d2a85a",
  //                 margin: 3,
  //                 width: "calc(100% / 7)",
  //                 textAlign: "center",
  //               }}
  //             >
  //               {day}
  //             </div>
  //           ))}
  //         </div>

  //         <div>
  //           <div style={{ display: "flex", flexWrap: "wrap" }}>
  //             {calendarDates.map((date, index) => {
  //               if (!date) {
  //                 return (
  //                   <div
  //                     key={index}
  //                     className="calendarEmpty"
  //                     style={{
  //                       width: "calc(100% / 7)",
  //                       height: "40px", // Consistent height for empty cells
  //                     }}
  //                   ></div>
  //                 );
  //               }

  //               const dateStr = date.toDateString();
  //               const dateInfo = availableDatesInfo[dateStr] || {};
  //               const isAvailableDate = dateInfo.isAvailable;

  //               return (
  //                 <div
  //                   key={index}
  //                   onClick={
  //                     isAvailableDate ? () => handleDateClick(date) : null
  //                   } // Disable click for unavailable dates
  //                   className={`calendarDates ${
  //                     isAvailableDate ? "availableDate" : ""
  //                   }`}
  //                   style={{
  //                     border:
  //                       selectedDate?.getDate() === date?.getDate()
  //                         ? "2px solid white"
  //                         : "2px solid rgb(2, 30, 58)",
  //                     borderRadius: "5px",
  //                     color: isAvailableDate ? "" : "gray",
  //                     cursor: isAvailableDate ? "pointer" : "not-allowed", // Indicate disabled dates
  //                     background:
  //                       selectedDate?.getDate() === date?.getDate()
  //                         ? "#d2a85a"
  //                         : "",
  //                     // color: selectedDate?.getDate() === date?.getDate() ? 'black' : "",
  //                     textAlign: "center",
  //                     lineHeight: "40px",
  //                     height: "40px",
  //                     fontSize: 12, // Ensure consistent height
  //                   }}
  //                 >
  //                   {date.getDate()}
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         </div>

  //         <div>
  //           <div>
  //             <h5 style={{ color: " #d4af37" }}>Available Times:</h5>
  //             <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  //               {selectedDate ? (
  //                 availableSlotsMap[selectedDate.toDateString()]?.map(
  //                   (slot) => (
  //                     <button
  //                       key={slot._id}
  //                       onClick={() => handleTimeClick(slot.startTime, slot)}
  //                       className="time-button"
  //                       style={{
  //                         padding: "5px 10px",
  //                         borderRadius: "5px",
  //                         border: "1px solid #d4af37",
  //                         background: slot.isBooked
  //                           ? "green" // Green if booked
  //                           : selectedTime === slot.startTime
  //                           ? "#d2a85a" // Golden when selected
  //                           : "#16213e", // Default background
  //                         color: "white",
  //                         cursor: slot.isBooked ? "not-allowed" : "pointer",
  //                         fontSize: 11,
  //                         width: 130,
  //                       }}
  //                       disabled={slot.isBooked}
  //                       onMouseEnter={(e) => {
  //                         if (
  //                           !slot.isBooked &&
  //                           selectedTime !== slot.startTime
  //                         ) {
  //                           e.target.style.background = "#d2a85a"; // Hover background (light golden)
  //                         }
  //                       }}
  //                       onMouseLeave={(e) => {
  //                         if (
  //                           !slot.isBooked &&
  //                           selectedTime !== slot.startTime
  //                         ) {
  //                           e.target.style.background = "#16213e"; // Reset to default
  //                         }
  //                       }}
  //                     >
  //                       {convertTo12HourFormat(slot.startTime)} -{" "}
  //                       {convertTo12HourFormat(slot.endTime)}
  //                     </button>
  //                   )
  //                 )
  //               ) : (
  //                 <p style={{ color: "gray" }}>
  //                   Select a date to view available times.
  //                 </p>
  //               )}
  //             </div>
  //           </div>
  //         </div>

  //         {selectedTime && (
  //           <div
  //             style={{
  //               position: "fixed",
  //               bottom: "70px",
  //               right: "110px",
  //               zIndex: 1000,
  //               width: 60,
  //               height: 60,
  //               boxShadow: "5px 5px 5px black",
  //               borderRadius: "50%",
  //               border: "1px solid #d2a85a",
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "center",
  //               backgroundColor: " #d2a85a",
  //             }}
  //             onMouseEnter={(e) => {
  //               e.target.style.background = "#16213e"; // Reset to default
  //             }}
  //             onMouseLeave={(e) => {
  //               e.target.style.background = "#d2a85a"; // Hover background (light golden)
  //             }}
  //             onClick={() => handleOpenPopup()}
  //           >
  //             <BsCalendar2Plus
  //               style={
  //                 {
  //                   //  padding: "15px 20px",
  //                 }
  //               }
  //               color="white"
  //             />
  //             {/* </Button> */}
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // ) : (
  //   <div className="d-flex justify-content-center align-items-center vh-100">
  //     <div className="text-center text-danger">
  //       <h4>No user found</h4>
  //     </div>
  //   </div>
  // );

  return loading ? (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading Lawyer details...</p>
      </div>
    </div>
  ) : lawyerDetails && user && !loading ? (
    <div
      className="card container-fluid p-0"
      style={{
        height: "86vh",
        maxWidth: "100vw",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <Row
        className="m-0 p-1 gap-3 gap-md-5 justify-content-center"
        style={{
          height: "84vh",
        }}
      >
        {/* Profile Section */}
        <Col
          xs={12}
          md={5}
          lg={5}
          className={`card border rounded d-flex flex-column mb-3 mt-3 p-1 ${
            showFiles ? "d-none d-md-block" : ""
          }`}
          style={{
            background: "#001f3f",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            minHeight: "300px",
            maxWidth: "100%",
          }}
        >
          {/* Shared Toggle - appears in both sections */}
          <div
            className="d-block d-md-none"
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              background: "#001f3f",
              padding: "5px 15px",
              borderRadius: "20px",
              border: "1px solid #d3b386",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            }}
          >
            <div className="d-flex justify-content-center align-items-center">
              <span
                className={`mx-2 fw-bold`}
                style={{
                  color: !showFiles ? "#d3b386" : "white",
                }}
              >
                Profile
              </span>
              <div className="form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  role="switch"
                  checked={showFiles}
                  onChange={() => setShowFiles(!showFiles)}
                  style={{
                    backgroundColor: "#d3b386",

                    width: "3em",
                    height: "1.5em",
                  }}
                />
              </div>
              <span
                className={`mx-2 fw-bold `}
                style={{
                  color: showFiles ? "gold" : "white",
                }}
              >
                Calendar
              </span>
            </div>
          </div>
          <div className="profile-section p-3 h-100 d-flex flex-column mt-4">
            {/* Profile Header */}
            <div className="d-flex flex-column align-items-center text-center mt-3">
              <div
                style={{
                  border: "2px solid #d4af37",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                  minWidth: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                  marginBottom: "1rem",
                }}
              >
                {user?.ProfilePicture ? (
                  <img
                    src={user.ProfilePicture}
                    alt="Profile"
                    className="img-fluid h-100 w-100"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={defaultProfilePic}
                    alt="Profile"
                    className="img-fluid h-100 w-100"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>

              <div>
                <h2
                  className="mb-0"
                  style={{
                    wordBreak: "break-word",
                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                  }}
                >
                  {user?.UserName}
                </h2>
                <p className="mb-0" style={{ color: "#d4af37" }}>
                  {lawyerDetails?.Position}
                </p>
              </div>
            </div>

            {/* Details Section */}
            <div className="lawyer-details mt-3 flex-grow-1">
              <div
                className="mb-2"
                style={{ maxHeight: "150px", overflowY: "auto" }}
              >
                <p>{lawyerDetails.Bio}</p>
              </div>

              <div className="d-flex align-items-center mb-2 flex-wrap">
                <FontAwesomeIcon icon={faMailBulk} className="me-2" />
                <p className="m-0" style={{ wordBreak: "break-word" }}>
                  <a
                    href={`mailto:${user?.Email}`}
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    {user?.Email}
                  </a>
                </p>
              </div>

              <div className="d-flex align-items-center mb-2 flex-wrap">
                <a
                  href={`tel:${formatPhoneNumber(lawyerDetails.Contact)}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faPhone} className="me-2" />
                  <span>{formatPhoneNumber(lawyerDetails.Contact)}</span>
                </a>
              </div>

              <div className="d-flex align-items-center mb-2 flex-wrap">
                <FontAwesomeIcon icon={faAddressCard} className="me-2" />
                <p className="m-0" style={{ wordBreak: "break-word" }}>
                  <a
                    href={`http://maps.google.com/?q=${encodeURIComponent(
                      lawyerDetails?.Address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "white",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {lawyerDetails?.Address}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Col>

        {/* Calendar Section */}
        <Col
          xs={12}
          md={5}
          lg={5}
          className={`card border rounded p-3 mb-3 mt-3 ${
            !showFiles ? "d-none d-md-block" : ""
          }`}
          style={{
            background: "#001f3f",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            maxWidth: "100%",
            minHeight: "300px",
          }}
        >
          {/* Toggle Switch */}
          <div
            className="d-block d-md-none"
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              background: "#001f3f",
              padding: "5px 15px",
              borderRadius: "20px",
              border: "1px solid #d3b386",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            }}
          >
            <div className="d-flex justify-content-center align-items-center">
              <span
                className="mx-2"
                style={{
                  color: !showFiles ? "#d3b386" : "white",
                  fontSize: "clamp(0.7rem, 1vw, 1rem)",
                }}
              >
                Profile
              </span>
              <div className="form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  role="switch"
                  checked={showFiles}
                  onChange={() => setShowFiles(!showFiles)}
                  style={{
                    backgroundColor: "#d3b386",
                    width: "3em",
                    height: "1.5em",
                  }}
                />
              </div>
              <span
                className="mx-2"
                style={{
                  color: showFiles ? "#d3b386" : "white",
                  fontSize: "clamp(0.7rem, 1vw, 1rem)",
                }}
              >
                Calendar
              </span>
            </div>
          </div>

          {/* Header Navigation */}
          <div
            className="d-flex justify-content-between align-items-center mt-5"
            style={{ gap: "10px" }}
          >
            <button className="calender-button" onClick={prevMonth}>
              <FontAwesomeIcon icon={faArrowLeft} size="1x" color="white" />
            </button>
            <h3 className=" text-white">
              {currentDate.toLocaleString("default", { month: "long" })}{" "}
              {currentDate.getFullYear()}
            </h3>
            <button onClick={nextMonth} className="calender-button">
              <FontAwesomeIcon icon={faArrowRight} size="1x" color="white" />
            </button>
          </div>

          {/* Days of the Week */}
          <div
            className="d-flex justify-content-between font-weight-bold my-2"
            style={{ gap: "3px" }}
          >
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="Calendarday"
                style={{
                  border: "1px solid #d2a85a",
                  width: "calc(100% / 7)",
                  textAlign: "center",
                  color: "white",
                  fontSize: "clamp(0.6rem, 1.5vw, 0.8rem)",
                }}
              >
                {day.substring(0, window.innerWidth < 400 ? 1 : 3)}
              </div>
            ))}
          </div>

          {/* Calendar Dates */}
          <div className="d-flex flex-wrap">
            {calendarDates.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={index}
                    className="calendarEmpty"
                    style={{ width: "calc(100% / 7)", height: "40px" }}
                  ></div>
                );
              }

              const dateStr = date.toDateString();
              const dateInfo = availableDatesInfo[dateStr] || {};
              const isAvailableDate = dateInfo.isAvailable;

              return (
                <div
                  key={index}
                  onClick={isAvailableDate ? () => handleDateClick(date) : null}
                  className={`calendarDates ${
                    isAvailableDate ? "availableDate" : ""
                  }`}
                  style={{
                    border:
                      selectedDate?.getDate() === date?.getDate()
                        ? "2px solid white"
                        : "2px solid rgb(2, 30, 58)",
                    borderRadius: "5px",
                    color: isAvailableDate ? "white" : "gray",
                    cursor: isAvailableDate ? "pointer" : "not-allowed",
                    background:
                      selectedDate?.getDate() === date?.getDate()
                        ? "#d2a85a"
                        : "",
                    textAlign: "center",
                    lineHeight: "40px",
                    height: "40px",
                    fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                    width: "calc(100% / 7)",
                  }}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="mt-3">
            <h5
              style={{
                color: "#d4af37",
                fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
              }}
            >
              Available Times:
            </h5>
            <div
              className="gap-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              }}
            >
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
                        ? "green"
                        : selectedTime === slot.startTime
                        ? "#d2a85a"
                        : "#16213e",
                      color: "white",
                      cursor: slot.isBooked ? "not-allowed" : "pointer",
                      fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                      width: "100%",
                    }}
                    disabled={slot.isBooked}
                    onMouseEnter={(e) => {
                      if (!slot.isBooked && selectedTime !== slot.startTime) {
                        e.target.style.background = "#d2a85a";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!slot.isBooked && selectedTime !== slot.startTime) {
                        e.target.style.background = "#16213e";
                      }
                    }}
                  >
                    {convertTo12HourFormat(slot.startTime)} -{" "}
                    {convertTo12HourFormat(slot.endTime)}
                  </button>
                ))
              ) : (
                <p
                  style={{
                    color: "gray",
                    fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
                  }}
                >
                  Select a date to view available times.
                </p>
              )}
            </div>
          </div>

          {/* Floating Button */}
          {selectedTime && (
            <div
              style={{
                position: "fixed",
                bottom: "70px",
                right: "20px",
                zIndex: 1000,
                width: 60,
                height: 60,
                boxShadow: "5px 5px 5px black",
                borderRadius: "50%",
                border: "1px solid #d2a85a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#d2a85a",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#16213e")}
              onMouseLeave={(e) => (e.target.style.background = "#d2a85a")}
              onClick={() => handleOpenPopup()}
            >
              <BsCalendar2Plus color="white" />
            </div>
          )}
        </Col>
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
                        color: "white",
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
      </Row>
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center text-danger">
        <h4>No user found</h4>
      </div>
    </div>
  );
};

export default ClientAppointment;
