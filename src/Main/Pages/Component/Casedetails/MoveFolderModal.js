import { Modal, Button, Form, Card, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ApiEndPoint } from "../utils/utlis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

const MoveFolderModal = ({ show, onClose, folder, allFolders, onMove }) => {
    const [newParentId, setNewParentId] = useState(null);
    const [folderList, setFolderList] = useState(allFolders);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [folderPath, setFolderPath] = useState([]);
    const [loadingFolders, setLoadingFolders] = useState(false);
    const [error, setError] = useState(null);
    const caseInfo = useSelector((state) => state.screen.Caseinfo);

    useEffect(() => {
        if (show && caseInfo?._id) {
            fetchFolders();
            setFolderPath([]);
            setSelectedFolder(null);
        }
    }, [show, caseInfo?._id]);

    const fetchFolders = async () => {
        setLoadingFolders(true);
        setError('');
        try {
            const response = await fetch(`${ApiEndPoint}getFolders/${caseInfo._id}`);
            const data = await response.json();
            setFolderList(Array.isArray(data?.folders) ? data?.folders : []);
        } catch (err) {
            setError(err.message);
            setFolderList([]);
        } finally {
            setLoadingFolders(false);
        }
    };

    const fetchsubFolders = async (parentId) => {
        setLoadingFolders(true);
        setError('');
        try {
            const response = await fetch(`${ApiEndPoint}getSubFolders/${parentId}`);
            const data = await response.json();
            setFolderList(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            setFolderList([]);
        } finally {
            setLoadingFolders(false);
        }
    };

    const handleMove = () => {
        if (folder && onMove) {
            console.log("newparentId", newParentId)
            onMove(folder, selectedFolder || null);
        }
        onClose();
    };

    const handleBackToRoot = async () => {
        setSelectedFolder(null);
        setFolderPath([]);
        setNewParentId(null)
        await fetchFolders();
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Move Folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card.Header className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-2">
                        {/* Breadcrumb navigation */}
                        <div className="d-flex align-items-center">
                            <Button
                                variant="light"
                                size="sm"
                                onClick={handleBackToRoot}
                                style={{ fontSize: "1.2rem", lineHeight: "1", padding: "0 8px" }}
                                title="Back to root"
                            >
                                📁
                            </Button>
                            {folderPath.length > 0 && (
                                <>
                                    <span className="mx-1">/</span>
                                    {folderPath.map((folder, index) => (
                                        <span key={folder._id} className="d-flex align-items-center">
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
                                            {index < folderPath.length - 1 && <span className="mx-1">/</span>}
                                        </span>
                                    ))}
                                </>
                            )}


                        </div>
                    </div>
                </Card.Header>

                <div style={{ marginBottom: "1rem" }}>
                    Moving: <strong>{folder?.folderName}</strong>
                </div>

                <Form.Group controlId="parentFolderSelect">
                    <Form.Label>Select New Parent Folder</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                        {folderList.filter((folderItem) => folderItem?._id !== folder?._id).map((folderItem) => (
                            <Col key={folderItem._id} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    className="p-2"
                                    style={{
                                        background: "#18273e",
                                        border: "1px solid white",
                                        cursor: "pointer",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                    }}
                                    onClick={() => {
                                        fetchsubFolders(folderItem._id);
                                        setSelectedFolder(folderItem);
                                        setFolderPath((prev) => [...prev, folderItem]);
                                        setNewParentId(folderItem._id); // ✅ Important to set where to move
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.8)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <FontAwesomeIcon icon={faFolder} size="2x" className="mb-2" style={{ color: "#d3b386" }} />
                                    <Card.Body className="p-1 d-flex justify-content-between align-items-center" style={{ width: "100%" }}>
                                        <div className="text-truncate" style={{ fontSize: "0.9rem", color: 'white', maxWidth: "70%" }}>
                                            {folderItem.folderName}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}

                        {(!folderList?.length) && (
                            <Col xs={12}>
                                <div className="text-center text-black py-5">
                                    No Folders Available.
                                </div>
                            </Col>
                        )}
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleMove}>
                    Move
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MoveFolderModal;
