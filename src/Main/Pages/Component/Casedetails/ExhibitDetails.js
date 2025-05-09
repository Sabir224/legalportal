import React, { useState } from "react";

const ExhibitDetails = ({ caseData }) => {
  const [expandedSubmitters, setExpandedSubmitters] = useState({});
  const exhibits = caseData?.Exhibits;

  if (!exhibits) return <p>No exhibit details available.</p>;

  const toggleExpandSubmitter = (exhibitId) => {
    setExpandedSubmitters((prev) => ({
      ...prev,
      [exhibitId]: !prev[exhibitId],
    }));
  };

  return (
    <div className="container mt-4">
      <h5 className="mb-4 fw-semibold text-white">
        Exhibit Details: {exhibits.heading || "N/A"}
      </h5>

      {/* Desktop Table */}
      <div className="d-none d-md-block">
        <table
          className="table table-bordered text-white"
          style={{ backgroundColor: "#16213e", borderColor: "#fff" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#16213e" }}>
              {exhibits.header.map((headerItem, index) => (
                <th
                  key={index}
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {headerItem}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exhibits.body.map((exhibit) => {
              const exhibitId = exhibit._id;
              const isExpanded = expandedSubmitters[exhibitId];
              const submitters = Array.isArray(exhibit.Submitter)
                ? exhibit.Submitter
                : [];

              return (
                <React.Fragment key={exhibitId}>
                  <tr style={{ backgroundColor: "#16213e" }}>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                        padding: "0.75rem",
                      }}
                    >
                      {exhibit.Detailed_Description || "N/A"}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                        padding: "0.75rem",
                      }}
                    >
                      {exhibit.Session_Date || "N/A"}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                        padding: "0.75rem",
                      }}
                    >
                      {exhibit.Attachment_Date || "N/A"}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                        padding: "0.75rem",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                      onClick={() => toggleExpandSubmitter(exhibitId)}
                    >
                      {isExpanded ? (
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
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                        padding: "0.75rem",
                      }}
                    >
                      {exhibit.Attachment || "N/A"}
                    </td>
                  </tr>

                  {isExpanded && submitters.length > 0 && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          backgroundColor: "#16213e",
                          borderColor: "#fff",
                          color: "white",
                          padding: "1rem",
                        }}
                      >
                        <strong>Submitter Details:</strong>
                        {submitters.map((submitter, idx) => (
                          <div key={idx} className="mt-2">
                            <p>
                              <strong>Party Name:</strong>{" "}
                              {submitter.Party_Name || "N/A"}
                            </p>
                            <p>
                              <strong>Party Type:</strong>{" "}
                              {submitter.Party_Type || "N/A"}
                            </p>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="d-md-none">
        {exhibits.body.map((exhibit) => {
          const exhibitId = exhibit._id;
          const isExpanded = expandedSubmitters[exhibitId];
          const submitters = Array.isArray(exhibit.Submitter)
            ? exhibit.Submitter
            : [];

          return (
            <div
              key={exhibitId}
              className="card mb-3 border-0"
              style={{ backgroundColor: "#16213e", color: "#fff" }}
            >
              <div
                className="card-body"
                style={{ backgroundColor: "#16213e", color: "#fff" }}
              >
                <p>
                  <strong>Detailed Description:</strong>{" "}
                  {exhibit.Detailed_Description || "N/A"}
                </p>
                <p>
                  <strong>Session Date:</strong> {exhibit.Session_Date || "N/A"}
                </p>
                <p>
                  <strong>Attachment Date:</strong>{" "}
                  {exhibit.Attachment_Date || "N/A"}
                </p>
                <p>
                  <strong>Attachment:</strong> {exhibit.Attachment || "N/A"}
                </p>

                <button
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#16213e",
                    color: "white",
                    border: "1px solid #fff",
                  }}
                  onClick={() => toggleExpandSubmitter(exhibitId)}
                >
                  {isExpanded ? "Hide Details" : "Show Details"}
                </button>

                {isExpanded && submitters.length > 0 && (
                  <div
                    className="mt-3 p-3 rounded"
                    style={{ backgroundColor: "#16213e", color: "#fff" }}
                  >
                    <strong>Submitter Details:</strong>
                    {submitters.map((submitter, idx) => (
                      <div key={idx} className="mt-2">
                        <p>
                          <strong>Party Name:</strong>{" "}
                          {submitter.Party_Name || "N/A"}
                        </p>
                        <p>
                          <strong>Party Type:</strong>{" "}
                          {submitter.Party_Type || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExhibitDetails;
