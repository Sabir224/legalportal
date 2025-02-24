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
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { ApiEndPoint } from "./Component/utils/utlis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { width } from "@fortawesome/free-solid-svg-icons/faComment";
// import { ApiEndPoint } from "../../utils/utils";
import Contactprofile from "./Images/CHAT.png";
import { FaCamera, FaEdit, FaLock } from "react-icons/fa";


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

    const storedEmail = sessionStorage.getItem("Email");


    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent("")}`;

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupVisiblecancel, setisPopupVisiblecancel] = useState(true);
    const [selectedDate, setSelectedDate] = useState();
    const [editingSlotIndex, setEditingSlotIndex] = useState(null);

    const options = { weekday: "long", month: "long", day: "numeric" }; // Format options
    let data;


    const [appointmentDetails, setAppointmentDetails] = useState({ availableSlots: [] });
    const [newTime, setNewTime] = useState(null);
    const [newStartTime, setNewStartTime] = useState(null);
    const [newEndTime, setNewEndTime] = useState(null);

    const [pic, setPic] = useState(user.profilepic);
    const [profilePicBase64, setProfilePicBase64] = useState(null);
    const [isEditing, setIsEditing] = useState(false);




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
        localStorage.setItem("appointments", JSON.stringify(appointmentDetails));
    }, [appointmentDetails]);




    const handleStartTimeChange = (time) => {
        setNewStartTime(time);
        setNewEndTime(new Date(time.getTime() + 15 * 60000)); // Default end time +30 mins
    };

    const handleAddTimeSlot = () => {
        if (selectedDate && newStartTime && newEndTime) {
            const formattedStartTime = newStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const formattedEndTime = newEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (newEndTime <= newStartTime) {
                alert("End time must be after start time!");
                return;
            }

            const newSlot = {
                date: selectedDate.toDateString(),
                slots: [{ startTime: formattedStartTime, endTime: formattedEndTime, isBooked: false }]
            };

            setAppointmentDetails((prevDetails) => {
                const updatedSlots = [...prevDetails.availableSlots];
                const existingSlotIndex = updatedSlots.findIndex(slot => slot.date === newSlot.date);

                if (existingSlotIndex > -1) {
                    const slotExists = updatedSlots[existingSlotIndex].slots.some(slot => slot.startTime === formattedStartTime);
                    if (!slotExists) {
                        updatedSlots[existingSlotIndex].slots.push(newSlot.slots[0]);
                    }
                } else {
                    updatedSlots.push(newSlot);
                }

                return { availableSlots: updatedSlots };
            });

            setNewStartTime(null);
            setNewEndTime(null);
        } else {
            alert("Please select a date, start time, and end time");
        }
    };

    const handleUpdateTimeSlot = () => {
        if (newStartTime && newEndTime && editingSlotIndex !== null) {
            setAppointmentDetails((prevDetails) => {
                const updatedSlots = [...prevDetails.availableSlots];
                const selectedDateSlots = updatedSlots.find(slot => slot.date === selectedDate.toDateString());

                if (selectedDateSlots) {
                    selectedDateSlots.slots[editingSlotIndex] = {
                        startTime: newStartTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        endTime: newEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isBooked: false
                    };
                }

                return { availableSlots: updatedSlots };
            });

            setEditingSlotIndex(null);
            setNewStartTime(null);
            setNewEndTime(null);
        } else {
            alert("Please select a start and end time");
        }
    };



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

    const fetchLawyerDetails = async () => {
        try {
            const response = await axios.get(
                `${ApiEndPoint}users/geLawyerDetails?Email=wissam@awsyounus.com`
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
                `${ApiEndPoint}users/getClientDetails?Email=${storedEmail}`
            );
            // API endpoint
            setClientDetails(response.data);
            console.log("clint data ", response.data)
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
            formData.append("Email", "sabir@biit.edu.pk" ); // Assuming `user.Email` exists
            formData.append("file", file);

            try {
                const response = await axios.post(`${ApiEndPoint}userUpdate`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
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
            {/* <div className="row gap-5 justify-content-center "  > */}
            <div
                className="slots-section col-5 mt-3"
                style={{ boxShadow: "5px 5px 5px gray" }}
            >
                <div className="profile-section">
                    <div className="d-flex flex-row">
                        <div style={containerStyle}>
                            <div
                                className="profile-pic"
                                style={profilePicStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={handleProfilePicClick} // Trigger file input click
                            >
                                <div className="camera-overlay" style={cameraOverlayStyle}>
                                    <FaCamera />
                                </div>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                id="profilePicInput"
                                onChange={handleFileInputChange}
                                style={{ display: "none" }}
                            />
                        </div>




                        <div className="d-flex flex-column justify-content-center p-2">
                            <h2>{user.UserName}</h2>
                            <p>{lawyerDetails.Position}</p>
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
                className="slots-section col-5  mt-3"
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
                            }}
                        >
                            {date ? date.getDate() : ""}
                        </div>
                    ))}
                </div>



                {selectedDate && (
                    <div>
                        <h5>Available Times:</h5>
                        {availableSlotsMap[selectedDate.toDateString()]?.map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setNewStartTime(new Date(`${selectedDate.toDateString()} ${slot.startTime}`));
                                    setNewEndTime(new Date(`${selectedDate.toDateString()} ${slot.endTime}`));
                                    setEditingSlotIndex(index); // ✅ FIX: Set index when editing
                                }}
                                disabled={slot.isBooked}
                            >
                                {slot.startTime} - {slot.endTime} {slot.isBooked ? "(Booked)" : ""}
                            </button>
                        ))}
                    </div>
                )}

                {selectedDate && (
                    <div>
                        <h5>{editingSlotIndex !== null ? "Edit Slot" : "Add New Slot"}</h5>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>

                            {/* Start Time Picker */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <label style={{ color: "white", marginBottom: "5px", textAlign: "center" }}>Start Time:</label>
                                <DatePicker
                                    selected={newStartTime}
                                    onChange={handleStartTimeChange}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Start Time"
                                    dateFormat="h:mm aa"
                                    className="small-datepicker"
                                />
                            </div>

                            {/* End Time Picker */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <label style={{ color: "white", marginBottom: "5px", textAlign: "center" }}>End Time:</label>
                                <DatePicker
                                    selected={newEndTime}
                                    onChange={(time) => setNewEndTime(time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="End Time"
                                    dateFormat="h:mm aa"
                                    className="small-datepicker"
                                />
                            </div>

                            {/* Add or Update Button */}
                            <button
                                onClick={editingSlotIndex !== null ? handleUpdateTimeSlot : handleAddTimeSlot}
                                style={{ height: "30px", borderRadius: 6, alignSelf: "center", width: 80, marginTop: "25px" }}
                            >
                                {editingSlotIndex !== null ? "Update" : "Add"}
                            </button>
                        </div>
                    </div>
                )}



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
