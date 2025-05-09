import React, { useState } from "react";

// const PartiesDetails = ({ caseData }) => {
//   const [expandedParty, setExpandedParty] = useState(null);
//   const parties = caseData?.Parties?.[0];
//   if (!parties) return <p>No party details available.</p>;

//   const toggleExpand = (partyId) => {
//     setExpandedParty(expandedParty === partyId ? null : partyId);
//   };

//   return (
//     <div>
//       <h5 className="text-lg font-semibold mb-4">
//         Heading: {parties?.heading || "N/A"}
//       </h5>

//       <div className="overflow-x-auto">
//         <table className="table-fixed w-full border border-gray-400">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700">
//               <th className="border border-gray-400 p-2 w-1/7">Party Number</th>
//               <th className="border border-gray-400 p-2 w-1/7">Party Name</th>
//               <th className="border border-gray-400 p-2 w-1/7">
//                 Title in Case
//               </th>
//               <th className="border border-gray-400 p-2 w-1/7">
//                 Title after Judgment
//               </th>
//               <th className="border border-gray-400 p-2 w-1/7">
//                 Legal Consultants
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {(parties?.Parties_body || []).map((party) => {
//               const consultants =
//                 party?.Legal_Consultants?.Legal_Consultants_header || [];

//               return (
//                 <React.Fragment key={party._id}>
//                   <tr className="hover:bg-gray-100">
//                     <td className="p-2">{party.PartyNumber || "N/A"}</td>
//                     <td className="p-2">{party.PartyName || "N/A"}</td>
//                     <td className="p-2">{party.TitleInCase || "N/A"}</td>
//                     <td className="p-2">{party.TitleAfterJudgment || "N/A"}</td>
//                     <td
//                       className="p-2 text-sm cursor-pointer"
//                       onClick={() => toggleExpand(party._id)}
//                     >
//                       {expandedParty === party._id ? "▲" : "▼"}
//                     </td>
//                   </tr>

//                   {expandedParty === party._id && (
//                     <tr>
//                       <td colSpan="5">
//                         <div className="overflow-x-auto mt-2 p-2 bg-gray-100 border border-gray-400">
//                           <h4 className="text-sm font-semibold mb-2">
//                             Legal Consultants
//                           </h4>

//                           {consultants.length > 0 ? (
//                             <table className="table-fixed w-full border border-gray-300">
//                               <thead>
//                                 <tr className="bg-gray-200 text-gray-700">
//                                   <th className="border border-gray-300 p-2">
//                                     Name
//                                   </th>
//                                   <th className="border border-gray-300 p-2">
//                                     Date of Disconnection
//                                   </th>
//                                   <th className="border border-gray-300 p-2">
//                                     City
//                                   </th>
//                                   <th className="border border-gray-300 p-2">
//                                     Address
//                                   </th>
//                                   <th className="border border-gray-300 p-2">
//                                     Tel
//                                   </th>
//                                   <th className="border border-gray-300 p-2">
//                                     Fax
//                                   </th>
//                                   <th className="border border-gray-300 p-2">
//                                     Email
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {consultants.map((consultant) => (
//                                   <tr
//                                     key={consultant._id}
//                                     className="hover:bg-gray-100"
//                                   >
//                                     <td className="p-2">
//                                       {consultant.Name || "N/A"}
//                                     </td>
//                                     <td className="p-2">
//                                       {consultant.Date_of_disconnection ||
//                                         "N/A"}
//                                     </td>
//                                     <td className="p-2">
//                                       {consultant.City || "N/A"}
//                                     </td>
//                                     <td className="p-2">
//                                       {consultant.Address || "N/A"}
//                                     </td>
//                                     <td className="p-2">
//                                       {consultant.Tel || "N/A"}
//                                     </td>
//                                     <td className="p-2">
//                                       {consultant.Fax || "N/A"}
//                                     </td>
//                                     <td className="p-2">
//                                       {consultant.Email || "N/A"}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           ) : (
//                             <p className="text-gray-600 italic">
//                               No legal consultants available.
//                             </p>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PartiesDetails;

const PartiesDetails = ({ caseData }) => {
  const [expandedParty, setExpandedParty] = useState(null);
  const parties = caseData?.Parties?.[0];

  if (!parties)
    return <p className="text-white">No party details available.</p>;

  const toggleExpand = (partyId) => {
    setExpandedParty(expandedParty === partyId ? null : partyId);
  };

  return (
    <div
      className="w-100 px-3 py-3 rounded-3 shadow-sm"
      style={{ backgroundColor: "#16213e" }}
    >
      <div className="row mb-4 text-white">
        <div className="col">
          <h5 className="fw-semibold">Heading: {parties?.heading || "N/A"}</h5>
        </div>
      </div>
      {/* Desktop Table */}
      <div
        className="table-responsive d-none d-md-block"
        style={{ backgroundColor: "#16213e" }}
      >
        <table
          className="table table-bordered table-hover table-striped text-white"
          style={{
            backgroundColor: "#16213e",
            borderColor: "#fff",
            color: "white",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#16213e",
                borderColor: "#fff",
              }}
            >
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                Party Number
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                Party Name
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                Title in Case
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  textAlign: "left",
                  verticalAlign: "middle",
                }}
              >
                Title after Judgment
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                  padding: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                Legal Consultants
              </th>
            </tr>
          </thead>
          <tbody>
            {(parties?.Parties_body || []).map((party) => {
              const consultants =
                party?.Legal_Consultants?.Legal_Consultants_header || [];

              return (
                <React.Fragment key={party._id}>
                  <tr style={{ backgroundColor: "#16213e" }}>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                      }}
                    >
                      {party.PartyNumber || "N/A"}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                      }}
                    >
                      {party.PartyName || "N/A"}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                      }}
                    >
                      {party.TitleInCase || "N/A"}
                    </td>
                    <td
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        color: "white",
                      }}
                    >
                      {party.TitleAfterJudgment || "N/A"}
                    </td>
                    <td
                      className="fw-bold text-center"
                      style={{
                        backgroundColor: "#16213e",
                        borderColor: "#fff",
                        cursor: "pointer",
                        color: "white",
                        padding: "0.5rem",
                        position: "relative",
                      }}
                      onClick={() => toggleExpand(party._id)}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 0,
                          height: 0,
                          borderLeft: "6px solid transparent",
                          borderRight: "6px solid transparent",
                          borderTop:
                            expandedParty === party._id
                              ? "none"
                              : "6px solid white",
                          borderBottom:
                            expandedParty === party._id
                              ? "6px solid white"
                              : "none",
                          verticalAlign: "middle",
                        }}
                      />
                    </td>
                  </tr>

                  {expandedParty === party._id && (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          backgroundColor: "#16213e",
                          borderColor: "#fff",
                          color: "white",
                        }}
                      >
                        <LegalConsultantsTable consultants={consultants} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {(parties?.Parties_body || []).map((party) => {
          const consultants =
            party?.Legal_Consultants?.Legal_Consultants_header || [];

          return (
            <div
              key={party._id}
              className="card mb-3 shadow-sm border-0 text-white"
              style={{ backgroundColor: "#16213e" }}
            >
              <div className="card-body">
                <p>
                  <strong>Party Number:</strong> {party.PartyNumber || "N/A"}
                </p>
                <p>
                  <strong>Party Name:</strong> {party.PartyName || "N/A"}
                </p>
                <p>
                  <strong>Title in Case:</strong> {party.TitleInCase || "N/A"}
                </p>
                <p>
                  <strong>Title after Judgment:</strong>{" "}
                  {party.TitleAfterJudgment || "N/A"}
                </p>

                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => toggleExpand(party._id)}
                >
                  {expandedParty === party._id
                    ? "Hide Consultants"
                    : "Show Consultants"}
                </button>

                {expandedParty === party._id && (
                  <div
                    className="mt-3"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    <LegalConsultantsTable consultants={consultants} isMobile />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LegalConsultantsTable = ({ consultants, isMobile }) => {
  if (!consultants.length) {
    return (
      <p className="text-light fst-italic">No legal consultants available.</p>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="table-responsive d-none d-md-block">
        <table
          className="table table-sm table-bordered mb-0 text-white"
          style={{
            backgroundColor: "#16213e",
            borderColor: "#fff",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#16213e" }}>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                }}
              >
                Name
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                }}
              >
                Date of Disconnection
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                }}
              >
                City
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                }}
              >
                Address
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                }}
              >
                Tel
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                }}
              >
                Fax
              </th>
              <th
                style={{
                  backgroundColor: "#16213e",
                  borderColor: "#fff",
                  color: "white",
                }}
              >
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {consultants.map((consultant) => (
              <tr key={consultant._id} style={{ backgroundColor: "#16213e" }}>
                <td
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                  }}
                >
                  {consultant.Name || "N/A"}
                </td>
                <td
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                  }}
                >
                  {consultant.Date_of_disconnection || "N/A"}
                </td>
                <td
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                  }}
                >
                  {consultant.City || "N/A"}
                </td>
                <td
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                  }}
                >
                  {consultant.Address || "N/A"}
                </td>
                <td
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                  }}
                >
                  {consultant.Tel || "N/A"}
                </td>
                <td
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                  }}
                >
                  {consultant.Fax || "N/A"}
                </td>
                <td
                  style={{
                    backgroundColor: "#16213e",
                    borderColor: "#fff",
                    color: "white",
                  }}
                >
                  {consultant.Email || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {consultants.map((consultant) => (
          <div
            className="card mb-3 shadow-sm border-0 text-white"
            style={{ backgroundColor: "#16213e" }}
            key={consultant._id}
          >
            <div className="card-body">
              <p>
                <strong>Name:</strong> {consultant.Name || "N/A"}
              </p>
              <p>
                <strong>Date of Disconnection:</strong>{" "}
                {consultant.Date_of_disconnection || "N/A"}
              </p>
              <p>
                <strong>City:</strong> {consultant.City || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {consultant.Address || "N/A"}
              </p>
              <p>
                <strong>Tel:</strong> {consultant.Tel || "N/A"}
              </p>
              <p>
                <strong>Fax:</strong> {consultant.Fax || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {consultant.Email || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PartiesDetails;
