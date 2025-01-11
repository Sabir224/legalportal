import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../../Dashboard.css"

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../REDUX/sliece";
import * as XLSX from "xlsx";
import filepath from "../../../utils/dataset.csv"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan, faLongArrowAltRight, faLongArrowLeft, faLongArrowRight } from "@fortawesome/free-solid-svg-icons";


const BasicCase = () => {
    const [caseNumber, setCaseNumber] = useState("");
    const [caseName, setCaseName] = useState("");
    const navigate = useNavigate();
    const [check, setcheck] = useState(true)
    const screen = useSelector((state) => state.screen.value);
    console.log("change screen value", screen)
    const dispatch = useDispatch();


    const [data, setData] = useState([]);
    const [error, setError] = useState("");



    const handleViewDetails = () => {
        console.log("View details for:", caseNumber, caseName);
    };

    const handleClick = async (scr, item) => {
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

    // Function to fetch and parse the Excel file
    const loadExcelFile = async () => {
        try {
            // Fetch the file from a predefined location
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error("Failed to fetch the Excel file");
            }

            // Read the file as a binary blob
            const blob = await response.blob();

            // Use FileReader to convert blob to binary string
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const binaryData = e.target.result;

                    // Parse the binary data using xlsx
                    const workbook = XLSX.read(binaryData, { type: "binary" });

                    // Get the first sheet
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    // Convert the sheet to JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Filter only the required columns
                    const filteredData = jsonData.map((row) => {
                        const filteredRow = {};
                        requiredColumns.forEach((column) => {
                            filteredRow[column] = row[column] || null; // Use null for missing columns
                        });
                        return filteredRow;
                    });

                    // Update state
                    console.log("data is =", filteredData)
                    setData(filteredData);
                } catch (parseError) {
                    setError("Error parsing the Excel file.");
                    console.error(parseError);
                }
            };

            reader.onerror = (err) => {
                setError("Error reading the Excel file.");
                console.error(err);
            };

            reader.readAsBinaryString(blob);
        } catch (err) {
            setError(err.message || "An error occurred while loading the file.");
            console.error(err);
        }
    };

    // Load the file automatically when the component mounts
    useEffect(() => {
        loadExcelFile();
    }, []);











    return (
        // <div className="card" id="maincontent" >
        //     <div className="card-header">
        //         <span className="status">Status</span>
        //         <span className="number">Case Number</span>
        //         <span className="name">Name</span>
        //     </div>

        //     <div className="card-list" style={{ marginBottom: 10, overflowX: "auto" }}>

        //         {getCurrentPageData().map((item, index) => (
        //             <div >
        //                 <div
        //                     key={index}
        //                     className="card-row clickable"
        //                     onClick={() => handleClick(1, item)}
        //                 >
        //                     <span className="status">

        //                         <span style={{}}
        //                             className={`status-dot ${item.Status.toLowerCase() === 'case filed' ? 'active ' : 'inactive'
        //                                 }`}
        //                         ></span>
        //                         {item.Status}
        //                     </span>
        //                     <span className="number">{item["Case Number"]}</span>
        //                     <span className="name">{item["Case Type"]}</span>
        //                 </div>
        //                 <hr style={{ border: '1px solid #dcdcdc', width: '90%', justifySelf: 'center' }} />

        //             </div>
        //         ))}

        //     </div>
        //     <div id="numberbar" style={{ width: "80%", alignSelf: 'center', marginBottom: 10 }}>
        //         <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: 4}}>
        //             <button
        //                 onClick={() => goToPage(1)}
        //                 disabled={currentPage === 1}
        //                 style={{
        //                     backgroundColor: "#18273e",
        //                     color: "white",
        //                     borderRadius: "6px"
        //                 }}
        //             >
        //                 First
        //             </button>
        //             <button
        //                 onClick={() => goToPage(currentPage - 1)}
        //                 disabled={currentPage === 1}
        //                 style={{
        //                     backgroundColor: "#18273e",
        //                     color: "white",
        //                     borderRadius: "6px"
        //                 }}
        //             >
        //                 <FontAwesomeIcon icon={faLessThan} size="1x" color="white" style={{}} />

        //             </button>
        //             {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
        //                 const pageNumber = Math.max(
        //                     1,
        //                     Math.min(currentPage - Math.floor(5 / 2), totalPages - 5 + 1)
        //                 ) + index;

        //                 return (
        //                     <button
        //                         key={pageNumber}
        //                         onClick={() => goToPage(pageNumber)}
        //                         style={{
        //                             fontWeight: currentPage === pageNumber ? "bold" : "normal",
        //                             backgroundColor: currentPage === pageNumber ? "#d4af37" : "#18273e",
        //                             color: currentPage === pageNumber ? "#18273e" : "white",
        //                             borderRadius: "100%"
        //                         }}
        //                     >
        //                         {pageNumber}
        //                     </button>
        //                 );
        //             })}
        //             <button
        //                 onClick={() => goToPage(currentPage + 1)}
        //                 disabled={currentPage === totalPages}
        //                 style={{
        //                     backgroundColor: "#18273e",
        //                     color: "white",
        //                     borderRadius: "6px"
        //                 }}
        //             >
        //                 <FontAwesomeIcon icon={faGreaterThan} size="1x" color="white" style={{}} />
        //             </button>
        //             <button
        //                 onClick={() => goToPage(totalPages)}
        //                 disabled={currentPage === totalPages}
        //                 style={{
        //                     backgroundColor: "#18273e",
        //                     color: "white"
        //                 }}
        //             >
        //                 Last
        //             </button>
        //         </div>
        //     </div>

        // </div>


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
                            <span className="number">{item["Case Number"]}</span>
                            <span className="name">{item["Case Type"]}</span>
                        </div>
                        <hr style={{ border: '1px solid #dcdcdc', width: '90%', justifySelf: 'center' }} />
                    </div>
                ))}

                {/* Sticky Pagination */}
                </div>
                <div
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
            </div>
        </div>

    );
};

export default BasicCase;

