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
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Modal,
    Row,
    Spinner,
    Tab,
    Tabs,
} from "react-bootstrap";
import "../../../../style/userProfile.css";
import axios from "axios";
import { FaCalendar } from "react-icons/fa";
import DragAndDrop from "../DragAndDrop";
import { ApiEndPoint } from "../utils/utlis";

const ViewDocumentsAndAdd = ({ caseData, folderdetails }) => {
    const [email, setEmail] = useState("raheemakbar999@gmail.com");
    const [subject, setSubject] = useState("Meeting Confirmation");
    const [clientDetails, setClientDetails] = useState({});
    const [usersDetails, setUsersDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]); // Uploaded files state
    const [selectedFiles, setSelectedFiles] = useState([]); // Selected files before upload
    const [showUploadModal, setShowUploadModal] = useState(false); // State to control upload moda
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const storedEmail = sessionStorage.getItem("Email");
    // Function to categorize files
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("grid"); // ya "list"



    const [currentFolder, setCurrentFolder] = useState(folderdetails);
    const [folderHistory, setFolderHistory] = useState([]);

    const handleOpenFolder = (subfolder) => {
        setFolderHistory((prev) => [...prev, currentFolder]);
        setCurrentFolder(subfolder);
    };

    // const handleGoBack = () => {
    //     if (folderHistory.length > 0) {
    //         const previousFolder = folderHistory[folderHistory.length - 1];
    //         setCurrentFolder(previousFolder);
    //         setFolderHistory((prev) => prev.slice(0, prev.length - 1));
    //     }
    // };

    const getBreadcrumbPath = () => {
        const path = [...folderHistory, currentFolder].filter(Boolean);
        return path.map(folder => folder.folderName).join(" > ");
    };


    const handleGoBack = () => {
        const newHistory = [...folderHistory];
        const previousFolder = newHistory.pop();
        setFolderHistory(newHistory);
        setCurrentFolder(previousFolder || null);
    };


    useEffect(() => {
        fetchCases();

    }, [folderdetails]);
    const onHide = () => {
        setShowUploadModal(false);
        setSelectedFiles([]);
        setUploading(false);
        setUploadSuccess(false);
        setErrorMessage([]);
    };
    const getFilesByCategory = (category, files) => {
        return files?.filter((file) => {
            const fileType = getFileType(file.fileName);
            if (category === "media") {
                return (
                    fileType === "image" || fileType === "video" || fileType === "audio"
                );
            }
            if (category === "documents") {
                return (
                    fileType !== "image" && fileType !== "video" && fileType !== "audio"
                );
            }
            return false;
        });
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

    const fetchCases = async () => {
        console.log("folderdetails", folderdetails)
        try {
            const response = await axios.get(
                `${ApiEndPoint}getFolderById/${folderdetails?._id}`,
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
    // Function to handle file upload
    const handleFileUpload = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        setUploadSuccess(false);

        const formData = new FormData();
        formData.append("CaseId", caseData?._id);
        formData.append("folderName", folderdetails?.folderName);

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
                }, 1000); // Hide modal after 2 seconds
                fetchCases()
                setErrorMessage([]);
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setUploading(false);
        }
    };
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


    return (

        <Row className="d-flex justify-content-center m-3 p-0 gap-5">

            <Col
                // sm={12}
                // md={6}
                className="card border rounded p-3 mb-3"
                style={{
                    background: "#001f3f",
                    width: "70%",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                }}
            >
                <h4 className="text-white mb-4" style={{ fontWeight: "600" }}>
                    File and Docs
                </h4>

                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-3"
                    variant="primary"
                    style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                    }}
                >
                    <Tab
                        eventKey="documents"
                        title={
                            <span
                                style={{
                                    background:
                                        activeTab === "documents" ? "#d3b386" : "transparent",
                                    padding: "8px 8px",
                                    borderRadius: "5px",
                                    color: "white",
                                }}
                            >
                                Documents 📄
                            </span>
                        }
                    >
                        <Row
                            className="g-3"
                            style={{
                                height: "41vh",
                                overflow: "auto",
                            }}
                        >
                            {getFilesByCategory("documents", files)?.map((file, index) => (
                                <Col key={index} sm={6} md={4} lg={3}>
                                    <Card
                                        className="text-white bg-dark p-2"
                                        style={{
                                            background: "white",
                                            border: "1px solid white",
                                            transition: "transform 0.2s, box-shadow 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.05)";
                                            e.currentTarget.style.boxShadow =
                                                "0px 4px 10px rgba(0, 0, 0, 0.8)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={getFileTypeIcon(file.fileName)} // Default icon if not found
                                            size="2x"
                                            className="mb-2"
                                            style={{ color: "#d3b386" }}
                                        />
                                        <Card.Body className="p-1">
                                            <Card.Text
                                                className="text-truncate"
                                                style={{ fontSize: "0.9rem" }}
                                            >
                                                {file.fileName}
                                                {file._id}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDownload(file._id, file.fileName)
                                                    }
                                                    style={{ background: "#28a745", border: "none" }}
                                                >
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleFileDelete(file._id)}
                                                    style={{ background: "#dc3545", border: "none" }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Tab>

                    <Tab
                        eventKey="media"
                        title={
                            <span
                                style={{
                                    background:
                                        activeTab === "media" ? "#d3b386" : "transparent",
                                    padding: "8px 8px",
                                    borderRadius: "5px",
                                    color: "white",
                                }}
                            >
                                Media Files 🎬
                            </span>
                        }
                    >
                        <Row
                            className="g-3"
                            style={{
                                height: "41vh",
                                overflow: "auto",
                            }}
                        >
                            {getFilesByCategory("media", files)?.map((file, index) => (
                                <Col key={index} sm={6} md={4} lg={3}>
                                    <Card
                                        className="text-white bg-dark p-2"
                                        style={{
                                            background: "white",
                                            border: "1px solid white",
                                            transition: "transform 0.2s, box-shadow 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "scale(1.05)";
                                            e.currentTarget.style.boxShadow =
                                                "0px 4px 10px rgba(0, 0, 0, 0.8)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "scale(1)";
                                            e.currentTarget.style.boxShadow = "none";
                                        }}
                                    >
                                        {/* File Preview for Images */}
                                        <FontAwesomeIcon
                                            icon={getFileTypeIcon(file.fileName)} // Default icon if not found
                                            size="2x"
                                            className="mb-2"
                                            style={{ color: "#d3b386" }}
                                        />

                                        <Card.Body className="p-1">
                                            <Card.Text
                                                className="text-truncate"
                                                style={{ fontSize: "0.9rem" }}
                                            >
                                                {file.fileName}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDownload(file._id, file.fileName)
                                                    }
                                                    style={{ background: "#28a745", border: "none" }}
                                                >
                                                    <FontAwesomeIcon icon={faDownload} />
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleFileDelete(file._id)}
                                                    style={{ background: "#dc3545", border: "none" }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Tab>
                </Tabs>
                {/* Floating Upload Icon */}
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "30px",
                        zIndex: 1000,
                    }}
                >
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
                </div>
            </Col>
            <DragAndDrop
                showModal={showUploadModal}
                onHide={onHide}
                handleFileChange={handleFileChange}
                uploading={uploading}
                uploadSuccess={uploadSuccess}
                selectedFiles={selectedFiles}
                handleFileUpload={handleFileUpload}
                errorMessage={errorMessage}
            />
        </Row>

        // <Row className="d-flex justify-content-center m-3 p-0 gap-5">
        //     <Col md={12}>
        //         <div className="d-flex justify-content-between align-items-center mb-3">
        //             {folderHistory.length > 0 && (
        //                 <Button variant="secondary" onClick={handleGoBack}>
        //                     <FontAwesomeIcon icon={faArrowLeft} /> Back
        //                 </Button>
        //             )}
        //             <h4>{getBreadcrumbPath()}</h4> {/* ← Header mein full path */}
        //         </div>

        //         {/* Toggle buttons */}
        //         <div className="mb-3 d-flex gap-2">
        //             <Button variant={viewMode === "grid" ? "primary" : "secondary"} onClick={() => setViewMode("grid")}>
        //                 Grid View
        //             </Button>
        //             <Button variant={viewMode === "list" ? "primary" : "secondary"} onClick={() => setViewMode("list")}>
        //                 List View
        //             </Button>
        //         </div>

        //         {/* Folder Display */}
        //         {viewMode === "grid" ? (
        //             <Row className="g-3 mb-4">
        //                 {currentFolder?.subFolders?.length > 0 ? (
        //                     currentFolder.subFolders.map((subfolder) => (
        //                         <Col md={3} key={subfolder._id}>
        //                             <Card className="p-3 text-center" onClick={() => handleOpenFolder(subfolder)} style={{ cursor: 'pointer' }}>
        //                                 <FontAwesomeIcon icon={faFolder} size="3x" className="mb-2" />
        //                                 <div>{subfolder.folderName}</div>
        //                             </Card>
        //                         </Col>
        //                     ))
        //                 ) : (
        //                     <div>No Subfolders</div>
        //                 )}
        //             </Row>
        //         ) : (
        //             <div className="list-group mb-4">
        //                 {currentFolder?.subFolders?.length > 0 ? (
        //                     currentFolder.subFolders.map((subfolder) => (
        //                         <div key={subfolder._id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => handleOpenFolder(subfolder)} style={{ cursor: 'pointer' }}>
        //                             <div className="d-flex align-items-center gap-2">
        //                                 <FontAwesomeIcon icon={faFolder} size="lg" />
        //                                 <span>{subfolder.folderName}</span>
        //                             </div>
        //                             <FontAwesomeIcon icon={faArrowRight} />
        //                         </div>
        //                     ))
        //                 ) : (
        //                     <div>No Subfolders</div>
        //                 )}
        //             </div>
        //         )}

        //         {/* Files */}
        //         <Tabs
        //             id="files-tabs"
        //             activeKey={activeTab}
        //             onSelect={(k) => setActiveTab(k)}
        //             className="mb-3"
        //         >
        //             <Tab eventKey="documents" title="Documents">
        //                 <Row className="g-3">
        //                     {getFilesByCategory("documents", currentFolder.files).map((file) => (
        //                         <Col md={4} key={file._id}>
        //                             <Card className="p-3 text-center">
        //                                 <FontAwesomeIcon
        //                                     icon={getFileTypeIcon(file.fileName)}
        //                                     size="3x"
        //                                     className="mb-2"
        //                                 />
        //                                 <div>{file.fileName}</div>
        //                                 <div className="d-flex justify-content-center gap-2 mt-2">
        //                                     <Button variant="primary" size="sm" onClick={() => handleDownload(file._id, file.fileName)}>
        //                                         <FontAwesomeIcon icon={faDownload} /> Download
        //                                     </Button>
        //                                     <Button variant="danger" size="sm" onClick={() => handleFileDelete(file._id)}>
        //                                         <FontAwesomeIcon icon={faTrash} /> Delete
        //                                     </Button>
        //                                 </div>
        //                             </Card>
        //                         </Col>
        //                     ))}
        //                 </Row>
        //             </Tab>

        //             <Tab eventKey="media" title="Media">
        //                 <Row className="g-3">
        //                     {getFilesByCategory("media", currentFolder.files).map((file) => (
        //                         <Col md={4} key={file._id}>
        //                             <Card className="p-3 text-center">
        //                                 <FontAwesomeIcon
        //                                     icon={getFileTypeIcon(file.fileName)}
        //                                     size="3x"
        //                                     className="mb-2"
        //                                 />
        //                                 <div>{file.fileName}</div>
        //                                 <div className="d-flex justify-content-center gap-2 mt-2">
        //                                     <Button variant="primary" size="sm" onClick={() => handleDownload(file._id, file.fileName)}>
        //                                         <FontAwesomeIcon icon={faDownload} /> Download
        //                                     </Button>
        //                                     <Button variant="danger" size="sm" onClick={() => handleFileDelete(file._id)}>
        //                                         <FontAwesomeIcon icon={faTrash} /> Delete
        //                                     </Button>
        //                                 </div>
        //                             </Card>
        //                         </Col>
        //                     ))}
        //                 </Row>
        //             </Tab>
        //         </Tabs>
        //     </Col>
        // </Row>



    );
};
export default ViewDocumentsAndAdd;
