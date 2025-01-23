import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaDownload } from "react-icons/fa";
import { ApiEndPoint, formatTimestamp, messageTime, splitSenderName } from "../../Component/utils/utlis";
import "./dynamicImage.css";
import styles from "./dynamicDocument.module.css";
import RenderStatusIcon from "../widgets/renderMessageStatus";
export default function DynamicImage({
  file_id,
  position,
  timestamp,
  fileName,
  senderName,
  avatar,
  color_code,
  status,
  type,
  blockScroll,
  unblockScroll,
}) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${ApiEndPoint}/downloadFile/${file_id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    };

    fetchImage();

    // Cleanup URL object when component unmounts
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [file_id, imageUrl]);

  const handleDownload = async () => {
    try {
      const response = await fetch(`${ApiEndPoint}/downloadFile/${file_id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || `image.${file_id.split(".").pop()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object after download
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className={`${styles["chat-message-" + position]} ${styles["chat-message"]}`}>
      {/* Avatar Section */}
      <div className={styles[`avatar-${position} pl-3`]}>

        <div
          className="rounded-circle d-flex justify-content-center align-items-center"
        >
          <img
            alt="User"
            src={avatar ? avatar : "https://bootdey.com/img/Content/avatar/avatar1.png"}
            className="rounded-circle"
            width={30}
            height={30}
            title={senderName}
          />
        </div>
        {/* Sender Name and Timestamp */}
        <div className="text-center text-wrap sender-name">
          {splitSenderName(senderName)}
          <br />
          {formatTimestamp(timestamp)}
        </div>
      </div>

      {/* Message and Image Section */}
      <div className="message-container d-flex flex-column position-relative px-1">
        {/* Image if present */}
        {imageUrl && (
          <div className="image-container d-flex align-items-center">
            <img src={imageUrl} alt={fileName} className="image" style={{ maxWidth: "200px", maxHeight: "150px" }} />
            <button className="download-btn ml-2" onClick={handleDownload}>
              <FaDownload />
            </button>
          </div>
        )}



        {/* Render Message Status Icon */}
        {status && position === "right" && (
          <div style={{
            marginBottom: "10px", // adjust this based on how far you want the icon from the top
            marginLeft: "90%",
          }}>

            <RenderStatusIcon
              status={status}
              message={null}
              id={file_id}
              type={type}
              blockScroll={blockScroll}
              unblockScroll={unblockScroll}
            />
            {/* {RenderStatusIcon({
              status:status,
              message:null,
              id:file_id,
              type:type
            })} */}
          </div>
        )}
      </div>
    </div>
  );

};

DynamicImage.propTypes = {
  file_id: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["left", "right"]).isRequired,
  timestamp: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  senderName: PropTypes.string,
  avatar: PropTypes.string,
  color_code: PropTypes.string,
};


