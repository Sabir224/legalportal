import React from "react";

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
                            // Skip rendering empty header cells
                            headerItem && (
                                <th key={index} className="border border-gray-400 p-2">
                                    {headerItem}
                                </th>
                            )
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.body.map((petition) => (
                        <tr key={petition._id} className="hover:bg-gray-100">
                            {data.header.map((headerItem, index) => {
                                // If it's an empty column, don't render it
                                if (!headerItem) return null;

                                // Dynamically access the petition field
                                const field = headerItem.replace(/ /g, "_");
                                return (
                                    <td key={index} className="p-2">
                                        {petition[field] || "N/A"}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Petitions;
