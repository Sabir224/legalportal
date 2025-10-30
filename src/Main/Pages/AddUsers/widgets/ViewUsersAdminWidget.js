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
import {
  FaCamera,
  FaEdit,
  FaLock,
  FaChevronDown,
  FaArrowLeft,
  FaCalendarAlt,
  FaDollarSign,
  FaChevronRight,
} from 'react-icons/fa';
import { GrContactInfo } from 'react-icons/gr';
import { useDispatch, useSelector } from 'react-redux';
import { Caseinfo, goBackScreen, resetAdminWidget, screenChange, setSelectedChat } from '../../../../REDUX/sliece';
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
import { Dropdown, Form } from 'react-bootstrap';
import SocketService from '../../../../SocketService';
import { Navigate } from 'react-router-dom';
import { useAlert } from '../../../../Component/AlertContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import BasicCase from '../../Component/BasicCase';
const ViewUsersAdminWidget = ({
  user,
  widgetState,
  updateWidgetState,
  onUserUpdate,
  onClose,
  registerCloseHandler,
  isViewUser = false,
}) => {
  // Destructure state from widgetState
  const {
    showCaseSheet,
    isProfile,
    adminData,
    profilePicBase64,
    selectedRole,
    editableFields,
    showLFA,
    navigationLevel,
  } = widgetState;

  // Local state for UI-only elements
  const [selectfile, setselectfile] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showCaseFilter, setCaseFilter] = useState(false);
  const [showCaseTypeFilter, setCaseTypeFilter] = useState(false);
  const [showCaseSubTypeFilter, setCaseSubTypeFilter] = useState(false);
  const reduxCaseCloseType = useSelector((state) => state.screen.CloseType);
  const caseSubTypeRef = useRef(null);
  const caseTypeRef = useRef(null);
  const caseNumberRef = useRef(null);
  const dispatch = useDispatch();

  // Case-related state
  const [Subtypelist, setSubtypelist] = useState([]);
  const [CaseTypeList, setCaseTypeList] = useState([]);
  const [casetypeslistFilteroption, setcasetypeslistFilteroption] = useState([]);
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
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: [],
    CaseType: [],
    CaseSubType: [],
    priority: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false);

  const { showLoading, showDataLoading, showSuccess, showError } = useAlert();
  const itemsPerPage = 100;

  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleRoleSelect = (role) => {
    updateWidgetState({
      selectedRole: editableFields ? role : user?.Role,
    });
    setDropdownOpen(editableFields ? null : false);
  };
  const handleGoToLFA = (caseData) => {
    updateWidgetState({
      showLFA: true,
      showCaseSheet: false,
      isProfile: false,
      selectedCase: caseData,
      navigationLevel: 3, // LFA level
    });
  };

  // Handle back navigation from LFA component
  const handleBackFromLFA = () => {
    updateWidgetState({
      showLFA: false,
      selectedCase: null,
    });
  };

  // Update your BasicCase usage to pass the callback

  useEffect(() => {
    function handleClickOutside(event) {
      if (caseSubTypeRef.current && !caseSubTypeRef.current.contains(event.target)) {
        handleApplyFilter('CaseSubType');
        setCaseSubTypeFilter(false);
      }

      if (caseNumberRef.current && !caseNumberRef.current.contains(event.target)) {
        setCaseFilter(false);
      }

      if (caseTypeRef.current && !caseTypeRef.current.contains(event.target)) {
        handleApplyFilter('CaseType');
        setCaseTypeFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCaseSubTypeFilter, showCaseTypeFilter, showCaseFilter]);

  // Effect to handle admin data changes
  useEffect(() => {
    if (user && !widgetState.navigationLevel) {
      updateWidgetState({
        navigationLevel: 1, // Start at profile level
      });
    }
  }, [user]);

  // Toggle between profile and master sheet
  const handleFloatingButtonClick = () => {
    if (isProfile) {
      updateWidgetState({
        isProfile: false,
        showCaseSheet: true,
        navigationLevel: 2,
      });
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
      } else {
        response = await axios.get(`${ApiEndPoint}getClientDetails/${user.Email}`);
        console.log('Client Details Details', response.data.clientDetails);
      }

      const userDetails = user.Role !== 'client' ? response.data.lawyerDetails : response.data.clientDetails;

      updateWidgetState({
        adminData: {
          name: user?.UserName,
          email: user?.Email,
          password: user?.Password,
          phone:
            user?.Role === 'client' ? response.data?.clientDetails?.Contact : response.data?.lawyerDetails?.Contact,

          profilePicture: user?.ProfilePicture,
          experience: user?.Role === 'lawyer' ? response.data.lawyerDetails?.YearOfExperience : '',
          fee: user?.Role === 'lawyer' ? response.data.lawyerDetails?.ConsultationFee : '',
          isActive: user?.isActive,
          isApproved: user?.isApproved,
          approvalStatus: user?.approvalStatus,
        },
        selectedRole: user?.Role,
      });
    } catch (err) {
      console.error('Error fetching client details:', err.message);
    }
  };
  useEffect(() => {
    // ✅ Only call when user exists
    if (user) {
      fetchClientDetails();
    }
  }, [user]); // 👈 Runs every time `user` changes
  const handleFileInputUpdateChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      setselectfile(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        console.log('Base64:', base64String);
        updateWidgetState({
          profilePicBase64: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input change
  const handleChange = (e, field) => {
    if (e && e.target) {
      updateWidgetState({
        adminData: { ...adminData, [field]: e.target.value },
      });
    }
  };

  // Handle phone input change
  const handlePhoneChange = (value) => {
    updateWidgetState({
      adminData: { ...adminData, phone: value },
    });
  };

  // Save changes
  const handleSave = async () => {
    if (!adminData) return;

    const formData = new FormData();
    formData.append('UserName', adminData.name);
    formData.append('Contact', adminData.phone);
    if (adminData.password) formData.append('Password', adminData.password);

    formData.append('file', selectfile ? selectfile : null);

    try {
      let response;
      if (user.Role !== 'client') {
        if (selectedRole !== 'client') {
          formData.append('Role', selectedRole);
          formData.append('YearOfExperience', adminData.experience);
          formData.append('ConsultationFee', adminData.fee);
          response = await axios.put(`${ApiEndPoint}users/updateLawyerDetails/${user.Email}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          alert('Please Select The Correct Role');
          return;
        }
      } else {
        response = await axios.put(`${ApiEndPoint}users/updateClientDetails/${user.Email}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.status === 200) {
        if (onUserUpdate) {
          onUserUpdate();
        }
        if (onClose) {
          onClose();
        }
        showSuccess('User updated successfully!');
      }
      console.log('Updated Data:', response.data);
    } catch (error) {
      console.error('Update failed:', error.response?.data || error);
      showError('Failed to update user details');
    }
  };

  // Delete profile
  const handleDelete = async () => {
    await axios
      .delete(`${ApiEndPoint}/deleteUserAndClean/${user._id}`)
      .then((response) => {
        if (response.status === 200) {
          if (onUserUpdate) {
            onUserUpdate();
          }
          if (onClose) {
            onClose();
          }
          showSuccess('User deleted successfully!');
        }
        updateWidgetState({
          editableFields: false,
        });
        SocketService.UserVerification(response?.data?.Users);
      })
      .catch((error) => {
        console.error(error);
        showError('Failed to delete user');
      });
  };

  const handleProfileEdit = () => {
    updateWidgetState({
      editableFields: !editableFields,
    });
  };

  const handleCloseCaseSheet = () => {
    updateWidgetState({
      showCaseSheet: false,
      isProfile: true,
    });
  };

  // Update registerCloseHandler to expose back functionality
  // ViewUsersAdminWidget.js mein
  const handleBackButton = () => {
    const currentLevel = navigationLevel || 1;

    console.log('🔙 Back button pressed, current level:', currentLevel, 'isProfile:', isProfile);

    switch (currentLevel) {
      case 3: // LFA is open → close LFA, show case sheet
        console.log('📄 Closing LFA, showing case sheet');
        updateWidgetState({
          showLFA: false,
          showCaseSheet: true,
          isProfile: false, // ✅ CaseSheet show ho raha hai, profile nahi
          navigationLevel: 2,
        });
        break;

      case 2: // Case sheet is open → close case sheet, show profile
        console.log('📋 Closing case sheet, showing profile');
        updateWidgetState({
          showLFA: false,
          showCaseSheet: false,
          isProfile: true, // ✅ Profile show ho raha hai
          navigationLevel: 1,
        });
        break;

      case 1: // Profile is open → close entire widget
        console.log('👤 Profile is open, closing widget and setting isProfile: false');

        // ✅ Pehle isProfile false karen
        updateWidgetState({
          showLFA: false,
          showCaseSheet: false,
          isProfile: false, // ✅ Profile close kar rahe hain, isliye false karen
          navigationLevel: 0,
          selectedChat: null,
          adminData: null,
          profilePicBase64: null,
          selectedRole: null,
          editableFields: false,
          selectedCase: null,
        });

        // Phir onClose call karen
        if (onClose) {
          console.log('✅ Calling onClose after setting isProfile: false');
          dispatch(goBackScreen());
          onClose(); // Simple close call karen
        } else {
          dispatch(resetAdminWidget());
          dispatch(setSelectedChat(null));
        }
        break;

      default:
        console.log('🔍 No navigation level, closing everything and setting isProfile: false');
        updateWidgetState({
          showLFA: false,
          showCaseSheet: false,
          isProfile: false, // ✅ Default mein bhi false karen
          navigationLevel: 1,
        });

        if (onClose) {
          onClose();
        } else {
          dispatch(resetAdminWidget());
          dispatch(setSelectedChat(null));
        }
    }
  };
  // Register close handler
  useEffect(() => {
    if (registerCloseHandler) {
      console.log('📝 Registering admin widget handler with back navigation');
      registerCloseHandler({
        handleCloseCaseSheet: () => {
          updateWidgetState({
            showCaseSheet: false,
            isProfile: true,
            navigationLevel: 1,
          });
        },
        getShowSheet: () => showCaseSheet,
        getShowLFA: () => showLFA,
        getIsProfile: () => isProfile,
        getNavigationLevel: () => widgetState.navigationLevel || 1,
        handleBackNavigation: handleBackButton,
      });
    }
  }, [showCaseSheet, showLFA, widgetState.navigationLevel, registerCloseHandler]);

  const renderBasicCase = () => <BasicCase token={user} isViewCase={true} onGoToLFA={handleGoToLFA} />;
  const renderLFAComponent = () => (
    <div style={{ width: '100%', height: '100%', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
        <h5>LFA Form for Case: {widgetState.selectedCase?.CaseNumber}</h5>
        {/* Your actual LFA form components */}
        <div className="form-group">
          <label>LFA Field 1</label>
          <input type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label>LFA Field 2</label>
          <input type="text" className="form-control" />
        </div>
        {/* Add more LFA fields as needed */}
      </div>
    </div>
  );

  // Filter and case-related functions
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      CaseSubType: [...Subtypelist, ''],
      CaseType: [...CaseTypeList, ''],
    }));
  }, [Subtypelist, CaseTypeList]);

  const handleApplyFilter = async (filterType) => {
    console.log('Apply filter for:', filterType);
    if (filterType === 'CaseSubType') {
      try {
        const response = await axios.post(`${ApiEndPoint}getCaseSubTypesorCaseTypes/false`, {
          caseTypes: filters?.CaseSubType,
        });
        console.log('response.data.subTypes = ', response.data.subTypes);
        await setCaseTypeList(response.data.subTypes || []);
      } catch (error) {
        setCaseSubTypeFilter(false);
      }
    } else if (filterType === 'CaseType') {
      try {
        const response = await axios.post(`${ApiEndPoint}getCaseSubTypesorCaseTypes/true`, {
          caseTypes: filters?.CaseType,
        });
        console.log('response.data.subTypes = ', response.data.subTypes);
        await setSubtypelist(response.data.subTypes || []);
      } catch (error) {
        setCaseTypeFilter(false);
      }
    }
  };

  const fetchCases = async () => {
    showDataLoading(true);
    try {
      const response = await axios.get(`${ApiEndPoint}getcase`, {
        withCredentials: true,
      });

      const allCases = response.data.data;
      let filteredCases = [];

      console.log('reduxCaseCloseType=', reduxCaseCloseType);

      if (user?.Role?.toLowerCase() === 'client') {
        filteredCases = allCases.filter(
          (caseItem) => caseItem.ClientId === user?._id && caseItem.CloseType === reduxCaseCloseType
        );
      } else if (user?.Role?.toLowerCase() === 'admin') {
        filteredCases = allCases.filter((caseItem) => caseItem.CloseType === reduxCaseCloseType);
      } else {
        filteredCases = allCases.filter((caseItem) =>
          caseItem.AssignedUsers?.some(
            (assignedUser) =>
              assignedUser.UserId?.toString() === user?._id?.toString() && caseItem.CloseType === reduxCaseCloseType
          )
        );
      }

      const groupedCases = Object.values(
        filteredCases
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .reduce((acc, caseItem) => {
            const clientId = caseItem.ClientId;
            const header = caseItem.ClientName || clientId || 'Unknown Client';

            if (!clientId) {
              acc[`${header}_${caseItem?._id}`] = {
                headerCase: caseItem,
                subcases: [],
              };
            } else {
              if (!acc[clientId]) {
                acc[clientId] = {
                  headerCase: caseItem,
                  subcases: [],
                };
              } else {
                acc[clientId].subcases.push(caseItem);
              }
            }

            return acc;
          }, {})
      );

      groupedCases.forEach((group) => {
        group.subcases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

      console.log('Group Cases = ', groupedCases);
      await setData(groupedCases);
      showDataLoading(false);
    } catch (err) {
      console.error('Error fetching cases:', err.message);
      showDataLoading(false);
    }

    // for filter
    try {
      const response = await axios.get(`${ApiEndPoint}getUniqueCaseSubTypes`, {
        withCredentials: true,
      });

      const filtercasesubtype = response.data?.subTypes;
      const filtercasetype = response.data?.CaseTypes;
      const filtercasetypeslist = response.data?.casetypeslist;

      await setSubtypelist(filtercasesubtype);
      await setcasetypeslistFilteroption(filtercasetypeslist);
      await setCaseTypeList(filtercasetype);

      setFilters((prev) => ({
        ...prev,
        CaseSubType: [...filtercasesubtype, ''],
        CaseType: [...filtercasetype, ''],
      }));
      showDataLoading(false);
    } catch (err) {
      console.error('Error fetching filter data:', err.message);
    }
  };

  useEffect(() => {
    console.log('Token received in useEffect:', user);
    if (user && user?._id && user.Role) {
      fetchCases();
    }
  }, [user, reduxCaseCloseType]);

  // Handle page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

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
        const newIsActive = action === 'deactivate' ? false : action === 'activate' ? true : user.isActive;
        const newIsApproved = action === 'approve' ? true : action === 'reject' ? false : user.isApproved;
        const newApprovalStatus =
          action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : user.approvalStatus;

        setResultDialog({
          open: true,
          type: 'success',
          title: 'Success',
          message: response.data.message,
        });

        updateWidgetState({
          adminData: {
            ...adminData,
            isActive: newIsActive,
            isApproved: newIsApproved,
            approvalStatus: newApprovalStatus,
          },
        });

        const updatedUserData = {
          _id: user._id,
          isActive: newIsActive,
          isApproved: newIsApproved,
          approvalStatus: newApprovalStatus,
        };

        if (onUserUpdate) {
          onUserUpdate(updatedUserData);
        }
      }
    } catch (error) {
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

  const handleAddCase = () => {
    dispatch(screenChange(11));
  };

  // Determine if we should show the component
  const shouldShow = !!user;
  const renderContent = () => {
    if (showLFA) {
      return renderLFAComponent();
    } else if (showCaseSheet) {
      return renderBasicCase();
    } else if (isProfile) {
      return (
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
                      background: '#198754',
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
                      background: '#dc3545',
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
              {!editableFields && (
                <>
                  {!showCaseSheet ? (
                    <button
                      className="btn"
                      onClick={handleFloatingButtonClick}
                      title={'View Cases'}
                      style={{
                        backgroundColor: '#f4e9d8',
                        height: '40px',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 500,
                        width: '120px',
                      }}
                    >
                      {'View Cases'}
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {/* Edit Icon */}
          <div className="text-center mb-3">
            {editableFields ? (
              <FaLock
                onClick={handleProfileEdit}
                style={{
                  cursor: 'pointer',
                  color: '#d3b386',
                  fontSize: '1.2rem',
                }}
              />
            ) : (
              <FaEdit
                onClick={handleProfileEdit}
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
                  value={adminData?.name || ''}
                  onChange={(e) => handleChange(e, 'name')}
                  placeholder="Enter Name"
                  type="text"
                  required
                  readOnly={!editableFields}
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
                  value={adminData?.email || ''}
                  onChange={(e) => handleChange(e, 'email')}
                  placeholder="Enter Email"
                  type="email"
                  required
                  readOnly={!editableFields}
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
                  value={adminData?.phone || ''}
                  onChange={handlePhoneChange}
                  disabled={!editableFields}
                  inputStyle={{
                    width: '100%',
                    border: '1px solid #18273e',
                    boxShadow: 'none',
                    height: '38px',
                    fontSize: '0.9rem',
                  }}
                  containerStyle={{
                    width: '100%',
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
                  value={adminData?.password || ''}
                  onChange={(e) => handleChange(e, 'password')}
                  placeholder="Enter Password"
                  type="password"
                  required
                  readOnly={!editableFields}
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
                      cursor: editableFields ? 'pointer' : 'default',
                      border: '1px solid #18273e',
                      color: '#18273e',
                      fontSize: '0.9rem',
                      height: '38px',
                    }}
                    onClick={editableFields ? toggleDropdown : undefined}
                  >
                    {selectedRole || 'Select Role'} <FaChevronDown />
                  </div>
                  {dropdownOpen && editableFields && (
                    <ul
                      className="list-group position-absolute bg-dark border rounded shadow w-100 mt-1"
                      style={{ zIndex: 1000 }}
                    >
                      {['client', 'lawyer', 'finance', 'receptionist', 'admin'].map((role) => (
                        <li
                          key={role}
                          className="list-group-item list-group-item-action text-white bg-dark border-secondary"
                          style={{
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                          }}
                          onClick={() => handleRoleSelect(role)}
                        >
                          {role.charAt(0).toUpperCase() + role.slice(1)}
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
                        readOnly={!editableFields}
                        value={adminData?.experience || ''}
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
                        readOnly={!editableFields}
                        value={adminData?.fee || ''}
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
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="gap-3 text-center d-flex flex-column justify-content-center align-items-center h-100 w-100">
        <GrContactInfo className="fs-1" />
        <div>
          <h4>Admin Detail</h4>
          <p>Click any Admin to view details</p>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        boxShadow: '5px 5px 5px gray',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#d2a85a #16213e',
        padding: '20px',
        textAlign: 'left',
      }}
    >
      {/* Close Button at the Top Level */}
      {shouldShow && !showCaseSheet && (
        <button
          title="Close"
          onClick={onClose}
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
      {renderContent()}

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
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 1, gap: 1, justifyContent: 'center' }}>
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
    </div>
  );
};

export default ViewUsersAdminWidget;
