import React, { useState } from "react";

const Experience_Reports = ({ data }) => {
  const [expandedNotice, setExpandedNotice] = useState(null);

  const toggleExpandNotice = (noticeId) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  if (!data) return <p>No published notices available.</p>;

  const reportStyle = {
    backgroundColor: "#1a1f3c",
    color: "#fff",
    border: "1px solid #fff",
  };

  return (
    <div className="mt-4">
      <h5 className="mb-3 fw-semibold">
        Experience Reports: {data.heading || "N/A"}
      </h5>

      {/* Table for desktop and up */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-bordered table-hover" style={reportStyle}>
          <thead>
            <tr>
              {data.header.map((headerItem, index) => (
                <th key={index} style={reportStyle}>
                  {headerItem}
                </th>
              ))}
              <th style={reportStyle}>Details</th>
            </tr>
          </thead>
          <tbody>
            {data.body.map((notice) => (
              <React.Fragment key={notice._id}>
                <tr>
                  <td style={reportStyle}>{notice.Decision_Number || "N/A"}</td>
                  <td style={reportStyle}>{notice.Expert_Name || "N/A"}</td>
                  <td style={reportStyle}>
                    {notice.Mission_Ascription_Date || "N/A"}
                  </td>
                  <td style={reportStyle}>
                    {notice.Expected_Submission_Date || "N/A"}
                  </td>
                  <td style={reportStyle}>
                    {notice.Actual_Submission_Date || "N/A"}
                  </td>
                  <td
                    style={reportStyle}
                    className="text-info fw-bold"
                    role="button"
                    onClick={() => toggleExpandNotice(notice._id)}
                  >
                    {expandedNotice === notice._id ? "▲ Hide" : "▼ Show"}
                  </td>
                </tr>
                {expandedNotice === notice._id && (
                  <tr>
                    <td colSpan={data.header.length + 1}>
                      <div className="p-3" style={reportStyle}>
                        <h6 className="fw-semibold mb-2">Notice Details:</h6>
                        <ul className="list-unstyled mb-0">
                          <li>
                            <strong>Decision Number:</strong>{" "}
                            {notice.Decision_Number || "N/A"}
                          </li>
                          <li>
                            <strong>Expert Name:</strong>{" "}
                            {notice.Expert_Name || "N/A"}
                          </li>
                          <li>
                            <strong>Mission Ascription Date:</strong>{" "}
                            {notice.Mission_Ascription_Date || "N/A"}
                          </li>
                          <li>
                            <strong>Expected Submission Date:</strong>{" "}
                            {notice.Expected_Submission_Date || "N/A"}
                          </li>
                          <li>
                            <strong>Actual Submission Date:</strong>{" "}
                            {notice.Actual_Submission_Date || "N/A"}
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="d-block d-md-none">
        {data.body.map((notice) => (
          <div key={notice._id} className="card mb-3" style={reportStyle}>
            <div className="card-body">
              <p>
                <strong>Decision Number:</strong>{" "}
                {notice.Decision_Number || "N/A"}
              </p>
              <p>
                <strong>Expert Name:</strong> {notice.Expert_Name || "N/A"}
              </p>
              <p>
                <strong>Mission Ascription Date:</strong>{" "}
                {notice.Mission_Ascription_Date || "N/A"}
              </p>
              <p>
                <strong>Expected Submission Date:</strong>{" "}
                {notice.Expected_Submission_Date || "N/A"}
              </p>
              <p>
                <strong>Actual Submission Date:</strong>{" "}
                {notice.Actual_Submission_Date || "N/A"}
              </p>
              <button
                className="btn  p-1 mt-2"
                onClick={() => toggleExpandNotice(notice._id)}
                style={reportStyle}
              >
                {expandedNotice === notice._id
                  ? "▲ Hide Details"
                  : "▼ Show Details"}
              </button>
              {expandedNotice === notice._id && (
                <div className="mt-3 p-2 border rounded" style={reportStyle}>
                  <h6 className="fw-semibold">Notice Details:</h6>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Decision Number:</strong>{" "}
                      {notice.Decision_Number || "N/A"}
                    </li>
                    <li>
                      <strong>Expert Name:</strong>{" "}
                      {notice.Expert_Name || "N/A"}
                    </li>
                    <li>
                      <strong>Mission Ascription Date:</strong>{" "}
                      {notice.Mission_Ascription_Date || "N/A"}
                    </li>
                    <li>
                      <strong>Expected Submission Date:</strong>{" "}
                      {notice.Expected_Submission_Date || "N/A"}
                    </li>
                    <li>
                      <strong>Actual Submission Date:</strong>{" "}
                      {notice.Actual_Submission_Date || "N/A"}
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience_Reports;
