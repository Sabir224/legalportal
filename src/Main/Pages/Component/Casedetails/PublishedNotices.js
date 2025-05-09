import React, { useState } from "react";

const PublishedNotices = ({ data }) => {
  const [expandedNotice, setExpandedNotice] = useState(null);

  const toggleExpandNotice = (noticeId) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  if (!data || !data.body || data.body.length === 0)
    return <p className="text-white">No published notices available.</p>;

  return (
    <div className="mt-4">
      <h5 className="mb-3 text-white">
        Published Notices: {data.heading || "N/A"}
      </h5>

      <div className="table-responsive">
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
              {data.header.map((headerItem, index) => (
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
                  {headerItem}
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.body.map((notice) => (
              <React.Fragment key={notice._id}>
                <tr style={{ backgroundColor: "#16213e" }}>
                  <td
                    style={{
                      border: "1px solid #fff",
                      padding: "0.75rem",
                    }}
                  >
                    {notice.Notice_Number || "N/A"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #fff",
                      padding: "0.75rem",
                    }}
                  >
                    {notice.Insertion_Date || "N/A"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #fff",
                      padding: "0.75rem",
                    }}
                  >
                    {notice.Notice_Type || "N/A"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #fff",
                      padding: "0.75rem",
                    }}
                  >
                    {notice.Journal_Name || "N/A"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #fff",
                      padding: "0.75rem",
                    }}
                  >
                    {notice.Journal_Number || "N/A"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #fff",
                      padding: "0.75rem",
                    }}
                  >
                    {notice.Journal_Issue_Date || "N/A"}
                  </td>
                  <td
                    style={{
                      border: "1px solid #fff",
                      padding: "0.75rem",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onClick={() => toggleExpandNotice(notice._id)}
                  >
                    {expandedNotice === notice._id ? (
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
                {expandedNotice === notice._id && (
                  <tr>
                    <td
                      colSpan={data.header.length + 1}
                      style={{
                        backgroundColor: "#16213e",
                        border: "1px solid #fff",
                        padding: "1rem",
                      }}
                    >
                      <div className="text-white">
                        <p>
                          <strong>Notice Number:</strong>{" "}
                          {notice.Notice_Number || "N/A"}
                        </p>
                        <p>
                          <strong>Insertion Date:</strong>{" "}
                          {notice.Insertion_Date || "N/A"}
                        </p>
                        <p>
                          <strong>Notice Type:</strong>{" "}
                          {notice.Notice_Type || "N/A"}
                        </p>
                        <p>
                          <strong>Journal Name:</strong>{" "}
                          {notice.Journal_Name || "N/A"}
                        </p>
                        <p>
                          <strong>Journal Number:</strong>{" "}
                          {notice.Journal_Number || "N/A"}
                        </p>
                        <p>
                          <strong>Journal Issue Date:</strong>{" "}
                          {notice.Journal_Issue_Date || "N/A"}
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
    </div>
  );
};

export default PublishedNotices;
