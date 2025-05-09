import React, { useState } from "react";
const EffsahPlatformOrders = ({ data }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  if (!data)
    return (
      <p style={{ color: "white" }}>No Effsah Platform Orders available.</p>
    );

  const { heading, header, body } = data;

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const commonCellStyle = {
    backgroundColor: "#16213e",
    border: "1px solid #fff",
    color: "white",
  };

  return (
    <div className="mt-4">
      <h5 style={{ color: "white", marginBottom: "1rem" }}>
        Effsah Platform Orders: {heading || "N/A"}
      </h5>

      {/* Desktop View */}
      <div className="table-responsive d-none d-md-block">
        <table
          className="table mb-0"
          style={{
            backgroundColor: "#16213e",
            border: "1px solid #fff",
            color: "white",
          }}
        >
          <thead>
            <tr>
              {header.map((headerItem, index) => (
                <th
                  key={index}
                  style={{
                    ...commonCellStyle,
                    padding: "0.75rem",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  {headerItem}
                </th>
              ))}
              <th
                style={{
                  ...commonCellStyle,
                  padding: "0.75rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {body.length > 0 ? (
              body.map((order) => (
                <React.Fragment key={order._id}>
                  <tr>
                    <td style={commonCellStyle}>
                      {order.Request_Number || "N/A"}
                    </td>
                    <td style={commonCellStyle}>
                      {order.Case_Number || "N/A"}
                    </td>
                    <td style={commonCellStyle}>
                      {order.Service_Name || "N/A"}
                    </td>
                    <td style={commonCellStyle}>
                      {order.Request_Date || "N/A"}
                    </td>
                    <td style={commonCellStyle}>{order.Judge_Name || "N/A"}</td>
                    <td style={commonCellStyle}>
                      {order.Request_Status || "N/A"}
                    </td>
                    <td
                      className="text-center"
                      style={{ ...commonCellStyle, cursor: "pointer" }}
                      onClick={() => toggleExpandOrder(order._id)}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 0,
                          height: 0,
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderTop:
                            expandedOrder === order._id
                              ? "none"
                              : "6px solid white",
                          borderBottom:
                            expandedOrder === order._id
                              ? "6px solid white"
                              : "none",
                        }}
                      />
                    </td>
                  </tr>

                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan={header.length + 1} style={commonCellStyle}>
                        <div style={{ padding: "1rem" }}>
                          <strong>Order Details:</strong>
                          <p style={{ marginBottom: "0.25rem" }}>
                            <strong>Request Number:</strong>{" "}
                            {order.Request_Number}
                          </p>
                          <p style={{ marginBottom: "0.25rem" }}>
                            <strong>Case Number:</strong> {order.Case_Number}
                          </p>
                          <p style={{ marginBottom: "0.25rem" }}>
                            <strong>Service Name:</strong> {order.Service_Name}
                          </p>
                          <p style={{ marginBottom: "0.25rem" }}>
                            <strong>Request Date:</strong> {order.Request_Date}
                          </p>
                          <p style={{ marginBottom: "0.25rem" }}>
                            <strong>Judge Name:</strong> {order.Judge_Name}
                          </p>
                          <p style={{ marginBottom: "0" }}>
                            <strong>Status:</strong> {order.Request_Status}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan={header.length + 1}
                  style={{
                    ...commonCellStyle,
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  No items to show...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="d-md-none">
        {body.length > 0 ? (
          body.map((order) => (
            <div
              key={order._id}
              className="card mb-3"
              style={{
                backgroundColor: "#16213e",
                border: "1px solid #ffffff",
                color: "white",
              }}
            >
              <div className="card-body">
                {header.map((headerItem, index) => {
                  const field = headerItem.replace(/ /g, "_");
                  return (
                    <div
                      key={index}
                      className="d-flex justify-content-between mb-2"
                    >
                      <strong className="me-2">{headerItem}:</strong>
                      <span className="text-end">{order[field] || "N/A"}</span>
                    </div>
                  );
                })}

                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => toggleExpandOrder(order._id)}
                  >
                    {expandedOrder === order._id
                      ? "Hide Details"
                      : "Show Details"}
                  </button>
                </div>

                {expandedOrder === order._id && (
                  <div className="mt-3">
                    <p style={{ marginBottom: "0.25rem" }}>
                      <strong>Order Details:</strong>
                    </p>
                    <p style={{ marginBottom: "0.25rem" }}>
                      <strong>Request Number:</strong> {order.Request_Number}
                    </p>
                    <p style={{ marginBottom: "0.25rem" }}>
                      <strong>Case Number:</strong> {order.Case_Number}
                    </p>
                    <p style={{ marginBottom: "0.25rem" }}>
                      <strong>Service Name:</strong> {order.Service_Name}
                    </p>
                    <p style={{ marginBottom: "0.25rem" }}>
                      <strong>Request Date:</strong> {order.Request_Date}
                    </p>
                    <p style={{ marginBottom: "0.25rem" }}>
                      <strong>Judge Name:</strong> {order.Judge_Name}
                    </p>
                    <p style={{ marginBottom: "0" }}>
                      <strong>Status:</strong> {order.Request_Status}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "white" }}>No items to show...</p>
        )}
      </div>
    </div>
  );
};

export default EffsahPlatformOrders;
