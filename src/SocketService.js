/* eslint-disable import/no-anonymous-default-export */
// services/SocketService.js
import { io } from "socket.io-client";

const ApiBase = "https://awsrealestate.awschatbot.online"; // Use this for production
//const ApiBase = "http://localhost:5001"; // Use this for local testing

const socket = io(ApiBase, {
  transports: ["websocket"], // Force WebSocket connection
  autoConnect: false, // Prevent auto-connecting
});

// Connect function
// const connect = (chatId, userId) => {
//   if (!chatId || !userId) {
//     console.error("Missing parameters:", { chatId, userId });
//     return;
//   }

//   console.log("Received chatId:", chatId);
//   console.log("Received userId:", userId);
//   console.log("Socket connected:", socket.connected);

//   if (!socket.connected) {
//     socket.connect();

//     socket.on("connect", () => {
//       console.log("Socket connected successfully.");
//       socket.emit("joinChat", { chatId, userId });
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected.");
//     });

//     socket.on("connect_error", (err) => {
//       console.error("Connection Error:", err);
//     });
//   }
// };
const connect = (userId) => {
  if (!userId) {
    console.error("Missing parameters:", { userId });
    return;
  }

  console.log("Received userId:", userId);

  if (!socket.connected) {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected successfully.");
      socket.emit("connectUser", { userId });
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected.");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err);
    });
  } else {
    socket.emit("connectUser", { userId });
  }
};

// Function to join the chat after connection is established
const joinChat = (chatId, userId) => {
  if (!socket.connected) {
    console.warn("⚠️ Socket is not connected yet. Trying to connect first...");
    connect(chatId, userId);

    socket.once("connect", () => {
      console.log("✅ Now joining chat after connection...");
      socket.emit("joinChat", { chatId, userId });
    });
  } else {
    console.log("✅ Joining chat directly...");
    socket.emit("joinChat", { chatId, userId });
  }
};

// Send message
const sendMessage = (messageData) => {
  if (socket.connected) {
    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);
  } else {
    console.error("sendMessage: Socket is not connected.");
  }
};

// Send file
const sendFile = (fileData) => {
  if (socket.connected) {
    console.log("Sending file:", fileData);
    socket.emit("sendFile", fileData);
  } else {
    console.error("sendFile: Socket is not connected.");
  }
};

const sendTyping = (chatId, userId) => {
  if (socket.connected) {
    console.log("Sending typing event:", { chatId, userId });
    socket.emit("typing", { chatId, userId });
  } else {
    console.error("sendTyping: Socket is not connected.");
  }
};

const stopTyping = (chatId, userId) => {
  if (socket.connected) {
    console.log("Sending stopTyping event:", { chatId, userId });
    socket.emit("stopTyping", { chatId, userId });
  } else {
    console.error("stopTyping: Socket is not connected.");
  }
};

// Event listeners (ensure they only register once)
const onUserTyping = (callback) => {
  socket.off("userTyping"); // Remove previous listener to prevent duplication
  socket.on("userTyping", callback);
};

const onUserStopTyping = (callback) => {
  socket.off("userStopTyping");
  socket.on("userStopTyping", callback);
};

const onNewMessage = (callback) => {
  socket.off("newMessage"); // Remove previous listener
  socket.on("newMessage", callback);
};
const markAsRead = (chatId, userId) => {
  if (socket.connected) {
    console.log("markAsRead", chatId, userId);
    socket.emit("markAsRead", { chatId, userId });
  } else {
    console.log("markAsRead: Not connected yet ");
  }
};
const markAsDelivered = (userId) => {
  if (socket.connected) {
    console.log("markAsDelivered", userId);
    socket.emit("markAsDelivered", { userId });
  } else {
    console.log("markAsDelivered: Not connected yet ");
  }
};
const onMessageRead = (callback) => {
  socket.off("messagesRead");
  socket.on("messagesRead", (data) => {
    console.log("📩 Received messagesRead event:", data);
    callback(data);
  });
};

const onMessageDelivered = (callback) => {
  socket.off("messagesDelivered");
  socket.on("messagesDelivered", (data) => {
    console.log("📨 Received messagesDelivered event:", data);
    callback(data);
  });
};
//----- Socket functions for appointment
const bookAppointment = (update) => {
  console.log("BOOK Appointment", update);
  if (socket.connected) {
    socket.emit("appointmentBooked", update);
  } else {
    console.log("Socket Not Connected_____________");
  }
};
const onBookAppointment = (callback) => {
  socket.off("slotHasBooked");
  socket.on("slotHasBooked", (data) => {
    console.log("📨 Received slotHasBooked event:", data);
    callback(data);
  });
};

// Export functions

export default {
  socket,
  connect,
  sendMessage,
  sendTyping,
  stopTyping,
  sendFile,
  onNewMessage,
  onUserTyping,
  onUserStopTyping,
  markAsRead,
  markAsDelivered,
  onMessageDelivered,
  onMessageRead,
  joinChat,
  bookAppointment,
  onBookAppointment,
};
