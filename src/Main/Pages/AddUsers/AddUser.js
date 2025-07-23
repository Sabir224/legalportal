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
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ApiEndPoint } from '../Component/utils/utlis';
import { useDispatch } from 'react-redux';
import { screenChange } from '../../../REDUX/sliece';
import { BsPerson } from 'react-icons/bs';
import { useAlert } from '../../../Component/AlertContext';

const AddUser = () => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState('client');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Form fields

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [language, setLanguage] = useState('');
  const [location, setLocation] = useState('');
  const [expertise, setExpertise] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const dropdownRef = useRef(null);
  const { showLoading, showSuccess, showError } = useAlert();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setDropdownOpen(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddUser = async () => {
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
    <div
      className="card shadow container-fluid m-0 p-3 p-md-5 justify-content-center"
      style={{
        maxHeight: '86vh',

        overflowY: 'auto',
        // maxWidth: '1200px', // Added max-width for better control on larger screens
        margin: '0 auto', // Center the container
      }}
    >
      {/* Profile Picture Upload */}
      <div className="mb-3 d-flex justify-content-center">
        <label htmlFor="fileUpload" className="d-block">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="rounded-circle"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              className="border d-inline-flex align-items-center justify-content-center"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                border: '2px solid #18273e',
                cursor: 'pointer',
                backgroundColor: '#18273e',
              }}
            >
              <FaUpload className="fs-4 text-white" />
            </div>
          )}
        </label>
        <input type="file" id="fileUpload" className="d-none" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Form Fields */}
      <div className="row g-3">
        {' '}
        {/* Added g-3 for consistent gutter spacing */}
        {[
          { label: 'Name', icon: <FaUser />, state: name, setState: setName },
          {
            label: 'Email',
            icon: <FaRegEnvelope />,
            state: email,
            setState: setEmail,
            type: 'email',
          },
          {
            label: 'Contact Number',
            icon: <FaPhone />,
            state: contactNumber,
            setState: setContactNumber,
          },
          {
            label: 'Password',
            icon: <FaLock />,
            state: password,
            setState: setPassword,
            type: 'password',
          },
          {
            label: 'Confirm Password',
            icon: <FaLock />,
            state: confirmPassword,
            setState: setConfirmPassword,
            type: 'password',
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
            label: 'Expertise',
            icon: <FaBriefcase />,
            state: expertise,
            setState: setExpertise,
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
          .map(({ label, icon, state, setState, type = 'text' }, index) => (
            <div key={index} className="col-12 col-md-6 mb-3">
              <label className="form-label" style={{ color: '#18273e' }}>
                {label}
              </label>
              <div className="input-group">
                <span className="input-group-text customIcon">{icon}</span>
                <input
                  type={type}
                  className="form-control"
                  placeholder={label}
                  value={state}
                  style={{
                    border: '1px solid #18273e',
                    minWidth: '0', // Changed from fixed width to flexible
                  }}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
          ))}
        {/* Role Dropdown */}
        <div className="col-12 col-md-6 mb-3">
          <label className="form-label" style={{ color: '#18273e' }}>
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
                  minWidth: '0', // Changed from fixed width to flexible
                }}
                onClick={toggleDropdown}
              >
                {selectedRole.toUpperCase() || 'Select Role'} <FaChevronDown />
              </div>
              {dropdownOpen && (
                <ul
                  className="list-group position-absolute w-100 mt-1"
                  style={{
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}
                >
                  {['client', 'lawyer', 'finance', 'receptionist', 'paralegal'].map((role) => (
                    <li
                      key={role}
                      className="list-group-item list-group-item-action"
                      style={{
                        cursor: 'pointer',
                        backgroundColor: '#18273e',
                        color: 'white',
                        borderColor: '#d3b386',
                      }}
                      onClick={() => handleRoleSelect(role)}
                    >
                      {role.toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {selectedRole !== 'client' && (
        <div className="mb-3">
          <label className="form-label" style={{ color: '#18273e' }}>
            Bio
          </label>
          <textarea
            className="form-control"
            placeholder="Short bio"
            rows="3"
            value={bio}
            style={{ border: '1px solid #18273e' }}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center mt-3">
        <button
          className="btn btn-primary px-4 py-2" // Added padding for better touch targets
          style={{
            backgroundColor: '#d3b386',
            border: 'none',
            minWidth: '150px', // Ensures button has good size on mobile
          }}
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>
    </div>
  );
};

export default AddUser;
