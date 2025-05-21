import React, { useState } from "react";

const NoticesDetails = ({ caseData }) => {
  const [expandedNotice, setExpandedNotice] = useState(null);
  const notices = caseData?.Notices;

  if (!notices || !notices.body || notices.body.length === 0) {
    return <p>No notice details available.</p>;
  }

  const toggleExpand = (noticeId) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  return (
    <div className="overflow-x-auto mt-6 bg-[#16213e] ">
      <h5 className="text-lg font-semibold mb-4 text-white">
        {notices.heading}
      </h5>

      {/* Desktop View (Table) */}
      <div className="d-none d-md-block bg-[#16213e]">
        <table className="table-auto w-full border border-gray-400">
          <thead className="bg-[#16213e] text-white">
            <tr>
              {notices?.header?.map((header, index) => (
                <th key={index} className="border border-gray-400 p-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notices?.body?.map((notice) => (
              <React.Fragment key={notice._id}>
                <tr className="hover:bg-gray-100 ">
                  <td className="p-2">{notice.Notice_number || "N/A"}</td>
                  <td className="p-2">{notice.Notice_Type || "N/A"}</td>
                  <td className="p-2">{notice.Registration_date || "N/A"}</td>
                  <td
                    className="p-2 text-yellow-500 hover:underline cursor-pointer"
                    onClick={() => toggleExpand(notice._id)}
                  >
                    {expandedNotice === notice._id
                      ? "Notice Party ▲"
                      : "Notice Party ▼"}
                  </td>
                  <td className="p-2">
                    {notice.Notice_Party_Description || "N/A"}
                  </td>
                </tr>
                {expandedNotice === notice._id && (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-2 bg-[#16213e] border border-gray-400"
                    >
                      <p>
                        <strong>Notice Number:</strong>{" "}
                        {notice.Notice_number || "N/A"}
                      </p>
                      <p>
                        <strong>Notice Type:</strong>{" "}
                        {notice.Notice_Type || "N/A"}
                      </p>
                      <p>
                        <strong>Registration Date:</strong>{" "}
                        {notice.Registration_date || "N/A"}
                      </p>
                      <p>
                        <strong>Party Name:</strong>{" "}
                        {notice.Notice_Party || "N/A"}
                      </p>
                      <p>
                        <strong>Party Description:</strong>{" "}
                        {notice.Notice_Party_Description || "N/A"}
                      </p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="d-md-none">
        {notices.body.map((notice) => (
          <div
            key={notice._id}
            className="bg-[#16213e] border border-gray-400 shadow-sm rounded mb-3 text-white"
          >
            <div className="card-body p-4">
              <p className="font-semibold">
                <strong>Notice Number:</strong> {notice.Notice_number || "N/A"}
              </p>
              <p>
                <strong>Notice Type:</strong> {notice.Notice_Type || "N/A"}
              </p>
              <p>
                <strong>Registration Date:</strong>{" "}
                {notice.Registration_date || "N/A"}
              </p>
              <p>
                <strong>Party Description:</strong>{" "}
                {notice.Notice_Party_Description || "N/A"}
              </p>

              <button
                className="btn btn-outline-primary btn-sm text-white border-white hover:bg-white hover:text-[#16213e] mt-2"
                onClick={() => toggleExpand(notice._id)}
              >
                {expandedNotice === notice._id
                  ? "Hide Details"
                  : "Show Details"}
              </button>

              {expandedNotice === notice._id && (
                <div className="mt-3">
                  <p>
                    <strong>Party Name:</strong> {notice.Notice_Party || "N/A"}
                  </p>
                  <p>
                    <strong>Notice Number:</strong>{" "}
                    {notice.Notice_number || "N/A"}
                  </p>
                  <p>
                    <strong>Notice Type:</strong> {notice.Notice_Type || "N/A"}
                  </p>
                  <p>
                    <strong>Registration Date:</strong>{" "}
                    {notice.Registration_date || "N/A"}
                  </p>
                  <p>
                    <strong>Party Description:</strong>{" "}
                    {notice.Notice_Party_Description || "N/A"}
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

export default NoticesDetails;
