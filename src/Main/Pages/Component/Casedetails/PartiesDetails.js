import React, { useState } from "react";

const PartiesDetails = ({ caseData }) => {
  const [expandedParty, setExpandedParty] = useState(null);
  const parties = caseData?.Parties?.[0];
  if (!parties) return <p>No party details available.</p>;

  const toggleExpand = (partyId) => {
    setExpandedParty(expandedParty === partyId ? null : partyId);
  };

  return (
    <div>
      <h5 className="text-lg font-semibold mb-4">
        Heading: {parties?.heading || "N/A"}
      </h5>

      <div className="overflow-x-auto">
        <table className="table-fixed w-full border border-gray-400">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-400 p-2 w-1/7">Party Number</th>
              <th className="border border-gray-400 p-2 w-1/7">Party Name</th>
              <th className="border border-gray-400 p-2 w-1/7">
                Title in Case
              </th>
              <th className="border border-gray-400 p-2 w-1/7">
                Title after Judgment
              </th>
              <th className="border border-gray-400 p-2 w-1/7">
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
                  <tr className="hover:bg-gray-100">
                    <td className="p-2">{party.PartyNumber || "N/A"}</td>
                    <td className="p-2">{party.PartyName || "N/A"}</td>
                    <td className="p-2">{party.TitleInCase || "N/A"}</td>
                    <td className="p-2">{party.TitleAfterJudgment || "N/A"}</td>
                    <td
                      className="p-2 text-sm cursor-pointer"
                      onClick={() => toggleExpand(party._id)}
                    >
                      {expandedParty === party._id ? "▲" : "▼"}
                    </td>
                  </tr>

                  {expandedParty === party._id && (
                    <tr>
                      <td colSpan="5">
                        <div className="overflow-x-auto mt-2 p-2 bg-gray-100 border border-gray-400">
                          <h4 className="text-sm font-semibold mb-2">
                            Legal Consultants
                          </h4>

                          {consultants.length > 0 ? (
                            <table className="table-fixed w-full border border-gray-300">
                              <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                  <th className="border border-gray-300 p-2">
                                    Name
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Date of Disconnection
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    City
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Address
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Tel
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Fax
                                  </th>
                                  <th className="border border-gray-300 p-2">
                                    Email
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {consultants.map((consultant) => (
                                  <tr
                                    key={consultant._id}
                                    className="hover:bg-gray-100"
                                  >
                                    <td className="p-2">
                                      {consultant.Name || "N/A"}
                                    </td>
                                    <td className="p-2">
                                      {consultant.Date_of_disconnection ||
                                        "N/A"}
                                    </td>
                                    <td className="p-2">
                                      {consultant.City || "N/A"}
                                    </td>
                                    <td className="p-2">
                                      {consultant.Address || "N/A"}
                                    </td>
                                    <td className="p-2">
                                      {consultant.Tel || "N/A"}
                                    </td>
                                    <td className="p-2">
                                      {consultant.Fax || "N/A"}
                                    </td>
                                    <td className="p-2">
                                      {consultant.Email || "N/A"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="text-gray-600 italic">
                              No legal consultants available.
                            </p>
                          )}
                        </div>
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

export default PartiesDetails;
