import React, { useEffect, useState } from "react";
// import UsersAdminUserListWidget from "./widgets/UsersAdminUserListWidget";
// import ViewUsersAdminWidget from "./widgets/ViewUsersAdminWidget";
import { useMediaQuery } from "react-responsive";
import { GrContactInfo } from "react-icons/gr";
import UsersAdminUserListWidget from "../AddUsers/widgets/UsersAdminUserListWidget";
import ViewUsersAdminWidget from "../AddUsers/widgets/ViewUsersAdminWidget";

export default function ViewClient({ token }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Update isMobile state on screen resize
  useEffect(() => {
    // console.log("currenScreen", screen.type.name)
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = useMediaQuery({ minWidth: 992 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
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
        className={`d-flex flex-column p-3 ${isMobile && selectedChat ? "d-none" : "d-block"
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
        <div className="d-flex flex-column p-3 overflow-y-auto">
          <UsersAdminUserListWidget
            setSelectedChat={(chat) => setSelectedChat(chat)}
            userData={token}
            searchQuery={searchQuery}
            token={token}
            screen={"ViewClient"}

          />
        </div>
      </div>

      {/* Chat Section */}
      <div
        className={`d-flex flex-column flex-grow-1 ${isMobile && !selectedChat ? "d-none" : "d-block"
          }`}
        style={{
          height: "82vh",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          margin: "10px",
          borderRadius: "10px",
          transition: "opacity 0.3s ease-in-out",
        }}
      >

        {selectedChat ? (
          <ViewUsersAdminWidget user={selectedChat} setSelectedChat={setSelectedChat} />
        ) : (
          <div
            className="gap-3 text-center d-flex flex-column justify-content-center align-items-center h-100 w-100"
            style={{
              padding: isDesktop ? "2rem" : isTablet ? "1rem" : "0.5rem",
            }}
          >
            <GrContactInfo
              className={isDesktop ? "fs-1" : isTablet ? "fs-2" : "fs-3"}
            />
            <div>
              <h4
                style={{
                  fontSize: isDesktop
                    ? "1.75rem"
                    : isTablet
                      ? "1.5rem"
                      : "1.25rem",
                }}
              >
                Admin Detail
              </h4>
              <p
                style={{
                  fontSize: isDesktop ? "1rem" : isTablet ? "0.9rem" : "0.8rem",
                }}
              >
                Click any Admin to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
