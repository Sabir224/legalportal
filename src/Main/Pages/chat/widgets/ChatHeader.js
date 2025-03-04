import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Chat.module.css";
import Video from "../../Component/images/video call.png";
import Voice from "../../Component/images/dialer.png";
import OPT from "../../Component/images/options.png";
import { ApiEndPoint } from "../../Component/utils/utlis";
import axios from "axios";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import SocketService from "../../../../SocketService";
import { FaArrowLeft } from "react-icons/fa";

const dropdownData = {
  firstStage: ["Option 1", "Option 2", "Option 3"],
  secondStage: ["Option A", "Option B", "Option C"],
};

export default function ChatHeader({ selectedChat, user, setSelectedChat }) {
  const [isHumanActive, setIsHumanActive] = useState(false);
  const [isClientSessionExpired, setClientSession] = useState(false);

  const [showSheet, setShowSheet] = useState(false);
  const [sheetPosition, setSheetPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const [isArchived, setArchived] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

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
          {" "}
          {/* Added margin to separate from image */}
          <FaArrowLeft
            className="main-color"
            size={20}
            onClick={() => {
              setSelectedChat(null);

              SocketService.socket.disconnect();
            }}
          />
        </div>

        {/* Profile Image */}
        <div className="position-relative" style={{ marginRight: "10px" }}>
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              backgroundImage: (() => {
                const participant = selectedChat?.participants
                  ?.filter(
                    (participant) =>
                      String(participant._id) !== String(user._id)
                  )
                  .find(
                    (participant) =>
                      participant.ProfilePicture || participant.AvatarColor
                  );

                return participant?.ProfilePicture
                  ? `url(${participant.ProfilePicture})`
                  : participant?.AvatarColor || "none";
              })(),

              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "30px",
              height: "30px",
              border: "1px solid #FFF",
              boxShadow: "none",
              backgroundColor:
                selectedChat?.participants
                  ?.filter(
                    (participant) =>
                      String(participant._id) !== String(user._id)
                  )
                  .find((participant) => participant.AvatarColor)
                  ?.AvatarColor || "black",
            }}
          >
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                color: "#FFF",
                fontSize: "10px",
              }}
            >
              {/* Show initials if no profilePic */}
              {(() => {
                const participant = selectedChat?.participants
                  ?.filter(
                    (participant) =>
                      String(participant._id) !== String(user._id)
                  )
                  .find((participant) => participant.UserName);

                return participant?.UserName
                  ? participant.UserName.split(" ")
                      .map((word) => word[0])
                      .join("")
                  : "N";
              })()}
            </div>
          </div>
        </div>

        {/* Name and phone */}
        <div className="flex-grow-1 d-flex flex-column align-items-start pl-2">
          <strong className="text-start w-100">
            {[
              ...new Set(
                selectedChat?.participants
                  ?.filter((participant) => {
                    return String(participant._id) !== String(user._id);
                  })
                  .map((participant) => participant.UserName)
              ),
            ].join(", ") || "Name"}
          </strong>
        </div>
      </div>
    </div>
  );
}
