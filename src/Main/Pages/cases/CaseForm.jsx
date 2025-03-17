import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";

const AddCaseForm = () => {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      caseNumber: "",
      caseName: "",
      status: "Open",
      parties: [{ partyNumber: "", partyName: "", titleInCase: "" }],
      exhibits: [{ description: "", attachmentDate: "", submitter: "" }],
      notices: [{ noticeNumber: "", noticeType: "", registrationDate: "" }],
      decisions: [{ decisionNumber: "" }],
      petitions: [{ petitionNumber: "" }],
      effsahOrders: [{ requestNumber: "" }],
      experienceReports: [{ decisionNumber: "" }],
      relatedCases: [{ caseNumber: "" }],
      joinedCases: [{ caseNumber: "" }],
      reports: [{ petitionNumber: "" }],
      settlements: [
        {
          settlementDecisionNumber: "",
          settlementNumber: "",
          settlementDate: "",
          detailedSettlementType: "",
        },
      ],
      relatedClaims: [
        {
          caseNumber: "",
          litigationStage: "",
          registrationDate: "",
          verdictDate: "",
        },
      ],
      arrestOrders: [
        {
          orderNumber: "",
          decisionDate: "",
          applicantName: "",
          partyName: "",
          arrestReason: "",
          amount: "",
          status: "",
          refrainDate: "",
          refrainer: "",
        },
      ],

      detentions: [
        {
          orderNumber: "",
          decisionAbstract: "",
          orderType: "",
          orderDate: "",
          startDate: "",
          actualStartDate: "",
        },
      ],
      bans: [{ party: "", type: "", banDate: "", currentStatus: "" }],
      seizures: [
        {
          applicant: "",
          partyName: "",
          decisionDate: "",
          claimedAmount: "",
          seizureStatus: "",
          description: "",
        },
      ],
      auctions: [
        {
          noticeNumber: "",
          insertionDate: "",
          noticeType: "",
          applicant: "",
          party: "",
          noticePartyDescription: "",
        },
      ],
      seizedDocuments: [
        {
          documentNumber: "",
          partyName: "",
          type: "",
          seizureDate: "",
          status: "",
          description: "",
          notes: "",
          releaseDate: "",
        },
      ],
      caseLetters: [
        {
          letterNo: "",
          letterType: "",
          letterDate: "",
          addresseeName: "",
          letterBodyText: "",
        },
      ],
      mrLetters: [
        {
          letterType: "",
          letterNumber: "",
          letterDate: "",
          authority: "",
          subject: "",
          letter: "",
        },
      ],
      payments: [
        {
          voucherNumber: "",
          date: "",
          value: "",
          status: "",
          countersign: "",
          beneficiary: "",
          paymentType: "",
          paymentMethod: "",
          details: "",
        },
      ],
      depositVouchers: [{ year: "", type: "", amount: "" }],
      claims: [
        {
          initialClaimAmount: "",
          currentClaimAmount: "",
          balanceClaimAmount: "",
          claimDetails: "",
        },
      ],
      relatedCaseRegApps: [
        {
          applicationNumber: "",
          firstSubmitDate: "",
          applicationStatus: "",
          statusDate: "",
          caseNumber: "",
        },
      ],
    },
  });

  const { fields: partyFields, append: addParty } = useFieldArray({
    control,
    name: "parties",
  });
  const { fields: exhibitFields, append: addExhibit } = useFieldArray({
    control,
    name: "exhibits",
  });
  const { fields: noticeFields, append: addNotice } = useFieldArray({
    control,
    name: "notices",
  });
  const { fields: decisionFields, append: addDecision } = useFieldArray({
    control,
    name: "decisions",
  });
  const { fields: petitionFields, append: addPetition } = useFieldArray({
    control,
    name: "petitions",
  });
  const { fields: effsahFields, append: addEffsah } = useFieldArray({
    control,
    name: "effsahOrders",
  });
  const { fields: experienceReportFields, append: addExperienceReport } =
    useFieldArray({ control, name: "experienceReports" });
  const { fields: relatedCasesFields, append: addRelatedCase } = useFieldArray({
    control,
    name: "relatedCases",
  });
  const { fields: joinedCasesFields, append: addJoinedCase } = useFieldArray({
    control,
    name: "joinedCases",
  });
  const { fields: reportsFields, append: addReport } = useFieldArray({
    control,
    name: "reports",
  });
  const { fields: settlementsFields, append: addSettlement } = useFieldArray({
    control,
    name: "settlements",
  });
  const { fields: relatedClaimsFields, append: addRelatedClaim } =
    useFieldArray({ control, name: "relatedClaims" });
  const { fields: arrestOrdersFields, append: addArrestOrder } = useFieldArray({
    control,
    name: "arrestOrders",
  });
  const { fields: detentionsFields, append: addDetention } = useFieldArray({
    control,
    name: "detentions",
  });
  const { fields: bansFields, append: addBan } = useFieldArray({
    control,
    name: "bans",
  });
  const { fields: seizuresFields, append: addSeizure } = useFieldArray({
    control,
    name: "seizures",
  });
  const { fields: auctionsFields, append: addAuction } = useFieldArray({
    control,
    name: "auctions",
  });

  const { fields: paymentsFields, append: addPayment } = useFieldArray({
    control,
    name: "payments",
  });
  const { fields: seizedDocumentsFields, append: addSeizedDocument } =
    useFieldArray({ control, name: "seizedDocuments" });
  const { fields: caseLettersFields, append: addCaseLetter } = useFieldArray({
    control,
    name: "caseLetters",
  });
  const { fields: mrLettersFields, append: addMrLetter } = useFieldArray({
    control,
    name: "mrLetters",
  });
  const { fields: depositVouchersFields, append: addDepositVoucher } =
    useFieldArray({ control, name: "depositVouchers" });
  const { fields: claimsFields, append: addClaim } = useFieldArray({
    control,
    name: "claims",
  });
  const { fields: relatedCaseRegAppsFields, append: addRelatedCaseRegApp } =
    useFieldArray({ control, name: "relatedCaseRegApps" });
  const onSubmit = (data) => {
    console.log("Form Data:", data);
    // Send data to API
  };
  //   const onSubmit = async (data) => {
  //     try {
  //       const response = await axios.post("http://your-api-url.com/add-case", data);
  //       console.log("Case Added Successfully:", response.data);
  //       alert("Case Added Successfully!");
  //     } catch (error) {
  //       console.error("Error adding case:", error);
  //       alert("Error adding case. Please try again.");
  //     }
  //   };
  return (
    <div
      className="container  justify-content-center mt-4 "
      style={{
        maxHeight: "80vh",
        overflowY: "auto",
        minWidth: "30vw",
      }}
    >
      <h2>Add Case Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded">
        {/* Case Details */}
        <div className="mb-3">
          <label>Case Number:</label>
          <input
            className="form-control"
            {...register("caseNumber")}
            required
          />
        </div>

        <div className="mb-3">
          <label>Case Name:</label>
          <input className="form-control" {...register("caseName")} required />
        </div>

        <div className="mb-3">
          <label>Status:</label>
          <select className="form-control" {...register("status")}>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Parties Section */}
        <h4>Parties</h4>
        {partyFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Party Number"
              className="form-control mb-2"
              {...register(`parties.${index}.partyNumber`)}
              required
            />
            <input
              placeholder="Party Name"
              className="form-control mb-2"
              {...register(`parties.${index}.partyName`)}
              required
            />
            <input
              placeholder="Title In Case"
              className="form-control"
              {...register(`parties.${index}.titleInCase`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addParty({ partyNumber: "", partyName: "", titleInCase: "" })
            }
          >
            Add Party
          </button>
        </div>

        {/* Exhibits Section */}
        <h4>Exhibits</h4>
        {exhibitFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Description"
              className="form-control mb-2"
              {...register(`exhibits.${index}.description`)}
              required
            />
            <input
              type="date"
              className="form-control mb-2"
              {...register(`exhibits.${index}.attachmentDate`)}
              required
            />
            <input
              placeholder="Submitter"
              className="form-control"
              {...register(`exhibits.${index}.submitter`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addExhibit({ description: "", attachmentDate: "", submitter: "" })
            }
          >
            Add Exhibit
          </button>
        </div>

        {/* Notices Section */}
        <h4>Notices</h4>
        {noticeFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Notice Number"
              className="form-control mb-2"
              {...register(`notices.${index}.noticeNumber`)}
              required
            />
            <input
              placeholder="Notice Type"
              className="form-control mb-2"
              {...register(`notices.${index}.noticeType`)}
            />
            <input
              type="date"
              className="form-control"
              {...register(`notices.${index}.registrationDate`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addNotice({
                noticeNumber: "",
                noticeType: "",
                registrationDate: "",
              })
            }
          >
            Add Notice
          </button>
        </div>

        {/* Decisions Section */}
        <h4>Decisions</h4>
        {decisionFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Decision Number"
              className="form-control"
              {...register(`decisions.${index}.decisionNumber`)}
              required
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addDecision({ decisionNumber: "" })}
          >
            Add Decision
          </button>
        </div>

        {/* Petitions Section */}
        <h4>Petitions</h4>
        {petitionFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Petition Number"
              className="form-control"
              {...register(`petitions.${index}.petitionNumber`)}
              required
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addPetition({ petitionNumber: "" })}
          >
            Add Petition
          </button>
        </div>

        {/* Effsah Orders Section */}
        <h4>Effsah Orders</h4>
        {effsahFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Request Number"
              className="form-control"
              {...register(`effsahOrders.${index}.requestNumber`)}
              required
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addEffsah({ requestNumber: "" })}
          >
            Add Effsah Order
          </button>
        </div>

        {/* Experience Reports */}
        <h4>Experience Reports</h4>
        {experienceReportFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Decision Number"
              className="form-control"
              {...register(`experienceReports.${index}.decisionNumber`)}
              required
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addExperienceReport({ decisionNumber: "" })}
          >
            Add Experience Report
          </button>
        </div>

        {/* Related Cases */}
        <h4>Related Cases</h4>
        {relatedCasesFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Case Number"
              className="form-control"
              {...register(`relatedCases.${index}.caseNumber`)}
              required
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addRelatedCase({ caseNumber: "" })}
          >
            Add Related Case
          </button>
        </div>

        {/* Joined Cases */}
        <h4>Joined Cases</h4>
        {joinedCasesFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Case Number"
              className="form-control"
              {...register(`joinedCases.${index}.caseNumber`)}
              required
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addJoinedCase({ caseNumber: "" })}
          >
            Add Joined Case
          </button>
        </div>

        {/* Reports */}
        <h4>Reports</h4>
        {reportsFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Petition Number"
              className="form-control"
              {...register(`reports.${index}.petitionNumber`)}
              required
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addReport({ petitionNumber: "" })}
          >
            Add Report
          </button>
        </div>

        {/* Settlements */}
        <h4>Settlements</h4>
        {settlementsFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Settlement Decision Number"
              className="form-control mb-2"
              {...register(`settlements.${index}.settlementDecisionNumber`)}
              required
            />
            <input
              placeholder="Settlement Number"
              className="form-control mb-2"
              {...register(`settlements.${index}.settlementNumber`)}
            />
            <input
              type="date"
              className="form-control mb-2"
              {...register(`settlements.${index}.settlementDate`)}
            />
            <input
              placeholder="Detailed Settlement Type"
              className="form-control"
              {...register(`settlements.${index}.detailedSettlementType`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addSettlement({
                settlementDecisionNumber: "",
                settlementNumber: "",
                settlementDate: "",
                detailedSettlementType: "",
              })
            }
          >
            Add Settlement
          </button>
        </div>

        {/* Related Claims */}
        <h4>Related Claims</h4>
        {relatedClaimsFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Case Number"
              className="form-control mb-2"
              {...register(`relatedClaims.${index}.caseNumber`)}
              required
            />
            <input
              placeholder="Litigation Stage"
              className="form-control mb-2"
              {...register(`relatedClaims.${index}.litigationStage`)}
            />
            <input
              type="date"
              className="form-control mb-2"
              {...register(`relatedClaims.${index}.registrationDate`)}
            />
            <input
              type="date"
              className="form-control"
              {...register(`relatedClaims.${index}.verdictDate`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addRelatedClaim({
                caseNumber: "",
                litigationStage: "",
                registrationDate: "",
                verdictDate: "",
              })
            }
          >
            Add Related Claim
          </button>
        </div>

        {/* Arrest Orders */}
        <h4>Arrest Orders</h4>
        {arrestOrdersFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Order Number"
              className="form-control mb-2"
              {...register(`arrestOrders.${index}.orderNumber`)}
              required
            />
            <input
              type="date"
              className="form-control mb-2"
              {...register(`arrestOrders.${index}.decisionDate`)}
            />
            <input
              placeholder="Applicant Name"
              className="form-control mb-2"
              {...register(`arrestOrders.${index}.applicantName`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addArrestOrder({
                orderNumber: "",
                decisionDate: "",
                applicantName: "",
              })
            }
          >
            Add Arrest Order
          </button>
        </div>
        {/* Detentions Section */}
        <h4>Detentions</h4>
        {detentionsFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Order Number"
              className="form-control mb-2"
              {...register(`detentions.${index}.Order_Number`)}
              required
            />
            <input
              placeholder="Decision Abstract"
              className="form-control mb-2"
              {...register(`detentions.${index}.Decision_Abstract`)}
            />
            <input
              type="date"
              className="form-control"
              {...register(`detentions.${index}.Order_Date`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addDetention({
                Order_Number: "",
                Decision_Abstract: "",
                Order_Date: "",
              })
            }
          >
            Add Detention
          </button>
        </div>

        {/* Bans Section */}
        <h4>Bans</h4>
        {bansFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Party"
              className="form-control mb-2"
              {...register(`bans.${index}.Party`)}
              required
            />
            <input
              placeholder="Ban Type"
              className="form-control mb-2"
              {...register(`bans.${index}.Type`)}
            />
            <input
              type="date"
              className="form-control"
              {...register(`bans.${index}.Ban_Date`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addBan({ Party: "", Type: "", Ban_Date: "" })}
          >
            Add Ban
          </button>
        </div>

        {/* Seizures Section */}
        <h4>Seizures</h4>
        {seizuresFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Applicant"
              className="form-control mb-2"
              {...register(`seizures.${index}.Applicant`)}
              required
            />
            <input
              placeholder="Party Name"
              className="form-control mb-2"
              {...register(`seizures.${index}.Party_Name`)}
            />
            <input
              type="number"
              className="form-control"
              {...register(`seizures.${index}.Claimed_Amount`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addSeizure({ Applicant: "", Party_Name: "", Claimed_Amount: 0 })
            }
          >
            Add Seizure
          </button>
        </div>

        {/* Auctions Section */}
        <h4>Auctions</h4>
        {auctionsFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Notice Number"
              className="form-control mb-2"
              {...register(`auctions.${index}.Notice_Number`)}
              required
            />
            <input
              placeholder="Applicant"
              className="form-control mb-2"
              {...register(`auctions.${index}.Applicant`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => addAuction({ Notice_Number: "", Applicant: "" })}
          >
            Add Auction
          </button>
        </div>

        {/* Payments Section */}
        <h4>Payments</h4>
        {paymentsFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Voucher Number"
              className="form-control mb-2"
              {...register(`payments.${index}.Voucher_Number`)}
              required
            />
            <input
              type="date"
              className="form-control mb-2"
              {...register(`payments.${index}.Date`)}
            />
            <input
              type="number"
              className="form-control"
              {...register(`payments.${index}.Value`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addPayment({ Voucher_Number: "", Date: "", Value: 0 })
            }
          >
            Add Payment
          </button>
        </div>

        {/* Claims Section */}
        <h4>Claims</h4>
        {claimsFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              type="number"
              className="form-control mb-2"
              {...register(`claims.${index}.Initial_Claim_Amount`)}
              required
            />
            <input
              type="number"
              className="form-control mb-2"
              {...register(`claims.${index}.Current_Claim_Amount`)}
            />
            <input
              type="number"
              className="form-control"
              {...register(`claims.${index}.Balance_Claim_Amount`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addClaim({
                Initial_Claim_Amount: 0,
                Current_Claim_Amount: 0,
                Balance_Claim_Amount: 0,
              })
            }
          >
            Add Claim
          </button>
        </div>

        {/* Related Case Reg Apps Section */}
        <h4>Related Case Reg Apps</h4>
        {relatedCasesFields.map((item, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <input
              placeholder="Application Number"
              className="form-control mb-2"
              {...register(`relatedCases.${index}.Application_Number`)}
              required
            />
            <input
              type="date"
              className="form-control mb-2"
              {...register(`relatedCases.${index}.First_Submit_Date`)}
            />
          </div>
        ))}
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() =>
              addRelatedCase({ Application_Number: "", First_Submit_Date: "" })
            }
          >
            Add Related Case
          </button>
        </div>

        {/* Submit Button */}
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCaseForm;
