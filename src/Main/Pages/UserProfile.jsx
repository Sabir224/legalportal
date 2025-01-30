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
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Card, Col, Row, Tab, Tabs } from "react-bootstrap";

const UserProfile = (props) => {
  const [email, setEmail] = useState("raheemakbar999@gmail.com");
  const [subject, setSubject] = useState("Meeting Confirmation");
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
            <div
              className="client-picture mb-3"
              style={{
                border: "2px solid #d4af37",
                textAlign: "center",
                padding: "10px",
                borderRadius: "100%",
                width: "100px",
                height: "100px",
              }}
            >
              <img
                src="https://via.placeholder.com/150"
                alt="Client"
                className="rounded-circle"
              />
            </div>
            <div className="client-details">
              <h2>Sabir Khan</h2>
              <p>Business Owner</p>
              <div
                className="d-flex"
                style={{ width: "auto", overflowY: "auto" }}
              >
                <p>
                  Sabir Khan is a successful entrepreneur with a growing
                  business in the finance sector. She is looking for legal
                  guidance on contracts, corporate structuring, and compliance.
                </p>
              </div>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faMailBulk}
                  size="1x"
                  color="white"
                  className="m-2"
                />
                <p className="ms-2 m-1">
                  <a
                    href="mailto:janesmith@example.com"
                    style={{ color: "white" }}
                  >
                    janesmith@example.com
                  </a>
                </p>
              </div>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faPhone}
                  size="1x"
                  color="white"
                  className="m-2"
                />
                <p className="ms-2 m-1">+1 987 654 3210</p>
              </div>
              <div className="d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faAddressCard}
                  size="1x"
                  color="white"
                  className="m-2"
                />
                <p style={{ fontSize: 12 }} className="ms-2 m-1">
                  456 Elm Street, Los Angeles, CA 90001
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
            backdropFilter: "blur(10px)", // Glass effect
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.6)", // Dark shadow for depth
            border: "1px solid rgba(255, 255, 255, 0.1)", // Slight border for contrast
          }}
        >
          <h4 className="text-white">File and Docs</h4>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="documents" title="Documents 📄">
              <Row className="g-3">
                {getFilesByCategory("documents").map((file, index) => (
                  <Col key={index} sm={6} md={4} lg={3}>
                    <Card className="text-white bg-dark p-2">
                      <FontAwesomeIcon
                        icon={fileIcons[file.type] || faFileAlt}
                        size="2x"
                        className="mb-2"
                      />
                      <Card.Body className="p-1">
                        <Card.Text className="text-truncate">
                          {file.name}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="success"
                            size="sm"
                            href={file.url}
                            download
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button variant="danger" size="sm">
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>

            <Tab eventKey="media" title="Media Files 🎬">
              <Row className="g-3">
                {getFilesByCategory("media").map((file, index) => (
                  <Col key={index} sm={6} md={4} lg={3}>
                    <Card className="text-white bg-dark p-2">
                      <FontAwesomeIcon
                        icon={fileIcons[file.type] || faFileAlt}
                        size="2x"
                        className="mb-2"
                      />
                      <Card.Body className="p-1">
                        <Card.Text className="text-truncate">
                          {file.name}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="success"
                            size="sm"
                            href={file.url}
                            download
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </Button>
                          <Button variant="danger" size="sm">
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
