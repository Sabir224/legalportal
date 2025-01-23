import SheetComponent from "./SheetCompoent"; // Import the SheetComponent
import checkboxStyle from "./assets/checkBoxStyle.module.css";
import axios from "axios";
import deleteicon from "./images/deleteIcon.png";
import filterIcon from "./images/filtterIcon.png";

import React, { useState, useEffect } from "react";
import { ApiEndPoint } from "./utils/utlis";

const UserSelection = ({
  searchTerm,
  handleSearchChange,
  selectedUsers,
  handleCheckboxChange,
  users,
  onDeleteUser,
}) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
    );

    setFilteredUsers(filteredUsers);
  }, [searchTerm, users]);

  const showDetails = (details) => {
    setSelectedDetails(details);
    setShowSheet(true);
  };

  const hideDetails = () => {
    setSelectedDetails(null);
    setShowSheet(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${ApiEndPoint}/deleteuser/${userId}`
      );

      if (response.status === 200) {
        console.log("User deleted successfully");
        await onDeleteUser(userId);
      } else {
        console.log("Unexpected status code:", response.status);
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };
  // insert Template Messsage
  const insertTemplateMessage = async (TemplateName, MessageBody) => {
    try {
      const responce = axios.post(`${ApiEndPoint}//createTemplate$`);
    } catch (error) {}
  };
  // const handleDeleteUsers = async () => {
  //   try {
  //     const selectedUserIds = selectedUsers.map((user) => user.id);
  //     await Promise.all(
  //       selectedUserIds.map(async (userId) => {
  //         const response = await axios.delete(`https://awschatbot.online/deleteuser/${userId}`);

  //         if (response.status === 200) {
  //           console.log('Users deleted successfully');

  //           const filteredUsers = users.filter((user) => userId !== user.id);
  //           await onDeleteUser(userId);
  //           setFilteredUsers(filteredUsers);

  //           const selectUsers = users.filter((user) => userId !== user.id);
  //           setFilteredUsers(selectUsers);

  //         } else {
  //           console.log('Unexpected status code:', response.status);
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     console.error('Error deleting users:', error.message);
  //   }
  // };
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  const handleOutsideClick = (e) => {
    const dropdownContainer = document.getElementById(
      "filterDropdownContainer"
    );
    if (dropdownContainer && !dropdownContainer.contains(e.target)) {
      setFilterDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const [filterOptions, setFilterOptions] = useState({});

  const handleFilterOptionClick = (option, column) => {
    // Implement your logic for handling filter options
    console.log(`Filter option clicked: ${option} for column: ${column}`);
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [column]: {
        ...prevOptions[column],
        [option]: !prevOptions[column]?.[option], // Toggle the filter option
      },
    }));
  };

  const handleCheckbox = (option, column) => {
    // Handle checkbox change for selecting/deselecting options
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [column]: {
        ...prevOptions[column],
        [option]: !prevOptions[column]?.[option], // Toggle the filter option
      },
    }));
  };

  const applyFilters = () => {
    const filteredUsers = [...users];

    // Apply filters for each column
    Object.keys(filterOptions).forEach((column) => {
      switch (column) {
        case "phone":
          if (filterOptions[column]?.ascending) {
            // Sort in ascending order, handling null values
            filteredUsers.sort((a, b) =>
              (a.phone || "").localeCompare(b.phone || "")
            );
          } else if (filterOptions[column]?.descending) {
            // Sort in descending order, handling null values
            filteredUsers.sort((a, b) =>
              (b.phone || "").localeCompare(a.phone || "")
            );
          }
          // Add more cases for other filter options as needed
          break;

        // Add cases for other columns as needed

        default:
          break;
      }
    });

    // Set the filtered users in your state or update your UI accordingly
    setFilteredUsers(filteredUsers);
  };

  const handleFilter = (column) => {
    // Remove previous selected options when clicking on a column
    setSelectedColumns([column]);

    // Update the filter options for the selected column
    setFilterOptions({
      [column]: {},
    });
  };

  return (
    <div className={checkboxStyle.userSelectionContainer}>
      <div className="container-fluid">
        <div className={checkboxStyle["search-upload-container"] + " row"}>
          <div className="col-12 col-md-12 col-sm-12">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={checkboxStyle.inputField}
            />
          </div>
        </div>

        <div className={checkboxStyle.userList}>
          <table>
            <thead>
              <tr>
                <th>
                  Select
                  {/* Your existing dropdown code */}
                </th>
                <th>
                  Name
                  <div className={checkboxStyle["filter-container"]}>
                    <div
                      id={checkboxStyle.filterNameDropdownContainer}
                      className={checkboxStyle["filter-dropdown-container"]}
                      onClick={() => handleFilter("name")}
                    >
                      <div className={checkboxStyle["filter-icon"]}>
                        <img
                          alt="Filter"
                          src={filterIcon}
                          width={15}
                          height={15}
                          className="ms-2"
                        ></img>
                      </div>
                      <div
                        className={`${checkboxStyle["filter-dropdown"]} ${
                          checkboxStyle.filterDropdownVisible
                            ? checkboxStyle.active
                            : ""
                        }`}
                      >
                        {/* Add filter options for the 'name' column */}
                        <div onClick={() => handleFilterOptionClick("option1")}>
                          Option 1
                        </div>
                        <div onClick={() => handleFilterOptionClick("option2")}>
                          Option 2
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
                <th>
                  Phone
                  <div className={checkboxStyle["filter-container"]}>
                    <div
                      id={checkboxStyle["filterPhoneDropdownContainer"]}
                      className={checkboxStyle["filter-dropdown-container"]}
                      onClick={() => handleFilter("phone")}
                    >
                      <div className={checkboxStyle["filter-icon"]}>
                        <img
                          alt="Filter"
                          src={filterIcon}
                          width={15}
                          height={15}
                          className="ms-2"
                        ></img>
                      </div>
                      <div
                        className={`${checkboxStyle["filter-dropdown"]} ${
                          filterDropdownVisible ? "active" : ""
                        }`}
                      >
                        {/* Add filter options for the 'phone' column */}
                        <div>
                          <input
                            type="checkbox"
                            id={checkboxStyle["ascendingPhoneCheckbox"]}
                            checked={filterOptions["phone"]?.["ascending"]}
                            onChange={() =>
                              handleCheckbox("ascending", "phone")
                            }
                          />
                          <label htmlFor="ascendingPhoneCheckbox">
                            Ascending
                          </label>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            id={checkboxStyle["descendingPhoneCheckbox"]}
                            checked={filterOptions["phone"]?.["descending"]}
                            onChange={() =>
                              handleCheckbox("descending", "phone")
                            }
                          />
                          <label htmlFor="descendingPhoneCheckbox">
                            Descending
                          </label>
                        </div>
                        <div>
                          <button onClick={applyFilters}>Apply Filter</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </th>
                <th>
                  Followup Status
                  <span
                    className={checkboxStyle["filter-icon"]}
                    onClick={() => handleFilter("followup")}
                  >
                    <i className="fas fa-filter"></i>
                  </span>
                </th>
                <th>
                  Messages
                  <span
                    className={checkboxStyle["filter-icon"]}
                    onClick={() => handleFilter("messages")}
                  >
                    <i className="fas fa-filter"></i>
                  </span>
                </th>
                <th>
                  Selected Details
                  <span
                    className={checkboxStyle["filter-icon"]}
                    onClick={() => handleFilter("selectedDetails")}
                  >
                    <i className="fas fa-filter"></i>
                  </span>
                </th>
                <th>
                  Action
                  <span
                    className={checkboxStyle["filter-icon"]}
                    onClick={() => handleFilter("action")}
                  >
                    <i className="fas fa-filter"></i>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={
                    selectedUsers.some(
                      (selectedUser) => selectedUser.id === user.id
                    )
                      ? "selectedRow"
                      : ""
                  }
                >
                  <td>
                    <input
                      type="checkbox"
                      id={`userCheckbox_${user.id}`}
                      checked={selectedUsers.some(
                        (selectedUser) => selectedUser.id === user.id
                      )}
                      onChange={() => handleCheckboxChange(user)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.followupStatus}</td>
                  <td>
                    <button
                      className={checkboxStyle["ShowMessage"]}
                      onClick={() => showDetails(user.id)}
                    >
                      Show Messages
                    </button>
                  </td>
                  <td>{user.selectedDetails}</td>
                  <td>
                    <img
                      className={checkboxStyle.deleteIcon}
                      alt="Delete"
                      src={deleteicon}
                      onClick={() => handleDeleteUser(user.id)}
                    ></img>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSheet && (
        <SheetComponent text={selectedDetails} onClose={hideDetails} />
      )}
    </div>
  );
};

export default UserSelection;
