import React, { useState } from "react";


const ExhibitDetails = ({ caseData }) => {
    const [expandedParty, setExpandedParty] = useState(null);
    const [expandedSubmitters, setExpandedSubmitters] = useState({});
    const exhibits = caseData?.Exhibits;
    if (!exhibits) return <p>No exhibit details available.</p>;
    const toggleExpandParty = (partyId) => {
        setExpandedParty(expandedParty === partyId ? null : partyId);
    };

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
                        {exhibits.body.map((exhibit) => (
                            <React.Fragment key={exhibit._id}>
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
                                        style={{cursor :"pointer"}}
                                        onClick={() => toggleExpandSubmitter(exhibit._id)}
                                    >
                                        {/* {exhibit.Party_Name?.submitter?.PartyName || "N/A"}{" "} */}
                                        {expandedSubmitters[exhibit._id] ? " Submitter ▲" : "Submitter ▼"}
                                    </td>
                                    <td className="p-2">
                                        {exhibit.Attachment || "N/A"}
                                    </td>
                                </tr>
                                {expandedSubmitters[exhibit._id] &&
                                    exhibit.Party_Name?.submitter && (
                                        <tr className="border border-gray-400">
                                            <td colSpan="5">
                                                <div className="p-2 bg-gray-100">
                                                    <p className="font-semibold mb-1">
                                                        Submitter Details:
                                                    </p>
                                                    <p>
                                                        <strong>Party Name:</strong>{" "}
                                                        {exhibit.Party_Name.submitter.PartyName}
                                                    </p>
                                                    <p>
                                                        <strong>Party Type:</strong>{" "}
                                                        {exhibit.Party_Name.submitter.PartyType}
                                                    </p>
                                                    <p>
                                                        <strong>ID:</strong>{" "}
                                                        {exhibit.Party_Name.submitter._id}
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

export default ExhibitDetails