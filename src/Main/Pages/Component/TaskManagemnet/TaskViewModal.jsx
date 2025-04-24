import React from "react";
import { Modal, Button } from "react-bootstrap";

const TaskViewModal = ({ show, handleClose, task }) => {
    if (!task) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Task Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Case Number:</strong> {task?.caseId?.CaseNumber}</p>
                <p><strong>Title:</strong> {task?.title}</p>
                <p><strong>Due Date:</strong> {task?.dueDate}</p>
                <p><strong>Status:</strong> {task?.status}</p>
                <p><strong>Description:</strong> {task?.description || "No description provided."}</p>
                <p><strong>Task Assign to :</strong> {task?.assignedUsers[0]?.UserName}</p>
                <p><strong>Task Create By:</strong> {task?.createdBy?.UserName}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskViewModal;
