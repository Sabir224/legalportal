import {
  faCheckCircle,
  faFile,
  faFileArrowUp,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
const DragAndDrop = ({
  showModal,
  handleFileChange,
  onHide,
  uploading,
  uploadSuccess,
  selectedFiles = [],
  handleFileUpload,
  errorMessage,
}) => {
  const onDrop = (acceptedFiles) => {
    handleFileChange({ target: { files: acceptedFiles } });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 5,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
      "image/tiff": [".tiff"],
      "video/mp4": [".mp4"],
      "video/x-msvideo": [".avi"],
      "video/quicktime": [".mov"],
      "video/x-ms-wmv": [".wmv"],
      "video/x-flv": [".flv"],
      "video/x-matroska": [".mkv"],
      "video/webm": [".webm"],
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/aac": [".aac"],
      "audio/ogg": [".ogg"],
      "audio/flac": [".flac"],
      "audio/mp4": [".m4a"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "text/plain": [".txt"],
      "application/zip": [".zip"],
      "application/x-rar-compressed": [".rar"],
      "application/x-7z-compressed": [".7z"],
    },
  });

  return (
    <>
      <style>{`
          .dropzone-container {
            border: 2px dashed #18273e !important;;
            padding: 15px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
             .dropzone-container1 {
            border: none
            padding: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
  
          .icon-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
           
          }
  
          .dropzone-text {
            font-size: 18px;
          }
        `}</style>
      <Modal show={showModal} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div {...getRootProps()} className="dropzone-container mt-1">
            <input {...getInputProps()} />
            <div className="icon-container">
              {uploading ? (
                <div className="dropzone-container1">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    style={{ color: "#18273e", fontSize: "60px" }}
                  />
                  <p>Uploading...</p>
                </div>
              ) : uploadSuccess ? (
                <div className="dropzone-container1">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{ fontSize: "60px", color: "green" }}
                  />
                  <p>Upload Successful!</p>
                </div>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faFileArrowUp}
                    style={{ fontSize: "60px", color: "#18273e" }}
                  />
                  <p className="dropzone-text">Drag and drop files here</p>
                  <p className="dropzone-text">OR</p>
                  <p className="dropzone-text">Click to choose file</p>
                </>
              )}
            </div>
          </div>
          {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
          {selectedFiles?.length > 0 && !uploadSuccess && (
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
            variant="primary"
            style={{ backgroundColor: "#18273e", color: "white" }}
            className="border border-rounded"
            onClick={handleFileUpload}
            disabled={uploading || uploadSuccess}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DragAndDrop;
