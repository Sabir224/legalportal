import React, { useState } from "react";

const EffsahPlatformOrders = ({ data }) => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    if (!data) return <p>No Effsah Platform Orders available.</p>;

    const { heading, header, body } = data;

    const toggleExpandOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <div className="overflow-x-auto mt-8">
            <h5 className="text-lg font-semibold mb-4">
                Effsah Platform Orders: {heading || "N/A"}
            </h5>
            <table className="table-fixed w-full border border-gray-400">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        {header.map((headerItem, index) => (
                            <th key={index} className="border border-gray-400 p-2">
                                {headerItem}
                            </th>
                        ))}
                        {/* Action column for expand/collapse icon */}
                        <th className="border border-gray-400 p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {body.length > 0 ? (
                        body.map((order) => (
                            <React.Fragment key={order._id}>
                                <tr className="hover:bg-gray-100">
                                    <td className="p-2">{order.Request_Number || "N/A"}</td>
                                    <td className="p-2">{order.Case_Number || "N/A"}</td>
                                    <td className="p-2">{order.Service_Name || "N/A"}</td>
                                    <td className="p-2">{order.Request_Date || "N/A"}</td>
                                    <td className="p-2">{order.Judge_Name || "N/A"}</td>
                                    <td className="p-2">{order.Request_Status || "N/A"}</td>
                                    {/* Arrow icon for expansion */}
                                    <td
                                        className="p-2 cursor-pointer text-blue-600 hover:underline"
                                        onClick={() => toggleExpandOrder(order._id)}
                                    >
                                        {expandedOrder === order._id ? "▲" : "▼"}
                                    </td>
                                </tr>
                                {/* Only render expanded content when needed */}
                                {expandedOrder === order._id && (
                                    <tr className="bg-gray-100">
                                        <td colSpan={header.length + 1} className="p-4">
                                            <div>
                                                <p><strong>Order Details:</strong></p>
                                                {/* Display more detailed information about the order */}
                                                <p><strong>Request Number:</strong> {order.Request_Number}</p>
                                                <p><strong>Case Number:</strong> {order.Case_Number}</p>
                                                <p><strong>Service Name:</strong> {order.Service_Name}</p>
                                                <p><strong>Request Date:</strong> {order.Request_Date}</p>
                                                <p><strong>Judge Name:</strong> {order.Judge_Name}</p>
                                                <p><strong>Status:</strong> {order.Request_Status}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={header.length + 1} className="p-2 text-center">
                                No items to show...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EffsahPlatformOrders;
