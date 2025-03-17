import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faTimes,
  faCloudUploadAlt,
  faMessage,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { faFileAlt } from "@fortawesome/free-regular-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import Clip from "../../Component/images/attachment.png";
import Send from "../../Component/images/send.png";
import vmsg from "vmsg";
import Modal from "react-modal";
import "../../chat/widgets/chatinputs.css";
import SocketService from "../../../../SocketService";
import { ApiEndPoint } from "../../Component/utils/utlis";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

import { Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
// import SendMessageModal from "../../../Main page/SendTemplateViaChat";
export default function ChatInput({ selectedChat, user }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewCaption, setPreviewCaption] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const [isMessageSending, setMessageSending] = useState(false);
  const [previewFilePath, setPreviewFilePath] = useState(null);
  const [fileType, setFileType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const buttonRef = useRef(null);
  const [isClientSessionExpired, setClientSession] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const recorderRef = useRef(
    new vmsg.Recorder({
      wasmURL: "https://unpkg.com/vmsg@0.3.0/vmsg.wasm",
    })
  );

  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let typingTimeout;

    if (isTyping) {
      SocketService.sendTyping(selectedChat._id, user._id);

      typingTimeout = setTimeout(() => {
        SocketService.stopTyping(selectedChat._id, user._id);
        setIsTyping(false);
      }, 3000);
    }

    return () => clearTimeout(typingTimeout);
  }, [isTyping, selectedChat?._id, user?._id]);
  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === "" && !file) return;

    SocketService.sendMessage({
      senderId: user._id,
      chatId: selectedChat._id,
      content: message,
      messageType: file ? "file" : "text",
      file,
    });

    // Stop typing when message is sent
    SocketService.stopTyping(selectedChat._id, user._id);
    setIsTyping(false);
    setMessage("");
    setFile(null);
  };
  useEffect(() => {}, [showSuccessMessage, popupMessage, isMessageSending]);

  const checkSession = async () => {};

  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = async (e) => {
    const isExpired = await checkSession(); // Await the result of checkSession
    if (isExpired) {
      openModal();
      return;
    }
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setPopupMessage("Image must be less than 20MB");
        e.target.value = null; // Reset the file input field
        return;
      }
      setPreviewFilePath(URL.createObjectURL(file));
      console.log(file);
      setPreviewFile(file);
      e.target.value = null; // Reset the file input field
    }
  };

  // 🔹 Function to handle file selection (Preview)
  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🔹 Validate file size (Max: 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setPopupMessage("Document must be less than 15MB");
      e.target.value = null; // Reset file input
      return;
    }

    // 🔹 Extract file extension
    const fileExtension = file.name.split(".").pop().toLowerCase();
    setFileType(fileExtension);

    // 🔹 Generate a preview URL
    const previewUrl = URL.createObjectURL(file);

    // 🔹 Handle different file types
    if (fileExtension === "pdf") {
      generatePdfThumbnail(file);
    } else if (file.type.startsWith("image/")) {
      setPreviewFilePath(previewUrl);
      setPreviewFile(file);
    } else if (
      ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension)
    ) {
      setPreviewFilePath("/path/to/document-icon.png"); // Set a generic document preview icon
      setPreviewFile(file);
    } else {
      setPreviewFile(null);
      setPopupMessage("Unsupported file type");
    }

    e.target.value = null; // Reset file input field
  };

  // 🔹 Function to generate PDF thumbnail
  const generatePdfThumbnail = async (file) => {
    try {
      const fileUrl = URL.createObjectURL(file);
      const pdf = await pdfjs.getDocument(fileUrl).promise;
      const page = await pdf.getPage(1);
      const scale = 0.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;
      const thumbnailUrl = canvas.toDataURL();

      setPreviewFilePath(thumbnailUrl);
      setPreviewFile({ name: file.name, type: "image/png" });
    } catch (error) {
      setPopupMessage("Error generating PDF preview");
    }
  };

  // 🔹 Function to handle file upload & send via socket
  const handleFileUpload = async () => {
    if (!previewFile) return;

    try {
      // 🔹 Prepare file for upload
      const formData = new FormData();
      formData.append("file", previewFile);

      // 🔹 Upload file to S3 via API
      const response = await fetch(`${ApiEndPoint}/uploadFile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      const { fileUrl } = await response.json(); // Extract file URL from response
      if (!fileUrl) throw new Error("File URL is missing from API response");

      // 🔹 Send file metadata via Socket.IO
      await SocketService.sendFile({
        senderId: user?._id, // Ensure user ID is correct
        chatId: selectedChat?._id, // Use the correct chat ID
        file: {
          name: previewFile.name,
          type: previewFile.type,
          url: fileUrl, // The uploaded S3 file URL
        },
        messageType: "file",
      });

      console.log("✅ File sent via socket successfully!");
      setPreviewFile(null); // Clear preview after sending
      setPreviewFilePath(null);
    } catch (error) {
      console.error("❌ Error handling file upload:", error);
    }
  };

  const startRecording = async () => {
    const isExpired = await checkSession(); // Await the result of checkSession
    if (isExpired) {
      openModal();
      return;
    }
    setIsRecording(true);
    try {
      await recorderRef.current.initAudio();
      await recorderRef.current.initWorker();
      recorderRef.current.startRecording();
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      const blob = await recorderRef.current.stopRecording();
      if (blob.size > 5 * 1024 * 1024) {
        setPopupMessage("Audio must be less than 5MB");
        setAudioUrl(null);
        return;
      }
      const audioUrl = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(audioUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendAudio = async () => {
    const isExpired = await checkSession(); // Await the result of checkSession
    if (isExpired) {
      openModal();
      return;
    }
    if (audioBlob) {
      setAudioBlob(null);
      setAudioUrl(null);
    }
  };

  const handleCancelAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const handleSendPreviewFile = async () => {
    const isExpired = await checkSession(); // Await the result of checkSession
    if (isExpired) {
      openModal();
      return;
    }
    if (previewFile) {
      if (previewFile.type.startsWith("image/")) {
      } else {
      }
      setPreviewFile(null);
      setPreviewCaption("");
    }
  };

  const handleClosePopup = () => {
    setPopupMessage("");
    setPreviewFile(null);
  };

  const handleClickOutside = useCallback(
    (event) => {
      if (popupMessage && !event.target.closest(".popup-modal")) {
        handleClosePopup();
      }
      // Hide success message when clicking outside
      if (showSuccessMessage && !event.target.closest(".success-message")) {
        setShowSuccessMessage(false);
      }
    },
    [popupMessage, showSuccessMessage]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  const getFileIcon = (file) => {
    if (!file) return null;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    switch (fileExtension) {
      case "pdf":
        return faFilePdf;
      case "doc":
      case "docx":
        return faFileWord;
      case "xls":
      case "xlsx":
        return faFileExcel;
      case "ppt":
      case "pptx":
        return faFilePowerpoint;
      default:
        return faFileAlt; // Default file icon for other document types
    }
  };

  return (
    <div
      className="chat-input p-1 position-relative"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="input-container">
        {/* Clip Button for File Selection */}
        <img
          src={Clip}
          height={25}
          width={25}
          className="icon"
          onClick={() => fileInputRef.current.click()}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleDocUpload}
          style={{ display: "none" }}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.bmp,.svg"
        />

        <input
          type="text"
          value={message}
          onChange={(e) => handleTyping(e)}
          placeholder="Type a message"
          className="text-input"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        {isMessageSending ? (
          <FaSpinner
            className="spinner"
            style={{
              color: "#25D366",
              fontSize: "25px",
              animation: "spin 1s linear infinite",
            }}
          />
        ) : (
          <img
            src={Send}
            height={25}
            width={25}
            className="icon"
            onClick={handleSendMessage}
          />
        )}
      </div>

      {/* File Preview (Centered & Responsive) */}
      {previewFile && (
        <div
          className="file-preview-container position-absolute p-2 border rounded shadow-sm bg-white"
          style={{
            bottom: "110%", // Keeps it slightly above the button
            left: "50%", // Centers it to the button
            transform: "translateX(-50%)", // Ensures perfect centering
            width: "40%", // Fixed size for better layout
            maxWidth: "50%",

            zIndex: 1050, // Ensures it appears on top
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* File Preview Box */}
          <div
            className="border p-2 d-flex justify-content-center align-items-center main-bgcolor"
            style={{
              width: "100%",
              height: "250px",
              maxHeight: "25%",
            }}
          >
            {previewFile.type.startsWith("image/") ? (
              <img
                src={previewFilePath}
                alt="file preview"
                className="img-fluid"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            ) : fileType === "pdf" ? (
              <Document file={previewFilePath}>
                <Page pageNumber={1} width={100} />
              </Document>
            ) : (
              <FontAwesomeIcon icon={faFileAlt} size="3x" color="gray" />
            )}
          </div>
          {/* File Info */}
          <div className="text-center mt-2 d-flex flex-column align-items-center">
            {/* File Name */}
            <p
              className="mb-1 fw-bold text-truncate text-center"
              style={{ maxWidth: "150px" }}
            >
              {previewFile.name}
            </p>

            {/* File Details (Size & Type) */}
            <p className="text-muted small">
              {fileType.toUpperCase()} Document
            </p>
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-2 mt-2">
            {/* Cancel Button */}
            <button
              className="btn btn-outline-danger d-flex align-items-center justify-content-center"
              onClick={() => setPreviewFile(null)}
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {/* Upload Button */}
            <button
              className="btn btn-outline-success upload-btn d-flex align-items-center justify-content-center"
              onClick={handleFileUpload}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                transition: "0.3s",
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}

      {popupMessage && (
        <Modal
          isOpen={!!popupMessage}
          onRequestClose={handleClosePopup}
          className="popup-modal"
          overlayClassName="popup-modal-overlay"
          ariaHideApp={false}
        >
          <h2>Error Message:</h2>
          <div className="popup">
            <p>{popupMessage}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
