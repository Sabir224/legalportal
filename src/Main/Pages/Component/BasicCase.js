import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BasicCase.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../REDUX/sliece";
import * as XLSX from "xlsx";
import filepath from "../../../utils/dataset.csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGreaterThan,
  faLessThan,
  faLongArrowAltRight,
  faLongArrowLeft,
  faLongArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { setParams } from "../../../REDUX/actions";
import { ApiEndPoint } from "./utils/utlis";

const BasicCase = () => {
  const [caseNumber, setCaseNumber] = useState("");
  const [caseName, setCaseName] = useState("");
  const navigate = useNavigate();
  const [check, setcheck] = useState(true);
  const screen = useSelector((state) => state.screen.value);
  console.log("change screen value", screen);
  const dispatch = useDispatch();

  const [responseData, setResponseData] = useState(null);

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
            const response = await axios.get('http://localhost:8080/api/getcase'); // API endpoint
            // console.log("data of case",response.data.data); // Assuming the API returns data in the `data` field
            setData(response.data.data)
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

  // Fetch cases on component mount

  const handleViewDetails = () => {
    console.log("View details for:", caseNumber, caseName);
  };

  const handleClick = async (scr, item) => {
    // const newParams = { CaseId:item.CaseId };
    // dispatch(setParams(newParams));
    global.CaseId = item;
    console.log("  global.CaseId ", item._id);
    dispatch(screenChange(1));

    await setcheck(!check);
    //alert(`Clicked: ${item.name}`);
  };

  const data1 = [
    { status: "Active", name: "ABC", number: "1234" },
    { status: "Inactive", name: "DEF", number: "5678" },
    { status: "Pending", name: "GHI", number: "9101" },
  ];

  const requiredColumns = [
    "Case Number",
    "Case Type",
    "Law Firm",
    "Date",
    "Status",
    "Reference Number",
    "View Options",
  ];

  // const data = Array.from({ length: 150 }, (_, i) => ({
  //     id: i + 1,
  //     name: `Item ${i + 1}`,
  //   }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100; // Number of items per page

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

  const handleSaveInCase = async (data) => {
    const requestBody = {
      CaseNumber: data["Case Number"],
      Status: data.Status,
      Name: data["Case Type"],
      LawyerEmail: "Lawyer@gmail.com",
    };

    console.log(requestBody);
    try {
      const response = await fetch(`${ApiEndPoint}getcase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response received");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResponseData(data);
    } catch (error) {
      console.error("Error in POST request:", error.message || error);
    }
  };
  // Function to fetch and parse the Excel file
  // const loadExcelFile = async () => {
  //     try {
  //         // Fetch the file from a predefined location
  //         const response = await fetch(filepath);
  //         if (!response.ok) {
  //             throw new Error("Failed to fetch the Excel file");
  //         }

  //         // Read the file as a binary blob
  //         const blob = await response.blob();

  //         // Use FileReader to convert blob to binary string
  //         const reader = new FileReader();
  //         reader.onload = (e) => {
  //             try {
  //                 const binaryData = e.target.result;

  //                 // Parse the binary data using xlsx
  //                 const workbook = XLSX.read(binaryData, { type: "binary" });

  //                 // Get the first sheet
  //                 const sheetName = workbook.SheetNames[0];
  //                 const worksheet = workbook.Sheets[sheetName];

  //                 // Convert the sheet to JSON
  //                 const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //                 // Filter only the required columns
  //                 const filteredData = jsonData.map((row) => {
  //                     const filteredRow = {};
  //                     requiredColumns.forEach((column) => {
  //                         filteredRow[column] = row[column] || null; // Use null for missing columns
  //                     });
  //                     return filteredRow;
  //                 });

  //                 // Update state
  //                 console.log("data is =", filteredData)
  //                 // setData(filteredData);
  //                 filteredData.forEach(element => {
  //                     handleSaveInCase(element)

  //                 });

  //             } catch (parseError) {
  //                 setError("Error parsing the Excel file.");
  //                 console.error(parseError);
  //             }
  //         };

  //         reader.onerror = (err) => {
  //             setError("Error reading the Excel file.");
  //             console.error(err);
  //         };

  //         reader.readAsBinaryString(blob);
  //     } catch (err) {
  //         setError(err.message || "An error occurred while loading the file.");
  //         console.error(err);
  //     }
  // };

  // // Load the file automatically when the component mounts
  // useEffect(() => {
  //     loadExcelFile();
  // }, []);

  return (
    <div className="container-fluid">
      <div className="card mb-3 shadow">
        <div className="card-header d-flex justify-content-between">
          <span>Status</span>
          <span>Case Number</span>
          <span>Name</span>
        </div>
        <div className="card-list p-0">
          {getCurrentPageData().map((item, index) => (
            <div key={index}>
              <div
                className="d-flex justify-content-between align-items-center p-3 border-bottom"
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(1, item)}
              >
                <span className="d-flex align-items-center">
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
                <span>{item["CaseNumber"]}</span>
                <span>{item["Name"]}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div
          id="numberbar"
          style={{
            position: "sticky",
            bottom: "10px",
            backgroundColor: "#18273e",
            zIndex: 10,
            padding: "10px",
            alignSelf: "center",
            borderRadius: "8px",
            textAlign: "center",
            border: "2px solid #d4af37",
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
            {/* Previous Page Button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="first-lastbutton"
              style={
                {
                  // backgroundColor: "#18273e",
                  // color: "white",
                  // borderRadius: "6px",
                  // padding: "5px 10px",
                  // border: "2px solid #d4af37",
                }
              }
            >
              Previous
            </button>

            {/* Input Field for Page Number */}
            {/* <span style={{ color: "white" }}>Go to page:</span> */}
            <input
              // type="number"
              value={currentPage}
              min={1}
              max={totalPages}
              onChange={(e) => {
                const page = Math.max(
                  1,
                  Math.min(totalPages, Number(e.target.value))
                );
                goToPage(page); // Navigate to the entered page number
              }}
              style={{
                width: "60px",
                textAlign: "center",
                borderRadius: "6px",
                border: "2px solid #d4af37",
                backgroundColor: "#18273e",
                color: "white",
              }}
            />
            {/* <span style={{ color: "white" }}>of {totalPages}</span> */}

            {/* Next Page Button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="first-lastbutton"
              style={
                {
                  // backgroundColor: "#18273e",
                  // color: "white",
                  // borderRadius: "6px",
                  // padding: "5px 10px",
                  // border: "2px solid #d4af37",
                }
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicCase;
