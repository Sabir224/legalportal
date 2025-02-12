// App.js
import React, { useEffect, useRef, useState } from "react";
import ChatList from "./components/ChatListComponent";
import ChatBox from "./components/ChatBoxComponent";
import SocketService from "../../../SocketService";
import { ApiEndPoint } from "../Component/utils/utlis";
import axios from "axios";

function ChatVat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [userId] = useState("67a4c17ab12c220e72bcf98d"); // Replace with actual user ID (could be from state or context)
  const storedEmail = sessionStorage.getItem("Email");
  const [userData, setUserData] = useState({});
  // Connect to the socket when the app loads
  const hasFetched = useRef(false); // Ref to track if data has been fetched

  useEffect(() => {
    console.log("StoredEmail:", storedEmail); // Debugging: Check email value
    if (storedEmail && !hasFetched.current) {
      const fetchClientDetails = async () => {
        try {
          const response = await axios.get(
            `${ApiEndPoint}/getUserDetail/${storedEmail}`
          );
          console.log("Fetched UserData:", response.data);
          setUserData(response.data); // Set the API response to state
          hasFetched.current = true; // Mark as fetched so it doesn't fetch again
        } catch (err) {
          console.error("Error fetching client details:", err);
        }
      };
      fetchClientDetails();
    }
  }, [storedEmail]); //Only re-run if storedEmail changes

  useEffect(() => {
    SocketService.connect(userData._id);
  }, [userData._id]);

  return (
    <div className="App">
      <div className="chat-container">
        <ChatList setSelectedChat={setSelectedChat} userData={userData} />
        {selectedChat && (
          <ChatBox selectedChat={selectedChat} userId={userData._id} />
        )}
      </div>
    </div>
  );
}

export default ChatVat;
