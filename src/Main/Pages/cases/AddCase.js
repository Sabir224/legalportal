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
    const selectedclientdetails = useSelector((state) => state.screen.clientEmail);
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
    const dropdownRef = useRef(null);

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
            "Status": "Open",
            "CaseNumber": casenumber,
            "Name": selectedclientdetails?.UserName,
            "CaseType": casetype,
            "Description": discription,
            "Priority": Priority,
            "ClientId": selectedclientdetails?._id
        }

        console.log("before Api calling", caseData)
        try {
            const response = await axios.post(`${ApiEndPoint}cases`, caseData);
            console.log('Case added successfully:', response.data.case);
        } catch (error) {
            if (error.response) {
                console.error('API error:', error.response);
            } else {
                console.error('Network or server error:', error.message);
            }
        }
    };

    return (
        <div
            className="container card shadow m-0 p-5"
            style={{
                height: "86.6vh",
                overflowY: "auto",
            }}
        >
            {/* <div
        className="card shadow p-4 m-2"
        style={{
          height: "84vh",
          overflowY: "auto",
          backgroundColor: "white",
        }}
      > */}
            {/* Role Selection Dropdown */}
            {/* <div
          className="mb-3 position-relative d-flex justify-content-end"
          ref={dropdownRef}
        >
          <button className="btn btn-light text-start" onClick={toggleDropdown}>
            {selectedRole || "Select Role"} <FaChevronDown className="ms-2" />
          </button>
          {dropdownOpen && (
            <ul className="list-group position-absolute bg-white border rounded shadow w-auto end-0">
              {["client", "lawyer", "finance", "receptionist"].map((role) => (
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
        </div> */}

            {/* Profile Picture Upload */}
            {/* <div className="mb-3 d-flex justify-content-center">
                <label htmlFor="fileUpload" className="d-block">
                    {selectedclientdetails.ProfilePicture && selectedclientdetails.ProfilePicture !== null ? (
                        <img
                            src={selectedclientdetails.ProfilePicture}
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
                                border: "2px solid #18273e",
                                cursor: "pointer",
                                backgroundColor: "#18273e",
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
            </div> */}

            {/* Form Fields */}
            <div className="row">
                {[
                    { label: "Case Id", icon: <Bs123 />, state: casenumber, setState: setCaseNumber },
                    { label: "Client Name", icon: <BsPerson />, state: selectedclientdetails.UserName, setState: setClientname },
                    { label: "Case Type", icon: <BsType />, state: casetype, setState: setCaseType },
                    { label: "Description (Optional)", icon: <FaAudioDescription />, state: discription, setState: setDiscription },
                    // { label: "Priority", icon: <FaLock />, state: confirmPassword, setState: setConfirmPassword },
                    { label: "Client Email", icon: <FaRegEnvelope />, state: selectedclientdetails.Email },
                    // { label: "Language", icon: <FaGlobe />, state: language, setState: setLanguage },
                    // selectedRole !== "client" && { label: "Location", icon: <FaMapMarkedAlt />, state: location, setState: setLocation },
                    // selectedRole !== "client" && { label: "Expertise", icon: <FaBriefcase />, state: expertise, setState: setExpertise },
                    // selectedRole !== "client" && { label: "Department", icon: <FaBuilding />, state: department, setState: setDepartment },
                    // selectedRole !== "client" && { label: "Position", icon: <FaChair />, state: position, setState: setPosition },
                ]
                    .filter(Boolean)
                    .map(({ label, icon, state, setState, type = "text" }, index) => (
                        <div key={index} className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: '#18273e' }}>{label}</label>
                            <div className="input-group">
                                <span className="input-group-text customIcon  ">
                                    {icon}
                                </span>
                                <input
                                    type={type}
                                    className="form-control"
                                    placeholder={label}
                                    value={state}
                                    style={{ minWidth: '300px', border: '1px solid #18273e' }}
                                    onChange={(e) => setState(e.target.value)}
                                    disabled={label !== "Client Email" ? label !== 'Client Name' ? "" : true : true}
                                />
                            </div>
                        </div>
                    ))}

                <div className="mb-3 col-md-6">
                    <label className="form-label" style={{ color: '#18273e' }}>Priority</label>
                    <div className="input-group">
                        <div className="position-relative w-100" ref={dropdownRef}>
                            <div
                                className="form-control  d-flex align-items-center justify-content-between"
                                style={{ cursor: "pointer", minWidth: '300px', border: '1px solid #18273e', color: "#18273e" }}

                                onClick={toggleDropdown}
                            >
                                {Priority || "Select Role"} <FaChevronDown />
                            </div>
                            {dropdownOpen && (
                                <ul className="list-group position-absolute bg-dark border rounded shadow w-100 mt-1" style={{ zIndex: 1000 }}>
                                    {["High", "Meduim", "Low"].map((role) => (
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






            {/* Submit Button */}
            <div className="text-center mt-3">
                <button
                    className="btn btn-primary"
                    style={{
                        backgroundColor: "#d3b386",
                    }}
                    onClick={handleaddCase}
                >
                    Add Case
                </button>
            </div>
            {/* </div> */}
        </div>
    );
};

export default AddCase;
