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
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ApiEndPoint } from '../Component/utils/utlis';
import { useDispatch } from 'react-redux';
import { screenChange } from '../../../REDUX/sliece';
import { BsPerson } from 'react-icons/bs';
import { useAlert } from '../../../Component/AlertContext';
import PhoneInput from 'react-phone-input-2';

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
  const dropdownRef = useRef(null);
  const { showLoading, showSuccess, showError } = useAlert();
  const services = [
    { name: 'Divorce', description: 'Marriage dissolution and related matters' },
    { name: 'Property', description: 'Real estate transactions and disputes' },
    { name: 'Criminal', description: 'Defense and legal representation' },
    { name: 'Immigration', description: 'Visa and citizenship processes' },
    { name: 'Corporate', description: 'Business formation and compliance' },

    // Added UpdateSubtypelist items
    { name: 'Civil Case', description: 'Civil Case related legal services' },
    { name: 'Commercial Law', description: 'Commercial Law related legal services' },
    { name: 'Criminal Case', description: 'Criminal Case related legal services' },
    { name: 'Family Law', description: 'Family Law related legal services' },
    { name: 'Real Estate Case', description: 'Real Estate Case related legal services' },
    { name: 'Labor Case', description: 'Labor Case related legal services' },
    { name: 'Construction Case', description: 'Construction Case related legal services' },
    { name: 'Maritime Case', description: 'Maritime Case related legal services' },
    { name: 'Personal Injury Case', description: 'Personal Injury Case related legal services' },
    { name: 'Technology Case', description: 'Technology Case related legal services' },
    { name: 'Financial Case', description: 'Financial Case related legal services' },
    { name: 'Public Law', description: 'Public Law related legal services' },
    { name: 'Consumer Case', description: 'Consumer Case related legal services' },
    { name: 'Environmental Case', description: 'Environmental Case related legal services' },
  ];

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const toggleRoleDropdown = (e) => {
    e.preventDefault(); // Prevent form submission
    setRoleDropdownOpen(!roleDropdownOpen);
    setServicesDropdownOpen(false); // Close other dropdown when opening this one
  };
  const handleServiceSelect = (serviceName) => {
    setExpertise(serviceName);
    setServicesDropdownOpen(false); // Close the dropdown after selection
  };

  const toggleServicesDropdown = (e) => {
    e.preventDefault(); // Prevent form submission
    setServicesDropdownOpen(!servicesDropdownOpen);
    setRoleDropdownOpen(false); // Close other dropdown when opening this one
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
              {
                label: 'Language',
                icon: <FaGlobe />,
                state: language,
                setState: setLanguage,
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
                <div className="input-group">
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
                      onClick={toggleRoleDropdown}
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
                          overflow: 'hidden',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        }}
                        role="listbox"
                      >
                        {['client', 'lawyer', 'finance', 'receptionist', 'paralegal'].map((role) => (
                          <li
                            key={role}
                            className="list-group-item list-group-item-action px-3 py-2"
                            style={{
                              cursor: 'pointer',
                              backgroundColor: role === selectedRole ? '#F8D4A1' : 'white',
                              border: 'none',
                              borderBottom: '1px solid #f0f0f0',
                              transition: 'all 0.2s ease',
                              fontSize: '0.95rem',
                            }}
                            onClick={() => handleRoleSelect(role)}
                            role="option"
                            aria-selected={role === selectedRole}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5e9d9')}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundColor = role === selectedRole ? '#F8D4A1' : 'white')
                            }
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
                  <div className="input-group">
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
                          {services.map((service) => (
                            <li
                              key={service.name}
                              className="list-group-item list-group-item-action px-3 py-2"
                              style={{
                                cursor: 'pointer',
                                backgroundColor: service.name === expertise ? '#F8D4A1' : 'white',
                                border: 'none',
                                borderBottom: '1px solid #f0f0f0',
                                transition: 'all 0.2s ease',
                                fontSize: '0.95rem',
                              }}
                              onClick={() => handleServiceSelect(service.name)} // Use the new handler
                              role="option"
                              aria-selected={service.name === expertise}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5e9d9')}
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  service.name === expertise ? '#F8D4A1' : 'white')
                              }
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
                <>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="experience-input" className="form-label fw-medium" style={{ color: '#18273e' }}>
                        Years of Experience
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: '#18273e',
                            color: '#d4af37',
                            borderColor: '#18273e',
                            width: '45px',
                            padding: '0.375rem',
                          }}
                        >
                          <FaCalendarAlt style={{ fontSize: '1rem' }} />
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          id="experience-input"
                          value={experience}
                          style={{
                            borderColor: '#18273e',
                          }}
                          onChange={(e) => setExperience(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="mb-3">
                      <label htmlFor="fee-input" className="form-label fw-medium" style={{ color: '#18273e' }}>
                        Consultation Fee
                      </label>
                      <div className="input-group">
                        <span
                          className="input-group-text d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: '#18273e',
                            color: '#d4af37',
                            borderColor: '#18273e',
                            width: '45px',
                            padding: '0.375rem',
                            fontSize: '1rem',
                          }}
                        >
                          <FaDollarSign />
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          id="fee-input"
                          value={fee}
                          style={{
                            borderColor: '#18273e',
                          }}
                          onChange={(e) => setFee(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </>
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
    </div>
  );
};

export default AddUser;
