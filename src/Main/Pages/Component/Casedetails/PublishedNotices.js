import React, { useState } from "react";

const PublishedNotices = ({ data }) => {
    const [expandedNotice, setExpandedNotice] = useState(null);

    const toggleExpandNotice = (noticeId) => {
        setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
    };

    if (!data) return <p>No published notices available.</p>;

    return (
        <div className="overflow-x-auto mt-8">
            <h5 className="text-lg font-semibold mb-4">
                Published Notices: {data.heading || "N/A"}
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
                                <td className="p-2">{notice.Notice_Number || "N/A"}</td>
                                <td className="p-2">{notice.Insertion_Date || "N/A"}</td>
                                <td className="p-2">{notice.Notice_Type || "N/A"}</td>
                                <td className="p-2">{notice.Journal_Name || "N/A"}</td>
                                <td className="p-2">{notice.Journal_Number || "N/A"}</td>
                                <td className="p-2">{notice.Journal_Issue_Date || "N/A"}</td>
                                {/* <td
                                    className="p-2 cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => toggleExpandNotice(notice._id)}
                                >
                                    {expandedNotice === notice._id ? "▲" : "▼"}
                                </td> */}
                            </tr>
                            {expandedNotice === notice._id && (
                                <tr className="border border-gray-400">
                                    <td colSpan={data.header.length + 1}>
                                        <div className="p-2 bg-gray-100">
                                            <p className="font-semibold mb-1">Notice Details:</p>
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
    );
};

export default PublishedNotices;
