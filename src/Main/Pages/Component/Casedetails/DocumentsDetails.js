import React, { useState } from "react";
import ViewDocumentsModal from "./DocumentViewers/ViewDocumentsModal";

const DocumentsDetails = ({ caseData }) => {
    const [expandedDocument, setExpandedDocument] = useState(null);
    const documents = caseData?.Documents;
    const [showDocModal, setShowDocModal] = useState(false);
    if (!documents) return <p>No document details available.</p>;

    const toggleExpand = (docId) => {
        setExpandedDocument(expandedDocument === docId ? null : docId);
    };

    const handleViewDocument = (document) => {
        console.log("View Document:", document);
        // Add your view logic here (e.g. open modal or navigate to doc)
    };

    const handleAddDocument = () => {
        console.log("Add Document button clicked");
        setShowDocModal(true)
        // Add your logic to add a new document (e.g. open form/modal)
    };

    return (
        <div className="overflow-x-auto mt-6">
            <div className="d-flex items-center justify-content-between mb-4">
                <h5 className="text-lg font-semibold">Documents</h5>
                <button
                    onClick={handleAddDocument}
                    className="text-white px-3 py-1 rounded"
                    style={{ backgroundColor: '#18273e' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#d3b386";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#18273e'
                    }}
                >
                    View Document
                </button>
            </div>

            <ViewDocumentsModal
                show={showDocModal}
                onHide={() => setShowDocModal(false)}
                caseData={caseData}
            />


            <table className="table-auto w-full border border-gray-400">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {documents?.header?.map((header, index) => (
                            <th key={index} className="border border-gray-400 p-2">{header}</th>
                        ))}
                        <th className="border border-gray-400 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents?.body?.map((document) => (
                        <React.Fragment key={document._id}>
                            <tr className="hover:bg-gray-100">
                                <td className="p-2">{document.Detailed_Description || "N/A"}</td>
                                <td className="p-2">{document.Session_Date || "N/A"}</td>
                                <td className="p-2">{document.Attachment_Date || "N/A"}</td>
                                <td
                                    className="p-2 text-blue-600 hover:underline cursor-pointer"
                                    onClick={() => toggleExpand(document._id)}
                                >
                                    {expandedDocument === document._id ? "Submitter ▲" : "Submitter ▼"}
                                </td>
                                <td className="p-2">{document.Attachment || "No Attachment"}</td>
                                {/* <td className="p-2">
                                    <button
                                        onClick={() => handleViewDocument(document)}
                                        className=" text-white px-3 py-1 rounded"
                                        style={{ backgroundColor: '#18273e' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = "#d3b386";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#18273e'
                                        }}

                                    >

                                        View Document
                                    </button>
                                </td> */}
                            </tr>
                            {expandedDocument === document._id && (
                                <tr>
                                    <td colSpan="6" className="p-2 bg-gray-100">
                                        <p><strong>Party Name:</strong> {document.Party_Name?.submitter?.PartyName || "N/A"}</p>
                                        <p><strong>Party Type:</strong> {document.Party_Name?.submitter?.PartyType || "N/A"}</p>
                                        <p><strong>ID:</strong> {document.Party_Name?.submitter?._id || "N/A"}</p>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentsDetails;
