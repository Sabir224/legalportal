import React, { useState } from "react";
import "../Chat.module.css";
import SocketService from "../../../../SocketService";
import { FaArrowLeft } from "react-icons/fa";
import ViewChatUser from "./ViewChatuser";

const dropdownData = {
  firstStage: ["Option 1", "Option 2", "Option 3"],
  secondStage: ["Option A", "Option B", "Option C"],
};
export default function ChatHeader({ selectedChat, user, setSelectedChat }) {
  const [IsDetailView, setDetailView] = useState(false);
  console.log("users headers", selectedChat)
  return (
    <div
      className="py-0 px-0 d-block mt-1 mb-1 mt-1"
      style={{
        maxHeight: "9vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        className="d-flex align-items-center"
        style={{ height: "100%", marginLeft: "10px", marginRight: "10px" }}
      >
        {/* Back Arrow */}
        <div className="me-2 d-lg-none">
          <FaArrowLeft
            className="main-color"
            size={20}
            onClick={() => {
              setSelectedChat(null);
              SocketService.socket.disconnect();
            }}
          />
        </div>
        <div className="d-flex gap-2" onClick={() =>
            // alert(selectedChat?.chatName ? selectedChat.chatName : "Name")
            setDetailView(true)
          }
            style={{ marginRight: "10px", cursor: "pointer" }}>

          {/* Profile Image */}
          <div className="position-relative" >
            <div
              className="rounded-circle d-flex justify-content-center align-items-center"
              style={{
                backgroundColor: selectedChat?.AvatarColor || "#ccc",
                backgroundImage: selectedChat?.chatProfilePicture
                  ? `url(${selectedChat.chatProfilePicture})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "30px",
                height: "30px",
                border: "1px solid #FFF",
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              {!selectedChat?.chatProfilePicture && (
                <div
                  style={{
                    margin: "auto",
                    textAlign: "center",
                    color: "#FFF",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  {(() => {
                    const participant = selectedChat?.participants
                      ?.filter(
                        (participant) =>
                          String(participant._id) !== String(user._id)
                      )
                      .find((participant) => participant.UserName);

                    if (participant?.UserName) {
                      const nameParts = participant.UserName.split(" ");
                      const initials =
                        nameParts.length > 1
                          ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
                          : nameParts[0][0];
                      return initials.toUpperCase();
                    }
                    return "N";
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="flex-grow-1 d-flex flex-column align-items-start pl-2">
            <strong
              className="text-start w-100"
            // Adds a pointer cursor to indicate it's clickable
            >
              {selectedChat?.chatName ? selectedChat.chatName : "Name"}
            </strong>
          </div>
        </div>

        <ViewChatUser
          isOpen={IsDetailView}
          onClose={(value) => setDetailView(value)}
          user={selectedChat?.participants}
        />
      </div>
    </div>
  );
}
