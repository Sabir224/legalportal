import React, { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFile,
  faFileAlt,
  faFileArchive,
  faFileAudio,
  faFileImage,
  faFilePdf,
  faFileVideo,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import DragAndDrop from "./DragAndDrop";

const FilesSection = ({
  files,
  handleDownload,
  handleFileDelete,
  showUploadModal,
  setShowUploadModal,
  onHide,
  handleFileChange,
  uploading,
  uploadSuccess,
  selectedFiles,
  handleFileUpload,
  errorMessage,
  isMobile,
  isUser,
}) => {
  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return faFilePdf;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return faFileImage;
      case "mp4":
      case "avi":
      case "mov":
        return faFileVideo;
      case "mp3":
      case "wav":
      case "ogg":
        return faFileAudio;
      case "doc":
      case "docx":
      case "txt":
        return faFileAlt;
      case "zip":
      case "rar":
      case "7z":
        return faFileArchive;
      default:
        return faFile;
    }
  };

  // Bootstrap column settings: xs=12 (1 column), sm+=6 (2 columns)
  const getColProps = () => ({ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 });

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: isMobile ? "0 2px" : "0 5px",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "calc(100% - 220px)",
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
        }}
      >
        <Row className="g-2 mx-0">
          {files.map((file, index) => (
            <Col key={index} {...getColProps()} className="px-1 mb-1">
              <Card
                style={{
                  minHeight: isMobile ? "90px" : "120px",
                  padding: isMobile ? "4px" : "8px",
                  backgroundColor: "#001f3f",
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0px 4px 10px rgba(0, 0, 0, 0.8)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    handleDownload(file._id, file.fileName);
                  }
                }}
              >
                <div className="text-center py-1">
                  <FontAwesomeIcon
                    color="#d3b386"
                    icon={getFileTypeIcon(file.fileName)}
                    size={isMobile ? "1x" : "2x"}
                  />
                </div>
                <Card.Body className="p-1">
                  <Card.Text
                    style={{
                      fontSize: isMobile ? "0.7rem" : "0.8rem",
                      marginBottom: "4px",
                    }}
                  >
                    {file.fileName.length > 15 && isMobile
                      ? `${file.fileName.substring(0, 12)}...`
                      : file.fileName}
                  </Card.Text>

                  <div
                    className={`d-flex${
                      isUser
                        ? " justify-content-between"
                        : " justify-content-center"
                    }`}
                  >
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file._id, file.fileName);
                      }}
                      className="p-1"
                      style={{ minWidth: "32px" }}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </Button>
                    {isUser && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileDelete(file._id);
                        }}
                        className="p-1"
                        style={{ minWidth: "32px" }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {isUser && (
        <div
          style={{
            position: "fixed",
            bottom: isMobile ? "80px" : "70px",
            right: isMobile ? "30px" : "100px",
            zIndex: 9999, // Ensure it's always visible
          }}
        >
          <Button
            variant="primary"
            className="rounded-circle"
            onClick={() => setShowUploadModal(true)}
            style={{
              width: "48px",
              height: "48px",
              padding: "0",
              backgroundColor: "#d3b386",
              border: "none",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <FontAwesomeIcon icon={faUpload} />
          </Button>
        </div>
      )}

      {showUploadModal && (
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
      )}
    </div>
  );
};

export default FilesSection;
