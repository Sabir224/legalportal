import React from "react";
import chatstyle from "./assets/SheetMessageStyle.module.css"; // Import your custom stylesheet
import sendIcon from "./images/send.png";

import { useState, useEffect } from "react";
import axios from "axios";
import { ApiEndPoint } from "./utils/utlis";

const SheetComponent = ({ text, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [replyMode, setReplyMode] = useState(null); // Track the active message index
  const [replyText, setReplyText] = useState("");

  const handleReplyClick = (index) => {
    setReplyMode(index);
  };

  const handleSendClick = async (phone) => {
    // Implement your logic to send the reply
    console.log("Type of Phone Number", typeof phone, phone);
    try {
      console.log("Sending reply:", replyText);

      await axios.post(
        `${ApiEndPoint}//sendReply`,
        { phone, replyText },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Message sent successfully!");
      setReplyMode(null);
      setReplyText("");
    } catch (error) {}

    // Reset reply mode and text
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${ApiEndPoint}/user/${text}`);
        const data = await response.json();

        console.log("USER DATA:", typeof data.data, data);

        if (isMounted && response.ok) {
          setUserData(data.data);
        } else if (isMounted) {
          console.error("Failed to fetch user data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
      console.log("Component unmounted");
    };
  }, [text]);

  // Assuming messages are part of the user data
  const messagesArray = userData?.[0]?.messages
    ? JSON.parse(`[${userData[0].messages}]`)
    : [];

  return (
    <div
      className={chatstyle["sheet-container-right"] + " container"}
      onClick={onClose}
    >
      <div
        className={
          chatstyle["sheet-container-right"] + "row sheet-content-right"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="col-4">
          <div className="sticky-top bg-white ">
            {userData &&
              userData.map((user, index) => (
                <h3 key={index}>
                  {user.name}
                  <button
                    className={chatstyle["close-button"] + " position-fixed"}
                    onClick={onClose}
                  >
                    X
                  </button>
                </h3>
              ))}
          </div>
          <div className={chatstyle["sheet-text"] + "mt-5"}>
            {userData &&
              userData.map((user, userIndex) => (
                <div key={userIndex} className="user-container">
                  {messagesArray.map((message, messageIndex) => (
                    <div
                      key={messageIndex}
                      className={chatstyle["message-container"]}
                    >
                      <div className={chatstyle["message-content"]}>
                        <strong>
                          {message.message_content ? "Message" : ""}
                        </strong>{" "}
                        {message.message_content}
                      </div>
                      {replyMode === messageIndex && message.message_content ? (
                        <div className={chatstyle["reply-section"]}>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply here..."
                            rows={1}
                            className="form-control"
                            style={{
                              height: "auto",
                              minHeight: "50px",
                              maxHeight: "150px",
                            }}
                          />
                          <div className={chatstyle["button-container"]}>
                            <button
                              onClick={() => handleSendClick(user.phone)}
                              className="btn btn-secondary"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={chatstyle["button-container"]}>
                          {message.message_content ? (
                            <button
                              onClick={() => handleReplyClick(messageIndex)}
                              className="btn btn-secondary"
                            >
                              Reply
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetComponent;
