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
        <div className="overflow-x-auto mt-6">
            <h5 className="text-lg font-semibold mb-4">Notices</h5>
            <table className="table-auto w-full border border-gray-400">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {notices?.header?.map((header, index) => (
                            <th key={index} className="border border-gray-400 p-2">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {notices?.body?.map((notice) => (
                        <React.Fragment key={notice._id}>
                            <tr className="hover:bg-gray-100">
                                <td className="p-2">{notice.Notice_number || "N/A"}</td>
                                <td className="p-2">{notice.Notice_Type || "N/A"}</td>
                                <td className="p-2">{notice.Registration_date || "N/A"}</td>
                                <td
                                    className="p-2 text-blue-600 hover:underline cursor-pointer"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => toggleExpand(notice._id)}
                                >
                                    {expandedNotice === notice._id ? "Notice Party ▲" : "Notice Party ▼"}
                                </td>
                                <td className="p-2">{notice.Notice_Party_Description || "N/A"}</td>
                            </tr>
                            {expandedNotice === notice._id && (
                                <tr>
                                    <td colSpan="5" className="p-2 bg-gray-100 border border-gray-400">
                                        <p><strong>Notice Number:</strong> {notice.Notice_number || "N/A"}</p>
                                        <p><strong>Notice Type:</strong> {notice.Notice_Type || "N/A"}</p>
                                        <p><strong>Registration Date:</strong> {notice.Registration_date || "N/A"}</p>
                                        <p><strong>Party Name:</strong> {notice.Notice_Party || "N/A"}</p>
                                        <p><strong>Party Description:</strong> {notice.Notice_Party_Description || "N/A"}</p>
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

export default NoticesDetails;
