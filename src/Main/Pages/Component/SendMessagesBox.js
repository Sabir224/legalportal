import React, { useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import sendIcon from "./images/send.png";
import DropzoneComponent from "../ContactForm/dropzonComponent"; // Import your DropzoneComponent
import sendboxstyle from "./assets/SendBox.module.css"; // Import your custom stylesheet
import axios from "axios";
import SideSheet from "./CustomeMessagesTemp";
import { ApiEndPoint } from "./utils/utlis";

const SendMessage = ({ onSendMessage, selectedUsers, deletetUsers }) => {
  const [message, setMessage] = useState("");
  const [typedMessage, setTypedMessage] = useState(""); // State to track the currently typed message
  const [showDropzoneModal, setShowDropzoneModal] = useState(false);
  const handleInputChange = (e) => {
    setTypedMessage(e.target.value); // Update the typed message
  };
  // const onDeleteUser = (deletedUsers) => {
  //   const idsToDelete = Array.isArray(deletedUsers) ? deletedUsers.map((user) => user.id) : [deletedUsers];

  //   // Check if all selected users are deleted
  //   const allSelectedUsersDeleted = selectedUsers.every((selectedUser) => idsToDelete.includes(selectedUser.id));

  //   // If all selected users are deleted, pass an empty array to onSendMessages
  //   if (allSelectedUsersDeleted) {
  //     window.location.reload();
  //   ;
  //   } else {
  //     // Pass updated selectedUsers array to onSendMessages function

  //   }
  // };
  const handleCloseSideSheet = () => {
    setIsSideSheetOpen(false);
  };
  const handleSendClick = async () => {
    try {
      const finalMessage = typedMessage || message; // Use typed message if available, otherwise use dragged message

      await axios.post(
        `${ApiEndPoint}/sendMessage`,
        { selectedUsers, message: finalMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Message sent successfully!");
      setMessage("");
      setTypedMessage(""); // Clear typed message after sending

      onSendMessage();
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  };

  const openDropzoneModal = () => {
    setShowDropzoneModal(true);
    // Perform any additional actions if needed
  };

  const closeDropzoneModal = () => {
    setShowDropzoneModal(false);
    // Perform any additional actions if needed
  };
  // Message drop and drag
  const messages = ["Hello", "How are you?", "Good morning"];

  const handleDragStart = (e, message) => {
    e.dataTransfer.setData("text/plain", message);
    // Append the dragged message to the typed message
  };
  const [isSideSheetOpen, setIsSideSheetOpen] = useState(false);

  const handleButtonClick = () => {
    setIsSideSheetOpen(true);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedMessage = e.dataTransfer.getData("text/plain");
    const textField = document.getElementById("text-field");

    // Check if the drop occurs inside the textarea
    if (isMouseOverTextArea(e, textField)) {
      // Append the dragged message to the existing message
      textField.value += draggedMessage + "\n";

      // Update the state to keep track of the concatenated message
      setTypedMessage(textField.value);
    }
  };
  const isMouseOverTextArea = (e, textarea) => {
    const rect = textarea.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    return (
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
    );
  };

  return (
    <div className="d-flex ms-2 me-2 mt-1">
      <div className="container-fluid">
        <div className="row ">
          <div className="col-9 mt-2">
            <textarea
              id={sendboxstyle["text-field"]}
              className="form-control col-md-4 "
              rows="2"
              value={typedMessage}
              onChange={handleInputChange}
              placeholder="Drop messages here"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            ></textarea>
          </div>
          <div className={sendboxstyle["button-container"] + " col-1 "}>
            <div className="input-group-append">
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={handleSendClick}
              >
                <img
                  src={sendIcon}
                  alt="send"
                  className={sendboxstyle.sendbutton}
                />{" "}
                <span className="text-sm">Send</span>
              </button>
            </div>
          </div>
          <div className={sendboxstyle["button-container"] + " col-1 "}>
            {showDropzoneModal && (
              <DropzoneComponent
                isOpen={showDropzoneModal}
                onClose={closeDropzoneModal}
              />
            )}
            <button
              className="btn btn-primary btn-sm"
              onClick={openDropzoneModal}
            >
              <span className="text-md">Upload File</span>
            </button>
          </div>
          <div className={sendboxstyle[`button-container`] + " col-1"}>
            <div className="input-group-append">
              <button
                className="btn btn-primary btn-sm"
                type="button"
                onClick={handleButtonClick}
              >
                <span className="text-md">Custom Messages</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isSideSheetOpen && (
        <SideSheet
          messages={messages}
          handleDragStart={handleDragStart}
          onClose={handleCloseSideSheet}
        />
      )}
    </div>
  );
};

export default SendMessage;
