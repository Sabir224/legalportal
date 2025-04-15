import React, { useState } from "react";

const SubCaseDetails = ({ caseData, reportType }) => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleExpandRow = (rowIndex) => {
        setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
    };

    const report = caseData?.[reportType];

    if (!report || !report.body || report.body.length === 0) {
        return <p className="text-red-500">No {reportType.replace(/_/g, ' ')} data available.</p>;
    }

    const isEmptyItem = (item) => {
        return Object.values(item).some(
            (val) => typeof val === 'string' &&
                (val.includes('No items to show') || val.includes('No data found'))
        );
    };

    const getPropertyName = (header) => {
        return header
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '')
            .replace(/_+/g, '_');
    };

    return (
        <div className="overflow-x-auto mt-8 mb-8">
            <h5 className="text-lg font-semibold mb-4">
                {report.heading || reportType.replace(/_/g, ' ')}
            </h5>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            {report.header?.map((header, index) => (
                                header && header.trim() !== "" && (
                                    <th key={index} className="border border-gray-300 p-2 text-left">
                                        {header}
                                    </th>
                                )
                            ))}
                            {report.body.some(item => !isEmptyItem(item)) && (
                                <th className="border border-gray-300 p-2 text-left">Details</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {report.body?.map((item, rowIndex) => (
                            <React.Fragment key={item._id || rowIndex}>
                                <tr className={`text-gray-700 ${isEmptyItem(item) ? 'text-gray-400' : ''}`}>
                                    {report.header?.map((header, colIndex) => (
                                        header && header.trim() !== "" && (
                                            <td key={colIndex} className="border border-gray-300 p-2">
                                                {item[getPropertyName(header)] || "N/A"}
                                            </td>
                                        )
                                    ))}
                                    {!isEmptyItem(item) && (
                                        <td
                                            className="border border-gray-300 p-2 text-blue-600 cursor-pointer hover:underline"
                                            onClick={() => toggleExpandRow(rowIndex)}
                                        >
                                            {expandedRow === rowIndex ? '▲ Hide' : '▼ Show'}
                                        </td>
                                    )}
                                </tr>
                                {expandedRow === rowIndex && !isEmptyItem(item) && (
                                    <tr className="bg-gray-100">
                                        <td colSpan={report.header?.length + 1}>
                                            <div className="p-4 border border-gray-200">
                                                <h6 className="font-semibold mb-2 text-gray-700">Detailed Information:</h6>
                                                <table className="min-w-full border border-gray-300">
                                                    <tbody>
                                                        {Object.keys(item).map((key, index) => (
                                                            <tr key={index}>
                                                                <td className=" p-2 font-semibold">
                                                                    {key.replace(/_/g, " ")}:
                                                                </td>
                                                                <td className=" p-2">
                                                                    {item[key] || "N/A"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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

export default SubCaseDetails;
