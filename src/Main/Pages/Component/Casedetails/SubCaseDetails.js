import React, { useState } from "react";

const SubCaseDetails = ({ caseData, reportType }) => {
    const [expandedReport, setExpandedReport] = useState(null);

    const toggleExpandReport = (reportId) => {
        setExpandedReport(expandedReport === reportId ? null : reportId);
    };

    const report = caseData[reportType];
    if (!report || !report.body || report.body.length === 0) {
        return <p className="text-red-500">No report available.</p>;
    }

    return (
        <div className="overflow-x-auto mt-8">
            <h5 className="text-lg font-semibold mb-4">
                {report.heading || "N/A"}
            </h5>
            <table className="table-fixed w-full border border-gray-400">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {report.header?.map((header, index) => (
                            <th key={index} className="border border-gray-400 p-2">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {report.body?.map((item, index) => (
                        <React.Fragment key={index}>
                            <tr className="hover:bg-gray-100">
                                {report.header?.map((header, idx) => (
                                    <td key={idx} className="p-2 border border-gray-400">
                                        {item[header.replace(/\s+/g, "_")] || "N/A"}
                                    </td>
                                ))}
                                {/* <td
                                    className="p-2 cursor-pointer text-blue-600 hover:underline"
                                    onClick={() => toggleExpandReport(index)}
                                >
                                    {expandedReport === index ? "▲" : "▼"}
                                </td> */}
                            </tr>
                            {expandedReport === index && (
                                <tr className="border border-gray-400">
                                    <td colSpan={report.header.length + 1}>
                                        <div className="p-2 bg-gray-100">
                                            <p className="font-semibold mb-1">Report Details:</p>
                                            <pre>{JSON.stringify(item, null, 2)}</pre>
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

export default SubCaseDetails;
