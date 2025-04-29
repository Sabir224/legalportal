// import React from "react";
// import { Modal, Button } from "react-bootstrap";

// const TaskViewModal = ({ show, handleClose, task }) => {
//     if (!task) return null;

//     return (
//         <Modal show={show} onHide={handleClose} centered>
//             <Modal.Header closeButton>
//                 <Modal.Title>Task Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <p><strong>Case Number:</strong> {task?.caseId?.CaseNumber}</p>
//                 <p><strong>Title:</strong> {task?.title}</p>
//                 <p><strong>Due Date:</strong> {task?.dueDate}</p>
//                 <p><strong>Status:</strong> {task?.status}</p>
//                 <p><strong>Description:</strong> {task?.description || "No description provided."}</p>
//                 <p><strong>Task Assign to :</strong> {task?.assignedUsers[0]?.UserName}</p>
//                 <p><strong>Task Create By:</strong> {task?.createdBy?.UserName}</p>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>
//                     Close
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default TaskViewModal;



import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TaskViewModal = ({ task, handleSave, handleClose }) => {
    const [editableTask, setEditableTask] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (task) {
            setEditableTask({ ...task });
        }
    }, [task]);

    const handleChange = (field, value) => {
        setEditableTask((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleEditClick = () => setIsEditMode(true);
    const handleCancelClick = () => setIsEditMode(false);

    const handleSubmit = () => {
        if (handleSave && editableTask) {
            handleSave(editableTask);
            setIsEditMode(false);
        }
    };

    const Close = () => {
        // navigate(-1);
        handleClose() // Go back
    };

    if (!editableTask) return <p>Loading task...</p>;

    return (
        <Container className="mt-4">
            <Card >
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Task {isEditMode ? "Edit" : "Details"}</h4>
                    <div>
                        {!isEditMode && (
                            <Button variant="warning" onClick={handleEditClick} className="me-2">
                                Edit
                            </Button>
                        )}
                        {isEditMode && (
                            <Button variant="secondary" onClick={handleCancelClick} className="me-2">
                                Cancel
                            </Button>
                        )}
                        <Button variant="dark" onClick={handleClose}>
                            Close
                        </Button>

                    </div>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Case Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editableTask.caseId?.CaseNumber || ""}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editableTask.title || ""}
                                        readOnly={!isEditMode}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Due Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={editableTask.dueDate?.split("T")[0] || ""}
                                        readOnly={!isEditMode}
                                        onChange={(e) => handleChange("dueDate", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    {isEditMode ? (
                                        <Form.Select
                                            value={editableTask.status || ""}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Overdue">Overdue</option>
                                        </Form.Select>
                                    ) : (
                                        <Form.Control type="text" value={editableTask.status} readOnly />
                                    )}
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={editableTask.description || ""}
                                        readOnly={!isEditMode}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assigned To</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editableTask.assignedUsers?.[0]?.UserName || ""}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Created By</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editableTask.createdBy?.UserName || ""}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {isEditMode && (
                            <div className="text-end">
                                <Button variant="primary" onClick={handleSubmit}>
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default TaskViewModal;
