import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./assets/customSideSheet.module.css";
import { ApiEndPoint } from "./utils/utlis";
const intial_message = `All brokers may seem similar, but I specialize in selecting a
few exceptional projects that offer great investment
opportunities. Let me know your priority
Reply '1' for Capital Appreciation.
Reply '2' for Annual Income.
Reply '3' for Other Relevant Questions.`;
const SideSheet = ({ handleDragStart, onClose }) => {
  const [showCustomMessageField, setShowCustomMessageField] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const sideSheetRef = useRef(null);
  const [templates, setTemplates] = useState([]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sideSheetRef.current &&
        !sideSheetRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  const handleAddMessage = async () => {
    try {
      // Make a POST request to insert the custom message
      await axios.post(`${ApiEndPoint}/insertTemplate`, {
        MessageContent: customMessage,
      });

      // Reset the custom message field and hide it
      setCustomMessage("");
      setShowCustomMessageField(false);

      // Reload templates
      await loadTemplates();
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  const loadTemplates = async () => {
    try {
      // Make a GET request to retrieve all templates
      const response = await axios.get(`${ApiEndPoint}/getAllMessages`);
      setTemplates(response.data);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  };

  useEffect(() => {
    // Load templates when component mounts
    loadTemplates();
  }, []);
  const handleAddCustomMessage = () => {
    setShowCustomMessageField(true);
  };

  const handleCustomMessageChange = (event) => {
    setCustomMessage(event.target.value);
  };

  return (
    <div
      className="col-5"
      ref={sideSheetRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100%",
        overflowY: "auto",
        backgroundColor: "rgba(248, 249, 250, 0.95)", // Semi-transparent background
        padding: "20px",
        zIndex: 1000, // Ensure the SideSheet is displayed above other content
        pointerEvents: "auto", // Enable pointer events on the SideSheet
      }}
    >
      <div className="list-group text-start mt-4">
        <div>
          <button className="closeButton" onClick={onClose}>
            Close
          </button>
          {!showCustomMessageField && (
            <button
              className="add-custom-messages"
              onClick={handleAddCustomMessage}
            >
              Add Custom Message
            </button>
          )}
          {showCustomMessageField && (
            <div>
              <textarea
                value={customMessage}
                onChange={handleCustomMessageChange}
                placeholder="Enter custom message..."
                className="form-control"
                style={{
                  width: "100%", // Set textarea width to 100% of its container
                  maxWidth: "400px", // Set maximum width of textarea
                  minHeight: "100px", // Set minimum height of textarea
                  resize: "vertical", // Allow vertical resizing only
                }}
              />
              <br></br>
              <button className="add-message" onClick={handleAddMessage}>
                Add Message
              </button>
            </div>
          )}
        </div>
        <h3>Intial Message</h3>
        <div
          className="list-group-item draggable"
          draggable="true"
          onDragStart={(e) => handleDragStart(e, intial_message)}
        >
          {intial_message}
        </div>
        <h3>Custom Messages</h3>
        {templates.map((template) => (
          <div
            key={template.TemplateID}
            className="list-group-item draggable"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, template.MessageContent)}
          >
            {template.MessageContent}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideSheet;
