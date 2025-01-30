import {
  faAddressCard,
  faCalendar,
  faCheck,
  faDownload,
  faFile,
  faFileAlt,
  faHome,
  faImage,
  faMailBulk,
  faMailReply,
  faMessage,
  faMusic,
  faPhone,
  faTrash,
  faUserCircle,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Card, Col, Row, Tab, Tabs } from "react-bootstrap";
import "../../style/userProfile.css";
import { ApiEndPoint } from "./Component/utils/utlis";
import axios from "axios";

const UserProfile = (props) => {
  const [email, setEmail] = useState("raheemakbar999@gmail.com");
  const [subject, setSubject] = useState("Meeting Confirmation");
  const [clientDetails, setClientDetails] = useState({});
  const [usersDetails, setUsersDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const files = [
    {
      name: "Contract_Agreement.pdf",
      type: "pdf",
      url: "/files/Contract_Agreement.pdf",
    },
    {
      name: "Profile_Picture.jpg",
      type: "image",
      url: "/files/Profile_Picture.jpg",
    },
    { name: "Case_Notes.docx", type: "doc", url: "/files/Case_Notes.docx" },
    { name: "Evidence_1.png", type: "image", url: "/files/Evidence_1.png" },
    {
      name: "Legal_Document_2024.xlsx",
      type: "excel",
      url: "/files/Legal_Document_2024.xlsx",
    },
    {
      name: "Audio_Recording.mp3",
      type: "audio",
      url: "/files/Audio_Recording.mp3",
    },
    {
      name: "Court_Transcript.txt",
      type: "text",
      url: "/files/Court_Transcript.txt",
    },
    { name: "Case_Video.mp4", type: "video", url: "/files/Case_Video.mp4" },
  ];
  const fileIcons = {
    pdf: faFile,
    doc: faFile,
    excel: faFile,
    text: faFile,
    image: faImage,
    audio: faMusic,
    video: faVideo,
  };
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent("")}`;
  const [activeTab, setActiveTab] = useState("documents");

  const getFilesByCategory = (category) => {
    return files.filter((file) =>
      category === "documents"
        ? ["pdf", "doc", "text", "excel"].includes(file.type)
        : ["image", "video", "audio"].includes(file.type)
    );
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
                <p>{usersDetails.Bio}</p>
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
            background: "#001f3f", // Semi-transparent dark blue
            width: "45%",
            backdropFilter: "blur(10px)", // Glass effect
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)", // Softer shadow
            border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border
            transition: "transform 0.2s, box-shadow 0.2s", // Smooth hover effect
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
              <Row className="g-3">
                {getFilesByCategory("documents").map((file, index) => (
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
                        icon={fileIcons[file.type] || faFileAlt}
                        size="2x"
                        className="mb-2"
                        style={{ color: "#d3b386" }} // Gold color for icons
                      />
                      <Card.Body className="p-1">
                        <Card.Text
                          className="text-truncate"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {file.name}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="success"
                            size="sm"
                            href={file.url}
                            download
                            style={{ background: "#28a745", border: "none" }}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
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
                {getFilesByCategory("media").map((file, index) => (
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
                        icon={fileIcons[file.type] || faFileAlt}
                        size="2x"
                        className="mb-2"
                        style={{ color: "#d3b386" }} // Gold color for icons
                      />
                      <Card.Body className="p-1">
                        <Card.Text
                          className="text-truncate"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {file.name}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="success"
                            size="sm"
                            href={file.url}
                            download
                            style={{ background: "#28a745", border: "none" }}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
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
        </Col>
      </Row>
    </div>
  );
};
export default UserProfile;
