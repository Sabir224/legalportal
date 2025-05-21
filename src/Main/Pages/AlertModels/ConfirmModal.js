// ConfirmModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title || "Confirm Action"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message || "Are you sure you want to proceed?"}</p>
            </Modal.Body>
            <div className='d-flex justify-content-center'>
                <Modal.Footer>

                    <Button variant="secondary" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
