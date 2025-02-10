import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Case_details.css";
// // import { FaBell, FaUser, FaHome } from 'react-icons/fa';
// import { FaCalendarAlt } from 'react-icons/fa';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faAddressCard,
  faAudioDescription,
  faBook,
  faCalendarAlt,
  faCopy,
  faGavel,
  faJedi,
  faJugDetergent,
  faMoneyBills,
  faMultiply,
  faOtter,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";
import NotificationBar from "./NotificationBar";
// import LawyerDetails from './LawyerDetails';
import { faCashRegister } from "@fortawesome/free-solid-svg-icons";
import {
  faCreativeCommons,
  faFirstOrder,
  faJediOrder,
} from "@fortawesome/free-brands-svg-icons";
import { FcMakeDecision } from "react-icons/fc";
import { faComment } from "@fortawesome/free-solid-svg-icons/faComment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { screenChange } from "../REDUX/sliece";
import { ApiEndPoint } from "../Main/Pages/Component/utils/utlis";
import PartiesDetails from "../Main/Pages/Component/Casedetails/PartiesDetails";
import ExhibitDetails from "../Main/Pages/Component/Casedetails/ExhibitDetails";
import DocumentsDetails from "../Main/Pages/Component/Casedetails/DocumentsDetails";
import NoticesDetails from "../Main/Pages/Component/Casedetails/NoticesDetails";
import PublishedNotices from "../Main/Pages/Component/Casedetails/PublishedNotices";
import Petitions from "../Main/Pages/Component/Casedetails/Petitions";
import EffsahPlatformOrders from "../Main/Pages/Component/Casedetails/EffsahPlatformOrders";
import ExperienceReports from "../Main/Pages/Component/Casedetails/Experience_Reports";
import SubCaseDetails from "../Main/Pages/Component/Casedetails/SubCaseDetails";
import { blue } from "@mui/material/colors";

