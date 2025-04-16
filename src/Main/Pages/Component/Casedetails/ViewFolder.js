import { useEffect, useState } from "react";
import {
    Button,
    Card,
    Col,
    Modal,
    Form,
    Row,
} from "react-bootstrap";
import { ApiEndPoint } from "../utils/utlis";
import { useSelector } from "react-redux";
import axios from "axios";
import ViewDocumentsAndAdd from "./ViewDocumentsAndAdd";
import { BsPen, BsTrash } from "react-icons/bs";

const ViewFolder = ({ token }) => {
    const [folderList, setFolderList] = useState([]);
    const caseInfo = useSelector((state) => state.screen.Caseinfo);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editFolderId, setEditFolderId] = useState(null);
    const [error, setError] = useState(null);

    const [hoveredBtn, setHoveredBtn] = useState(null);

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
        try {
            // Make GET request to fetch folders by caseId
            const response = await fetch(`${ApiEndPoint}getFolders/${caseInfo._id}`);

            if (!response.ok) {
                throw new Error('Error fetching folders');
            }

            const data = await response.json();
            setFolderList(data);  // Set the folders state with the response data
        } catch (err) {
            setError(err.message);  // Set error message if any
        }
    };
    const handleCreateFolder = async () => {
        // const trimmedName = newFolderName.trim();
        // if (!trimmedName) return;
        // const isDuplicate = folderList.some(
        //     (folder) => folder.name.toLowerCase() === trimmedName.toLowerCase()
        // );
        // if (isDuplicate) {
        //     alert("A folder with this name already exists.");
        //     return;
        // }
        // const newFolder = {
        //     id: folderList.length + 1,
        //     name: trimmedName,
        //     details: `This is ${trimmedName}'s details.`,
        // };
        // setFolderList([...folderList, newFolder]);
        // setNewFolderName("");
        // setShowModal(false);

        let caseData = {
            "caseId": caseInfo._id,
            "folderName": newFolderName,
        };

        try {
            const response = await axios.post(`${ApiEndPoint}CreateFolder`, caseData);
            console.log('Folder Create added successfully:', response.data);
            fetchFolders()
            // dispatch(screenChange(9)); // Use it if needed
            alert("✅ Folder Added Successfully!");
        } catch (error) {
            if (error.response) {
                // Handle known API errors (e.g., duplicate folder name)
                console.error('API error:', error.response);
                if (error.response.status === 409) {
                    // 409: Conflict - Folder name already exists
                    alert("❌ Folder with the same name already exists for this case.");
                } else {
                    alert(`❌ Error: ${error.response.data.message || 'Something went wrong'}`);
                }
            } else {
                // Handle network or server errors
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

    return (
        // <div className="container-fluid p-3" style={{ height: "86vh" }}>
        //     <Card className="h-100">
        //         <Card.Body className="d-flex flex-column h-100">
        //             <Row className="flex-grow-1">
        <div className="container-fluid ms-1 d-flex flex-column mr-3 ml-3 p-0" style={{ minHeight: "80vh" }}>
            <Card className="flex-grow-1 d-flex flex-column">
                <Card.Body className="flex-grow-1 d-flex flex-column">
                    <div className="h-100">
                        {/* Header */}
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                {selectedFolder && (
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={() => setSelectedFolder(null)}
                                        style={{ fontSize: "1.2rem", lineHeight: "1", padding: "0 8px" }}
                                        title="Back"
                                    >
                                        ←
                                    </Button>
                                )}
                                <h5 className="mb-0">
                                    {selectedFolder ? selectedFolder.folderName : "Folders"}
                                </h5>
                            </div>
                            {!selectedFolder && (
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
                            )}
                        </Card.Header>

                        {/* Body */}
                        <Card.Body className="overflow-auto" style={{ maxHeight: "70vh" }}>
                            {!selectedFolder ? (
                                folderList.map((folder) => {
                                    const editKey = `edit-${folder._id}`;
                                    const deleteKey = `delete-${folder._id}`;

                                    return (
                                        <Card
                                            key={folder?._id}
                                            className={`mb-2 ${selectedFolder?._id === folder?._id ? "border-primary" : ""}`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Card.Body className="py-2 px-3">
                                                <div
                                                    onClick={() => setSelectedFolder(folder)}
                                                    className="d-flex justify-content-between align-items-center"
                                                >
                                                    <div>{folder?.folderName}</div>
                                                    <div className="d-flex gap-2">
                                                        <Button
                                                            variant="outline-secondary"
                                                            size="sm"
                                                            style={hoveredBtn === editKey ? hoverStyle : baseStyle}
                                                            onMouseEnter={() => setHoveredBtn(editKey)}
                                                            onMouseLeave={() => setHoveredBtn(null)}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(folder);
                                                            }}
                                                        >
                                                            <BsPen />
                                                        </Button>

                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            style={hoveredBtn === deleteKey ? deletehoverStyle : baseStyle}
                                                            onMouseEnter={() => setHoveredBtn(deleteKey)}
                                                            onMouseLeave={() => setHoveredBtn(null)}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteFolder(folder?._id);
                                                            }}
                                                        >
                                                            <BsTrash />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    );
                                })
                            ) : (
                                <ViewDocumentsAndAdd caseData={caseInfo} folderdetails={selectedFolder} />
                            )}
                        </Card.Body>
                    </div>
                </Card.Body>
            </Card>

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
