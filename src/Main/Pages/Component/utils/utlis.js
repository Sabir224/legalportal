import { jwtDecode } from "jwt-decode";
import user from "../assets/icons/user.png";
import { Modal } from "react-bootstrap";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

import { toZonedTime, format, formatInTimeZone } from "date-fns-tz";
import { isToday, isYesterday, isThisWeek, parseISO } from "date-fns";
import { Cookies, useCookies } from "react-cookie";
import { createTheme, ThemeProvider } from "@mui/material/styles";
export const icons = {
  user: user,
};

export const convertName = (fullName) => {
  // Split the full name into first name and last name
  const nameParts = fullName.split(" ");
  const firstNameInitial = nameParts.length > 0 ? nameParts[0][0] : ""; // Initial letter of the first name
  const lastName = nameParts.slice(1).join(" "); // Last name (joining parts after first)

  // Construct the converted name
  const convertedName = `${firstNameInitial.toUpperCase()}. ${lastName}`;

  return convertedName;
};
export const messageTime = (time) => {
  const date = new Date(time);
  const timeDate = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return timeDate;
};

// Function to convert base64 to image URL
export const base64ToUrl = (base64String) => {
  if (!base64String) return null;
  return `data:image/jpeg;base64,${base64String}`;
};

export const splitSenderName = (fullName) => {
  const nameParts = fullName.split(" ");
  const firstName = nameParts.length > 0 ? nameParts[0] : ""; // First name

  // If the first name is longer than 9 characters, truncate it and add ".."
  const displayedFirstName =
    firstName.length > 9 ? firstName.substring(0, 7) + ".." : firstName;

  return displayedFirstName;
};

export const formatTimestamp = (
  timestamp,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  if (!timestamp) return ""; // Handle null or undefined cases

  // Convert timestamp to the specified timezone
  return formatInTimeZone(timestamp, timeZone, "hh:mm a");
};

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    // ✅ Use `addEventListener` instead of `addListener`
    mediaQuery.addEventListener("change", handler);

    return () => {
      // ✅ Use `removeEventListener` instead of `removeListener`
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
};
export const formatPhoneNumber = (value) => {
  if (!value) return "N/A";
  return value.startsWith("+") ? value : `+${value}`;
};

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400, // optional
    },
  },
});

// export const ApiEndPoint = "https://portal.aws-legalgroup.com/api/";
//export const ApiEndPoint = "https://awsrealestate.awschatbot.online/api/";
export const ApiEndPoint = "http://localhost:5001/api/";

// Utility function to decode JWT token and check its expiration time
export const decodeToken = (token) => {
  let currentTime;
  try {
    // Check if the token is a valid string before decoding
    if (typeof token !== "string" || token.trim() === "") {
      throw new Error("Invalid token specified: must be a string");
    }

    const decodedToken = jwtDecode(token);
    currentTime = Date.now() / 1000; // Convert current time to seconds
    const { exp } = decodedToken; // Expiration time of the token in seconds

    // Check if the token is expired
    const isExpired = exp < currentTime;

    return { decodedToken, isExpired };
  } catch (error) {
    console.error("Error decoding token:", error);
    return { decodedToken: null, isExpired: true }; // Return null if decoding fails
  }
};

export default function Warning({ isOpen, onClose, erorMessage }) {
  console.log("MEssages of error string", typeof erorMessage);
  return (
    <Modal show={isOpen} onHide={onClose} centered size="sm">
      {" "}
      <Modal.Header closeButton>
        <Modal.Title>Warnning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div> {erorMessage}</div>
      </Modal.Body>
    </Modal>
  );
}
export const getCookie = (name) => {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};
export const useDecodedToken = () => {
  const [cookies] = useCookies(["token"]); // Get token from cookies
  const token = cookies.token; // Extract the token

  if (!token) {
    console.error("No token found in cookies");
    return null;
  }

  try {
    const decoded = jwtDecode(token); // Decode the token
    return decoded; // Returns { id, email, Role, iat, exp }
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const formatMessageDate = (
  isoDate,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  if (!isoDate) return ""; // Handle null or undefined cases

  // Convert to the user's timezone
  const messageDate = toZonedTime(parseISO(isoDate), timeZone);

  if (isToday(messageDate)) {
    return "Today";
  } else if (isYesterday(messageDate)) {
    return "Yesterday";
  } else if (isThisWeek(messageDate, { weekStartsOn: 1 })) {
    return formatInTimeZone(messageDate, timeZone, "EEEE"); // "Monday", "Tuesday", etc.
  } else {
    return formatInTimeZone(messageDate, timeZone, "MMMM d, yyyy"); // "July 20, 2024"
  }
};
export const decodeAndValidateToken = (token) => {
  if (!token) return { isValid: false, decoded: null };

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Check expiration
    if (decoded.exp < currentTime) {
      Cookies.remove("token");
      return { isValid: false, decoded: null };
    }

    // Validate required fields
    if (!decoded._id || !decoded.email || !decoded.Role) {
      Cookies.remove("token");
      return { isValid: false, decoded: null };
    }

    return { isValid: true, decoded };
  } catch (error) {
    console.error("Invalid token:", error);
    Cookies.remove("token");
    return { isValid: false, decoded: null };
  }
};

export const logout = (navigate) => {
  Cookies.remove("token");
  navigate("/login"); // Adjust this to your login route
};
export const mondayLogoImage =
  "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";
// Example usage
