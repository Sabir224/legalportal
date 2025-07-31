import React, { useEffect, useState } from "react";
import { Button, Card, Col, Modal, Form, Row, Dropdown } from "react-bootstrap";
import { ApiEndPoint } from "../utils/utlis";
import { useDispatch, useSelector } from "react-redux";
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
  faListUl,
  faSort,
  faList,
  faThLarge,
  faPlus,
  faChevronRight,
  faTimes,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import DragAndDrop from "../DragAndDrop";
import MoveFolderModal from "./MoveFolderModal";
import movefolder from "./Icons/movefolder.png";
import ErrorModal from "../../AlertModels/ErrorModal";
import { Caseinfo, FormHDetails, LitigationFormH } from "../../../../REDUX/sliece";

const ViewFolder = ({ token }) => {
  const [folderList, setFolderList] = useState([]);
  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const FormCDetails = useSelector((state) => state.screen.FormCDetails);
  const FormHDetailsInfo = useSelector((state) => state.screen.FormHDetails);
  const litigationform = useSelector((state) => state.screen.LitigationFormH);
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
  const [IsfolderClick, setIsfolderClick] = useState(false);
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
  const [IsFormH, setIsFormH] = useState(false);
  const [sortOption, setSortOption] = useState("nameAsc");
  const [folderPath, setFolderPath] = useState([]);
  const dispatch = useDispatch();

  const [showError, setShowError] = useState(false);
  const [isfile, setisfile] = useState(false);
  const [message, setMessage] = useState("");
  const [assignlawyer, setassgnlawyer] = useState([]);



  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);

  // const CASE_REF = reduxCaseInfo?.CaseId // 🔁 You can pass this dynamically if needed

  // console.log("CASE_REF?._id", reduxCaseInfo)


  useEffect(() => {

    fetchLawyers();

  }, []);
  // Function to fetch cases
  const fetchLawyers = async () => {
    try {

      const caseResponse = await axios.get(
        `${ApiEndPoint}getCaseLawyersUserNames/${reduxCaseInfo?._id}`
      );
      console.log("caseResponse.data", caseResponse.data)
      setassgnlawyer(caseResponse.data?.lawyers)
    } catch (err) {
      console.error("Error fetching case or party data:", err);

    } finally {

    }
  };


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

  const fetchFolders = async (preservePath = false) => {
    setLoadingFolders(true);
    setError("");

    try {
      const caseIdToUse = effectiveCaseInfo?._id;
      //if (!caseIdToUse) throw new Error("No case ID available");

      console.log("APi call address FormHDetailsInfo =", FormHDetailsInfo)
      console.log("APi call address caseInfo =", caseInfo)
      let uriapi = (FormHDetailsInfo && caseInfo) ? `${ApiEndPoint}getFoldersByNameAndCaseId/1 Form Folder/${caseIdToUse}` : `${ApiEndPoint}getFolders/${caseIdToUse}`

      console.log("APi call address =", uriapi)
      const response = await fetch(uriapi);
      if (!response.ok) throw new Error("Error fetching folders");

      const data = await response.json();

      console.log("folder", data)
      const fetchedFolders = Array.isArray(data?.folders) ? data.folders : [];
      console.log("fetchedFolders", fetchedFolders)

      let customFolder = null;

      if (FormHDetailsInfo) {
        setIsFormH(true)
        if (!caseInfo) {
          customFolder = {
            _id: "formh-folder",
            folderName: "Form H Documents",
            caseId: caseIdToUse,
            files: [],
            parentId: data?.mainfolder?._id || null,
            isFormHDoc: true,
          };
        }
      } else if (FormCDetails) {

        customFolder = {
          _id: "formc-folder",
          folderName: "FormC Documents",
          caseId: caseIdToUse,
          files: [],
          parentId: data?.mainfolder?._id || null,
          isFormCDoc: true,
        };
      } else {
        customFolder = {
          _id: "personal-folder",
          folderName: "Personal",
          caseId: caseIdToUse,
          files: [],
          parentId: data?.mainfolder?._id || null,
          isPersonal: true,
        };
      }


      console.log("finalFolders")

      const finalFolders = [
        ...(customFolder ? [customFolder] : []),
        ...fetchedFolders,
      ];

      console.log("finalFolders", finalFolders)

      setFolderList(finalFolders);
      setMainfolderId(data?.mainfolder?._id);
      setMainfolder(data?.mainfolder);

      // ✅ Preserve folder path if needed
      if (!preservePath) {
        setFolderPath([]);
      }


      setFiles(data?.files || []);
    } catch (err) {
      setError(err.message);
      let fallbackFolder;
      console.log("form detail in catch = ", FormHDetailsInfo)
      if (FormHDetailsInfo) {
        setIsFormH(true)
        fallbackFolder = {
          _id: "formh-folder",
          folderName: "Form H Documents",
          files: [],
          isFormHDoc: true,
        };
      } else if (FormCDetails) {
        fallbackFolder = {
          _id: "formc-folder",
          folderName: "FormC Documents",
          files: [],
          isFormCDoc: true,
        };
      } else {
        fallbackFolder = {
          _id: "personal-folder",
          folderName: "Personal",
          files: [],
          isPersonal: true,
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
  }, [effectiveCaseInfo?._id, FormHDetailsInfo]);

  // Subfolder fetch function
  const fetchsubFolders = async (parentId) => {
    if (!parentId) return;

    setLoadingFolders(true);
    setError("");

    try {
      const response = await fetch(`${ApiEndPoint}getSubFolders/${parentId}`);
      if (!response.ok) throw new Error("Error fetching subfolders");

      const data = await response.json();

      // Preserve selected folder and path
      setFolderList(Array.isArray(data) ? data : []);
      // You may also want to update breadcrumb path here if needed
    } catch (err) {
      setError(err.message);
      setFolderList([]);
    } finally {
      setLoadingFolders(false);
    }
  };

  const fetchFormCfile = async (folder) => {
    setLoadingFolders(true);
    setError("");
    let uriapi = folder === "Form H Documents" ? `${ApiEndPoint}getFormHFile/${FormHDetailsInfo}` : `${ApiEndPoint}getFormCDetailsAndFilesByEmail/${FormCDetails}`
    try {
      const response = await fetch(uriapi);
      if (!response.ok) throw new Error("Error fetching subfolders");

      const data = await response.json();
      setFolderList(Array.isArray(data) ? data : []);
      console.log("...", data.files);
      setFiles(data.files);
    } catch (err) {
      setError(err.message);
      setFolderList([]);
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
    let caseData = {
      caseId: effectiveCaseInfo?._id,
      folderName: newFolderName,
      files: [],
      subFolders: [],
      parentFolderId: selectedFolder?._id,
    };

    try {
      const response = await axios.post(`${ApiEndPoint}CreateFolder`, caseData);

      if (response.data?._id) {
        console.log("📂 Folder created successfully:", response.data);

        // Preserve current path view
        if (folderPath.length > 0) {
          fetchsubFolders(folderPath[folderPath.length - 1]?._id);
        } else {
          fetchFolders(true);
        }

        setShowModal(false);
      } else {
        setShowError(true);
        setShowModal(false);
        setMessage(response.data.message);
      }
    } catch (error) {
      setShowModal(false);
      setShowError(true);
      if (error.response?.status === 409) {
        setMessage(
          "❌ Folder with the same name already exists for this case."
        );
      } else {
        setMessage(`❌ ${error.response?.data?.message || "Network error"}`);
      }
    }
  };

  const handleUpdateFolder = async () => {
    const caseData = {
      folderId: editFolderId,
      newFolderName: newFolderName,
    };

    try {
      const response = await axios.put(
        `${ApiEndPoint}updateFolderName`,
        caseData
      );

      if (folderPath.length > 0) {
        fetchsubFolders(folderPath[folderPath.length - 1]._id);
      } else {
        fetchFolders(true);
      }

      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      setShowError(true);
      setMessage(`❌ ${error.response?.data?.message || "Network error"}`);
    }
  };
  const handleDeleteFolder = async (id) => {
    try {
      await axios.delete(`${ApiEndPoint}deleteFolder/${id}`);

      setFolderList((prev) => prev.filter((folder) => folder._id !== id));
      setIsfolderdelete(false);
      setDeletefolderId(null);

      if (selectedFolder?._id === id) {
        setSelectedFolder(null);
      }

      // Preserve path view
      if (folderPath.length > 0) {
        fetchsubFolders(folderPath[folderPath.length - 1]._id);
      } else {
        fetchFolders(true);
      }
    } catch (error) {
      console.error("❌ Error deleting folder:", error);
      setError("Error deleting folder");
    }
  };

  const handleFileDelete = async (fileId) => {
    try {
      const response = await axios.delete(
        `${ApiEndPoint}/deleteFileFromFolder/${fileId}`
      );

      if (response.status === 200) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file._id !== fileId)
        );
        setIsdelete(false);
        setDeletefileId(null);

        // Optionally re-fetch the folder’s contents to reflect changes
        if (folderPath.length > 0) {
          fetchsubFolders(folderPath[folderPath.length - 1]._id);
        } else {
          fetchFolders(true);
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
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

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent("")}`;
  const [activeTab, setActiveTab] = useState("documents");

  const handleDownload = async (fileId, fileName, filePath) => {
    console.log("file name", fileId);

    // let apiaddress = FormCDetails!=null ? `${ApiEndPoint}formCDownloadFile/${fileId}` : `${ApiEndPoint}download/${fileId}`
    // if (FormHDetailsInfo) {
    try {
      console.log(filePath)
      const response = await fetch(`${ApiEndPoint}/downloadFileByUrl/${encodeURIComponent(filePath)}`);
      const data = await response.json();

      console.log("data=", data)
      if (response.ok) {
        window.open(data.url, '_blank'); // <-- Open in new tab
        // return data.signedUrl;
        return data.url;
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error fetching signed URL:", err);
      return null;
    }
    // } else
    //  {

    //   let apiaddress = IsPersonal
    //     ? `${ApiEndPoint}download/${fileId}`
    //     : FormCDetails != null
    //       ? `${ApiEndPoint}formCDownloadFile/${fileId}`
    //       : `${ApiEndPoint}downloadFileFromFolder/${fileId}`;
    //   console.log("file apiaddress", apiaddress);
    //   if (IsPersonal) {
    //     console.log("Download Response JSON:", fileId);

    //     try {
    //       const response = await fetch(apiaddress, {
    //         method: "POST", // Changed to POST to send body
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({}), // Sending email in request body
    //       });

    //       // Log the raw response before processing
    //       console.log("Raw Response:", response);

    //       if (!response.ok) {
    //         const errorText = await response.text(); // Get the error response if available
    //         throw new Error(`Failed to fetch the file: ${errorText}`);
    //       }

    //       // Log the JSON response before downloading (if applicable)
    //       const jsonResponse = await response.json();
    //       console.log("Download Response JSON:", jsonResponse);

    //       // Check if the response contains a signed URL instead of a file blob
    //       if (jsonResponse.downloadUrl) {
    //         console.log("Signed URL received:", jsonResponse.downloadUrl);
    //         window.open(jsonResponse.downloadUrl, "_blank");
    //         return;
    //       }

    //       // Validate content type
    //       const contentType = response.headers.get("Content-Type");
    //       console.log("Content-Type:", contentType);
    //       if (
    //         !contentType ||
    //         (!contentType.startsWith("application/") &&
    //           contentType !== "application/octet-stream")
    //       ) {
    //         throw new Error("Invalid content type: " + contentType);
    //       }

    //       // Process the file blob
    //       const blob = await response.blob();
    //       console.log("Blob Data:", blob);

    //       // Create a URL and trigger download
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement("a");
    //       a.href = url;
    //       a.download = fileName || "downloaded_file"; // Default filename if none is provided
    //       document.body.appendChild(a);
    //       a.click();
    //       document.body.removeChild(a);

    //       // Cleanup
    //       setTimeout(() => window.URL.revokeObjectURL(url), 100);
    //     } catch (error) {
    //       console.error("Error downloading file:", error);
    //     }
    //   } else {
    //     try {
    //       const response = await fetch(apiaddress, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({}), // No email needed anymore
    //       });

    //       console.log("Raw Response:", response);

    //       if (!response.ok) {
    //         const errorText = await response.text();
    //         throw new Error(`Failed to fetch the file: ${errorText}`);
    //       }

    //       const jsonResponse = await response.json();
    //       console.log("Download Response JSON:", jsonResponse);

    //       if (jsonResponse.downloadUrl) {
    //         console.log("Signed URL received:", jsonResponse.downloadUrl);
    //         window.open(jsonResponse.downloadUrl, "_blank");
    //         return;
    //       }

    //       throw new Error("Signed URL not received in the response");
    //     } catch (error) {
    //       console.error("Error downloading file:", error);
    //     }
    //   }
    // }
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
          fetchFolders(true);
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

    let files = Array.isArray(input)
      ? input
      : Array.from(input.target.files || []);

    // If input is coming from rename/remove operation (i.e. full file list), replace selectedFiles
    const isReplace = input?.target?.files && selectedFiles.length !== 0;

    let validFiles = [];
    let invalidSizeFiles = [];
    let invalidTypeFiles = [];
    let invalidLengthFiles = [];

    let totalFiles = isReplace ? 0 : selectedFiles.length;

    for (let file of files) {
      if (totalFiles >= 10) break;

      if (file.name.length > 80) {
        let truncatedName =
          file.name.substring(0, 20) + "..." + file.name.slice(-10);
        invalidLengthFiles.push(truncatedName);
        continue;
      }

      const fileType = getFileType(file.name);
      if (fileType === "other") {
        invalidTypeFiles.push(file.name);
      } else if (!validateFileSize(file)) {
        invalidSizeFiles.push(
          `${file.name} (Max ${(
            (sizeLimits[fileType] || 2 * 1024 * 1024) /
            (1024 * 1024)
          ).toFixed(1)}MB)`
        );
      } else {
        validFiles.push(file);
        totalFiles++;
      }
    }

    if (totalFiles > 10) {
      setErrorMessage((prev) => [
        ...prev,
        `Maximum 10 files can be uploaded at any time and allow first 5 for upload`,
      ]);
      validFiles = validFiles.slice(0, 10 - selectedFiles.length);
    }

    if (invalidSizeFiles.length > 0) {
      setErrorMessage((prev) => [
        ...prev,
        `The following files exceed the size limit: ${invalidSizeFiles.join(", ")}`,
      ]);
    }

    if (invalidTypeFiles.length > 0) {
      setErrorMessage((prev) => [
        ...prev,
        `The following file extensions are not allowed: ${invalidTypeFiles.join(", ")}`,
      ]);
    }

    if (invalidLengthFiles.length > 0) {
      setErrorMessage((prev) => [
        ...prev,
        `The following files have names longer than 40 characters: ${invalidLengthFiles.join(", ")}`,
      ]);
    }

    // Replace or Append
    if (isReplace) {
      setSelectedFiles(validFiles.slice(0, 5));
    } else {
      setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    }

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
    setisfile(false)
  };

  // const handleMoveFolder = async (movefolder, moveintofolder) => {
  //   let caseData = {
  //     folderId: movefolder?._id, // Unique ID for the case
  //     newParentFolderId: moveintofolder ? moveintofolder?._id : MainfolderId, // Folder name being created
  //   };

  //   console.log("folder move data", moveintofolder);

  //   try {
  //     const response = await axios.post(
  //       `${ApiEndPoint}moveFolderOneToAnotherFolder`,
  //       caseData
  //     );

  //     // Check if the response contains a success message or the created folder
  //     if (response.data._id) {
  //       console.log("📂 Folder Move successfully:", response.data);
  //       fetchFolders(true); // Refresh the folder list after creation
  //       // alert("✅ Folder Move Successfully!");
  //     } else {
  //       console.error("Folder Move failed:", response.data.message);
  //       setShowError(true);
  //       setMessage(
  //         `❌ Error: ${response.data.message || "Something went wrong"}`
  //       );
  //       //alert(`❌ Error: ${response.data.message || 'Something went wrong'}`);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       console.error("API error:", error.response);
  //       if (error.response.status === 409) {
  //         setShowError(true);
  //         setMessage(
  //           "❌ Folder with the same name already exists for this case."
  //         );
  //       } else {
  //         setShowError(true);
  //         setMessage(
  //           `❌ Error: ${error.response.data.message || "Something went wrong"}`
  //         );
  //       }
  //     } else {
  //       console.error("Network or server error:", error.message);
  //       setShowError(true);
  //       setMessage("❌ Network or server error. Please try again later.");
  //     }
  //   }
  // };

  const handleMoveFolder = async (movefolder, moveintofolder) => {
    let caseData = {
      folderId: movefolder?._id,
      newParentFolderId: moveintofolder ? moveintofolder?._id : MainfolderId,
    };

    try {
      const response = await axios.post(
        `${ApiEndPoint}moveFolderOneToAnotherFolder`,
        caseData
      );

      if (response?.data?._id) {
        // Preserve current folder view instead of resetting to root
        if (folderPath.length > 0) {
          // We're inside a subfolder
          const currentFolderId = folderPath[folderPath.length - 1]?._id;
          fetchsubFolders(currentFolderId);
        } else {
          // In root folder
          fetchFolders(true);
        }
      } else {
        console.error("Folder Move failed:", response.data.message);
        setShowError(true);
        setMessage(
          `❌ Error: ${response.data.message || "Something went wrong"}`
        );
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
        if (folderPath.length > 0) {
          // We're inside a subfolder
          const currentFolderId = folderPath[folderPath.length - 1]?._id;
          fetchsubFolders(currentFolderId);
        } else {
          // In root folder
          fetchFolders(true);
        }
        console.log("📂 File moved successfully");
        // fetchFolders(true); // Refresh the folders
        setSelectedFolder(null);
        //  setFolderPath([]);
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
          await fetchFolders(true);
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

  // return (

  //   <div
  //     className="container-fluid ms-1 d-flex flex-column mr-3 ml-3 p-0"
  //     style={{ minHeight: "86vh", maxHeight: "86vh" }}
  //   >
  //     <Card className="flex-grow-1 d-flex flex-column">
  //       <Card.Body className="flex-grow-1 d-flex flex-column">
  //         <div className="h-100">
  //           <Card.Header className="d-flex justify-content-between align-items-center">
  //             {/* Left side: Breadcrumb navigation */}
  //             <div className="d-flex align-items-center gap-2">
  //               <div className="d-flex align-items-center">
  //                 <Button
  //                   variant="light"
  //                   size="sm"
  //                   onClick={async () => {
  //                     await fetchCases();
  //                     await setSelectedFolder(null);
  //                     setFolderPath([]);
  //                     fetchFolders();
  //                     setIsPersonal(false);
  //                   }}
  //                   style={{
  //                     fontSize: "1.2rem",
  //                     lineHeight: "1",
  //                     padding: "0 8px",
  //                   }}
  //                   title="Back to root"
  //                 >
  //                   📁
  //                 </Button>
  //                 {folderPath.length > 0 && (
  //                   <>
  //                     <span className="mx-1">/</span>
  //                     {folderPath.map((folder, index) => (
  //                       <React.Fragment key={folder._id}>
  //                         <Button
  //                           variant="link"
  //                           size="sm"
  //                           className="p-0"
  //                           onClick={() => {
  //                             const newPath = folderPath.slice(0, index + 1);
  //                             setFolderPath(newPath);
  //                             setSelectedFolder(folder);
  //                             if (index >= 0) {
  //                               fetchsubFolders(folder._id);
  //                             }
  //                           }}
  //                         >
  //                           {folder.folderName}
  //                         </Button>
  //                         {index < folderPath.length - 1 && (
  //                           <span className="mx-1">/</span>
  //                         )}
  //                       </React.Fragment>
  //                     ))}
  //                   </>
  //                 )}
  //               </div>
  //             </div>

  //             {/* Right side: All buttons */}
  //             <div className="d-flex align-items-center gap-2">
  //               {(!IsPersonal && !FormCDetails) && (
  //                 <div className="d-flex align-items-center gap-2">
  //                   <Button
  //                     variant="primary"
  //                     // className="border border-rounded"
  //                     onClick={() => setShowUploadModal(true)}

  //                     className="d-flex justify-content-center align-items-center m-0"
  //                     style={{
  //                       height: "32px",
  //                       width: "100px",
  //                       fontSize: "0.85rem",
  //                     }}
  //                   >
  //                     <FontAwesomeIcon icon={faUpload} size="sm" />
  //                   </Button>
  //                   <Button
  //                     size="sm"
  //                     variant="primary"
  //                     className="d-flex justify-content-center align-items-center m-0"
  //                     style={{
  //                       height: "32px",
  //                       width: "100px",
  //                       fontSize: "0.85rem",
  //                     }}
  //                     onClick={() => {
  //                       setNewFolderName("");
  //                       setIsEditMode(false);
  //                       setShowModal(true);
  //                     }}
  //                   >
  //                     + New
  //                   </Button>
  //                 </div>
  //               )}

  //               <Dropdown>
  //                 <Dropdown.Toggle
  //                   variant="primary"
  //                   size="sm"
  //                   className="d-flex justify-content-center align-items-center m-0"
  //                   style={{
  //                     height: "32px",
  //                     width: "100px",
  //                     fontSize: "0.85rem",
  //                   }}
  //                 >
  //                   View
  //                 </Dropdown.Toggle>

  //                 <Dropdown.Menu>
  //                   <Dropdown.Item onClick={() => setViewMode("grid")}>
  //                     Grid View
  //                   </Dropdown.Item>
  //                   <Dropdown.Item onClick={() => setViewMode("list")}>
  //                     List View
  //                   </Dropdown.Item>
  //                 </Dropdown.Menu>
  //               </Dropdown>

  //               <div className="d-flex justify-content-end align-items-center mb-2">
  //                 <select
  //                   className="form-select form-select-sm w-auto"
  //                   value={sortOption}
  //                   onChange={(e) => setSortOption(e.target.value)}
  //                 >
  //                   <option value="nameAsc">Folder Name (A-Z)</option>
  //                   <option value="nameDesc">Folder Name (Z-A)</option>
  //                   <option value="createdAsc">Created Time (Oldest First)</option>
  //                   <option value="createdDesc">Created Time (Newest First)</option>
  //                 </select>
  //               </div>

  //               {/* Upload Button */}
  //             </div>
  //           </Card.Header>

  //           <Card.Body className="overflow-auto" style={{ maxHeight: "72vh" }}>
  //             <Row
  //               className="g-3"
  //               style={{
  //                 flexDirection: viewMode === "list" ? "column" : "row",
  //                 height: "100%",
  //                 overflow: "auto",
  //               }}
  //             >
  //               {/* Folders */}
  //               {!IsPersonal && (
  //                 <>
  //                   {[...folderList]
  //                     .sort((a, b) => {
  //                       const aStartsWithNumber = /^\d+/.test(a.folderName);
  //                       const bStartsWithNumber = /^\d+/.test(b.folderName);

  //                       // Group numeric-prefixed folders and non-numeric ones
  //                       if (sortOption === "nameAsc") {
  //                         if (aStartsWithNumber && !bStartsWithNumber) return -1;
  //                         if (!aStartsWithNumber && bStartsWithNumber) return 1;

  //                         return a.folderName.localeCompare(b.folderName, undefined, {
  //                           numeric: true,
  //                           sensitivity: "base",
  //                         });
  //                       }

  //                       if (sortOption === "nameDesc") {
  //                         if (aStartsWithNumber && !bStartsWithNumber) return 1;
  //                         if (!aStartsWithNumber && bStartsWithNumber) return -1;

  //                         return b.folderName.localeCompare(a.folderName, undefined, {
  //                           numeric: true,
  //                           sensitivity: "base",
  //                         });
  //                       }

  //                       if (sortOption === "createdAsc") {
  //                         return new Date(a.createdAt) - new Date(b.createdAt);
  //                       }

  //                       if (sortOption === "createdDesc") {
  //                         return new Date(b.createdAt) - new Date(a.createdAt);
  //                       }

  //                       return 0;
  //                     })?.map((folder) => {
  //                       const editKey = `edit-${folder._id}`;
  //                       const deleteKey = `delete-${folder._id}`;

  //                       return (
  //                         <Col
  //                           key={folder._id}
  //                           sm={viewMode === "grid" ? 6 : 12}
  //                           md={viewMode === "grid" ? 4 : 12}
  //                           lg={viewMode === "grid" ? 3 : 12}
  //                         >
  //                           <Card
  //                             className="p-2"
  //                             style={{
  //                               background: "#18273e",
  //                               border: "1px solid white",
  //                               display: "flex",
  //                               flexDirection:
  //                                 viewMode === "list" ? "row" : "column",
  //                               alignItems:
  //                                 viewMode === "list" ? "center" : "flex-start",
  //                               cursor: "pointer",
  //                               transition: "transform 0.2s, box-shadow 0.2s",
  //                             }}
  //                             onClick={() => {
  //                               folder.folderName === "Personal"
  //                                 ? fetchClientDocuments()
  //                                 : folder.folderName === "FormC Documents" ? fetchFormCfile() : fetchsubFolders(folder._id);
  //                               setSelectedFolder(folder);
  //                               setFolderPath((prevPath) => [
  //                                 ...prevPath,
  //                                 folder,
  //                               ]);
  //                             }}
  //                             onMouseEnter={(e) => {
  //                               if (viewMode === "grid") {
  //                                 e.currentTarget.style.transform = "scale(1.05)";
  //                                 e.currentTarget.style.boxShadow =
  //                                   "0px 4px 10px rgba(0, 0, 0, 0.8)";
  //                               }
  //                             }}
  //                             onMouseLeave={(e) => {
  //                               if (viewMode === "grid") {
  //                                 e.currentTarget.style.transform = "scale(1)";
  //                                 e.currentTarget.style.boxShadow = "none";
  //                               }
  //                             }}
  //                           >
  //                             <div className="d-flex align-items-center" style={{ width: "100%" }}>
  //                               <FontAwesomeIcon icon={faFolder} size="2x" style={{ color: "#d3b386", marginRight: "10px" }} />

  //                               <div style={{ flex: 1, minWidth: 0 }}>
  //                                 <div
  //                                   style={{
  //                                     fontSize: "0.9rem",
  //                                     color: "white",
  //                                     overflow: "hidden",
  //                                     textOverflow: "ellipsis",
  //                                     whiteSpace: "nowrap",
  //                                     width: "100%",
  //                                   }}
  //                                   title={folder.folderName}
  //                                 >
  //                                   {folder.folderName}
  //                                 </div>
  //                               </div>
  //                             </div>

  //                             <Card.Body
  //                               className="p-1 d-flex justify-content-between align-items-center"
  //                               style={{ width: "100%" }}
  //                             >
  //                               <div
  //                                 className="d-flex gap-2 justify-content-end"
  //                                 style={{ width: "100%" }}
  //                               >
  //                                 <Button
  //                                   variant="success"
  //                                   size="sm"
  //                                   style={{
  //                                     background: "#ebbf46",
  //                                     // background: "#929cd1",
  //                                     border: "none",
  //                                     width: "36px",
  //                                     height: "36px",
  //                                     display: "flex",
  //                                     alignItems: "center",
  //                                     justifyContent: "center",
  //                                     padding: 0,
  //                                   }}
  //                                   onClick={(e) => {
  //                                     e.stopPropagation();
  //                                     openEditModal(folder);
  //                                   }}
  //                                   disabled={
  //                                     folder.folderName === "Personal"
  //                                       ? true
  //                                       : folder.folderName === "FormC Documents" ? true : false
  //                                   }
  //                                 >
  //                                   <FontAwesomeIcon icon={faEdit} />
  //                                 </Button>
  //                                 <Button
  //                                   variant="success"
  //                                   size="sm"
  //                                   style={{
  //                                     background: "#007bff",
  //                                     border: "none",
  //                                     width: "36px",
  //                                     height: "36px",
  //                                     display: "flex",
  //                                     alignItems: "center",
  //                                     justifyContent: "center",
  //                                     padding: 0,
  //                                   }}
  //                                   onClick={(e) => {
  //                                     e.stopPropagation();
  //                                     openMoveModal(folder);
  //                                   }}
  //                                   disabled={
  //                                     folder.folderName === "Personal"
  //                                       ? true
  //                                       : folder.folderName === "FormC Documents" ? true : false
  //                                   }
  //                                 >
  //                                   <img
  //                                     src={movefolder} // <-- Your folder move image path
  //                                     alt="Move Folder"
  //                                     style={{ width: "18px", height: "18px" }}
  //                                   />
  //                                 </Button>

  //                                 <Button
  //                                   variant="danger"
  //                                   size="sm"
  //                                   style={{
  //                                     background: "#dc3545",
  //                                     border: "none",
  //                                     width: "36px",
  //                                     height: "36px",
  //                                     display: "flex",
  //                                     alignItems: "center",
  //                                     justifyContent: "center",
  //                                     padding: 0,
  //                                   }}
  //                                   onClick={(e) => {
  //                                     e.stopPropagation();
  //                                     //    handleDeleteFolder(folder._id);
  //                                     setDeletefolderId(folder._id);
  //                                     setIsfolderdelete(true);
  //                                   }}
  //                                   disabled={
  //                                     folder.folderName === "Personal"
  //                                       ? true
  //                                       : folder.folderName === "FormC Documents" ? true : false
  //                                   }
  //                                 >
  //                                   <FontAwesomeIcon icon={faTrash} />
  //                                 </Button>
  //                               </div>
  //                             </Card.Body>
  //                           </Card>
  //                         </Col>
  //                       );
  //                     })}
  //                 </>
  //               )}

  //               {/* Files */}
  //               {[...files]
  //                 .sort((a, b) => {
  //                   const aStartsWithNumber = /^\d+/.test(a.fileName);
  //                   const bStartsWithNumber = /^\d+/.test(b.fileName);

  //                   if (sortOption === "nameAsc") {
  //                     if (aStartsWithNumber && !bStartsWithNumber) return -1;
  //                     if (!aStartsWithNumber && bStartsWithNumber) return 1;

  //                     return a.fileName.localeCompare(b.fileName, undefined, {
  //                       numeric: true,
  //                       sensitivity: "base",
  //                     });
  //                   }

  //                   if (sortOption === "nameDesc") {
  //                     if (aStartsWithNumber && !bStartsWithNumber) return 1;
  //                     if (!aStartsWithNumber && bStartsWithNumber) return -1;

  //                     return b.fileName.localeCompare(a.fileName, undefined, {
  //                       numeric: true,
  //                       sensitivity: "base",
  //                     });
  //                   }

  //                   if (sortOption === "createdAsc") {
  //                     return new Date(a.uploadedAt) - new Date(b.uploadedAt);
  //                   }

  //                   if (sortOption === "createdDesc") {
  //                     return new Date(b.uploadedAt) - new Date(a.uploadedAt);
  //                   }

  //                   return 0;
  //                 })
  //                 .map((file, index) => (
  //                   <Col
  //                     key={index}
  //                     sm={viewMode === "grid" ? 6 : 12}
  //                     md={viewMode === "grid" ? 4 : 12}
  //                     lg={viewMode === "grid" ? 3 : 12}
  //                   >
  //                     <Card
  //                       className="p-2"
  //                       style={{
  //                         background: "#18273e",
  //                         border: "1px solid white",
  //                         display: "flex",
  //                         flexDirection: viewMode === "list" ? "row" : "column",
  //                         alignItems: viewMode === "list" ? "center" : "flex-start",
  //                         transition: "transform 0.2s, box-shadow 0.2s",
  //                       }}
  //                       onMouseEnter={(e) => {
  //                         if (viewMode === "grid") {
  //                           e.currentTarget.style.transform = "scale(1.05)";
  //                           e.currentTarget.style.boxShadow =
  //                             "0px 4px 10px rgba(0, 0, 0, 0.8)";
  //                         }
  //                       }}
  //                       onMouseLeave={(e) => {
  //                         if (viewMode === "grid") {
  //                           e.currentTarget.style.transform = "scale(1)";
  //                           e.currentTarget.style.boxShadow = "none";
  //                         }
  //                       }}
  //                     >

  //                       <div className="d-flex gap-2 align-items-center" style={{ width: "100%" }}>

  //                         <FontAwesomeIcon
  //                           icon={getFileTypeIcon(file.fileName)}
  //                           size="2x"
  //                           className="mb-2"
  //                           style={{
  //                             color: "#d3b386",
  //                             marginRight: viewMode === "list" ? "10px" : "0",
  //                           }}
  //                         />
  //                         <div
  //                           style={{
  //                             fontSize: "0.9rem",
  //                             color: "white",
  //                             overflow: "hidden",
  //                             textOverflow: "ellipsis",
  //                             whiteSpace: "nowrap",
  //                             width: "100%",
  //                           }}
  //                         >
  //                           {file.fileName}
  //                         </div>

  //                       </div>
  //                       <Card.Body
  //                         className="p-1 d-flex justify-content-between align-items-center"
  //                         style={{ width: "100%" }}
  //                       >
  //                         <div
  //                           className="d-flex gap-2 justify-content-end"
  //                           style={{ width: "100%" }}
  //                         >
  //                           {(!IsPersonal && !FormCDetails) && (
  //                             <>
  //                               <Button
  //                                 variant="danger"
  //                                 size="sm"
  //                                 onClick={(e) => {
  //                                   e.stopPropagation();
  //                                   openFileEditModal(file);
  //                                 }}
  //                                 style={{
  //                                   background: "#ebbf46",
  //                                   border: "none",
  //                                   padding: "0.25rem 0.5rem",
  //                                 }}
  //                               >
  //                                 <FontAwesomeIcon icon={faEdit} />
  //                               </Button>
  //                               <Button
  //                                 variant="success"
  //                                 size="sm"
  //                                 onClick={(e) => {
  //                                   e.stopPropagation();
  //                                   setMoveFileId(file._id);
  //                                   openMoveModal(selectedFolder);
  //                                 }}
  //                                 style={{
  //                                   background: "#007bff",
  //                                   border: "none",
  //                                   padding: "0.25rem 0.5rem",
  //                                 }}
  //                               >
  //                                 <img
  //                                   src={movefolder}
  //                                   alt="Move Folder"
  //                                   style={{ width: "18px", height: "18px" }}
  //                                 />
  //                               </Button>
  //                             </>
  //                           )}
  //                           <Button
  //                             variant="success"
  //                             size="sm"
  //                             onClick={() => handleDownload(file._id, file.fileName)}
  //                             style={{
  //                               background: "#28a745",
  //                               border: "none",
  //                               padding: "0.25rem 0.5rem",
  //                             }}
  //                           >
  //                             <FontAwesomeIcon icon={faDownload} />
  //                           </Button>
  //                           {(!IsPersonal && !FormCDetails) && (
  //                             <Button
  //                               variant="danger"
  //                               size="sm"
  //                               onClick={() => {
  //                                 setDeletefileId(file._id);
  //                                 setIsdelete(true);
  //                               }}
  //                               style={{
  //                                 background: "#dc3545",
  //                                 border: "none",
  //                                 padding: "0.25rem 0.5rem",
  //                               }}
  //                             >
  //                               <FontAwesomeIcon icon={faTrash} />
  //                             </Button>
  //                           )}
  //                         </div>
  //                       </Card.Body>
  //                     </Card>
  //                   </Col>
  //                 ))}

  //               {!folderList?.length && !files?.length && (
  //                 <Col xs={12}>
  //                   <div className="text-center text-black py-5">
  //                     No folders or files available.
  //                   </div>
  //                 </Col>
  //               )}
  //             </Row>
  //           </Card.Body>
  //         </div>
  //       </Card.Body>
  //     </Card>
  //     <MoveFolderModal
  //       show={showMoveModal}
  //       onClose={closeMoveModal}
  //       folder={folderToMove !== null ? folderToMove : Mainfolder}
  //       allFolders={folderList} // array of all folders you have
  //       onMove={moveFileId !== null ? handlefileMove : handleMoveFolder}
  //     />

  //     <DragAndDrop
  //       showModal={showUploadModal}
  //       onHide={onHide}
  //       handleFileChange={handleFileChange}
  //       uploading={uploading}
  //       uploadSuccess={uploadSuccess}
  //       selectedFiles={selectedFiles}
  //       handleFileUpload={handleFileUpload}
  //       errorMessage={errorMessage}
  //     />

  //     {/* Create/Edit Folder Modal */}
  //     <Modal show={showModal} onHide={() => setShowModal(false)} centered>
  //       <Modal.Header closeButton>
  //         <Modal.Title>
  //           {isEditMode ? "Edit Folder" : "Create New Folder"}
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Form>
  //           <Form.Group className="mb-3">
  //             <Form.Label>Folder Name</Form.Label>
  //             <Form.Control
  //               type="text"
  //               placeholder="Enter folder name"
  //               value={newFolderName}
  //               onChange={(e) => setNewFolderName(e.target.value)}
  //             />
  //           </Form.Group>
  //         </Form>
  //       </Modal.Body>

  //       <Modal.Footer className="d-flex justify-content-end">
  //         <Button variant="primary" onClick={() => setShowModal(false)}>
  //           Cancel
  //         </Button>
  //         <Button
  //           variant="primary"
  //           onClick={isEditMode ? handleUpdateFolder : handleCreateFolder}
  //         >
  //           {isEditMode ? "Update" : "Create"}
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>

  //     <Modal
  //       show={showFileModal}
  //       onHide={() => setShowFileModal(false)}
  //       centered
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title>
  //           {isEditMode ? "Edit File" : "Create New FIle"}
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Form>
  //           <Form.Group className="mb-3">
  //             <Form.Label>File Name</Form.Label>
  //             <Form.Control
  //               type="text"
  //               placeholder="Enter File name"
  //               value={newFileName}
  //               maxLength={40} // ✅ character limit
  //               onChange={(e) => {
  //                 const value = e.target.value;
  //                 // ✅ sirf alphabets, numbers, and space allow karo
  //                 const filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
  //                 setNewFileName(filteredValue);
  //               }}
  //             />
  //             <div
  //               style={{
  //                 fontSize: "0.8rem",
  //                 color: "#888",
  //                 textAlign: "right",
  //               }}
  //             >
  //               {newFileName?.length}/40
  //             </div>
  //           </Form.Group>
  //         </Form>
  //       </Modal.Body>
  //       <Modal.Footer className="d-flex justify-content-end">
  //         <Button variant="primary" onClick={() => setShowFileModal(false)}>
  //           Cancel
  //         </Button>
  //         <Button variant="primary" onClick={handleUpdateFileName}>
  //           {isEditMode ? "Update" : "Create"}
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>

  //     <Modal show={Isdelete} onHide={() => setIsdelete(false)} centered>
  //       <Modal.Header closeButton>
  //         <Modal.Title>File Delete</Modal.Title>
  //       </Modal.Header>

  //       <Modal.Body className="text-center">
  //         <p className="fs-5">Are you sure you want to delete this file?</p>
  //       </Modal.Body>

  //       <Modal.Footer className="d-flex justify-content-end">
  //         <Button variant="secondary" onClick={() => setIsdelete(false)}>
  //           Cancel
  //         </Button>
  //         <Button
  //           variant="danger"
  //           onClick={() => handleFileDelete(deletefileid)}
  //         >
  //           Delete
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>

  //     <Modal
  //       show={Isfolderdelete}
  //       onHide={() => setIsfolderdelete(false)}
  //       centered
  //     >
  //       <Modal.Header closeButton>
  //         <Modal.Title>Folder Delete</Modal.Title>
  //       </Modal.Header>

  //       <Modal.Body className="text-center">
  //         <p className="fs-5">Are you sure you want to delete this folder?</p>
  //       </Modal.Body>

  //       <Modal.Footer className="d-flex justify-content-end">
  //         <Button variant="secondary" onClick={() => setIsfolderdelete(false)}>
  //           Cancel
  //         </Button>
  //         <Button
  //           variant="danger"
  //           onClick={() => handleDeleteFolder(deletefolderid)}
  //         >
  //           Delete
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>

  //     <ErrorModal
  //       show={showError}
  //       handleClose={() => setShowError(false)}
  //       message={message}
  //     />
  //   </div>
  // );
  {
    /* PathSegment component for better reusability */
  }
  const PathSegment = ({ folder, onClick }) => (
    <span
      className="text-primary hover-underline cursor-pointer text-truncate"
      style={{ maxWidth: "50px" }}
      onClick={onClick}
      title={folder?.folderName}
    >
      {folder?.folderName}
    </span>
  );

  const handlePathClick = (index) => {
    const newPath = folderPath.slice(0, index + 1);
    const folder = folderPath[index];
    setFolderPath(newPath);
    setSelectedFolder(folder);
    fetchsubFolders(folder?._id);
  };

  return (
    <div
      className="card container-fluid px-0 p-0 d-flex flex-column"
      style={{ minHeight: "86vh", maxHeight: "86vh" }}
    >
      <Card className="flex-grow-1 d-flex flex-column h-100">
        <Card.Body className="flex-grow-1 d-flex flex-column p-0">
          <div className="h-100 d-flex flex-column">
            {/* Header Section */}
            <Card.Header
              className="p-2 p-md-3 text-white border-bottom"
              style={{ backgroundColor: "#18273e" }}
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                {/* Left Section - PC-style Path Field */}
                <div className="d-flex align-items-center flex-grow-1 min-width-0">
                  <div
                    className="bg-white text-dark px-3 py-1 rounded d-flex align-items-center gap-1"
                    style={{
                      fontSize: "0.85rem",
                      width: "100%",
                      maxWidth: "600px",
                      minWidth: "100px",
                      height: "32px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Root Folder Button (inside path field) */}
                    <Button
                      variant="link"
                      size="sm"
                      onClick={async () => {
                        //   await fetchCases();
                        if (FormHDetailsInfo && litigationform && IsFormH) {
                          setIsFormH(false)
                          dispatch(FormHDetails(null));
                          dispatch(LitigationFormH(null));
                        }

                        await setSelectedFolder(null);
                        setFolderPath([]);
                        fetchFolders();
                        setIsPersonal(false);
                      }}
                      className="p-0 text-decoration-none"
                      aria-label="Back to root"
                    >
                      <FontAwesomeIcon
                        icon={faFolder}
                        size="1x"
                        className="me-2 flex-shrink-0"
                        style={{ color: "#d3b386" }}
                      />
                    </Button>

                    {/* Folder Path with smart truncation */}
                    {folderPath.length > 0 && (
                      <div
                        className="d-flex align-items-center min-width-0"
                        style={{ overflow: "hidden" }}
                      >
                        {folderPath.length > 3 ? (
                          <>
                            <PathSegment
                              folder={folderPath[0]}
                              onClick={() => handlePathClick(0)}
                            />
                            <span className="text-muted mx-1">...</span>
                            {folderPath.slice(-2).map((folder, index) => (
                              <React.Fragment key={folder?._id}>
                                <FontAwesomeIcon
                                  icon={faChevronRight}
                                  className="fs-12 text-muted mx-1"
                                />
                                <PathSegment
                                  folder={folder}
                                  onClick={() =>
                                    handlePathClick(folderPath.indexOf(folder))
                                  }
                                />
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          folderPath.map((folder, index) => (
                            <React.Fragment key={folder?._id}>
                              {index > 0 && (
                                <FontAwesomeIcon
                                  icon={faChevronRight}
                                  className="fs-12 text-muted mx-1"
                                />
                              )}
                              <PathSegment
                                folder={folder}
                                onClick={() => handlePathClick(index)}
                              />
                            </React.Fragment>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section - Action Buttons */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  {!IsPersonal && !FormCDetails && (
                    <div className="d-flex align-items-center gap-2">
                      {token?.Role != "client" &&
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => setShowUploadModal(true)}
                          className="d-inline-flex align-items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faUpload} />
                          <span className="d-none d-md-inline">Upload</span>
                        </Button>
                      }
                    </div>
                  )}
                  {!IsPersonal && !FormCDetails && (
                    <div className="d-flex align-items-center gap-2">
                      {token?.Role != "client" &&
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => {
                            setNewFolderName("");
                            setIsEditMode(false);
                            setShowModal(true);
                          }}
                          className="d-inline-flex align-items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          <span className="d-none d-md-inline">New</span>
                        </Button>
                      }
                    </div>
                  )}

                  <Dropdown>
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="d-inline-flex align-items-center gap-1 w-100"
                    >
                      <FontAwesomeIcon icon={faList} />
                      <span className="d-none d-md-inline">View</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow-sm">
                      <Dropdown.Item onClick={() => setViewMode("grid")}>
                        <FontAwesomeIcon icon={faThLarge} className="me-2" />
                        Grid View
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setViewMode("list")}>
                        <FontAwesomeIcon icon={faListUl} className="me-2" />
                        List View
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <div
                    className="input-group input-group-sm"
                    style={{ width: "160px" }}
                  >
                    <span className="input-group-text bg-white border-end-0 pe-1">
                      <FontAwesomeIcon icon={faSort} className="text-muted" />
                    </span>
                    <select
                      className="form-select border-start-0 ps-1 shadow-none"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="nameAsc">Name (A-Z)</option>
                      <option value="nameDesc">Name (Z-A)</option>
                      <option value="createdAsc">Oldest first</option>
                      <option value="createdDesc">Newest first</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card.Header>

            {/* Main Content Area */}
            <Card.Body
              className="overflow-auto flex-grow-1 p-2 p-md-3"
              style={{ maxHeight: "calc(86vh - 100px)" }}
            >
              <Row
                className={`g-2 ${viewMode === "list" ? "flex-column" : ""}`}
                style={{
                  height: "100%",
                  overflow: "visible",
                }}
              >
                {/* Folders */}
                {!IsPersonal && (
                  <>
                    {[...folderList]
                      .sort((a, b) => {
                        const aStartsWithNumber = /^\d+/.test(a?.folderName);
                        const bStartsWithNumber = /^\d+/.test(b?.folderName);

                        if (sortOption === "nameAsc") {
                          if (aStartsWithNumber && !bStartsWithNumber)
                            return -1;
                          if (!aStartsWithNumber && bStartsWithNumber) return 1;
                          return a?.folderName.localeCompare(
                            b?.folderName,
                            undefined,
                            {
                              numeric: true,
                              sensitivity: "base",
                            }
                          );
                        }

                        if (sortOption === "nameDesc") {
                          if (aStartsWithNumber && !bStartsWithNumber) return 1;
                          if (!aStartsWithNumber && bStartsWithNumber)
                            return -1;
                          return b?.folderName.localeCompare(
                            a?.folderName,
                            undefined,
                            {
                              numeric: true,
                              sensitivity: "base",
                            }
                          );
                        }

                        if (sortOption === "createdAsc") {
                          return new Date(a.createdAt) - new Date(b.createdAt);
                        }

                        if (sortOption === "createdDesc") {
                          return new Date(b.createdAt) - new Date(a.createdAt);
                        }

                        return 0;
                      })
                      ?.map((folder) => (
                        <Col
                          key={folder?._id}
                          xs={6}
                          sm={viewMode === "grid" ? 6 : 12}
                          md={viewMode === "grid" ? 4 : 12}
                          lg={viewMode === "grid" ? 3 : 12}
                          xl={viewMode === "grid" ? 2 : 12}
                          className="mb-2 d-flex col-12 col-md-auto"
                        >
                          <Card
                            className={`flex-grow-1 d-flex flex-column ${viewMode === "grid" ? "grid-card" : "list-card"
                              }`}
                            style={{
                              background: "#18273e",
                              border: "1px solid white",
                              cursor: "pointer",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              minHeight: viewMode === "grid" ? "100px" : "auto",
                              // Ensure full width of column
                            }}
                            onClick={() => {
                              if (selectedFolder?._id === folder?._id) return; 

                              if (folder?.folderName === "Personal") {
                                fetchClientDocuments();
                              } else if (
                                folder?.folderName === "FormC Documents" ||
                                folder?.folderName === "Form H Documents"
                              ) {
                                fetchFormCfile(folder?.folderName);
                              } else {
                                fetchsubFolders(folder?._id);
                              }

                              setSelectedFolder(folder);
                              setFolderPath((prevPath) => [...prevPath, folder]);
                            }}


                            onMouseEnter={(e) =>
                              viewMode === "grid" &&
                              e.currentTarget.classList.add("card-hover")
                            }
                            onMouseLeave={(e) =>
                              viewMode === "grid" &&
                              e.currentTarget.classList.remove("card-hover")
                            }
                          >
                            <div className="d-flex flex-column h-100 p-2 ">
                              {/* Folder Icon and Name */}
                              <div className="d-flex align-items-center flex-grow-1">
                                <FontAwesomeIcon
                                  icon={faFolder}
                                  size="2x"
                                  className="me-2 flex-shrink-0"
                                  style={{ color: "#d3b386", minWidth: "32px" }}
                                />
                                <div
                                  className="flex-grow-1"
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    minWidth: 0,
                                  }}
                                >
                                  {/* <div
                                    className="text-white"
                                    style={{
                                      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                    title={folder?.folderName}
                                  >
                                    {folder.folderName.length > 30
                                      ? folder?.folderName.slice(0, 27) + "..."
                                      : folder?.folderName}
                                  </div> */}

                                  <div
                                    className="text-white"
                                    style={{
                                      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                                      whiteSpace: "normal", // allow wrapping
                                      wordBreak: "break-word", // break long words if needed
                                      overflow: "hidden",
                                      maxHeight: "3em", // restrict height to ~2 lines
                                      lineHeight: "1.4em",
                                    }}
                                    title={folder?.folderName}
                                  >
                                    {folder?.folderName}
                                  </div>
                                </div>
                              </div>
                              {token?.Role != "client" &&
                                < div className="mt-auto pt-2">
                                  <div className="d-flex justify-content-end gap-1 gap-sm-2 flex-wrap">
                                    <Button
                                      variant="success"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center"
                                      style={{
                                        background: "#ebbf46",
                                        border: "none",
                                        width: "36px",
                                        height: "36px",
                                        flexShrink: 0,
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(folder);
                                      }}
                                      disabled={
                                        folder?.folderName === "Personal" ||
                                        folder?.folderName === "FormC Documents"
                                      }
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                    <Button
                                      variant="success"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center"
                                      style={{
                                        background: "#007bff",
                                        border: "none",
                                        width: "36px",
                                        height: "36px",
                                        flexShrink: 0,
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openMoveModal(folder);
                                      }}
                                      disabled={
                                        folder?.folderName === "Personal" ||
                                        folder?.folderName === "FormC Documents"
                                      }
                                    >
                                      <img
                                        src={movefolder}
                                        alt="Move Folder"
                                        style={{ width: "18px", height: "18px" }}
                                      />
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      className="d-flex align-items-center justify-content-center"
                                      style={{
                                        background: "#dc3545",
                                        border: "none",
                                        width: "36px",
                                        height: "36px",
                                        flexShrink: 0,
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletefolderId(folder?._id);
                                        setIsfolderdelete(true);
                                      }}
                                      disabled={
                                        folder?.folderName === "Personal" ||
                                        folder?.folderName === "FormC Documents"
                                      }
                                    >
                                      <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                  </div>
                                </div>
                              }
                            </div>
                          </Card>
                        </Col>
                      ))}
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
                      xs={6}
                      sm={viewMode === "grid" ? 6 : 12}
                      md={viewMode === "grid" ? 4 : 12}
                      lg={viewMode === "grid" ? 3 : 12}
                      xl={viewMode === "grid" ? 2 : 12}
                      className="mb-2 d-flex"
                    >
                      <Card
                        className={`flex-grow-1 d-flex flex-column ${viewMode === "grid" ? "grid-card" : "list-card"
                          }`}
                        style={{
                          background: "#18273e",
                          border: "1px solid white",
                          minHeight: viewMode === "grid" ? "180px" : "auto",
                          width: "100%", // Ensure full width of column
                        }}
                      >
                        <div className="d-flex flex-column h-100 p-2">
                          <div className="d-flex align-items-center flex-grow-1">
                            <FontAwesomeIcon
                              icon={getFileTypeIcon(file.fileName)}
                              size="2x"
                              className="me-2 flex-shrink-0"
                              style={{ color: "#d3b386", minWidth: "32px" }}
                            />
                            <div
                              className="flex-grow-1"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                minWidth: 0,
                              }}
                            >
                              {/* <div
                                className="text-white"
                                style={{
                                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                                }}
                                title={file.fileName}
                              >
                                {file.fileName.length > 15
                                  ? file.fileName.slice(0, 27) + "..."
                                  : file.fileName}
                              </div> */}

                              <div
                                className="text-white"
                                style={{
                                  fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
                                  whiteSpace: "normal",        // allow line wrapping
                                  wordBreak: "break-word",     // prevent layout breaking
                                  overflow: "hidden",
                                  maxHeight: "3em",            // optional: limit to ~2 lines
                                  lineHeight: "1.4em"
                                }}
                                title={file?.fileName}
                              >
                                {file?.fileName}
                              </div>

                            </div>
                          </div>

                          <div className="mt-auto pt-2">
                            <div className="d-flex justify-content-end gap-1 gap-sm-2 flex-wrap">
                              {!IsPersonal && !FormCDetails && token?.Role != "client" && !FormHDetailsInfo && (
                                <>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    className="d-flex align-items-center justify-content-center p-0"
                                    style={{
                                      background: "#ebbf46",
                                      border: "none",
                                      width: "28px",
                                      height: "28px",
                                      flexShrink: 0,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openFileEditModal(file);
                                    }}
                                  >
                                    <FontAwesomeIcon
                                      icon={faEdit}
                                      className="fs-6"
                                    />
                                  </Button>
                                  <Button
                                    variant="success"
                                    size="sm"
                                    className="d-flex align-items-center justify-content-center p-0"
                                    style={{
                                      background: "#007bff",
                                      border: "none",
                                      width: "28px",
                                      height: "28px",
                                      flexShrink: 0,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMoveFileId(file?._id);
                                      setisfile(true)
                                      openMoveModal(selectedFolder);
                                    }}
                                  >
                                    <img
                                      src={movefolder}
                                      alt="Move Folder"
                                      style={{ width: "14px", height: "14px" }}
                                    />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="success"
                                size="sm"
                                className="d-flex align-items-center justify-content-center p-0"
                                style={{
                                  background: "#28a745",
                                  border: "none",
                                  width: "28px",
                                  height: "28px",
                                  flexShrink: 0,
                                }}
                                onClick={() =>
                                  handleDownload(file?._id, file?.fileName, file?.filePath)
                                }
                              >
                                <FontAwesomeIcon
                                  icon={faDownload}
                                  className="fs-6"
                                />
                              </Button>
                              {!IsPersonal && !FormCDetails && token?.Role != "client" && !FormHDetailsInfo && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  className="d-flex align-items-center justify-content-center p-0"
                                  style={{
                                    background: "#dc3545",
                                    border: "none",
                                    width: "28px",
                                    height: "28px",
                                    flexShrink: 0,
                                  }}
                                  onClick={() => {
                                    setDeletefileId(file?._id);
                                    setIsdelete(true);
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faTrash}
                                    className="fs-6"
                                  />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
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
        </Card.Body >
      </Card >
      <MoveFolderModal
        show={showMoveModal}
        onClose={closeMoveModal}
        folder={folderToMove !== null ? folderToMove : Mainfolder}
        allFolders={folderList} // array of all folders you have
        isfile={isfile}
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
        assignlawyer={assignlawyer}
        token={token}
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

        <Modal.Footer className="d-flex justify-content-center gap-2">
          <Button variant="primary" onClick={() => setShowModal(false)}>
            <FontAwesomeIcon icon={faTimes} />
            <span className="d-none d-sm-inline ms-1">Cancel</span>
          </Button>

          <Button
            variant="primary"
            onClick={isEditMode ? handleUpdateFolder : handleCreateFolder}
          >
            <FontAwesomeIcon icon={isEditMode ? faPen : faPlus} />
            <span className="d-none d-sm-inline ms-1">
              {isEditMode ? "Update" : "Create"}
            </span>
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
        <Modal.Footer className="d-flex justify-content-center gap-2">
          <Button variant="primary" onClick={() => setShowFileModal(false)}>
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            <span className="d-none d-sm-inline">Cancel</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleUpdateFileName}
          //onClick={isEditMode ? handleUpdateFolder : handleCreateFolder}
          >
            <FontAwesomeIcon
              icon={isEditMode ? faPen : faPlus}
              className="me-1"
            />
            <span className="d-none d-sm-inline">
              {isEditMode ? "Update" : "Create"}
            </span>
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

        <Modal.Footer className="d-flex justify-content-center gap-2">
          <Button variant="secondary" onClick={() => setIsdelete(false)}>
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            <span className="d-none d-sm-inline">Cancel</span>
          </Button>

          <Button
            variant="danger"
            onClick={() => handleFileDelete(deletefileid)}
          >
            <FontAwesomeIcon icon={faTrash} className="me-1" />
            <span className="d-none d-sm-inline">Delete</span>
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

        <Modal.Footer className="d-flex justify-content-center gap-2">
          <Button variant="secondary" onClick={() => setIsfolderdelete(false)}>
            <FontAwesomeIcon icon={faTimes} className="me-1" />
            <span className="d-none d-sm-inline">Cancel</span>
          </Button>

          <Button
            variant="danger"
            onClick={() => handleDeleteFolder(deletefolderid)}
          >
            <FontAwesomeIcon icon={faTrash} className="me-1" />
            <span className="d-none d-sm-inline">Delete</span>
          </Button>
        </Modal.Footer>
      </Modal>

      <ErrorModal
        show={showError}
        handleClose={() => setShowError(false)}
        message={message}
      />
    </div >
  );
};

export default ViewFolder;
