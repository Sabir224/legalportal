import React, { useState } from "react";
const Petitions = ({ data }) => {

    if (!data) return <p>No petitions available.</p>;

    return (
        <div className="overflow-x-auto mt-8">
            <h5 className="text-lg font-semibold mb-4">
                Petitions: {data.heading || "N/A"}
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
                    {data.body.map((petition) => (
                        <tr key={petition._id} className="hover:bg-gray-100">
                            <td className="p-2">{petition.Petition_Number || "N/A"}</td>
                            <td className="p-2">{petition.Subject || "N/A"}</td>
                            <td className="p-2">{petition.Petition_Date || "N/A"}</td>
                            <td className="p-2">{petition.Petition_Details || "N/A"}</td>
                            <td className="p-2">{petition.Applicant || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default  Petitions ;