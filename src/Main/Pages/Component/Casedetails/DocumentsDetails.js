import React, { useState } from "react";
import ViewDocumentsModal from "./DocumentViewers/ViewDocumentsModal";

const DocumentsDetails = ({ caseData }) => {
    const [expandedDocument, setExpandedDocument] = useState(null);
    const [showDocModal, setShowDocModal] = useState(false);

    const documents = caseData?.Documents;
    if (!documents) return <p>No document details available.</p>;

    const toggleExpand = (docId) => {
        setExpandedDocument(expandedDocument === docId ? null : docId);
    };

    const handleAddDocument = () => {
        setShowDocModal(true);
    };

    const getCellValue = (document, header) => {
        // Map header labels to keys in the document object
        const keyMap = {
            "Detailed Description": "Detailed_Description",
            "Session Date": "Session_Date",
            "Attachment Date": "Attachment_Date",
            "Party Name": "Party_Name",
            "Attachment": "Attachment",
        };

        const value = document?.[keyMap[header]];
        if (typeof value === "object" && value?.submitter) {
            return value.submitter.PartyName || "N/A";
        }

        return value ?? "N/A";
    };

    return (
        <div className="overflow-x-auto mt-6">
            <div className="d-flex items-center justify-content-between mb-4">
                <h5 className="text-lg font-semibold">{documents.heading}</h5>
                <button
                    onClick={handleAddDocument}
                    className="text-white px-3 py-1 rounded"
                    style={{ backgroundColor: '#18273e' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#d3b386";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#18273e';
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
                                {documents.header.map((header, index) => (
                                    <td key={index} className="p-2">
                                        {getCellValue(document, header)}
                                    </td>
                                ))}
                                <td className="p-2 text-blue-600 hover:underline cursor-pointer" onClick={() => toggleExpand(document._id)}>
                                    {expandedDocument === document._id ? "Collapse ▲" : "Expand ▼"}
                                </td>
                            </tr>
                            {expandedDocument === document._id && document?.Party_Name?.submitter && (
                                <tr>
                                    <td colSpan={documents.header.length + 1} className="p-2 bg-gray-100">
                                        <p><strong>Party Name:</strong> {document.Party_Name.submitter.PartyName || "N/A"}</p>
                                        <p><strong>Party Type:</strong> {document.Party_Name.submitter.PartyType || "N/A"}</p>
                                        {/* <p><strong>ID:</strong> {document.Party_Name.submitter._id || "N/A"}</p> */}
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
