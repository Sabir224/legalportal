import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BasicCase.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Caseinfo, screenChange } from "../../../REDUX/sliece";
import * as XLSX from "xlsx";
import filepath from "../../../utils/dataset.csv";
import axios from "axios";
import { ApiEndPoint } from "./utils/utlis";
import CaseAssignmentForm from "../cases/CaseAssignment";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { Backdrop, CircularProgress } from "@mui/material";
import { useAlert } from "../../../Component/AlertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const BasicCase = ({ token }) => {
  const [caseNumber, setCaseNumber] = useState("");
  const [caseName, setCaseName] = useState("");
  const [check, setcheck] = useState(true);
  const screen = useSelector((state) => state.screen.value);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showCaseStages, setShowCaseStages] = useState(false);
  const [showCaseType, setShowCaseType] = useState(false);
  const [showSubCaseType, setShowSubCaseType] = useState(false);
  const [showCloseType, setShowCloseType] = useState(false);
  const [showStatusFilter, setStatusFilter] = useState(false);
  const [showCaseFilter, setCaseFilter] = useState(false);
  const [showCaseTypeFilter, setCaseTypeFilter] = useState(false);
  const [showCaseSubTypeFilter, setCaseSubTypeFilter] = useState(false);
  // const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCourtCaseId, setSelectedCourtCaseId] = useState("");
  const [selectedCaseType, setSelectedCaseType] = useState();
  const [selectedSubCaseType, setSelectedSubCaseType] = useState();
  const [selectedCloseType, setSelectedCloseType] = useState();
  const [selectedCaseStage, setSelectedCaseStage] = useState("");
  const [availableCases, setAvailableCases] = useState([]); // populate this list as needed

