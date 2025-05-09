import React, { useState } from "react";
import ViewDocumentsModal from "./DocumentViewers/ViewDocumentsModal";
const DocumentsDetails = ({ caseData }) => {
  const [expandedDocument, setExpandedDocument] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const documents = caseData?.Documents;
  if (!documents)
    return <p className="text-white">No document details available.</p>;

  const toggleExpand = (docId) => {
    setExpandedDocument(expandedDocument === docId ? null : docId);
  };

  const handleAddDocument = () => {
    setShowDocModal(true);
  };

  const getCellValue = (document, header) => {
    const keyMap = {
      "Detailed Description": "Detailed_Description",
      "Session Date": "Session_Date",
      "Attachment Date": "Attachment_Date",
      "Party Name": "Party_Name",
      Attachment: "Attachment",
    };

    const value = document?.[keyMap[header]];
    if (typeof value === "object" && value?.submitter) {
      return value.submitter.PartyName || "N/A";
    }

    return value ?? "N/A";
  };

  return (
    <div
      className="mt-6"
      style={{ backgroundColor: "#16213e", color: "white" }}
    >
      <div className="d-flex items-center justify-content-between mb-4">
        <h5 className="text-lg font-semibold text-white">
          {documents.heading}
        </h5>
      </div>

      {/* Desktop Table */}
      <div className="table-responsive d-none d-md-block">
        <table
          className="table-auto w-full text-white"
          style={{
            backgroundColor: "#16213e",
            border: "1px solid #fff",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#16213e" }}>
              {documents?.header?.map((header, index) => (
                <th
                  key={index}
                  style={{
                    backgroundColor: "#16213e",
                    border: "1px solid #fff",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {header}
                </th>
              ))}
              <th
                style={{
                  backgroundColor: "#16213e",
                  border: "1px solid #fff",
                  padding: "0.75rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {documents?.body?.map((document) => (
              <React.Fragment key={document._id}>
                <tr style={{ backgroundColor: "#16213e" }}>
                  {documents.header.map((header, index) => (
                    <td
                      key={index}
                      style={{
                        backgroundColor: "#16213e",
                        border: "1px solid #fff",
                        padding: "0.75rem",
                      }}
                    >
                      {getCellValue(document, header)}
                    </td>
                  ))}
                  <td
                    style={{
                      backgroundColor: "#16213e",
                      border: "1px solid #fff",
                      padding: "0.75rem",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onClick={() => toggleExpand(document._id)}
                  >
                    {expandedDocument === document._id ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M12 6l-8 12h16z" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M12 18l8-12H4z" />
                      </svg>
                    )}
                  </td>
                </tr>
                {expandedDocument === document._id &&
                  document?.Party_Name?.submitter && (
                    <tr>
                      <td
                        colSpan={documents.header.length + 1}
                        style={{
                          backgroundColor: "#16213e",
                          border: "1px solid #fff",
                          padding: "1rem",
                        }}
                      >
                        <div className="text-white">
                          <p>
                            <strong>Party Name:</strong>{" "}
                            {document.Party_Name.submitter.PartyName || "N/A"}
                          </p>
                          <p>
                            <strong>Party Type:</strong>{" "}
                            {document.Party_Name.submitter.PartyType || "N/A"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {documents?.body?.map((document) => (
          <div
            key={document._id}
            className="card mb-3 border-0"
            style={{ backgroundColor: "#16213e" }}
          >
            <div className="card-body text-white">
              <p>
                <strong>Detailed Description:</strong>{" "}
                {document.Detailed_Description || "N/A"}
              </p>
              <p>
                <strong>Session Date:</strong> {document.Session_Date || "N/A"}
              </p>
              <p>
                <strong>Attachment Date:</strong>{" "}
                {document.Attachment_Date || "N/A"}
              </p>
              <p>
                <strong>Party Name:</strong>{" "}
                {document.Party_Name?.submitter?.PartyName || "N/A"}
              </p>

              <button
                className="btn btn-sm mt-2"
                style={{
                  backgroundColor: "#16213e",
                  color: "white",
                  border: "1px solid #fff",
                }}
                onClick={() => toggleExpand(document._id)}
              >
                {expandedDocument === document._id
                  ? "Hide Details"
                  : "Show Details"}
              </button>

              {expandedDocument === document._id && (
                <div
                  className="mt-3 p-3 rounded"
                  style={{ backgroundColor: "#16213e" }}
                >
                  <p>
                    <strong>Attachment:</strong> {document.Attachment || "N/A"}
                  </p>
                  <p>
                    <strong>Party Type:</strong>{" "}
                    {document.Party_Name?.submitter?.PartyType || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsDetails;
