import { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const ErrorModal = ({ show, handleClose, message }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer); // Cleanup
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message || "Something went wrong. Please try again."}</p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
