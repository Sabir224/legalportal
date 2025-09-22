import React, { useState, useRef, useEffect } from 'react';
import './AddUser.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaUpload,
  FaBell,
  FaBars,
  FaTrash,
  FaBriefcase,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaChevronDown,
  FaGlobe,
  FaMapMarkedAlt,
  FaBuilding,
  FaChair,
  FaRegEnvelope,
  FaFilter,
  FaUserTag,
  FaCalendarAlt,
  FaDollarSign,
  FaAccessibleIcon,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ApiEndPoint } from '../Component/utils/utlis';
import { useDispatch } from 'react-redux';
import { screenChange } from '../../../REDUX/sliece';
import { BsPerson } from 'react-icons/bs';
import { useAlert } from '../../../Component/AlertContext';
import PhoneInput from 'react-phone-input-2';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import LanguageDropdown from './widgets/LanguageSelection';

const AddUser = () => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState('client');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [fee, setFee] = useState('');
  const [avialability, setAvailabilty] = useState('');
  const dropdownRef = useRef(null);
  const { showLoading, showSuccess, showError } = useAlert();
  const [availabilityDropdownOpen, setAvailabilityDropdownOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);

  // Refs for dropdowns
  const roleDropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);
  const availabilityDropdownRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState({ role: -1, services: -1, availability: -1 });
  // Options with DB value -> Human-readable label
  // DB values in array (for order + index navigation)
  const availabilityValues = ['InPerson', 'Online', 'InPerson/Online'];

  const availabilityOptions = {
    InPerson: 'In Person',
    Online: 'Online',
    'InPerson/Online': 'In Person & Online',
  };

  const roleOptions = ['client', 'lawyer', 'finance', 'receptionist', 'paralegal'];

  const handleAvailabilitySelect = (option) => {
    setSelectedAvailability(option);
    setAvailabilityDropdownOpen(false);
  };
  const services = [
    { name: 'Civil Law', description: 'Civil law related legal services' },
    { name: 'Commercial Law', description: 'Commercial law related legal services' },
    { name: 'Criminal Law', description: 'Criminal law related legal services' },
    { name: 'Family Law', description: 'Family law related legal services' },
    { name: 'Real Estate Law', description: 'Real estate law related legal services' },
    { name: 'Labour Law', description: 'Labour law related legal services' },
    { name: 'Construction Law', description: 'Construction law related legal services' },
    { name: 'Maritime Law', description: 'Maritime law related legal services' },
    { name: 'Personal Injury Law', description: 'Personal injury law related legal services' },
    { name: 'Technology Law', description: 'Technology law related legal services' },
    { name: 'Financial Law', description: 'Financial law related legal services' },
    { name: 'Public Law', description: 'Public law related legal services' },
    { name: 'Consumer Law', description: 'Consumer law related legal services' },
    { name: 'Environmental Law', description: 'Environmental law related legal services' },
    {
      name: 'Estate / Succession / Inheritance Law',
      description: 'Estate, succession, and inheritance legal services',
    },
    { name: 'Insurance Law', description: 'Insurance-related legal services' },
    { name: 'Banking and Investment Law', description: 'Banking and investment related legal services' },
    { name: 'Tax Law', description: 'Tax-related legal services' },
    { name: 'Rental Law', description: 'Rental and tenancy-related legal services' },
    { name: 'Intellectual Property Law', description: 'Intellectual property legal services' },
    { name: 'Debt Collection Law', description: 'Debt collection related legal services' },
    { name: 'Capital Funds Law', description: 'Capital funds and investment-related legal services' },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  // Handle keyboard navigation for dropdowns
  const handleKeyDown = (dropdownType, e) => {
    if (!['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) return;

    e.preventDefault();
    const options = {
      role: roleOptions,
      services: services.map((s) => s.name),
      availability: availabilityOptions,
    }[dropdownType];

    let newIndex = focusedIndex[dropdownType];

    switch (e.key) {
      case 'ArrowDown':
        newIndex = (newIndex + 1) % options.length;
        break;
      case 'ArrowUp':
        newIndex = (newIndex - 1 + options.length) % options.length;
        break;
      case 'Enter':
        if (newIndex >= 0) {
          handleDropdownSelect(dropdownType, options[newIndex]);
        }
        return;
      case 'Escape':
        closeDropdown(dropdownType);
        return;
      default:
        return;
    }

    setFocusedIndex({ ...focusedIndex, [dropdownType]: newIndex });
  };
  const handleDropdownSelect = (dropdownType, value) => {
    switch (dropdownType) {
      case 'role':
        handleRoleClick(value);
        break;
      case 'services':
        handleServiceSelect(value);
        break;
      case 'availability':
        handleAvailabilitySelect(value);
        break;
      default:
        break;
    }
  };
  const closeDropdown = (dropdownType) => {
    switch (dropdownType) {
      case 'role':
        setRoleDropdownOpen(false);
        break;
      case 'services':
        setServicesDropdownOpen(false);
        break;
      case 'availability':
        setAvailabilityDropdownOpen(false);
        break;
      default:
        break;
    }
    setFocusedIndex({ ...focusedIndex, [dropdownType]: -1 });
  };
  const toggleRoleDropdown = (e) => {
    e.preventDefault();
    const newState = !roleDropdownOpen;
    setRoleDropdownOpen(newState);
    setServicesDropdownOpen(false);
    setAvailabilityDropdownOpen(false);

    if (newState) {
      const currentIndex = roleOptions.indexOf(selectedRole);
      setFocusedIndex({ ...focusedIndex, role: currentIndex >= 0 ? currentIndex : 0 });
    }
  };
  const toggleServicesDropdown = (e) => {
    e.preventDefault();
    const newState = !servicesDropdownOpen;
    setServicesDropdownOpen(newState);
    setRoleDropdownOpen(false);
    setAvailabilityDropdownOpen(false);

    if (newState) {
      const currentIndex = services.findIndex((s) => s.name === expertise);
      setFocusedIndex({ ...focusedIndex, services: currentIndex >= 0 ? currentIndex : 0 });
    }
  };
  const toggleAvailabilityDropdown = (e) => {
    e.preventDefault();
    const newState = !availabilityDropdownOpen;
    setAvailabilityDropdownOpen(newState);
    setRoleDropdownOpen(false);
    setServicesDropdownOpen(false);

    if (newState) {
      const currentIndex = availabilityOptions.indexOf(selectedAvailability);
      setFocusedIndex({ ...focusedIndex, availability: currentIndex >= 0 ? currentIndex : 0 });
    }
  };
  const handleRoleClick = (role) => {
    setPendingRole(role);
    setConfirmOpen(true);
  };

  const handleServiceSelect = (serviceName) => {
    setExpertise(serviceName);
    setServicesDropdownOpen(false);
    setFocusedIndex({ ...focusedIndex, services: -1 });
  };

  const handleConfirm = () => {
    setSelectedRole(pendingRole);
    setConfirmOpen(false);
    setRoleDropdownOpen(false);
  };

  const handleCancel = () => {
    setPendingRole(null);
    setConfirmOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(false);
        setFocusedIndex({ ...focusedIndex, role: -1 });
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
        setFocusedIndex({ ...focusedIndex, services: -1 });
      }
      if (availabilityDropdownRef.current && !availabilityDropdownRef.current.contains(event.target)) {
        setAvailabilityDropdownOpen(false);
        setFocusedIndex({ ...focusedIndex, availability: -1 });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [focusedIndex]);

  const handleAvailbilityeSelect = (available) => {
    setSelectedAvailability(available);
    setRoleDropdownOpen(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setRoleDropdownOpen(false);
    if (role === 'client') {
      setExpertise('');
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      showLoading();
      const formData = new FormData();
      formData.append('UserName', name);
      formData.append('Email', email);
      formData.append('Password', password);
      formData.append('Role', selectedRole);
      formData.append('Contact', contactNumber);
      formData.append('Bio', bio);
      formData.append('Address', address);
      formData.append('Position', position);
      formData.append('YearOfExperience', experience);
      formData.append('ConsultationFee', fee);
      formData.append('Language', language);
      formData.append('Expertise', expertise);
      formData.append('Department', department);
      formData.append('Location', location); // If needed in backend
      formData.append('Availability', selectedAvailability);

      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await fetch(`${ApiEndPoint}users`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      dispatch(screenChange(9));
      showSuccess('✅ User Added Successfully!');

      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setSelectedRole('');
      setContactNumber('');
      setBio('');
      setAddress('');
      setPosition('');
      setSelectedFile(null);
      setPreview(null);
      setExperience('');
      setExpertise('');
      setDepartment('');
      setLocation('');
      setSelectedAvailability('');
      setFee('');
    } catch (error) {
      showError('❌ Failed to Add User! Check Console.');
      console.error('Error adding user:', error);
    }
  };

  // Close dropdown if clicking outside
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

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div className="container-fluid p-1 min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow m-3 p-3"
        style={{
          width: '100%',
          maxWidth: '1200px',
          maxHeight: '70vh',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
          border: 'none',
        }}
      >
        {/* Profile Picture Upload */}
        <div className="mb-4 d-flex justify-content-center">
          <label htmlFor="fileUpload" className="d-block cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="rounded-circle img-thumbnail"
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderColor: '#18273e',
                }}
              />
            ) : (
              <div
                className="d-flex flex-column align-items-center justify-content-center rounded-circle"
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: '#18273e',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                <FaUpload className="fs-3 mb-1" />
                <small className="text-center">Upload Photo</small>
              </div>
            )}
          </label>
          <input type="file" id="fileUpload" className="d-none" accept="image/*" onChange={handleFileChange} />
        </div>

        <form onSubmit={handleAddUser}>
          {/* Form Fields with labels on top */}
          <div className="row g-3">
            {[
              { label: 'Name', icon: <FaUser />, state: name, setState: setName, required: true },
              {
                label: 'Email',
                icon: <FaRegEnvelope />,
                state: email,
                setState: setEmail,
                type: 'email',
                required: true,
              },
              {
                label: 'Password',
                icon: <FaLock />,
                state: password,
                setState: setPassword,
                type: 'password',
                required: true,
              },
              {
                label: 'Confirm Password',
                icon: <FaLock />,
                state: confirmPassword,
                setState: setConfirmPassword,
                type: 'password',
                required: true,
              },
              {
                label: 'Address',
                icon: <FaMapMarkerAlt />,
                state: address,
                setState: setAddress,
              },

              selectedRole !== 'client' && {
                label: 'Location',
                icon: <FaMapMarkedAlt />,
                state: location,
                setState: setLocation,
              },
              selectedRole !== 'client' && {
                label: 'Department',
                icon: <FaBuilding />,
                state: department,
                setState: setDepartment,
              },
              selectedRole !== 'client' && {
                label: 'Position',
                icon: <FaChair />,
                state: position,
                setState: setPosition,
              },
            ]
              .filter(Boolean)
              .map(({ label, icon, state, setState, type = 'text', required = false }, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-4">
                  <div className="mb-3">
                    <label htmlFor={`input-${label}`} className="form-label fw-medium" style={{ color: '#18273e' }}>
                      {label} {required && <span className="text-danger">*</span>}
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{
                          backgroundColor: '#18273e',
                          color: '#d4af37',
                          borderColor: '#18273e',
                        }}
                      >
                        {icon}
                      </span>
                      <input
                        type={type}
                        className="form-control"
                        id={`input-${label}`}
                        value={state}
                        style={{
                          borderColor: '#18273e',
                        }}
                        onChange={(e) => setState(e.target.value)}
                        required={required}
                      />
                    </div>
                  </div>
                </div>
              ))}
            {/* <div className="col-12 col-sm-6 col-lg-4">
              <div className="mb-3">
                <label
                  className="form-label fw-semibold mb-2 d-block"
                  style={{ color: '#18273e', fontSize: '0.95rem' }}
                >
                  Languages <span className="text-danger">*</span>
                </label>
                <LanguageDropdown selectedLanguages={language} setSelectedLanguages={setLanguage} />
              </div>
            </div> */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="mb-3">
                <label className="form-label fw-medium" style={{ color: '#18273e' }}>
                  Contact Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{
                      backgroundColor: '#18273e',
                      color: '#d4af37',
                      borderColor: '#18273e',
                    }}
                  >
                    <FaPhone />
                  </span>
                  <div
                    style={{
                      flex: 1,
                      position: 'relative',
                      border: '1px solid #18273e',
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: 'white',
                    }}
                  >
                    <PhoneInput
                      international
                      Country={'AE'}
                      value={contactNumber}
                      onChange={setContactNumber}
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
              </div>
            </div>

            {/* Role Dropdown */}
            <div className="col-12 col-sm-6 col-lg-4">
              <div className="mb-3">
                <label
                  className="form-label fw-semibold mb-2 d-block"
                  style={{
                    color: '#18273e',
                    fontSize: '0.95rem',
                    letterSpacing: '0.3px',
                  }}
                >
                  Role <span className="text-danger">*</span>
                </label>
                <div className="input-group" ref={roleDropdownRef}>
                  <div className="position-relative w-100">
                    <button
                      type="button"
                      className="form-control text-start d-flex align-items-center justify-content-between py-2 px-3"
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #d3b386',
                        borderRadius: '6px',
                        backgroundColor: 'white',
                        boxShadow: 'none',
                        minHeight: '42px',
                        fontSize: '0.95rem',
                      }}
                      onClick={toggleRoleDropdown}
                      onKeyDown={(e) => handleKeyDown('role', e)}
                      aria-expanded={roleDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      <span>{selectedRole || 'Select Role'}</span>
                      <FaChevronDown
                        className={`transition-all fs-6 ${roleDropdownOpen ? 'rotate-180' : ''}`}
                        style={{ color: '#18273e' }}
                      />
                    </button>
                    {roleDropdownOpen && (
                      <ul
                        className="list-group position-absolute w-100 mt-1 shadow-sm"
                        style={{
                          zIndex: 1000,
                          border: '1px solid #d3b386',
                          borderRadius: '6px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                        role="listbox"
                      >
                        {roleOptions.map((role, index) => (
                          <li
                            key={role}
                            className="list-group-item list-group-item-action px-3 py-2"
                            style={{
                              cursor: 'pointer',
                              backgroundColor:
                                index === focusedIndex.role ? '#f5e9d9' : role === selectedRole ? '#F8D4A1' : 'white',

                              borderBottom: index !== roleOptions.length - 1 ? '1px solid black' : 'none', // divider
                              fontSize: '0.95rem',
                            }}
                            onClick={() => handleRoleClick(role)}
                            onMouseEnter={() => setFocusedIndex({ ...focusedIndex, role: index })}
                            role="option"
                            aria-selected={role === selectedRole}
                          >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Services Dropdown (for non-client roles) */}
            {selectedRole !== 'client' && (
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="mb-3">
                  <label
                    className="form-label fw-semibold mb-2 d-block"
                    style={{
                      color: '#18273e',
                      fontSize: '0.95rem',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Services
                  </label>
                  <div className="input-group" ref={servicesDropdownRef}>
                    <div className="position-relative w-100">
                      <button
                        type="button"
                        className="form-control text-start d-flex align-items-center justify-content-between py-2 px-3"
                        style={{
                          cursor: 'pointer',
                          border: '1px solid #d3b386',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          boxShadow: 'none',
                          height: 'auto',
                          minHeight: '42px',
                          fontSize: '0.95rem',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={toggleServicesDropdown}
                        onKeyDown={(e) => handleKeyDown('services', e)}
                        aria-expanded={servicesDropdownOpen}
                        aria-haspopup="listbox"
                      >
                        <span>{expertise || 'Select a service'}</span>
                        <FaChevronDown
                          className={`transition-all fs-6 ${servicesDropdownOpen ? 'rotate-180' : ''}`}
                          style={{ color: '#18273e' }}
                        />
                      </button>
                      {servicesDropdownOpen && (
                        <ul
                          className="list-group position-absolute w-100 mt-1 shadow-sm"
                          style={{
                            zIndex: 1000,
                            border: '1px solid #d3b386',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                          role="listbox"
                        >
                          {services.map((service, index) => (
                            <li
                              key={service.name}
                              className="list-group-item list-group-item-action px-3 py-2"
                              style={{
                                cursor: 'pointer',
                                backgroundColor:
                                  index === focusedIndex.services
                                    ? '#f5e9d9'
                                    : service.name === expertise
                                    ? '#F8D4A1'
                                    : 'white',
                                border: 'none',
                                borderBottom: '1px solid #f0f0f0',
                                transition: 'all 0.2s ease',
                                fontSize: '0.95rem',
                              }}
                              onClick={() => handleServiceSelect(service.name)}
                              onMouseEnter={() => setFocusedIndex({ ...focusedIndex, services: index })}
                              role="option"
                              aria-selected={service.name === expertise}
                            >
                              {service.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Conditional Fields for Non-Client Roles */}
          {selectedRole && selectedRole !== 'client' && (
            <div className="row g-3 mt-2">
              {/* Lawyer-specific fields */}

              {selectedRole === 'lawyer' && (
                <div className="col-12 col-md-4">
                  <div className="mb-3">
                    <label
                      className="form-label fw-medium mb-2 d-block"
                      style={{
                        color: '#18273e',
                        fontSize: '0.95rem',
                        letterSpacing: '0.3px',
                      }}
                    >
                      Availability <span className="text-danger">*</span>
                    </label>
                    <div className="input-group" ref={availabilityDropdownRef}>
                      <div className="position-relative w-100">
                        <button
                          type="button"
                          className="form-control text-start d-flex align-items-center justify-content-between py-2 px-3"
                          style={{
                            cursor: 'pointer',
                            border: '1px solid #18273e',
                            borderRadius: '6px',
                            backgroundColor: 'white',
                            height: '42px',
                            fontSize: '0.95rem',
                          }}
                          onClick={toggleAvailabilityDropdown}
                          onKeyDown={(e) => handleKeyDown('availability', e)}
                          aria-expanded={availabilityDropdownOpen}
                          aria-haspopup="listbox"
                        >
                          <span>
                            {selectedAvailability
                              ? availabilityOptions[selectedAvailability] // show label
                              : 'Select Availability'}
                          </span>
                          <FaChevronDown
                            className={`transition-all fs-6 ${availabilityDropdownOpen ? 'rotate-180' : ''}`}
                            style={{ color: '#18273e' }}
                          />
                        </button>

                        {availabilityDropdownOpen && (
                          <ul
                            className="list-group position-absolute w-100 mt-1 shadow-sm"
                            style={{
                              zIndex: 1000,
                              border: '1px solid #d3b386',
                              borderRadius: '6px',
                              maxHeight: '200px',
                              overflowY: 'auto',
                            }}
                            role="listbox"
                          >
                            {Object.entries(availabilityOptions).map(([value, label], index) => (
                              <li
                                key={value}
                                className="list-group-item list-group-item-action px-3 py-2"
                                style={{
                                  cursor: 'pointer',
                                  backgroundColor:
                                    index === focusedIndex.availability
                                      ? '#f5e9d9'
                                      : value === selectedAvailability
                                      ? '#F8D4A1'
                                      : 'white',
                                  border: 'none',
                                  borderBottom: '1px solid #f0f0f0',
                                  fontSize: '0.95rem',
                                }}
                                onClick={() => handleAvailabilitySelect(value)} // store DB value
                                onMouseEnter={() => setFocusedIndex({ ...focusedIndex, availability: index })}
                                role="option"
                                aria-selected={value === selectedAvailability}
                              >
                                {label} {/* show human-readable label */}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bio Field */}
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="bio-input" className="form-label fw-medium" style={{ color: '#18273e' }}>
                    Bio
                  </label>
                  <textarea
                    className="form-control"
                    id="bio-input"
                    style={{
                      borderColor: '#18273e',
                      height: '100px',
                    }}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
            <button
              className="btn px-4 py-2 fw-bold"
              type="submit"
              style={{
                backgroundColor: '#d3b386',
                color: '#18273e',
                border: 'none',
                minWidth: '200px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        PaperProps={{
          sx: {
            textAlign: 'center',
            p: 3,
            borderRadius: '12px',
            border: '2px solid #d4af37',
            backgroundColor: 'rgba(24, 39, 62, 0.95)', // dark blue bg
            color: 'white', // white text
          },
        }}
      >
        <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#d4af37' }}>
          Confirm Role Selection
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              textAlign: 'center',
              fontSize: '1rem',
              color: 'white',
              mb: 2,
            }}
          >
            Are you sure you want to add this as{' '}
            <b style={{ color: '#d4af37' }}>
              {pendingRole && pendingRole.charAt(0).toUpperCase() + pendingRole.slice(1)}
            </b>
            ?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              borderColor: '#d4af37',
              color: '#d4af37',
              '&:hover': { borderColor: '#fff', color: '#fff' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              backgroundColor: '#d4af37',
              color: '#18273e',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#b8962f' },
            }}
            autoFocus
          >
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddUser;
