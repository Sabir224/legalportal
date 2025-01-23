import React, { useContext, useEffect, useState } from "react";
import ChatStyle from "../Chat.module.css";
import Contactprofile from "../../Component/images/Asset 70mdpi.png";
import { UserContext } from "./userContext";
import { ApiEndPoint } from "../../Component/utils/utlis";
export default function UserListWidget({ user, onClick, isChat }) {
  const { setSelectedUser } = useContext(UserContext);
  const [isHovered, setIsHovered] = useState(false);
  const onSelectUser = (user) => {
    // Avoid direct mutation of user object
    const updatedUser = { ...user };

    // Check if the user has pending messages
    onClick(user);
    setSelectedUser(updatedUser);

    if (updatedUser.pendingMessagesCount > 0) {
      // Call the API to mark the messages as read for this user
      fetch(`${ApiEndPoint}/messages/mark-read/${updatedUser.id}`, {
        method: "PUT",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            console.log("Messages marked as read successfully");
            // Optionally, update the pending messages count on the frontend
            setSelectedUser({
              ...updatedUser,
              pendingMessagesCount: 0, // Reset the count to 0 without directly modifying the original user object
            });
          } else {
            console.error("Failed to mark messages as read:", data.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    }

    // Proceed with the rest of the selection logic
    localStorage.setItem("user", updatedUser.id);
    localStorage.setItem("phone", updatedUser.phone);
    localStorage.setItem("name", updatedUser.name);
  };

  return (
    <div
      className={
        ChatStyle.userListWidget +
        " list-group-item list-group-item-action border-0"
      }
      style={{
        maxHeight: "100%",
        overflowY: "auto",
        width: "100%",
        backgroundColor: isHovered
          ? "rgba(255, 118, 64, 0.8)" // Semi-transparent orange on hover
          : "rgba(255, 255, 255, 0.6)", // Semi-transparent white by default
        color: isHovered ? "white" : "black", // Change text color on hover
        backdropFilter: "blur(10px)", // Adds the glass effect
        WebkitBackdropFilter: "blur(10px)", // Safari support
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
        borderRadius: "5px", // Rounding the corners for a card-like appearance
        transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition
        padding: "5px",
        paddingRight: "10px",
      }}
      onMouseEnter={() => setIsHovered(true)} // Set hover state to true
      onMouseLeave={() => setIsHovered(false)} // Set hover state to false
    >
      <div
        style={{ cursor: "pointer" }}
        onClick={() => onSelectUser(user)}
        className="list-group-item list-group-item-action border-0 "
      >
        <div className="d-flex align-items-center">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              backgroundImage: user.profilepic
                ? // Check if the profilePic is a valid Base64 string for JPEG, PNG, or SVG
                  user.profilepic.startsWith("data:image/svg+xml;base64,") // For SVG
                  ? `url(${user.profilepic})`
                  : user.profilepic.startsWith("data:image/jpeg;base64,") ||
                    user.profilepic.startsWith("data:image/png;base64,") // For PNG or JPEG
                  ? `url(${user.profilepic})`
                  : "none"
                : "none", // Default to none if no profilePic
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "25px",
              height: "25px",
              margin: "auto",
              boxShadow: "none",
            }}
          >
            <div style={{ margin: "auto", textAlign: "center", color: "#FFF" }}>
              {(user && user.profilepic) || user.profilePicture ? (
                ""
              ) : user.name &&
                user.name.length > 0 &&
                user.name.includes(" ") ? (
                <img src={Contactprofile} height={45} width={45} />
              ) : (
                <img src={Contactprofile} height={45} width={45} />
              )}
            </div>
          </div>
          {/* User Name */}
          <div
            className="flex-grow-1"
            style={{
              marginLeft: "10px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              {user.name &&
                user.name.length > 0 &&
                (user.name.includes(" ")
                  ? `${user.name.split(" ")[0]} ${
                      user.name.split(" ").length > 1 && user.name.split(" ")[1]
                        ? user.name.split(" ")[1][0]
                        : ""
                    }`
                  : user.name)}
            </span>
            {/* Count Badge */}
            {isChat && (
              <div
                style={{
                  backgroundColor: "#25D366", // Green background for the count
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  marginLeft: "10px",
                }}
              >
                {user.pendingMessagesCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
