import React, { useEffect, useState } from "react";

export default function ViewUsers() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Update isMobile state on screen resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div
      className="p-0 m-0 d-flex position-relative"
      style={{
        height: "85vh",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* User List Widget */}
      <div
        className={`d-flex flex-column p-3 ${
          isMobile && selectedChat ? "d-none" : "d-block"
        }`}
        style={{
          width: isMobile ? "100%" : "200px",
          height: "82vh",
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "10px",
          transition: "margin-left 0.3s ease-in-out",
        }}
      >
        <input
          type="search"
          className="form-control p-2 my-2 rounded"
          placeholder="Search User"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="d-flex flex-column p-3 overflow-y-auto"></div>
      </div>

      {/* Chat Section */}
      <div
        className={`d-flex flex-column flex-grow-1 ${
          isMobile && !selectedChat ? "d-none" : "d-block"
        }`}
        style={{
          height: "82vh",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "10px",
          borderRadius: "10px",
          transition: "opacity 0.3s ease-in-out",
        }}
      ></div>
    </div>
  );
}
