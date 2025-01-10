import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Case_details.css';
// // import { FaBell, FaUser, FaHome } from 'react-icons/fa';
// import { FaCalendarAlt } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faAddressCard, faAudioDescription, faBook, faCalendarAlt, faCopy, faGavel, faJedi, faJugDetergent, faMoneyBills, faOtter } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import NotificationBar from './NotificationBar';
import LawyerDetails from './LawyerDetails';
import { faCashRegister } from '@fortawesome/free-solid-svg-icons';
import { faCreativeCommons, faFirstOrder, faJediOrder } from '@fortawesome/free-brands-svg-icons';
import { FcMakeDecision } from 'react-icons/fc';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';

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

    <div className="row m-0 d-flex " >

      <div className="col-md-3" style={{ marginRight: 20 }}>        {/* <LawyerDetails /> */}
        <div className="p-4 rounded" style={{ marginLeft: 5, background: "#c0a262", boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.2)" }}>
          <h6>Lawyer Details</h6>
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-secondary rounded my-2"
              style={{ height: '36px' }}
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

      <div className="col-md-8" style={{}} >
        {/* <CaseDetails /> */}
        <div className="row gap-3">
          <div className="subject-line col-8" style={{ height: 200, boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)" }}>
            <div className='d-flex mb-2 p-0 ' style={{ color: "#c0a262", fontWeight: 'bold' }}>
              {/* <div style={{width:50}}> */}
              <FontAwesomeIcon icon={faComment} size={'2x'} color="#c0a262" style={{ marginRight: 10 }} />
              <div style={{ padding: 1, fontSize: 15, }}>
                Subject
              </div>
              {/* </div> */}

            </div>
            <div className='datatextcolor' style={{ height: 200, marginLeft: 15, fontSize: 12, color: 'white' }}>
              <h8 style={{ textAlign: 'end' }}> {caseData.case_detail.subject}</h8>
              <div className='datatextcolor'>caseNumber : {caseData.case_detail.caseNumber}
                <br />
                status : {caseData.case_detail.caseStatus} etc.</div>
            </div>
          </div>

          <div className="important-points datatextcolor col-3" style={{ height: 270, width: '27%', boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)" }}>

            <div className=' d-flex m-0' style={{ color: "#c0a262", fontWeight: 'bold' }}>
              {/* <div style={{width:50}}> */}
              <FontAwesomeIcon icon={faMoneyBills} size="2x" color="#c0a262" style={{ marginRight: 10 }} />
              <div style={{}}>
                Amount
              </div>
              {/* </div> */}

            </div>
            <div style={{ fontSize: 12 }} className='textpositions text-wrap-1 pt-2' >
              <div style={{}} >
                <div >claimedAmount: {caseData.case_detail.claimedAmount}</div>
              </div>
              <div style={{}}>
                <div>litigationStage: {caseData.case_detail.casePreparationDetails}</div>
              </div>
              <div style={{}}>
                <div>totalClaimedAmount: {caseData.case_detail.totalClaimedAmount}</div>
              </div>

              <div style={{}}>
                <div>caseBalance: {caseData.case_detail.caseBalance}</div>
              </div>
            </div>

          </div>


          <div className="row  gap-3 pb-2">
            <div className="grid-item col-4 datatextcolor" style={{ marginTop: -70, boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)" }}>
              {/* <FaCalendarAlt size="3em" color="#4CAF50" /> */}
              <div className=' d-flex mb-2 p-0' style={{ color: "#c0a262", fontWeight: 'bold', fontSize: 15, }}>
                {/* <div style={{width:50}}> */}
                <FontAwesomeIcon icon={faCalendarAlt} size="2x" color="#c0a262" style={{ marginRight: 10 }} />
                <div style={{ padding: 4 }}>
                  Date
                </div>
                {/* </div> */}

              </div>
              <div style={{ fontSize: 12, }} className='textpositions text-wrap-1'>
                <div style={{ overflow: 'hidden' }}>
                  <div >requestDate: {caseData.case_detail.requestDate}</div>
                </div>
                <div style={{}}>
                  <div>eSubmitDate: {caseData.case_detail.eSubmitDate}</div>
                </div>
                <div style={{}}>
                  <div>startPreparationDate: {caseData.case_detail.startPreparationDate}</div>
                </div>
                <div style={{}}>
                  <div>nextSessionDate: {caseData.case_detail.nextSessionDate}</div>
                </div>
                <div style={{}}>
                  <div>lastSessionDate: {caseData.case_detail.lastSessionDate}</div>
                </div>
              </div>


            </div>
            <div className="grid-item datatextcolor col-4" style={{ marginTop: -70, boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)" }}>
              <div className=' d-flex mb-2 p-0' style={{ color: "#c0a262", fontWeight: 'bold', fontSize: 15, }}>
                {/* <div style={{width:50}}> */}
                <FontAwesomeIcon icon={faCreativeCommons} size="2x" color="#c0a262" style={{ marginRight: 10 }} />
                <div style={{ padding: 2 }}>
                  Others Details
                </div>
                {/* </div> */}

              </div>
              <div style={{ fontSize: 12, }} className='textpositions text-wrap-1'>
                <div style={{}}>
                  <div>ascriptionDescription: {caseData.case_detail.ascriptionDescription}</div>
                </div>
                <div style={{}}>
                  <div>requestNumber: {caseData.case_detail.requestNumber}</div>
                </div>
                <div style={{}}>
                  <div>caseCurrentDetails: {caseData.case_detail.caseCurrentDetails}</div>

                </div>
                <div style={{}}>
                  <div>rootCaseNumber: {caseData.case_detail.rootCaseNumber}</div>
                </div>
                <div style={{}}>
                  <div>rootDecision: {caseData.case_detail.rootDecision}</div>
                </div>
                <div style={{}}>
                  <div>litigationStage: {caseData.case_detail.litigationStage}</div>
                </div>
              </div>

            </div>
            <div className="grid-item col-3" style={{ width: '28%', boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)" }}>
              <div className='d-flex mb-2 p-0' style={{ color: "#c0a262", fontWeight: 'bold', fontSize: 15, }}>
                {/* <div style={{width:50}}> */}
                <FontAwesomeIcon icon={faGavel} size="2x" color="#c0a262" style={{ marginRight: 10 }} />
                <div style={{ padding: 2 }}>
                  Last Decisions
                </div>

              </div>
              {caseData.case_detail.lastDecisions.map((item, index) => (
                <div className='datatextcolor textpositions text-wrap-1' style={{ fontSize: 12, overflow: 'hidden' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
    // {/* </div> */}
    // </div >
  );
}

export default Case_details;
