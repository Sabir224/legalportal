import React, { useState } from "react";

const Experience_Reports = ({ data }) => {
    const [expandedNotice, setExpandedNotice] = useState(null);

    const toggleExpandNotice = (noticeId) => {
        setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
    };

    if (!data) return <p>No published notices available.</p>;

    return (
        <div className="overflow-x-auto mt-8">
            <h5 className="text-lg font-semibold mb-4">
                Experience Reports: {data.heading || "N/A"}
            </h5>
            <table className="table-fixed w-full border border-gray-400">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {data.header.map((headerItem, index) => (
                            <th key={index} className="border border-gray-400 p-2">
                                {headerItem}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.body.map((notice) => (
                        <React.Fragment key={notice._id}>
                            <tr className="hover:bg-gray-100">
                                <td className="p-2">{notice.Decision_Number || "N/A"}</td>
                                <td className="p-2">{notice.Expert_Name || "N/A"}</td>
                                <td className="p-2">{notice.Mission_Ascription_Date || "N/A"}</td>
                                <td className="p-2">{notice.Expected_Submission_Date || "N/A"}</td>
                                <td className="p-2">{notice.Actual_Submission_Date || "N/A"}</td>
                                {/* Add expand icon to toggle details */}
                                <td
                                    className="p-2 cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => toggleExpandNotice(notice._id)}
                                >
                                    {expandedNotice === notice._id ? "▲" : "▼"}
                                </td>
                            </tr>
                            {expandedNotice === notice._id && (
                                <tr className="border border-gray-400">
                                    <td colSpan={data.header.length + 1}>
                                        <div className="p-4 bg-gray-100">
                                            <p className="font-semibold mb-2">Notice Details:</p>
                                            <div>
                                                <p><strong>Decision Number:</strong> {notice.Decision_Number || "N/A"}</p>
                                                <p><strong>Expert Name:</strong> {notice.Expert_Name || "N/A"}</p>
                                                <p><strong>Mission Ascription Date:</strong> {notice.Mission_Ascription_Date || "N/A"}</p>
                                                <p><strong>Expected Submission Date:</strong> {notice.Expected_Submission_Date || "N/A"}</p>
                                                <p><strong>Actual Submission Date:</strong> {notice.Actual_Submission_Date || "N/A"}</p>
                                            </div>
                                        </div>
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

export default Experience_Reports;
