import React, { useEffect, useState, useRef } from "react";
import { BsCassette, BsFileArrowUp, BsPerson } from "react-icons/bs";
import PhoneInput from "react-phone-input-2";
import "bootstrap/dist/css/bootstrap.min.css";
// import "../Style/CSS.css";
import defaultProfilePic from "../../Component/assets/icons/person.png";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineAttachEmail } from "react-icons/md";
import Contactprofile from "../../Component/images/Asset 70mdpi.png";
import axios from "axios";
import { ApiEndPoint } from "../../Component/utils/utlis";
import { FaCamera, FaEdit, FaLock, FaChevronDown } from "react-icons/fa";
import { GrContactInfo } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../../REDUX/sliece";
import {
  Box,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Lock, Edit, ChevronDown } from "@mui/icons-material";
import { Dropdown } from "react-bootstrap";

const ViewUsersAdminWidget = ({ user, setSelectedChat }) => {
  const [profilePicBase64, setProfilePicBase64] = useState(null);

  const [selectedRole, setSelectedRole] = useState(user?.Role);
  const [editableFields, setEditableFields] = useState(false);
  const [isProfile, setIsProfile] = useState(true); // Controls profile section visibility
  const [showCaseSheet, setShowCaseSheet] = useState(false); // Controls master sheet visibility
  const [adminData, setAdminData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [pic, setPic] = useState(user?.profilePicture);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectfile, setselectfile] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [flaotingButton, setFlaotingButton] = useState(false);

  const dropdownRef = useRef(null);
  const nameInputRef = useRef(null);
  const userId = user?._id;
  const [show, setShow] = useState(false);
  const fileInputRef = useRef(null);
  // console.log("Profile Pic:", user.profilePicture);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleRoleSelect = (role) => {
    setSelectedRole(editableFields ? role : user?.Role);
    setDropdownOpen(editableFields ? null : false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Effect to handle admin data changes
  // Reset editableFields and hide case sheet when user changes
  useEffect(() => {
    if (user) {
      setIsProfile(true); // Always show profile on new user selection
      setShowCaseSheet(false); // Close master sheet
      setShow(true);
      fetchClientDetails();
    } else {
      setShow(false);
    }
  }, [user, setSelectedChat]);

  // Toggle between profile and master sheet
  const handleFloatingButtonClick = () => {
    if (isProfile) {
      setIsProfile(false); // Hide profile
      setShowCaseSheet(true); // Show master sheet
    } else {
      setIsProfile(true); // Show profile
      setShowCaseSheet(false); // Hide master sheet
    }
  };
  const fetchClientDetails = async () => {
    if (!user) return;

    try {
      let response;
      if (user.Role !== "client") {
        response = await axios.get(
          `${ApiEndPoint}geLawyerDetails/${user.Email}`
        );
        setUserDetails(response.data.lawyerDetails);
      } else {
        response = await axios.get(
          `${ApiEndPoint}getClientDetails/${user.Email}`
        );
        setUserDetails(response.data.clientDetails);
      }

      setAdminData({
        name: user?.UserName,
        email: user?.Email,
        password: user?.Password,
        phone: response.data?.Contact,
        profilePicture: user?.ProfilePicture,
      });
      setSelectedRole(user?.Role);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleFileInputUpdateChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      setselectfile(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        console.log("Base64:", base64String);
        setProfilePicBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  // Toggle edit mode
  const toggleEdit = () => {
    setEditableFields((prev) => !prev);
    if (!editableFields) {
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle file input change
  const handleFileInputChange = (event) => {
    if (!editableFields) return; // Prevent changes if fields are not editable

    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();

      // Read the file as a Base64 string
      reader.onload = () => {
        const base64StringWithMimeType = reader.result;
        setPic(base64StringWithMimeType);

        // Update admin data with the new profile picture
        setAdminData((prevData) => ({
          ...prevData,
          profilePicture: base64StringWithMimeType,
        }));
      };

      reader.readAsDataURL(file); // Start reading the file
    }
  };

  // Handle input change
  const handleChange = (e, field) => {
    if (e && e.target) {
      setAdminData((prevData) => ({ ...prevData, [field]: e.target.value }));
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value) => {
    setAdminData((prevData) => ({ ...prevData, phone: value }));
  };

  // Save changes
  const handleSave = async () => {
    console.log(adminData);

    const formData = new FormData();
    formData.append("UserName", adminData.name);
    formData.append("Contact", adminData.phone);
    if (adminData.password) formData.append("Password", adminData.password);

    formData.append("file", selectfile ? selectfile : null);

    // formData.append("file", adminData?.profilePicture ? adminData.profilePicture : null);

    if (user.Role !== "client") {
      if (selectedRole !== "client") {
        formData.append("Role", selectedRole);
        try {
          const response = await axios.put(
            `${ApiEndPoint}users/updateLawyerDetails/${user.Email}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } } // Set content type
          );

          // alert("Lawyer details updated successfully!");

          //   if (typeof handleEdting === "function") {
          //     handleEdting(); // Ensure `handleEdting` is defined before calling it
          //   }
          if (response.status === 200) {
            setAdminData(null);
            setSelectedChat(null);
            setShow(false);
          }
          console.log("Updated Data:", response.data);
        } catch (error) {
          console.error("Update failed:", error.response?.data || error);
          //   alert("Failed to update lawyer details.");
        }
      } else {
        alert("Please Select The Correct Role");
      }
    } else {
      try {
        const response = await axios.put(
          `${ApiEndPoint}users/updateClientDetails/${user.Email}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } } // Set content type
        );

        // alert("Lawyer details updated successfully!");
        //   if (typeof handleEdting === "function") {
        //     handleEdting(); // Ensure `handleEdting` is defined before calling it
        //   }
        if (response.status === 200) {
          setAdminData(null);
          setSelectedChat(null);
          setShow(false);
        }

        console.log("Updated Data:", response.data);
      } catch (error) {
        console.error("Update failed:", error.response?.data || error);
        //   alert("Failed to update lawyer details.");
      }
    }

    // await axios
    //     .put(`${ApiEndPoint}/updateLawyerDetails/${user.Email}`, adminData)
    //     .then((response) => {
    //         if (response.status === 200) {
    //             setAdminData(null);
    //             setEditableFields(false);
    //             setShow(false);
    //         }
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });
  };
  const handleProfilePicClick = () => {
    if (editableFields && fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };
  // Delete profile
  const handleDelete = async () => {
    await axios
      .delete(`${ApiEndPoint}/deleteUserByEmail/${user.Email}`)
      .then((response) => {
        if (response.status === 200) {
          setAdminData(null);
          setSelectedChat(null);
          setShow(false);
        }
        setEditableFields(false);
        setPic(true);
        // fetchClientDetails()
        // Mark as deleted to trigger cleanup
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const containerStyle = {
    position: "relative",
    display: "inline-block",
    width: "100px",
    height: "100px",
    marginTop: "20px",
  };

  const profilePicStyle = {
    width: "100%",
    height: "100%",
    border: "1px solid #d3b386",
    borderRadius: "50%",
    boxShadow: "#85929e 0px 2px 5px",
    backgroundImage: pic ? `url(${pic})` : `url(${Contactprofile})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#fff",
    position: "relative",
    overflow: "hidden",
  };

  const cameraOverlayStyle = {
    display: "none", // Hidden by default
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#d3b386",
    fontSize: "24px",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,

    // Center the icon within the overlay
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector(".camera-overlay").style.display = "flex";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector(".camera-overlay").style.display = "none";
  };

  const handleEdit = () => {
    setEditableFields(!editableFields);
  };

  // *****************************************     for case show ************************************//

  const [caseNumber, setCaseNumber] = useState("");
  const [caseName, setCaseName] = useState("");
  const [check, setcheck] = useState(true);
  const screen = useSelector((state) => state.screen.value);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const casesPerPage = 50; // Show 50 cases per page
  const [filters, setFilters] = useState({
    status: "All",
    caseType: "All",
    priority: "All",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  // console.log("_________Token:0", token.Role);

  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleOpenModal = (caseId) => {
    // console.log("CaseId:", caseId);
    setSelectedCase(caseId);
    setShowAssignModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedCase(null);
  };
  const [data, setData] = useState([]);
  // State to handle loading

  // Function to fetch cases

  const handleEditCase = (index, value) => {
    const updatedData = [...data];
    updatedData[index].notes = value;
    setData(updatedData);
  };
  // Fetch cases on component mount

  const handleClick = async (scr, item) => {
    // const newParams = { CaseId:item.CaseId };
    // dispatch(setParams(newParams));
    global.CaseId = item;
    console.log("  global.CaseId ", item._id);
    dispatch(screenChange(1));

    await setcheck(!check);
    //alert(`Clicked: ${item.name}`);
  };

  // const data = Array.from({ length: 150 }, (_, i) => ({
  //     id: i + 1,
  //     name: `Item ${i + 1}`,
  //   }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Number of items per page
  const [dropdownOpenCase, setDropdownOpenCase] = useState(null); // Track open dropdown index
  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get data for the current page
  // const handleSearch = (query) => {
  //   setSearchQuery(query);

  //   if (!query) {
  //     setFilteredData(data);
  //     return;
  //   }

  //   const lowerCaseQuery = query.toLowerCase();

  //   const filtered = data.filter(
  //     (item) =>
  //       item.CaseNumber.toLowerCase().includes(lowerCaseQuery) ||
  //       item.Name.toLowerCase().includes(lowerCaseQuery) ||
  //       item.Status.toLowerCase().includes(lowerCaseQuery)
  //   );

  //   setFilteredData(filtered);
  // };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };
  const getFilteredCases = () => {
    let filteredCases = data;

    // Apply search filter across multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredCases = filteredCases.filter((item) =>
        Object.entries(item).some(([key, value]) => {
          // Skip non-string fields or fields you don't want to search
          if (
            typeof value !== "string" ||
            ["_id", "createdAt", "updatedAt"].includes(key)
          ) {
            return false;
          }
          return value.toLowerCase().includes(query);
        })
      );
    }

    // Apply other filters (status, caseType, priority)...
    if (filters.status && filters.status !== "All") {
      filteredCases = filteredCases.filter(
        (item) => item.Status === filters.status
      );
    }

    if (filters.caseType && filters.caseType !== "All") {
      filteredCases = filteredCases.filter(
        (item) => item.Name === filters.caseType
      );
    }

    if (filters.priority && filters.priority !== "All") {
      filteredCases = filteredCases.filter(
        (item) => item.Priority === filters.priority
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredCases.sort((a, b) => {
        if (filters.sortOrder === "asc") {
          return a[filters.sortBy] > b[filters.sortBy] ? 1 : -1;
        } else {
          return a[filters.sortBy] < b[filters.sortBy] ? 1 : -1;
        }
      });
    }

    return filteredCases;
  };
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // const fetchCases = async () => {
  //     try {
  //         const response = await axios.get(`${ApiEndPoint}getcase`, {
  //             withCredentials: true,
  //         }); // API endpoint
  //         console.log("data of case", response.data.data); // Assuming the API returns data in the `data` field
  //         setData(response.data.data);
  //         setLoading(false);
  //     } catch (err) {
  //         setError(err.message);
  //         setLoading(false);
  //     }
  // };

  // useEffect(() => {
  //     fetchCases();
  // }, []);

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${ApiEndPoint}getcase`, {
        withCredentials: true,
      });

      const allCases = response.data.data;
      let filteredCases = [];

      if (user.Role?.toLowerCase() === "client") {
        // Show only client's own cases
        filteredCases = allCases.filter(
          (caseItem) => caseItem.ClientId === user._id
        );
      } else if (user.Role?.toLowerCase() === "admin") {
        // Admin sees all cases
        filteredCases = allCases;
      } else {
        // Legal users: show only assigned cases
        filteredCases = allCases.filter((caseItem) =>
          caseItem.AssignedUsers?.some(
            (user) => user.UserId?.toString() === user._id?.toString()
          )
        );
      }

      await setData(filteredCases);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Token received in useEffect:", user);
    if (user && user._id && user.Role) {
      fetchCases();
    }
  }, [user]);
  // // Handle page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  useEffect(() => {
    setFilteredData(data);
  }, [data]); // Sync `filteredData` when `data` changes

  // Function to fetch and parse the Excel file

  // Load the file automatically when the component mounts
  useEffect(() => {
    //  loadExcelFile();
  }, []);

  const handleAddCase = () => {
    dispatch(screenChange(11));
  };

  return (
    <center
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        boxShadow: "5px 5px 5px gray",
        overflowY: "auto",
        scrollbarWidth: "thin", // For Firefox
        scrollbarColor: "#d2a85a #16213e",
        padding: "30px",
      }}
    >
      {/* Close Button at the Top Level */}
      {show === true && (
        <button
          title="Close"
          onClick={() => {
            setAdminData(null);
            setShow(false);
            setSelectedChat(null);
          }}
          style={{
            position: "absolute",
            top: "0px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#d3b386",
          }}
        >
          &times;
        </button>
      )}

      {show === true ? (
        <div>
          {isProfile && (
            <div
              style={{
                width: "100%",
                maxWidth: "500px",
                position: "relative",
                margin: "0 auto",
                padding: "0 15px",
              }}
            >
              <div className="mb-3 text-center avatar-container">
                <label htmlFor="profilePicInput">
                  <img
                    src={
                      user?.ProfilePicture
                        ? profilePicBase64
                          ? `data:image/jpeg;base64,${profilePicBase64}`
                          : user?.ProfilePicture
                        : defaultProfilePic
                    }
                    alt="Profile"
                    style={{
                      border: "2px solid #d4af37",
                      padding: "3px",
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      border: "1px solid #18273e",
                      boxShadow: "#18273e 0px 2px 5px",
                      cursor: "pointer",
                    }}
                    className="avatar-img img-fluid"
                    onClick={() =>
                      document.getElementById("profilePicUpdate").click()
                    }
                  />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="profilePicUpdate"
                  onChange={handleFileInputUpdateChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* Edit Icon */}
              <div className="text-center mb-3">
                {editableFields ? (
                  <FaLock
                    onClick={handleEdit}
                    style={{
                      cursor: "pointer",
                      color: "#d3b386",
                      fontSize: "1.2rem",
                    }}
                  />
                ) : (
                  <FaEdit
                    onClick={handleEdit}
                    style={{
                      cursor: "pointer",
                      color: "#d3b386",
                      fontSize: "1.2rem",
                    }}
                  />
                )}
              </div>

              {/* Form Fields */}
              <div className="d-flex flex-column gap-3">
                {/* Name Field */}
                <div>
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      fontSize: "0.9rem",
                      color: "#18273e",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    Name
                  </label>
                  <div className="input-group bg-soft-light rounded-2">
                    <span className="input-group-text">
                      <BsPerson />
                    </span>
                    <input
                      style={{
                        borderColor: "#18273e",
                        boxShadow: "none",
                        fontSize: "0.9rem",
                      }}
                      className="form-control"
                      value={adminData?.name}
                      onChange={(e) => handleChange(e, "name")}
                      id="Name"
                      name="username"
                      placeholder="Enter Name"
                      type="text"
                      title="Please Enter Client Name"
                      required
                      readOnly={!editableFields}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d3b386";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#18273e";
                      }}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      fontSize: "0.9rem",
                      color: "#18273e",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    Email
                  </label>
                  <div className="input-group bg-soft-light rounded-2">
                    <span className="input-group-text">
                      <MdOutlineAttachEmail />
                    </span>
                    <input
                      style={{
                        borderColor: "#18273e",
                        boxShadow: "none",
                        fontSize: "0.9rem",
                      }}
                      className="form-control"
                      value={adminData?.email}
                      onChange={(e) => handleChange(e, "email")}
                      id="Email"
                      name="email"
                      placeholder="Enter Email"
                      type="email"
                      title="Please Enter Client Email"
                      required
                      readOnly={!editableFields}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d3b386";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#18273e";
                      }}
                      disabled={true}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      fontSize: "0.9rem",
                      color: "#18273e",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    Phone
                  </label>
                  <div style={{ width: "100%" }}>
                    <PhoneInput
                      country={"us"}
                      value={adminData?.phone}
                      onChange={handlePhoneChange}
                      disabled={!editableFields}
                      inputStyle={{
                        width: "100%",
                        border: "1px solid #18273e",
                        boxShadow: "none",
                        height: "38px",
                        fontSize: "0.9rem",
                      }}
                      containerStyle={{
                        width: "100%",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d3b386";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#18273e";
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      fontSize: "0.9rem",
                      color: "#18273e",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    Password
                  </label>
                  <div className="input-group bg-soft-light rounded-2">
                    <span className="input-group-text">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      style={{
                        borderColor: "#18273e",
                        boxShadow: "none",
                        fontSize: "0.9rem",
                      }}
                      className="form-control"
                      value={adminData?.password}
                      onChange={(e) => handleChange(e, "password")}
                      id="Password"
                      name="password"
                      placeholder="Enter Password"
                      type="password"
                      title="Please Enter Client Password"
                      required
                      readOnly={!editableFields}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d3b386";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#18273e";
                      }}
                    />
                  </div>
                </div>

                {/* Role Field */}
                <div className="mb-3">
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      color: "#18273e",
                      fontSize: "0.9rem",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    Role
                  </label>
                  <div className="input-group">
                    <div className="position-relative w-100" ref={dropdownRef}>
                      <div
                        className="form-control d-flex align-items-center justify-content-between"
                        style={{
                          cursor: "pointer",
                          border: "1px solid #18273e",
                          color: "#18273e",
                          fontSize: "0.9rem",
                          height: "38px",
                        }}
                        onClick={toggleDropdown}
                      >
                        {selectedRole || "Select Role"} <FaChevronDown />
                      </div>
                      {dropdownOpen && (
                        <ul
                          className="list-group position-absolute bg-dark border rounded shadow w-100 mt-1"
                          style={{ zIndex: 1000 }}
                        >
                          {["Client", "Lawyer", "Finance", "Receptionist"].map(
                            (role) => (
                              <li
                                key={role}
                                className="list-group-item list-group-item-action text-white bg-dark border-secondary"
                                style={{
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                }}
                                onClick={() => handleRoleSelect(role)}
                              >
                                {role}
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save and Delete Buttons */}
              {editableFields && (
                <div
                  className="d-flex justify-content-between gap-3 mt-3"
                  style={{
                    width: "100%",
                  }}
                >
                  <button
                    onClick={handleSave}
                    className="btn"
                    style={{
                      flex: 1,
                      color: "white",
                      background: "#18273e",
                      height: "40px",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: 500,
                    }}
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDelete}
                    className="btn"
                    style={{
                      flex: 1,
                      color: "white",
                      background: "#d3b386",
                      height: "40px",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: 500,
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}{" "}
          {showCaseSheet && (
            <div className="card mb-3 shadow">
              {/* Table Header - Hidden on mobile */}
              <div className="card-header d-none d-md-flex justify-content-between align-items-center px-3">
                <span className="col text-start">Status</span>
                <span className="col text-start">Case Number</span>
                <span className="col text-start">Request Number</span>
                <span className="col text-start">Case Type</span>
                <span className="col text-start">Purpose</span>
                <span className="col text-end">Action</span>
              </div>
              {/* Table Body */}
              <div className="card-body p-0">
                {getFilteredCases()
                  .slice(
                    (currentPage - 1) * casesPerPage,
                    currentPage * casesPerPage
                  )
                  .map((item, index) => (
                    <div key={index} className="border-bottom">
                      {/* Mobile View */}
                      <div
                        className="d-md-none p-3"
                        style={{
                          overflowX: "hidden",
                          maxWidth: "100%",
                          maxHeight: "83vh",
                        }}
                      >
                        {/* Status and Actions Row */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`rounded-circle ${
                                item.Status.toLowerCase() === "case filed"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                              style={{
                                width: "12px",
                                height: "12px",
                                minWidth: "12px",
                              }}
                            />
                            <span className="badge bg-light text-dark">
                              {item.Status}
                            </span>
                          </div>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="light"
                              size="sm"
                              className="rounded-circle p-0 border"
                              style={{
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) => {
                                  if (
                                    e.target.tagName !== "INPUT" &&
                                    e.target.tagName !== "BUTTON"
                                  ) {
                                    handleClick(1, item);
                                  }
                                }}
                              >
                                View Details
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        {/* Data Fields */}
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex flex-wrap">
                            <span
                              className="text-muted me-2"
                              style={{
                                minWidth: "80px",
                                wordBreak: "break-word",
                              }}
                            >
                              Case #:
                            </span>
                            <span className="fw-medium">
                              {item["CaseNumber"]}
                            </span>
                          </div>

                          <div className="d-flex flex-wrap">
                            <span
                              className="text-muted me-2"
                              style={{
                                minWidth: "80px",
                                wordBreak: "break-word",
                              }}
                            >
                              Request #:
                            </span>
                            <span className="fw-medium">
                              {item["SerialNumber"]}
                            </span>
                          </div>

                          <div className="d-flex flex-wrap">
                            <span
                              className="text-muted me-2"
                              style={{
                                minWidth: "80px",
                                wordBreak: "break-word",
                              }}
                            >
                              Type:
                            </span>
                            <span className="fw-medium">
                              {item["CaseType"]}
                            </span>
                          </div>

                          <div>
                            <div className="text-muted mb-1">Purpose:</div>
                            <input
                              className="form-control form-control-sm"
                              value={item.notes || ""}
                              onChange={(e) =>
                                handleEdit(index, e.target.value)
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Desktop View - Horizontal Layout */}
                      <div
                        className="d-none d-md-flex justify-content-between align-items-center p-3"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          if (
                            e.target.tagName !== "INPUT" &&
                            e.target.tagName !== "BUTTON"
                          ) {
                            handleClick(1, item);
                          }
                        }}
                      >
                        <span className="col d-flex align-items-center text-start">
                          <span
                            className={`me-2 rounded-circle ${
                              item.Status.toLowerCase() === "case filed"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                            style={{
                              width: "10px",
                              height: "10px",
                              display: "inline-block",
                            }}
                          ></span>
                          {item.Status}
                        </span>
                        <span className="col d-flex align-items-center text-start">
                          {item["CaseNumber"]}
                        </span>
                        <span className="col d-flex align-items-center text-start">
                          {item["SerialNumber"]}
                        </span>
                        <span className="col d-flex align-items-center text-start">
                          {item["CaseType"]}
                        </span>
                        <input
                          className="col form-control"
                          type="text"
                          value={item.notes || ""}
                          onChange={(e) => handleEdit(index, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        {/* Permission Dropdown */}
                        <div className="col text-end">
                          <Dropdown
                            show={dropdownOpen === index}
                            onToggle={(isOpen) =>
                              setDropdownOpen(isOpen ? index : null)
                            }
                          >
                            <Dropdown.Toggle
                              variant="custom"
                              size="sm"
                              className="custom-dropdown-toggle"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(
                                  dropdownOpen === index ? null : index
                                );
                              }}
                            ></Dropdown.Toggle>

                            <Dropdown.Menu>
                              <Dropdown.Item>View Details</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pagination - Responsive */}
              {totalPages > 1 && (
                <div className="p-3">
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: "#18273e",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #d4af37",
                      margin: "auto",
                      maxWidth: "100%",
                      width: "fit-content",
                    }}
                  >
                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-outline-warning"
                      >
                        Previous
                      </button>
                      <div className="d-flex align-items-center">
                        <span className="text-white me-2 d-none d-sm-block">
                          Page
                        </span>
                        <input
                          value={currentPage}
                          min={1}
                          max={totalPages}
                          onChange={(e) =>
                            goToPage(
                              Math.max(
                                1,
                                Math.min(totalPages, Number(e.target.value))
                              )
                            )
                          }
                          className="form-control text-center"
                          style={{
                            width: "60px",
                            border: "2px solid #d4af37",
                            backgroundColor: "#18273e",
                            color: "white",
                          }}
                        />
                        <span className="text-white ms-2 d-none d-sm-block">
                          of {totalPages}
                        </span>
                      </div>
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-outline-warning"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Empty Screen when show is false
        <div className="gap-3 text-center d-flex flex-column justify-content-center align-items-center h-100 w-100">
          <GrContactInfo className="fs-1" />
          <div>
            <h4>Admin Detail</h4>
            <p>Click any Admin to view details</p>
          </div>
        </div>
      )}

      {!editableFields && (
        <button
          onClick={handleFloatingButtonClick}
          title={showCaseSheet ? "Hide Cases" : "View Cases"}
          style={{
            backgroundColor: "#f4e9d8",
            color: "#18273e",
            border: "1px solid #d3b386",
            borderRadius: "20%",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
            display: "flex",
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.0rem",
            cursor: "pointer",
          }}
        >
          {showCaseSheet ? "Hide Cases" : "View Cases"}
        </button>
      )}
    </center>
  );
};

export default ViewUsersAdminWidget;
