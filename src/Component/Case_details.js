import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Case_details.css';

import Sidebar from './Sidebar';
import NotificationBar from './NotificationBar';
import LawyerDetails from './LawyerDetails';
import CaseDetails from './CaseDetails';

function Case_details() {

  const caseData = {
    serial_number: "2024/415394",
    type: "Restricted Jurisdiction Real Estate case filing",
    applicant: "سهيل الجبري للمحاماة والاستشارات القانونية",
    date: "27-11-2024",
    party_details: [
      {
        party_number: "7909550",
        party_name: "عبدالرحمن بن احمد بن ماجد الغامدي",
        title_in_case: "مدعي",
        title_after_judgment: "Address",
      },
      {
        party_number: "5623411",
        party_name: "شركة بناء التطوير العقاري ذ.م.م",
        title_in_case: "مدعى عليه",
        title_after_judgment: "Address",
      },
    ],
    status: "The Application Has Been Executed",
    case_number: "2024/53 Real estates, Partial",
    case_detail: {
      caseNumber: "18 / 2024 / 53 Real estates, Partial",
      subject:
        "استلام مبلغ لإبراء الذمة مقابل مبلغ وقدره (398,400.00 درهم) بالإضافــة الى الفائــدة القانونيــة بمقدار (%5) سنويـا من تاريـخ تسليم المطالبة وحتى تاريخ الوفاء، بالإضافة إلى التعويض عن الأضرار بمبلغ 150.000 درهم مع الرسوم والمصاريف وأتعاب المحاماة.",
      caseStatus: "قيد التسيير",
      claimedAmount: "548,400 درهم",
      totalClaimedAmount: "548,400 درهم",
      requestNumber: "415394/2024",
      requestDate: "28-11-2024 12:30:54",
      caseBalance: "548,400 درهم",
      ascriptionDescription: "محاكم دبي الإبتدائية",
      rootCaseNumber: "4566778",
      rootDecision: "تمت الموافقة",
      litigationStage: "محاكم دبي الإبتدائية",
      eSubmitDate: "28-11-2024",
      startPreparationDate: "29-11-2024",
      casePreparationDetails: "المعاملة جاهزة للإعداد",
      nextSessionDate: "11-12-2024",
      lastSessionDate: "29-11-2024",
      caseCurrentDetails: "تفاصيل الجلسة الأخيرة",
      lastDecisions: [
        "جلسة 2024-11-29:",
        "1- إدخال التدخل في الدعوى من قبل أشخاص.",
        "2- إدخال أطراف أخرى في الدعوى.",
      ],
    },
  };









  return (
    <div className="" >
      <div className="row">
        {/* <Sidebar /> */}

        <div className="col-1 bg-dark d-flex flex-column align-items-center py-3" >
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-secondary rounded-circle mb-3"
              style={{ width: '40px', height: '40px' }}
            ></div>
          ))}
        </div>
        <div className="col">
          <NotificationBar />

          <div className="row mt-3">
            <div className="col-md-3" >
              {/* <LawyerDetails /> */}
              <div className="p-3 rounded" style={{ marginLeft: 5, background: "#c0a262" }}>
                <h6>Lawyer Details</h6>
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-secondary rounded my-2"
                    style={{ height: '40px' }}
                  >
                    {/* <button  className="bg-secondary rounded my-2"> 
            </button> */}
                  </div>
                ))}
                <p className="mt-3">

                  Other information regarding the case will be displayed here.
                </p>
              </div>
            </div>

            <div className="col-md-9">
              {/* <CaseDetails /> */}
              <div className="dashboard-container">
                <div className="subject-line" style={{ height: 200 }}>
                  <div style={{ height: 200 }}>
                    <h5 style={{ textAlign: 'end' }}> {caseData.case_detail.subject}</h5>
                    <p>number : {caseData.case_detail.caseNumber}
                      <br />
                      status : {caseData.case_detail.caseStatus} etc.</p>
                  </div>
                </div>
                <div className="important-points" style={{ height: 270 }}>
                  <p>claimedAmount: {caseData.case_detail.claimedAmount}</p>
                  <p>totalClaimedAmount: {caseData.case_detail.totalClaimedAmount}</p>
                  <p>requestNumber: {caseData.case_detail.requestNumber}</p>
                  <p>requestDate: {caseData.case_detail.requestDate}</p>
                  <p>caseBalance: {caseData.case_detail.caseBalance}</p>
                  <p>ascriptionDescription: {caseData.case_detail.ascriptionDescription}</p>
                  <p>ascriptionDescription:{caseData.case_detail.rootCaseNumber}</p>
                  <p>ascriptionDescription:{caseData.case_detail.rootDecision}</p>
                  <p>ascriptionDescription:{caseData.case_detail.litigationStage}</p>
                  <p>ascriptionDescription:{caseData.case_detail.eSubmitDate}</p>
                  <p>ascriptionDescription:{caseData.case_detail.startPreparationDate}</p>
                </div>
                <div className="grid">
                  <div className="grid-item" style={{ height: 150, marginTop: -70 }}>
                    <p>rootCaseNumber: {caseData.case_detail.rootCaseNumber}</p>
                    <p>rootDecision: {caseData.case_detail.rootDecision}</p>
                    <p>litigationStage: {caseData.case_detail.litigationStage}</p>
                  </div>
                  <div className="grid-item" style={{ height: 150, marginTop: -70 }}>Item 2</div>
                  <div className="grid-item">Item 3</div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div >
  );
}

export default Case_details;
