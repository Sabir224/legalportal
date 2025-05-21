import React, { useState, useRef, useEffect } from "react";
import "./AddCase.css";
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
  FaFilter,
  FaMailBulk,
  FaAudioDescription,
  FaTypo3,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ApiEndPoint } from "../Component/utils/utlis";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../REDUX/sliece";
import { Bs123, BsPerson, BsType } from "react-icons/bs";
import axios from "axios";

const AddCase = () => {
  const dispatch = useDispatch();
  const [Priority, setPriority] = useState("High");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const selectedclientdetails = useSelector(
    (state) => state.screen.clientEmail
  );
  // Form fields
  // console.log("clientEmail", clientEmail)
  const [casenumber, setCaseNumber] = useState("");
  const [clientname, setClientname] = useState("");
  const [casetype, setCaseType] = useState("");
  const [discription, setDiscription] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientmail, setclientmail] = useState("");
  const [bio, setBio] = useState("");
  const [language, setLanguage] = useState("");
  const [location, setLocation] = useState("");
  const [expertise, setExpertise] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [PreviewCaseId, setPreviewCaseId] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNextCaseId = async () => {
      const res = await fetch(`${ApiEndPoint}getNextCaseId`);
      const data = await res.json();
      setPreviewCaseId(data.nextCaseId);
    };

    fetchNextCaseId();
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleRoleSelect = (role) => {
    setPriority(role);
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
    // try {
    //   const formData = new FormData();
    //   formData.append("UserName", name);
    //   formData.append("Email", email);
    //   formData.append("Password", password);
    //   formData.append("Role", selectedRole);
    //   formData.append("Contact", contactNumber);
    //   formData.append("Bio", bio);
    //   formData.append("Address", address);
    //   formData.append("Position", position);
    //   if (selectedFile) {
    //     formData.append("file", selectedFile);
    //   }
    //   const response = await fetch(`${ApiEndPoint}users`, {
    //     method: "POST",
    //     body: formData,
    //   });
    //   if (!response.ok) {
    //     throw new Error("Failed to add user");
    //   }
    //   dispatch(screenChange(9));
    //   alert("✅ User Added Successfully!");
    //   setName("");
    //   setEmail("");
    //   setPassword("");
    //   setConfirmPassword("");
    //   setSelectedRole("");
    //   setContactNumber("");
    //   setBio("");
    //   setAddress("");
    //   setPosition("");
    //   setSelectedFile(null);
    //   setPreview(null);
    // } catch (error) {
    //   alert("❌ Failed to Add User! Check Console.");
    //   console.error("Error adding user:", error);
    // }
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

  const handleaddCase = async () => {
    let caseData = {
      Status: "Open",
      CaseNumber: casenumber,
      Name: selectedclientdetails?.UserName,
      CaseType: casetype,
      Description: discription,
      Priority: Priority,
      ClientId: selectedclientdetails?._id,
    };

    console.log("before Api calling", caseData);
    try {
      const response = await axios.post(`${ApiEndPoint}cases`, caseData);
      console.log("Case added successfully:", response.data.case);
      // dispatch(screenChange(9));
      alert("✅ Case Added Successfully!");

      setCaseNumber("");
      setCaseType("");
      setDiscription("");
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response);
      } else {
        console.error("Network or server error:", error.message);
      }
    }
  };

  return (
    <div
      className="container-fluid p-0 mb-1 d-flex justify-content-center"
      style={{ height: "86.6vh", overflow: "hidden" }}
    >
      <div
        className="card shadow-sm mx-3 mx-md-5 mt-2 mt-md-3 mb-2 border-0 d-flex flex-column"
        style={{
          borderRadius: "12px",
          maxHeight: "80vh", // Adjust as needed for header/footer
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Scrollable Form Body */}
        <div
          className="card-body p-3 p-md-4"
          style={{
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          {/* Form Fields */}
          <div className="row g-4">
            {[
              {
                label: "Case Id",
                icon: <Bs123 className="fs-5" />,
                state: PreviewCaseId,
              },
              {
                label: "Case Number",
                icon: <Bs123 className="fs-5" />,
                state: casenumber,
                setState: setCaseNumber,
              },
              {
                label: "Client Name",
                icon: <BsPerson className="fs-5" />,
                state: selectedclientdetails?.UserName,
                setState: setClientname,
              },
              {
                label: "Case Type",
                icon: <BsType className="fs-5" />,
                state: casetype,
                setState: setCaseType,
              },
              {
                label: "Description (Optional)",
                icon: <FaAudioDescription className="fs-5" />,
                state: discription,
                setState: setDiscription,
              },
              {
                label: "Client Email",
                icon: <FaRegEnvelope className="fs-5" />,
                state: selectedclientdetails?.Email,
              },
            ]
              .filter(Boolean)
              .map(({ label, icon, state, setState, type = "text" }, index) => (
                <div key={index} className="col-12 col-md-6">
                  <label
                    className="form-label fw-semibold mb-2 d-block"
                    style={{
                      color: "#18273e",
                      fontSize: "0.95rem",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {label}
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text bg-light"
                      style={{
                        border: "1px solid #d3b386",
                        borderRight: "none",
                        borderTopLeftRadius: "6px",
                        borderBottomLeftRadius: "6px",
                        color: "#18273e",
                        padding: "0.5rem 0.75rem",
                      }}
                    >
                      {icon}
                    </span>
                    <input
                      type={type}
                      className="form-control"
                      placeholder={label}
                      value={state}
                      style={{
                        border: "1px solid #d3b386",
                        borderLeft: "none",
                        borderTopRightRadius: "6px",
                        borderBottomRightRadius: "6px",
                        boxShadow: "none",
                        backgroundColor: !setState ? "#f8f9fa" : "white",
                        fontSize: "0.95rem",
                        padding: "0.5rem 0.75rem",
                        height: "auto",
                        minHeight: "42px",
                      }}
                      onChange={(e) => setState && setState(e.target.value)}
                      disabled={!setState}
                    />
                  </div>
                </div>
              ))}

            {/* Priority Dropdown */}
            <div className="col-12 col-md-6">
              <label
                className="form-label fw-semibold mb-2 d-block"
                style={{
                  color: "#18273e",
                  fontSize: "0.95rem",
                  letterSpacing: "0.3px",
                }}
              >
                Priority
              </label>
              <div className="input-group">
                <div className="position-relative w-100" ref={dropdownRef}>
                  <button
                    className="form-control text-start d-flex align-items-center justify-content-between py-2 px-3"
                    style={{
                      cursor: "pointer",
                      border: "1px solid #d3b386",
                      borderRadius: "6px",
                      backgroundColor: dropdownOpen ? "#fff9f0" : "white",
                      boxShadow: "none",
                      height: "auto",
                      minHeight: "42px",
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                    }}
                    onClick={toggleDropdown}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <span>{Priority || "Select Priority"}</span>
                    <FaChevronDown
                      className={`transition-all fs-6 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                      style={{ color: "#18273e" }}
                    />
                  </button>
                  {dropdownOpen && (
                    <ul
                      className="list-group position-absolute w-100 mt-1 shadow-sm"
                      style={{
                        zIndex: 1000,
                        border: "1px solid #d3b386",
                        borderRadius: "6px",
                        overflow: "hidden",
                      }}
                      role="listbox"
                    >
                      {["High", "Medium", "Low"].map((role) => (
                        <li
                          key={role}
                          className="list-group-item list-group-item-action px-3 py-2"
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              role === Priority ? "#F8D4A1" : "white",
                            border: "none",
                            borderBottom: "1px solid #f0f0f0",
                            transition: "all 0.2s ease",
                            fontSize: "0.95rem",
                          }}
                          onClick={() => handleRoleSelect(role)}
                          role="option"
                          aria-selected={role === Priority}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f5e9d9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              role === Priority ? "#F8D4A1" : "white")
                          }
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

          {/* Submit Button */}
          <div className="text-center mt-3 pt-3">
            <button
              className="btn px-5 py-2 fw-semibold"
              style={{
                backgroundColor: "#d3b386",
                color: "white",
                border: "1px solid #c9a677",
                minWidth: "180px",
                borderRadius: "6px",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(210, 180, 140, 0.3)",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={handleaddCase}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c9a677";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(210, 180, 140, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d3b386";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(210, 180, 140, 0.3)";
              }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>Add Case</span>
              <span
                className="position-absolute top-0 left-0 w-100 h-100 bg-white opacity-0"
                style={{
                  transition: "all 0.3s ease",
                  zIndex: 0,
                }}
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCase;
