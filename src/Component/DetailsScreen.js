// import React, { useEffect, useState } from "react";
// import "react-calendar/dist/Calendar.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const DetailsScreen = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [appointmentDetails, setAppointmentDetails] = useState({ availableSlots: [] });
//   const [newTime, setNewTime] = useState(null);

//   useEffect(() => {
//     // Load existing appointments from local storage (optional)
//     const storedAppointments = JSON.parse(localStorage.getItem("appointments"));
//     if (storedAppointments) {
//       setAppointmentDetails(storedAppointments);
//     }
//   }, []);

//   useEffect(() => {
//     // Save updated slots to local storage (optional)
//     localStorage.setItem("appointments", JSON.stringify(appointmentDetails));
//   }, [appointmentDetails]);

//   const availableSlotsMap = appointmentDetails?.availableSlots?.reduce((acc, slot) => {
//     const dateStr = new Date(slot.date).toDateString();
//     acc[dateStr] = slot.slots;
//     return acc;
//   }, {}) || {};

//   const handleDateClick = (date) => {
//     setSelectedDate(date);
//     setSelectedTime(null); // Reset time selection when date changes
//   };

//   const handleTimeSelect = (time) => {
//     setSelectedTime(time);
//   };

//   const handleAddTimeSlot = () => {
//     if (selectedDate && newTime) {
//       const formattedTime = newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
//       const newSlot = {
//         date: selectedDate.toDateString(),
//         slots: [{ startTime: formattedTime, endTime: "", isBooked: false }]
//       };

//       setAppointmentDetails((prevDetails) => {
//         const updatedSlots = [...prevDetails.availableSlots];
//         const existingSlotIndex = updatedSlots.findIndex(slot => slot.date === newSlot.date);
        
//         if (existingSlotIndex > -1) {
//           // Prevent duplicate time slot
//           const slotExists = updatedSlots[existingSlotIndex].slots.some(slot => slot.startTime === formattedTime);
//           if (!slotExists) {
//             updatedSlots[existingSlotIndex].slots.push(newSlot.slots[0]);
//           }
//         } else {
//           updatedSlots.push(newSlot);
//         }
        
//         return { availableSlots: updatedSlots };
//       });

//       setNewTime(null);
//     } else {
//       alert("Please select a date and time");
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Available Slots</h2>
//       <div>
//         <h3>
//           {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
//         </h3>
//         <input
//           type="date"
//           onChange={(e) => handleDateClick(new Date(e.target.value))}
//         />
//       </div>

//       {selectedDate && (
//         <div>
//           <h5>Available Times:</h5>
//           {availableSlotsMap[selectedDate.toDateString()]?.map((slot, index) => (
//             <button
//               key={index}
//               onClick={() => handleTimeSelect(slot.startTime)}
//               disabled={slot.isBooked}
//             >
//               {slot.startTime} {slot.isBooked ? "(Booked)" : ""}
//             </button>
//           ))}
//         </div>
//       )}

//       {selectedDate && (
//         <div>
//           <h5>Add New Slot</h5>
//           <DatePicker
//             selected={newTime}
//             onChange={(time) => setNewTime(time)}
//             showTimeSelect
//             showTimeSelectOnly
//             timeIntervals={30}
//             timeCaption="Time"
//             dateFormat="h:mm aa"
//           />
//           <button onClick={handleAddTimeSlot}>Add Slot</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetailsScreen;






