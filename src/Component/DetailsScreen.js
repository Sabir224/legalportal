import React, { useState } from "react";

const data = {

  "_id": "67a2117fa70023929b4c23b9",
  "FKCaseId": "678cda1990e050e0b9020cbb",
  "Parties": [
    {
      "heading": "Party Heading Example",
      "Parties_header": [
        {
          "PartyNumber": "12345",
          "PartyName": "John Doe",
          "TitleInCase": "Plaintiff",
          "TitleAfterJudgment": "Winner",
          "_id": "67a2117fa70023929b4c23bb"
        }
      ],
      "Parties_body": [
        {
          "Legal_Consultants": {
            "Legal_Consultants_header": [
              {
                "Name": "Jane Smith",
                "Date_of_disconnection": "",
                "City": "New York",
                "Address": "123 Main St",
                "Tel": "123-456-7890",
                "Fax": "123-456-7891",
                "Email": "jane@example.com",
                "_id": "67a2117fa70023929b4c23bd"
              }
            ]
          },
          "PartyNumber": "12345",
          "PartyName": "John Doe",
          "TitleInCase": "Plaintiff",
          "TitleAfterJudgment": "Winner",
          "Agents_or_LegalConsultants": "Some Agent",
          "_id": "67a2117fa70023929b4c23bc"
        },
        {
          "Legal_Consultants": {
            "Legal_Consultants_header": []
          },
          "PartyNumber": "12345",
          "PartyName": "John Doe",
          "TitleInCase": "Plaintiff",
          "TitleAfterJudgment": "Winner",
          "Agents_or_LegalConsultants": "Some Agent",
          "_id": "67a2117fa70023929b4c23be"
        }
      ],
      "_id": "67a2117fa70023929b4c23ba"
    }
  ],
  "Exhibits": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Detailed Description",
      "Session Date",
      "Attachment Date",
      "Party Name",
      "Attachment"
    ],
    "body": [
      {
        "Party_Name": {
          "submitter": {
            "PartyName": "بوشبيش اوميش شارما اوميش تشوكيدوت شارما",
            "PartyType": "Summoner",
            "_id": "67a2117fa70023929b4c23c1"
          }
        },
        "Detailed_Description": "34538 / 2025",
        "Session_Date": "",
        "Attachment_Date": "28-01-2025 14:48:52",
        "Attachment": "Details",
        "_id": "67a2117fa70023929b4c23c0"
      }
    ],
    "_id": "67a2117fa70023929b4c23bf"
  },
  "Documents": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Detailed Description",
      "Session Date",
      "Attachment Date",
      "Party Name",
      "Attachment"
    ],
    "body": [
      {
        "Party_Name": {
          "submitter": {
            "PartyName": "بوشبيش اوميش شارما اوميش تشوكيدوت شارما",
            "PartyType": "Summoner",
            "_id": "67a2117fa70023929b4c23c4"
          }
        },
        "Detailed_Description": "34538 / 2025  - صورة عن جواز السفر أو اثبات الهوية",
        "Session_Date": "",
        "Attachment_Date": "29-01-2025 02:53:00",
        "Attachment": "",
        "_id": "67a2117fa70023929b4c23c3"
      }
    ],
    "_id": "67a2117fa70023929b4c23c2"
  },
  "Notices": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Notice number",
      "Notice Type",
      "Registration date",
      "Notice Party",
      "Notice Party Description"
    ],
    "body": [
      {
        "Notice_number": "N-2025-001",
        "Notice_Type": "Legal Notice",
        "Registration_date": "2025-01-30",
        "Notice_Party": "John Doe",
        "Notice_Party_Description": "Plaintiff in the case",
        "_id": "67a2117fa70023929b4c23c6"
      },
      {
        "Notice_number": "N-2025-002",
        "Notice_Type": "Hearing Notice",
        "Registration_date": "2025-01-31",
        "Notice_Party": "Jane Smith",
        "Notice_Party_Description": "Defendant in the case",
        "_id": "67a2117fa70023929b4c23c7"
      }
    ],
    "_id": "67a2117fa70023929b4c23c5"
  },
  "PublishedNotices": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Notice Number",
      "Insertion Date",
      "Notice Type",
      "Journal Name",
      "Journal Number",
      "Journal Issue Date"
    ],
    "body": [
      {
        "Notice_Number": "PN-2025-001",
        "Insertion_Date": "2025-02-01",
        "Notice_Type": "Public Announcement",
        "Journal_Name": "Official Gazette",
        "Journal_Number": "78",
        "Journal_Issue_Date": "2025-02-02",
        "_id": "67a2117fa70023929b4c23c9"
      },
      {
        "Notice_Number": "PN-2025-002",
        "Insertion_Date": "2025-02-05",
        "Notice_Type": "Court Order",
        "Journal_Name": "Legal News",
        "Journal_Number": "15",
        "Journal_Issue_Date": "2025-02-06",
        "_id": "67a2117fa70023929b4c23ca"
      }
    ],
    "_id": "67a2117fa70023929b4c23c8"
  },
  "Petitions": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Petition Number",
      "Subject",
      "Petition Date",
      "Petition Details",
      "Applicant"
    ],
    "body": [
      {
        "Petition_Number": "P-001",
        "_id": "67a2117fa70023929b4c23cc"
      }
    ],
    "_id": "67a2117fa70023929b4c23cb"
  },
  "Effsah_Platform_Orders": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Request Number",
      "Case Number",
      "Service Name",
      "Request Date",
      "Judge Name",
      "Request Status"
    ],
    "body": [
      {
        "Request_Number": "R-001",
        "_id": "67a2117fa70023929b4c23ce"
      }
    ],
    "_id": "67a2117fa70023929b4c23cd"
  },
  "Experience_Reports": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Decision Number",
      "Expert Name",
      "Mission Ascription Date",
      "Expected Submission Date",
      "Actual Submission Date"
    ],
    "body": [
      {
        "Decision_Number": "EXP-001",
        "_id": "67a2117fa70023929b4c23d0"
      }
    ],
    "_id": "67a2117fa70023929b4c23cf"
  },
  "Public_Prosecution_Reports": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Petition Number",
      "Subject",
      "Petition Date",
      "Petition Details",
      "Applicant"
    ],
    "body": [
      {
        "Petition_Number": "PP-2025-001",
        "_id": "67a2117fa70023929b4c23d2"
      },
      {
        "Petition_Number": "PP-2025-002",
        "_id": "67a2117fa70023929b4c23d3"
      }
    ],
    "_id": "67a2117fa70023929b4c23d1"
  },
  "Social_Researcher_Reports": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Petition Number",
      "Subject",
      "Petition Date",
      "Petition Details",
      "Applicant"
    ],
    "body": [
      {
        "Petition_Number": "SR-2025-001",
        "_id": "67a2117fa70023929b4c23d5"
      },
      {
        "Petition_Number": "SR-2025-002",
        "_id": "67a2117fa70023929b4c23d6"
      }
    ],
    "_id": "67a2117fa70023929b4c23d4"
  },
  "Related_Cases": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Case Number",
      "Claimed Amount",
      "Registration Date",
      "Judgment Date",
      "Case Status",
      "Total Actual Fees Acquired"
    ],
    "body": [
      {
        "Case_Number": "RC-2025-001",
        "_id": "67a2117fa70023929b4c23d8"
      },
      {
        "Case_Number": "RC-2025-002",
        "_id": "67a2117fa70023929b4c23d9"
      }
    ],
    "_id": "67a2117fa70023929b4c23d7"
  },
  "Joined_Cases": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Case Number",
      "Join Type",
      "Join Date",
      "Join End Date",
      "Join Reason",
      "Details"
    ],
    "body": [
      {
        "Case_Number": "JC-2025-001",
        "_id": "67a2117fa70023929b4c23db"
      },
      {
        "Case_Number": "JC-2025-002",
        "_id": "67a2117fa70023929b4c23dc"
      }
    ],
    "_id": "67a2117fa70023929b4c23da"
  },
  "Settlements_Legal_Reasoned_Decisions": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Settlement Decision Number",
      "Settlement Number",
      "Settlement Date",
      "Detailed Settlement Type"
    ],
    "body": [
      {
        "Settlement_Decision_Number": "12345",
        "Settlement_Number": "67890",
        "Settlement_Date": "2025-01-15T00:00:00.000Z",
        "Detailed_Settlement_Type": "Divorce Agreement",
        "_id": "67a2117fa70023929b4c23de"
      }
    ],
    "_id": "67a2117fa70023929b4c23dd"
  },
  "Related_Claims_And_SubClaims": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Case Number",
      "Litigation Stage",
      "Registration Date",
      "Verdict Date"
    ],
    "body": [
      {
        "Case_Number": "56789",
        "Litigation_Stage": "Appeal",
        "Registration_Date": "2024-12-01T00:00:00.000Z",
        "Verdict_Date": "2025-01-10T00:00:00.000Z",
        "_id": "67a2117fa70023929b4c23e0"
      }
    ],
    "_id": "67a2117fa70023929b4c23df"
  },
  "Arrest_Orders": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Order Number",
      "Decision Date",
      "Applicant Name",
      "Party Name",
      "Arrest Reason",
      "Amount",
      "Status",
      "Refrain Date",
      "Refrainer"
    ],
    "body": [
      {
        "Order_Number": "A12345",
        "Decision_Date": "2025-02-01T00:00:00.000Z",
        "Applicant_Name": "John Doe",
        "Party_Name": "Jane Smith",
        "Arrest_Reason": "Non-payment of alimony",
        "Amount": 5000,
        "Status": "Pending",
        "Refrain_Date": null,
        "Refrainer": "Court Order",
        "_id": "67a2117fa70023929b4c23e2"
      }
    ],
    "_id": "67a2117fa70023929b4c23e1"
  },
  "Detentions": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Order Number",
      "Decision Abstract",
      "Order Type",
      "Order Date",
      "Start Date",
      "Actual Start Date"
    ],
    "body": [
      {
        "Order_Number": "D56789",
        "Decision_Abstract": "Temporary Detention for Investigation",
        "Order_Type": "Preventive Detention",
        "Order_Date": "2025-02-10T00:00:00.000Z",
        "Start_Date": "2025-02-15T00:00:00.000Z",
        "Actual_Start_Date": "2025-02-16T00:00:00.000Z",
        "_id": "67a2117fa70023929b4c23e4"
      }
    ],
    "_id": "67a2117fa70023929b4c23e3"
  },
  "Bans": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Party",
      "Type",
      "Ban date",
      "Current status"
    ],
    "body": [
      {
        "Party": "Jane Smith",
        "Type": "Travel Ban",
        "Ban_Date": "2025-01-20T00:00:00.000Z",
        "Current_Status": "Active",
        "_id": "67a2117fa70023929b4c23e6"
      }
    ],
    "_id": "67a2117fa70023929b4c23e5"
  },
  "Seizures": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Applicant",
      "Party Name",
      "Decision Date",
      "Claimed Amount",
      "Seizure Status",
      "Description"
    ],
    "body": [
      {
        "Applicant": "John Doe",
        "Party_Name": "Jane Smith",
        "Decision_Date": "2025-01-25T00:00:00.000Z",
        "Claimed_Amount": 20000,
        "Seizure_Status": "Executed",
        "Description": "Bank account seizure",
        "_id": "67a2117fa70023929b4c23e8"
      }
    ],
    "_id": "67a2117fa70023929b4c23e7"
  },
  "Auctions": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Notice Number",
      "Insertion Date",
      "Notice Type",
      "Applicant",
      "Party",
      "Notice Party Description"
    ],
    "body": [
      {
        "Notice_Number": "AU-1001",
        "Insertion_Date": "2025-02-01",
        "Notice_Type": "Public Auction",
        "Applicant": "City Court",
        "Party": "John Doe",
        "Notice_Party_Description": "Auction for property liquidation",
        "_id": "67a2117fa70023929b4c23ea"
      }
    ],
    "_id": "67a2117fa70023929b4c23e9"
  },
  "Seized_Documents": {
    "heading": "Seized Documents",
    "header": [
      "Document number",
      "Party name",
      "Type",
      "Seizure date",
      "Status",
      "Description",
      "Notes",
      "Release date"
    ],
    "body": [
      {
        "Document_Number": "DOC-2025-001",
        "Party_Name": "Jane Doe",
        "Type": "Legal",
        "Seizure_Date": "2025-02-02T00:00:00.000Z",
        "Status": "Pending Review",
        "Description": "Confiscated legal documents",
        "Notes": "Under review by court",
        "Release_Date": "2025-03-01T00:00:00.000Z",
        "_id": "67a2117fa70023929b4c23ec"
      }
    ],
    "_id": "67a2117fa70023929b4c23eb"
  },
  "Case_Letters": {
    "heading": "Case Letters",
    "header": [
      "Letter No.",
      "Letter Type",
      "Letter Date",
      "Addressee Name",
      "Letter Body Text"
    ],
    "body": [
      {
        "Letter_No": "CL-2025-001",
        "Letter_Type": "Summons",
        "Letter_Date": "2025-02-01T00:00:00.000Z",
        "Addressee_Name": "John Doe",
        "Letter_Body_Text": "You are required to appear in court on the given date.",
        "_id": "67a2117fa70023929b4c23ee"
      }
    ],
    "_id": "67a2117fa70023929b4c23ed"
  },
  "Mr_Letters": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Letter type",
      "Letter number",
      "Letter date",
      "Authority",
      "Subject",
      "Letter"
    ],
    "body": [
      {
        "Letter_Type": "Official Notice",
        "Letter_Number": "MRL-2025-002",
        "Letter_Date": "2025-02-02T00:00:00.000Z",
        "Authority": "Legal Affairs",
        "Subject": "Hearing Update",
        "Letter": "Your case hearing is scheduled for next Monday.",
        "_id": "67a2117fa70023929b4c23f0"
      }
    ],
    "_id": "67a2117fa70023929b4c23ef"
  },
  "Payments": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Voucher number",
      "Date",
      "Value",
      "Status",
      "Countersign",
      "Beneficiary",
      "Payment type",
      "Payment Method",
      "Details"
    ],
    "body": [
      {
        "Voucher_Number": "PAY-2025-002",
        "Date": "2025-02-03T00:00:00.000Z",
        "Value": 2500,
        "Status": "Processed",
        "Countersign": "Treasury Dept.",
        "Beneficiary": "Jane Smith",
        "Payment_Type": "Compensation",
        "Payment_Method": "Bank Transfer",
        "Details": "Payment for case settlement.",
        "_id": "67a2117fa70023929b4c23f2"
      }
    ],
    "_id": "67a2117fa70023929b4c23f1"
  },
  "Deposit_Vouchers": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Year",
      "Type",
      "Amount"
    ],
    "body": [
      {
        "Year": 2025,
        "Type": "Court Fees",
        "Amount": 10000,
        "_id": "67a2117fa70023929b4c23f4"
      }
    ],
    "_id": "67a2117fa70023929b4c23f3"
  },
  "Claims": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Initial Claim Amount",
      "Current Claim Amount",
      "Balance Claim Amount",
      "Claim Details"
    ],
    "body": [
      {
        "Initial_Claim_Amount": 50000,
        "Current_Claim_Amount": 48000,
        "Balance_Claim_Amount": 2000,
        "Claim_Details": "Pending verification from legal department.",
        "_id": "67a2117fa70023929b4c23f6"
      }
    ],
    "_id": "67a2117fa70023929b4c23f5"
  },
  "Related_Case_Reg_Apps": {
    "heading": "491 / 2025 / 73 Marital matters for non-Muslims",
    "header": [
      "Application Number",
      "First submit Date",
      "Application Status",
      "Status Date",
      "Case Number"
    ],
    "body": [
      {
        "Application_Number": "RCA-2025-002",
        "First_Submit_Date": "2025-01-25T00:00:00.000Z",
        "Application_Status": "Under Review",
        "Status_Date": "2025-02-02T00:00:00.000Z",
        "Case_Number": "CASE-2025-003",
        "_id": "67a2117fa70023929b4c23f8"
      }
    ],
    "_id": "67a2117fa70023929b4c23f7"
  },
  "__v": 0

};

const DetailsScreen = () => {
  const [openSections, setOpenSections] = useState([]);

  const sections = Object.keys(data);

  const toggleSection = (section) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Case Details</h1>
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => toggleSection(section)}
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
          >
            {section}
          </button>
        ))}
      </div>

      {openSections.map((section) => (
        <div key={section} className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h2 className="text-xl font-semibold">{section}</h2>
          <Details section={section} data={data[section]} />
        </div>
      ))}
    </div>
  );
};

const Details = ({ section, data }) => {
  if (Array.isArray(data)) {
    return (
      <ul className="list-disc pl-5">
        {data.map((item, index) => (
          <li key={index} className="mb-2">
            {JSON.stringify(item, null, 2)}
          </li>
        ))}
      </ul>
    );
  } else if (typeof data === "object") {
    return (
      <pre className="bg-white p-2 rounded-lg">{JSON.stringify(data, null, 2)}</pre>
    );
  } else {
    return <p>No details available.</p>;
  }
};

export default DetailsScreen;