console.log("Token change =",token?.Role)
  const reduxCaseCloseType = useSelector((state) => state.screen.CloseType);


  const { showLoading, showDataLoading,showSuccess, showError } = useAlert();

  const casesPerPage = 50; // Show 50 cases per page
  const [filters, setFilters] = useState({
    status: [],       // Array of selected statuses
    CaseType: [],     // Array of selected case types
    CaseSubType: [],     // Array of selected case types
    priority: [],     // Optional if you add it later
    sortBy: "CaseNumber",
    sortOrder: "desc",
  });

  // console.log("_________Token:0", token.Role);

  const COURT_STAGES = [
    "Pre-Litigation",
    "Filing a Case",
    "Initial Review",
    "Evidence Submission",
    "Hearings",
    "Judgment",
    "Appeals",
    "Execution",
    "Specialized Stages",
    "Under Review"
  ];

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
  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [casedetails, setcasedetails] = useState(null);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const updateFunction = async (item) => {
    setLoaderOpen(true); // 🔄 Show loader before request

    try {
      const response = await fetch(
        "https://api.aws-legalgroup.com/Receive_Case_Number",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            SerialNumber: item["SerialNumber"],
          }),
        }
      );

      const result = await response.json();
      console.log("✅ Server response:", result);

      return result;
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoaderOpen(false); // ✅ Hide loader after response or error
    }
  };

  const handleOpenModal = (caseinfo) => {
    // console.log("CaseId:", caseId);
    setSelectedCase(caseinfo?._id);
    setcasedetails(caseinfo);
    setShowAssignModal(true);
  };
  const handleUpdateStatus = async (caseinfo) => {
    // console.log("CaseId:", caseId);
    setSelectedCase(caseinfo?._id);
    try {
      const response = await axios.put(`${ApiEndPoint}updateCaseStatus/${caseinfo?._id}`);
      fetchCases()
      console.log("Status updated:", response.data);
      // Optionally update UI or state here
    } catch (error) {
      console.error("Error updating case status:", error.response?.data || error.message);
    }
    setcasedetails(caseinfo);
  };


  const mergeCaseWithCourt = async (oldCaseId, newCaseId) => {

    //  console.log(oldCaseId,"  oldCaseId   ",newCaseId)
    try {
      const response = await axios.put(
        `${ApiEndPoint}MergeCaseWithCourt/${oldCaseId}/${newCaseId}`
      );
      showSuccess("Merge Successfully")
      fetchCases()
      console.log("response.data of merge", response.data);
    } catch (error) {
      console.error("Error merging cases:", error);
      showError("Error merging cases");
    }
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
    dispatch(Caseinfo(item));
    console.log("  global.CaseId ", item._id);
    localStorage.removeItem("redirectPath");
    localStorage.removeItem("pendingCaseId");
    localStorage.removeItem("pendingUserId");
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
    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterType] || [];

      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // Remove if already selected
        : [...currentValues, value];               // Add if not selected

      return {
        ...prevFilters,
        [filterType]: updatedValues,
      };
    });

    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getFilteredCases = () => {
    let filteredCases = data;

    // Apply search filter across multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredCases = filteredCases.filter((item) =>
        Object.entries(item).some(([key, value]) => {
          if (
            typeof value !== "string" ||
            ["_id", "createdAt", "updatedAt"].includes(key)
          ) {
            return false;
          }
          return value.toLowerCase().includes(query);
        })
      );
    }

    // Filter by multiple selected statuses
    if (filters.status && filters.status.length > 0) {
      filteredCases = filteredCases.filter((item) =>
        filters.status.includes(item.Status)
      );
    }

    // Filter by multiple selected CaseTypes
    if (filters.CaseType && filters.CaseType.length > 0) {
      filteredCases = filteredCases.filter((item) =>
        filters.CaseType.includes(item.CaseType)
      );
    }
    if (filters.CaseSubType && filters.CaseSubType.length > 0) {
      filteredCases = filteredCases.filter((item) =>
        filters.CaseSubType.includes(item.CaseSubType)
      );
    }

    // Filter by multiple selected priorities (optional)
    if (filters.priority && filters.priority.length > 0) {
      filteredCases = filteredCases.filter((item) =>
        filters.priority.includes(item.Priority)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredCases.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];

        if (aVal == null || bVal == null) return 0;

        if (filters.sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filteredCases;
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // const fetchCases = async () => {
  //   try {
  //     const response = await axios.get(`${ApiEndPoint}getcase`, {
  //       withCredentials: true,
  //     }); // API endpoint
  //     console.log("data of case", response.data.data); // Assuming the API returns data in the `data` field
  //     setData(response.data.data);
  //     setLoading(false);
  //   } catch (err) {
  //     setError(err.message);
  //     setLoading(false);
  //   }
  // };

  const fetchCases = async () => {
    showDataLoading(true)
    try {
      const response = await axios.get(`${ApiEndPoint}getcase`, {
        withCredentials: true,
      });

      const allCases = response.data.data;
      let filteredCases = [];
      console.log("reduxCaseCloseType=", reduxCaseCloseType)
      if (token.Role?.toLowerCase() === "client") {
        // Show only client's own cases
        filteredCases = allCases.filter(
          (caseItem) => (caseItem.ClientId === token._id && caseItem.Status !== "Closed" && caseItem.CloseType === reduxCaseCloseType)
        );
      } else if (token.Role?.toLowerCase() === "admin") {
        // Admin sees all cases
        filteredCases = allCases.filter(
          (caseItem) => (caseItem.CloseType === reduxCaseCloseType)
        );
      } else {
        // Legal users: show only assigned cases
        filteredCases = allCases.filter((caseItem) =>
          caseItem.AssignedUsers?.some(
            (user) => (user.UserId?.toString() === token._id?.toString() && caseItem.Status !== "Closed" && caseItem.CloseType === reduxCaseCloseType)
          )
        );
      }

      await setData(filteredCases);
      showDataLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };




  const updateCaseStage = async (caseId, newStage) => {
    try {
      const response = await axios.put(`${ApiEndPoint}updateCaseStage/${caseId}/${newStage}`);

      console.log("Update successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating case stage:", error.response?.data || error.message);
    }
  };



  const updateCaseTypeAndFolder = async (caseId, newCaseType) => {
    try {
      showLoading()
      const response = await axios.post(
        `${ApiEndPoint}updateCaseTypeAndFolder/${caseId}/${newCaseType}`
      );
      fetchCases()
      showSuccess("✅ Success:", response.data.message);
      console.log("🔄 Updated Folder Name:", response.data.updatedFolderName);
    } catch (error) {
      console.log("error", error?.response?.data?.message)
      showError(`❌ Error: ${error?.response?.data?.message}`);
    }
  };
  const updateCaseSubTypeAndFolder = async (caseId, newCaseType) => {
    try {
      showLoading()
      const response = await axios.post(
        `${ApiEndPoint}updateCaseSubType/${caseId}/${newCaseType}`
      );
      fetchCases()
      showSuccess("✅ Success:", response.data.message);
      console.log("🔄 Updated CaseType:", response.data.Case);
    } catch (error) {
      console.log("error", error?.response?.data?.message)
      showError(`❌ Error: ${error?.response?.data?.message}`);
    }
  };
  const updateCaseCloseType = async (caseId, newCaseCloseType) => {
    try {
      console.log("caseId", caseId)
      showLoading()
      const response = await axios.put(
        `${ApiEndPoint}updateCloseType/${caseId}/${newCaseCloseType}`
      );
      fetchCases()
      showSuccess("✅ Success:", response.data.message);
      console.log("🔄 Updated CaseType:", response.data.Case);
    } catch (error) {
      console.log("error", error?.response?.data?.message)
      showError(`❌ Error: ${error?.response?.data?.message}`);
    }
  };

  useEffect(() => {
    console.log("Token received in useEffect:", token);
    if (token && token._id && token.Role) {
      fetchCases();
    }
  }, [token,reduxCaseCloseType]);

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

  // return (
  //   <div
  //     className="container-fluid m-0 p-0"
  //     style={{ height: "84vh", overflowY: "auto" }}
  //   >
  //     {/* Search Input */}

  //     {/* Filters Container */}

  // <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
  //     //   {/* Search Input on the Left */}
  //   <input
  //     type="text"
  //     className="form-control me-3"
  //     style={{ maxWidth: "250px" }} // Adjust width as needed
  //     placeholder="Search..."
  //     value={searchQuery}
  //     onChange={(e) => handleSearch(e.target.value)}
  //   />

  //     //   {/* Filter & Sorting Dropdowns */}
  //   <div className="d-flex flex-wrap gap-2">
  //     {/* Status Filter */}
  //     <select
  //       className="form-select w-auto"
  //       onChange={(e) => handleFilterChange("status", e.target.value)}
  //     >
  //       <option value="All">All Status</option>
  //       <option value="Open">Open</option>
  //       <option value="Closed">Closed</option>
  //       <option value="Pending">Pending</option>
  //     </select>

  //     {/* Case Type Filter */}
  //     <select
  //       className="form-select w-auto"
  //       onChange={(e) => handleFilterChange("caseType", e.target.value)}
  //     >
  //       <option value="All">All Case Types</option>
  //       <option value="Civil">Civil</option>
  //       <option value="Criminal">Criminal</option>
  //       <option value="Family">Family</option>
  //     </select>

  //     {/* Priority Filter */}
  //     <select
  //       className="form-select w-auto"
  //       onChange={(e) => handleFilterChange("priority", e.target.value)}
  //     >
  //       <option value="All">All Priorities</option>
  //       <option value="High">High</option>
  //       <option value="Medium">Medium</option>
  //       <option value="Low">Low</option>
  //     </select>

  //     {/* Sorting Options */}
  //     <select
  //       className="form-select w-auto"
  //       onChange={(e) => handleFilterChange("sortBy", e.target.value)}
  //     >
  //       <option value="createdAt">Sort by Created Date</option>
  //       <option value="updatedAt">Sort by Updated Date</option>
  //       <option value="CaseNumber">Sort by Case Number</option>
  //     </select>

  //     <select
  //       className="form-select w-auto"
  //       onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
  //     >
  //       <option value="asc">Ascending</option>
  //       <option value="desc">Descending</option>
  //     </select>
  //   </div>
  // </div>

  // <div className="card mb-3 shadow">
  //   <div
  //     className="card-header d-flex justify-content-between align-items-center px-3"
  //     style={{ height: "8vh" }}
  //   >
  //     <span className="col text-start">Status</span>
  //     <span className="col text-start">Case Number</span>
  //     <span className="col text-start">Request Number</span>
  //     <span className="col text-start">Case Type</span>
  //     <span className="col text-start">Purpose</span>
  //     <span className="col text-end">Action</span>
  //   </div>

  //       <div className="card-list p-0">
  //         {getFilteredCases().map((item, index) => (
  //           <div key={index}>
  //             <div
  //               className="d-flex justify-content-between align-items-center p-3 border-bottom"
  //               style={{ cursor: "pointer" }}
  //               onClick={(e) => {
  //                 if (
  //                   e.target.tagName !== "INPUT" &&
  //                   e.target.tagName !== "BUTTON"
  //                 ) {
  //                   handleClick(1, item);
  //                 }
  //               }}
  //             >
  //               <span className="col d-flex align-items-center text-start">
  //                 <span
  //                   className={`me-2 rounded-circle ${
  //                     item.Status.toLowerCase() === "case filed"
  //                       ? "bg-success"
  //                       : "bg-danger"
  //                   }`}
  //                   style={{
  //                     width: "10px",
  //                     height: "10px",
  //                     display: "inline-block",
  //                   }}
  //                 ></span>
  //                 {item.Status}
  //               </span>
  //               <span className="col d-flex align-items-center text-start">
  //                 {item["CaseNumber"]}
  //               </span>
  //               <span className="col d-flex align-items-center text-start">
  //                 {item["SerialNumber"]}
  //               </span>
  //               <span className="col d-flex align-items-center text-start">
  //                 {item["CaseType"]}
  //               </span>
  //               <input
  //                 className="col w-100"
  //                 type="text"
  //                 value={item.notes || ""}
  //                 onChange={(e) => handleEdit(index, e.target.value)}
  //                 onClick={(e) => e.stopPropagation()}
  //               />

  //               {/* Permission Dropdown */}
  //               <div className="col text-end">
  //                 <Dropdown
  //                   show={dropdownOpen === index}
  //                   onToggle={(isOpen) =>
  //                     setDropdownOpen(isOpen ? index : null)
  //                   }
  //                 >
  //                   <Dropdown.Toggle
  //                     variant="custom"
  //                     size="sm"
  //                     className="custom-dropdown-toggle"
  //                     onClick={(e) => {
  //                       e.stopPropagation();
  //                       setDropdownOpen(dropdownOpen === index ? null : index);
  //                     }}
  //                   ></Dropdown.Toggle>

  //                   <Dropdown.Menu
  //                     style={{
  //                       position: "absolute",
  //                       top: "100%",
  //                       left: "0",
  //                       zIndex: 1050,
  //                       minWidth: "150px",
  //                       boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  //                     }}
  //                   >
  //                     {token.Role === "admin" && (
  //                       <>
  //                         <Dropdown.Item
  //                           onClick={(event) => {
  //                             event.stopPropagation();
  //                             handleOpenModal(item);
  //                           }}
  //                         >
  //                           Assign Case
  //                         </Dropdown.Item>

  //                         <Dropdown.Item
  //                           onClick={async (event) => {
  //                             event.stopPropagation();
  //                             setLoaderOpen(true);
  //                             try {
  //                               const response = await updateFunction(item);
  //                               if (response?.success) {
  //                                 setLoaderOpen(false);
  //                               }
  //                             } catch (err) {
  //                               console.error("Update failed", err);
  //                               setLoaderOpen(false);
  //                             }
  //                           }}
  //                         >
  //                           Update Case
  //                         </Dropdown.Item>
  //                       </>
  //                     )}

  //                     <Dropdown.Item>View Details</Dropdown.Item>
  //                     <Dropdown.Item>Other Action</Dropdown.Item>
  //                   </Dropdown.Menu>
  //                 </Dropdown>

  //                 {/* MUI Loader */}
  //                 {loaderOpen && (
  //                   <div
  //                     style={{
  //                       position: "fixed",
  //                       top: "50%",
  //                       left: "50%",
  //                       transform: "translate(-50%, -50%)",
  //                       backgroundColor: "#16213e",
  //                       padding: "24px 32px",
  //                       borderRadius: "12px",
  //                       boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",

  //                       zIndex: 2000,
  //                       display: "flex",
  //                       alignItems: "center",
  //                       flexDirection: "column",
  //                     }}
  //                   >
  //                     <CircularProgress sx={{ color: "#d2a85a" }} />

  //                     <div
  //                       style={{
  //                         marginTop: 16,
  //                         fontWeight: "500",
  //                         color: "white",
  //                       }}
  //                     >
  //                       Updating Case...
  //                     </div>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //       {totalPages > 1 && (
  //         <div
  //           id="numberbar"
  //           style={{
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             position: "sticky",
  //             bottom: "10px",
  //             backgroundColor: "#18273e",
  //             zIndex: 10,
  //             padding: "10px",
  //             borderRadius: "8px",
  //             width: "20%",
  //             textAlign: "center",
  //             border: "2px solid #d4af37",
  //             margin: "auto",
  //           }}
  //         >
  //           <div
  //             style={{
  //               display: "flex",
  //               justifyContent: "center",
  //               alignItems: "center",
  //               gap: "10px",
  //             }}
  //           >
  //             <button
  //               onClick={() => goToPage(currentPage - 1)}
  //               disabled={currentPage === 1}
  //               className="first-lastbutton"
  //             >
  //               Previous
  //             </button>
  //             <input
  //               value={currentPage}
  //               min={1}
  //               max={totalPages}
  //               onChange={(e) =>
  //                 goToPage(
  //                   Math.max(1, Math.min(totalPages, Number(e.target.value)))
  //                 )
  //               }
  //               style={{
  //                 width: "50px",
  //                 textAlign: "center",
  //                 borderRadius: "6px",
  //                 border: "2px solid #d4af37",
  //                 backgroundColor: "#18273e",
  //                 color: "white",
  //               }}
  //             />
  //             <button
  //               onClick={() => goToPage(currentPage + 1)}
  //               disabled={currentPage === totalPages}
  //               className="first-lastbutton"
  //             >
  //               Next
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //     </div>

  //     {/* Assign Modal */}
  //     <Modal show={showAssignModal} onHide={handleCloseModal}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>Case Permissions</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <CaseAssignmentForm
  //           selectedCase={selectedCase}
  //           casedetails={casedetails}
  //           onClose={handleCloseModal}
  //         />
  //       </Modal.Body>
  //     </Modal>
  //   </div>
  // );


  // Allowed transitions
  const allowedTransitions = [
    "Consultation->Non-Litigation",
    "Consultation->Litigation",
    "Non-Litigation->Litigation",
  ];

  return (
    <div className="container-fluid p-0 mb-1 d-flex justify-content-center">



      <div
        className="card shadow p-2"
        style={{
          height: "86vh",
          // overflowY: "auto",
          maxWidth: '86vw',
          width: "100%"
        }}
      >
        <div className="row mb-3 g-2 align-items-center px-2" >
          <div className="">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="card shadow" style={{ overflowX: "auto", scrollbarWidth: 'thin', scrollbarColor: "#c0a262 #f1f1f1", maxWidth: "100%", width: "100%", minWidth: "400px" }}>

          <div style={{ minWidth: "max-content" }}>


            <div
              className="d-none d-md-flex justify-content-between align-items-center gap-2 p-3 border-bottom"
              style={{
                backgroundColor: "#18273e",
                color: "white",
                position: "sticky",
                top: 0,
                zIndex: 10,

              }}
            >
              {/* STATUS Filter */}
              <span

                style={{
                  maxWidth: "120px",
                  minWidth: "120px",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  paddingLeft: "1rem",
                  background: "#18273e",
                }}
              >
                <span className="d-flex gap-2 m-0 p-0 text-start" style={{ paddingLeft: "12px" }}>
                  Status

                  <Dropdown show={showStatusFilter} onToggle={() => setStatusFilter(!showStatusFilter)}>
                    <Dropdown.Toggle
                      variant=""
                      size="sm"
                      className="custom-dropdown-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusFilter(!showStatusFilter);
                      }}
                    >
                      <FontAwesomeIcon icon={faFilter} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={(e) => {
                        e.stopPropagation();
                        setFilters((prev) => ({ ...prev, status: [] }));
                      }}>Clear All</Dropdown.Item>
                      {["Open", "Closed", "Pending"].map((status) => (
                        <Dropdown.Item key={status} onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("status", status);
                        }}>
                          <Form.Check
                            type="checkbox"
                            label={status}
                            checked={filters.status.includes(status)}
                            onChange={() => { }}
                          />
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </span>
              </span>

              {/* CASE NUMBER Filter */}
              <span className=" d-flex gap-2 text-start" style={{
                maxWidth: '150px',
                minWidth: '150px',
                position: "sticky",
                left: "120px", // ✅ exactly after Status column width
                zIndex: 2,
                background: "#18273e",

              }}>
                Case Number
                <Dropdown show={showCaseFilter} onToggle={() => setCaseFilter(!showCaseFilter)}>
                  <Dropdown.Toggle
                    variant=""
                    size="sm"
                    className="custom-dropdown-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCaseFilter(!showCaseFilter);
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {["asc", "desc"].map((order) => (
                      <Dropdown.Item key={order} onClick={(e) => {
                        e.stopPropagation();
                        setFilters((prev) => ({ ...prev, sortOrder: order }));
                        setCaseFilter(false);
                      }}>
                        {order === "asc" ? "Ascending" : "Descending"}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </span>

              {/* REQUEST NUMBER Headings */}
              <span className=" text-start" style={{
                maxWidth: '150px',
                minWidth: '150px',
                color: 'white'
              }}>Request Number</span>
             
              {/* CASE SUB TYPE Filter */}
              <span className=" d-flex gap-2 text-start" style={{
                maxWidth: '200px',
                minWidth: '200px',
                color: 'white'
              }}>
                Case Sub Type
                <Dropdown show={showCaseSubTypeFilter} onToggle={() => setCaseSubTypeFilter(!showCaseSubTypeFilter)}>
                  <Dropdown.Toggle
                    variant=""
                    size="sm"
                    className="custom-dropdown-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCaseSubTypeFilter(!showCaseSubTypeFilter);
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => {
                      e.stopPropagation();
                      setFilters((prev) => ({ ...prev, CaseSubType: [] }));
                    }}>Clear All</Dropdown.Item>
                    {Subtypelist.map((type) => (
                      <Dropdown.Item key={type} onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange("CaseSubType", type);
                      }}>
                        <Form.Check type="checkbox" label={type} checked={filters.CaseSubType.includes(type)} onChange={() => { }} />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </span>

              {/* CASE TYPE Filter */}
              <span className=" d-flex gap-2 text-start" style={{
                maxWidth: '200px',
                minWidth: '200px',
                color: 'white'
              }}>
                Case Type
                <Dropdown show={showCaseTypeFilter} onToggle={() => setCaseTypeFilter(!showCaseTypeFilter)}>
                  <Dropdown.Toggle
                    variant=""
                    size="sm"
                    className="custom-dropdown-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCaseTypeFilter(!showCaseTypeFilter);
                    }}
                  >
                    <FontAwesomeIcon icon={faFilter} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => {
                      e.stopPropagation();
                      setFilters((prev) => ({ ...prev, CaseType: [] }));
                    }}>Clear All</Dropdown.Item>
                    {["Consultation", "Non-Litigation", "Litigation"].map((type) => (
                      <Dropdown.Item key={type} onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange("CaseType", type);
                      }}>
                        <Form.Check type="checkbox" label={type} checked={filters.CaseType.includes(type)} onChange={() => { }} />
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </span>

              {/* PURPOSE Heading */}
              <span className=" text-start" style={{
                maxWidth: '250px',
                minWidth: '250px',
                color: 'white'
              }}>Purpose</span>

              {/* ACTION Heading */}
              <span className=" text-end" style={{
                maxWidth: '100px',
                minWidth: '100px',
                color: 'white'
              }}>Action</span>
            </div>

            {[
              // First row: filter header
              // <div
              //   key="header"
              //   className="d-none d-md-flex justify-content-between align-items-center p-3 border-bottom"
              //   style={{ backgroundColor: "#18273e", color: "white", position: "relative" }}

              // >
              //   {/* STATUS Filter */}
              //   <span
              //     className=" d-flex gap-2 m-0 p-0 text-start"
              //     style={{
              //       maxWidth: "120px",
              //       minWidth: "120px",
              //       position: "sticky",
              //       left: 0,
              //       zIndex: 2,
              //       background: "#18273e",
              //       color: "white",
              //     }}
              //   >
              //     Status
              //     <Dropdown show={showStatusFilter} onToggle={() => setStatusFilter(!showStatusFilter)}>
              //       <Dropdown.Toggle
              //         variant=""
              //         size="sm"
              //         className="custom-dropdown-toggle"
              //         onClick={(e) => {
              //           e.stopPropagation();
              //           setStatusFilter(!showStatusFilter);
              //         }}
              //       >
              //         <FontAwesomeIcon icon={faFilter} />
              //       </Dropdown.Toggle>
              //       <Dropdown.Menu>
              //         <Dropdown.Item onClick={(e) => {
              //           e.stopPropagation();
              //           setFilters((prev) => ({ ...prev, status: [] }));
              //         }}>Clear All</Dropdown.Item>
              //         {["Open", "Closed", "Pending"].map((status) => (
              //           <Dropdown.Item key={status} onClick={(e) => {
              //             e.stopPropagation();
              //             handleFilterChange("status", status);
              //           }}>
              //             <Form.Check
              //               type="checkbox"
              //               label={status}
              //               checked={filters.status.includes(status)}
              //               onChange={() => { }}
              //             />
              //           </Dropdown.Item>
              //         ))}
              //       </Dropdown.Menu>
              //     </Dropdown>
              //   </span>

              //   {/* CASE NUMBER Filter */}
              //   <span className=" d-flex gap-2 text-start" style={{
              //     maxWidth: '150px',
              //     minWidth: '150px',
              //     color: 'white'
              //   }}>
              //     Case Number
              //     <Dropdown show={showCaseFilter} onToggle={() => setCaseFilter(!showCaseFilter)}>
              //       <Dropdown.Toggle
              //         variant=""
              //         size="sm"
              //         className="custom-dropdown-toggle"
              //         onClick={(e) => {
              //           e.stopPropagation();
              //           setCaseFilter(!showCaseFilter);
              //         }}
              //       >
              //         <FontAwesomeIcon icon={faFilter} />
              //       </Dropdown.Toggle>
              //       <Dropdown.Menu>
              //         {["asc", "desc"].map((order) => (
              //           <Dropdown.Item key={order} onClick={(e) => {
              //             e.stopPropagation();
              //             setFilters((prev) => ({ ...prev, sortOrder: order }));
              //             setCaseFilter(false);
              //           }}>
              //             {order === "asc" ? "Ascending" : "Descending"}
              //           </Dropdown.Item>
              //         ))}
              //       </Dropdown.Menu>
              //     </Dropdown>
              //   </span>

              //   {/* REQUEST NUMBER Headings */}
              //   <span className=" text-start" style={{
              //     maxWidth: '150px',
              //     minWidth: '150px',
              //     color: 'white'
              //   }}>Request Number</span>
              //   <span className=" text-start" style={{
              //     maxWidth: '150px',
              //     minWidth: '150px',
              //     color: 'white'
              //   }}>Request Number</span>
              //   <span className=" text-start" style={{
              //     maxWidth: '150px',
              //     minWidth: '150px',
              //     color: 'white'
              //   }}>Request Number</span>

              //   {/* CASE SUB TYPE Filter */}
              //   <span className=" d-flex gap-2 text-start" style={{
              //     maxWidth: '200px',
              //     minWidth: '200px',
              //     color: 'white'
              //   }}>
              //     Case Sub Type
              //     <Dropdown show={showCaseSubTypeFilter} onToggle={() => setCaseSubTypeFilter(!showCaseSubTypeFilter)}>
              //       <Dropdown.Toggle
              //         variant=""
              //         size="sm"
              //         className="custom-dropdown-toggle"
              //         onClick={(e) => {
              //           e.stopPropagation();
              //           setCaseSubTypeFilter(!showCaseSubTypeFilter);
              //         }}
              //       >
              //         <FontAwesomeIcon icon={faFilter} />
              //       </Dropdown.Toggle>
              //       <Dropdown.Menu>
              //         <Dropdown.Item onClick={(e) => {
              //           e.stopPropagation();
              //           setFilters((prev) => ({ ...prev, CaseSubType: [] }));
              //         }}>Clear All</Dropdown.Item>
              //         {Subtypelist.map((type) => (
              //           <Dropdown.Item key={type} onClick={(e) => {
              //             e.stopPropagation();
              //             handleFilterChange("CaseSubType", type);
              //           }}>
              //             <Form.Check type="checkbox" label={type} checked={filters.CaseSubType.includes(type)} onChange={() => { }} />
              //           </Dropdown.Item>
              //         ))}
              //       </Dropdown.Menu>
              //     </Dropdown>
              //   </span>

              //   {/* CASE TYPE Filter */}
              //   <span className=" d-flex gap-2 text-start" style={{
              //     maxWidth: '200px',
              //     minWidth: '200px',
              //     color: 'white'
              //   }}>
              //     Case Type
              //     <Dropdown show={showCaseTypeFilter} onToggle={() => setCaseTypeFilter(!showCaseTypeFilter)}>
              //       <Dropdown.Toggle
              //         variant=""
              //         size="sm"
              //         className="custom-dropdown-toggle"
              //         onClick={(e) => {
              //           e.stopPropagation();
              //           setCaseTypeFilter(!showCaseTypeFilter);
              //         }}
              //       >
              //         <FontAwesomeIcon icon={faFilter} />
              //       </Dropdown.Toggle>
              //       <Dropdown.Menu>
              //         <Dropdown.Item onClick={(e) => {
              //           e.stopPropagation();
              //           setFilters((prev) => ({ ...prev, CaseType: [] }));
              //         }}>Clear All</Dropdown.Item>
              //         {["Consultation", "Non-Litigation", "Litigation"].map((type) => (
              //           <Dropdown.Item key={type} onClick={(e) => {
              //             e.stopPropagation();
              //             handleFilterChange("CaseType", type);
              //           }}>
              //             <Form.Check type="checkbox" label={type} checked={filters.CaseType.includes(type)} onChange={() => { }} />
              //           </Dropdown.Item>
              //         ))}
              //       </Dropdown.Menu>
              //     </Dropdown>
              //   </span>

              //   {/* PURPOSE Heading */}
              //   <span className=" text-start" style={{
              //     maxWidth: '250px',
              //     minWidth: '250px',
              //     color: 'white'
              //   }}>Purpose</span>

              //   {/* ACTION Heading */}
              //   <span className=" text-end" style={{
              //     maxWidth: '100px',
              //     minWidth: '100px',
              //     color: 'white'
              //   }}>Action</span>
              // </div>,

              // Next rows: data list
              ...getFilteredCases()
                .slice((currentPage - 1) * casesPerPage, currentPage * casesPerPage)
                .map((item, index) => (
                  <div key={index} className="border-bottom position-relative">
                    {/* Mobile View */}
                    <div
                      className="d-md-none p-3"
                      style={{
                        overflowX: "hidden",
                        maxWidth: "100%",
                        maxHeight: "83vh",
                      }}
                    >
                      {/* Status and Actions Row */}
                      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`rounded-circle ${item.Status.toLowerCase() === "case filed"
                              ? "bg-success"
                              : "bg-danger"
                              }`}
                            style={{
                              width: "12px",
                              height: "12px",
                              minWidth: "12px",
                            }}
                          />
                          <span className="badge bg-light text-dark">
                            {item.Status}
                          </span>
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="light"
                            size="sm"
                            className="rounded-circle p-0 border"
                            style={{
                              width: "28px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {token.Role === "admin" && (
                              <>
                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleOpenModal(item);
                                  }}
                                >
                                  Assign Case
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={async (event) => {
                                    event.stopPropagation();
                                    setLoaderOpen(true);
                                    try {
                                      const response = await updateFunction(item);
                                      if (response?.success) setLoaderOpen(false);
                                    } catch (err) {
                                      console.error("Update failed", err);
                                      setLoaderOpen(false);
                                    }
                                  }}
                                >
                                  Update Case
                                </Dropdown.Item>
                              </>
                            )}

                            {token.Role === "admin" && (
                              <>
                                <Dropdown.Item
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleUpdateStatus(item);
                                  }}
                                >
                                  {item.IsActive ? "Closed Positive" : "Closed Negative"}
                                </Dropdown.Item>
                              </>
                            )}


                            {token.Role === "admin" && (
                              <Dropdown.Item
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowMergeModal(true);
                                }}
                              >
                                Merge With
                              </Dropdown.Item>
                            )}
                            {token.Role === "admin" && (
                              <Dropdown.Item
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setSelectedCaseType(item?.CaseType)
                                  setShowCaseType(true);
                                }}
                              >
                                {item?.CaseType ? "Update" : "Add"} Case Type
                              </Dropdown.Item>
                            )}
                            {token.Role === "admin" && (
                              <Dropdown.Item
                                onClick={(event) => {
                                  event.preventDefault()
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowSubCaseType(true);
                                }}
                              >
                                {item?.CaseSubType ? "Update" : "Add"} Case Sub Type
                              </Dropdown.Item>
                            )}
                            {token.Role === "admin" && (
                              <Dropdown.Item
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowCaseStages(true);
                                }}
                              >
                                Set Case Stage
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              onClick={(e) => {
                                if (
                                  e.target.tagName !== "INPUT" &&
                                  e.target.tagName !== "BUTTON"
                                ) {
                                  handleClick(1, item);
                                }
                              }}
                            >
                              View Details
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>

                      {/* Data Fields */}
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-wrap">
                          <span
                            className="text-muted me-2"
                            style={{ minWidth: "80px", wordBreak: "break-word" }}
                          >
                            Case #:
                          </span>
                          <span className="fw-medium">{item["CaseNumber"]}</span>
                        </div>

                        <div className="d-flex flex-wrap">
                          <span
                            className="text-muted me-2"
                            style={{ minWidth: "80px", wordBreak: "break-word" }}
                          >
                            Request #:
                          </span>
                          <span className="fw-medium">{item["SerialNumber"]}</span>
                        </div>
                        <div className="d-flex flex-wrap">
                          <span
                            className="text-muted me-2"
                            style={{ minWidth: "80px", wordBreak: "break-word" }}
                          >
                            Case Sub Type
                          </span>
                          <span className="fw-medium">{item["CaseSubType"]}</span>
                        </div>

                        <div className="d-flex flex-wrap">
                          <span
                            className="text-muted me-2"
                            style={{ minWidth: "80px", wordBreak: "break-word" }}
                          >
                            Type:
                          </span>
                          <span className="fw-medium">{item["CaseType"]}</span>
                        </div>

                        <div>
                          <div className="text-muted mb-1">Purpose:</div>
                          <input
                            className="form-control form-control-sm"
                            value={item.notes || ""}
                            onChange={(e) => handleEdit(index, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Desktop View - Horizontal Layout */}




                    <div
                      className="d-none d-md-flex justify-content-between align-items-center gap-2 p-3"
                      style={{ cursor: "pointer", background: 'white' }}
                      onClick={(e) => {
                        if (e.target.tagName !== "INPUT" && e.target.tagName !== "BUTTON") {
                          handleClick(1, item);
                        }
                      }}
                    >
                      {/* STATUS */}
                      <span
                        className="d-flex align-items-center text-start"
                        style={{
                          maxWidth: "120px",
                          minWidth: "120px",
                          position: "sticky",
                          left: 0,
                          zIndex: 2,
                          paddingLeft: "1rem",
                        }}
                      >
                        <span
                          className={`me-2 rounded-circle ${item.Status.toLowerCase() === "case filed" ? "bg-success" : "bg-danger"
                            }`}
                          style={{
                            width: "10px",
                            height: "10px",
                            display: "inline-block",
                          }}
                        ></span>
                        {item.Status}
                      </span>

                      {/* CASE NUMBER */}
                      <span
                        className="text-start d-flex align-items-center"
                        style={{
                          maxWidth: "150px",
                          minWidth: "150px",
                          position: "sticky",
                          left: "120px", // ✅ exactly after Status column width
                          zIndex: 2,
                          background: "#ffffff",
                          borderRight: "1px solid #ccc",
                          boxShadow: "2px 0 4px rgba(0, 0, 0, 0.03)",
                          paddingLeft: "1rem",
                        }}
                      >
                        {item.CaseNumber}
                      </span>

                      {/* REQUEST NUMBER */}
                      <span className=" text-start" style={{
                        maxWidth: '150px',
                        minWidth: '150px',
                      }}>{item.SerialNumber}</span>
                      


                      {/* CASE SUB TYPE */}
                      <span className=" text-start" style={{
                        maxWidth: '200px',
                        minWidth: '200px',
                      }}>{item.CaseSubType}</span>

                      {/* CASE TYPE */}
                      <span className=" text-start" style={{
                        maxWidth: '200px',
                        minWidth: '200px',
                      }}>{item.CaseType}</span>

                      {/* PURPOSE (Editable Notes) */}
                      <div className="" style={{
                        maxWidth: '250px',
                        minWidth: '250px',
                      }}>
                        <input
                          className="form-control"
                          type="text"
                          value={item.notes || ""}
                          onChange={(e) => handleEdit(index, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>


                      {/* ACTION */}
                      <div className="col d-flex justify-content-end" style={{
                        maxWidth: '100px',
                        minWidth: '100px',
                      }}>
                        <Dropdown
                          show={dropdownOpen === index}
                          onToggle={(isOpen) => setDropdownOpen(isOpen ? index : null)}
                        >
                          <Dropdown.Toggle
                            variant=""
                            size="sm"
                            className="custom-dropdown-toggle"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdownOpen(dropdownOpen === index ? null : index);
                            }}
                          ></Dropdown.Toggle>

                          <Dropdown.Menu>
                            {token.Role === "admin" && (
                              <>
                                <Dropdown.Item onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenModal(item);
                                }}>
                                  Assign Case
                                </Dropdown.Item>

                                <Dropdown.Item onClick={async (event) => {
                                  event.stopPropagation();
                                  setLoaderOpen(true);
                                  try {
                                    const response = await updateFunction(item);
                                    if (response?.success) setLoaderOpen(false);
                                  } catch (err) {
                                    console.error("Update failed", err);
                                    setLoaderOpen(false);
                                  }
                                }}>
                                  Update Case
                                </Dropdown.Item>

                                <Dropdown.Item onClick={(event) => {
                                  event.stopPropagation();
                                  handleUpdateStatus(item);
                                }}>
                                  {item.IsActive ? "Closed Positive" : "Closed Negative"}
                                </Dropdown.Item>

                                <Dropdown.Item onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowMergeModal(true);
                                }}>
                                  Merge With
                                </Dropdown.Item>
                                <Dropdown.Item onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowCloseType(true);
                                }}>
                                  Close Type
                                </Dropdown.Item>

                                <Dropdown.Item onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowCaseType(true);
                                }}>
                                  {item?.CaseType ? "Update" : "Add"} Case Type
                                </Dropdown.Item>

                                <Dropdown.Item onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowSubCaseType(true);
                                }}>
                                  {item?.CaseSubType ? "Update" : "Add"} Case Sub Type
                                </Dropdown.Item>

                                <Dropdown.Item onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedCase(item);
                                  setShowCaseStages(true);
                                }}>
                                  Set Case Stage
                                </Dropdown.Item>
                              </>
                            )}
                            <Dropdown.Item>View Details</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>

                  </div>
                ))
            ]}

          </div>
          {totalPages > 1 && (
            <div className="p-3">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: "#18273e",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "2px solid #d4af37",
                  margin: "auto",
                  maxWidth: "100%",
                  width: "fit-content",
                }}
              >
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-outline-warning"
                  >
                    Previous
                  </button>
                  <div className="d-flex align-items-center">
                    <span className="text-white me-2 d-none d-sm-block">
                      Page
                    </span>
                    <input
                      value={currentPage}
                      min={1}
                      max={totalPages}
                      onChange={(e) =>
                        goToPage(
                          Math.max(
                            1,
                            Math.min(totalPages, Number(e.target.value))
                          )
                        )
                      }
                      className="form-control text-center"
                      style={{
                        width: "60px",
                        border: "2px solid #d4af37",
                        backgroundColor: "#18273e",
                        color: "white",
                      }}
                    />
                    <span className="text-white ms-2 d-none d-sm-block">
                      of {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline-warning"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Pagination - Responsive */}

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

      {/* MUI Loader */}
      {
        loaderOpen && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#16213e",
              padding: "24px 32px",
              borderRadius: "12px",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <CircularProgress sx={{ color: "#d2a85a" }} />
            <div
              style={{
                marginTop: 16,
                fontWeight: "500",
                color: "white",
              }}
            >
              Updating Case...
            </div>
          </div>
        )
      }

      <Modal show={showMergeModal} onHide={() => setShowMergeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Merge Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mergeWithCase" className="w-100">
              <Form.Label>Select Case to Merge With</Form.Label>
              <Form.Select
                className="w-100"
                value={selectedCourtCaseId}
                onChange={(e) => setSelectedCourtCaseId(e.target.value)}
              >
                <option value="">-- Select Case --</option>
                {data
                  .filter((caseItem) => {
                    if (!selectedCase) return false;
                    return selectedCase?.IsDubiCourts
                      ? caseItem?.IsDubiCourts === false
                      : caseItem?.IsDubiCourts === true;
                  })
                  .map((caseItem) => (
                    <option key={caseItem?._id} value={caseItem?._id}>
                      {caseItem?.CaseNumber || caseItem?._id}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowMergeModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              let old = selectedCase?.IsDubiCourts ? selectedCourtCaseId : selectedCase._id
              let newcase = selectedCase?.IsDubiCourts ? selectedCase._id : selectedCourtCaseId
              mergeCaseWithCourt(
                old,
                newcase,
              );
              setShowMergeModal(false);
            }}
            disabled={!selectedCourtCaseId}
          >
            Merge
          </Button>
        </Modal.Footer>
      </Modal>








      <Modal show={showCaseStages} onHide={() => setShowCaseStages(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Case Stage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mergeWithCase" className="w-100">
              <Form.Label>Select Case  Stage</Form.Label>
              <Form.Select
                className="w-100"
                value={selectedCaseStage}
                onChange={(e) => setSelectedCaseStage(e.target.value)}
              >
                <option value="">-- Select Case --</option>
                {COURT_STAGES.map((caseItem) => (
                  <option key={caseItem} value={caseItem}>
                    {caseItem}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowCaseStages(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {


              updateCaseStage(selectedCase._id, selectedCaseStage)
              setShowCaseStages(false);
            }}
            disabled={!selectedCaseStage}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>






      <Modal show={showCaseType} onHide={() => setShowCaseType(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCase?.CaseType ? "Update" : "Add"} Case Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mergeWithCase" className="w-100">
              <Form.Label>Select Case Type</Form.Label>

              <Form.Select
                className="w-100"
                value={selectedCaseType}
                onChange={(e) => setSelectedCaseType(e.target.value)}
              >
                <option value="">Select the option</option>
                {["Consultation", "Litigation", "Non-Litigation"].map((caseItem) => (
                  <option key={caseItem} value={caseItem}>
                    {caseItem}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowCaseType(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log("Selected case =", selectedCase);
              updateCaseTypeAndFolder(selectedCase._id, selectedCaseType);
              setShowCaseType(false);
            }}
            disabled={!selectedCaseType}
          >
            {selectedCase?.CaseType ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showSubCaseType} onHide={() => setShowSubCaseType(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCase?.CaseSubType ? "Update" : "Add"} Case Sub Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mergeWithCase" className="w-100">
              <Form.Label>Select Case Sub Type</Form.Label>

              <Form.Select
                className="w-100"
                value={selectedSubCaseType}
                onChange={(e) => setSelectedSubCaseType(e.target.value)}
              >
                <option value="">Select the option</option>
                {Subtypelist.map((caseItem) => (
                  <option key={caseItem} value={caseItem}>
                    {caseItem}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSubCaseType(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log("Selected case =", selectedCase);
              updateCaseSubTypeAndFolder(selectedCase._id, selectedSubCaseType);
              setShowSubCaseType(false);
            }}
            disabled={!selectedSubCaseType}
          >
            {selectedCase?.CaseSubType ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showCloseType} onHide={() => setShowCloseType(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Close Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mergeWithCase" className="w-100">
              <Form.Label>Please select an option to close the case:</Form.Label>

              <Form.Select
                className="w-100"
                value={selectedCloseType}
                onChange={(e) => setSelectedCloseType(e.target.value)}
              >
                <option value="">Select the option</option>
                {["Close Negative", "Close Positive"].map((caseItem) => (
                  <option key={caseItem} value={caseItem}>
                    {caseItem}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowCloseType(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log("Selected case =", selectedCase);
              updateCaseCloseType(selectedCase._id, selectedCloseType);
              setShowCloseType(false);
            }}
            disabled={!selectedCloseType}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>


    </div >
  );
};

export default BasicCase;
