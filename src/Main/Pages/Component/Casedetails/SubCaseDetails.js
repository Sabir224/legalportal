import React, { useState } from "react";

const SubCaseDetails = ({ caseData, reportType }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpandRow = (rowIndex) => {
    setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
  };

  const report = caseData?.[reportType];

  if (!report || !report.body || report.body.length === 0) {
    return (
      <p style={{ color: "#dc3545" }}>
        No {reportType.replace(/_/g, " ")} data available.
      </p>
    );
  }

  const isEmptyItem = (item) => {
    return Object.values(item).some(
      (val) =>
        typeof val === "string" &&
        (val.includes("No items to show") || val.includes("No data found"))
    );
  };

  const getPropertyName = (header) => {
    return header
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .replace(/_+/g, "_");
  };

  const style = {
    backgroundColor: "#16213e",
    borderColor: "#fff",
    color: "white",
  };

  return (
    <div className="container-fluid my-4">
      <h5 className="mb-4 fw-semibold" style={{ color: "#16213e" }}>
        {report.heading || reportType.replace(/_/g, " ")}
      </h5>

      {/* Desktop View */}
      <div className="d-none d-md-block table-responsive">
        <table className="table table-bordered" style={style}>
          <thead style={style}>
            <tr>
              {report.header?.map(
                (header, index) =>
                  header?.trim() !== "" && (
                    <th key={index} style={style}>
                      {header}
                    </th>
                  )
              )}
              {report.body.some((item) => !isEmptyItem(item)) && (
                <th style={style}>Details</th>
              )}
            </tr>
          </thead>
          <tbody style={style}>
            {report.body?.map((item, rowIndex) => (
              <React.Fragment key={item._id || rowIndex}>
                <tr
                  style={{
                    backgroundColor: isEmptyItem(item)
                      ? "#f8f9fa"
                      : style.backgroundColor,
                    color: isEmptyItem(item) ? "#ccc" : style.color,
                    borderColor: style.borderColor,
                  }}
                >
                  {report.header?.map(
                    (header, colIndex) =>
                      header?.trim() !== "" && (
                        <td
                          key={colIndex}
                          style={{
                            ...style,
                            borderColor: style.borderColor,
                          }}
                        >
                          {item[getPropertyName(header)] || "N/A"}
                        </td>
                      )
                  )}
                  {!isEmptyItem(item) && (
                    <td
                      onClick={() => toggleExpandRow(rowIndex)}
                      style={{
                        ...style,
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      {expandedRow === rowIndex ? "▲ Hide" : "▼ Show"}
                    </td>
                  )}
                </tr>

                {expandedRow === rowIndex && !isEmptyItem(item) && (
                  <tr>
                    <td
                      colSpan={report.header?.length + 1}
                      style={{ padding: 0, borderColor: style.borderColor }}
                    >
                      <div className="p-3" style={style}>
                        <h6
                          className="fw-semibold mb-3"
                          style={{ color: style.color }}
                        >
                          Detailed Information:
                        </h6>
                        <div className="table-responsive">
                          <table
                            className="table table-sm table-bordered"
                            style={style}
                          >
                            <tbody style={style}>
                              {Object.keys(item).map((key, index) => (
                                <tr key={index}>
                                  <td style={{ ...style, fontWeight: 600 }}>
                                    {key.replace(/_/g, " ")}:
                                  </td>
                                  <td style={style}>{item[key] || "N/A"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="d-block d-md-none">
        {report.body?.map((item, index) => (
          <div
            key={item._id || index}
            className="mb-4 p-3 rounded"
            style={{ ...style, border: "1px solid #fff" }}
          >
            {report.header?.map(
              (header, i) =>
                header?.trim() !== "" && (
                  <div
                    key={i}
                    className="d-flex justify-content-between pb-1 mb-1"
                    style={{ borderColor: "#fff" }}
                  >
                    <strong>{header}</strong>
                    <span>{item[getPropertyName(header)] || "N/A"}</span>
                  </div>
                )
            )}

            {!isEmptyItem(item) && (
              <div
                onClick={() => toggleExpandRow(index)}
                style={{
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                  marginTop: "10px",
                }}
              >
                {expandedRow === index ? "▲ Hide Details" : "▼ Show Details"}
              </div>
            )}

            {expandedRow === index && !isEmptyItem(item) && (
              <div className="mt-3">
                <h6 className="fw-semibold mb-2">Detailed Information:</h6>
                {Object.keys(item).map((key, kIdx) => (
                  <div
                    key={kIdx}
                    className="d-flex justify-content-between  pb-1 mb-1"
                    style={{ borderColor: "#fff" }}
                  >
                    <strong>{key.replace(/_/g, " ")}:</strong>
                    <span>{item[key] || "N/A"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubCaseDetails;
