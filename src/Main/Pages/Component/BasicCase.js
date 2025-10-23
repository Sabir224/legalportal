import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BasicCase.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Caseinfo, screenChange } from '../../../REDUX/sliece';
import * as XLSX from 'xlsx';
import filepath from '../../../utils/dataset.csv';
import axios from 'axios';
import { ApiEndPoint } from './utils/utlis';
import CaseAssignmentForm from '../cases/CaseAssignment';
import { Button, Dropdown, Form, Modal } from 'react-bootstrap';
import { Backdrop, CircularProgress } from '@mui/material';
import { useAlert } from '../../../Component/AlertContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const BasicCase = ({ token, isViewCase = false }) => {
  const [caseNumber, setCaseNumber] = useState('');
  const [caseName, setCaseName] = useState('');
  const [check, setcheck] = useState(true);
  const screen = useSelector((state) => state.screen.value);
  const [searchQuery, setSearchQuery] = useState('');
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
  const [selectedCourtCaseId, setSelectedCourtCaseId] = useState('');
  const [selectedCaseType, setSelectedCaseType] = useState();
  const [selectedSubCaseType, setSelectedSubCaseType] = useState();
  const [selectedCloseType, setSelectedCloseType] = useState();
  const [selectedCaseStage, setSelectedCaseStage] = useState('');
  const [availableCases, setAvailableCases] = useState([]); // populate this list as needed

  console.log('Token change =', token?.Role);
  const reduxCaseCloseType = useSelector((state) => state.screen.CloseType);

  const caseSubTypeRef = useRef(null);
  const caseTypeRef = useRef(null);

  const caseNumberRef = useRef(null);
  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (caseSubTypeRef.current && !caseSubTypeRef.current.contains(event.target)) {
        handleApplyFilter('CaseSubType');
        setCaseSubTypeFilter(false);
      }

      if (caseNumberRef.current && !caseNumberRef.current.contains(event.target)) {
        setCaseFilter(false);
      }

      if (caseTypeRef.current && !caseTypeRef.current.contains(event.target)) {
        handleApplyFilter('CaseType');
        setCaseTypeFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCaseSubTypeFilter, showCaseTypeFilter, showCaseFilter]);

  const { showLoading, showDataLoading, showSuccess, showError } = useAlert();

  const casesPerPage = 50; // Show 50 cases per page
  const [filters, setFilters] = useState({
    status: [], // Array of selected statuses
    CaseType: [], // Array of selected case types
    CaseSubType: [], // Array of selected case types
    priority: [], // Optional if you add it later
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [Subtypelist, setSubtypelist] = useState([]);
  const [CaseTypeList, setCaseTypeList] = useState([]);
  const [casetypeslistFilteroption, setcasetypeslistFilteroption] = useState([]);

  const [expanded, setExpanded] = useState(null); // track expanded row
  const [SubCasedropdownOpen, setSubCaseDropdownOpen] = useState(null);

  const toggleExpand = (id) => {
    console.log('👉 toggleExpand called with:', id);

    if (!id) return; // agar id null/undefined hai to return kar do
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
    }
  };

  useEffect(() => {
    // Add "" to include blank values as part of filter
    setFilters((prev) => ({
      ...prev,
      CaseSubType: [...Subtypelist, ''],
      CaseType: [...CaseTypeList, ''],
    }));
  }, []);

  // console.log("_________Token:0", token.Role);

  const COURT_STAGES = [
    'Pre-Litigation',
    'Filing a Case',
    'Initial Review',
    'Evidence Submission',
    'Hearings',
    'Judgment',
    'Appeals',
    'Execution',
    'Specialized Stages',
    'Under Review',
    'Cassation',
  ];

  const UpdateSubtypelist = [
    'Civil Law',
    'Commercial Law',
    'Criminal Law',
    'Family Law',
    'Real Estate Law',
    'Labor Law',
    'Construction Law',
    'Maritime Law',
    'Personal Injury Law',
    ,
    'Technology Law',
    'Financial Law',
    'Public Law',
    'Consumer Law',
    'Environmental Law',
    'Rental Law',
  ];

  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [casedetails, setcasedetails] = useState(null);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const updateFunction = async (item) => {
    setLoaderOpen(true); // 🔄 Show loader before request

    try {
      const response = await fetch('https://api.aws-legalgroup.com/Receive_Case_Number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SerialNumber: item['SerialNumber'],
        }),
      });

      const result = await response.json();
      console.log('✅ Server response:', result);

      return result;
    } catch (error) {
      console.error('❌ Error:', error);
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
      fetchCases();
      console.log('Status updated:', response.data);
      // Optionally update UI or state here
    } catch (error) {
      console.error('Error updating case status:', error.response?.data || error.message);
    }
    setcasedetails(caseinfo);
  };

  const mergeCaseWithCourt = async (oldCaseId, newCaseId) => {
    //  console.log(oldCaseId,"  oldCaseId   ",newCaseId)
    try {
      const response = await axios.put(`${ApiEndPoint}MergeCaseWithCourt/${oldCaseId}/${newCaseId}`);
      showSuccess('Merge Successfully');
      fetchCases();
      console.log('response.data of merge', response.data);
    } catch (error) {
      console.error('Error merging cases:', error);
      showError('Error merging cases');
    }
  };
  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedCase(null);
  };
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  // Function to fetch cases

  const handleEdit = (index, value) => {
    const updatedData = [...data];
    updatedData[index].headerCase.notes = value;
    setData(updatedData);
  };
  // Fetch cases on component mount

  const handleSubEdit = (parentIndex, subIndex, value) => {
    const updatedData = [...data];
    updatedData[parentIndex].subcases[subIndex].notes = value;
    setData(updatedData);
  };

  const handleClick = async (scr, item) => {
    // const newParams = { CaseId:item.CaseId };
    // dispatch(setParams(newParams));
    console.log('item = ', item);
    global.CaseId = item;
    dispatch(Caseinfo(item));
    console.log('  global.CaseId ', item?._id);
    localStorage.removeItem('redirectPath');
    localStorage.removeItem('pendingCaseId');
    localStorage.removeItem('pendingUserId');
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
  // const handleFilterChange = (filterType, value) => {
  //   setFilters((prevFilters) => {
  //     const currentValues = prevFilters[filterType] || [];

  //     const updatedValues = currentValues.includes(value)
  //       ? currentValues.filter((v) => v !== value) // Remove if already selected
  //       : [...currentValues, value];               // Add if not selected

  //     return {
  //       ...prevFilters,
  //       [filterType]: updatedValues,
  //     };
  //   });

  //   setCurrentPage(1); // Reset to first page when filter changes
  // };

  const handleFilterChange = async (filterType, value) => {
    // if (filterType === "CaseType") {
    //   try {
    //     const response = await axios.post(`${ApiEndPoint}getCaseSubTypesorCaseTypes/true`, {
    //       caseTypes: filters?.CaseType,
    //     });

    //     // ✅ Update Subtypelist (used in UI)
    //     console.log("response.data.subTypes = ", response.data.subTypes)
    //     setSubtypelist(response.data.subTypes || []);
    //   } catch (error) {
    //     console.error("Failed to fetch subtypes:", error);
    //     setSubtypelist([]);
    //   }
    // }

    setFilters((prevFilters) => {
      const currentValues = prevFilters[filterType] || [];

      // Handle "Select All"
      if (value === '__SELECT_ALL__') {
        const fullList =
          filterType === 'CaseType'
            ? [...CaseTypeList, ''] // include blank
            : filterType === 'CaseSubType'
              ? [...Subtypelist, '']
              : [];

        return {
          ...prevFilters,
          [filterType]: fullList,
        };
      }

      // Toggle individual value (including blank "")
      const updatedValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value) // remove if selected
        : [...currentValues, value]; // add if not selected

      return {
        ...prevFilters,
        [filterType]: updatedValues,
      };
    });

    setCurrentPage(1); // reset to page 1 when filter changes
  };

  const handleApplyFilter = async (filterType) => {
    console.log('Apply filter for:', filterType);
    // You can add custom logic here like closing the dropdown or calling API
    if (filterType === 'CaseSubType') {
      try {
        const response = await axios.post(`${ApiEndPoint}getCaseSubTypesorCaseTypes/false`, {
          caseTypes: filters?.CaseSubType,
        });

        // ✅ Update Subtypelist (used in UI)
        console.log('response.data.subTypes = ', response.data.subTypes);
        await setCaseTypeList(response.data.subTypes || []);
      } catch (error) {
        setCaseSubTypeFilter(false); // close dropdown
      }
    } else if (filterType === 'CaseType') {
      try {
        const response = await axios.post(`${ApiEndPoint}getCaseSubTypesorCaseTypes/true`, {
          caseTypes: filters?.CaseType,
        });

        // ✅ Update Subtypelist (used in UI)
        console.log('response.data.subTypes = ', response.data.subTypes);
        await setSubtypelist(response.data.subTypes || []);
      } catch (error) {
        setCaseTypeFilter(false); // close dropdown
      }
    }
  };

  // const getFilteredCases = () => {
  //   let filteredCases = data;

  //   // Apply search filter across multiple fields
  //   if (searchQuery) {
  //     const query = searchQuery.toLowerCase();
  //     filteredCases = filteredCases.filter((item) =>
  //       Object.entries(item).some(([key, value]) => {
  //         if (
  //           typeof value !== "string" ||
  //           ["_id", "createdAt", "updatedAt"].includes(key)
  //         ) {
  //           return false;
  //         }
  //         return value.toLowerCase().includes(query);
  //       })
  //     );
  //   }

  //   // Filter by multiple selected statuses
  //   if (filters.status && filters.status.length > 0) {
  //     filteredCases = filteredCases.filter((item) =>
  //       filters.status.includes(item.Status)
  //     );
  //   }

  //   // Filter by multiple selected CaseTypes
  //   if (filters.CaseType && filters.CaseType.length > 0) {
  //     filteredCases = filteredCases.filter((item) =>
  //       filters.CaseType.includes(item.CaseType)
  //     );
  //   }
  //   if (filters.CaseSubType && filters.CaseSubType.length > 0) {
  //     filteredCases = filteredCases.filter((item) =>
  //       filters.CaseSubType.includes(item.CaseSubType)
  //     );
  //   }

  //   // Filter by multiple selected priorities (optional)
  //   if (filters.priority && filters.priority.length > 0) {
  //     filteredCases = filteredCases.filter((item) =>
  //       filters.priority.includes(item.Priority)
  //     );
  //   }

  //   // Apply sorting
  //   if (filters.sortBy) {
  //     filteredCases.sort((a, b) => {
  //       const aVal = a[filters.sortBy];
  //       const bVal = b[filters.sortBy];

  //       if (aVal == null || bVal == null) return 0;

  //       if (filters.sortOrder === "asc") {
  //         return aVal > bVal ? 1 : -1;
  //       } else {
  //         return aVal < bVal ? 1 : -1;
  //       }
  //     });
  //   }

  //   return filteredCases;
  // };

  // const getFilteredCases = () => {
  //   let filteredCases = data;

  //   // 🔒 If any filter is empty, return [] (show nothing)
  //   const hasEmptyFilter =
  //     // (filters.status && filters.status.length === 0) ||
  //     (filters.CaseType && filters.CaseType.length === 0) ||
  //     (filters.CaseSubType && filters.CaseSubType.length === 0)
  //     // (filters.priority && filters.priority.length === 0);

  //   if (hasEmptyFilter) return [];

  //   // Apply search filter across multiple fields
  //   if (searchQuery) {
  //     const query = searchQuery.toLowerCase();
  //     filteredCases = filteredCases.filter((item) =>
  //       Object.entries(item).some(([key, value]) => {
  //         if (
  //           typeof value !== "string" ||
  //           ["_id", "createdAt", "updatedAt"].includes(key)
  //         ) {
  //           return false;
  //         }
  //         return value.toLowerCase().includes(query);
  //       })
  //     );
  //   }

  //   // Filter by multiple selected statuses
  //   // if (filters.status && filters.status.length > 0) {
  //   //   filteredCases = filteredCases.filter((item) =>
  //   //     filters.status.includes(item.Status)
  //   //   );
  //   // }

  //   // Filter by multiple selected CaseTypes
  //   if (filters.CaseType && filters.CaseType.length > 0) {
  //     filteredCases = filteredCases.filter((item) =>
  //       filters.CaseType.includes(item.CaseType)
  //     );
  //   }

  //   // Filter by CaseSubType
  //   if (filters.CaseSubType && filters.CaseSubType.length > 0) {
  //     filteredCases = filteredCases.filter((item) =>
  //       filters.CaseSubType.includes(item.CaseSubType)
  //     );
  //   }

  //   // // Filter by multiple selected priorities (optional)
  //   // if (filters.priority && filters.priority.length > 0) {
  //   //   filteredCases = filteredCases.filter((item) =>
  //   //     filters.priority.includes(item.Priority)
  //   //   );
  //   // }

  //   // Apply sorting
  //   if (filters.sortBy) {
  //     filteredCases.sort((a, b) => {
  //       const aVal = a[filters.sortBy];
  //       const bVal = b[filters.sortBy];

  //       if (aVal == null || bVal == null) return 0;

  //       if (filters.sortOrder === "asc") {
  //         return aVal > bVal ? 1 : -1;
  //       } else {
  //         return aVal < bVal ? 1 : -1;
  //       }
  //     });
  //   }

  //   return filteredCases;
  // };

  const getFilteredCases = () => {
    let filteredCases = data;

    // 🔒 Agar CaseType ya CaseSubType filter empty ho to kuch bhi na dikhaye
    const hasEmptyFilter =
      (filters.CaseType && filters.CaseType.length === 0) || (filters.CaseSubType && filters.CaseSubType.length === 0);

    if (hasEmptyFilter) return [];

    // 🔍 Search (headerCase + subcases)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredCases = filteredCases.filter((item) => {
        const header = item.headerCase || {};
        const subcases = item.subcases || [];

        // headerCase check
        const headerMatch = Object.entries(header).some(([key, value]) => {
          if (typeof value !== 'string') return false;
          return value.toLowerCase().includes(query);
        });

        // subcases check
        const subcaseMatch = subcases.some((sub) =>
          Object.entries(sub).some(([key, value]) => {
            if (typeof value !== 'string') return false;
            return value.toLowerCase().includes(query);
          })
        );

        return headerMatch || subcaseMatch;
      });
    }

    // 📂 Filter by CaseType (headerCase + subcases)
    if (filters.CaseType && filters.CaseType.length > 0) {
      filteredCases = filteredCases.filter((item) => {
        const headerType = item.headerCase?.CaseType || '';
        const subTypes = item.subcases.map((s) => s.CaseType || '');
        return filters.CaseType.includes(headerType) || subTypes.some((st) => filters.CaseType.includes(st));
      });
    }

    // 📂 Filter by CaseSubType (headerCase + subcases)
    if (filters.CaseSubType && filters.CaseSubType.length > 0) {
      filteredCases = filteredCases.filter((item) => {
        const headerSubType = item.headerCase?.CaseSubType || '';
        const subSubTypes = item.subcases.map((s) => s.CaseSubType || '');
        return (
          filters.CaseSubType.includes(headerSubType) || subSubTypes.some((sst) => filters.CaseSubType.includes(sst))
        );
      });
    }

    // 🔄 Sorting (sirf headerCase field pe)
    if (filters.sortBy) {
      filteredCases = [...filteredCases].sort((a, b) => {
        const aVal = a.headerCase?.[filters.sortBy];
        const bVal = b.headerCase?.[filters.sortBy];

        if (aVal == null || bVal == null) return 0;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return filters.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return filters.sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
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
    showDataLoading(true);
    try {
      const response = await axios.get(`${ApiEndPoint}getcase`, {
        withCredentials: true,
      });

      const allCases = response.data.data;
      let filteredCases = [];

      console.log('reduxCaseCloseType=', reduxCaseCloseType);

      if (token.Role?.toLowerCase() === 'client') {
        // Show only client's own cases
        filteredCases = allCases.filter(
          (caseItem) => caseItem.ClientId === token?._id && caseItem.CloseType === reduxCaseCloseType
        );
      } else if (token.Role?.toLowerCase() === 'admin') {
        // Admin sees all cases
        filteredCases = allCases.filter((caseItem) => caseItem.CloseType === reduxCaseCloseType);
      } else {
        // Legal users: show only assigned cases
        filteredCases = allCases.filter((caseItem) =>
          caseItem.AssignedUsers?.some(
            (user) => user.UserId?.toString() === token._id?.toString() && caseItem.CloseType === reduxCaseCloseType
          )
        );
      }

      console.log(' filterCase =', filteredCases);
      // 🔹 Grouping logic: {header: clientName/id, subcases:[cases]}
      // const groupedCases = Object.values(
      //   filteredCases.reduce((acc, caseItem) => {
      //     const clientId = caseItem.ClientId;
      //     const header = caseItem.ClientName || clientId || "Unknown Client";

      //     if (!clientId) {
      //       // Agar ClientId hi nahi hai → har case ek independent header
      //       acc[`${header}_${caseItem?._id}`] = {
      //         headerCase: caseItem,
      //         subcases: [], // koi subcases nahi
      //       };
      //     } else {
      //       // Agar ClientId hai → grouping normal
      //       if (!acc[clientId]) {
      //         acc[clientId] = {
      //           headerCase: caseItem, // pehla case header banega
      //           subcases: [],
      //         };
      //       } else {
      //         acc[clientId].subcases.push(caseItem);
      //       }
      //     }

      //     return acc;
      //   }, {})
      // );

      const groupedCases = Object.values(
        filteredCases
          // 🔹 Step 1: sort pehle hi kar lo → latest first
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .reduce((acc, caseItem) => {
            const clientId = caseItem.ClientId;
            const header = caseItem.ClientName || clientId || 'Unknown Client';

            if (!clientId) {
              // Agar ClientId hi nahi hai → har case ek independent header
              acc[`${header}_${caseItem?._id}`] = {
                headerCase: caseItem,
                subcases: [],
              };
            } else {
              // Agar ClientId hai → grouping normal
              if (!acc[clientId]) {
                acc[clientId] = {
                  headerCase: caseItem, // sabse pehla (latest) case header banega
                  subcases: [],
                };
              } else {
                acc[clientId].subcases.push(caseItem);
              }
            }

            return acc;
          }, {})
      );

      // 🔹 Step 2: subcases ko bhi sort karna (latest → oldest)
      groupedCases.forEach((group) => {
        group.subcases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

      console.log('Group Cases = ', groupedCases);
      await setData(groupedCases);
      showDataLoading(false);
    } catch (err) {
      setError(err.message);
      showDataLoading(false);
    }

    // for filter
    try {
      const response = await axios.get(`${ApiEndPoint}getUniqueCaseSubTypes`, {
        withCredentials: true,
      });

      const filtercasesubtype = response.data?.subTypes;
      const filtercasetype = response.data?.CaseTypes;
      const filtercasetypeslist = response.data?.casetypeslist;

      await setSubtypelist(filtercasesubtype);
      await setcasetypeslistFilteroption(filtercasetypeslist);
      await setCaseTypeList(filtercasetype);

      setFilters((prev) => ({
        ...prev,
        CaseSubType: [...filtercasesubtype, ''],
        CaseType: [...filtercasetype, ''],
      }));
      showDataLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateCaseStage = async (caseId, newStage) => {
    try {
      const response = await axios.put(`${ApiEndPoint}updateCaseStage/${caseId}/${newStage}`);

      console.log('Update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating case stage:', error.response?.data || error.message);
    }
  };

  const updateCaseTypeAndFolder = async (caseId, newCaseType) => {
    try {
      showLoading();
      const response = await axios.post(`${ApiEndPoint}updateCaseTypeAndFolder/${caseId}/${newCaseType}`);
      fetchCases();
      showSuccess('✅ Success:', response.data.message);
      console.log('🔄 Updated Folder Name:', response.data.updatedFolderName);
    } catch (error) {
      console.log('error', error?.response?.data?.message);
      showError(`❌ Error: ${error?.response?.data?.message}`);
    }
  };
  const updateCaseSubTypeAndFolder = async (caseId, newCaseType) => {
    try {
      showLoading();
      const response = await axios.post(`${ApiEndPoint}updateCaseSubType/${caseId}/${newCaseType}`);
      fetchCases();
      showSuccess('✅ Success:', response.data.message);
      console.log('🔄 Updated CaseType:', response.data.Case);
    } catch (error) {
      console.log('error', error?.response?.data?.message);
      showError(`❌ Error: ${error?.response?.data?.message}`);
    }
  };
  const updateCaseCloseType = async (caseId, newCaseCloseType) => {
    try {
      console.log('caseId', caseId);
      showLoading();
      const response = await axios.put(`${ApiEndPoint}updateCloseType/${caseId}/${newCaseCloseType}`);
      fetchCases();
      showSuccess('✅ Success:', response.data.message);
      console.log('🔄 Updated CaseType:', response.data.Case);
    } catch (error) {
      console.log('error', error?.response?.data?.message);
      showError(`❌ Error: ${error?.response?.data?.message}`);
    }
  };

  useEffect(() => {
    console.log('Token received in useEffect:', token);
    if (token && token?._id && token.Role) {
      fetchCases();
    }
  }, [token, reduxCaseCloseType]);

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

  const handleNoteBlur = async (id, value) => {
    try {
      // optional: skip if value is unchanged or empty
      if (value.trim() === '') return;

      console.log('value= ', value);
      const res = await fetch(`${ApiEndPoint}updatePurpose/${id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: value }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Notes updated:', data);
      } else {
        console.error('Error:', data.message);
      }
    } catch (err) {
      console.error('Server error:', err);
    }
  };

  const allowedTransitions = ['Consultation->Non-Litigation', 'Consultation->Litigation', 'Non-Litigation->Litigation'];

  return (
    <div className="container-fluid p-0 mb-1 d-flex justify-content-center">
      <div
        className="card shadow p-2"
        style={{
          height: '86vh',
          // overflowY: "auto",
          maxWidth: '86vw',
          // minWidth:"50px",
          width: '86vw',
        }}
      >
        <div className="row mb-3 g-2 align-items-center px-2">
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
        <div
          className="card shadow "
          style={{
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#c0a262 #f1f1f1',
            maxWidth: '100%',
            width: '100%',
            minHeight: '76vh',
            minWidth: '150px',
          }}
        >
          <div style={{ minWidth: 'max-content' }}>
            <div
              className="d-none d-md-flex justify-content-between align-items-center gap-2 p-3 border-bottom"
              style={{
                backgroundColor: '#18273e',
                color: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <span
                className="d-flex gap-2 text-start"
                style={{
                  maxWidth: '180px',
                  minWidth: '180px',
                  position: 'sticky',
                  left: 0,
                  paddingLeft: 20,
                  height: 35,
                  // marginBottom:10,
                  zIndex: 2,
                  background: '#18273e',
                }}
              >
                ClientName
              </span>
              {/* CASE NUMBER Filter */}
              <span
                ref={caseNumberRef}
                className="d-flex gap-2 text-start"
                style={{
                  maxWidth: '150px',
                  minWidth: '150px',
                  color: 'white',
                }}
              >
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
                  <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {['asc', 'desc'].map((order) => (
                      <Dropdown.Item
                        key={order}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilters((prev) => ({ ...prev, sortOrder: order }));
                          setCaseFilter(false); // ✅ close on selection
                        }}
                      >
                        {order === 'asc' ? 'Ascending' : 'Descending'}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </span>

              {/* REQUEST NUMBER Headings */}

              <span
                className=" text-start"
                style={{
                  maxWidth: '150px',
                  height: 33,
                  minWidth: '150px',
                  color: 'white',
                }}
              >
                Request Number
              </span>

              {/* CASE TYPE Filter */}
              <span
                ref={caseTypeRef}
                className="d-flex gap-2 text-start"
                style={{ maxWidth: '200px', minWidth: '200px', color: 'white' }}
              >
                Type of Service
                <Dropdown show={showCaseTypeFilter} onToggle={() => setCaseTypeFilter(!showCaseTypeFilter)}>
                  <Dropdown.Toggle
                    variant=""
                    size="sm"
                    className="custom-dropdown-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCaseFilter(false);
                      setCaseSubTypeFilter(false);
                      setCaseTypeFilter(!showCaseTypeFilter);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFilter}
                      style={{
                        color:
                          filters.CaseType &&
                            filters.CaseType.length > 0 &&
                            filters.CaseType.length <= CaseTypeList.length
                            ? 'red'
                            : 'white',
                      }}
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange('CaseType', '__SELECT_ALL__');
                      }}
                    >
                      Select All
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters((prev) => ({ ...prev, CaseType: [] }));
                      }}
                    >
                      Clear All
                    </Dropdown.Item>

                    {/* Blank Option */}
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange('CaseType', '');
                      }}
                      style={{
                        backgroundColor: filters.CaseType.includes('') ? '' : '',
                        color: 'white',
                      }}
                    >
                      <Form.Check
                        type="checkbox"
                        label="(Blank)"
                        checked={filters.CaseType.includes('')}
                        onChange={() => { }}
                      />
                    </Dropdown.Item>

                    {/* Dynamic Options */}
                    {CaseTypeList.map((type) => (
                      <Dropdown.Item
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange('CaseType', type);
                        }}
                        style={{
                          backgroundColor: filters.CaseType.includes(type) ? '' : '',
                          color: 'white',
                        }}
                      >
                        <Form.Check
                          type="checkbox"
                          label={type}
                          checked={filters.CaseType.includes(type)}
                          onChange={() => { }}
                        />
                      </Dropdown.Item>
                    ))}

                    <Dropdown.Divider />
                    <div className="text-end px-2 pb-2">
                      <div
                        role="button"
                        style={{
                          padding: '4px 12px',
                          border: '1px solid #18273e',
                          borderRadius: '4px',
                          color: 'white',
                          backgroundColor: '#18273e',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'inline-block',
                        }}
                        onClick={() => {
                          handleApplyFilter('CaseType');
                          setCaseTypeFilter(false);
                        }}
                      >
                        Done
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </span>

              {/* CASE SUB TYPE Filter */}
              <span
                ref={caseSubTypeRef}
                className="d-flex gap-2 text-start"
                style={{ maxWidth: '200px', minWidth: '200px', color: 'white' }}
              >
                Service Type
                <Dropdown show={showCaseSubTypeFilter} onToggle={() => setCaseSubTypeFilter(!showCaseSubTypeFilter)}>
                  <Dropdown.Toggle
                    variant=""
                    size="sm"
                    className="custom-dropdown-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCaseTypeFilter(false);
                      setCaseFilter(false);
                      setCaseSubTypeFilter(!showCaseSubTypeFilter);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faFilter}
                      style={{
                        color:
                          filters.CaseSubType &&
                            filters.CaseSubType.length > 0 &&
                            filters.CaseSubType.length <= Subtypelist.length
                            ? 'red' // kuch select hain lekin sab nahi
                            : 'white',
                      }}
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange('CaseSubType', '__SELECT_ALL__');
                      }}
                    >
                      Select All
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilters((prev) => ({ ...prev, CaseSubType: [] }));
                      }}
                    >
                      Clear All
                    </Dropdown.Item>

                    {/* Blank Option */}
                    <Dropdown.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilterChange('CaseSubType', '');
                      }}
                      style={{
                        backgroundColor: filters.CaseSubType.includes('') ? '' : '',
                        color: 'white',
                      }}
                    >
                      <Form.Check
                        type="checkbox"
                        label="(Blank)"
                        checked={filters.CaseSubType.includes('')}
                        onChange={() => { }}
                      />
                    </Dropdown.Item>

                    {/* Dynamic Options */}
                    {Subtypelist.map((type) => (
                      <Dropdown.Item
                        key={type}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange('CaseSubType', type);
                        }}
                        style={{
                          backgroundColor: filters.CaseSubType.includes(type) ? '' : '',
                          color: 'white',
                        }}
                      >
                        <Form.Check
                          type="checkbox"
                          label={type}
                          checked={filters.CaseSubType.includes(type)}
                          onChange={() => { }}
                        />
                      </Dropdown.Item>
                    ))}

                    <Dropdown.Divider />
                    <div className="text-end px-2 pb-2">
                      <div
                        role="button"
                        style={{
                          padding: '4px 12px',
                          border: '1px solid #18273e',
                          borderRadius: '4px',
                          color: 'white',
                          backgroundColor: '#18273e',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'inline-block',
                        }}
                        onClick={() => {
                          handleApplyFilter('CaseSubType');
                          setCaseSubTypeFilter(false);
                        }}
                      >
                        OK
                      </div>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </span>

              {/* LFQ Heading */}
              {/* <span className=" text-start" style={{
                maxWidth: '200px',
                minWidth: '200px',
                height: 33,
                color: 'white'
              }}>Legal Fee Quatation</span> */}

              {/* service sub type */}
              {/* <span
                className=" text-start"
                style={{
                  maxWidth: '200px',
                  minWidth: '200px',
                  height: 33,
                  color: 'white',
                }}
              >
                Service Sub Type
              </span> */}
              {/* LFA Heading */}
              <span
                className=" text-start"
                style={{
                  maxWidth: '200px',
                  minWidth: '200px',
                  height: 33,
                  color: 'white',
                }}
              >
                Legal Fee Agreement
              </span>
              {/* PURPOSE Heading */}
              <span
                className=" text-start"
                style={{
                  maxWidth: '250px',
                  minWidth: '250px',
                  height: 33,
                  color: 'white',
                }}
              >
                Purpose
              </span>

              {/* ACTION Heading */}
              <span
                className=" text-end"
                style={{
                  maxWidth: '100px',
                  minWidth: '100px',
                  height: 33,

                  color: 'white',
                }}
              >
                Action
              </span>
            </div>

            {[
              ...getFilteredCases()
                .slice((currentPage - 1) * casesPerPage, currentPage * casesPerPage)
                .map((item, index) => (
                  <div key={index} className="border-bottom position-relative">
                    {/* Mobile View */}
                    {/* MOBILE VIEW */}
                    <div
                      className="d-md-none p-2"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '83vh',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                    >
                      {/* Header with dropdown and case info */}
                      <div className="d-flex justify-content-end align-items-start mb-3">
                        {/* Dropdown */}
                        <div className="me-2 flex-shrink-0">
                          <Dropdown
                            show={dropdownOpen === item?.headerCase?._id}
                            onToggle={(isOpen) => setDropdownOpen(isOpen ? item?.headerCase?._id : null)}
                          >
                            <Dropdown.Toggle
                              variant=""
                              size="sm"
                              className="custom-dropdown-toggle"
                              style={{
                                minWidth: '36px',
                                minHeight: '36px',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setDropdownOpen(dropdownOpen === item?.headerCase?._id ? null : item?.headerCase?._id);
                              }}
                            >
                              <i className=" fa-ellipsis-v"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                              {token.Role === 'admin' && reduxCaseCloseType === '' && isViewCase === false && (
                                <>
                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleOpenModal(item?.headerCase);
                                    }}
                                  >
                                    Assign Case
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={async (event) => {
                                      event.stopPropagation();
                                      setLoaderOpen(true);
                                      try {
                                        const response = await updateFunction(item?.headerCase);
                                        if (response?.success) setLoaderOpen(false);
                                      } catch (err) {
                                        console.error('Update failed', err);
                                        setLoaderOpen(false);
                                      }
                                    }}
                                  >
                                    Update Case
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowMergeModal(true);
                                    }}
                                  >
                                    Merge With
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowCloseType(true);
                                    }}
                                  >
                                    Close Type
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowCaseType(true);
                                    }}
                                  >
                                    {item?.headerCase?.CaseType ? 'Update' : 'Add'} Type of Service
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowSubCaseType(true);
                                    }}
                                  >
                                    {item?.headerCase?.CaseSubType ? 'Update' : 'Add'} Service Type
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowCaseStages(true);
                                    }}
                                  >
                                    Set Case Stage
                                  </Dropdown.Item>
                                </>
                              )}

                              <Dropdown.Item>View Details</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      {/* Additional Case Details */}
                      <div className="d-flex flex-column gap-2 mb-3">
                        {/* Case Info */}
                        <div className="flex-grow-1">
                          <div className="d-flex flex-column gap-1">
                            {/* CLIENT NAME */}
                            <div className="d-flex flex-column gap-1">
                              <span className="text-muted small">Client : </span>
                              <span
                                className="fw-medium text-break"
                                style={{
                                  display: 'block', // ensures wrapping works
                                  whiteSpace: 'normal', // allows text to wrap
                                  width: '30vw',
                                  overflowWrap: 'break-word', // handles long words
                                  wordBreak: 'break-word', // extra safety
                                  fontSize: '0.9rem', // smaller font for mobile
                                  // lineHeight: "1.3",          // better readability
                                }}
                              >
                                {item?.headerCase?.ClientName}
                              </span>
                            </div>

                            {/* CASE NUMBER */}
                            <div className="d-flex flex-row gap-1">
                              <span className="text-muted small">Case # </span>
                              <span
                                className="fw-medium text-break"
                                style={{
                                  display: 'block', // ensures wrapping works
                                  whiteSpace: 'normal', // allows text to wrap
                                  width: '30vw',
                                  overflowWrap: 'break-word', // handles long words
                                  wordBreak: 'break-word', // extra safety
                                  fontSize: '0.9rem', // smaller font for mobile
                                  // lineHeight: "1.3",          // better readability
                                }}
                              >
                                {item?.headerCase?.CaseNumber}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* SERIAL NUMBER */}
                        <div className="d-flex flex-row gap-1">
                          <span className="text-muted small">Request # </span>
                          <span
                            className="fw-medium text-break"
                            style={{
                              display: 'block', // ensures wrapping works
                              whiteSpace: 'normal', // allows text to wrap
                              width: '30vw',
                              overflowWrap: 'break-word', // handles long words
                              wordBreak: 'break-word', // extra safety
                              fontSize: '0.9rem', // smaller font for mobile
                              // lineHeight: "1.3",          // better readability
                            }}
                          >
                            {item?.headerCase?.SerialNumber}
                          </span>
                        </div>

                        {/* CASE TYPE */}
                        <div className="d-flex flex-row gap-1">
                          <span className="text-muted small">Type of Service : </span>
                          <span
                            className="fw-medium text-break"
                            style={{
                              display: 'block', // ensures wrapping works
                              whiteSpace: 'normal', // allows text to wrap
                              width: '30vw',
                              overflowWrap: 'break-word', // handles long words
                              wordBreak: 'break-word', // extra safety
                              fontSize: '0.9rem', // smaller font for mobile
                              // lineHeight: "1.3",          // better readability
                            }}
                          >
                            {item?.headerCase?.CaseType || 'N/A'}
                          </span>
                        </div>

                        {/* CASE SUB TYPE */}
                        <div className="d-flex flex-row gap-1">
                          <span className="text-muted small">Service Type : </span>
                          <span
                            className="fw-medium text-break"
                            style={{
                              display: 'block', // ensures wrapping works
                              whiteSpace: 'normal', // allows text to wrap
                              width: '30vw',
                              overflowWrap: 'break-word', // handles long words
                              wordBreak: 'break-word', // extra safety
                              fontSize: '0.9rem', // smaller font for mobile
                              // lineHeight: "1.3",          // better readability
                            }}
                          >
                            {item?.headerCase?.CaseSubType || 'N/A'}
                          </span>
                        </div>

                        {/* SERVICE SUB TYPE */}
                        <div className="d-flex flex-row gap-1">
                          <span className="text-muted small">Service Sub Type : </span>
                          <span
                            className="fw-medium text-break"
                            style={{
                              display: 'block', // ensures wrapping works
                              whiteSpace: 'normal', // allows text to wrap
                              width: '30vw',
                              overflowWrap: 'break-word', // handles long words
                              wordBreak: 'break-word', // extra safety
                              fontSize: '0.9rem', // smaller font for mobile
                              // lineHeight: "1.3",          // better readability
                            }}
                          >
                            {item?.headerCase?.ServiceSubType || 'N/A'}
                          </span>
                        </div>

                        {/* LFA */}
                        {item?.headerCase?.IsLFA && (
                          <div
                            className="fw-medium text-break text-primary text-decoration-underline"
                            style={{
                              display: 'block', // ensures wrapping works
                              whiteSpace: 'normal', // allows text to wrap
                              width: '40vw',
                              overflowWrap: 'break-word', // handles long words
                              wordBreak: 'break-word', // extra safety
                              fontSize: '0.9rem', // smaller font for mobile
                              lineHeight: '1.3', // better readability
                              cursor: 'pointer',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(Caseinfo(item?.headerCase));
                              dispatch(screenChange(27));
                            }}
                          >
                            Go To LFA
                          </div>
                        )}
                      </div>

                      {/* NOTES */}
                      <div className="w-100 ">
                        <div className="text-muted small mb-1">Purpose</div>
                        <textarea
                          className="form-control text-wrap"
                          rows="2"
                          value={item?.headerCase?.notes || ''}
                          onChange={(e) => handleEdit(index, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => handleNoteBlur(item?.headerCase?._id, e.target.value)}
                          style={{
                            resize: 'vertical', // allow resize on larger screens
                            minHeight: '30px', // good base height
                            width: '100%', // full width responsiveness
                            minWidth: '20px', // safe min width for tiny screens
                            wordWrap: 'break-word', // wrap long text
                            overflowWrap: 'break-word', // ensure wrapping
                            // fontSize: "0.9rem",           // smaller font for mobile readability
                          }}
                        />
                      </div>

                      {/* BUTTON TO TOGGLE SUBCASES */}
                      {item?.subcases?.length > 0 && (
                        <button
                          className=""
                          style={{
                            backgroundColor: '#16213e',
                            color: 'white',
                            width: '150px',
                            minWidth: '100px',
                            maxWidth: '200px',
                            padding: '8px 20px',
                            borderRadius: '4px',
                            marginTop: 10,
                            fontSize: '14px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            border: '2px solid #16213e',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            fontWeight: '500',
                          }}
                          onClick={() => setExpanded(expanded === item?.headerCase?._id ? null : item?.headerCase?._id)}
                        >
                          {expanded === item?.headerCase?._id ? (
                            <>
                              <i className="fas fa-chevron-up me-2"></i>
                              Hide Subcases ({item?.subcases?.length})
                            </>
                          ) : (
                            <>
                              <i className="fas fa-chevron-down me-2"></i>
                              Show Subcases ({item?.subcases?.length})
                            </>
                          )}
                        </button>
                      )}

                      {/* SUBCASES LIST */}
                      {item?.headerCase?._id &&
                        expanded === item?.headerCase?._id &&
                        item?.subcases?.map((sub, subIndex) => (
                          <div
                            key={sub?._id}
                            className="border rounded p-2 mb-3"
                            style={{ backgroundColor: '#f8f9fa' }}
                          >
                            {/* Subcase Header with Dropdown */}
                            <div className="d-flex align-items-start mb-2">
                              <div className="me-2 flex-shrink-0">
                                <Dropdown
                                  show={dropdownOpen === sub?._id}
                                  onToggle={(isOpen) => setDropdownOpen(isOpen ? sub._id : null)}
                                >
                                  <Dropdown.Toggle
                                    variant=""
                                    size="sm"
                                    className="border rounded-circle"
                                    style={{
                                      minWidth: '32px',
                                      minHeight: '32px',
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDropdownOpen(dropdownOpen === sub._id ? null : sub._id);
                                    }}
                                  >
                                    <i className="fa-ellipsis-v small"></i>
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    {token.Role === 'admin' && reduxCaseCloseType === '' && isViewCase === false && (
                                      <>
                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleOpenModal(sub);
                                          }}
                                        >
                                          Assign Case
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={async (event) => {
                                            event.stopPropagation();
                                            setLoaderOpen(true);
                                            try {
                                              const response = await updateFunction(sub);
                                              if (response?.success) setLoaderOpen(false);
                                            } catch (err) {
                                              console.error('Update failed', err);
                                              setLoaderOpen(false);
                                            }
                                          }}
                                        >
                                          Update Case
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(sub);
                                            setShowMergeModal(true);
                                          }}
                                        >
                                          Merge With
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(sub);
                                            setShowCloseType(true);
                                          }}
                                        >
                                          Close Type
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(sub);
                                            setShowCaseType(true);
                                          }}
                                        >
                                          {sub?.CaseType ? 'Update' : 'Add'} Type of Service
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(sub);
                                            setShowSubCaseType(true);
                                          }}
                                        >
                                          {sub?.CaseSubType ? 'Update' : 'Add'} Service Type
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedCase(sub);
                                            setShowCaseStages(true);
                                          }}
                                        >
                                          Set Case Stage
                                        </Dropdown.Item>
                                      </>
                                    )}
                                    <Dropdown.Item>View Details</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>

                              <div
                                className="flex-grow-1"
                                onClick={(e) => {
                                  if (
                                    e.target.tagName !== 'INPUT' &&
                                    e.target.tagName !== 'TEXTAREA' &&
                                    e.target.tagName !== 'BUTTON'
                                  ) {
                                    handleClick(1, sub);
                                  }
                                }}
                              ></div>
                            </div>

                            {/* Subcase Details */}
                            <div className="d-flex flex-column gap-2">
                              <div className="d-flex flex-row text-wrap gap-1">
                                <span className="text-muted small">Case # </span>
                                <span
                                  className="fw-medium text-break"
                                  style={{
                                    display: 'block', // ensures wrapping works
                                    whiteSpace: 'normal', // allows text to wrap
                                    width: '30vw',
                                    overflowWrap: 'break-word', // handles long words
                                    wordBreak: 'break-word', // extra safety
                                    fontSize: '0.9rem', // smaller font for mobile
                                    // lineHeight: "1.3",          // better readability
                                  }}
                                >
                                  {sub?.CaseNumber}
                                </span>
                              </div>
                              {/* SERIAL NUMBER */}
                              <div className="d-flex flex-row gap-1">
                                <span className="text-muted small">Request # </span>
                                <span
                                  className="fw-medium text-break"
                                  style={{
                                    display: 'block', // ensures wrapping works
                                    whiteSpace: 'normal', // allows text to wrap
                                    width: '30vw',
                                    overflowWrap: 'break-word', // handles long words
                                    wordBreak: 'break-word', // extra safety
                                    fontSize: '0.9rem', // smaller font for mobile
                                    // lineHeight: "1.3",          // better readability
                                  }}
                                >
                                  {sub?.SerialNumber}
                                </span>
                              </div>

                              {/* CASE TYPE */}
                              <div className="d-flex flex-row gap-1">
                                <span className="text-muted small">Type of Service : </span>
                                <span
                                  className="fw-medium text-break"
                                  style={{
                                    display: 'block', // ensures wrapping works
                                    whiteSpace: 'normal', // allows text to wrap
                                    width: '30vw',
                                    overflowWrap: 'break-word', // handles long words
                                    wordBreak: 'break-word', // extra safety
                                    fontSize: '0.9rem', // smaller font for mobile
                                    // lineHeight: "1.3",          // better readability
                                  }}
                                >
                                  {sub?.CaseType || 'N/A'}
                                </span>
                              </div>

                              {/* CASE SUB TYPE */}
                              <div className="d-flex flex-row gap-1">
                                <span className="text-muted small">Service Type</span>
                                <span
                                  className="fw-medium text-break"
                                  style={{
                                    display: 'block', // ensures wrapping works
                                    whiteSpace: 'normal', // allows text to wrap
                                    width: '30vw',
                                    overflowWrap: 'break-word', // handles long words
                                    wordBreak: 'break-word', // extra safety
                                    fontSize: '0.9rem', // smaller font for mobile
                                    // lineHeight: "1.3",          // better readability
                                  }}
                                >
                                  {sub?.CaseSubType || 'N/A'}
                                </span>
                              </div>

                              {/* SERVICE SUB TYPE */}
                              {/* <div className="d-flex flex-row gap-1">
                                <span className="text-muted small">Service Sub Type</span>
                                <span
                                  className="fw-medium text-break"
                                  style={{
                                    display: 'block', // ensures wrapping works
                                    whiteSpace: 'normal', // allows text to wrap
                                    width: '30vw',
                                    overflowWrap: 'break-word', // handles long words
                                    wordBreak: 'break-word', // extra safety
                                    fontSize: '0.9rem', // smaller font for mobile
                                    // lineHeight: "1.3",          // better readability
                                  }}
                                >
                                  {sub?.ServiceSubType || 'N/A'}
                                </span>
                              </div> */}

                              {/* LFA */}
                              {sub?.IsLFA && (
                                <div
                                  className="fw-medium text-break text-primary text-decoration-underline"
                                  style={{
                                    display: 'block', // ensures wrapping works
                                    whiteSpace: 'normal', // allows text to wrap
                                    width: '30vw',
                                    overflowWrap: 'break-word', // handles long words
                                    wordBreak: 'break-word', // extra safety
                                    fontSize: '0.9rem', // smaller font for mobile
                                    lineHeight: '1.3',
                                    cursor: 'pointer', // better readability
                                  }}
                                  // style={{ cursor: "pointer" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(Caseinfo(sub));
                                    dispatch(screenChange(27));
                                  }}
                                >
                                  Go To LFA
                                </div>
                              )}

                              {/* NOTES */}
                              <div className="w-100">
                                <div className="text-muted small mb-1">Purpose</div>
                                <textarea
                                  className="form-control text-wrap"
                                  rows="2"
                                  value={sub.notes || ''}
                                  onChange={(e) => handleSubEdit(index, subIndex, e.target.value)}
                                  onBlur={(e) => handleNoteBlur(sub?._id, e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    resize: 'vertical', // allow resize on larger screens
                                    minHeight: '50px', // good base height
                                    width: '100%', // full width responsiveness
                                    minWidth: '20px', // safe min width for tiny screens
                                    wordWrap: 'break-word', // wrap long text
                                    overflowWrap: 'break-word', // ensure wrapping
                                    fontSize: '0.9rem',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Desktop View - Horizontal Layout */}

                    <div key={item.headerCase?._id}>
                      {/* 🔹 HEADER CASE */}
                      <div
                        className="d-none d-md-flex justify-content-between align-items-center gap-2 p-1"
                        style={{ cursor: 'pointer', backgroundColor: '#ffffff' }}
                        onClick={(e) => {
                          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                            handleClick(1, item?.headerCase);
                          }
                        }}
                      >
                        {/* Arrow button */}
                        <span
                          style={{ width: '30px', cursor: 'pointer', textAlign: 'center' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item?.headerCase?._id) {
                              toggleExpand(item?.headerCase?._id);
                            }
                          }}
                        >
                          {item.subcases.length > 0 && item?.headerCase?._id ? (
                            expanded === item?.headerCase?._id ? (
                              <FaChevronDown />
                            ) : (
                              <FaChevronRight />
                            )
                          ) : (
                            ''
                          )}
                        </span>

                        {/* CLIENT NAME */}
                        <span
                          className="text-start d-flex align-items-center"
                          style={{
                            maxWidth: '150px',
                            minWidth: '150px',
                            position: 'sticky',
                            height: '15vh',
                            left: 0,
                            backgroundColor: '#ffffff',
                            zIndex: 2,
                            borderRight: '1px solid #ccc',
                            boxShadow: '2px 0 4px rgba(0, 0, 0, 0.03)',
                            paddingLeft: '1rem',
                            paddingRight: '1rem',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            cursor: 'pointer', // 👈 makes it look clickable
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item?.headerCase?._id) {
                              toggleExpand(item?.headerCase?._id);
                            }
                          }}
                        >
                          {item?.headerCase?.ClientName}
                        </span>

                        {/* CASE NUMBER */}
                        <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                          {item?.headerCase?.CaseNumber}
                        </span>
                        {/* SERIAL NUMBER */}
                        <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                          {item?.headerCase?.SerialNumber}
                        </span>
                        {/* CASE TYPE */}
                        <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                          {item?.headerCase?.CaseType}
                        </span>
                        {/* CASE SUB TYPE */}
                        <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                          {item?.headerCase?.CaseSubType}
                        </span>
                        {/* service SUB TYPE */}
                        {/* <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}></span> */}
                        {/* LFA */}
                        <div
                          className="text-start"
                          style={{
                            maxWidth: '200px',
                            minWidth: '200px',
                            color: '#007bff',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(Caseinfo(item?.headerCase));
                            dispatch(screenChange(27));
                          }}
                        >
                          {item?.headerCase?.IsLFA ? 'Go To LFA' : ''}
                        </div>
                        {/* NOTES */}
                        <div className="" style={{ maxWidth: '250px', minWidth: '250px' }}>
                          <input
                            className="form-control"
                            type="text"
                            value={item?.headerCase?.notes || item?.notes}
                            onChange={(e) => handleEdit(index, e.target.value)}
                            onBlur={(e) => handleNoteBlur(item?.headerCase?._id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>

                        <div
                          className="col d-flex justify-content-end"
                          style={{
                            maxWidth: '100px',
                            minWidth: '100px',
                          }}
                        >
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
                              {token.Role === 'admin' && reduxCaseCloseType === '' && isViewCase === false && (
                                <>
                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleOpenModal(item?.headerCase);
                                    }}
                                  >
                                    Assign Case
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={async (event) => {
                                      event.stopPropagation();
                                      setLoaderOpen(true);
                                      try {
                                        const response = await updateFunction(item?.headerCase);
                                        if (response?.success) setLoaderOpen(false);
                                      } catch (err) {
                                        console.error('Update failed', err);
                                        setLoaderOpen(false);
                                      }
                                    }}
                                  >
                                    Update Case
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowMergeModal(true);
                                    }}
                                  >
                                    Merge With
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowCloseType(true);
                                    }}
                                  >
                                    Close Type
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowCaseType(true);
                                    }}
                                  >
                                    {item?.headerCase.CaseType ? 'Update' : 'Add'} Type of Service
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowSubCaseType(true);
                                    }}
                                  >
                                    {item?.headerCase.CaseSubType ? 'Update' : 'Add'} Service Type
                                  </Dropdown.Item>

                                  <Dropdown.Item
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setSelectedCase(item?.headerCase);
                                      setShowCaseStages(true);
                                    }}
                                  >
                                    Set Case Stage
                                  </Dropdown.Item>
                                </>
                              )}
                              <Dropdown.Item>View Details</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      {/* 🔽 SUBCASES (same style) */}
                      {item?.headerCase?._id &&
                        expanded === item?.headerCase?._id &&
                        item?.subcases?.map((sub, subIndex) => (
                          <div
                            key={sub?._id}
                            className="d-none d-md-flex justify-content-between align-items-center gap-2 p-1"
                            style={{
                              cursor: 'pointer',
                              backgroundColor: '#fafafa', // halka fark dikhane k liye optional
                            }}
                            onClick={(e) => {
                              if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                                handleClick(1, sub);
                              }
                            }}
                          >
                            {/* Empty arrow space */}
                            <span style={{ width: '30px' }}></span>

                            {/* CLIENT NAME */}
                            <span
                              className="text-start d-flex align-items-center"
                              style={{
                                maxWidth: '150px',
                                minWidth: '150px',
                                position: 'sticky',
                                height: '11vh',
                                left: 0,
                                backgroundColor: '#ffffff',
                                zIndex: 2,
                                borderRight: '1px solid #ccc',
                                boxShadow: '2px 0 4px rgba(0, 0, 0, 0.03)',
                                paddingLeft: '1rem',
                              }}
                            >
                              {/* {sub?.ClientName} */}
                            </span>

                            <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                              {sub?.CaseNumber}
                            </span>

                            <span className="text-start" style={{ maxWidth: '150px', minWidth: '150px' }}>
                              {sub?.SerialNumber}
                            </span>

                            <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                              {sub?.CaseType}
                            </span>

                            <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}>
                              {sub?.CaseSubType}
                            </span>
                            {/** service sub type */}
                            {/* <span className="text-start" style={{ maxWidth: '200px', minWidth: '200px' }}></span> */}

                            {/* LFA */}
                            <div
                              className="text-start"
                              style={{
                                maxWidth: '200px',
                                minWidth: '200px',
                                color: '#007bff',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(Caseinfo(sub));
                                dispatch(screenChange(27));
                              }}
                            >
                              {sub?.IsLFA ? 'Go To LFA' : ''}
                            </div>

                            {/* NOTES */}
                            <div className="" style={{ maxWidth: '250px', minWidth: '250px' }}>
                              <input
                                className="form-control"
                                type="text"
                                value={sub.notes || ''}
                                onChange={(e) => handleSubEdit(index, subIndex, e.target.value)}
                                onBlur={(e) => handleNoteBlur(sub._id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <div
                              className="col d-flex justify-content-end"
                              style={{
                                maxWidth: '100px',
                                minWidth: '100px',
                              }}
                            >
                              <Dropdown
                                show={dropdownOpen === sub?._id}
                                onToggle={(isOpen) => setDropdownOpen(isOpen ? sub._id : null)}
                              >
                                <Dropdown.Toggle
                                  variant=""
                                  size="sm"
                                  className="custom-dropdown-toggle"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDropdownOpen(dropdownOpen === sub._id ? null : sub._id);
                                  }}
                                ></Dropdown.Toggle>

                                <Dropdown.Menu>
                                  {token.Role === 'admin' && reduxCaseCloseType === '' && isViewCase === false && (
                                    <>
                                      <Dropdown.Item
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleOpenModal(sub);
                                        }}
                                      >
                                        Assign Case
                                      </Dropdown.Item>

                                      <Dropdown.Item
                                        onClick={async (event) => {
                                          event.stopPropagation();
                                          setLoaderOpen(true);
                                          try {
                                            const response = await updateFunction(sub);
                                            if (response?.success) setLoaderOpen(false);
                                          } catch (err) {
                                            console.error('Update failed', err);
                                            setLoaderOpen(false);
                                          }
                                        }}
                                      >
                                        Update Case
                                      </Dropdown.Item>

                                      <Dropdown.Item
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setSelectedCase(sub);
                                          setShowMergeModal(true);
                                        }}
                                      >
                                        Merge With
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setSelectedCase(sub);
                                          setShowCloseType(true);
                                        }}
                                      >
                                        Close Type
                                      </Dropdown.Item>

                                      <Dropdown.Item
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setSelectedCase(sub);
                                          setShowCaseType(true);
                                        }}
                                      >
                                        {item?.CaseType ? 'Update' : 'Add'} Type of Service
                                      </Dropdown.Item>

                                      <Dropdown.Item
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setSelectedCase(sub);
                                          setShowSubCaseType(true);
                                        }}
                                      >
                                        {item?.CaseSubType ? 'Update' : 'Add'} Service Type
                                      </Dropdown.Item>

                                      <Dropdown.Item
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          setSelectedCase(sub);
                                          setShowCaseStages(true);
                                        }}
                                      >
                                        Set Case Stage
                                      </Dropdown.Item>
                                    </>
                                  )}
                                  <Dropdown.Item>View Details</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )),
            ]}
          </div>
          {totalPages > 1 && !searchQuery && (
            <div className="p-3">
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: '#18273e',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '2px solid #d4af37',
                  margin: 'auto',
                  maxWidth: '100%',
                  width: 'fit-content',
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
                    <span className="text-white me-2 d-none d-sm-block">Page</span>
                    <input
                      value={currentPage}
                      min={1}
                      max={totalPages}
                      onChange={(e) => goToPage(Math.max(1, Math.min(totalPages, Number(e.target.value))))}
                      className="form-control text-center"
                      style={{
                        width: '60px',
                        border: '2px solid #d4af37',
                        backgroundColor: '#18273e',
                        color: 'white',
                      }}
                    />
                    <span className="text-white ms-2 d-none d-sm-block">of {totalPages}</span>
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
          <CaseAssignmentForm selectedCase={selectedCase} casedetails={casedetails} onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>

      {/* MUI Loader */}
      {loaderOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#16213e',
            padding: '24px 32px',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <CircularProgress sx={{ color: '#d2a85a' }} />
          <div
            style={{
              marginTop: 16,
              fontWeight: '500',
              color: 'white',
            }}
          >
            Updating Case...
          </div>
        </div>
      )}

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
              let old = selectedCase?.IsDubiCourts ? selectedCourtCaseId : selectedCase?._id;
              let newcase = selectedCase?.IsDubiCourts ? selectedCase?._id : selectedCourtCaseId;
              mergeCaseWithCourt(old, newcase);
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
              <Form.Label>Select Case Stage</Form.Label>
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
              updateCaseStage(selectedCase?._id, selectedCaseStage);
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
          <Modal.Title>{selectedCase?.CaseType ? 'Update' : 'Add'} Type of Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mergeWithCase" className="w-100">
              <Form.Label>Select Type of Service</Form.Label>

              <Form.Select
                className="w-100"
                value={selectedCaseType}
                onChange={(e) => setSelectedCaseType(e.target.value)}
              >
                <option value="">Select the option</option>
                {['Consultation', 'Litigation', 'Non-Litigation'].map((caseItem) => (
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
              console.log('Selected case =', selectedCase);
              updateCaseTypeAndFolder(selectedCase?._id, selectedCaseType);
              setShowCaseType(false);
            }}
            disabled={!selectedCaseType}
          >
            {selectedCase?.CaseType ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSubCaseType} onHide={() => setShowSubCaseType(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCase?.CaseSubType ? 'Update' : 'Add'} Service Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="mergeWithCase" className="w-100">
              <Form.Label>Select Service Type</Form.Label>

              <Form.Select
                className="w-100"
                value={selectedSubCaseType}
                onChange={(e) => setSelectedSubCaseType(e.target.value)}
              >
                <option value="">Select the option</option>
                {UpdateSubtypelist.map((caseItem) => (
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
              console.log('Selected case =', selectedCase);
              updateCaseSubTypeAndFolder(selectedCase?._id, selectedSubCaseType);
              setShowSubCaseType(false);
            }}
            disabled={!selectedSubCaseType}
          >
            {selectedCase?.CaseSubType ? 'Update' : 'Add'}
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
                {['Close Negative', 'Close Positive'].map((caseItem) => (
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
              console.log('Selected case =', selectedCase);
              updateCaseCloseType(selectedCase?._id, selectedCloseType);
              setShowCloseType(false);
            }}
            disabled={!selectedCloseType}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BasicCase;
