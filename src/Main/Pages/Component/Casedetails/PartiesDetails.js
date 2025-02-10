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
      <h5 className="text-lg font-semibold mb-4">Heading: {parties?.heading || "N/A"}</h5>

      {/* Parties Table */}
      <div className="overflow-x-auto">
        <table className="table-fixed w-full border border-gray-400">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-400 p-2 w-1/7">Party Number</th>
              <th className="border border-gray-400 p-2 w-1/7">Party Name</th>
              <th className="border border-gray-400 p-2 w-1/7">Title in Case</th>
              <th className="border border-gray-400 p-2 w-1/7">Title after Judgment</th>
              <th className="border border-gray-400 p-2 w-1/7">Legal Consultants</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(parties?.Parties_header) || Array.isArray(parties?.Parties_body)) &&
              [ ...(parties?.Parties_body || [])].map((party) => (
              // [...(parties?.Parties_header || []), ...(parties?.Parties_body || [])].map((party) => (
                <React.Fragment key={party._id || party.PartyNumber}>
                  <tr
                    className="hover:bg-gray-100 cursor-pointer"
                   
                  >
                    <td className="p-2">{party.PartyNumber || "N/A"}</td>
                    <td className="p-2 ">{party.PartyName || "N/A"}</td>
                    <td className="p-2 ">{party.TitleInCase || "N/A"}</td>
                    <td className="p-2 ">{party.TitleAfterJudgment || "N/A"}</td>
                    <td className="p-2  text-center"   onClick={() => toggleExpand(party._id)} style={{cursor:'pointer'}}>{expandedParty === party._id ? "▲" : "▼"}</td>
                  </tr>

                  {expandedParty === party._id && party?.Legal_Consultants?.Legal_Consultants_header?.length > 0 && (
                    <tr>
                      <td colSpan="5">
                        <div className="overflow-x-auto mt-2 p-2 bg-gray-100 border border-gray-400 " style={{background:""}}>
                          <h4 className="text-lg font-semibold mb-2">Legal Consultants</h4>
                          {/* <table className="table-fixed w-full border border-gray-400"> */}
                            <thead>
                              <tr className="bg-gray-200 text-gray-700">
                                <th className="border border-gray-400 p-2">Name</th>
                                <th className="border border-gray-400 p-2">Date of Disconnection</th>
                                <th className="border border-gray-400 p-2">City</th>
                                <th className="border border-gray-400 p-2">Address</th>
                                <th className="border border-gray-400 p-2">Tel</th>
                                <th className="border border-gray-400 p-2">Fax</th>
                                <th className="border border-gray-400 p-2">Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {party.Legal_Consultants.Legal_Consultants_header.map((consultant) => (
                                <tr key={consultant._id} className="hover:bg-gray-100">
                                  <td className="p-2">{consultant.Name || "N/A"}</td>
                                  <td className="p-2 ">{consultant.Date_of_disconnection || "N/A"}</td>
                                  <td className="p-2 ">{consultant.City || "N/A"}</td>
                                  <td className="p-2">{consultant.Address || "N/A"}</td>
                                  <td className="p-2 ">{consultant.Tel || "N/A"}</td>
                                  <td className="p-2">{consultant.Fax || "N/A"}</td>
                                  <td className="p-2 ">{consultant.Email || "N/A"}</td>
                                </tr>
                              ))}
                            </tbody>
                          {/* </table> */}
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

export default PartiesDetails;
