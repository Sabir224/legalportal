// ViewDocumentsModal.js
import { Modal } from "react-bootstrap";
import ViewDocumentsAndAdd from "../ViewDocumentsAndAdd";

const ViewDocumentsModal = ({ show, onHide,caseData }) => {
    console.log("caseData",caseData)
    return (
        <Modal show={show} onHide={onHide} size="lg"  scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Manage Files & Documents</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ViewDocumentsAndAdd caseData={caseData} />
            </Modal.Body>
        </Modal>
    );
};

export default ViewDocumentsModal;