import React, { useEffect, useRef, useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import { BsPerson, BsStackOverflow } from "react-icons/bs";
import Contactprofile from "../../../src/pages/components/images/Asset 70mdpi.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import phone input styles
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../Auth/AuthContext"; // Import your authentication context
import Warning, { ApiEndPoint } from "../components/utils/utlis";
import loginStyle from "../ContactForm/contact.module.css";
import defaultProfilePic from "../components/assets/icons/person.png";
import { MdOutlineAttachEmail } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
import ExcelUploadPopup from "./dropzonComponent";
import ExcelUploadPopup2 from "./dropzonComponent2";
import { FaCamera, FaEdit, FaLock } from "react-icons/fa";

const ContactForm = ({ onClose }) => {
  // const { login } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUserName] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleCloseWarning = () => setShowWarning(false);
  const [profilePicBase64, setProfilePicBase64] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        console.log("Base64:", base64String);
        setProfilePicBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger click on the hidden file input
  };

  const handleNavigation = async (event) => {
    event.preventDefault();

    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const requestData = {
        username: username,
        email: email,
        phoneNumber: phoneNumber,
      };

      if (profilePicBase64) {
        requestData.profilePicBase64 = profilePicBase64;
      }

      const response = await axios.post(
        `${ApiEndPoint}/addClient`,
        requestData
      );

      if (response.status === 200) {
        //alert("Contact Added successfully");
        // Handle success scenario
        onClose();
      }
    } catch (error) {
      console.error("Error:", error.response.status);
      if (error.response.status === 409) {
        setErrorMessage("Contact Already Exists");
        setShowWarning(true); // Show warning modal for user already exists
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        setShowWarning(true); // Show warning modal for other errors
      }
    }
  };

  return (
    <div>
      <form className="Theme3">
        <div className="mb-2 text-center avatar-container">
          <label htmlFor="profilePicInput">
            <img
              src={
                profilePicBase64
                  ? `data:image/jpeg;base64,${profilePicBase64}`
                  : defaultProfilePic
              }
              alt="Profile"
              style={{
                maxWidth: "80px",
                maxHeight: "80px",
                minWidth: "50px",
                minHeight: "50px",
                borderRadius: "50%",
                border: "1px solid #18273e",
                boxShadow: "#18273e 0px 2px 5px",
              }}
              className="avatar-img"
              onClick={() => document.getElementById("profilePicInput").click()}
            />
          </label>
          <input
            type="file"
            accept="image/*"
            id="profilePicInput"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="text-start d-flex flex-column gap-3">
          {/* Name Field */}
          <div>
            <label className="form-label font-weight-bold">
              <p
                className="ml-3 fw-bold"
                style={{ marginLeft: "3px", fontSize: "1.05rem" }}
              >
                Name
              </p>
            </label>
            <div
              className="input-group bg-soft-light rounded-2"
              style={{ marginTop: -8 }}
            >
              <span className="input-group-text">
                <BsPerson />
              </span>
              <input
                className={
                  loginStyle["form-control-1"] + " form-control-md form-control"
                }
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                id="Name"
                name="username"
                placeholder="Enter Name"
                type="text"
                title="Please Enter Client Name"
                onFocus={(e) => (e.target.style.borderColor = "#18273e")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="text-start">
            <label className="form-label font-weight-bold">
              <p
                className="fw-bold"
                style={{ marginLeft: "3px", fontSize: "1.05rem" }}
              >
                Email
              </p>
            </label>
            <div
              className="input-group bg-soft-light rounded-2"
              style={{ marginTop: -8 }}
            >
              <span className="input-group-text">
                <MdOutlineAttachEmail />
              </span>
              <input
                className={
                  loginStyle["form-control-1"] + " form-control-md form-control"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="Email"
                name="email"
                placeholder="Enter Email"
                type="email"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                title="Enter a valid email address"
                onFocus={(e) => (e.target.style.borderColor = "#18273e")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                required
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="text-start">
            <label className="form-label" style={{ marginBottom: "-0.6rem" }}>
              <p
                className="fw-bold"
                style={{ marginLeft: "3px", fontSize: "1.05rem" }}
              >
                WhatsApp Number
              </p>
            </label>
            <div>
              <PhoneInput
                containerClass="form-control-md mb-1"
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true,
                  onFocus: (e) => (e.target.style.borderColor = "#18273e"),
                  onBlur: (e) => (e.target.style.borderColor = "#ccc"),
                }}
                containerStyle={{
                  borderRadius: "10px",
                }}
                enableSearch={true}
                searchStyle={{
                  width: "100%",
                }}
                disableSearchIcon={true}
                inputStyle={{
                  width: "100%",
                  border: "1px solid",
                  boxShadow: "none",
                  height: "37px",
                }}
                buttonStyle={{}}
                country={"ae"} // Set default country to UAE
                value={phoneNumber}
                onChange={(phone) => setPhoneNumber(phone)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="button-container d-flex justify-content-center">
            {showWarning && (
              <p
                style={{ marginTop: -25 }}
                className="text-danger fs-6 mt-0.1rem"
              >
                {errorMessage}
              </p>
            )}
            <button
              className={loginStyle["btn-color"] + " btn text-light"}
              type="submit"
              style={{
                backgroundColor: "#18273e",
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#18273e";
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#d3b386";
              }}
              onClick={handleNavigation}
            >
              Add Contact
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const UpdateForm = ({ user }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUserName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [pic, setPic] = useState(user.profilepic);
  const [color_code, setcolor_code] = useState(user.color_code);
  const handleCloseWarning = () => setShowWarning(false);
  const [profilePicBase64, setProfilePicBase64] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64StringWithMimeType = reader.result; // Includes MIME type and base64 string
        setProfilePicBase64(base64StringWithMimeType);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setUserName(user.name);
    setPhoneNumber(user.phone);
    setEmail(user.email);
    setcolor_code(user.color_code);
    setProfilePicBase64(user.profilepic);

    setIsEditing(false);
    setShow(true);
  }, [user]);
  const handleSave = async () => {
    await axios
      .put(`${ApiEndPoint}/updateUser/${user.id}`, {
        name: username,
        email: email,
        phone: phoneNumber,
        color_code: color_code,
        profilePic: profilePicBase64,
      })
      .then((response) => {
        console.log(response.data.message); // Log success message from the backend
        if (response.status === 200) {
          setShow(false);
          setProfilePicBase64(null);
        }
      })
      .catch((error) => {
        console.error(error); // Log any errors
      });
  };
  const handleDelete = async () => {
    await axios
      .delete(`${ApiEndPoint}/deleteuser/${user.id}/${user.phone}`)

      .then((response) => {
        console.log(response.data.message); // Log success message from the backend
        if (response.status === 200) {
          setShow(null);
          setProfilePicBase64(null);
        }
      })
      .catch((error) => {
        console.error(error); // Log any errors
      });
  };
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  // const handleUpdate = async (event) => {
  //   event.preventDefault();

  //   // Email validation regex pattern
  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!emailPattern.test(email)) {
  //     setErrorMessage("Please enter a valid email address.");
  //     return;
  //   }

  //   try {
  //     console.log(
  //       "UserName:",
  //       username,
  //       "Email:",
  //       email,
  //       "phoneNumber:",
  //       phoneNumber,
  //       "image:",
  //       profilePicBase64
  //     );

  //     const response = await axios.post(`${ApiEndPoint}/update`, {
  //       username: username,
  //       email: email,
  //       phoneNumber: phoneNumber,
  //       profilePicBase64: profilePicBase64,
  //     });
  //     console.log("USER Data:", response.data);
  //     if (response.status === 200) {
  //       console.log("USER success:", response);
  //       // Handle success scenario
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.response.status);
  //     if (error.response.status === 409) {
  //       setErrorMessage("Client already exists.");
  //       setShowWarning(true); // Show warning modal for user already exists
  //     } else {
  //       setErrorMessage("An error occurred. Please try again later.");
  //       setShowWarning(true); // Show warning modal for other errors
  //     }
  //   }
  // };
  const containerStyle = {
    position: "relative",
    display: "inline-block", // Ensure the container fits around the content
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
    backgroundImage: pic
      ? `url(${profilePicBase64})`
      : `url(${Contactprofile})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#fff", // Fallback background color
    position: "relative",
    overflow: "hidden", // Ensure the camera icon stays within the rounded area
  };

  const cameraOverlayStyle = {
    display: "none", // Hide the overlay by default
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // Center the icon
    color: "#d3b386", // Color for the icon
    fontSize: "24px", // Adjust size as needed
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.3)", // Optional: Semi-transparent background
    zIndex: 1,
  };
  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector(".camera-overlay").style.display = "flex";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector(".camera-overlay").style.display = "none";
  };
  const handleProfilePicClick = () => {
    if (isEditing) {
      document.getElementById("profilePicInput").click();
    }
  };
  return (
    <center style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Close Button at the Top Level */}
      {show && (
        <button
          title="Close"
          onClick={() => setShow(false)}
          style={{
            position: "absolute",
            top: "0px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#d3b386",
          }}
        >
          &times;
        </button>
      )}

      {show ? (
        <div style={{ width: "50%", position: "relative" }}>
          {/* Profile Picture */}
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
          {/* Edit Icon */}
          <div>
            {isEditing ? (
              <FaLock
                onClick={handleEdit}
                style={{
                  cursor: "pointer",
                  marginTop: "10px",
                  color: "#d3b386",
                }}
              />
            ) : (
              <FaEdit
                onClick={handleEdit}
                style={{
                  cursor: "pointer",
                  marginTop: "10px",
                  color: "#d3b386",
                }}
              />
            )}
          </div>

          {/* Form Fields */}
          <div className="text-start d-flex flex-column gap-3">
            {/* Name Field */}
            <div>
              <label
                className="form-label fw-bold"
                style={{
                  marginBottom: "10px",
                  fontSize: "1rem",
                  marginLeft: "3px",
                }}
              >
                Name
              </label>
              <div
                className="input-group bg-soft-light rounded-2"
                style={{ marginTop: "-10px" }}
              >
                <span className="input-group-text">
                  <BsPerson />
                </span>
                <input
                  style={{
                    borderColor: "#18273e", // Green border for unfocused state
                    boxShadow: "none", // Remove default Bootstrap shadow on focus
                  }}
                  className="form-control-md form-control"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  id="Name"
                  name="username"
                  placeholder="Enter Name"
                  type="text"
                  title="Please Enter Client Name"
                  required
                  readOnly={!isEditing}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d3b386"; // Orange border on focus
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#18273e"; // Green border on unfocus
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                className="form-label fw-bold"
                style={{
                  marginBottom: "10px",
                  fontSize: "1rem",
                  marginLeft: "3px",
                }}
              >
                Email
              </label>
              <div
                className="input-group bg-soft-light rounded-2"
                style={{ marginTop: "-10px" }}
              >
                <span className="input-group-text">
                  <MdOutlineAttachEmail />
                </span>
                <input
                  className="form-control-md form-control"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  id="Email"
                  name="email"
                  placeholder="Enter Email"
                  type="email"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  title="Enter a valid email address"
                  readOnly={!isEditing}
                  style={{
                    borderColor: "#18273e", // Green border for unfocused state
                    boxShadow: "none", // Remove default Bootstrap shadow on focus
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d3b386"; // Orange border on focus
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#18273e"; // Green border on unfocus
                  }}
                />
              </div>
            </div>

            {/* WhatsApp Number Field */}
            <div>
              <label
                className="form-label fw-bold"
                style={{
                  marginBottom: "-10px",
                  fontSize: "1rem",
                  marginLeft: "3px",
                }}
              >
                WhatsApp Number
              </label>
              <div>
                <PhoneInput
                  containerClass="form-control-md"
                  inputProps={{
                    name: "phone",
                    onBlur: (e) => {
                      e.target.style.borderColor = "#18273e";
                      e.target.style.boxShadow = "none";
                    },
                    onFocus: (e) => {
                      e.target.style.borderColor = "#d3b386"; // Orange border on focus
                    },
                  }}
                  containerStyle={{
                    borderRadius: "10px",
                  }}
                  disableSearchIcon={true}
                  inputStyle={{
                    width: "100%",
                    border: "1px solid #18273e",
                    boxShadow: "none",
                    height: "37px",
                  }}
                  country={"ae"}
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  disabled={!isEditing} // Toggle editability based on isEditing state
                />
              </div>
            </div>

            {/* Buttons */}
            {isEditing && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={handleSave}
                  style={{
                    width: "48%",
                    color: "white",
                    background: "#18273e",
                    height: "40px",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 500,
                  }}
                >
                  Update
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    width: "48%",
                    color: "white",
                    background: "#d3b386",
                    height: "40px",
                    border: "none",
                    borderRadius: "10px",
                    fontWeight: 500,
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="gap-3 text-center d-flex flex-column justify-content-center align-items-center h-100 w-100">
          <GrContactInfo className="fs-1" />
          <div>
            <h4>Contact Detail</h4>
            <p>Click any contact to view details</p>
          </div>
        </div>
      )}
    </center>
  );
};

// Assuming ContactForm is in the same directory

const ContactFormModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("contact");
  const [showContactModal, setshowContactModal] = useState(false);
  const [group, setGroup] = useState(false);
  const closeContactModal = () => {
    setshowContactModal(false);
  };
  const closeContactModal5 = () => {
    setGroup(false);
  };
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {activeTab === "contact" && "Add Contact"}
          {activeTab === "conatctsUpload" && "Upload Contacts"}
          {activeTab === "createbroadcast" && "Create Broadcast"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="tabs" className="mb-2">
            <Nav.Item>
              <Nav.Link eventKey="contact">Add Contact</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="conatctsUpload">Upload Contacts</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="createbroadcast">Create Broadcast</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="contact">
              <ContactForm onClose={onClose} />
            </Tab.Pane>
            <Tab.Pane eventKey="conatctsUpload">
              {/* conatctsUpload*/}
              <ExcelUploadPopup />
            </Tab.Pane>
            <Tab.Pane eventKey="createbroadcast">
              {/* createbroadcast */}
              <ExcelUploadPopup2 />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default ContactFormModal;

export { ContactForm };
