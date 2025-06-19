import React, { useState, useRef, useEffect } from "react";
import "./AddCase.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { ApiEndPoint } from "../Component/utils/utlis";
import { useSelector } from "react-redux";

import { Bs123, BsPerson, BsType } from "react-icons/bs";
import axios from "axios";
import { useAlert } from "../../../Component/AlertContext";
import {
  FaAudioDescription,
  FaChevronDown,
  FaRegEnvelope,
} from "react-icons/fa";

const AddCase = () => {
  const [Priority, setPriority] = useState("High");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [caseTypedropdownOpen, setCaseTypedropdownOpen] = useState(false);
  const [caseSubTypedropdownOpen, setCaseSubTypedropdownOpen] = useState(false);
  const selectedclientdetails = null
  // const selectedclientdetails = useSelector(
  //   (state) => state.screen.clientEmail
  // );
  // Form fields
  const [casenumber, setCaseNumber] = useState("");
  const [clientname, setClientname] = useState("");
  const [casetype, setCaseType] = useState("Consultation");
  const [caseSubType, setCaseSubType] = useState("Civil Law");
  const [discription, setDiscription] = useState("");

  const [PreviewCaseId, setPreviewCaseId] = useState("");
  const dropdownRef = useRef(null);
  const regexCaseNumber = /^[a-zA-Z0-9\s/]+$/; // Letters, numbers, spaces, and slashes
  const regexClientName = /^[a-zA-Z\s]+$/; // Letters and spaces
  const regexCaseType = /^[a-zA-Z\s-]+$/; // Letters and spaces

  const { showLoading, showSuccess, showError } = useAlert();
  useEffect(() => {


    fetchNextCaseId();
  }, [PreviewCaseId]);

  const Subtypelist = [
    "Civil Case",
    "Commercial Law",
    "Criminal Case",
    "Family Law",
    "Real Estate Case",
    "Labor Case",
    "Construction Case",
    "Maritime Case",
    "Personal Injury Case", ,
    "Technology Case",
    "Financial Case",
    "Public Law",
    "Consumer Case",
    "Environmental Case"

  ]
  // const Subtypelist = [
  //   "Alternative Dispute Resolution (ADR)",
  //   "Arbitration Law",
  //   "Banking Law",
  //   "Media Law",
  //   "Civil Law",
  //   "Commercial Law",
  //   "Construction Law",
  //   "Criminal Law",
  //   "Corporate Services",
  //   "Debit Collection",
  //   "Family Law",
  //   "Fintech Law",
  //   "Intellectual Property Law",
  //   "Inheritance Law",
  //   "DIFC Legal Services ",
  //   "Mergers & Acquisitions",
  //   "Maritime Law",
  //   "Rental & Tenancy",
  //   "Real Estate Law",
  //   "Insurance Law",
  //   "Wills Registration",
  //   "Labor Law",
  // ]

  const fetchNextCaseId = async () => {
    const res = await fetch(`${ApiEndPoint}getNextCaseId`);
    const data = await res.json();
    setPreviewCaseId(data.nextCaseId);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleCaseTypeDropdown = () => setCaseTypedropdownOpen(!caseTypedropdownOpen);
  const toggleCaseSubTypeDropdown = () => setCaseSubTypedropdownOpen(!caseSubTypedropdownOpen);
  const handleRoleSelect = (role) => {
    setPriority(role);
    setDropdownOpen(false);
  };
  const handleCaseTypeRoleSelect = (role) => {
    setCaseType(role);
    setCaseTypedropdownOpen(false);
  };
  const handleCaseSubTypeRoleSelect = (role) => {
    setCaseSubType(role);
    setCaseSubTypedropdownOpen(false);
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

  const handleaddCase = async () => {
    let caseData = {
      Status: "Open",
      CaseNumber: casenumber,
      Name: selectedclientdetails?.UserName,
      CaseType: casetype,
      CaseSubType: caseSubType,
      Description: discription,
      Priority: Priority,
      IsDubiCourts: false,
      ClientId: selectedclientdetails?._id,
    };
    if (!regexCaseNumber.test(casenumber)) {
      showError(
        "Case Number should contain only letters, numbers, spaces, and slashes."
      );

      return;
    }

    if (!regexClientName.test(clientname)) {
      showError("Client Name should contain only letters and spaces.");

      return;
    }

    if (!regexCaseType.test(casetype)) {
      showError("Case Type should contain only letters and spaces.");

      return;
    }

    console.log("Case Data=", caseData)
    try {
      showLoading();
      const reponse = await axios.post(`${ApiEndPoint}cases`, caseData);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      showSuccess("Form submitted successfully!");
      console.log("reponse=", reponse.data)
      fetchNextCaseId();
      setClientname("")
      setCaseNumber("");
      setCaseType("");
      setDiscription("");
    } catch (error) {
      if (error.response) {
        showError("Error submitting the form.Check Case Number or Case Type.", error.response);
      } else {
        showError("Network or server error:", error.message);
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
          // maxHeight: "80vh", // Adjust as needed for header/footer
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
              // {
              //   label: "Client Name",
              //   icon: <BsPerson className="fs-5" />,
              //   state: selectedclientdetails?.UserName,
              //   setState: setClientname,
              // },
              {
                label: "Client Name",
                icon: <BsPerson className="fs-5" />,
                state: clientname,
                setState: setClientname,
              },
              // {
              //   label: "Case Type",
              //   icon: <BsType className="fs-5" />,
              //   state: casetype,
              //   setState: setCaseType,
              // },
              {
                label: "Description (Optional)",
                icon: <FaAudioDescription className="fs-5" />,
                state: discription,
                setState: setDiscription,
              },
              // {
              //   label: "Client Email",
              //   icon: <FaRegEnvelope className="fs-5" />,
              //   state: selectedclientdetails?.Email,
              // },
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



            <div className="col-12 col-md-6">
              <label
                className="form-label fw-semibold mb-2 d-block"
                style={{
                  color: "#18273e",
                  fontSize: "0.95rem",
                  letterSpacing: "0.3px",
                }}
              >
                Case Type
              </label>
              <div className="input-group">
                <div className="position-relative w-100" ref={dropdownRef}>
                  <button
                    className="form-control text-start d-flex align-items-center justify-content-between py-2 px-3"
                    style={{
                      cursor: "pointer",
                      border: "1px solid #d3b386",
                      borderRadius: "6px",
                      backgroundColor: caseTypedropdownOpen ? "#fff9f0" : "white",
                      boxShadow: "none",
                      height: "auto",
                      minHeight: "42px",
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                    }}
                    onClick={toggleCaseTypeDropdown}
                    aria-expanded={caseTypedropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <span>{casetype || "Select Case type"}</span>
                    <FaChevronDown
                      className={`transition-all fs-6 ${caseTypedropdownOpen ? "rotate-180" : ""
                        }`}
                      style={{ color: "#18273e" }}
                    />
                  </button>
                  {caseTypedropdownOpen && (
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
                      {["Consultation", "Litigation", "Non-Litigation"].map((role) => (
                        <li
                          key={role}
                          className="list-group-item list-group-item-action px-3 py-2"
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              role === casetype ? "#F8D4A1" : "white",
                            border: "none",
                            borderBottom: "1px solid #f0f0f0",
                            transition: "all 0.2s ease",
                            fontSize: "0.95rem",
                          }}
                          onClick={() => handleCaseTypeRoleSelect(role)}
                          role="option"
                          aria-selected={role === casetype}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f5e9d9")
                          }
                          onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            role === casetype ? "#F8D4A1" : "white")
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



            <div className="col-12 col-md-6">
              <label
                className="form-label fw-semibold mb-2 d-block"
                style={{
                  color: "#18273e",
                  fontSize: "0.95rem",
                  letterSpacing: "0.3px",
                }}
              >
                Case Sub Type
              </label>
              <div className="input-group">
                <div className="position-relative w-100" ref={dropdownRef}>
                  <button
                    className="form-control text-start d-flex align-items-center justify-content-between py-2 px-3"
                    style={{
                      cursor: "pointer",
                      border: "1px solid #d3b386",
                      borderRadius: "6px",
                      backgroundColor: caseSubTypedropdownOpen ? "#fff9f0" : "white",
                      boxShadow: "none",
                      height: "auto",
                      minHeight: "42px",
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                    }}
                    onClick={toggleCaseSubTypeDropdown}
                    aria-expanded={caseSubTypedropdownOpen}
                    aria-haspopup="listbox"
                  >
                    <span>{caseSubType || "Select Case SUb type"}</span>
                    <FaChevronDown
                      className={`transition-all fs-6 ${caseSubTypedropdownOpen ? "rotate-180" : ""
                        }`}
                      style={{ color: "#18273e" }}
                    />
                  </button>
                  {caseSubTypedropdownOpen && (
                    <ul
                      className="list-group position-absolute w-100 mt-1 shadow-sm"
                      style={{
                        zIndex: 1000,
                        border: "1px solid #d3b386",
                        borderRadius: "6px",
                        overflow: "hidden",
                        maxHeight: "200px", // Fixed height for scroll
                        overflowY: "auto", // Enable vertical scrolling
                        // minWidth: "100%",
                      }}
                      role="listbox"
                    >
                      {Subtypelist.map((role) => (
                        <li
                          key={role}
                          className="list-group-item list-group-item-action px-3 py-2"
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              role === caseSubType ? "#F8D4A1" : "white",
                            border: "none",
                            borderBottom: "1px solid #f0f0f0",
                            transition: "all 0.2s ease",
                            fontSize: "0.95rem",
                          }}
                          onClick={() => handleCaseSubTypeRoleSelect(role)}
                          role="option"
                          aria-selected={role === caseSubType}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f5e9d9")
                          }
                          onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            role === caseSubType ? "#F8D4A1" : "white")
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
                      className={`transition-all fs-6 ${dropdownOpen ? "rotate-180" : ""
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
