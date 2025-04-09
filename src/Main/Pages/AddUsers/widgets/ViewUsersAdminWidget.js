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

const ViewUsersAdminWidget = ({ user, setSelectedChat }) => {
    const [profilePicBase64, setProfilePicBase64] = useState(null);
    const [selectedRole, setSelectedRole] = useState(user?.Role);
    const [editableFields, setEditableFields] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [pic, setPic] = useState(user?.profilePicture);
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState("");
    const [selectfile, setselectfile] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [flaotingButton, setFlaotingButton] = useState(false);
    const [isProfile, setProfile] = useState(true)
    const dropdownRef = useRef(null);
    const nameInputRef = useRef(null);
    const userId = user._id;
    const [show, setShow] = useState(false); // Set default state to true for testing
    const fileInputRef = useRef(null);
    // console.log("Profile Pic:", user.profilePicture);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const handleRoleSelect = (role) => {
        setSelectedRole(editableFields ? role : user?.Role)
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
    console.log("view user admin widget", user)
    useEffect(() => {
        let user_details = fetchClientDetails()
        if (user) {
            setPic(user?.ProfilePicture);

            setEditableFields(false);
            setShow(true);
        } else {
            setShow(false);
        }

        // Disable editing when data changes
    }, [user]);

    const fetchClientDetails = async () => {
        if (user.Role !== "client") {
            try {
                const response = await axios.get(
                    `${ApiEndPoint}geLawyerDetails/${user.Email}`
                ); // API endpoint
                await setUserDetails(response.data.lawyerDetails);
                setLoading(false);
                setAdminData({
                    name: user?.UserName,
                    email: user?.Email,
                    password: user?.Password,
                    phone: response.data.lawyerDetails?.Contact,
                    profilePicture: user?.ProfilePicture,
                });
                setSelectedRole(user?.Role)
                console.log("view user adminData widget", adminData)

                return response.data.lawyerDetails
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        } else {
            try {
                const response = await axios.get(
                    `${ApiEndPoint}getClientDetails/${user.Email}`
                ); // API endpoint
                await setUserDetails(response.data.clientDetails);
                console.log("response.data        =", response.data)
                setLoading(false);
                setAdminData({
                    name: user?.UserName,
                    email: user?.Email,
                    password: user?.Password,
                    phone: response.data.clientDetails?.Contact,
                    profilePicture: user?.ProfilePicture,
                });
                setSelectedRole(user?.Role)
                return response.data.lawyerDetails
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
    }


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
        console.log(adminData)





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
                        setSelectedChat(null)
                        setShow(false);
                    }
                    console.log("Updated Data:", response.data);
                } catch (error) {
                    console.error("Update failed:", error.response?.data || error);
                    //   alert("Failed to update lawyer details.");
                }
            } else {
                alert("Please Select The Correct Role")
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
                    setSelectedChat(null)
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
                    setSelectedChat(null)
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

    const handleFloatingButtonClick = () => {
        // Whatever you want to do on button click
        // console.log("Floating button clicked!");
        setFlaotingButton(!flaotingButton)
        setProfile(!isProfile)
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

        // Apply search filter
        if (searchQuery) {
            filteredCases = filteredCases.filter((item) =>
                item.CaseNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (filters.status && filters.status !== "All") {
            filteredCases = filteredCases.filter(
                (item) => item.Status === filters.status
            );
        }

        // Apply case type filter
        if (filters.caseType && filters.caseType !== "All") {
            filteredCases = filteredCases.filter(
                (item) => item.Name === filters.caseType
            );
        }

        // Apply priority filter
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

        // Apply pagination
        const startIndex = (currentPage - 1) * casesPerPage;
        const paginatedCases = filteredCases.slice(
            startIndex,
            startIndex + casesPerPage
        );

        return paginatedCases;
    };
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const fetchCases = async () => {
        try {
            const response = await axios.get(`${ApiEndPoint}getcase`, {
                withCredentials: true,
            }); // API endpoint
            console.log("data of case", response.data.data); // Assuming the API returns data in the `data` field
            setData(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);
    // Handle page navigation
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
    }




    return (
        <center style={{
            width: "100%", height: "100%", position: "relative",
            boxShadow: "5px 5px 5px gray",
            overflowY: "auto",
            scrollbarWidth: "thin", // For Firefox
            scrollbarColor: "#d2a85a #16213e",
            padding: '20px'
        }}>

            {/* Close Button at the Top Level */}
            {show === true && (
                <button
                    title="Close"
                    onClick={() => {
                        setAdminData(null);
                        setShow(false);
                        setSelectedChat(null)
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
                    {isProfile ?
                        (
                            <div style={{
                                width: "50%",
                                position: "relative",
                            }} >

                                <div className="mb-2 text-center  avatar-container">
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
                                                // maxWidth: "80px",
                                                // maxHeight: "80px",
                                                // minWidth: "50px",
                                                // minHeight: "50px",
                                                border: "2px solid #d4af37",
                                                textAlign: "center",
                                                padding: "3px",
                                                borderRadius: "50%", // Use 50% for a perfect circle
                                                width: "100px",
                                                height: "100px",
                                                borderRadius: "50%",
                                                border: "1px solid #18273e",
                                                boxShadow: "#18273e 0px 2px 5px",
                                            }}
                                            className="avatar-img"
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
                                <div>
                                    {editableFields ? (
                                        <FaLock
                                            onClick={handleEdit}
                                            style={{
                                                cursor: "pointer",
                                                marginTop: "5px",
                                                color: "#d3b386",
                                            }}
                                        />
                                    ) : (
                                        <FaEdit
                                            onClick={handleEdit}
                                            style={{
                                                cursor: "pointer",
                                                marginTop: "5px",
                                                color: "#d3b386",
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="text-start d-flex flex-column gap-2">
                                    {/* Name Field */}
                                    <div>
                                        <label
                                            className="form-label fw-bold"
                                            style={{
                                                marginBottom: "10px",
                                                fontSize: "1rem",
                                                marginLeft: "3px",
                                            }}
                                        >
                                            Name
                                        </label>
                                        <div
                                            className="input-group bg-soft-light rounded-2"
                                            style={{ marginTop: "-10px" }}
                                        >
                                            <span className="input-group-text">
                                                <BsPerson />
                                            </span>
                                            <input
                                                style={{
                                                    borderColor: "#18273e", // Green border for unfocused state
                                                    boxShadow: "none", // Remove default Bootstrap shadow on focus
                                                }}
                                                className="form-control-md form-control"
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
                                                    e.target.style.borderColor = "#d3b386"; // Orange border on focus
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = "#18273e"; // Green border on unfocus
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label
                                            className="form-label fw-bold"
                                            style={{
                                                marginBottom: "10px",
                                                fontSize: "1rem",
                                                marginLeft: "3px",
                                            }}
                                        >
                                            Email
                                        </label>
                                        <div
                                            className="input-group bg-soft-light rounded-2"
                                            style={{ marginTop: "-10px" }}
                                        >
                                            <span className="input-group-text">
                                                <MdOutlineAttachEmail />
                                            </span>
                                            <input
                                                style={{
                                                    borderColor: "#18273e", // Green border for unfocused state
                                                    boxShadow: "none", // Remove default Bootstrap shadow on focus
                                                }}
                                                className="form-control-md form-control"
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
                                                    e.target.style.borderColor = "#d3b386"; // Orange border on focus
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = "#18273e"; // Green border on unfocus
                                                }}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label
                                            className="form-label fw-bold"
                                            style={{
                                                marginBottom: "10px",
                                                fontSize: "1rem",
                                                marginLeft: "3px",
                                            }}
                                        >
                                            Phone
                                        </label>
                                        <PhoneInput
                                            country={"us"}
                                            value={adminData?.phone}
                                            onChange={handlePhoneChange}
                                            disabled={!editableFields}
                                            inputStyle={{
                                                width: "100%",
                                                border: "1px solid #18273e",
                                                boxShadow: "none",
                                                height: "37px",
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = "#d3b386"; // Orange border on focus
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = "#18273e"; // Green border on unfocus
                                            }}
                                        />
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label
                                            className="form-label fw-bold"
                                            style={{
                                                marginBottom: "10px",
                                                fontSize: "1rem",
                                                marginLeft: "3px",
                                            }}
                                        >
                                            Password
                                        </label>
                                        <div
                                            className="input-group bg-soft-light rounded-2"
                                            style={{ marginTop: "-10px" }}
                                        >
                                            <span className="input-group-text">
                                                <RiLockPasswordFill />
                                            </span>
                                            <input
                                                style={{
                                                    borderColor: "#18273e", // Green border for unfocused state
                                                    boxShadow: "none", // Remove default Bootstrap shadow on focus
                                                }}
                                                className="form-control-md form-control"
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
                                                    e.target.style.borderColor = "#d3b386"; // Orange border on focus
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = "#18273e"; // Green border on unfocus
                                                }}
                                            />
                                        </div>

                                    </div>

                                    <div className="mb-3 col-md-12">
                                        <label className="form-label" style={{ color: '#18273e' }}>Role</label>
                                        <div className="input-group">
                                            <div className="position-relative w-100" ref={dropdownRef}>
                                                <div
                                                    className="form-control  d-flex align-items-center justify-content-between"
                                                    style={{ cursor: "pointer", minWidth: '300px', border: '1px solid #18273e', color: "#18273e" }}

                                                    onClick={toggleDropdown}
                                                >
                                                    {selectedRole || "Select Role"} <FaChevronDown />
                                                </div>
                                                {dropdownOpen && (
                                                    <ul className="list-group position-absolute bg-dark border rounded shadow w-100 mt-1" style={{ zIndex: 1000 }}>
                                                        {["Client", "Lawyer", "Finance", "Receptionist"].map((role) => (
                                                            <li
                                                                key={role}
                                                                className="list-group-item list-group-item-action text-white bg-dark border-secondary"
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => handleRoleSelect(role)}
                                                            >
                                                                {role}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save and Delete Buttons */}
                                {editableFields && (
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            width: "100%",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <button
                                            onClick={handleSave}
                                            style={{
                                                width: "48%",
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
                                            style={{
                                                width: "48%",
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
                                {/* Floating Button */}


                            </div>
                        )
                        :
                        (
                            <div
                                className="container-fluid m-0 p-0"
                            // style={{ height: "84vh", overflowY: "auto" }}
                            >
                                {/* Search Input */}

                                {/* Filters Container */}

                                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                                    {/* Search Input on the Left */}
                                    <input
                                        type="text"
                                        className="form-control me-3"
                                        style={{ maxWidth: "250px" }} // Adjust width as needed
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />

                                    {/* Filter & Sorting Dropdowns */}
                                    <div className="d-flex flex-wrap gap-2">
                                        {/* Status Filter */}
                                        <select
                                            className="form-select w-auto"
                                            onChange={(e) => handleFilterChange("status", e.target.value)}
                                        >
                                            <option value="All">All Status</option>
                                            <option value="Open">Open</option>
                                            <option value="Closed">Closed</option>
                                            <option value="Pending">Pending</option>
                                        </select>

                                        {/* Case Type Filter */}
                                        <select
                                            className="form-select w-auto"
                                            onChange={(e) => handleFilterChange("caseType", e.target.value)}
                                        >
                                            <option value="All">All Case Types</option>
                                            <option value="Civil">Civil</option>
                                            <option value="Criminal">Criminal</option>
                                            <option value="Family">Family</option>
                                        </select>

                                        {/* Priority Filter */}
                                        <select
                                            className="form-select w-auto"
                                            onChange={(e) => handleFilterChange("priority", e.target.value)}
                                        >
                                            <option value="All">All Priorities</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                        {user.Role === "client" && (

                                            <button
                                                onClick={() => handleAddCase()}
                                                disabled={currentPage === totalPages}
                                                className="first-lastbutton btn btn-sm text-white"
                                                style={{ backgroundColor: "#d3b386", border: "none" }}
                                            >
                                                Add Case
                                            </button>
                                        )
                                        }
                                        {/* Sorting Options */}
                                        {/* <select
                                            className="form-select w-auto"
                                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                                        >
                                            <option value="createdAt">Sort by Created Date</option>
                                            <option value="updatedAt">Sort by Updated Date</option>
                                            <option value="CaseNumber">Sort by Case Number</option>
                                        </select> */}

                                        {/* <select
                                            className="form-select w-auto"
                                            onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select> */}
                                    </div>
                                </div>

                                <div className="card mb-3 shadow">
                                    <div
                                        className="card-header d-flex justify-content-between align-items-center px-3"
                                        style={{ height: "8vh" }}
                                    >
                                        <span className="col text-start">Status</span>
                                        <span className="col text-start">Case Number</span>
                                        <span className="col text-start">Case Type</span>
                                        {/*<span className="col text-start">Purpose</span> */}
                                        {/* <span className="col text-end">Action</span> */}
                                    </div>

                                    <div className="card-list p-0">
                                        {getFilteredCases().map((item, index) => (
                                            <div key={index}>
                                                <div
                                                    className="d-flex justify-content-between align-items-center p-3 border-bottom"
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
                                                            className={`me-2 rounded-circle ${item.Status.toLowerCase() === "case filed"
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
                                                        {item["Name"]}
                                                    </span>
                                                    {/* <input
                                                    className="col w-100"
                                                    type="text"
                                                    value={item.notes || ""}
                                                    onChange={(e) => handleEditCase(index, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                /> */}


                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div
                                        id="numberbar"
                                        className="position-sticky bottom-0 mx-auto"
                                        style={{
                                            backgroundColor: "#18273e",
                                            zIndex: 10,
                                            padding: "10px",
                                            borderRadius: "8px",
                                            width: "100%",
                                            maxWidth: "300px", // Responsive width
                                            textAlign: "center",
                                            border: "2px solid #d4af37",
                                        }}
                                    >
                                        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                                            <button
                                                onClick={() => goToPage(currentPage - 1)}
                                                // disabled={currentPage === 1}
                                                className="first-lastbutton btn btn-sm text-white"
                                                style={{ backgroundColor: "#d3b386", border: "none" }}
                                            >
                                                Previous
                                            </button>

                                            <input
                                                value={currentPage}
                                                min={1}
                                                max={totalPages}
                                                onChange={(e) =>
                                                    goToPage(
                                                        Math.max(1, Math.min(totalPages, Number(e.target.value)))
                                                    )
                                                }
                                                className="form-control text-white bg-dark border-2"
                                                style={{
                                                    width: "60px",
                                                    borderColor: "#d4af37",
                                                    backgroundColor: "#18273e",
                                                    textAlign: "center",
                                                    borderRadius: "6px",
                                                }}
                                            />

                                            <button
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="first-lastbutton btn btn-sm text-white"
                                                style={{ backgroundColor: "#d3b386", border: "none" }}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>

                                </div>

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

            <button
                onClick={() => handleFloatingButtonClick()}
                title="Floating Action"
                style={{
                    position: "fixed", // 🔥 Keep it fixed on screen
                    bottom: "60px",
                    right: "50px",
                    backgroundColor: "#f4e9d8",
                    color: "#18273e",
                    border: "1px solid #d3b386",
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    zIndex: 9999, // Higher z-index to stay above most elements
                }}
            >
                {flaotingButton ? <BsPerson /> : <BsCassette />}
            </button>

        </center>
    );
};

export default ViewUsersAdminWidget;
