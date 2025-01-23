import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./dynamicDocument.module.css"; // Import CSS module
import {
  FaDownload,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
} from "react-icons/fa";
import { ApiEndPoint, formatTimestamp, messageTime, splitSenderName } from "../../Component/utils/utlis";
import RenderStatusIcon from "../widgets/renderMessageStatus";

const DynamicDocument = ({
  mimeType,
  position,
  timestamp,
  fileName,
  fileId,
  avatar,
  senderName,
  color_code,
  status,
  type,
  blockScroll,
  unblockScroll,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const handleProgress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setDownloadProgress(percentComplete);
      }
    };

    return () => {
      setDownloadProgress(0); // Cleanup progress state on component unmount
    };
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${ApiEndPoint}/downloadFile/${fileId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Obtain filename from content disposition header, if available
      let filename = fileName;
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Handle progress
      const total = parseInt(response.headers.get('Content-Length'), 10);
      const reader = response.body.getReader();
      let loaded = 0;
      let chunks = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        loaded += value.length;
        const percentComplete = Math.round((loaded / total) * 100);
        setDownloadProgress(percentComplete);
      }

      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object after download
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setLoading(false);
      setDownloadProgress(0); // Reset progress state
    }
  };

  const getFileIcon = (mimeType) => {
    switch (mimeType) {
      case "application/pdf":
        return <FaFilePdf className={styles.icon} />;
      case "application/msword":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return <FaFileWord className={styles.icon} />;
      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return <FaFileExcel className={styles.icon} />;
      default:
        return <FaFileAlt className={styles.icon} />;
    }
  };



  return (
    <div
      className={`${styles["chat-message-" + position]} ${styles["chat-message"]} px-1`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles[`avatar-${position} p2`]}>
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
        <div className="text-center text-wrap sender-name">
          {splitSenderName(senderName)}
          <br />
          {formatTimestamp(timestamp)}
        </div>
      </div>

      <div className={styles["document-container"]}>
        {loading && (
          <div className={styles["progress-container"]}>
            <div
              className={styles["progress-bar"]}
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        )}
        <div className={styles["document-preview"]}>
          <div className={styles["document-thumbnail"]}>
            {getFileIcon(mimeType)}
            {hovered && (
              <button
                className={styles["download-btn"]}
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? <></> : <FaDownload />}
              </button>
            )}
          </div>
        </div>
        {/* Status Icon (Only on the right) */}
        {status && (
          <div style={{
            marginBottom: "10px", // adjust this based on how far you want the icon from the top
            marginLeft: "90%",
          }}>

            <RenderStatusIcon
              status={status}
              message={null}
              id={fileId}
              type={type}
              blockScroll={blockScroll}
              unblockScroll={unblockScroll}
            />
            {/* {RenderStatusIcon({
              status:status,
              message:null,
              id:fileId,
              type:type

            })} */}
          </div>
        )}
      </div>


    </div>
  );
};


export default DynamicDocument;
