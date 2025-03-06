import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
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
      if (file.size > 5 * 1024 * 1024) {
        setPopupMessage("Image must be less than 5MB");
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

    // 🔹 Generate a preview (PDF, images, etc.)
    const previewUrl = URL.createObjectURL(file);
    setPreviewFilePath(previewUrl);
    setPreviewFile(file);

    e.target.value = null; // Reset file input field
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
    <div className="chat-input p-1" style={{ backgroundColor: "transparent" }}>
      <div className="input-container">
        {/* selcti image */}
        {/* <img
          src={Imag}
          height={25}
          width={25}
          className="icon"
          onClick={() => docInputRef.current.click()}
        />
        <input
          type="file"
          ref={docInputRef}
          onChange={handleImageUpload}
          style={{ display: "none" }}
          accept="image/*"
        /> */}
        {/* select docs */}
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
        {/* {isRecording ? (
          <FaStop
            className="icon"
            style={{ color: "red" }}
            onClick={stopRecording}
          />
        ) : (
          <img
            src={Mic}
            height={25}
            width={25}
            className="icon"
            onClick={startRecording}
          />
        )} */}
        {isMessageSending ? (
          <FaSpinner
            className="spinner"
            style={{
              color: "#25D366",
              fontSize: "25px",
              animation: "spin 1s linear infinite",
            }} // Add animation and color
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

      {audioUrl && (
        <div className="preview-container pr-7">
          <audio controls src={audioUrl} />
          <div className="preview-buttons">
            <button onClick={handleSendAudio} className="btn btn-success">
              Send
            </button>
            <button onClick={handleCancelAudio} className="btn btn-danger ml-1">
              Cancel
            </button>
          </div>
        </div>
      )}
      {previewFile && (
        <div
          className="preview-container pr-7"
          style={{
            flexDirection: "column",
            maxWidth: "100%",
            marginBottom: "70px",
          }}
        >
          {previewFile.type.startsWith("image/") ? (
            <div style={{ borderWidth: "2px", borderColor: "black" }}>
              <img
                src={previewFilePath}
                alt="file preview"
                style={{
                  width: "100%",
                  height: "auto",
                  padding: "10px",
                  maxWidth: "300px", // Limit the width for tablet view
                }}
              />
            </div>
          ) : (
            <div>
              {fileType === "pdf" ? (
                <div
                  style={{ width: "100%", height: "auto", maxWidth: "300px" }}
                >
                  <embed
                    src={`${previewFilePath}#toolbar=0&navpanes=0&page=1&scrollbar=0&view=FitH`}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    style={{ border: "none", overflow: "hidden" }}
                  />
                </div>
              ) : (
                <div
                  style={{ width: "100%", height: "auto", maxWidth: "300px" }}
                >
                  <div className="fileviewer">
                    <FontAwesomeIcon
                      icon={getFileIcon(previewFile)}
                      size="10x"
                      color="gray"
                    />
                  </div>
                  <div className="fileviewertitle">
                    <p>{previewFile.name}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <hr />
          <div className="preview-buttons">
            <button
              onClick={handleFileUpload}
              style={{
                backgroundColor: "#25D366",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
            <button
              onClick={() => setPreviewFile(null)}
              style={{
                backgroundColor: "rgb(255, 118, 64)",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Close
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

      {/* <ToastContainer /> */}
    </div>
  );
}
