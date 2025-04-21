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

const Case_details = ({ token }) => {
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

    return [
      {
        id: "Parties",
        title: "Parties Details",
        content: <PartiesDetails caseData={caseData} />,
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
        content: <ExperienceReports data={caseData.Experience_Reports} />,
      },
      {
        id: "publicProsecutionReports",
        title: "Public Prosecution Reports Details",
        content: (
          <SubCaseDetails
            caseData={caseData}
            reportType={"Public_Prosecution_Reports"}
          />
        ),
      },
      {
        id: "socialResearcherReports",
        title: "Social Researcher Reports Details",
        content: (
          <SubCaseDetails
            caseData={caseData}
            reportType={"Social_Researcher_Reports"}
          />
        ),
      },
      {
        id: "relatedCases",
        title: "Related Cases Details",
        content: <SubCaseDetails caseData={caseData} reportType={"Related_Cases"} />,
      },
      {
        id: "joinedCases",
        title: "Joined Cases Details",
        content: <SubCaseDetails caseData={caseData} reportType={"Joined_Cases"} />,
      },
      {
        id: "Settlements_Legal_Reasoned_Decisions",
        title: "Settlements & Legal Reasoned Decisions",
        content: (
          <SubCaseDetails
            caseData={caseData}
            reportType={"Settlements_Legal_Reasoned_Decisions"}
          />
        ),
      },
      {
        id: "Verdicts_Legal_Reasoned_Decisions",
        title: "Verdicts & Legal Reasoned Decisions",
        content: (
          <SubCaseDetails
            caseData={caseData}
            reportType={"Verdicts_Legal_Reasoned_Decisions"}
          />
        ),
      },
      {
        id: "Related_Claims_And_SubClaims",
        title: "Related Claims And SubClaims",
        content: (
          <SubCaseDetails
            caseData={caseData}
            reportType={"Related_Claims_And_SubClaims"}
          />
        ),
      },
      {
        id: "Arrest_Orders",
        title: "Arrest Orders",
        content: <SubCaseDetails caseData={caseData} reportType={"Arrest_Orders"} />,
      },
      {
        id: "Detentions",
        title: "Detentions",
        content: <SubCaseDetails caseData={caseData} reportType={"Detentions"} />,
      },
      {
        id: "Bans",
        title: "Bans",
        content: <SubCaseDetails caseData={caseData} reportType={"Bans"} />,
      },
      {
        id: "Seizures",
        title: "Seizures",
        content: <SubCaseDetails caseData={caseData} reportType={"Seizures"} />,
      },
      {
        id: "auctions",
        title: "Auctions",
        content: <SubCaseDetails caseData={caseData} reportType={"Auctions"} />,
      },
      {
        id: "seizedDocuments",
        title: "Seized Documents",
        content: <SubCaseDetails caseData={caseData} reportType={"Seized_Documents"} />,
      },
      {
        id: "caseLetters",
        title: "Case Letters",
        content: <SubCaseDetails caseData={caseData} reportType={"Case_Letters"} />,
      },
      {
        id: "mrletters",
        title: "Mr Letters",
        content: <SubCaseDetails caseData={caseData} reportType={"Mr_Letters"} />,
      },
      {
        id: "payments",
        title: "Payments",
        content: <SubCaseDetails caseData={caseData} reportType={"Payments"} />,
      },
      {
        id: "depositvouchers",
        title: "Deposit Vouchers",
        content: <SubCaseDetails caseData={caseData} reportType={"Deposit_Vouchers"} />,
      },
      {
        id: "claims",
        title: "Claims",
        content: <SubCaseDetails caseData={caseData} reportType={"Claims"} />,
      },
      {
        id: "relatedcaseregapps",
        title: "Related Case Reg Apps",
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Related_Case_Reg_Apps"} />
        ),
      },
      {
        id: "decisionsAndSessionMinutes",
        title: "Decisions and Session Minutes",
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Decisions_and_Session_Minutes"} />
        ),
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
  }, []);
  // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading

  // Function to fetch cases
  const fetchCases = async () => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}getCaseDetail/${global.CaseId._id}`,
        {
          withCredentials: true, // ✅ Sends cookies with the request
        }
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
      const response = await axios.get(`${ApiEndPoint}getparties/${global.CaseId._id}`); // API endpoint

      console.log("data of parties", response.data[0]);
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
  const handleViewFolders = async () => {
    global.lawyerDetails = lawyerDetails[0];
    global.User = user;
    console.log(global.User);
    dispatch(screenChange(12));
  };
  const handleViewClientDetails = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(7));
  };

  const handleButtonClick = (buttonNumber) => {
    alert(`Button ${buttonNumber} clicked!`); // Replace this with your infographic logic
  };



  const fieldMappings = [
    { key: "CaseNumber", label: "Case Number" },
    { key: "CaseStatus", label: "Status" },
    { key: "ClaimedAmount", label: "Claimed Amount" },
    { key: "LitigationStage", label: "Litigation Stage" },
    { key: "TotalClaimedAmount", label: "Total Claimed Amount" },
    { key: "CaseBalance", label: "Case Balance" },
    { key: "RequestDate", label: "Request Date" },
    { key: "ESubmitDate", label: "eSubmit Date" },
    { key: "StartPreparationDate", label: "Start Preparation Date" },
    { key: "NextSessionDate", label: "Next Session Date" },
    { key: "LastSessionDate", label: "Last Session Date" },
    { key: "VerdictDate", label: "Verdict Date" },
    { key: "AscriptionDescription", label: "Ascription Description" },
    { key: "RequestNumber", label: "Request Number" },
    { key: "CaseCurrentDetails", label: "Case Current Details" },
    { key: "RootCaseNumber", label: "Root Case Number" },
    { key: "RootDecision", label: "Root Decision" },
  ];


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
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <button
                className="View-button rounded-4 m-1  w-100 px-4 py-2"
                style={{
                  boxShadow: "5px 5px 5px gray",
                  border: "2px solid #d4af37",
                  borderRadius: "6px",
                }}
                onClick={handleViewFolders}
              >
                View Folders
              </button>
            </div>
            {(token?.Role !== "client") && (
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <button
                  className="View-button rounded-4 m-1  w-100 px-4 py-2"
                  style={{
                    boxShadow: "5px 5px 5px gray",
                    border: "2px solid #d4af37",
                    borderRadius: "6px",
                  }}
                  onClick={handleViewClientDetails}
                >
                  View Client
                </button>
              </div>
            )}
            {/* <h6>Further Details</h6> */}

            <div className=" flex-col gap-2">
              {sections.map((section) => (
                <div>
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

                </div>
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
                  size={"1x"}
                  color="#c0a262"
                  style={{ marginRight: 10, marginTop: 8 }}
                />
                <div style={{ fontSize: 20 }}>Subject</div>
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
                  <tbody>
                    {fieldMappings
                      .filter((f) => ["CaseNumber", "CaseStatus"].includes(f.key))
                      .map(({ key, label }) =>
                        caseData?.[key] ? (
                          <tr key={key} className="bg-gray-100">
                            <td className=" px-1 py-2 font-bold w-1/7">{label} :</td>
                            <td className=" px-1 py-2 w-1/7">{caseData[key]}</td>
                          </tr>
                        ) : null
                      )}
                  </tbody>
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
                  size="1x"
                  color="#c0a262"
                  style={{ marginRight: 10, marginTop: 8 }}
                />
                <div style={{ fontSize: 20 }}>Amount</div>
                {/* </div> */}
              </div>
              <div
                style={{ fontSize: 12 }}
                className="textpositions text-wrap-1 pt-2"
              >
                <div className="overflow-x-auto">
                  <table className="table-auto border-collapse w-100">
                    <tbody>
                      {fieldMappings
                        .filter((f) =>
                          ["ClaimedAmount", "LitigationStage", "TotalClaimedAmount", "CaseBalance"].includes(f.key)
                        )
                        .map(({ key, label }, index) =>
                          caseData?.[key] ? (
                            <tr key={key} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                              <td className=" px-1 py-2 font-bold">{label} :</td>
                              <td className=" px-1 py-2">{caseData[key]}</td>
                            </tr>
                          ) : null
                        )}
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
                    size="1x"
                    color="#c0a262"
                    style={{ marginRight: 10, marginTop: 8 }}
                  />
                  <div style={{ fontSize: 20 }}>Date</div>
                  {/* </div> */}
                </div>
                <div
                  style={{ fontSize: 12 }}
                  className="textpositions text-wrap-1"
                >
                  <div className="overflow-x-auto ">
                    <table className="table-auto border-collapse border border-gray-300  w-100">
                      <tbody>
                        {fieldMappings
                          .filter((f) => f.key.toLowerCase().includes("date"))
                          .map(({ key, label }, index) =>
                            caseData?.[key] ? (
                              <tr key={key} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <td className="border rounded-2 border-gray-300 px-1 py-2 font-bold">
                                  {label}
                                </td>
                                <td className="border border-gray-300 px-1 py-2">
                                  {caseData[key].split("T")[0]}
                                </td>
                              </tr>
                            ) : null
                          )}
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
                    size="1x"
                    color="#c0a262"
                    style={{ marginRight: 10, marginTop: 10 }}
                  />
                  <div style={{ fontSize: 20 }}>Last Decisions</div>
                </div>
                {/* {caseData.lastDecisions.map((item, index) => ( */}
                {caseData?.LastDecisions && (
                  <div
                    className="datatextcolor px-1 py-2 textpositions text-wrap-1 w-100"
                    style={{ fontSize: 12, overflow: "hidden" }}
                  >
                    {caseData.LastDecisions}
                  </div>
                )}

                {/* ))} */}
              </div>

              <div
                className="grid-item datatextcolor col-11"
                style={{
                  boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  className="d-flex mb-2 p-0 gap-2"
                  style={{ color: "#c0a262", fontWeight: "bold", fontSize: 15 }}
                >
                  {/* <div style={{width:50}}> */}
                  <div>
                    <img
                      src={require(`../Main/Pages/Component/Casedetails/Icons/others.png`)}
                      style={{ height: "30px" }}
                    />
                  </div>
                  <div style={{ fontSize: 20 }}>Others Details</div>
                  {/* </div> */}
                </div>
                <div
                  style={{ fontSize: 12 }}
                  className="textpositions text-wrap-1"
                >
                  <div className="overflow-x-auto">
                    <table className="table-auto border-collapse border border-gray-300 w-100">
                      <tbody>
                        {fieldMappings
                          .filter((f) =>
                            [
                              "AscriptionDescription",
                              "RequestNumber",
                              "CaseCurrentDetails",
                              "RootCaseNumber",
                              "RootDecision",
                              "LitigationStage",
                            ].includes(f.key)
                          )
                          .map(({ key, label }, index) =>
                            caseData?.[key] ? (
                              <tr key={key} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                                <td className="border border-gray-300 px-1 py-2 font-bold">{label}</td>
                                <td className="border border-gray-300 px-1 py-2">{caseData[key]}</td>
                              </tr>
                            ) : null
                          )}
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>






              {/* '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' */}

              {/* 

              <div className="table-responsive" style={{ fontSize: 12, color: "white" }}>
                <table className="table table-bordered table-sm table-dark">
                  <tbody>
                    {Object.entries(caseData).map(([key, value]) => {
                      if (["_id", "FkCaseId", "__v", "createdAt", "updatedAt"].includes(key)) return null;

                      // Format camelCase or PascalCase keys into readable labels
                      const formatKey = key
                        .replace(/([A-Z])/g, " $1") // insert space before capital letters
                        .replace(/^./, str => str.toUpperCase()); // capitalize first letter

                      // Format dates if value is a valid ISO string
                      let displayValue = value;
                      if (typeof value === "string" && value.includes("T") && !isNaN(Date.parse(value))) {
                        displayValue = new Date(value).toLocaleDateString("en-GB");
                      }

                      return (
                        <tr key={key}>
                          <td className="font-weight-bold">{formatKey}</td>
                          <td>{displayValue || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div> */}
              {/* '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' */}
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
                            <img
                              src={require(`../Main/Pages/Component/Casedetails/Icons/${section.id}.png`)}
                              style={{ height: "30px" }}
                            />
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
    </div>
  );
}

export default Case_details;
