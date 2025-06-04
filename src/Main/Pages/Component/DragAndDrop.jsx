import {
  faCheckCircle,
  faFile,
  faFileArrowUp,
  faSpinner,
  faEdit,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Modal, Form } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";

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
  const [editableFiles, setEditableFiles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    if (selectedFiles.length > 0) {
      setEditableFiles(
        selectedFiles.map((file) => ({
          file: file,
          displayName: file.name,
        }))
      );
    } else {
      setEditableFiles([]);
    }
  }, [selectedFiles]);

  const onDrop = (acceptedFiles) => {
    // Limit to 5 files
    const filesToAdd = acceptedFiles.slice(0, 5 - editableFiles.length);
    if (filesToAdd.length > 0) {
      const newFiles = filesToAdd.map((file) => ({
        file: file,
        displayName: file.name,
      }));
      handleFileChange({
        target: { files: [...editableFiles, ...newFiles].map((f) => f.file) },
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const handleRenameStart = (index) => {
    setEditingIndex(index);
    setNewFileName(editableFiles[index].displayName);
  };

  const handleRenameSave = (index) => {
    const updatedFiles = [...editableFiles];
    const originalFile = updatedFiles[index].file;

    // Create a new File object with the updated name
    const renamedFile = new File(
      [originalFile],
      newFileName.includes(".")
        ? newFileName
        : `${newFileName}.${originalFile.name.split(".").pop()}`,
      {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      }
    );

    updatedFiles[index] = {
      file: renamedFile,
      displayName: newFileName.includes(".")
        ? newFileName
        : `${newFileName}.${originalFile.name.split(".").pop()}`,
    };

    setEditableFiles(updatedFiles);
    setEditingIndex(null);

    // Update the parent component with the renamed files
    handleFileChange({ target: { files: updatedFiles.map((f) => f.file) } });
  };

  const handleRenameCancel = () => {
    setEditingIndex(null);
  };

  const handleNameChange = (e) => {
    setNewFileName(e.target.value);
  };

  const handleRemoveFile = (index) => {
    console.log("file index",index)
    const updatedFiles = [...editableFiles];
    updatedFiles.splice(index, 1);
    setEditableFiles(updatedFiles);
    handleFileChange({ target: { files: updatedFiles.map((f) => f.file) } });
    // If we're editing the file being removed, cancel editing
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  return (
    <>
      <style>{`
          .dropzone-container {
            border: 2px dashed #18273e !important;
            padding: 15px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .dropzone-container1 {
            border: none;
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
          .file-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          .file-name {
            margin-right: 8px;
            word-break: break-all;
          }
          .edit-icon {
            cursor: pointer;
            color: #18273e;
            margin-left: 8px;
          }
          .remove-icon {
            cursor: pointer;
            color: #dc3545;
            margin-left: 8px;
          }
          .file-edit-container {
            display: flex;
            align-items: center;
            width: 100%;
          }
          .file-count {
            font-size: 0.8rem;
            color: #6c757d;
            margin-bottom: 10px;
          }
          .file-actions {
            display: flex;
            align-items: center;
            margin-left: auto;
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
                  <p className="file-count">Maximum 5 files allowed</p>
                </div>
              )}
            </div>
          </div>
          {errorMessage.length > 0 && (
            <div className="text-danger mt-2">
              <ul style={{ paddingLeft: "20px", margin: 0 }}>
                {errorMessage.map((msg, index) => {
                  const messages = msg
                    .split(/,|:/)
                    .map((msgPart) => msgPart.trim());
                  return (
                    <li
                      key={index}
                      style={{ marginBottom: "2px", lineHeight: "1.2" }}
                    >
                      {messages.map((message, i) => (
                        <div key={i}>
                          {i > 0 && <span>({i})</span>} {message}
                        </div>
                      ))}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {editableFiles.length > 0 && !uploadSuccess && (
            <div className="mt-3">
              <h6>Selected Files ({editableFiles.length}/5):</h6>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {editableFiles.map((fileObj, index) => (
                  <li key={index} className="file-item">
                    {editingIndex === index ? (
                      <div className="file-edit-container">
                        <Form.Control
                          type="text"
                          value={newFileName}
                          onChange={handleNameChange}
                          size="sm"
                          placeholder="Enter new file name"
                        />
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRenameSave(index)}
                          className="ms-2"
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleRenameCancel}
                          className="ms-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="d-flex align-items-center"
                        style={{ width: "100%" }}
                      >
                        <FontAwesomeIcon
                          icon={faFile}
                          className="me-2"
                          style={{ color: "#18273e" }}
                        />
                        <span className="file-name">{fileObj.displayName}</span>
                        <div className="file-actions">
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="edit-icon"
                            onClick={() => handleRenameStart(index)}
                            title="Rename file"
                          />
                          <FontAwesomeIcon
                            icon={faTimes}
                            className="remove-icon"
                            onClick={() => handleRemoveFile(index)}
                            title="Remove file"
                          />
                        </div>
                      </div>
                    )}
                  </li>
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
            onClick={() => handleFileUpload(editableFiles.map((f) => f.file))}
            disabled={uploading || uploadSuccess || editableFiles.length === 0}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DragAndDrop;