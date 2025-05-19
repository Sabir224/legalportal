import React, { useEffect, useRef, useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import { BsPerson, BsPostage, BsStackOverflow } from "react-icons/bs";
import Contactprofile from "./images/dialer.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import phone input styles
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../Auth/AuthContext"; // Import your authentication context
// import Warning, { ApiEndPoint } from "../components/utils/utlis";
import loginStyle from "../../../../src/Component/contact.module.css";
//  import defaultProfilePic from "";
import defaultProfilePic from "./assets/icons/person.png";

import { MdOutlineAttachEmail } from "react-icons/md";
import { GrContactInfo } from "react-icons/gr";
// import ExcelUploadPopup from "./dropzonComponent";
// import ExcelUploadPopup2 from "./dropzonComponent2";
import {
  FaAddressCard,
  FaBusinessTime,
  FaCamera,
  FaEdit,
  FaInfoCircle,
  FaLock,
} from "react-icons/fa";
import { ApiEndPoint, formatPhoneNumber } from "./utils/utlis";

import {
  faFileAlt,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileText,
  faImage,
  faMusic,
  faVideo,
  faFileArchive,
  faFileCode,
  faFileCsv,
  faFile,
  faDownload,
  faTrash,
  faUpload,
  faUserCircle,
  faMailBulk,
  faPhone,
  faAddressCard,
  faCheckCircle,
  faSpinner,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Row, Spinner, Tabs } from "react-bootstrap";
import DragAndDrop from "./DragAndDrop";

const ContactForm = ({ slotbookuserid }) => {
  const [email, setEmail] = useState("raheemakbar999@gmail.com");
  const [subject, setSubject] = useState("Meeting Confirmation");
  const [clientDetails, setClientDetails] = useState({});
  const [usersDetails, setUsersDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]); // Uploaded files state
  const [selectedFiles, setSelectedFiles] = useState([]); // Selected files before upload
  const [showUploadModal, setShowUploadModal] = useState(false); // State to control upload moda
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const storedEmail = sessionStorage.getItem("Email");
  const [lawyerDetails, setLawyersDetails] = useState(null);

  // Function to categorize files

  const onHide = () => {
    setShowUploadModal(false);
    setSelectedFiles([]);
    setUploading(false);
    setUploadSuccess(false);
    setErrorMessage([]);
  };
  const getFilesByCategory = (category, files) => {
    return files.filter((file) => {
      const fileType = getFileType(file.fileName);
      if (category === "media") {
        return (
          fileType === "image" || fileType === "video" || fileType === "audio"
        );
      }
      if (category === "documents") {
        return (
          fileType !== "image" && fileType !== "video" && fileType !== "audio"
        );
      }
      return false;
    });
  };

  const fileIcons = {
    pdf: faFilePdf, // PDF Files
    doc: faFileWord, // Word Document
    docx: faFileWord, // Word Document
    txt: faFileText, // Plain Text File
    csv: faFileCsv, // CSV File
    xls: faFileExcel, // Excel File
    xlsx: faFileExcel, // Excel File
    ppt: faFilePowerpoint, // PowerPoint File
    pptx: faFilePowerpoint, // PowerPoint File
    odt: faFileAlt, // OpenDocument Text
    ods: faFileExcel, // OpenDocument Spreadsheet
    odp: faFilePowerpoint, // OpenDocument Presentation
    image: faImage, // Images (jpg, png, svg, etc.)
    audio: faMusic, // Audio Files (mp3, wav, etc.)
    video: faVideo, // Video Files (mp4, mkv, avi, etc.)
    zip: faFileArchive, // Zip Files
    rar: faFileArchive, // RAR Files
    tar: faFileArchive, // Tar Files
    gz: faFileArchive, // GZipped Files
    "7z": faFileArchive, // 7z Files
    js: faFileCode, // JavaScript Files
    jsx: faFileCode, // JavaScript Files
    ts: faFileCode, // TypeScript Files
    tsx: faFileCode, // TypeScript Files
    html: faFileCode, // HTML Files
    css: faFileCode, // CSS Files
    json: faFileCode, // JSON Files
    xml: faFileCode, // XML Files
    sql: faFileCode, // SQL Files
    py: faFileCode, // Python Files
    java: faFileCode, // Java Files
    c: faFileCode, // C Language Files
    cpp: faFileCode, // C++ Language Files
    sh: faFileCode, // Shell Script
    other: faFile, // Default File Icon for unknown formats
  };
  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase(); // Extract extension
    return fileIcons[extension] || fileIcons["other"]; // Use mapped icon or default
  };
  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const allowedExtensions = {
      image: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff"],
      video: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"],
      audio: ["mp3", "wav", "aac", "ogg", "flac", "m4a"],
      document: [
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
        "csv",
        "ppt",
        "pptx",
        "txt",
      ],
      archive: ["zip", "rar", "7z"],
    };

    for (let [type, extensions] of Object.entries(allowedExtensions)) {
      if (extensions.includes(extension)) return type;
    }

    return "other";
  };

  const sizeLimits = {
    image: 20 * 1024 * 1024, // 5MB
    document: 20 * 1024 * 1024, // 16MB
    video: 20 * 1024 * 1024, // 50MB
    audio: 20 * 1024 * 1024, // 10MB
    archive: 20 * 1024 * 1024, // 50MB
  };

  const validateFileSize = (file) => {
    const fileType = getFileType(file.name);
    return (
      fileType !== "other" &&
      file.size <= (sizeLimits[fileType] || 2 * 1024 * 1024)
    );
  };

  const handleFileChange = (input) => {
    setErrorMessage([]);
    let files = Array.isArray(input) ? input : Array.from(input.target.files);

    let validFiles = [];
    let totalFiles = selectedFiles.length; // Track total files

    let invalidSizeFiles = [];
    let invalidTypeFiles = [];
    let invalidLengthFiles = [];

    for (let file of files) {
      if (totalFiles > 10) break; // Stop if we reach the limit

      if (file.name.length > 40) {
        // Truncate file name for display
        let truncatedName =
          file.name.substring(0, 20) + "..." + file.name.slice(-10);
        invalidLengthFiles.push(truncatedName); // Store truncated name
        continue; // Skip this file
      }

      const fileType = getFileType(file.name);
      if (fileType === "other") {
        invalidTypeFiles.push(file.name); // Store file name if type is not allowed
      } else if (!validateFileSize(file)) {
        invalidSizeFiles.push(
          `${file.name} (Max ${(
            (sizeLimits[fileType] || 2 * 1024 * 1024) /
            (1024 * 1024)
          ).toFixed(1)}MB)` // Show max limit
        );
      } else {
        validFiles.push(file);
        totalFiles++; // Increment total count
      }
    }

    let fileLimitExceeded = totalFiles > 10;
    if (fileLimitExceeded) {
      setErrorMessage((prevErrors) => [
        ...prevErrors,
        `Maximum 10 files can be uploaded at any time and allow first 5 for upload`,
      ]);
      validFiles = validFiles.slice(0, 10 - selectedFiles.length);
    }

    if (invalidSizeFiles.length > 0) {
      setErrorMessage((prevErrors) => [
        ...prevErrors,
        `The following files exceed the size limit: ${invalidSizeFiles.join(
          ", "
        )}`,
      ]);
    }

    if (invalidTypeFiles.length > 0) {
      setErrorMessage((prevErrors) => [
        ...prevErrors,
        `The following file extensions are not allowed: ${invalidTypeFiles.join(
          ", "
        )}`,
      ]);
    }

    if (invalidLengthFiles.length > 0) {
      setErrorMessage((prevErrors) => [
        ...prevErrors,
        `The following files have names longer than 40 characters: ${invalidLengthFiles.join(
          ", "
        )}`,
      ]);
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles].slice(0, 5));

    if (!Array.isArray(input)) input.target.value = "";
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("Email", storedEmail);

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`${ApiEndPoint}upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Files response:", response.data);

      if (response.status === 200) {
        setSelectedFiles([]);
        setUploadSuccess(true);
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
        }, 1000); // Hide modal after 2 seconds
        fetchClientDetails();
        setErrorMessage([]);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };
  const handleFileDelete = async (fileId) => {
    try {
      const response = await axios.delete(`${ApiEndPoint}/files/${fileId}`);

      if (response.status === 200) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file._id !== fileId)
        );
        console.log("File deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent("")}`;
  const [activeTab, setActiveTab] = useState("documents");
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(`${ApiEndPoint}download/${fileId}`, {
        method: "POST", // Changed to POST to send body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: storedEmail }), // Sending email in request body
      });

      // Log the raw response before processing
      console.log("Raw Response:", response);

      if (!response.ok) {
        const errorText = await response.text(); // Get the error response if available
        throw new Error(`Failed to fetch the file: ${errorText}`);
      }

      // Log the JSON response before downloading (if applicable)
      const jsonResponse = await response.json();
      console.log("Download Response JSON:", jsonResponse);

      // Check if the response contains a signed URL instead of a file blob
      if (jsonResponse.downloadUrl) {
        console.log("Signed URL received:", jsonResponse.downloadUrl);
        window.open(jsonResponse.downloadUrl, "_blank");
        return;
      }

      // Validate content type
      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type:", contentType);
      if (
        !contentType ||
        (!contentType.startsWith("application/") &&
          contentType !== "application/octet-stream")
      ) {
        throw new Error("Invalid content type: " + contentType);
      }

      // Process the file blob
      const blob = await response.blob();
      console.log("Blob Data:", blob);

      // Create a URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "downloaded_file"; // Default filename if none is provided
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const fetchClientDetails = async () => {
    setLoading(true);
    let mail = null;
    console.log(" enter api calling ", slotbookuserid);
    let id = slotbookuserid?.lawyerId
      ? slotbookuserid?.lawyerId
      : slotbookuserid?.byBook;
    let fetchdata = slotbookuserid?.lawyerId
      ? "lawyerDetails"
      : "clientDetails";
    console.log("id", id);
    let apifuncation = slotbookuserid?.lawyerId
      ? "geLawyerDetails"
      : "getClientDetails";

    try {
      const response = await axios.get(`${ApiEndPoint}getUserById/${id}`);
      await setUsersDetails(response.data);
      await setClientDetails(response.data); // Set the API response to state
      console.log("User  Data:", response.data);
      mail = response.data?.Email;
      setFiles(response.data?.clientDetails?.Files);
      console.log("email", mail);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching client details:", err);
      setLoading(false);
    }

    try {
      const response = await axios.get(
        `${ApiEndPoint}getUserById/${slotbookuserid?.FklawyerId}`
      );
      await setLawyersDetails(response.data);
      console.log("lawyers  Data:", response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching client details:", err);
      setLoading(false);
    }

    try {
      const response = await axios.get(`${ApiEndPoint}${apifuncation}/${mail}`);
      // API endpoint
      // API endpoint

      console.log("client data! ", response.data);
      setClientDetails(response.data[`${fetchdata}`]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClientDetails();
  }, []);
  return (
    <div className="card border-0 shadow">
      <div
        className="card-body p-3 p-md-4"
        style={{ backgroundColor: "#16213e", color: "white" }}
      >
        {/* Header Section */}
        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <h5 className="mb-1 fs-6 fs-md-5">
              {slotbookuserid?.lawyerId ? "Lawyer Name:" : "Client Name:"}
            </h5>
            <h5 className="mb-0 fs-6 fs-md-5">
              {usersDetails?.UserName &&
                usersDetails.UserName.charAt(0).toUpperCase() +
                  usersDetails.UserName.slice(1)}
            </h5>
          </div>

          {lawyerDetails && (
            <div className="col-12 col-md-6">
              <h6 className="mb-1 fs-6">Lawyer Name:</h6>
              <h6 className="mb-0 fs-6">
                {lawyerDetails?.UserName &&
                  lawyerDetails.UserName.charAt(0).toUpperCase() +
                    lawyerDetails.UserName.slice(1)}
              </h6>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="mb-4">
          <div className="d-flex align-items-center mb-2 flex-wrap">
            <FontAwesomeIcon icon={faMailBulk} className="me-2" />
            <a
              href={`mailto:${usersDetails?.Email}`}
              className="text-white text-break small"
            >
              {usersDetails?.Email}
            </a>
          </div>

          <div className="d-flex align-items-center mb-2 flex-wrap">
            <FontAwesomeIcon icon={faPhone} className="me-2" />
            <a
              href={`tel:${formatPhoneNumber(clientDetails?.Contact)}`}
              className="text-white small"
            >
              {formatPhoneNumber(clientDetails?.Contact)}
            </a>
          </div>

          <div className="d-flex align-items-start flex-wrap mb-3">
            <FontAwesomeIcon icon={faAddressCard} className="me-2 mt-1" />
            <a
              href={`http://maps.google.com/?q=${encodeURIComponent(
                clientDetails?.Address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-decoration-none small"
            >
              {clientDetails?.Address}
            </a>
          </div>
        </div>

        {/* Meeting Time */}
        <div className="d-flex align-items-center mb-4">
          <FontAwesomeIcon icon={faCalendar} className="me-2" />
          <span className="small">
            Meeting Time:{" "}
            <span className="text-white">
              {slotbookuserid.startTime} - {slotbookuserid.endTime}
            </span>
          </span>
        </div>

        {/* Join Button */}
        <div className="text-center">
          <a
            href={slotbookuserid?.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn d-inline-flex align-items-center py-1 px-3 fw-bold fs-6"
            style={{ color: "white", backgroundColor: "#d3b386" }}
          >
            <img
              src="https://cdn4.iconfinder.com/data/icons/logos-brands-in-colors/48/google-meet-512.png"
              alt="Google Meet"
              width="20"
              height="20"
              className="me-2"
            />
            Join Meeting
          </a>
        </div>
      </div>
    </div>
  );
};
const ViewBookLawyerSlot = ({ isOpen, onClose, slotbookuserid }) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="lg"
      className="modal-responsive"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="visually-hidden">
          Appointment Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 p-md-3">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <ContactForm slotbookuserid={slotbookuserid} />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
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
  const handleSave = async () => {};
  const handleDelete = async () => {};
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

export default ViewBookLawyerSlot;

export { ContactForm };
