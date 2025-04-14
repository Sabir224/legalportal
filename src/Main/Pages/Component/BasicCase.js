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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const casesPerPage = 50; // Show 50 cases per page
  const [filters, setFilters] = useState({
    status: "All",
    caseType: "All",
    priority: "All",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  // console.log("_________Token:0", token.Role);

  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [casedetails, setcasedetails] = useState(null);

  const handleOpenModal = (caseinfo) => {
    // console.log("CaseId:", caseId);
    setSelectedCase(caseinfo?._id);
    setcasedetails(caseinfo)
    setShowAssignModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedCase(null);
  };
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  // Function to fetch cases

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
  // const handleSearch = (query) => {
  //   setSearchQuery(query);

  //   if (!query) {
  //     setFilteredData(data);
  //     return;
  //   }

  //   const lowerCaseQuery = query.toLowerCase();

  //   const filtered = data.filter(
  //     (item) =>
  //       item.CaseNumber.toLowerCase().includes(lowerCaseQuery) ||
  //       item.Name.toLowerCase().includes(lowerCaseQuery) ||
  //       item.Status.toLowerCase().includes(lowerCaseQuery)
  //   );

  //   setFilteredData(filtered);
  // };
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

    // Apply search filter
    if (searchQuery) {
      filteredCases = filteredCases.filter((item) =>
        item.CaseNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== "All") {
      filteredCases = filteredCases.filter(
        (item) => item.Status === filters.status
      );
    }

    // Apply case type filter
    if (filters.caseType && filters.caseType !== "All") {
      filteredCases = filteredCases.filter(
        (item) => item.Name === filters.caseType
      );
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== "All") {
      filteredCases = filteredCases.filter(
        (item) => item.Priority === filters.priority
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredCases.sort((a, b) => {
        if (filters.sortOrder === "asc") {
          return a[filters.sortBy] > b[filters.sortBy] ? 1 : -1;
        } else {
          return a[filters.sortBy] < b[filters.sortBy] ? 1 : -1;
        }
      });
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * casesPerPage;
    const paginatedCases = filteredCases.slice(
      startIndex,
      startIndex + casesPerPage
    );

    return paginatedCases;
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
      }); // API endpoint
      console.log("data of case", response.data.data); // Assuming the API returns data in the `data` field
      setData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);
  // Handle page navigation
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

  return (
    <div
      className="container-fluid m-0 p-0"
      style={{ height: "84vh", overflowY: "auto" }}
    >
      {/* Search Input */}

      {/* Filters Container */}

      <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
        {/* Search Input on the Left */}
        <input
          type="text"
          className="form-control me-3"
          style={{ maxWidth: "250px" }} // Adjust width as needed
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Filter & Sorting Dropdowns */}
        <div className="d-flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            className="form-select w-auto"
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Case Type Filter */}
          <select
            className="form-select w-auto"
            onChange={(e) => handleFilterChange("caseType", e.target.value)}
          >
            <option value="All">All Case Types</option>
            <option value="Civil">Civil</option>
            <option value="Criminal">Criminal</option>
            <option value="Family">Family</option>
          </select>

          {/* Priority Filter */}
          <select
            className="form-select w-auto"
            onChange={(e) => handleFilterChange("priority", e.target.value)}
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Sorting Options */}
          <select
            className="form-select w-auto"
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="createdAt">Sort by Created Date</option>
            <option value="updatedAt">Sort by Updated Date</option>
            <option value="CaseNumber">Sort by Case Number</option>
          </select>

          <select
            className="form-select w-auto"
            onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

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
          {getFilteredCases().map((item, index) => (
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
                    className={`me-2 rounded-circle ${item.Status.toLowerCase() === "case filed"
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
                  {item["CaseType"]}
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
                            handleOpenModal(item);
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
        {totalPages > 1 &&

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
              width: "20%",
              textAlign: "center",
              border: "2px solid #d4af37",
              margin: "auto",
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
                  width: "50px",
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
        }
      </div>

      {/* Assign Modal */}
      <Modal show={showAssignModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Case Permissions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CaseAssignmentForm
            selectedCase={selectedCase}
            casedetails={casedetails}
            onClose={handleCloseModal}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BasicCase;
