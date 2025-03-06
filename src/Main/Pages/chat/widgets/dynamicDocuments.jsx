import { useState } from "react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
  FaDownload,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import rightChatstyle from "../Chat.module.css";
import RenderStatusIcon from "./renderMessageStatus";
import { formatTimestamp } from "../../Component/utils/utlis";

const DynamicDocument = ({ message, user }) => {
  const { file, messageType, timestamp, sender } = message;
  const [hovered, setHovered] = useState(false);

  if (messageType !== "file" || !file || !file.url) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isImage = file.type.startsWith("image/");

  const senderRole =
    typeof message.sender === "object" && message.sender.Role
      ? message.sender.Role
      : String(message.sender);
  const userId = String(user._id);
  const isClient = user.Role === "client";
  const isSenderClient = senderRole === "client";
  const isOwnMessage = String(message.sender._id) === userId;
  const isMessageOnLeft = isClient || isSenderClient;
  const getFileIcon = (fileType) => {
    if (!fileType) return <FaFileAlt className="file-icon text-secondary" />;
    if (fileType.includes("pdf"))
      return <FaFilePdf className="file-icon text-danger" />;
    if (fileType.includes("word") || fileType.includes("msword"))
      return <FaFileWord className="file-icon text-primary" />;
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return <FaFileExcel className="file-icon text-success" />;
    return <FaFileAlt className="file-icon text-secondary" />;
  };

  return (
    <div
      className={`${
        isOwnMessage || !isMessageOnLeft
          ? rightChatstyle["chat-message-right"]
          : rightChatstyle["chat-message-left"]
      } p-1 d-flex`}
      style={{
        maxWidth: "100%", // Ensures it never overflows
        overflowX: "hidden", // Prevents unwanted scroll
      }}
    >
      <div
        className={`flex-shrink-1 rounded position-relative ${
          isOwnMessage ? "main-bgcolor simple-text" : "bg-light"
        }`}
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          whiteSpace: "pre-wrap",
          maxWidth: "70%",
          minWidth: "100px",
          textAlign: isOwnMessage || !isMessageOnLeft ? "right" : "left",
        }}
      >
        <div
          className={`d-flex align-items-center p-1 ${
            isOwnMessage ? "justify-content-end" : ""
          }`}
        >
          {!isOwnMessage && (
            <img
              alt="User"
              src={
                sender.ProfilePicture ||
                "https://bootdey.com/img/Content/avatar/avatar1.png"
              }
              className="rounded-circle"
              width={20}
              height={20}
            />
          )}
          <div
            className="text-secondary fw-normal d-sm-block d-none d-md-inline me-2"
            style={{ fontSize: "12px" }}
          >
            {isOwnMessage ? "You" : sender.UserName.split(" ")[0]}
          </div>
          {isOwnMessage && (
            <img
              alt="User"
              src={
                sender.ProfilePicture ||
                "https://bootdey.com/img/Content/avatar/avatar1.png"
              }
              className="rounded-circle"
              width={20}
              height={20}
            />
          )}
        </div>

        <div
          className="position-relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {isImage ? (
            <div className="position-relative text-center">
              <img
                src={file.url}
                alt={file.name}
                className="img-fluid rounded"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "contain", // Ensures full image is visible without cropping
                }}
              />
              <div className="w-100 d-flex p-0 m-0 justify-content-end mb-1">
                <FaDownload
                  color={isOwnMessage ? "white" : "black"}
                  onClick={handleDownload}
                  style={{
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = isOwnMessage ? "#ddd" : "#555")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.color = isOwnMessage ? "white" : "black")
                  }
                />
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center position-relative p-0 m-0 border rounded">
              <div className="d-flex align-items-center w-100">
                <div className="me-2">{getFileIcon(file.type)}</div>
                <div className="flex-grow-1">
                  <span
                    className="fw-bold d-inline-block"
                    style={{
                      fontSize: "12px",
                      maxWidth: "120px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </span>
                </div>
              </div>
              <div className="w-100 d-flex justify-content-end mt-1">
                <FaDownload
                  color={`${isOwnMessage ? "white" : "black"}`}
                  onClick={handleDownload}
                />
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div
          className="d-flex p-0 m-0 gap-1 justify-content-end text-secondary"
          style={{
            fontSize: "10px",
            whiteSpace: "nowrap",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p className="p-0 m-0">{formatTimestamp(message.createdAt)}</p>
          <RenderStatusIcon status={message.status} message={message} />
        </div>
      </div>
    </div>
  );
};

export default DynamicDocument;
