import { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const SuccessModal = ({ show, handleClose, message }) => {
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
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Success</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message || "Operation completed successfully."}</p>
      </Modal.Body>
      <div className='d-flex justify-content-center'>

      <Modal.Footer>
        <Button variant="success" onClick={handleClose}>
          Okay
        </Button>
      </Modal.Footer>
      </div>
    </Modal>
  );
};

export default SuccessModal;
