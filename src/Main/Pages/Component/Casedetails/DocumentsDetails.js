import React, { useState } from "react";

const DocumentsDetails = ({ caseData }) => {
    const [expandedDocument, setExpandedDocument] = useState(null);
    const documents = caseData?.Documents;

    if (!documents) return <p>No document details available.</p>;

    const toggleExpand = (docId) => {
        setExpandedDocument(expandedDocument === docId ? null : docId);
    };

    return (
        <div className="overflow-x-auto mt-6">
            <h5 className="text-lg font-semibold mb-4">Documents</h5>
            <table className="table-auto w-full border border-gray-400">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {documents?.header?.map((header, index) => (
                            <th key={index} className="border border-gray-400 p-2">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {documents?.body?.map((document) => (
                        <React.Fragment key={document._id}>
                            <tr className="hover:bg-gray-100 ">
                                <td className="p-2">{document.Detailed_Description || "N/A"}</td>
                                <td className="p-2">{document.Session_Date || "N/A"}</td>
                                <td className="p-2">{document.Attachment_Date || "N/A"}</td>
                                <td
                                    className="p-2 text-blue-600 hover:underline cursor-pointer"
                                    style={{cursor:'pointer'}} 
                                    onClick={() => toggleExpand(document._id)}
                                >
                                    {/* {document.Party_Name?.submitter?.PartyName || "N/A"} ({document.Party_Name?.submitter?.PartyType || "N/A"})  */}
                                    {expandedDocument === document._id ? "Submitter ▲" : "Submitter ▼"}
                                </td>
                                <td className="p-2">{document.Attachment || "No Attachment"}</td>
                            </tr>
                            {expandedDocument === document._id && (
                                <tr className=""> 
                                    <td colSpan="5" className="p-2  bg-gray-100 ">
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
