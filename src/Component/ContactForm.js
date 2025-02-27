import React, { useEffect, useRef, useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import { BsPerson, BsPostage, BsStackOverflow } from "react-icons/bs";
import Contactprofile from "../Main/Pages/Component/images/dialer.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import phone input styles
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../Auth/AuthContext"; // Import your authentication context
// import Warning, { ApiEndPoint } from "../components/utils/utlis";
import loginStyle from "./contact.module.css";
//  import defaultProfilePic from "";
import defaultProfilePic from "../Main/Pages/Component/assets/icons/person.png";

import { MdOutlineAttachEmail } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
// import ExcelUploadPopup from "./dropzonComponent";
// import ExcelUploadPopup2 from "./dropzonComponent2";
import { FaAddressCard, FaBusinessTime, FaCamera, FaEdit, FaInfoCircle, FaLock } from "react-icons/fa";
import { ApiEndPoint } from "../Main/Pages/Component/utils/utlis";

const ContactForm = ({ updateData }) => {
  // const { login } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUserName] = useState(updateData?.user.UserName);
  const [Bio, setBio] = useState(updateData?.lawyerDetails.Bio);
  const [Position, setPosition] = useState(updateData?.lawyerDetails.Position);
  const [Address, setAddress] = useState(updateData?.lawyerDetails.Address);
  const [phoneNumber, setPhoneNumber] = useState(updateData?.lawyerDetails.Contact);
  const [email, setEmail] = useState(updateData?.user.Email);

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


  const hanldeEdit = async (e) => {
    e.preventDefault(); // Prevent form submission default behavior

    const updatedData = {
      UserName: username, // Ensure `username` exists in your state
      Contact: phoneNumber, // Ensure `phoneNumber` exists in your state
      Position: Position, // Ensure `Position` exists in your state
      Bio: Bio, // Ensure `Bio` exists in your state
      Address: Address, // Ensure `Address` exists in your state
    };

    try {
      const response = await axios.put(
        `${ApiEndPoint}users/updateLawyerDetails/${email}`, // Ensure `email` exists
        updatedData, // Correct variable name
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Lawyer details updated successfully!");
      console.log("Updated Data:", response.data);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error);
      alert("Failed to update lawyer details.");
    }
  }

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
              onClick={() => document.getElementById("profilePicUpdate").click()}
            />
          </label>
          <input
            type="file"
            accept="image/*"
            id="profilePicUpdate"
            onChange={handleFileInputChange}
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
                  style={{ marginLeft: "3px", fontSize: "1.05rem" }}
                >
                  Position
                </p>
              </label>
              <div
                className="input-group bg-soft-light rounded-2"
                style={{ marginTop: -8 }}
              >
                <span className="input-group-text">
                  <FaBusinessTime />
                </span>
                <input
                  className={
                    loginStyle["form-control-1"] + " form-control-md form-control"
                  }
                  value={Position}
                  onChange={(e) => setPosition(e.target.value)}
                  id="Position"
                  name="Position"
                  placeholder="Enter Position"
                  type="text"
                  title="Enter a valid Position "
                  onFocus={(e) => (e.target.style.borderColor = "#18273e")}
                  onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                  required
                />
              </div>
            </div>
            <div className="text-start">

              <label className="form-label" style={{ marginBottom: "-0.4rem" }}>
                <p
                  className="fw-bold"
                  style={{ marginLeft: "3px", fontSize: "1.05rem" }}
                >
                  Contact Number
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
                    width: "97%",
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
          </div>
          <div className="text-start">
            <label className="form-label font-weight-bold">
              <p
                className="fw-bold"
                style={{ marginLeft: "3px", fontSize: "1.05rem" }}
              >
                Bio
              </p>
            </label>
            <div
              className="input-group bg-soft-light rounded-2"
              style={{ marginTop: -8 }}
            >
              <span className="input-group-text">
                <FaInfoCircle />
              </span>
              <textarea
                className={
                  loginStyle["form-control-1"] + " form-control-md form-control"
                }
                value={Bio}
                onChange={(e) => setBio(e.target.value)}
                id="Bio"
                name="Bio"
                placeholder="Enter Bio"
                type="text"
                title="Enter a Bio "
                onFocus={(e) => (e.target.style.borderColor = "#18273e")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                required
              />
            </div>
          </div>
          <div className="text-start">
            <label className="form-label font-weight-bold">
              <p
                className="fw-bold"
                style={{ marginLeft: "3px", fontSize: "1.05rem" }}
              >
                Address
              </p>
            </label>
            <div
              className="input-group bg-soft-light rounded-2"
              style={{ marginTop: -8 }}
            >
              <span className="input-group-text">
                <FaAddressCard />
              </span>
              <textarea
                className={
                  loginStyle["form-control-1"] + " form-control-md form-control"
                }
                value={Address}
                onChange={(e) => setAddress(e.target.value)}
                id="Address"
                name="Address"
                placeholder="Enter Address"
                type="text"
                title="Enter a Address "
                onFocus={(e) => (e.target.style.borderColor = "#18273e")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                required
              />
            </div>
          </div>

          {/* Phone Number Field */}


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
              onClick={hanldeEdit}
            >
              Update
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
  };
  const handleDelete = async () => {
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
      document.getElementById("profilePicUpdate").click();
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
              id="profilePicUpdate"
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

// const ContactFormModal = ({ isOpen, onClose }) => {
//   const [activeTab, setActiveTab] = useState("contact");
//   const [showContactModal, setshowContactModal] = useState(false);
//   const [group, setGroup] = useState(false);
//   const closeContactModal = () => {
//     setshowContactModal(false);
//   };
//   const closeContactModal5 = () => {
//     setGroup(false);
//   };
//   return (
//     <Modal show={isOpen} onHide={onClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {activeTab === "contact" && "Add Contact"}
//           {activeTab === "conatctsUpload" && "Upload Contacts"}
//           {activeTab === "createbroadcast" && "Create Broadcast"}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
//           <Nav variant="tabs" className="mb-2">
//             <Nav.Item>
//               <Nav.Link eventKey="contact">Add Contact</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="conatctsUpload">Upload Contacts</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="createbroadcast">Create Broadcast</Nav.Link>
//             </Nav.Item>
//           </Nav>


//         </Tab.Container>
//       </Modal.Body>
//     </Modal>
//   );
// };

const ContactFormModal = ({ isOpen, onClose, updateData }) => {


  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ContactForm updateData={updateData} />
      </Modal.Body>
    </Modal>
  );
};

export default ContactFormModal;

export { ContactForm };
