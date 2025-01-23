import React, { useState } from "react";
import { FaSpinner, FaPaperPlane, FaTimes } from "react-icons/fa";
import "../../chat/widgets/chatinputs.css";
import Imag from "../../Component/images/gallery.png";
import Send from "../../Component/images/send.png";
const ReplyInput = ({ onSendReply, onClose }) => {
  const [message, setMessage] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [isMessageSending, setMessageSending] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessageSending(true);
      onSendReply(message);
      setMessage(""); // Clear the input field
      setTimeout(() => setMessageSending(false), 2000);
    } else {
      setPopupMessage("You can't send an empty message.");
    }
  };

  const handleClosePopup = () => {
    setPopupMessage("");
  };

  return (
    <div className="reply-input border-top py-2.5">
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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

        <FaTimes
          style={{ fontSize: "20px" }}
          onClick={onClose}
          color="#FF7640"
        />
      </div>

      {popupMessage && (
        <div className="popup-modal">
          <h2>Error Message:</h2>
          <div className="popup">
            <p>{popupMessage}</p>
            <button
              onClick={handleClosePopup}
              style={{
                backgroundColor: "rgb(255, 118, 64)",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyInput;
