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
            font-size: 12px;
            margin: 0;
  padding: 0;
  line-height: 1.6;
          }
            .text-danger {
  white-space: pre-line;
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
                <div className="p-4">
                  <FontAwesomeIcon
                    icon={faFileArrowUp}
                    style={{ fontSize: "60px", color: "#18273e" }}
                  />
                  <p className="dropzone-text">Drag and drop files here</p>
                  <p className="dropzone-text">OR</p>
                  <p className="dropzone-text">Click to choose file</p>
                </div>
              )}
            </div>
          </div>
          {errorMessage.length > 0 && (
            <div className="text-danger mt-2">
              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                {errorMessage.map((msg, index) => {
                  // Split the message by both commas and colons into an array
                  const messages = msg
                    .split(/,|:/)
                    .map((msgPart) => msgPart.trim()); // Trim to remove unnecessary spaces

                  return (
                    <li
                      key={index}
                      style={{ marginBottom: "2px", lineHeight: "1.2" }}
                    >
                      {/* Display each part of the message with the count */}
                      {messages.map((message, i) => (
                        <div key={i}>
                          {/* Display count starting from 1 and skip 0 */}
                          {i > 0 && <span>({i})</span>} {message}
                        </div>
                      ))}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {selectedFiles?.length > 0 && !uploadSuccess && (
            <div className="mt-3">
              <h6>Uploadable Files:</h6>
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
