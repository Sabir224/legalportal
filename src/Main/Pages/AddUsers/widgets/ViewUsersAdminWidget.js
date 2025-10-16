import React, { useEffect, useState, useRef } from 'react';
import { BsCassette, BsFileArrowUp, BsPerson } from 'react-icons/bs';
import PhoneInput from 'react-phone-input-2';
import 'bootstrap/dist/css/bootstrap.min.css';
// import "../Style/CSS.css";
import defaultProfilePic from '../../Component/assets/icons/person.png';
import { RiLockPasswordFill } from 'react-icons/ri';
import { MdOutlineAttachEmail } from 'react-icons/md';
import Contactprofile from '../../Component/images/Asset 70mdpi.png';
import axios from 'axios';
import { ApiEndPoint } from '../../Component/utils/utlis';
import { FaCamera, FaEdit, FaLock, FaChevronDown, FaArrowLeft, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { GrContactInfo } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { screenChange } from '../../../../REDUX/sliece';
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
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
} from '@mui/material';
import { Lock, Edit, ChevronDown } from '@mui/icons-material';
import { Dropdown } from 'react-bootstrap';
import SocketService from '../../../../SocketService';
import { Navigate } from 'react-router-dom';

const ViewUsersAdminWidget = ({ user, setSelectedChat, onUserUpdate, registerCloseHandler }) => {
  const [profilePicBase64, setProfilePicBase64] = useState(null);

  const [selectedRole, setSelectedRole] = useState(user?.Role);
  const [editableFields, setEditableFields] = useState(false);
  const [isProfile, setIsProfile] = useState(true); // Controls profile section visibility
  const [showCaseSheet, setShowCaseSheet] = useState(false); // Controls master sheet visibility
  const [adminData, setAdminData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [pic, setPic] = useState(user?.profilePicture);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectfile, setselectfile] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [flaotingButton, setFlaotingButton] = useState(false);
  const [experience, setExperience] = useState('');
  const [fee, setFee] = useState('');
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      if (user.Role !== 'client') {
        response = await axios.get(`${ApiEndPoint}geLawyerDetails/${user.Email}`);
        console.log('User Details');
        console.log(response.data.lawyerDetails);
        setUserDetails(response.data.lawyerDetails);
      } else {
        response = await axios.get(`${ApiEndPoint}getClientDetails/${user.Email}`);
        setUserDetails(response.data.clientDetails);
      }

      setAdminData({
        name: user?.UserName,
        email: user?.Email,
        password: user?.Password,
        phone:
          user?.Role === 'lawyer'
            ? response.data.lawyerDetails?.Contact
            : response.data?.Contact
            ? response.data?.Contact
            : '',
        profilePicture: user?.ProfilePicture,
        experience: user?.Role === 'lawyer' ? response.data.lawyerDetails?.YearOfExperience : '',
        fee: user?.Role === 'lawyer' ? response.data.lawyerDetails?.ConsultationFee : '',
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
        const base64String = reader.result.split(',')[1];
        console.log('Base64:', base64String);
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
    formData.append('UserName', adminData.name);
    formData.append('Contact', adminData.phone);
    if (adminData.password) formData.append('Password', adminData.password);

    formData.append('file', selectfile ? selectfile : null);

    // formData.append("file", adminData?.profilePicture ? adminData.profilePicture : null);

    if (user.Role !== 'client') {
      if (selectedRole !== 'client') {
        formData.append('Role', selectedRole);
        formData.append('YearOfExperience', adminData.experience);
        formData.append('ConsultationFee', adminData.fee);
        try {
          const response = await axios.put(
            `${ApiEndPoint}users/updateLawyerDetails/${user.Email}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } } // Set content type
          );

          // alert("Lawyer details updated successfully!");

          //   if (typeof handleEdting === "function") {
          //     handleEdting(); // Ensure `handleEdting` is defined before calling it
          //   }
          if (response.status === 200) {
            if (onUserUpdate) {
              onUserUpdate();
            }
            setAdminData(null);
            setSelectedChat(null);
            setShow(false);
          }
          console.log('Updated Data:', response.data);
        } catch (error) {
          console.error('Update failed:', error.response?.data || error);
          //   alert("Failed to update lawyer details.");
        }
      } else {
        alert('Please Select The Correct Role');
      }
    } else {
      try {
        const response = await axios.put(
          `${ApiEndPoint}users/updateClientDetails/${user.Email}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } } // Set content type
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

        console.log('Updated Data:', response.data);
      } catch (error) {
        console.error('Update failed:', error.response?.data || error);
        //   alert("Failed to update lawyer details.");
      }
    }
  };
  const handleProfilePicClick = () => {
    if (editableFields && fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };
  // Delete profile
  const handleDelete = async () => {
    // let email=`${ApiEndPoint}/deleteUserByEmail/${user.Email}`
    await axios
      .delete(`${ApiEndPoint}/deleteUserAndClean/${user._id}`)
      .then((response) => {
        if (response.status === 200) {
          if (onUserUpdate) {
            onUserUpdate();
          }
          setAdminData(null);
          setSelectedChat(null);
          setShow(false);
        }
        setEditableFields(false);
        setPic(true);
        SocketService.UserVerification(response?.data?.Users);

        // fetchClientDetails()
        // Mark as deleted to trigger cleanup
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.querySelector('.camera-overlay').style.display = 'flex';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.querySelector('.camera-overlay').style.display = 'none';
  };

  const handleEdit = () => {
    setEditableFields(!editableFields);
  };

  // *****************************************     for case show ************************************//

  const [caseNumber, setCaseNumber] = useState('');
  const [caseName, setCaseName] = useState('');
  const [check, setcheck] = useState(true);
  const screen = useSelector((state) => state.screen.value);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const casesPerPage = 50; // Show 50 cases per page
  const [filters, setFilters] = useState({
    status: 'All',
    caseType: 'All',
    priority: 'All',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null,
    action: '',
    message: '',
  });
  const [resultDialog, setResultDialog] = useState({
    open: false,
    type: '', // 'success' or 'error'
    title: '',
    message: '',
  });

  // console.log("_________Token:0", token.Role);

  const dispatch = useDispatch();
  const handleCloseCaseSheet = () => {
    setShowCaseSheet(false);
    setShow(true);
    setIsProfile(true);
  };
  useEffect(() => {
    if (registerCloseHandler) {
      registerCloseHandler({
        handleCloseCaseSheet,
        getShowSheet: () => showCaseSheet, // expose current value
      });
    }
  }, [showCaseSheet, registerCloseHandler]);
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
    console.log('  global.CaseId ', item._id);
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
          if (typeof value !== 'string' || ['_id', 'createdAt', 'updatedAt'].includes(key)) {
            return false;
          }
          return value.toLowerCase().includes(query);
        })
      );
    }

    // Apply other filters (status, caseType, priority)...
    if (filters.status && filters.status !== 'All') {
      filteredCases = filteredCases.filter((item) => item.Status === filters.status);
    }

    if (filters.caseType && filters.caseType !== 'All') {
      filteredCases = filteredCases.filter((item) => item.Name === filters.caseType);
    }

    if (filters.priority && filters.priority !== 'All') {
      filteredCases = filteredCases.filter((item) => item.Priority === filters.priority);
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredCases.sort((a, b) => {
        if (filters.sortOrder === 'asc') {
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

  const fetchCases = async () => {
    try {
      const response = await axios.get(`${ApiEndPoint}getcase`, {
        withCredentials: true,
      });

      const allCases = response.data.data;
      let filteredCases = [];

      if (user.Role?.toLowerCase() === 'client') {
        // Show only client's own cases
        filteredCases = allCases.filter((caseItem) => caseItem.ClientId === user._id);
      } else if (user.Role?.toLowerCase() === 'admin') {
        // Admin sees all cases
        filteredCases = allCases;
      } else {
        // Legal users: show only assigned cases
        filteredCases = allCases.filter((caseItem) =>
          caseItem.AssignedUsers?.some((user) => user.UserId?.toString() === user._id?.toString())
        );
      }

      await setData(filteredCases);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleActivation = (userId, action) => {
    const confirmMsg =
      action === 'activate'
        ? 'Are you sure you want to activate this user?'
        : action === 'deactivate'
        ? 'Are you sure you want to deactivate this user?'
        : action === 'approve'
        ? 'Are you sure you want to approve this user and send login credentials?'
        : 'Are you sure you want to reject this user?';

    setConfirmDialog({
      open: true,
      userId,
      action,
      message: confirmMsg,
    });
  };

  const handleConfirmAction = async () => {
    try {
      const { userId, action } = confirmDialog;

      const response = await axios.post(`${ApiEndPoint}activation/${userId}/action`, { action });

      if (response.status === 200) {
        // Determine the new status values
        const newIsActive = action === 'deactivate' ? false : action === 'activate' ? true : user.isActive;
        const newIsApproved = action === 'approve' ? true : action === 'reject' ? false : user.isApproved;
        const newApprovalStatus =
          action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : user.approvalStatus;

        // Show success in dialog
        setResultDialog({
          open: true,
          type: 'success',
          title: 'Success',
          message: response.data.message,
        });

        // Update local admin data
        setAdminData((prev) => ({
          ...prev,
          isActive: newIsActive,
          isApproved: newIsApproved,
          approvalStatus: newApprovalStatus,
        }));

        // Prepare updated user data to pass to parent
        const updatedUserData = {
          _id: user._id,
          isActive: newIsActive,
          isApproved: newIsApproved,
          approvalStatus: newApprovalStatus,
        };

        // Call the update callback with the updated user data
        if (onUserUpdate) {
          onUserUpdate(updatedUserData);
        }
      }
    } catch (error) {
      // Show error in dialog
      setResultDialog({
        open: true,
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'An unexpected error occurred',
      });
    } finally {
      setConfirmDialog({ open: false, userId: null, action: '', message: '' });
    }
  };

  useEffect(() => {
    console.log('Token received in useEffect:', user);
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
        width: '100%',
        height: '100%',
        position: 'relative',
        boxShadow: '5px 5px 5px gray',
        overflowY: 'auto',
        scrollbarWidth: 'thin', // For Firefox
        scrollbarColor: '#d2a85a #16213e',
        padding: '20px',
      }}
    >
      {/* Close Button at the Top Level */}
      {show === true && !showCaseSheet && (
        <button
          title="Close"
          onClick={() => {
            setAdminData(null);
            setShow(false);
            setSelectedChat(null);
          }}
          style={{
            position: 'absolute',
            top: '0px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#d3b386',
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
                width: '100%',
                maxWidth: '500px',
                position: 'relative',
                margin: '0 auto',
                padding: '0 15px',
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
                      border: '2px solid #d4af37',
                      padding: '3px',
                      borderRadius: '50%',
                      width: '100px',
                      height: '100px',
                      border: '1px solid #18273e',
                      boxShadow: '#18273e 0px 2px 5px',
                      cursor: 'pointer',
                    }}
                    className="avatar-img img-fluid"
                    onClick={() => document.getElementById('profilePicUpdate').click()}
                  />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="profilePicUpdate"
                  onChange={handleFileInputUpdateChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="text-center mb-3">
                <div className="d-flex justify-content-center gap-3">
                  {/* Show Approve/Reject buttons if status is pending */}
                  {user.approvalStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => handleActivation(user._id, 'approve')}
                        className="btn"
                        style={{
                          color: 'white',
                          background: '#198754', // green
                          height: '40px',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: 500,
                          width: '120px',
                        }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleActivation(user._id, 'reject')}
                        className="btn"
                        style={{
                          color: 'white',
                          background: '#dc3545', // red
                          height: '40px',
                          border: 'none',
                          borderRadius: '10px',
                          fontWeight: 500,
                          width: '120px',
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* Show Activate/Deactivate only if approved */}
                  {user.approvalStatus === 'approved' && (
                    <button
                      onClick={() => handleActivation(user._id, user.isActive ? 'deactivate' : 'activate')}
                      className="btn"
                      style={{
                        color: 'white',
                        background: user.isActive ? '#dc3545' : '#198754',
                        height: '40px',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 500,
                        width: '120px',
                      }}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}

                  {/* Nothing for rejected users */}
                </div>
              </div>

              {/* Edit Icon */}
              <div className="text-center mb-3">
                {editableFields ? (
                  <FaLock
                    onClick={handleEdit}
                    style={{
                      cursor: 'pointer',
                      color: '#d3b386',
                      fontSize: '1.2rem',
                    }}
                  />
                ) : (
                  <FaEdit
                    onClick={handleEdit}
                    style={{
                      cursor: 'pointer',
                      color: '#d3b386',
                      fontSize: '1.2rem',
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
                      fontSize: '0.9rem',
                      color: '#18273e',
                      textAlign: 'left',
                      display: 'block',
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
                        borderColor: '#18273e',
                        boxShadow: 'none',
                        fontSize: '0.9rem',
                      }}
                      className="form-control"
                      value={adminData?.name}
                      onChange={(e) => handleChange(e, 'name')}
                      id="Name"
                      name="username"
                      placeholder="Enter Name"
                      type="text"
                      title="Please Enter Client Name"
                      required
                      readOnly={!editableFields}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d3b386';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#18273e';
                      }}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      fontSize: '0.9rem',
                      color: '#18273e',
                      textAlign: 'left',
                      display: 'block',
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
                        borderColor: '#18273e',
                        boxShadow: 'none',
                        fontSize: '0.9rem',
                      }}
                      className="form-control"
                      value={adminData?.email}
                      onChange={(e) => handleChange(e, 'email')}
                      id="Email"
                      name="email"
                      placeholder="Enter Email"
                      type="email"
                      title="Please Enter Client Email"
                      required
                      readOnly={!editableFields}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d3b386';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#18273e';
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
                      fontSize: '0.9rem',
                      color: '#18273e',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    Phone
                  </label>
                  <div style={{ width: '100%' }}>
                    <PhoneInput
                      country={'us'}
                      value={adminData?.phone}
                      onChange={handlePhoneChange}
                      disabled={!editableFields}
                      inputStyle={{
                        width: '100%',
                        border: '1px solid #18273e',
                        boxShadow: 'none',
                        height: '38px',
                        fontSize: '0.9rem',
                      }}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        title: 'Please enter a valid phone number',
                      }}
                      containerStyle={{
                        width: '100%',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d3b386';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#18273e';
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      fontSize: '0.9rem',
                      color: '#18273e',
                      textAlign: 'left',
                      display: 'block',
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
                        borderColor: '#18273e',
                        boxShadow: 'none',
                        fontSize: '0.9rem',
                      }}
                      className="form-control"
                      value={adminData?.password}
                      onChange={(e) => handleChange(e, 'password')}
                      id="Password"
                      name="password"
                      placeholder="Enter Password"
                      type="password"
                      title="Please Enter Client Password"
                      required
                      readOnly={!editableFields}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#d3b386';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#18273e';
                      }}
                    />
                  </div>
                </div>

                {/* Role Field */}
                <div className="mb-3">
                  <label
                    className="form-label fw-bold text-start"
                    style={{
                      color: '#18273e',
                      fontSize: '0.9rem',
                      textAlign: 'left',
                      display: 'block',
                    }}
                  >
                    Role
                  </label>
                  <div className="input-group">
                    <div className="position-relative w-100" ref={dropdownRef}>
                      <div
                        className="form-control d-flex align-items-center justify-content-between"
                        style={{
                          cursor: 'pointer',
                          border: '1px solid #18273e',
                          color: '#18273e',
                          fontSize: '0.9rem',
                          height: '38px',
                        }}
                        onClick={toggleDropdown}
                      >
                        {selectedRole || 'Select Role'} <FaChevronDown />
                      </div>
                      {dropdownOpen && (
                        <ul
                          className="list-group position-absolute bg-dark border rounded shadow w-100 mt-1"
                          style={{ zIndex: 1000 }}
                        >
                          {['Client', 'Lawyer', 'Finance', 'Receptionist'].map((role) => (
                            <li
                              key={role}
                              className="list-group-item list-group-item-action text-white bg-dark border-secondary"
                              style={{
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                              }}
                              onClick={() => handleRoleSelect(role)}
                            >
                              {role}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  {selectedRole === 'lawyer' && (
                    <>
                      {/* Experience Field */}
                      <div>
                        <label
                          className="form-label fw-bold text-start"
                          style={{
                            fontSize: '0.9rem',
                            color: '#18273e',
                            textAlign: 'left',
                            display: 'block',
                          }}
                        >
                          Years of Experience
                        </label>
                        <div className="input-group bg-soft-light rounded-2">
                          <span className="input-group-text">
                            <FaCalendarAlt />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            id="experience"
                            name="experience"
                            readOnly={!editableFields}
                            value={adminData?.experience}
                            onChange={(e) => handleChange(e, 'experience')}
                            placeholder="Enter Experience (years)"
                            style={{
                              borderColor: '#18273e',
                              boxShadow: 'none',
                              fontSize: '0.9rem',
                            }}
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Fee Field */}
                      <div>
                        <label
                          className="form-label fw-bold text-start"
                          style={{
                            fontSize: '0.9rem',
                            color: '#18273e',
                            textAlign: 'left',
                            display: 'block',
                          }}
                        >
                          Consultation Fee
                        </label>
                        <div className="input-group bg-soft-light rounded-2">
                          <span className="input-group-text">
                            <FaDollarSign />
                          </span>
                          <input
                            type="number"
                            className="form-control"
                            id="fee"
                            name="fee"
                            readOnly={!editableFields}
                            value={adminData?.fee}
                            onChange={(e) => handleChange(e, 'fee')}
                            placeholder="Enter Fee"
                            style={{
                              borderColor: '#18273e',
                              boxShadow: 'none',
                              fontSize: '0.9rem',
                            }}
                            min="0"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Save and Delete Buttons */}
              {editableFields && (
                <div
                  className="d-flex flex-column gap-3 mt-3"
                  style={{
                    width: '100%',
                  }}
                >
                  {/* Save and Delete Buttons */}
                  <div className="d-flex justify-content-between gap-3">
                    <button
                      onClick={handleSave}
                      className="btn"
                      style={{
                        flex: 1,
                        color: 'white',
                        background: '#18273e',
                        height: '40px',
                        border: 'none',
                        borderRadius: '10px',
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
                        color: 'white',
                        background: '#d3b386',
                        height: '40px',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 500,
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  {/* Activation & Approval Buttons */}
                </div>
              )}
            </div>
          )}{' '}
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
                  .slice((currentPage - 1) * casesPerPage, currentPage * casesPerPage)
                  .map((item, index) => (
                    <div key={index} className="border-bottom">
                      {/* Mobile View */}
                      <div
                        className="d-md-none p-3"
                        style={{
                          overflowX: 'hidden',
                          maxWidth: '100%',
                          maxHeight: '83vh',
                        }}
                      >
                        {/* Status and Actions Row */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className={`rounded-circle ${
                                item.Status.toLowerCase() === 'case filed' ? 'bg-success' : 'bg-danger'
                              }`}
                              style={{
                                width: '12px',
                                height: '12px',
                                minWidth: '12px',
                              }}
                            />
                            <span className="badge bg-light text-dark">{item.Status}</span>
                          </div>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="light"
                              size="sm"
                              className="rounded-circle p-0 border"
                              style={{
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                onClick={(e) => {
                                  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                                    handleClick(1, item);
                                  }
                                }}
                              >
                                View Details
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>

                        {/* Data Fields - Fixed alignment */}
                        <div className="d-flex flex-column gap-2 ps-0">
                          {' '}
                          {/* Added ps-0 to remove left padding */}
                          <div className="d-flex flex-wrap align-items-start">
                            {' '}
                            {/* Changed to align-items-start */}
                            <span
                              className="text-muted me-2"
                              style={{
                                minWidth: '80px',
                                wordBreak: 'break-word',
                                textAlign: 'left', // Explicitly set text alignment
                                marginLeft: '0', // Ensure no left margin
                              }}
                            >
                              Case #:
                            </span>
                            <span className="fw-medium">{item['CaseNumber']}</span>
                          </div>
                          <div className="d-flex flex-wrap align-items-start">
                            <span
                              className="text-muted me-2"
                              style={{
                                minWidth: '80px',
                                wordBreak: 'break-word',
                                textAlign: 'left',
                                marginLeft: '0',
                              }}
                            >
                              Request #:
                            </span>
                            <span className="fw-medium">{item['SerialNumber']}</span>
                          </div>
                          <div className="d-flex flex-wrap align-items-start">
                            <span
                              className="text-muted me-2"
                              style={{
                                minWidth: '80px',
                                wordBreak: 'break-word',
                                textAlign: 'left',
                                marginLeft: '0',
                              }}
                            >
                              Type:
                            </span>
                            <span className="fw-medium">{item['CaseType']}</span>
                          </div>
                          <div className="ps-0">
                            {' '}
                            {/* Added ps-0 here as well */}
                            <div className="text-muted mb-1" style={{ textAlign: 'left' }}>
                              Purpose:
                            </div>
                            <input
                              className="form-control form-control-sm"
                              value={item.notes || ''}
                              onChange={(e) => handleEdit(index, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Desktop View - Horizontal Layout */}
                      <div
                        className="d-none d-md-flex justify-content-between align-items-center p-3"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                            handleClick(1, item);
                          }
                        }}
                      >
                        <span className="col d-flex align-items-center text-start">
                          <span
                            className={`me-2 rounded-circle ${
                              item.Status.toLowerCase() === 'case filed' ? 'bg-success' : 'bg-danger'
                            }`}
                            style={{
                              width: '10px',
                              height: '10px',
                              display: 'inline-block',
                            }}
                          ></span>
                          {item.Status}
                        </span>
                        <span className="col d-flex align-items-center text-start">{item['CaseNumber']}</span>
                        <span className="col d-flex align-items-center text-start">{item['SerialNumber']}</span>
                        <span className="col d-flex align-items-center text-start">{item['CaseType']}</span>
                        <input
                          className="col form-control"
                          type="text"
                          value={item.notes || ''}
                          onChange={(e) => handleEdit(index, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />

                        {/* Permission Dropdown */}
                        <div className="col text-end">
                          <Dropdown
                            show={dropdownOpen === index}
                            onToggle={(isOpen) => setDropdownOpen(isOpen ? index : null)}
                          >
                            <Dropdown.Toggle
                              variant="custom"
                              size="sm"
                              className="custom-dropdown-toggle"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(dropdownOpen === index ? null : index);
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
                      backgroundColor: '#18273e',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid #d4af37',
                      margin: 'auto',
                      maxWidth: '100%',
                      width: 'fit-content',
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
                        <span className="text-white me-2 d-none d-sm-block">Page</span>
                        <input
                          value={currentPage}
                          min={1}
                          max={totalPages}
                          onChange={(e) => goToPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                          className="form-control text-center"
                          style={{
                            width: '60px',
                            border: '2px solid #d4af37',
                            backgroundColor: '#18273e',
                            color: 'white',
                          }}
                        />
                        <span className="text-white ms-2 d-none d-sm-block">of {totalPages}</span>
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
          title={showCaseSheet ? 'Hide Cases' : 'View Cases'}
          style={{
            backgroundColor: '#f4e9d8',
            color: '#18273e',
            border: '1px solid #d3b386',
            borderRadius: '20%',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.0rem',
            cursor: 'pointer',
          }}
        >
          {showCaseSheet ? 'Hide Cases' : 'View Cases'}
        </button>
      )}
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, userId: null, action: '', message: '' })}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            minWidth: 400,
            maxWidth: 500,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Dynamic header accent based on action type */}
          <Box
            sx={{
              height: 4,
              background:
                confirmDialog.action?.includes('delete') || confirmDialog.action === 'reject'
                  ? 'linear-gradient(90deg, #f44336, #ff7961)'
                  : 'linear-gradient(90deg, #2196f3, #21cbf3)',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          <DialogTitle
            sx={{
              pb: 1,
              pt: 2,
              fontSize: '1.25rem',
              fontWeight: 600,
              color:
                confirmDialog.action?.includes('delete') || confirmDialog.action === 'reject' ? '#c62828' : '#1a237e',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background:
                  confirmDialog.action?.includes('delete') || confirmDialog.action === 'reject'
                    ? 'linear-gradient(135deg, #f44336, #d32f2f)'
                    : 'linear-gradient(135deg, #2196f3, #1976d2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 'bold',
              }}
            >
              !
            </Box>
            Confirm Action
          </DialogTitle>

          <DialogContent sx={{ py: 2, px: 3 }}>
            <Box
              sx={{
                p: 2,
                mb: 1,
                borderRadius: 1,
                backgroundColor:
                  confirmDialog.action?.includes('delete') || confirmDialog.action === 'reject'
                    ? 'rgba(244, 67, 54, 0.04)'
                    : 'rgba(33, 150, 243, 0.04)',
                border:
                  confirmDialog.action?.includes('delete') || confirmDialog.action === 'reject'
                    ? '1px solid rgba(244, 67, 54, 0.1)'
                    : '1px solid rgba(33, 150, 243, 0.1)',
              }}
            >
              <Typography
                sx={{
                  color: '#37474f',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                {confirmDialog.message}
              </Typography>
            </Box>

            {/* Warning for destructive actions */}
            {(confirmDialog.action === 'reject' || confirmDialog.action === 'deactivate') && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 1,
                  p: 1,
                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                  borderRadius: 1,
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: '#f44336',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  ⚠
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.8rem',
                    color: '#d32f2f',
                    fontWeight: 500,
                  }}
                >
                  {confirmDialog.action === 'reject'
                    ? 'User will be rejected and cannot login'
                    : 'User will be deactivated and cannot login'}
                </Typography>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
            <Button
              onClick={() => setConfirmDialog({ open: false, userId: null, action: '', message: '' })}
              color="inherit"
              variant="outlined"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                borderColor: '#e0e0e0',
                color: '#666',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  borderColor: '#bdbdbd',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              color="primary"
              variant="contained"
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.875rem',
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                background:
                  confirmDialog.action === 'reject' || confirmDialog.action === 'deactivate'
                    ? 'linear-gradient(135deg, #f44336, #e53935)'
                    : 'linear-gradient(135deg, #4caf50, #2e7d32)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {confirmDialog.action === 'activate'
                ? 'Activate'
                : confirmDialog.action === 'deactivate'
                ? 'Deactivate'
                : confirmDialog.action === 'approve'
                ? 'Approve'
                : confirmDialog.action === 'reject'
                ? 'Reject'
                : 'Confirm'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Result Dialog for Success/Error Messages */}
      <Dialog
        open={resultDialog.open}
        onClose={() => setResultDialog({ open: false, type: '', title: '', message: '' })}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            minWidth: 400,
            maxWidth: 500,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Dynamic header accent based on message type */}
          <Box
            sx={{
              height: 4,
              background:
                resultDialog.type === 'error'
                  ? 'linear-gradient(90deg, #f44336, #ff7961)'
                  : 'linear-gradient(90deg, #4caf50, #81c784)',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />

          <DialogTitle
            sx={{
              pb: 1,
              pt: 2,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: resultDialog.type === 'error' ? '#c62828' : '#2e7d32',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background:
                  resultDialog.type === 'error'
                    ? 'linear-gradient(135deg, #f44336, #d32f2f)'
                    : 'linear-gradient(135deg, #4caf50, #2e7d32)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {resultDialog.type === 'error' ? '✕' : '✓'}
            </Box>
            {resultDialog.title}
          </DialogTitle>

          <DialogContent sx={{ py: 2, px: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: resultDialog.type === 'error' ? 'rgba(244, 67, 54, 0.04)' : 'rgba(76, 175, 80, 0.04)',
                border:
                  resultDialog.type === 'error'
                    ? '1px solid rgba(244, 67, 54, 0.1)'
                    : '1px solid rgba(76, 175, 80, 0.1)',
              }}
            >
              <Typography
                sx={{
                  color: resultDialog.type === 'error' ? '#d32f2f' : '#2e7d32',
                  fontSize: '0.95rem',
                  lineHeight: 1.5,
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                {resultDialog.message}
              </Typography>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1, justifyContent: 'center' }}>
            <Button
              onClick={() => setResultDialog({ open: false, type: '', title: '', message: '' })}
              variant="contained"
              sx={{
                px: 4,
                py: 1,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.875rem',
                background:
                  resultDialog.type === 'error'
                    ? 'linear-gradient(135deg, #f44336, #e53935)'
                    : 'linear-gradient(135deg, #4caf50, #2e7d32)',
                boxShadow:
                  resultDialog.type === 'error'
                    ? '0 2px 8px rgba(244, 67, 54, 0.3)'
                    : '0 2px 8px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  boxShadow:
                    resultDialog.type === 'error'
                      ? '0 4px 12px rgba(244, 67, 54, 0.4)'
                      : '0 4px 12px rgba(76, 175, 80, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </center>
  );
};

export default ViewUsersAdminWidget;
