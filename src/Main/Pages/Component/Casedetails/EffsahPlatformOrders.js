import React, { useState } from "react";

const EffsahPlatformOrders = ({ data }) => {
    if (!data) return <p>No Effsah Platform Orders available.</p>;

    return (
        <div className="overflow-x-auto mt-8">
            <h5 className="text-lg font-semibold mb-4">
                Effsah Platform Orders: {data.heading || "N/A"}
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
                    {data.body.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-100">
                            <td className="p-2">{order.Request_Number || "N/A"}</td>
                            <td className="p-2">{order.Case_Number || "N/A"}</td>
                            <td className="p-2">{order.Service_Name || "N/A"}</td>
                            <td className="p-2">{order.Request_Date || "N/A"}</td>
                            <td className="p-2">{order.Judge_Name || "N/A"}</td>
                            <td className="p-2">{order.Request_Status || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default EffsahPlatformOrders;