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
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
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
import "../../style/userProfile.css";
import { ApiEndPoint } from "./Component/utils/utlis";
import axios from "axios";
import DragAndDrop from "./Component/DragAndDrop";
import { FaCalendar } from "react-icons/fa";
import ViewBookLawyerSlot from "./Component/ViewBookSlot";
import SocketService from "../../SocketService";

const UserProfile = ({ token }) => {
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
  // Function to categorize files
  const [currentDate, setCurrentDate] = useState(new Date());
  const [DatabaseappointmentDetails, setDataAppointmentDetails] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [slotbookuserid, setslotbookuserid] = useState("");
  const [newStartTime, setNewStartTime] = useState(null);
  const [newEndTime, setNewEndTime] = useState(null);
  const [editingSlotIndex, setEditingSlotIndex] = useState(null);
  const [updatespecifcslot, setupdateslot] = useState();
  const [IsCalenderView, setCalenderView] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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

  const ExistSlotsMap =
    DatabaseappointmentDetails?.availableSlots?.reduce((acc, slot) => {
      const dateStr = new Date(slot.date).toDateString();
      acc[dateStr] = slot.slots;
      return acc;
    }, {}) || {};
  const calendarDates = generateCalendarDates();

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
    formData.append("Email", token.email);

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
        body: JSON.stringify({ Email: token.email }), // Sending email in request body
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

  const convertTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for AM times
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };
  const fetchClientDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${ApiEndPoint}getClientDetails/${token.email}`
      );
      setUsersDetails(response.data.user);
      setClientDetails(response.data.clientDetails); // Set the API response to state
      console.log("Files Data:", response.data.clientDetails.Files);
      setFiles(response.data.clientDetails.Files);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching client details:", err);
      setLoading(false);
    }

    try {
      console.log("token =", token._id);
      const response = await axios.get(
        `${ApiEndPoint}GetClientBookAppointments/${token._id}`
      );

      if (!response.data || response.data.length === 0) {
        throw new Error("No appointment data found");
      }

      console.log("Formatted Appointment Details");

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
                lawyerId: s.lawyerId,
                meetingLink: s.meetingLink,
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
      console.error("Error fetching client details:", err);
      setLoading(false);
    }
  };

  const handleBookTimeClick = (slot) => {
    setCalenderView(true);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };
  useEffect(() => {
    fetchClientDetails();
  }, []);

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
  return (
    <div
      className="card container-fluid justify-content-center mr-3 ml-3 p-0"
      style={{
        height: "86vh",
      }}
    >
      <Row className="d-flex justify-content-center m-3 p-0 gap-5">
        {" "}
        {/* Left Column: User Profile */}
        <Col
          sm={12}
          md={6}
          className="card border rounded d-flex flex-column mb-3"
          style={{
            background: "#001f3f",
            width: "45%",
            backdropFilter: "blur(10px)", // Glass effect
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)", // Dark shadow for depth
            border: "1px solid rgba(255, 255, 255, 0.1)", // Slight border for contrast
          }}
        >
          <div className="client-section p-3 text-white">
            {/* Client Picture */}
            <div
              className="d-flex align-items-center mb-3" // Flexbox for horizontal alignment
            >
              {/* Profile Icon */}
              <div
                className="client-picture"
                style={{
                  border: "2px solid #d4af37",
                  textAlign: "center",
                  padding: "10px",
                  borderRadius: "50%", // Circle shape
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="rounded-circle"
                  style={{ fontSize: "48px" }} // Icon size
                />
              </div>

              {/* Username */}
              <div className="ms-3">
                <h2>{usersDetails.UserName}</h2>
              </div>
            </div>
            {/* Client Details */}
            <div className="client-details">
              {/* Bio */}
              {/* <div
                className="d-flex"
                style={{ width: "auto", overflowY: "auto" }}
              >
                <p>{clientDetails.Bio}</p>
              </div> */}

              {/* Email */}
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faMailBulk}
                  size="1x"
                  color="white"
                  className="m-2"
                />
                <p className="ms-2 m-1">
                  <a
                    href={`mailto:${usersDetails.Email}`}
                    style={{ color: "white" }}
                  >
                    {usersDetails.Email}
                  </a>
                </p>
              </div>

              {/* Contact */}
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faPhone}
                  size="1x"
                  color="white"
                  className="m-2"
                />
                <p className="ms-2 m-1">{clientDetails.Contact}</p>
              </div>

              {/* Address */}
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faAddressCard}
                  size="1x"
                  color="white"
                  className="m-2"
                />
                <p style={{ fontSize: 12 }} className="ms-2 m-1">
                  {clientDetails.Address}
                </p>
              </div>
            </div>
          </div>
        </Col>
        {/* Right Column: Files and Docs */}
        <Col
          sm={12}
          md={6}
          className="card border rounded p-3 mb-3"
          style={{
            background: "#001f3f",
            width: "45%",
            backdropFilter: "blur(10px)",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          <h4 className="text-white mb-4" style={{ fontWeight: "600" }}>
            File and Docs
          </h4>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
            variant="primary"
            style={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              color: "white",
            }}
          >
            <Tab
              eventKey="documents"
              title={
                <span
                  style={{
                    background:
                      activeTab === "documents" ? "#d3b386" : "transparent",
                    padding: "8px 8px",
                    borderRadius: "5px",
                    color: "white",
                  }}
                >
                  Documents 📄
                </span>
              }
            >
              <Row
                className="g-3"
                style={{
                  height: "50vh",
                  overflow: "auto",
                }}
              >
                {getFilesByCategory("documents", files).map((file, index) => (
                  <Col key={index} sm={6} md={4} lg={3}>
                    <Card
                      className="text-white bg-dark p-2"
                      style={{
                        background: "white",
                        border: "1px solid white",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0px 4px 10px rgba(0, 0, 0, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <FontAwesomeIcon
                        icon={getFileTypeIcon(file.fileName)} // Default icon if not found
                        size="2x"
                        className="mb-2"
                        style={{ color: "#d3b386" }}
                      />
                      <Card.Body className="p-1">
                        <Card.Text
                          className="text-truncate"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {file.fileName}
                          {file._id}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleDownload(file._id, file.fileName)
                            }
                            style={{ background: "#28a745", border: "none" }}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleFileDelete(file._id)}
                            style={{ background: "#dc3545", border: "none" }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>

            <Tab
              eventKey="media"
              title={
                <span
                  style={{
                    background:
                      activeTab === "media" ? "#d3b386" : "transparent",
                    padding: "8px 8px",
                    borderRadius: "5px",
                    color: "white",
                  }}
                >
                  Media Files 🎬
                </span>
              }
            >
              <Row
                className="g-3"
                style={{
                  height: "50vh",
                  overflow: "auto",
                }}
              >
                {getFilesByCategory("media", files).map((file, index) => (
                  <Col key={index} sm={6} md={4} lg={3}>
                    <Card
                      className="text-white bg-dark p-2"
                      style={{
                        background: "white",
                        border: "1px solid white",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow =
                          "0px 4px 10px rgba(0, 0, 0, 0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* File Preview for Images */}
                      <FontAwesomeIcon
                        icon={getFileTypeIcon(file.fileName)} // Default icon if not found
                        size="2x"
                        className="mb-2"
                        style={{ color: "#d3b386" }}
                      />

                      <Card.Body className="p-1">
                        <Card.Text
                          className="text-truncate"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {file.fileName}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleDownload(file._id, file.fileName)
                            }
                            style={{ background: "#28a745", border: "none" }}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleFileDelete(file._id)}
                            style={{ background: "#dc3545", border: "none" }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>

            <Tab
              eventKey="meeting"
              title={
                <span
                  style={{
                    background:
                      activeTab === "meeting" ? "#d3b386" : "transparent",
                    padding: "8px 8px",
                    borderRadius: "5px",
                    color: "white",
                  }}
                >
                  Meeting Link <FaCalendar />
                </span>
              }
            >
              <Row
                className="g-3"
                style={{
                  height: "50vh",
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    boxShadow: "0px 0px 0px gray",
                    overflowY: "auto",
                    maxHeight: "400px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#d2a85a #16213e",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "white",
                    }}
                  >
                    <button
                      className="calender-button simple-text"
                      onClick={prevMonth}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} size="1x" />
                    </button>
                    <h3>
                      {currentDate.toLocaleString("default", { month: "long" })}{" "}
                      {currentDate.getFullYear()}
                    </h3>
                    <button
                      onClick={nextMonth}
                      className="simple-text calender-button"
                    >
                      <FontAwesomeIcon icon={faArrowRight} size="1x" />
                    </button>
                  </div>
                  {/* List View */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {calendarDates
                      .map((d) => (d instanceof Date ? d : new Date(d))) // Ensure valid Date objects
                      .filter((date) => {
                        const slots = ExistSlotsMap[date.toDateString()] || [];
                        return slots.some((slot) => slot.isBooked); // Only include dates with booked slots
                      })
                      .map((date, index) => {
                        const slots = ExistSlotsMap[date.toDateString()] || [];

                        return (
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "5px",
                              background:
                                selectedDate?.toDateString() ===
                                date.toDateString()
                                  ? "#d2a85a"
                                  : "#16213e",
                              borderRadius: "5px",
                              color: "white",
                              gap: "10px", // Add gap between date and slots
                            }}
                          >
                            {/* Date Column with fixed width and right margin for spacing */}
                            <div
                              style={{
                                fontWeight: "bold",
                                maxWidth: "100px",
                                flexShrink: 0,
                                marginRight: "20px",
                              }}
                            >
                              {date.toDateString()}
                            </div>

                            {/* Slots Column */}
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                                flexGrow: 1,
                              }}
                            >
                              {slots.map((slot) =>
                                slot.isBooked ? (
                                  <button
                                    key={slot._id}
                                    onClick={() => {
                                      setslotbookuserid(slot);
                                      setNewStartTime(
                                        new Date(
                                          `${date.toDateString()} ${
                                            slot.startTime
                                          }`
                                        )
                                      );
                                      setNewEndTime(
                                        new Date(
                                          `${date.toDateString()} ${
                                            slot.endTime
                                          }`
                                        )
                                      );
                                      setEditingSlotIndex(index);
                                      handleBookTimeClick(slot);
                                      handleTimeClick(slot.startTime);
                                      setupdateslot(slot);
                                      setSelectedSlot({
                                        date: date.toDateString(),
                                        time: slot.startTime,
                                      });
                                    }}
                                    className="time-button"
                                    style={{
                                      padding: "5px 10px",
                                      borderRadius: "5px",
                                      border: "1px solid #d4af37",
                                      background:
                                        selectedSlot?.date ===
                                          date.toDateString() &&
                                        selectedSlot?.time === slot.startTime
                                          ? "#d2a85a"
                                          : "green",
                                      color: "white",
                                      cursor: "pointer",
                                      width: 130,
                                      fontSize: "11px",
                                    }}
                                  >
                                    {slot.startTime} - {slot.endTime}
                                  </button>
                                ) : null
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </Row>
            </Tab>
          </Tabs>
          {/* Floating Upload Icon */}
          <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "30px",
              zIndex: 1000,
            }}
          >
            <Button
              variant="primary"
              className="border border-rounded"
              onClick={() => setShowUploadModal(true)}
              style={{
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#d3b386",
                color: "white",
              }}
            >
              <FontAwesomeIcon icon={faUpload} size="lg" />
            </Button>
          </div>
        </Col>
        <DragAndDrop
          showModal={showUploadModal}
          onHide={onHide}
          handleFileChange={handleFileChange}
          uploading={uploading}
          uploadSuccess={uploadSuccess}
          selectedFiles={selectedFiles}
          handleFileUpload={handleFileUpload}
          errorMessage={errorMessage}
        />
      </Row>

      <ViewBookLawyerSlot
        isOpen={IsCalenderView}
        onClose={(value) => setCalenderView(value)}
        slotbookuserid={slotbookuserid}
      />
    </div>
  );
};
export default UserProfile;
