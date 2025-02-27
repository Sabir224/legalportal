import React from "react";
import UserListWidget from "./UserListWidget"; // Ensure you have this component

const Sidebar = ({
  isVisible,
  isCompact,
  toggleSidebar,
  handleSearchChange,
  searchQuery,
  userData,
  setSelectedChat,
  loading,
}) => {
  if (!isVisible) return null; // Hide sidebar if not visible

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <input
          type="search"
          className="form-control p-2 my-1 rounded"
          placeholder="Search User"
          onChange={handleSearchChange}
          value={searchQuery}
        />
        <button
          className="btn btn-outline-secondary ms-2"
          onClick={toggleSidebar}
        >
          ✖
        </button>
      </div>

      <div
        style={{
          paddingTop: "10px",
          paddingBottom: "20px",
          fontSize: "1.1rem",
          maxHeight: "calc(82vh - 70px)",
          overflowY: "auto",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <UserListWidget
            setSelectedChat={setSelectedChat}
            userData={userData}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