function Case_details() {
  const dispatch = useDispatch();
  const [activeSections, setActiveSections] = useState([]);
  const [buttoncolor, setbuttoncolor] = useState([]);
  const [activeButtons, setActiveButtons] = useState({}); // Track button states by ID
  const [sections, setsections] = useState([]); // Track button states by ID

  // const sections = [
  //   {
  //     id: "party",
  //     title: "Party Details",
  //     content: (
  //       <>
  //         <p>Name: John Doe</p>
  //         <p>Event: Birthday Party</p>
  //         <p>Date: 2025-02-14</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "Exibit",
  //     title: "Exibit Details",
  //     content: (
  //       <>
  //         <p>Name: John Doe</p>
  //         <p>Event: Birthday Party</p>
  //         <p>Date: 2025-02-14</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "notics",
  //     title: "notic Details",
  //     content: (
  //       <>
  //         <p>Name: John Doe</p>
  //         <p>Event: Birthday Party</p>
  //         <p>Date: 2025-02-14</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "decision",
  //     title: "decision Details",
  //     content: (
  //       <>
  //         <p>Name: John Doe</p>
  //         <p>Event: Birthday Party</p>
  //         <p>Date: 2025-02-14</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "Related Claims And SubClaims",
  //     title: "Related Claims And SubClaims Details",
  //     content: (
  //       <>
  //         <p>Document Name: Contract Agreement</p>
  //         <p>Issued Date: 2025-01-01</p>
  //         <p>Status: Approved</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "Experience Reports",
  //     title: "Experience Reports Details",
  //     content: (
  //       <>
  //         <p>Document Name: Contract Agreement</p>
  //         <p>Issued Date: 2025-01-01</p>
  //         <p>Status: Approved</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "Public Prosecution Reports",
  //     title: "Public Prosecution Reports Details",
  //     content: (
  //       <>
  //         <p>Document Name: Contract Agreement</p>
  //         <p>Issued Date: 2025-01-01</p>
  //         <p>Status: Approved</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "Seizures",
  //     title: "Seizures Details",
  //     content: (
  //       <>
  //         <p>Document Name: Contract Agreement</p>
  //         <p>Issued Date: 2025-01-01</p>
  //         <p>Status: Approved</p>
  //       </>
  //     ),
  //   },
  //   {
  //     id: "Auctions",
  //     title: "Auctions Details",
  //     content: (
  //       <>
  //         <p>Document Name: Contract Agreement</p>
  //         <p>Issued Date: 2025-01-01</p>
  //         <p>Status: Approved</p>
  //       </>
  //     ),
  //   },
  // ];

  // const sections = [
  //   {
  //     id: "parties",
  //     title: "Parties Details",
  //     content: (
  //       <>
  //         <h5>Heading: 105 / 2025 / 16 Personal Status, Non-Muslims</h5>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Party Number</th>
  //               <th>Party Name</th>
  //               <th>Title in Case</th>
  //               <th>Title after Judgment</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <tr>
  //               <td>6613059</td>
  //               <td>جودونج وانج</td>
  //               <td>مدعى</td>
  //               <td></td>
  //             </tr>
  //             <tr>
  //               <td>6374448</td>
  //               <td>اناستاسيا افينسكيا</td>
  //               <td>مدعى عليه</td>
  //               <td></td>
  //             </tr>
  //           </tbody>
  //         </table>
  //         <h4>Agents/Legal Consultants</h4>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>Name</th>
  //               <th>Date of Disconnection</th>
  //               <th>City</th>
  //               <th>Address</th>
  //               <th>Tel</th>
  //               <th>Fax</th>
  //               <th>Email</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <tr>
  //               <td>Suhad Fadel Jabar Mehdi</td>
  //               <td></td>
  //               <td>Dubai Trade Center</td>
  //               <td>Office Address</td>
  //               <td>045547635</td>
  //               <td></td>
  //               <td>sj@suhadaljuboorilawfirm.com</td>
  //             </tr>
  //           </tbody>
  //         </table>
  //       </>
  //     ),
  //   },
  // ];

  // const transformData = (apiData) => {
  //   return apiData.map((caseData) => {
  //     const parties = caseData.Parties[0]; // Assuming only one Parties array

  //     return {
  //       id: "parties",
  //       title: "Parties Details",
  //       content: (
  //         <>
  //           <h5>Heading: 105 / 2025 / 16 Personal Status, Non-Muslims</h5>
  //           <table>
  //             <thead>
  //               <tr >
  //                 <th >Party Number</th>
  //                 <th>Party Name</th>
  //                 <th>Title in Case</th>
  //                 <th>Title after Judgment</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {parties.Parties_body.map((party) => (
  //                 <tr key={party.PartyNumber}>
  //                   <td>{party.PartyNumber}</td>
  //                   <td>{party.PartyName}</td>
  //                   <td>{party.TitleInCase}</td>
  //                   <td>{party.TitleAfterJudgment}</td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>

  //           <h4>Agents/Legal Consultants</h4>
  //           <table>
  //             <thead>
  //               <tr>
  //                 <th>Name</th>
  //                 <th>Date of Disconnection</th>
  //                 <th>City</th>
  //                 <th>Address</th>
  //                 <th>Tel</th>
  //                 <th>Fax</th>
  //                 <th>Email</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {parties.Parties_body.flatMap((party) =>
  //                 party.Legal_Consultants.Legal_Consultants_header.map(
  //                   (consultant) => (
  //                     <tr key={consultant._id}>
  //                       <td>{consultant.Name}</td>
  //                       <td>{consultant.Date_of_disconnection}</td>
  //                       <td>{consultant.City}</td>
  //                       <td>{consultant.Address}</td>
  //                       <td>{consultant.Tel}</td>
  //                       <td>{consultant.Fax}</td>
  //                       <td>{consultant.Email}</td>
  //                     </tr>
  //                   )
  //                 )
  //               )}
  //             </tbody>
  //           </table>
  //         </>
  //       ),
  //     };
  //   });
  // };

  const transformData = (apiData) => {
    if (!apiData || apiData.length === 0) return [];

    const caseData = apiData[0];

    const generateReportContent = (reportType) => {
      const report = caseData[reportType];

      return (
        <>
          <h5>{report.heading}</h5>
          <table>
            <thead>
              <tr>
                {report.header?.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.body?.map((item, index) => (
                <tr key={index}>
                  {Object.keys(report.header).map((key, idx) => (
                    <td key={idx}>{item[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
    };

    return [
      {
        id: "Parties",
        title: "Parties Details",
        content: <PartiesDetails caseData={caseData} />
      },
      {
        id: "Exhibits",
        title: "Exhibit Details",
        content: <ExhibitDetails caseData={caseData} />,
      },
      {
        id: "Documents",
        title: "Document Details",
        content: <DocumentsDetails caseData={caseData} />,
      },
      {
        id: "Notices",
        title: "Notices Details",
        content: <NoticesDetails caseData={caseData} />,
      },
      {
        id: "Published_Notices",
        title: "Published Notices Details",
        content: <PublishedNotices data={caseData.PublishedNotices} />,
      },

      {
        id: "Petitions",
        title: "Petitions Details",
        content: <Petitions data={caseData.Petitions} />,
      },
      {
        id: "effsahPlatformOrders",
        title: "Effsah Platform Orders Details",
        content: <EffsahPlatformOrders data={caseData.Effsah_Platform_Orders} />,
      },
      {
        id: "experienceReports",
        title: "Experience Reports Details",
        content: <ExperienceReports data={caseData.Experience_Reports} />
      },
      {
        id: "publicProsecutionReports",
        title: "Public Prosecution Reports Details",
        content: <SubCaseDetails caseData={caseData} reportType={"Public_Prosecution_Reports"} />
      },
      {
        id: "socialResearcherReports",
        title: "Social Researcher Reports Details",
        content: <SubCaseDetails caseData={caseData} reportType={"Social_Researcher_Reports"} />
      },
      {
        id: "relatedCases",
        title: "Related Cases Details",
        content: <SubCaseDetails caseData={caseData} reportType={"Related_Cases"} />
      },
      {
        id: "joinedCases",
        title: "Joined Cases Details",
        content: <SubCaseDetails caseData={caseData} reportType={"Joined_Cases"} />
      },

      {
        id: "Settlements_Legal_Reasoned_Decisions",
        title: "Settlements & Legal Reasoned Decisions",
        content: <SubCaseDetails caseData={caseData} reportType={"Settlements_Legal_Reasoned_Decisions"} />
      },
      {
        id: "Related_Claims_And_SubClaims",
        title: "Related Claims And SubClaims",
        content: <SubCaseDetails caseData={caseData} reportType={"Related_Claims_And_SubClaims"} />
      },
      {
        id: "Arrest_Orders",
        title: "Arrest Orders",
        content: <SubCaseDetails caseData={caseData} reportType={"Arrest_Orders"} />
      },
      {
        id: "Detentions",
        title: "Detentions",
        content: <SubCaseDetails caseData={caseData} reportType={"Detentions"} />
      },
      {
        id: "Bans",
        title: "Bans",
        content: <SubCaseDetails caseData={caseData} reportType={"Bans"} />
      },
      {
        id: "Seizures",
        title: "Seizures",
        content: <SubCaseDetails caseData={caseData} reportType={"Seizures"} />
      },
      {
        id: "auctions",
        title: "Auctions",
        content: <SubCaseDetails caseData={caseData} reportType={"Auctions"} />
      },
      {
        id: "seizedDocuments",
        title: "Seized Documents",
        content: <SubCaseDetails caseData={caseData} reportType={"Seized_Documents"} />
      },
      {
        id: "caseLetters",
        title: "Case Letters",
        content: <SubCaseDetails caseData={caseData} reportType={"Case_Letters"} />
      },
      {
        id: "mrletters",
        title: "Mr Letters",
        content: <SubCaseDetails caseData={caseData} reportType={"Mr_Letters"} />
      },
      {
        id: "payments",
        title: "Payments",
        content: <SubCaseDetails caseData={caseData} reportType={"Payments"} />
      },
      {
        id: "depositvouchers",
        title: "Deposit Vouchers",
        content: <SubCaseDetails caseData={caseData} reportType={"Deposit_Vouchers"} />
      },
      {
        id: "claims",
        title: "Claims",
        content: <SubCaseDetails caseData={caseData} reportType={"Claims"} />
      },
      {
        id: "relatedcaseregapps",
        title: "Related Case Reg Apps",
        content: <SubCaseDetails caseData={caseData} reportType={"Related_Case_Reg_Apps"} />
      },
    ];
  };


  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    if (scrollRef.current) {
      // Adjust the scroll speed factor
      const scrollSpeed = 5;
      scrollRef.current.scrollTop += event.deltaY / scrollSpeed;
    }
  };

  const toggleSection = (id) => {
    if (activeSections.includes(id)) {
      // Remove the section if already active
      setActiveSections(activeSections.filter((section) => section !== id));
    } else {
      // Add the section to active list
      setActiveSections([...activeSections, id]);
    }
    setActiveButtons((prevState) => ({
      ...prevState,
      [id]: !prevState[id], // Toggle the current button's state
    }));
  };

  // const [caseData, setCaseData] = useState([]);
  const [error, setError] = useState("");
  const [caseData, setCaseData] = useState("");
  const [user, setUser] = useState("");
  const [lawyerDetails, setLawyersDetails] = useState([]);
  useEffect(() => {
    fetchCases();
    fetchLawyerDetails();
  }, [caseData]);
  // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  // Function to fetch cases
  const fetchCases = async () => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}getCaseDetail?FkCaseId?${global.CaseId._id}`
      ); // API endpoint
      // console.log("data of case", response.data.caseDetails);
      // Assuming the API returns data in the `data` field
      setCaseData(response.data.caseDetails);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    try {
      const response = await axios.get(`${ApiEndPoint}getparties`); // API endpoint
      console.log("data of parties", response.data[0].Parties);

      // Assuming the API returns data in the `data` field
      setsections(transformData(await response.data));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchLawyerDetails = async () => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}geLawyerDetails?Email=Lawyer@gmail.com`
      ); // API endpoint
      // console.log("data of case", response.data.caseDetails);
      // Assuming the API returns data in the `data` field
      setUser(response.data.user);
      // console.log(response.data.lawyerDetails)
      setLawyersDetails([response.data.lawyerDetails]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const handleViewDetails = async () => {
    global.lawyerDetails = lawyerDetails[0];
    global.User = user;
    console.log(global.User);
    dispatch(screenChange(2));
  };

  const handleButtonClick = (buttonNumber) => {
    alert(`Button ${buttonNumber} clicked!`); // Replace this with your infographic logic
  };

  return (
    <div className="container-fluid  m-0 p-0">
      <div className=" row m-0 ">
        <div className="col-md-3">
          {/* <LawyerDetails /> */}
          <div
            className="p-4 rounded"
            style={{
              overflow: "hidden",
              // marginLeft: 5,
              height: "75vh",
              background: "#d3b386",
              boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.2)",
            }}
            onWheel={handleScroll} // Add scroll handler for mouse wheel
            ref={scrollRef} // Attach ref for scrolling
          >
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <button
                className="View-button rounded-4 m-1  w-100 px-4 py-2"
                style={{
                  boxShadow: "5px 5px 5px gray",
                  border: "2px solid #d4af37",
                  borderRadius: "6px",
                }}
                onClick={handleViewDetails}
              >
                View lawyer
              </button>
            </div>
            {/* <h6>Further Details</h6> */}

            <div className=" flex-col gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => toggleSection(section.id)}
                  className={`px-4 py-2 text-white rounded-4 m-1 w-100 View-furtherdetailsbutton`}
                  style={{
                    // backgroundColor: activeButtons[section.id] ? "#d3b386" : " #18273e", // Toggle color
                    // boxShadow: '4px 4px 6px rgba(0, 0, 0, 0.2)',
                    border: "2px solid rgba(0, 0, 0, 0.2)",
                    // transition: "background-color 0.3s ease",
                  }}
                  // onMouseEnter={(e) => {
                  //   e.currentTarget.style.background = "#d3b386";
                  // }}
                  // onMouseLeave={(e) => {
                  //   e.currentTarget.style.background = activeButtons[section.id]
                  //     ? "hsl(210, 88.90%, 3.50%)"
                  //     : " #18273e";
                  // }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "2px solid white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = activeButtons[section.id]
                      ? "2px solid #d4af37"
                      : "";
                  }}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="col-9"
          style={{ maxHeight: "80vh", height: "75vh", overflowY: "auto" }}
        >
          {/* <CaseDetails /> */}
          <div className="row gap-3">
            <div
              className="subject-line col-8"
              style={{
                height: 200,
                boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="d-flex mb-2 p-0 "
                style={{ color: "#c0a262", fontWeight: "bold" }}
              >
                {/* <div style={{width:50}}> */}
                <FontAwesomeIcon
                  icon={faComment}
                  size={"2x"}
                  color="#c0a262"
                  style={{ marginRight: 10 }}
                />
                <div style={{ padding: 1, fontSize: 15 }}>Subject</div>
                {/* </div> */}
              </div>
              <div
                className="datatextcolor"
                style={{
                  // height: 200,
                  // marginLeft: 15,
                  fontSize: 12,
                  color: "white",
                }}
              >
                {/* <h8 style={{ textAlign: 'end' }}> {caseData.case_detail.subject}</h8> */}
                <div className="overflow-x-auto">
                  <table className=" border border-gray-300 table-fixed w-100">
                    <tbody>
                      <tr className="bg-gray-100 ">
                        <td className="border border-gray-300 px-1 py-2 font-bold w-1/7">Case Number</td>
                        <td className="border border-gray-300 px-1 py-2 w-1/7">{global.CaseId.CaseNumber}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-1 py-2 font-bold">Status</td>
                        <td className="border border-gray-300 px-1 py-2">{global.CaseId.Status}</td>
                      </tr>
                      {/* Add more rows as needed */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div
              className="important-points datatextcolor col-3"
              style={{
                height: 270,
                // width: "27%",
                boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className="d-flex m-0"
                style={{ color: "#c0a262", fontWeight: "bold" }}
              >
                {/* <div style={{width:50}}> */}
                <FontAwesomeIcon
                  icon={faMoneyBills}
                  size="2x"
                  color="#c0a262"
                  style={{ marginRight: 10 }}
                />
                <div style={{}}>Amount</div>
                {/* </div> */}
              </div>
              <div
                style={{ fontSize: 12 }}
                className="textpositions text-wrap-1 pt-2"
              >
                <div className="overflow-x-auto">
                  <table className="table-auto border-collapse border border-gray-300 w-100">
                    <tbody>
                      <tr className="bg-gray-100">
                        <td className="border border-gray-300 px-1 py-2 font-bold">Claimed Amount</td>
                        <td className="border border-gray-300 px-1 py-2">{caseData?.ClaimedAmount}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-1 py-2 font-bold">Litigation Stage</td>
                        <td className="border border-gray-300 px-1 py-2">{caseData?.LitigationStage}</td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="border border-gray-300 px-1 py-2 font-bold">Total Claimed Amount</td>
                        <td className="border border-gray-300 px-1 py-2">{caseData?.TotalClaimedAmount}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-1 py-2 font-bold">Case Balance</td>
                        <td className="border border-gray-300 px-1 py-2">{caseData?.CaseBalance}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row m-0 p-0 d-flex gap-3" style={{}}>
              <div
                className="subject-line col-8 datatextcolor"
                style={{
                  marginTop: -70,
                  boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* <FaCalendarAlt size="3em" color="#4CAF50" /> */}
                <div
                  className=" d-flex mb-2 p-0"
                  style={{ color: "#c0a262", fontWeight: "bold", fontSize: 15 }}
                >
                  {/* <div style={{width:50}}> */}
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    size="2x"
                    color="#c0a262"
                    style={{ marginRight: 10 }}
                  />
                  <div style={{ padding: 4 }}>Date</div>
                  {/* </div> */}
                </div>
                <div
                  style={{ fontSize: 12 }}
                  className="textpositions text-wrap-1"
                >
                  <div className="overflow-x-auto ">
                    <table className="table-auto border-collapse border border-gray-300  w-100">
                      <tbody>
                        <tr className="bg-gray-100">
                          <td className="border rounded-2 border-gray-300 px-1 py-2 font-bold">Request Date</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.RequestDate ? caseData.RequestDate.split('T')[0] : ""}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-1 py-2 font-bold">eSubmit Date</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.ESubmitDate ? caseData.ESubmitDate.split('T')[0] : ""}</td>
                        </tr>
                        <tr className="bg-gray-100">
                          <td className="border border-gray-300 px-1 py-2 font-bold">Start Preparation Date</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.StartPreparationDate ? caseData.StartPreparationDate.split('T')[0] : ""}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-1 py-2 font-bold">Next Session Date</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.NextSessionDate ? caseData.NextSessionDate.split('T')[0] : ""}</td>
                        </tr>
                        <tr className="bg-gray-100">
                          <td className="border border-gray-300 px-1 py-2 font-bold">Last Session Date</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.LastSessionDate ? caseData.LastSessionDate.split('T')[0] : ""}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

              <div
                className="grid-item col-3"
                style={{
                  // width: "27%",
                  boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  className="d-flex mb-2 p-0"
                  style={{ color: "#c0a262", fontWeight: "bold", fontSize: 15 }}
                >
                  {/* <div style={{width:50}}> */}
                  <FontAwesomeIcon
                    icon={faGavel}
                    size="2x"
                    color="#c0a262"
                    style={{ marginRight: 10 }}
                  />
                  <div style={{ padding: 2 }}>Last Decisions</div>
                </div>
                {/* {caseData.lastDecisions.map((item, index) => ( */}
                <div
                  className="datatextcolor border  border-gray-300 px-1 py-2 textpositions text-wrap-1 w-100"
                  style={{ fontSize: 12, overflow: "hidden" }}
                >
                  {caseData.LastDecisions}
                </div>
                {/* ))} */}
              </div>


              <div
                className="grid-item datatextcolor col-11"
                style={{
                  boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  className="d-flex mb-2 p-0"
                  style={{ color: "#c0a262", fontWeight: "bold", fontSize: 15 }}
                >
                  {/* <div style={{width:50}}> */}
                  <FontAwesomeIcon
                    icon={faCreativeCommons}
                    size="2x"
                    color="#c0a262"
                    style={{ marginRight: 10 }}
                  />
                  <div style={{ padding: 2 }}>Others Details</div>
                  {/* </div> */}
                </div>
                <div
                  style={{ fontSize: 12 }}
                  className="textpositions text-wrap-1"
                >
                  <div className="overflow-x-auto">
                    <table className="table-auto border-collapse border border-gray-300 w-100">
                      <tbody>
                        {/* <tr className="bg-gray-100">
                          <td className="border border-gray-300 px-1 py-2 font-bold">Case Number</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.CaseNumber}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-1 py-2 font-bold">Status</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.Status}</td>
                        </tr> */}
                        <tr className="bg-gray-100">
                          <td className="border border-gray-300 px-1 py-2 font-bold">Ascription Description</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.AscriptionDescription}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-1 py-2 font-bold">Request Number</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.RequestNumber}</td>
                        </tr>
                        <tr className="bg-gray-100">
                          <td className="border border-gray-300 px-1 py-2 font-bold">Case Current Details</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.CaseCurrentDetails}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-1 py-2 font-bold">Root Case Number</td>
                          <td className="border border-gray-300 px-1 py-2">{caseData?.RootCaseNumber}</td>
                        </tr>
                        <tr className="bg-gray-100">
                          <td className="border border-gray-300 px-1  font-bold">Root Decision</td>
                          <td className="border border-gray-300 px-1 ">{caseData?.RootDecision}</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-1  font-bold">Litigation Stage</td>
                          <td className="border border-gray-300 px-1 ">{caseData?.LitigationStage}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", padding: "20px" }}> */}
              {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", padding: "20px" }}> */}

              {sections.map(
                (section) =>
                  activeSections.includes(section.id) && (
                    // <div className="flex-1  border rounded-3">
                    <div
                      key={section.id}
                      className="p-4 border rounded-3 bg-gray-50 shadow"
                      style={{ background: "#16213e", color: "white" }}
                    >
                      <h2
                        className="text-xl font-semibold "
                        style={{ color: "#c0a262" }}
                      >
                        <div className="gap-3 d-flex" style={{ gap: "10px" }}>
                          <div>
                            <img src={require(`../Main/Pages/Component/Casedetails/Icons/${section.id}.png`)} style={{ height: "30px" }} />
                          </div>
                          <div style={{ marginTop: 6, fontSize: 21 }}>
                            {section.title}
                          </div>
                        </div>
                        {/* <FontAwesomeIcon icon={faMultiply} size="1x" color="#c0a262" style={{ marginRight: 10 }} /> */}
                      </h2>
                      <div>{section.content}</div>
                    </div>
                    // </div>
                  )
              )}
              {/* {activeSections.length === 0 && (
              <p className="text-gray-600">Select a button to view details.</p>
            )} */}
            </div>
          </div>
          {/* </div> */}

          {/* </div> */}
        </div>
        {/* </div> */}
      </div>
    </div >
  );
}

export default Case_details;
