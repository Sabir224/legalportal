import React, { useState } from "react";

const PublicProsecutionReports = ({ data }) => {
  const [expandedNotice, setExpandedNotice] = useState(null);

  const toggleExpandNotice = (noticeId) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  if (!data) return <p>No published notices available.</p>;

  const style = {
    backgroundColor: "#16213e",
    borderColor: "#fff",
    color: "white",
  };

  return (
    <div className="mt-8">
      <h5 className="text-lg font-semibold mb-4">{data.heading || "N/A"}</h5>

      {/* Desktop Table */}
      <div className="overflow-x-auto d-none d-md-block">
        <table className="table w-full table-bordered" style={style}>
          <thead style={{ backgroundColor: "#1a1f3c", color: "#fff" }}>
            <tr>
              {data.header.map((headerItem, index) => (
                <th key={index} className="p-2 border border-white">
                  {headerItem}
                </th>
              ))}
              <th className="p-2 border border-white">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.body.map((notice) => (
              <React.Fragment key={notice._id}>
                <tr>
                  <td className="p-2 border border-white">
                    {notice.Petition_Number || "N/A"}
                  </td>
                  <td className="p-2 border border-white">
                    {notice.Subject || "N/A"}
                  </td>
                  <td className="p-2 border border-white">
                    {notice.Petition_Date || "N/A"}
                  </td>
                  <td className="p-2 border border-white">
                    {notice.Petition_Details || "N/A"}
                  </td>
                  <td className="p-2 border border-white">
                    {notice.Applicant || "N/A"}
                  </td>
                  <td
                    className="p-2 text-info fw-bold cursor-pointer"
                    onClick={() => toggleExpandNotice(notice._id)}
                  >
                    {expandedNotice === notice._id ? "▲ Hide" : "▼ Show"}
                  </td>
                </tr>
                {expandedNotice === notice._id && (
                  <tr>
                    <td colSpan={data.header.length + 1}>
                      <div
                        className="p-3"
                        style={{ backgroundColor: "#1a1f3c", color: "#fff" }}
                      >
                        <h6 className="fw-semibold mb-2">Notice Details:</h6>
                        <pre>{JSON.stringify(notice, null, 2)}</pre>
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
      <div className="d-block d-md-none">
        {data.body.map((notice) => (
          <div key={notice._id} className="card mb-3" style={style}>
            <div className="card-body">
              <p>
                <strong>Petition Number:</strong>{" "}
                {notice.Petition_Number || "N/A"}
              </p>
              <p>
                <strong>Subject:</strong> {notice.Subject || "N/A"}
              </p>
              <p>
                <strong>Petition Date:</strong> {notice.Petition_Date || "N/A"}
              </p>
              <p>
                <strong>Petition Details:</strong>{" "}
                {notice.Petition_Details || "N/A"}
              </p>
              <p>
                <strong>Applicant:</strong> {notice.Applicant || "N/A"}
              </p>
              <button
                className="btn btn-link p-0 mt-2 text-info"
                onClick={() => toggleExpandNotice(notice._id)}
              >
                {expandedNotice === notice._id
                  ? "▲ Hide Details"
                  : "▼ Show Details"}
              </button>
              {expandedNotice === notice._id && (
                <div
                  className="mt-3 p-2 border rounded"
                  style={{ backgroundColor: "#1a1f3c", color: "#fff" }}
                >
                  <h6 className="fw-semibold">Notice Details:</h6>
                  <pre>{JSON.stringify(notice, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicProsecutionReports;
