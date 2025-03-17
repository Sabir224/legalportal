import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";

const CaseForm = () => {
  const { register, handleSubmit, control } = useForm();

  const { fields: partyFields, append: addParty } = useFieldArray({
    control,
    name: "parties",
  });

  const { fields: repFields, append: addRep } = useFieldArray({
    control,
    name: "legalRepresentatives",
  });

  const { fields: dateFields, append: addDate } = useFieldArray({
    control,
    name: "keyDates",
  });

  const { fields: docFields, append: addDoc } = useFieldArray({
    control,
    name: "documents",
  });

  const onSubmit = (data) => console.log(data);

  return (
    <div
      className="container d-flex justify-content-center align-items-center "
      style={{ maxWidth: "w-100", maxHeight: "86vh", overflowY: "auto" }}
    >
      <div
        className="card p-4 shadow-lg w-100"
        style={{ maxWidth: "w-100", maxHeight: "86vh", overflowY: "auto" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-center mb-4">Case/Matter Filing</h2>

          <div className="row">
            <div className="col-md-6">
              <label>Case Number</label>
              <input
                className="form-control"
                type="text"
                {...register("caseNumber", { required: true })}
              />
            </div>
            <div className="col-md-6">
              <label>Case Name</label>
              <input
                className="form-control"
                type="text"
                {...register("caseName", { required: true })}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label>Case Type</label>
              <select className="form-control" {...register("caseType")}>
                <option value="Civil">Civil</option>
                <option value="Criminal">Criminal</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Case Status</label>
              <select className="form-control" {...register("caseStatus")}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="row mt-3">
            {/* <div className="col-md-6">
              <label>Court Name</label>
              <input
                className="form-control"
                type="text"
                {...register("courtName")}
              />
            </div> */}
            {/* <div className="col-md-6">
              <label>Jurisdiction</label>
              <input
                className="form-control"
                type="text"
                {...register("jurisdiction")}
              />
            </div> */}
          </div>

          <div className="mt-3">
            <label>Filing Date</label>
            <input
              className="form-control"
              type="date"
              {...register("filingDate")}
            />
          </div>

          {/* <div className="mt-3">
            <label>Judge Assigned</label>
            <input
              className="form-control"
              type="text"
              {...register("judgeAssigned")}
            />
          </div> */}

          <h4 className="mt-4">Parties Involved</h4>
          {partyFields.map((field, index) => (
            <div className="row mt-2" key={index}>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="text"
                  {...register(`parties.${index}.partyName`)}
                  placeholder="Party Name"
                />
              </div>
              <div className="col-md-6">
                <select
                  className="form-control"
                  {...register(`parties.${index}.partyRole`)}
                >
                  <option value="Plaintiff">Plaintiff</option>
                  <option value="Defendant">Defendant</option>
                  <option value="Witness">Witness</option>
                </select>
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-primary mt-2 d-block mx-auto"
            type="button"
            onClick={() => addParty({ partyName: "", partyRole: "" })}
          >
            Add Party
          </button>

          {/* <h4 className="mt-4">Legal Representatives</h4>
          {repFields.map((field, index) => (
            <div className="row mt-2" key={index}>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="text"
                  {...register(`legalRepresentatives.${index}.name`)}
                  placeholder="Representative Name"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="text"
                  {...register(`legalRepresentatives.${index}.role`)}
                  placeholder="Role (Attorney, etc.)"
                />
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-primary mt-2 d-block mx-auto"
            type="button"
            onClick={() => addRep({ name: "", role: "" })}
          >
            Add Representative
          </button> */}

          <h4 className="mt-4">Case Summary</h4>
          <textarea
            className="form-control"
            {...register("description")}
            placeholder="Case details"
          ></textarea>

          <h4 className="mt-4">Priority</h4>
          <select className="form-control" {...register("priority")}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <h4 className="mt-4">Important Dates</h4>
          {dateFields.map((field, index) => (
            <div className="row mt-2" key={index}>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="text"
                  {...register(`keyDates.${index}.event`)}
                  placeholder="Event (Hearing, etc.)"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="date"
                  {...register(`keyDates.${index}.date`)}
                />
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-primary mt-2 d-block mx-auto"
            type="button"
            onClick={() => addDate({ event: "", date: "" })}
          >
            Add Key Date
          </button>

          {/* <h4 className="mt-4">Case Documents</h4>
          {docFields.map((field, index) => (
            <div className="row mt-2" key={index}>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="text"
                  {...register(`documents.${index}.docName`)}
                  placeholder="Document Name"
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  type="text"
                  {...register(`documents.${index}.docType`)}
                  placeholder="Document Type"
                />
              </div>
            </div>
          ))}
          <button
            className="btn btn-sm btn-primary mt-2 d-block mx-auto"
            type="button"
            onClick={() => addDoc({ docName: "", docType: "" })}
          >
            Add Document
          </button> */}
          <div className="d-flex justify-content-center">
            <button className="btn btn-success btn-lg  mt-4" type="submit">
              Submit Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;
