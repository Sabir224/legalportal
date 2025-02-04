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

const UserProfile = (props) => {
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
  // Function to categorize files
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

    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "svg",
      "webp",
      "tiff",
    ];
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"];
    const audioExtensions = ["mp3", "wav", "aac", "ogg", "flac", "m4a"];
    const documentExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "csv",
      "ods",
      "ppt",
      "pptx",
      "txt",
      "rtf",
      "odt",
      "odp",
      "odg",
      "epub",
    ];
    const archiveExtensions = ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"];
    const codeExtensions = [
      "js",
      "jsx",
      "ts",
      "tsx",
      "html",
      "css",
      "json",
      "xml",
      "sql",
      "py",
      "java",
      "c",
      "cpp",
      "sh",
    ];

    if (imageExtensions.includes(extension)) return "image";
    if (videoExtensions.includes(extension)) return "video";
    if (audioExtensions.includes(extension)) return "audio";
    if (documentExtensions.includes(extension)) return "document";
    if (archiveExtensions.includes(extension)) return "archive";
    if (codeExtensions.includes(extension)) return "code";

    return "other"; // For unsupported file types
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) => {
      const fileType = getFileType(file.name); // Get file type based on extension
      return ["image", "video", "audio", "document", "archive"].includes(
        fileType
      );
    });
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("Email", usersDetails.Email);

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(`${ApiEndPoint}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Files response:", response.data);

      if (response.status === 200) {
        setFiles((prevFiles) => [...prevFiles, ...response.data.files]); // Safe state update
        setSelectedFiles([]);
        setUploadSuccess(true);
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
        }, 2000); // Hide modal after 2 seconds
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

  // Function to handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files).filter((file) => {
      const fileType = getFileType(file.name); // Use getFileType to determine type
      return ["image", "video", "audio", "document", "archive"].includes(
        fileType
      );
    });

    setSelectedFiles((prevFiles) => [...prevFiles, ...files]); // Append to existing files
  };

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent("")}`;
  const [activeTab, setActiveTab] = useState("documents");
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await fetch(`${ApiEndPoint}/download/${fileId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  useEffect(() => {
    const fetchClientDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${ApiEndPoint}users/getClientDetails?Email=taha@gmai.com`
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
    };
    fetchClientDetails();
  }, []);
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
            </div>

            {/* Client Details */}
            <div className="client-details">
              <h2>{usersDetails.UserName}</h2>

              {/* Bio */}
              <div
                className="d-flex"
                style={{ width: "auto", overflowY: "auto" }}
              >
                <p>{clientDetails.Bio}</p>
              </div>

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
            className="mb-3 custom-tabs"
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
                    padding: "8px 12px",
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
                    padding: "8px 12px",
                    borderRadius: "5px",
                    color: "white",
                  }}
                >
                  Media Files 🎬
                </span>
              }
            >
              <Row className="g-3">
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
        <Modal
          show={showUploadModal}
          onHide={() => {
            setShowUploadModal(false);
            setSelectedFiles([]);
            setUploading(false);
            setUploadSuccess(false);
          }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Upload Files</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("file-upload").click()} // Trigger file input on click
              style={{
                border: "2px dashed #18273e",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* Hidden file input */}
              <input
                type="file"
                id="file-upload"
                multiple
                style={{ display: "none" }}
                onChange={(e) =>
                  setSelectedFiles([...selectedFiles, ...e.target.files])
                }
              />

              {uploading ? (
                <div>
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin // Makes the spinner rotate
                    style={{
                      color: "#18273e",
                      fontSize: "60px", // Increased size
                    }}
                  />
                  <p>Uploading...</p>
                </div>
              ) : uploadSuccess ? (
                <div>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{
                      fontSize: "60px", // Bigger icon
                      color: "green",
                    }}
                  />
                  <p>Upload Successful!</p>
                </div>
              ) : (
                <>
                  <p>Drag and drop files here</p>
                  <p>or Click to choose file</p>
                </>
              )}
            </div>

            {selectedFiles.length > 0 && !uploadSuccess && (
              <div className="mt-3">
                <h6>Selected Files:</h6>
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <Button
              variant="secondary"
              className="border border-rounded"
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFiles([]);
                setUploading(false);
                setUploadSuccess(false);
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              style={{ backgroundColor: "green", color: "white" }}
              className="border border-rounded"
              onClick={handleFileUpload}
              disabled={uploading || uploadSuccess}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    </div>
  );
};
export default UserProfile;
