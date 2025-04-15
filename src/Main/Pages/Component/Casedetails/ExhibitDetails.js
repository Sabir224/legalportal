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
        <div>
            <div className="overflow-x-auto mt-8">
                <h5 className="text-lg font-semibold mb-4">
                    Exhibit Details: {exhibits.heading || "N/A"}
                </h5>
                <table className="table-fixed w-full border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            {exhibits.header.map((headerItem, index) => (
                                <th key={index} className="border border-gray-400 p-2">
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
                                    <tr className="hover:bg-gray-100">
                                        <td className="p-2">
                                            {exhibit.Detailed_Description || "N/A"}
                                        </td>
                                        <td className="p-2">
                                            {exhibit.Session_Date || "N/A"}
                                        </td>
                                        <td className="p-2">
                                            {exhibit.Attachment_Date || "N/A"}
                                        </td>
                                        <td
                                            className="p-2 cursor-pointer text-blue-600 hover:underline"
                                            onClick={() => toggleExpandSubmitter(exhibitId)}
                                        >
                                            {isExpanded ? "Submitter ▲" : "Submitter ▼"}
                                        </td>
                                        <td className="p-2">
                                            {exhibit.Attachment || "N/A"}
                                        </td>
                                    </tr>

                                    {isExpanded && submitters.length > 0 && (
                                        <tr>
                                            <td colSpan="5" className="bg-gray-100 p-2 border border-t-0 border-gray-400">
                                                <p className="font-semibold mb-2">Submitter Details:</p>
                                                {submitters.map((submitter, idx) => (
                                                    <div key={idx} className="mb-2">
                                                        <p><strong>Party Name:</strong> {submitter.Party_Name || "N/A"}</p>
                                                        <p><strong>Party Type:</strong> {submitter.Party_Type || "N/A"}</p>
                                                        {/* <p><strong>ID:</strong> {submitter._id || "N/A"}</p> */}
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
        </div>
    );
};

export default ExhibitDetails;
