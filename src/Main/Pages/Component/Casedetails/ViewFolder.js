import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Modal,
    Form,
    Row,
    Dropdown,
} from "react-bootstrap";
import { ApiEndPoint } from "../utils/utlis";
import { useSelector } from "react-redux";
import axios from "axios";
import ViewDocumentsAndAdd from "./ViewDocumentsAndAdd";
import { BsDownload, BsPen, BsTrash } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileAlt,
    faFilePdf,
    faFileWord,
    faFileExcel,
    faFilePowerpoint,
    faFileText,
    faImage,
    faMusic,
    faVideo,
    faFileArchive,
    faFileCode,
    faFileCsv,
    faFile,
    faDownload,
    faTrash,
    faUpload,
    faUserCircle,
    faMailBulk,
    faPhone,
    faAddressCard,
    faCheckCircle,
    faSpinner,
    faArrowRight,
    faArrowLeft,
    faFolder,
    faEdit,
} from "@fortawesome/free-solid-svg-icons";
import DragAndDrop from "../DragAndDrop";


const ViewFolder = ({ token }) => {
    const [folderList, setFolderList] = useState([]);
    const caseInfo = useSelector((state) => state.screen.Caseinfo);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFolderId, setEditFolderId] = useState(null);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [hoveredBtn, setHoveredBtn] = useState(null);
    const [loadingFolders, setLoadingFolders] = useState(false);
    const [email, setEmail] = useState("raheemakbar999@gmail.com");
    const [subject, setSubject] = useState("Meeting Confirmation");
    const [clientDetails, setClientDetails] = useState({});
    const [usersDetails, setUsersDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]); // Selected files before upload
    const [showUploadModal, setShowUploadModal] = useState(false); // State to control upload moda
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const storedEmail = sessionStorage.getItem("Email");
    const [viewMode, setViewMode] = useState("grid"); // "grid" ya "list"

    const baseStyle = {
        backgroundColor: "#18273e",
        color: "#fff",
        borderColor: "transparent",
    };

    const hoverStyle = {
        backgroundColor: "#18273e",
        color: "#c0a262",
        borderColor: "transparent",
    };
    const deletehoverStyle = {
        backgroundColor: "#18273e",
        color: "red",
        borderColor: "transparent",
    };


    useEffect(() => {


        // Fetch folders when the component mounts
        if (caseInfo._id) {
            fetchFolders();
        }
    }, [caseInfo._id]);


    const fetchFolders = async () => {
        setLoadingFolders(true);
        setError('');
        try {
            const response = await fetch(`${ApiEndPoint}getFolders/${caseInfo._id}`);

            if (!response.ok) {
                throw new Error('Error fetching folders');
            }

            const data = await response.json();
            setFolderList(Array.isArray(data) ? data : []); // ✅ safe check
        } catch (err) {
            setError(err.message);
            setFolderList([]); // ✅ error hone pe bhi clear
        } finally {
            setLoadingFolders(false);
        }
    };

    const fetchsubFolders = async (parentId) => {
        setLoadingFolders(true);
        setError('');
        try {
            const response = await fetch(`${ApiEndPoint}getSubFolders/${parentId}`);

            if (!response.ok) {
                throw new Error('Error fetching folders');
            }

            const data = await response.json();
            setFolderList(Array.isArray(data) ? data : []); // ✅ safe check
        } catch (err) {
            setError(err.message);
            setFolderList([]); // ✅ error hone pe bhi clear
        } finally {
            setLoadingFolders(false);
        }
    };



    const fileIcons = {
        pdf: faFilePdf, // PDF Files
        doc: faFileWord, // Word Document
        docx: faFileWord, // Word Document
        txt: faFileText, // Plain Text File
        csv: faFileCsv, // CSV File
        xls: faFileExcel, // Excel File
        xlsx: faFileExcel, // Excel File
        ppt: faFilePowerpoint, // PowerPoint File
        pptx: faFilePowerpoint, // PowerPoint File
        odt: faFileAlt, // OpenDocument Text
        ods: faFileExcel, // OpenDocument Spreadsheet
        odp: faFilePowerpoint, // OpenDocument Presentation
        image: faImage, // Images (jpg, png, svg, etc.)
        audio: faMusic, // Audio Files (mp3, wav, etc.)
        video: faVideo, // Video Files (mp4, mkv, avi, etc.)
        zip: faFileArchive, // Zip Files
        rar: faFileArchive, // RAR Files
        tar: faFileArchive, // Tar Files
        gz: faFileArchive, // GZipped Files
        "7z": faFileArchive, // 7z Files
        js: faFileCode, // JavaScript Files
        jsx: faFileCode, // JavaScript Files
        ts: faFileCode, // TypeScript Files
        tsx: faFileCode, // TypeScript Files
        html: faFileCode, // HTML Files
        css: faFileCode, // CSS Files
        json: faFileCode, // JSON Files
        xml: faFileCode, // XML Files
        sql: faFileCode, // SQL Files
        py: faFileCode, // Python Files
        java: faFileCode, // Java Files
        c: faFileCode, // C Language Files
        cpp: faFileCode, // C++ Language Files
        sh: faFileCode, // Shell Script
        other: faFile, // Default File Icon for unknown formats
    };
    const getFileTypeIcon = (fileName) => {
        const extension = fileName?.split(".").pop().toLowerCase(); // Extract extension
        return fileIcons[extension] || fileIcons["other"]; // Use mapped icon or default
    };
    const getFileType = (fileName) => {
        const extension = fileName?.split(".").pop().toLowerCase();
        const allowedExtensions = {
            image: ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "tiff"],
            video: ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"],
            audio: ["mp3", "wav", "aac", "ogg", "flac", "m4a"],
            document: [
                "pdf",
                "doc",
                "docx",
                "xls",
                "xlsx",
                "csv",
                "ppt",
                "pptx",
                "txt",
            ],
            archive: ["zip", "rar", "7z"],
        };

        for (let [type, extensions] of Object.entries(allowedExtensions)) {
            if (extensions.includes(extension)) return type;
        }

        return "other";
    };

    const sizeLimits = {
        image: 20 * 1024 * 1024, // 5MB
        document: 20 * 1024 * 1024, // 16MB
        video: 20 * 1024 * 1024, // 50MB
        audio: 20 * 1024 * 1024, // 10MB
        archive: 20 * 1024 * 1024, // 50MB
    };

    const validateFileSize = (file) => {
        const fileType = getFileType(file.name);
        return (
            fileType !== "other" &&
            file.size <= (sizeLimits[fileType] || 2 * 1024 * 1024)
        );
    };

    const handleCreateFolder = async () => {

        // let caseData = {
        //     "caseId": caseInfo._id,
        //     "folderName": newFolderName,
        // };

        // try {
        //     const response = await axios.post(`${ApiEndPoint}CreateFolder`, caseData);
        //     console.log('Folder Create added successfully:', response.data);
        //     fetchFolders()
        //     // dispatch(screenChange(9)); // Use it if needed
        //     alert("✅ Folder Added Successfully!");
        // } catch (error) {
        //     if (error.response) {
        //         // Handle known API errors (e.g., duplicate folder name)
        //         console.error('API error:', error.response);
        //         if (error.response.status === 409) {
        //             // 409: Conflict - Folder name already exists
        //             alert("❌ Folder with the same name already exists for this case.");
        //         } else {
        //             alert(`❌ Error: ${error.response.data.message || 'Something went wrong'}`);
        //         }
        //     } else {
        //         // Handle network or server errors
        //         console.error('Network or server error:', error.message);
        //         alert("❌ Network or server error. Please try again later.");
        //     }
        // }


        let caseData = {
            caseId: caseInfo._id,             // Unique ID for the case
            folderName: newFolderName,        // Folder name being created
            files: [],                        // Initialize with an empty array, even if there are no files
            subFolders: [],                   // Initialize with an empty array for subfolders
            parentFolderId: selectedFolder ? selectedFolder._id : null,  // Only set if folder is inside another
        };

        try {
            const response = await axios.post(`${ApiEndPoint}CreateFolder`, caseData);

            // Check if the response contains a success message or the created folder
            if (response.data._id) {
                console.log('📂 Folder created successfully:', response.data);
                fetchFolders();  // Refresh the folder list after creation
                alert("✅ Folder Added Successfully!");
            } else {
                console.error('Folder creation failed:', response.data.message);
                alert(`❌ Error: ${response.data.message || 'Something went wrong'}`);
            }
        } catch (error) {
            if (error.response) {
                console.error('API error:', error.response);
                if (error.response.status === 409) {
                    alert("❌ Folder with the same name already exists for this case.");
                } else {
                    alert(`❌ Error: ${error.response.data.message || 'Something went wrong'}`);
                }
            } else {
                console.error('Network or server error:', error.message);
                alert("❌ Network or server error. Please try again later.");
            }
        }

    };


    const handleUpdateFolder = async () => {
        const caseData = {
            folderId: editFolderId,  // The _id (ObjectId) of the folder you want to update
            newFolderName: newFolderName   // The new name you want to assign
        };
        console.log("case data", caseData)
        try {
            const response = await axios.put(`${ApiEndPoint}updateFolderName`, caseData);
            console.log('Folder updated successfully:', response.data);
            fetchFolders()
            alert("✅ Folder name updated successfully!");
        } catch (error) {
            if (error.response) {
                console.error('API error:', error.response);
                alert(`❌ Error: ${error.response.data.message}`);
            } else {
                console.error('Network or server error:', error.message);
                alert("❌ Network or server error. Please try again later.");
            }
        }
    };

    const handleDeleteFolder = async (id) => {
        // const updatedList = folderList.filter(folder => folder?._id !== id);
        // setFolderList(updatedList);

        // if (selectedFolder?._id === id) {
        //     setSelectedFolder(null);
        // }

        try {
            await axios.delete(`${ApiEndPoint}deleteFolder/${id}`);
            fetchFolders()
            setFolderList(folderList.filter((folder) => folder._id !== id)); // Use `_id` instead of `id` if that's your MongoDB field
            if (selectedFolder?._id === id) {
                setSelectedFolder(null);
            }
        } catch (error) {
            console.error("❌ Error deleting folder:", error);
            setError("Error deleting folder");
        }
    };

    const openEditModal = (folder) => {
        setNewFolderName(folder?.folderName);
        setEditFolderId(folder?._id);
        setIsEditMode(true);
        setShowModal(true);
    };
    const [folderPath, setFolderPath] = useState([]);






    const handleFileDelete = async (fileId) => {
        try {
            const response = await axios.delete(`${ApiEndPoint}/deleteFileFromFolder/${fileId}`);

            if (response.status === 200) {
                setFiles((prevFiles) =>
                    prevFiles.filter((file) => file._id !== fileId)
                );
                console.log("File deleted successfully");
            }
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
        subject
    )}&body=${encodeURIComponent("")}`;
    const [activeTab, setActiveTab] = useState("documents");



    const handleDownload = async (fileId, fileName) => {
        try {
            const response = await fetch(`${ApiEndPoint}downloadFileFromFolder/${fileId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}), // No email needed anymore
            });

            console.log("Raw Response:", response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch the file: ${errorText}`);
            }

            const jsonResponse = await response.json();
            console.log("Download Response JSON:", jsonResponse);

            if (jsonResponse.downloadUrl) {
                console.log("Signed URL received:", jsonResponse.downloadUrl);
                window.open(jsonResponse.downloadUrl, "_blank");
                return;
            }

            throw new Error("Signed URL not received in the response");
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const onHide = () => {
        setShowUploadModal(false);
        setSelectedFiles([]);
        setUploading(false);
        setUploadSuccess(false);
        setErrorMessage([]);
    };


    const handleFileUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setUploadSuccess(false);

        const formData = new FormData();
        formData.append("folderId", selectedFolder?._id);
        //formData.append("folderName", selectedFolder?.folderName);
        console.log(" uploading file", selectedFolder)
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await axios.post(`${ApiEndPoint}caseFoldersDocumentUploadFiles`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Files response:", response.data);

            if (response.status === 200) {
                setSelectedFiles([]);
                setUploadSuccess(true);
                setTimeout(() => {
                    setShowUploadModal(false);
                    setUploadSuccess(false);
                }, 1000);
                // Hide modal after 2 seconds
                fetchCases()
                setErrorMessage([]);
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        fetchCases();

    }, [selectedFolder]);

    const fetchCases = async () => {
        console.log("folderdetails___", selectedFolder)
        if (selectedFolder == null) {
            setFiles([])
        }
        try {
            const response = await axios.get(
                `${ApiEndPoint}getFolderById/${selectedFolder?._id}`,
                {
                    withCredentials: true, // ✅ Sends cookies with the request
                }
            ); // API endpoint
            // Assuming the API returns data in the `data` field
            //setCaseData(response.data.caseDetails);
            console.log("Files Data:", response.data?.files);
            await setFiles(response.data?.files);

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }
    const handleFileChange = (input) => {
        setErrorMessage([]);
        let files = Array.isArray(input) ? input : Array.from(input.target.files);

        let validFiles = [];
        let totalFiles = selectedFiles.length; // Track total files

        let invalidSizeFiles = [];
        let invalidTypeFiles = [];
        let invalidLengthFiles = [];

        for (let file of files) {
            if (totalFiles > 10) break; // Stop if we reach the limit

            if (file.name.length > 40) {
                // Truncate file name for display
                let truncatedName =
                    file.name.substring(0, 20) + "..." + file.name.slice(-10);
                invalidLengthFiles.push(truncatedName); // Store truncated name
                continue; // Skip this file
            }

            const fileType = getFileType(file.name);
            if (fileType === "other") {
                invalidTypeFiles.push(file.name); // Store file name if type is not allowed
            } else if (!validateFileSize(file)) {
                invalidSizeFiles.push(
                    `${file.name} (Max ${(
                        (sizeLimits[fileType] || 2 * 1024 * 1024) /
                        (1024 * 1024)
                    ).toFixed(1)}MB)` // Show max limit
                );
            } else {
                validFiles.push(file);
                totalFiles++; // Increment total count
            }
        }

        let fileLimitExceeded = totalFiles > 10;
        if (fileLimitExceeded) {
            setErrorMessage((prevErrors) => [
                ...prevErrors,
                `Maximum 10 files can be uploaded at any time and allow first 5 for upload`,
            ]);
            validFiles = validFiles.slice(0, 10 - selectedFiles.length);
        }

        if (invalidSizeFiles.length > 0) {
            setErrorMessage((prevErrors) => [
                ...prevErrors,
                `The following files exceed the size limit: ${invalidSizeFiles.join(
                    ", "
                )}`,
            ]);
        }

        if (invalidTypeFiles.length > 0) {
            setErrorMessage((prevErrors) => [
                ...prevErrors,
                `The following file extensions are not allowed: ${invalidTypeFiles.join(
                    ", "
                )}`,
            ]);
        }

        if (invalidLengthFiles.length > 0) {
            setErrorMessage((prevErrors) => [
                ...prevErrors,
                `The following files have names longer than 40 characters: ${invalidLengthFiles.join(
                    ", "
                )}`,
            ]);
        }

        setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles].slice(0, 5));

        if (!Array.isArray(input)) input.target.value = "";
    };



    return (

        // <div className="container-fluid ms-1 d-flex flex-column mr-3 ml-3 p-0" style={{ minHeight: "80vh" }}>
        //     <Card className="flex-grow-1 d-flex flex-column">
        //         <Card.Body className="flex-grow-1 d-flex flex-column">
        //             <div className="h-100">
        //                 {/* Header */}
        //                 <Card.Header className="d-flex justify-content-between align-items-center">
        //                     <div className="d-flex align-items-center gap-2">
        //                         {selectedFolder && (
        //                             <Button
        //                                 variant="light"
        //                                 size="sm"
        //                                 onClick={() => setSelectedFolder(null)}
        //                                 style={{ fontSize: "1.2rem", lineHeight: "1", padding: "0 8px" }}
        //                                 title="Back"
        //                             >
        //                                 ←
        //                             </Button>
        //                         )}
        //                         <h5 className="mb-0">
        //                             {selectedFolder ? selectedFolder.folderName : "Folders"}
        //                         </h5>
        //                     </div>
        //                     {!selectedFolder && (
        //                         <Button
        //                             size="sm"
        //                             variant="primary"
        //                             className="d-flex justify-content-center align-items-center m-0"
        //                             style={{ height: "32px", width: "100px", fontSize: "0.85rem" }}
        //                             onClick={() => {
        //                                 setNewFolderName("");
        //                                 setIsEditMode(false);
        //                                 setShowModal(true);
        //                             }}
        //                         >
        //                             + New
        //                         </Button>
        //                     )}
        //                 </Card.Header>

        //                 {/* Body */}
        //                 <Card.Body className="overflow-auto" style={{ maxHeight: "70vh" }}>
        //                     {!selectedFolder ? (
        //                         folderList.map((folder) => {
        //                             const editKey = `edit-${folder._id}`;
        //                             const deleteKey = `delete-${folder._id}`;

        //                             return (
        //                                 <Card
        //                                     key={folder?._id}
        //                                     className={`mb-2 ${selectedFolder?._id === folder?._id ? "border-primary" : ""}`}
        //                                     style={{ cursor: "pointer" }}
        //                                 >
        //                                     <Card.Body className="py-2 px-3">
        //                                         <div
        //                                             onClick={() => setSelectedFolder(folder)}
        //                                             className="d-flex justify-content-between align-items-center"
        //                                         >
        //                                             <div>{folder?.folderName}</div>
        //                                             <div className="d-flex gap-2">
        //                                                 <Button
        //                                                     variant="outline-secondary"
        //                                                     size="sm"
        //                                                     style={hoveredBtn === editKey ? hoverStyle : baseStyle}
        //                                                     onMouseEnter={() => setHoveredBtn(editKey)}
        //                                                     onMouseLeave={() => setHoveredBtn(null)}
        //                                                     onClick={(e) => {
        //                                                         e.stopPropagation();
        //                                                         openEditModal(folder);
        //                                                     }}
        //                                                 >
        //                                                     <BsPen />
        //                                                 </Button>

        //                                                 <Button
        //                                                     variant="outline-danger"
        //                                                     size="sm"
        //                                                     style={hoveredBtn === deleteKey ? deletehoverStyle : baseStyle}
        //                                                     onMouseEnter={() => setHoveredBtn(deleteKey)}
        //                                                     onMouseLeave={() => setHoveredBtn(null)}
        //                                                     onClick={(e) => {
        //                                                         e.stopPropagation();
        //                                                         handleDeleteFolder(folder?._id);
        //                                                     }}
        //                                                 >
        //                                                     <BsTrash />
        //                                                 </Button>
        //                                             </div>
        //                                         </div>
        //                                     </Card.Body>
        //                                 </Card>
        //                             );
        //                         })
        //                     ) : (
        //                         <ViewDocumentsAndAdd caseData={caseInfo} folderdetails={selectedFolder} />
        //                     )}
        //                 </Card.Body>
        //             </div>
        //         </Card.Body>
        //     </Card>

        //     {/* Create/Edit Folder Modal */}
        //     <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        //         <Modal.Header closeButton>
        //             <Modal.Title>{isEditMode ? "Edit Folder" : "Create New Folder"}</Modal.Title>
        //         </Modal.Header>
        //         <Modal.Body>
        //             <Form>
        //                 <Form.Group className="mb-3">
        //                     <Form.Label>Folder Name</Form.Label>
        //                     <Form.Control
        //                         type="text"
        //                         placeholder="Enter folder name"
        //                         value={newFolderName}
        //                         onChange={(e) => setNewFolderName(e.target.value)}
        //                     />
        //                 </Form.Group>
        //             </Form>
        //         </Modal.Body>
        //         <Modal.Footer className="d-flex justify-content-end">
        //             <Button variant="primary" onClick={() => setShowModal(false)}>
        //                 Cancel
        //             </Button>
        //             <Button
        //                 variant="primary"
        //                 onClick={isEditMode ? handleUpdateFolder : handleCreateFolder}
        //             >
        //                 {isEditMode ? "Update" : "Create"}
        //             </Button>
        //         </Modal.Footer>
        //     </Modal>
        // </div>



        <div className="container-fluid ms-1 d-flex flex-column mr-3 ml-3 p-0" style={{ minHeight: "80vh" }}>
            <Card className="flex-grow-1 d-flex flex-column">
                <Card.Body className="flex-grow-1 d-flex flex-column">
                    <div className="h-100">
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                {/* Breadcrumb navigation */}
                                <div className="d-flex align-items-center">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={async () => {
                                            await fetchCases()
                                            setSelectedFolder(null);
                                            setFolderPath([]);
                                            fetchFolders()
                                        }}
                                        style={{ fontSize: "1.2rem", lineHeight: "1", padding: "0 8px" }}
                                        title="Back to root"
                                    >
                                        📁
                                    </Button>
                                    {folderPath.length > 0 && (
                                        <>
                                            <span className="mx-1">/</span>
                                            {/* {folderPath.map((folder, index) => (
                                                <React.Fragment key={folder._id}>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0"
                                                        onClick={() => {
                                                            const newPath = folderPath.slice(0, index + 1);
                                                            setFolderPath(newPath);
                                                            setSelectedFolder(folder);
                                                        }}
                                                    >
                                                        {folder.folderName}
                                                    </Button>
                                                    {index < folderPath.length - 1 && <span className="mx-1">/</span>}
                                                </React.Fragment>
                                            ))} */}
                                            {folderPath.map((folder, index) => (
                                                <React.Fragment key={folder._id}>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="p-0"
                                                        onClick={() => {
                                                            const newPath = folderPath.slice(0, index + 1);
                                                            setFolderPath(newPath);
                                                            setSelectedFolder(folder);

                                                            // ✅ Yahan check karte hain: agar index exist karta hai (0 ya usse aage)
                                                            if (index >= 0) {
                                                                fetchsubFolders(folder._id); // folder ka id pass kar rahe hain
                                                            }
                                                        }}
                                                    >
                                                        {folder.folderName}
                                                    </Button>
                                                    {index < folderPath.length - 1 && <span className="mx-1">/</span>}
                                                </React.Fragment>
                                            ))}


                                        </>
                                    )}
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="primary"
                                className="d-flex justify-content-center align-items-center m-0"
                                style={{ height: "32px", width: "100px", fontSize: "0.85rem" }}
                                onClick={() => {
                                    setNewFolderName("");
                                    setIsEditMode(false);
                                    setShowModal(true);
                                }}
                            >
                                + New
                            </Button>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" size="sm"
                                    className="d-flex justify-content-center align-items-center m-0"
                                    style={{ height: "32px", width: "100px", fontSize: "0.85rem" }}
                                >
                                    View
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setViewMode("grid")}>Grid View</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setViewMode("list")}>List View</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                        </Card.Header>

                        <Card.Body className="overflow-auto" style={{ maxHeight: "80vh" }}>
                            <Row
                                className="g-3"
                                style={{
                                    flexDirection: viewMode === "list" ? "column" : "row",
                                    height: "100%",
                                    overflow: "auto",
                                }}
                            >
                                {/* Folders */}
                                {folderList.map((folder) => {
                                    const editKey = `edit-${folder._id}`;
                                    const deleteKey = `delete-${folder._id}`;

                                    return (
                                        <Col key={folder._id} sm={viewMode === "grid" ? 6 : 12} md={viewMode === "grid" ? 4 : 12} lg={viewMode === "grid" ? 3 : 12}>
                                            <Card
                                                className="p-2"
                                                style={{
                                                    background: "#18273e",
                                                    border: "1px solid white",
                                                    display: "flex",
                                                    flexDirection: viewMode === "list" ? "row" : "column",
                                                    alignItems: viewMode === "list" ? "center" : "flex-start",
                                                    cursor: "pointer",
                                                    transition: "transform 0.2s, box-shadow 0.2s",
                                                }}
                                                onClick={() => {
                                                    fetchsubFolders(folder._id);
                                                    setSelectedFolder(folder);
                                                    setFolderPath((prevPath) => [...prevPath, folder]);
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (viewMode === "grid") {
                                                        e.currentTarget.style.transform = "scale(1.05)";
                                                        e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.8)";
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (viewMode === "grid") {
                                                        e.currentTarget.style.transform = "scale(1)";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faFolder}
                                                    size="2x"
                                                    className="mb-2"
                                                    style={{ color: "#d3b386", marginRight: viewMode === "list" ? "10px" : "0" }}
                                                />
                                                <Card.Body className="p-1 d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
                                                    <div
                                                        className="text-truncate"
                                                        style={{ fontSize: "0.9rem", color: 'white', maxWidth: "70%" }}
                                                    >
                                                        {folder.folderName}
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            style={{ background: "#28a745", border: "none", padding: "0.25rem 0.5rem" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(folder);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            style={{ background: "#dc3545", border: "none", padding: "0.25rem 0.5rem" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteFolder(folder._id);
                                                            }}
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}

                                {/* Files */}
                                {files?.map((file, index) => (
                                    <Col key={index} sm={viewMode === "grid" ? 6 : 12} md={viewMode === "grid" ? 4 : 12} lg={viewMode === "grid" ? 3 : 12}>
                                        <Card
                                            className="p-2"
                                            style={{
                                                background: "#18273e",
                                                border: "1px solid white",
                                                display: "flex",
                                                flexDirection: viewMode === "list" ? "row" : "column",
                                                alignItems: viewMode === "list" ? "center" : "flex-start",
                                                transition: "transform 0.2s, box-shadow 0.2s",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (viewMode === "grid") {
                                                    e.currentTarget.style.transform = "scale(1.05)";
                                                    e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.8)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (viewMode === "grid") {
                                                    e.currentTarget.style.transform = "scale(1)";
                                                    e.currentTarget.style.boxShadow = "none";
                                                }
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={getFileTypeIcon(file.fileName)}
                                                size="2x"
                                                className="mb-2"
                                                style={{ color: "#d3b386", marginRight: viewMode === "list" ? "10px" : "0" }}
                                            />
                                            <Card.Body className="p-1 d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
                                                <div
                                                    className="text-truncate"
                                                    style={{ fontSize: "0.9rem", color: 'white', maxWidth: "70%" }}
                                                >
                                                    {file.fileName}
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        onClick={() => handleDownload(file._id, file.fileName)}
                                                        style={{ background: "#28a745", border: "none", padding: "0.25rem 0.5rem" }}
                                                    >
                                                        <FontAwesomeIcon icon={faDownload} />
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleFileDelete(file._id)}
                                                        style={{ background: "#dc3545", border: "none", padding: "0.25rem 0.5rem" }}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </div>

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>

                    </div>
                </Card.Body>
            </Card>

            <Button
                variant="primary"
                className="border border-rounded"
                onClick={() => setShowUploadModal(true)}
                style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#d3b386",
                    color: "white",
                }}
            >
                <FontAwesomeIcon icon={faUpload} size="lg" />
            </Button>
            {/* Create/Edit Folder Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? "Edit Folder" : "Create New Folder"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter folder name"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={isEditMode ? handleUpdateFolder : handleCreateFolder}
                    >
                        {isEditMode ? "Update" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>


    );


};

export default ViewFolder;
