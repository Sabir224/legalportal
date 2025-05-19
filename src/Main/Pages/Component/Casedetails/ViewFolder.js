
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Form, Row, Dropdown } from "react-bootstrap";
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
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import DragAndDrop from "../DragAndDrop";
import MoveFolderModal from "./MoveFolderModal";
import movefolder from "./Icons/movefolder.png";
import ErrorModal from "../../AlertModels/ErrorModal";

const ViewFolder = ({ token }) => {
  const [folderList, setFolderList] = useState([]);
  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const FormCDetails = useSelector((state) => state.screen.FormCDetails);

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [Isdelete, setIsdelete] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFileId, setEditFileId] = useState(null);
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
  const [viewMode, setViewMode] = useState("grid");
  const [moveFileId, setMoveFileId] = useState(null);
  const [MainfolderId, setMainfolderId] = useState(null);
  const [Mainfolder, setMainfolder] = useState(null);
  const [IsPersonal, setIsPersonal] = useState(null);
  const [deletefileid, setDeletefileId] = useState(null);
  const [deletefolderid, setDeletefolderId] = useState(null);
  const [Isfolderdelete, setIsfolderdelete] = useState(false);
  const [sortOption, setSortOption] = useState("nameAsc");

  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");

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

  const [pendingCaseData, setPendingCaseData] = useState(null);
  const [effectiveCaseInfo, setEffectiveCaseInfo] = useState(null);
  const [isUsingPendingCase, setIsUsingPendingCase] = useState(false);

  // Initialize case data - checks localStorage first
  useEffect(() => {
    const initializeCaseData = () => {
      // First check if we have caseInfo from Redux
      if (caseInfo?._id) {
        setEffectiveCaseInfo(caseInfo);
        return;
      }

      // If no caseInfo, check for pending case data in localStorage
      const pendingCaseId = localStorage.getItem("pendingCaseId");
      const pendingUserId = localStorage.getItem("pendingUserId");

      if (pendingCaseId && pendingUserId) {
        setPendingCaseData({
          caseId: pendingCaseId,
          userId: pendingUserId,
        });
        setEffectiveCaseInfo({
          _id: pendingCaseId,
          ClientId: pendingUserId,
        });
      }
    };

    initializeCaseData();
  }, [caseInfo]);

  // Fetch folders when effectiveCaseInfo changes

  //   useEffect(() => {
  //     // Fetch folders when the component mounts
  //     if (caseInfo?._id) {
  //       fetchFolders();
  //     }
  //   }, [caseInfo?._id]);

  const fetchFolders = async () => {
    setLoadingFolders(true);
    setError("");

    try {
      const caseIdToUse = effectiveCaseInfo?._id;
      if (!caseIdToUse) throw new Error("No case ID available");

      const response = await fetch(`${ApiEndPoint}getFolders/${caseIdToUse}`);
      if (!response.ok) throw new Error("Error fetching folders");

      const data = await response.json();

      // Process main folders
      const fetchedFolders = Array.isArray(data?.folders) ? data.folders : [];

      let customFolder;
      if (!FormCDetails) {
        customFolder = {
          _id: "personal-folder",
          folderName: "Personal",
          caseId: caseIdToUse,
          files: [],
          parentId: data?.mainfolder?._id || null,
          isPersonal: true,
        };
      } else {
        customFolder = {
          _id: "formc-folder",
          folderName: "FormC Documents",
          caseId: caseIdToUse,
          files: [],
          parentId: data?.mainfolder?._id || null,
          isFormCDoc: true,
        };
      }

      const finalFolders = [customFolder, ...fetchedFolders];
      setFolderList(finalFolders);
      setMainfolderId(data?.mainfolder?._id);
      setMainfolder(data?.mainfolder);
      setFolderPath([]);
      setFiles(data?.files || []);

      // Clear localStorage if we used pending data and now have caseInfo
      //   if (pendingCaseData.caseId && caseInfo?._id) {
      //     localStorage.removeItem("pendingCaseId");
      //     localStorage.removeItem("pendingUserId");
      //     setPendingCaseData({ caseId: null, userId: null });
      //   }
    } catch (err) {
      setError(err.message);
      let fallbackFolder;
      if (!FormCDetails) {
        fallbackFolder = {
          _id: "personal-folder",
          folderName: "Personal",
          files: [],
          isPersonal: true,
        };
      } else {
        fallbackFolder = {
          _id: "formc-folder",
          folderName: "FormC Documents",
          files: [],
          isFormCDoc: true,
        };
      }

      setFolderList([fallbackFolder]);
    } finally {
      setLoadingFolders(false);
    }
  };
  useEffect(() => {
    // if (effectiveCaseInfo?._id) {
    fetchFolders();
    // }
  }, [effectiveCaseInfo?._id]);

  // Subfolder fetch function
  const fetchsubFolders = async (parentId) => {
    setLoadingFolders(true);
    setError("");
    try {
      const response = await fetch(`${ApiEndPoint}getSubFolders/${parentId}`);
      if (!response.ok) throw new Error("Error fetching subfolders");

      const data = await response.json();
      setFolderList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setFolderList([]);
    } finally {
      setLoadingFolders(false);
    }


  }
  const fetchFormCfile = async () => {
    setLoadingFolders(true);
    setError("");
    try {
      const response = await fetch(`${ApiEndPoint}getFormCDetailsByEmail/${FormCDetails}`);
      if (!response.ok) throw new Error("Error fetching subfolders");

      const data = await response.json();
      setFolderList(Array.isArray(data) ? data : []);
      console.log("...", data.files)
      setFiles(data.files);
    } catch (err) {
      setError(err.message);
      setFolderList([]);
    } finally {
      setLoadingFolders(false);
    }

  }

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
    let caseData = {
      caseId: effectiveCaseInfo?._id, // Unique ID for the case
      folderName: newFolderName, // Folder name being created
      files: [], // Initialize with an empty array, even if there are no files
      subFolders: [], // Initialize with an empty array for subfolders
      parentFolderId: selectedFolder?._id, // Only set if folder is inside another
    };

    try {
      const response = await axios.post(`${ApiEndPoint}CreateFolder`, caseData);

      // Check if the response contains a success message or the created folder
      if (response.data._id) {
        console.log("📂 Folder created successfully:", response.data);
        await fetchFolders();
        //await fetchsubFolders(response.data?.parentId);  // Refresh the folder list after creation
        // alert("✅ Folder Added Successfully!");
        setShowModal(false);
      } else {
        console.error("Folder creation failed:", response.data.message);
        setShowError(true);
        setShowModal(false);

        setMessage(response.data.message);
        // alert(`❌ Error: ${response.data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response);
        if (error.response.status === 409) {
          setShowError(true);
          setShowModal(false);

          setMessage(
            "❌ Folder with the same name already exists for this case."
          );
          //  alert("❌ Folder with the same name already exists for this case.");
        } else {
          setShowError(true);
          setShowModal(false);

          setMessage(
            `❌ Error: ${error.response.data.message || "Something went wrong"}`
          );
        }
      } else {
        console.error("Network or server error:", error.message);
        setShowError(true);
        setShowModal(false);
        setMessage("❌ Network or server error. Please try again later.");
        // alert("❌ Network or server error. Please try again later.");
      }
    }
  };

  const handleUpdateFolder = async () => {
    const caseData = {
      folderId: editFolderId, // The _id (ObjectId) of the folder you want to update
      newFolderName: newFolderName, // The new name you want to assign
    };
    console.log("case data", caseData);
    try {
      const response = await axios.put(
        `${ApiEndPoint}updateFolderName`,
        caseData
      );
      console.log("Folder updated successfully:", response.data.data.parentId);
      fetchsubFolders(response.data?.data?.parentId);
      // alert("✅ Folder name updated successfully!");
      setShowModal(false);
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response);
        setShowError(true);
        setShowModal(false);

        setMessage(`❌ Error: ${error.response.data.message}`);
        //  alert(`❌ Error: ${error.response.data.message}`);
      } else {
        console.error("Network or server error:", error.message);
        setShowError(true);
        setShowModal(false);

        setMessage(`❌ Network or server error. Please try again later.`);
        //   alert("❌ Network or server error. Please try again later.");
      }
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await axios.delete(`${ApiEndPoint}deleteFolder/${id}`);
      // fetchFolders()
      setFolderList(folderList.filter((folder) => folder._id !== id));
      setIsfolderdelete(false); // Use `_id` instead of `id` if that's your MongoDB field
      setDeletefolderId(null);
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
  const openFileEditModal = (filedetails) => {
    setNewFileName(filedetails?.folderName);
    setEditFileId(filedetails?._id);
    setIsEditMode(true);
    setShowFileModal(true);
  };
  const [folderPath, setFolderPath] = useState([]);

  const handleFileDelete = async (fileId) => {
    try {
      const response = await axios.delete(
        `${ApiEndPoint}/deleteFileFromFolder/${fileId}`
      );

      if (response.status === 200) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file._id !== fileId)
        );
        console.log("File deleted successfully");
        setIsdelete(false);
        setDeletefileId(null);
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
    if (IsPersonal) {
      console.log("Download Response JSON:", fileId);

      try {
        const response = await fetch(`${ApiEndPoint}download/${fileId}`, {
          method: "POST", // Changed to POST to send body
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Sending email in request body
        });

        // Log the raw response before processing
        console.log("Raw Response:", response);

        if (!response.ok) {
          const errorText = await response.text(); // Get the error response if available
          throw new Error(`Failed to fetch the file: ${errorText}`);
        }

        // Log the JSON response before downloading (if applicable)
        const jsonResponse = await response.json();
        console.log("Download Response JSON:", jsonResponse);

        // Check if the response contains a signed URL instead of a file blob
        if (jsonResponse.downloadUrl) {
          console.log("Signed URL received:", jsonResponse.downloadUrl);
          window.open(jsonResponse.downloadUrl, "_blank");
          return;
        }

        // Validate content type
        const contentType = response.headers.get("Content-Type");
        console.log("Content-Type:", contentType);
        if (
          !contentType ||
          (!contentType.startsWith("application/") &&
            contentType !== "application/octet-stream")
        ) {
          throw new Error("Invalid content type: " + contentType);
        }

        // Process the file blob
        const blob = await response.blob();
        console.log("Blob Data:", blob);

        // Create a URL and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || "downloaded_file"; // Default filename if none is provided
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Cleanup
        setTimeout(() => window.URL.revokeObjectURL(url), 100);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    } else {
      try {
        const response = await fetch(
          `${ApiEndPoint}downloadFileFromFolder/${fileId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}), // No email needed anymore
          }
        );

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
    formData.append("caseId", effectiveCaseInfo?._id);
    //formData.append("folderName", selectedFolder?.folderName);
    console.log(" uploading file", selectedFolder);
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        `${ApiEndPoint}caseFoldersDocumentUploadFiles`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Files response:", response.data);

      if (response.status === 200) {
        setSelectedFiles([]);
        setUploadSuccess(true);
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadSuccess(false);
        }, 1000);
        // Hide modal after 2 seconds
        if (selectedFolder) fetchCases();
        else {
          fetchFolders();
        }
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
    console.log("folderdetails___", selectedFolder);
    if (selectedFolder == null) {
      setFiles([]);
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
      // console.log("folders Data:", response.data);
      await setFiles(response.data?.files);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
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

  const [showMoveModal, setShowMoveModal] = useState(false);
  const [folderToMove, setFolderToMove] = useState(null);

  const openMoveModal = (folder) => {
    setFolderToMove(folder);
    setShowMoveModal(true);
  };

  const closeMoveModal = () => {
    setFolderToMove(null);
    setShowMoveModal(false);
  };

  const handleMoveFolder = async (movefolder, moveintofolder) => {
    let caseData = {
      folderId: movefolder?._id, // Unique ID for the case
      newParentFolderId: moveintofolder ? moveintofolder?._id : MainfolderId, // Folder name being created
    };

    console.log("folder move data", moveintofolder);

    try {
      const response = await axios.post(
        `${ApiEndPoint}moveFolderOneToAnotherFolder`,
        caseData
      );

      // Check if the response contains a success message or the created folder
      if (response.data._id) {
        console.log("📂 Folder Move successfully:", response.data);
        fetchFolders(); // Refresh the folder list after creation
        // alert("✅ Folder Move Successfully!");
      } else {
        console.error("Folder Move failed:", response.data.message);
        setShowError(true);
        setMessage(
          `❌ Error: ${response.data.message || "Something went wrong"}`
        );
        //alert(`❌ Error: ${response.data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response);
        if (error.response.status === 409) {
          setShowError(true);
          setMessage(
            "❌ Folder with the same name already exists for this case."
          );
        } else {
          setShowError(true);
          setMessage(
            `❌ Error: ${error.response.data.message || "Something went wrong"}`
          );
        }
      } else {
        console.error("Network or server error:", error.message);
        setShowError(true);
        setMessage("❌ Network or server error. Please try again later.");
      }
    }
  };

  const handlefileMove = async (movefolder, moveintofolder) => {
    let caseData = {
      fileId: moveFileId,
      sourceFolderId: movefolder?._id,
      destinationFolderId: !moveintofolder ? MainfolderId : moveintofolder,
    };
    console.log("file move data", caseData);

    try {
      const response = await axios.post(
        `${ApiEndPoint}moveFileToAnotherFolder`,
        caseData
      );

      console.log("Move file API response:", response.data);

      if (response.data.success || response.status === 200) {
        console.log("📂 File moved successfully");
        fetchFolders(); // Refresh the folders
        setSelectedFolder(null);
        setFolderPath([]);
        setMoveFileId(null);
        // alert("✅ File moved successfully!");
      } else {
        console.error("File move failed:", response.data.message);
        setShowError(true);
        setMessage(
          `❌ Error: ${response.data.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response);
        setShowError(true);
        setMessage(
          `❌ Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else {
        console.error("Network/server error:", error.message);
        setShowError(true);
        setMessage("❌ Network or server error. Please try again later.");
      }
    }
  };

  const handleUpdateFileName = async (movefolder, moveintofolder) => {
    let caseData = {
      fileId: editFileId,
      newFileName: newFileName,
    };
    console.log("file Editing data", caseData);

    try {
      const response = await axios.post(
        `${ApiEndPoint}updateFileName`,
        caseData
      );

      console.log("Editing file API response:", response.data);

      if (response.data.success || response.status === 200) {
        console.log("📂 File Editing successfully", selectedFolder);
        //fetchFolders();  // Refresh the folders
        if (selectedFolder !== null) {
          await fetchCases();
        } else {
          await fetchFolders();
        }

        // alert("✅ File Editing successfully!");
        setShowFileModal(false);
      } else {
        console.error("File Editing failed:", response.data.message);
        setShowError(true);
        setMessage(
          `❌ Error: ${response.data.message || "Something went wrong"}`
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response);
        setShowError(true);
        setMessage(
          `❌ Error: ${error.response.data.message || "Something went wrong"}`
        );
      } else {
        console.error("Network/server error:", error.message);
        setShowError(true);
        setMessage("❌ Network or server error. Please try again later.");
      }
    }
  };

  const fetchClientDocuments = async () => {
    setIsPersonal(true);
    setFolderList([]);
    setLoading(true);
    try {
      const response = await axios.get(
        `${ApiEndPoint}getClientDetailsByUserId/${caseInfo?.ClientId}`
      );
      setUsersDetails(response.data.user);
      setClientDetails(response.data.clientDetails); // Set the API response to state
      console.log("Files Data:", response.data.clientDetails.Files);
      setFiles(response.data.clientDetails.Files);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching client details:", err);
      setLoading(false);
    }
  };

  //  <Button
  //                 variant="primary"
  //                 className="border border-rounded"
  //                 onClick={() => setShowUploadModal(true)}
  //                 style={{
  //                     borderRadius: "50%",
  //                     width: "50px",
  //                     height: "50px",
  //                     display: "flex",
  //                     alignItems: "center",
  //                     justifyContent: "center",
  //                     backgroundColor: "#d3b386",
  //                     color: "white",
  //                 }}
  //             >
  //                 <FontAwesomeIcon icon={faUpload} size="lg" />
  //             </Button>

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

    <div
      className="container-fluid ms-1 d-flex flex-column mr-3 ml-3 p-0"
      style={{ minHeight: "86vh", maxHeight: "86vh" }}
    >
      <Card className="flex-grow-1 d-flex flex-column">
        <Card.Body className="flex-grow-1 d-flex flex-column">
          <div className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              {/* Left side: Breadcrumb navigation */}
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={async () => {
                      await fetchCases();
                      await setSelectedFolder(null);
                      setFolderPath([]);
                      fetchFolders();
                      setIsPersonal(false);
                    }}
                    style={{
                      fontSize: "1.2rem",
                      lineHeight: "1",
                      padding: "0 8px",
                    }}
                    title="Back to root"
                  >
                    📁
                  </Button>
                  {folderPath.length > 0 && (
                    <>
                      <span className="mx-1">/</span>
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
                              if (index >= 0) {
                                fetchsubFolders(folder._id);
                              }
                            }}
                          >
                            {folder.folderName}
                          </Button>
                          {index < folderPath.length - 1 && (
                            <span className="mx-1">/</span>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Right side: All buttons */}
              <div className="d-flex align-items-center gap-2">
                {!IsPersonal && (
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="primary"
                      // className="border border-rounded"
                      onClick={() => setShowUploadModal(true)}
                      // style={{
                      //     borderRadius: "10%",
                      //     width: "50px",
                      //     height: "50px",
                      //     display: "flex",
                      //     alignItems: "center",
                      //     justifyContent: "center",
                      //     // backgroundColor: "#d3b386",
                      //     color: "white",
                      // }}
                      className="d-flex justify-content-center align-items-center m-0"
                      style={{
                        height: "32px",
                        width: "100px",
                        fontSize: "0.85rem",
                      }}
                    >
                      <FontAwesomeIcon icon={faUpload} size="sm" />
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="d-flex justify-content-center align-items-center m-0"
                      style={{
                        height: "32px",
                        width: "100px",
                        fontSize: "0.85rem",
                      }}
                      onClick={() => {
                        setNewFolderName("");
                        setIsEditMode(false);
                        setShowModal(true);
                      }}
                    >
                      + New
                    </Button>
                  </div>
                )}
                {/* <Button
                                    size="sm"
                                    variant="primary"
                                    className="d-flex justify-content-center align-items-center m-0"
                                    style={{ height: "32px", width: "100px", fontSize: "0.85rem" }}
                                    onClick={() => {
                                        setIsPersonal(true);
                                        setFolderPath((prevPath) => [{ folderName: "Personal" }]);
                                        fetchClientDocuments()
                                    }}
                                >
                                    📁Personal
                                </Button> */}

                <Dropdown>
                  <Dropdown.Toggle
                    variant="primary"
                    size="sm"
                    className="d-flex justify-content-center align-items-center m-0"
                    style={{
                      height: "32px",
                      width: "100px",
                      fontSize: "0.85rem",
                    }}
                  >
                    View
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setViewMode("grid")}>
                      Grid View
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setViewMode("list")}>
                      List View
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <div className="d-flex justify-content-end align-items-center mb-2">
                  <select
                    className="form-select form-select-sm w-auto"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="nameAsc">Folder Name (A-Z)</option>
                    <option value="nameDesc">Folder Name (Z-A)</option>
                    <option value="createdAsc">Created Time (Oldest First)</option>
                    <option value="createdDesc">Created Time (Newest First)</option>
                  </select>
                </div>


                {/* Upload Button */}
              </div>
            </Card.Header>

            <Card.Body className="overflow-auto" style={{ maxHeight: "72vh" }}>
              <Row
                className="g-3"
                style={{
                  flexDirection: viewMode === "list" ? "column" : "row",
                  height: "100%",
                  overflow: "auto",
                }}
              >
                {/* Folders */}
                {!IsPersonal && (
                  <>
                    {[...folderList]
                      .sort((a, b) => {
                        const aStartsWithNumber = /^\d+/.test(a.folderName);
                        const bStartsWithNumber = /^\d+/.test(b.folderName);

                        // Group numeric-prefixed folders and non-numeric ones
                        if (sortOption === "nameAsc") {
                          if (aStartsWithNumber && !bStartsWithNumber) return -1;
                          if (!aStartsWithNumber && bStartsWithNumber) return 1;

                          return a.folderName.localeCompare(b.folderName, undefined, {
                            numeric: true,
                            sensitivity: "base",
                          });
                        }

                        if (sortOption === "nameDesc") {
                          if (aStartsWithNumber && !bStartsWithNumber) return 1;
                          if (!aStartsWithNumber && bStartsWithNumber) return -1;

                          return b.folderName.localeCompare(a.folderName, undefined, {
                            numeric: true,
                            sensitivity: "base",
                          });
                        }

                        if (sortOption === "createdAsc") {
                          return new Date(a.createdAt) - new Date(b.createdAt);
                        }

                        if (sortOption === "createdDesc") {
                          return new Date(b.createdAt) - new Date(a.createdAt);
                        }

                        return 0;
                      })?.map((folder) => {
                        const editKey = `edit-${folder._id}`;
                        const deleteKey = `delete-${folder._id}`;

                        return (
                          <Col
                            key={folder._id}
                            sm={viewMode === "grid" ? 6 : 12}
                            md={viewMode === "grid" ? 4 : 12}
                            lg={viewMode === "grid" ? 3 : 12}
                          >
                            <Card
                              className="p-2"
                              style={{
                                background: "#18273e",
                                border: "1px solid white",
                                display: "flex",
                                flexDirection:
                                  viewMode === "list" ? "row" : "column",
                                alignItems:
                                  viewMode === "list" ? "center" : "flex-start",
                                cursor: "pointer",
                                transition: "transform 0.2s, box-shadow 0.2s",
                              }}
                              onClick={() => {
                                folder.folderName === "Personal"
                                  ? fetchClientDocuments()
                                  : folder.folderName === "FormC Documents" ? fetchFormCfile() : fetchsubFolders(folder._id);
                                setSelectedFolder(folder);
                                setFolderPath((prevPath) => [
                                  ...prevPath,
                                  folder,
                                ]);
                              }}
                              onMouseEnter={(e) => {
                                if (viewMode === "grid") {
                                  e.currentTarget.style.transform = "scale(1.05)";
                                  e.currentTarget.style.boxShadow =
                                    "0px 4px 10px rgba(0, 0, 0, 0.8)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (viewMode === "grid") {
                                  e.currentTarget.style.transform = "scale(1)";
                                  e.currentTarget.style.boxShadow = "none";
                                }
                              }}
                            >
                              <div className="d-flex align-items-center" style={{ width: "100%" }}>
                                <FontAwesomeIcon icon={faFolder} size="2x" style={{ color: "#d3b386", marginRight: "10px" }} />

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div
                                    style={{
                                      fontSize: "0.9rem",
                                      color: "white",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      width: "100%",
                                    }}
                                    title={folder.folderName}
                                  >
                                    {folder.folderName}
                                  </div>
                                </div>
                              </div>


                              <Card.Body
                                className="p-1 d-flex justify-content-between align-items-center"
                                style={{ width: "100%" }}
                              >
                                <div
                                  className="d-flex gap-2 justify-content-end"
                                  style={{ width: "100%" }}
                                >
                                  <Button
                                    variant="success"
                                    size="sm"
                                    style={{
                                      background: "#ebbf46",
                                      // background: "#929cd1",
                                      border: "none",
                                      width: "36px",
                                      height: "36px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: 0,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditModal(folder);
                                    }}
                                    disabled={
                                      folder.folderName === "Personal"
                                        ? true
                                        : false
                                    }
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </Button>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    style={{
                                      background: "#007bff",
                                      border: "none",
                                      width: "36px",
                                      height: "36px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: 0,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openMoveModal(folder);
                                    }}
                                    disabled={
                                      folder.folderName === "Personal"
                                        ? true
                                        : false
                                    }
                                  >
                                    <img
                                      src={movefolder} // <-- Your folder move image path
                                      alt="Move Folder"
                                      style={{ width: "18px", height: "18px" }}
                                    />
                                  </Button>

                                  <Button
                                    variant="danger"
                                    size="sm"
                                    style={{
                                      background: "#dc3545",
                                      border: "none",
                                      width: "36px",
                                      height: "36px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: 0,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      //    handleDeleteFolder(folder._id);
                                      setDeletefolderId(folder._id);
                                      setIsfolderdelete(true);
                                    }}
                                    disabled={
                                      folder.folderName === "Personal"
                                        ? true
                                        : false
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                  </>
                )}

                {/* Files */}
                {[...files]
                  .sort((a, b) => {
                    const aStartsWithNumber = /^\d+/.test(a.fileName);
                    const bStartsWithNumber = /^\d+/.test(b.fileName);

                    if (sortOption === "nameAsc") {
                      if (aStartsWithNumber && !bStartsWithNumber) return -1;
                      if (!aStartsWithNumber && bStartsWithNumber) return 1;

                      return a.fileName.localeCompare(b.fileName, undefined, {
                        numeric: true,
                        sensitivity: "base",
                      });
                    }

                    if (sortOption === "nameDesc") {
                      if (aStartsWithNumber && !bStartsWithNumber) return 1;
                      if (!aStartsWithNumber && bStartsWithNumber) return -1;

                      return b.fileName.localeCompare(a.fileName, undefined, {
                        numeric: true,
                        sensitivity: "base",
                      });
                    }

                    if (sortOption === "createdAsc") {
                      return new Date(a.uploadedAt) - new Date(b.uploadedAt);
                    }

                    if (sortOption === "createdDesc") {
                      return new Date(b.uploadedAt) - new Date(a.uploadedAt);
                    }

                    return 0;
                  })
                  .map((file, index) => (
                    <Col
                      key={index}
                      sm={viewMode === "grid" ? 6 : 12}
                      md={viewMode === "grid" ? 4 : 12}
                      lg={viewMode === "grid" ? 3 : 12}
                    >
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
                            e.currentTarget.style.boxShadow =
                              "0px 4px 10px rgba(0, 0, 0, 0.8)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (viewMode === "grid") {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >

                        <div className="d-flex gap-2 align-items-center" style={{ width: "100%" }}>

                          <FontAwesomeIcon
                            icon={getFileTypeIcon(file.fileName)}
                            size="2x"
                            className="mb-2"
                            style={{
                              color: "#d3b386",
                              marginRight: viewMode === "list" ? "10px" : "0",
                            }}
                          />
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "white",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {file.fileName}
                          </div>

                        </div>
                        <Card.Body
                          className="p-1 d-flex justify-content-between align-items-center"
                          style={{ width: "100%" }}
                        >
                          <div
                            className="d-flex gap-2 justify-content-end"
                            style={{ width: "100%" }}
                          >
                            {!IsPersonal && (
                              <>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFileEditModal(file);
                                  }}
                                  style={{
                                    background: "#ebbf46",
                                    border: "none",
                                    padding: "0.25rem 0.5rem",
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMoveFileId(file._id);
                                    openMoveModal(selectedFolder);
                                  }}
                                  style={{
                                    background: "#007bff",
                                    border: "none",
                                    padding: "0.25rem 0.5rem",
                                  }}
                                >
                                  <img
                                    src={movefolder}
                                    alt="Move Folder"
                                    style={{ width: "18px", height: "18px" }}
                                  />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleDownload(file._id, file.fileName)}
                              style={{
                                background: "#28a745",
                                border: "none",
                                padding: "0.25rem 0.5rem",
                              }}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </Button>
                            {!IsPersonal && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setDeletefileId(file._id);
                                  setIsdelete(true);
                                }}
                                style={{
                                  background: "#dc3545",
                                  border: "none",
                                  padding: "0.25rem 0.5rem",
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}


                {!folderList?.length && !files?.length && (
                  <Col xs={12}>
                    <div className="text-center text-black py-5">
                      No folders or files available.
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </div>
        </Card.Body>
      </Card>
      <MoveFolderModal
        show={showMoveModal}
        onClose={closeMoveModal}
        folder={folderToMove !== null ? folderToMove : Mainfolder}
        allFolders={folderList} // array of all folders you have
        onMove={moveFileId !== null ? handlefileMove : handleMoveFolder}
      />

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

      {/* Create/Edit Folder Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Edit Folder" : "Create New Folder"}
          </Modal.Title>
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

      <Modal
        show={showFileModal}
        onHide={() => setShowFileModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Edit File" : "Create New FIle"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>File Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter File name"
                value={newFileName}
                maxLength={40} // ✅ character limit
                onChange={(e) => {
                  const value = e.target.value;
                  // ✅ sirf alphabets, numbers, and space allow karo
                  const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
                  setNewFileName(filteredValue);
                }}
              />
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#888",
                  textAlign: "right",
                }}
              >
                {newFileName?.length}/40
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="primary" onClick={() => setShowFileModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateFileName}>
            {isEditMode ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={Isdelete} onHide={() => setIsdelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>File Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p className="fs-5">Are you sure you want to delete this file?</p>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="secondary" onClick={() => setIsdelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleFileDelete(deletefileid)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={Isfolderdelete}
        onHide={() => setIsfolderdelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Folder Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <p className="fs-5">Are you sure you want to delete this folder?</p>
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-end">
          <Button variant="secondary" onClick={() => setIsfolderdelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteFolder(deletefolderid)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={message}
      />
    </div>
  );
};

export default ViewFolder;
