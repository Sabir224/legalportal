import React from "react";
const Petitions = ({ data }) => {
  if (!data) return <p className="text-white">No petitions available.</p>;

  return (
    <div className="mt-4">
      <h5 className="text-white mb-3">Petitions: {data.heading || "N/A"}</h5>

      {/* Mobile View: Cards */}
      {/* Mobile View: Cards */}
      <div className="d-md-none">
        {data.body.map((petition, i) => (
          <div
            key={petition._id || i}
            className="card mb-3"
            style={{
              backgroundColor: "#16213e",
              border: "1px solid #ffffff",
              color: "#fff",
            }}
          >
            <div className="card-body">
              {data.header.map((headerItem, index) => {
                if (!headerItem) return null;
                const field = headerItem.replace(/ /g, "_");

                return (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        color: "#ffffff",
                        whiteSpace: "nowrap",
                        marginRight: "10px",
                      }}
                    >
                      {headerItem}:
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#ffffff",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {petition[field] || "N/A"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="table-responsive d-none d-md-block">
        <table
          className="table text-white mb-0"
          style={{
            backgroundColor: "#16213e",
            border: "1px solid #ffffff",
            color: "#fff",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#16213e",
                border: "1px solid #ffffff",
                color: "#fff",
              }}
            >
              {data.header.map(
                (headerItem, index) =>
                  headerItem && (
                    <th
                      key={index}
                      className="text-white"
                      style={{
                        backgroundColor: "#16213e",
                        border: "1px solid #ffffff",
                        color: "#fff",
                        padding: "0.75rem",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {headerItem}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {data.body.map((petition, i) => (
              <tr
                key={petition._id || i}
                style={{ backgroundColor: "#16213e" }}
              >
                {data.header.map((headerItem, index) => {
                  if (!headerItem) return null;
                  const field = headerItem.replace(/ /g, "_");
                  return (
                    <td
                      key={index}
                      className="text-white"
                      style={{
                        backgroundColor: "#16213e",
                        border: "1px solid #ffffff",
                        color: "#fff",
                        padding: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {petition[field] || "N/A"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Petitions;
