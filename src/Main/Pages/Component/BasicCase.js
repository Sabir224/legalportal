import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BasicCase.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../REDUX/sliece";
import * as XLSX from "xlsx";
import filepath from "../../../utils/dataset.csv";
import axios from "axios";
import { ApiEndPoint } from "./utils/utlis";
import CaseAssignmentForm from "../cases/CaseAssignment";
import { Dropdown, Modal } from "react-bootstrap";

const BasicCase = ({ token }) => {
  const [caseNumber, setCaseNumber] = useState("");
  const [caseName, setCaseName] = useState("");
  const [check, setcheck] = useState(true);
  const screen = useSelector((state) => state.screen.value);
  // console.log("_________Token:0", token.Role);

  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleOpenModal = (caseId) => {
    setSelectedCase(caseId);
    setShowAssignModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedCase(null);
  };
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);
  // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  // Function to fetch cases
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

  const handleEdit = (index, value) => {
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
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track open dropdown index
  // Calculate total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Get data for the current page
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Handle page navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to fetch and parse the Excel file

  // Load the file automatically when the component mounts
  useEffect(() => {
    //  loadExcelFile();
  }, []);

  return (
    <div
      className="container-fluid m-0 p-0"
      style={{ height: "84vh", overflowY: "auto" }}
    >
      <div className="card mb-3 shadow">
        <div
          className="card-header d-flex justify-content-between align-items-center px-3"
          style={{ height: "8vh" }}
        >
          <span className="col text-start">Status</span>
          <span className="col text-start">Case Number</span>
          <span className="col text-start">Case Type</span>
          <span className="col text-start">Purpose</span>
          <span className="col text-end">Action</span>
        </div>

        <div className="card-list p-0">
          {getCurrentPageData().map((item, index) => (
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
                    className={`me-2 rounded-circle ${
                      item.Status.toLowerCase() === "case filed"
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
                <input
                  className="col w-100"
                  type="text"
                  value={item.notes || ""}
                  onChange={(e) => handleEdit(index, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Permission Dropdown */}
                <div className="col text-end">
                  <Dropdown
                    show={dropdownOpen === index}
                    onToggle={(isOpen) =>
                      setDropdownOpen(isOpen ? index : null)
                    }
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

                    {/* Dropdown Menu */}
                    <Dropdown.Menu
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "0",
                        zIndex: 1050,
                        minWidth: "150px",
                        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {token.Role === "admin" && (
                        <Dropdown.Item
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenModal(item?._id);
                          }}
                        >
                          Assign Case
                        </Dropdown.Item>
                      )}

                      <Dropdown.Item>View Details</Dropdown.Item>
                      <Dropdown.Item>Other Action</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          id="numberbar"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "sticky",
            bottom: "10px",
            backgroundColor: "#18273e",
            zIndex: 10,
            padding: "10px",
            borderRadius: "8px",
            width: "20%", // Reduced size
            textAlign: "center",
            border: "2px solid #d4af37",
            margin: "auto", // Centers the div
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="first-lastbutton"
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
              style={{
                width: "50px", // Slightly reduced input width
                textAlign: "center",
                borderRadius: "6px",
                border: "2px solid #d4af37",
                backgroundColor: "#18273e",
                color: "white",
              }}
            />
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="first-lastbutton"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Case Permissions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CaseAssignmentForm
            selectedCase={selectedCase}
            onClose={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BasicCase;
