import React, { useState, useRef, useEffect } from "react";
import "./AddUser.css";
import "bootstrap/dist/css/bootstrap.min.css";
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
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ApiEndPoint } from "../Component/utils/utlis";

const AddUser = () => {
  const [selectedRole, setSelectedRole] = useState("client");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Form fields

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("");
  const [location, setLocation] = useState("");
  const [expertise, setExpertise] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const dropdownRef = useRef(null);

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
      const formData = new FormData();
      formData.append("UserName", name);
      formData.append("Email", email);
      formData.append("Password", password);
      formData.append("Role", selectedRole);
      formData.append("Contact", contactNumber);
      formData.append("Bio", bio);
      formData.append("Address", address);
      formData.append("Position", position);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await fetch(`${ApiEndPoint}users`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      alert("✅ User Added Successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSelectedRole("");
      setContactNumber("");
      setBio("");
      setAddress("");
      setPosition("");
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      alert("❌ Failed to Add User! Check Console.");
      console.error("Error adding user:", error);
    }
  };

  // Close dropdown if clicking outside
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

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <div
      className="container card shadow m-0"
      style={{
        height: "86.6vh",
        overflowY: "auto",
      }}
    >
      <div
        className="card shadow p-4 m-2"
        style={{
          height: "84vh",
          overflowY: "auto",
          backgroundColor: "#1d3557",
        }}
      >
        {/* Role Selection Dropdown */}
        <div
          className="mb-3 position-relative d-flex justify-content-end"
          ref={dropdownRef}
        >
          <button className="btn btn-light text-start" onClick={toggleDropdown}>
            {selectedRole || "Select Role"} <FaChevronDown className="ms-2" />
          </button>
          {dropdownOpen && (
            <ul className="list-group position-absolute bg-white border rounded shadow w-auto end-0">
              {["client", "lawyer", "finance"].map((role) => (
                <li
                  key={role}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleRoleSelect(role)}
                >
                  {role}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Profile Picture Upload */}
        <div className="mb-3 d-flex justify-content-center">
          <label htmlFor="fileUpload" className="d-block">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="rounded-circle"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div
                className="border d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  border: "2px dashed #ccc",
                  cursor: "pointer",
                }}
              >
                <FaUpload className="fs-4 text-white" />
              </div>
            )}
          </label>
          <input
            type="file"
            id="fileUpload"
            className="d-none"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Form Fields */}
        <div className="row">
          {[
            { label: "Name", icon: <FaUser />, state: name, setState: setName },
            {
              label: "Email",
              icon: <FaRegEnvelope />,
              state: email,
              setState: setEmail,
              type: "email",
            },
            {
              label: "Contact Number",
              icon: <FaPhone />,
              state: contactNumber,
              setState: setContactNumber,
            },
            {
              label: "Password",
              icon: <FaLock />,
              state: password,
              setState: setPassword,
              type: "password",
            },
            {
              label: "Confirm Password",
              icon: <FaLock />,
              state: confirmPassword,
              setState: setConfirmPassword,
              type: "password",
            },
            {
              label: "Address",
              icon: <FaMapMarkerAlt />,
              state: address,
              setState: setAddress,
            },
            {
              label: "Language",
              icon: <FaGlobe />,
              state: language,
              setState: setLanguage,
            },
            selectedRole !== "client" && {
              label: "Location",
              icon: <FaMapMarkedAlt />,
              state: location,
              setState: setLocation,
            },
            selectedRole !== "client" && {
              label: "Expertise",
              icon: <FaBriefcase />,
              state: expertise,
              setState: setExpertise,
            },
            selectedRole !== "client" && {
              label: "Department",
              icon: <FaBuilding />,
              state: department,
              setState: setDepartment,
            },
            selectedRole !== "client" && {
              label: "Position",
              icon: <FaChair />,
              state: position,
              setState: setPosition,
            },
          ]
            .filter(Boolean)
            .map(({ label, icon, state, setState, type = "text" }, index) => (
              <div key={index} className="col-md-6 mb-3">
                <label className="form-label form-label1 text-white">
                  {label}
                </label>
                <div className="input-group">
                  <span className="input-group-text customIcon text-white bg-transparent border-white">
                    {icon}
                  </span>
                  <input
                    type={type}
                    className="form-control  form-control1 text-white bg-transparent border-white"
                    placeholder={label}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Bio Section */}
        {selectedRole !== "client" && (
          <div className="mb-3">
            <label className="form-label form-label1 text-white">Bio</label>
            <textarea
              className="form-control form-control1 text-white bg-transparent border-white"
              placeholder="Short bio"
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
        )}

        {/* Submit Button */}
        <div className="text-center mt-3">
          <button
            className="btn btn-primary"
            style={{
              backgroundColor: "#d3b386",
            }}
            onClick={handleAddUser}
          >
            Add User
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
