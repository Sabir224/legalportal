import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BasicCase.css"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../REDUX/sliece";
import * as XLSX from "xlsx";
import filepath from "../../../utils/dataset.csv"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan, faLongArrowAltRight, faLongArrowLeft, faLongArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { setParams } from "../../../REDUX/actions";

const BasicCase = () => {
    const [caseNumber, setCaseNumber] = useState("");
    const [caseName, setCaseName] = useState("");
    const navigate = useNavigate();
    const [check, setcheck] = useState(true)
    const screen = useSelector((state) => state.screen.value);
    console.log("change screen value", screen)
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
            const response = await axios.get('http://192.168.18.122:8080/api/getcase'); // API endpoint
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
        global.CaseId=item
         console.log("  global.CaseId ",  item._id)
        dispatch(screenChange(1));

        await setcheck(!check)
        //alert(`Clicked: ${item.name}`);
    };

    const data1 = [
        { status: 'Active', name: 'ABC', number: '1234' },
        { status: 'Inactive', name: 'DEF', number: '5678' },
        { status: 'Pending', name: 'GHI', number: '9101' },
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
    const itemsPerPage = 100 // Number of items per page

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
            LawyerEmail:"Lawyer@gmail.com"
        };

        console.log(requestBody)
        try {
            const response = await fetch('http://localhost:8080/api/case', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            console.error('Error in POST request:', error.message || error);
        };
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


        <div className="card" id="maincontent">
            <div className="card-header">
                <span className="status">Status</span>
                <span className="number">Case Number</span>
                <span className="name">Name</span>
            </div>
            <div className="card-list" style={{ marginBottom: 10, overflowX: "auto", position: "relative" }}>
                {getCurrentPageData().map((item, index) => (
                    <div key={index}>
                        <div
                            className="card-row clickable"
                            onClick={() => handleClick(1, item)}
                        >
                            <span className="status">
                                <span
                                    className={`status-dot ${item.Status.toLowerCase() === 'case filed' ? 'active ' : 'inactive'}`}
                                ></span>
                                {item.Status}
                            </span>
                            <span className="number">{item["CaseNumber"]}</span>
                            <span className="name">{item["Name"]}</span>
                        </div>
                        <hr style={{ border: '1px solid #dcdcdc', width: '90%', justifySelf: 'center' }} />
                    </div>
                ))}


                <div
                    id="numberbar"
                    style={{
                        position: "sticky",
                        bottom: "10px",
                        backgroundColor: "#18273e",
                        zIndex: 10,
                        padding: "10px",
                        alignSelf: 'center',
                        borderRadius: "8px",
                        textAlign: "center",
                        border: "2px solid #d4af37",

                    }}
                >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                        {/* Previous Page Button */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="first-lastbutton"
                            style={{
                                // backgroundColor: "#18273e",
                                // color: "white",
                                // borderRadius: "6px",
                                // padding: "5px 10px",
                                // border: "2px solid #d4af37",
                            }}
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
                                const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
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
                            style={{
                                // backgroundColor: "#18273e",
                                // color: "white",
                                // borderRadius: "6px",
                                // padding: "5px 10px",
                                // border: "2px solid #d4af37",
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Sticky Pagination */}
            </div>
            {/* <div
                id="numberbar"
                style={{
                    // position: "sticky",
                    // bottom: "0",
                    // left: "0",
                    // width: "100%",
                    // backgroundColor: "rgba(24, 39, 62, 0.8)", // Semi-transparent background
                    // zIndex: 10,
                    // padding: "10px",
                    // textAlign: "center",
                    position: "sticky",
                    bottom: "10px",
                    // left: "50%",
                    // transform: "translateX(-20%)",
                    // width: "80%",
                    backgroundColor: "#18273e", // Semi-transparent background
                    zIndex: 10,
                    padding: "10px",
                    borderRadius: "8px",
                    // alignSelf: 'center'
                    // textAlign: "center",
                }}
            >
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="first-lastbutton"

                        style={{
                            backgroundColor: "#18273e",
                            color: "white",
                            borderRadius: "6px",
                        }}
                    >
                        First
                    </button>
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="date-button"
                        style={{
                            backgroundColor: "#18273e",
                            color: "white",
                            borderRadius: "6px",
                        }}
                    >
                        <FontAwesomeIcon icon={faLessThan} size="1x" color="white" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                        const pageNumber = Math.max(
                            1,
                            Math.min(currentPage - Math.floor(5 / 2), totalPages - 5 + 1)
                        ) + index;

                        return (
                            <button
                                key={pageNumber}
                                className="date-button"
                                onClick={() => goToPage(pageNumber)}
                                style={{
                                    fontWeight: currentPage === pageNumber ? "bold" : "normal",
                                    backgroundColor: currentPage === pageNumber ? "#d4af37" : "#18273e",
                                    color: currentPage === pageNumber ? "#18273e" : "white",
                                    borderRadius: "100%",
                                    borderColor: currentPage === pageNumber ? "#18273e" : "#d4af37",
                                }}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="date-button"
                        style={{
                            backgroundColor: "#18273e",
                            color: "white",
                            borderRadius: "6px",
                        }}
                    >
                        <FontAwesomeIcon icon={faGreaterThan} size="1x" color="white" />
                    </button>
                    <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="first-lastbutton"
                        style={{
                            backgroundColor: "#18273e",
                            color: "white",
                            borderRadius: "6px",
                        }}
                    >
                        Last
                    </button>
                </div>
            </div> */}


        </div>

    );
};

export default BasicCase;

