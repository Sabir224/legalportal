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
        id: "parties",
        title: "Parties Details",
        content: (
          <>
            <h5>Heading: {caseData.Parties[0]?.heading}</h5>
            <table>
              <thead>
                <tr>
                  <th>Party Number</th>
                  <th>Party Name</th>
                  <th>Title in Case</th>
                  <th>Title after Judgment</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...(caseData.Parties[0]?.Parties_header || []),
                  ...(caseData.Parties[0]?.Parties_body || []),
                ].map((party) => (
                  <tr key={party._id}>
                    <td>{party.PartyNumber}</td>
                    <td>{party.PartyName}</td>
                    <td>{party.TitleInCase}</td>
                    <td>{party.TitleAfterJudgment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Agents/Legal Consultants</h4>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date of Disconnection</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Tel</th>
                  <th>Fax</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {caseData.Parties[0]?.Parties_body?.flatMap(
                  (party) =>
                    party.Legal_Consultants?.Legal_Consultants_header?.map(
                      (consultant) => (
                        <tr key={consultant._id}>
                          <td>{consultant.Name}</td>
                          <td>{consultant.Date_of_disconnection || "N/A"}</td>
                          <td>{consultant.City}</td>
                          <td>{consultant.Address}</td>
                          <td>{consultant.Tel}</td>
                          <td>{consultant.Fax || "N/A"}</td>
                          <td>{consultant.Email}</td>
                        </tr>
                      )
                    ) || []
                )}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: "exhibits",
        title: "Exhibit Details",
        content: (
          <>
            <h5>Exhibits</h5>
            <table>
              <thead>
                <tr>
                  {caseData.Exhibits?.header?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseData.Exhibits?.body?.map((exhibit, index) => (
                  <tr key={index}>
                    <td>{exhibit.Detailed_Description}</td>
                    <td>{exhibit.Session_Date || "N/A"}</td>
                    <td>{exhibit.Attachment_Date}</td>
                    <td>
                      {exhibit.Party_Name?.submitter?.PartyName} (
                      {exhibit.Party_Name?.submitter?.PartyType})
                    </td>
                    <td>{exhibit.Attachment || "No Attachment"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: "documents",
        title: "Document Details",
        content: (
          <>
            <h5>Documents</h5>
            <table>
              <thead>
                <tr>
                  {caseData.Documents?.header?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseData.Documents?.body?.map((document, index) => (
                  <tr key={index}>
                    <td>{document.Detailed_Description}</td>
                    <td>{document.Session_Date || "N/A"}</td>
                    <td>{document.Attachment_Date}</td>
                    <td>
                      {document.Party_Name?.submitter?.PartyName} (
                      {document.Party_Name?.submitter?.PartyType})
                    </td>
                    <td>{document.Attachment || "No Attachment"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: "notices",
        title: "Notices Details",
        content: (
          <>
            <h5>Notices</h5>
            <table>
              <thead>
                <tr>
                  {caseData.Notices?.header?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseData.Notices?.body?.map((notice, index) => (
                  <tr key={index}>
                    <td>{notice.Notice_number}</td>
                    <td>{notice.Notice_Type}</td>
                    <td>{notice.Registration_date}</td>
                    <td>{notice.Notice_Party}</td>
                    <td>{notice.Notice_Party_Description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: "publishedNotices",
        title: "Published Notices Details",
        content: (
          <>
            <h5>Published Notices</h5>
            <table>
              <thead>
                <tr>
                  {caseData.PublishedNotices?.header?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseData.PublishedNotices?.body?.map((notice, index) => (
                  <tr key={index}>
                    <td>{notice.Notice_Number}</td>
                    <td>{notice.Insertion_Date}</td>
                    <td>{notice.Notice_Type}</td>
                    <td>{notice.Journal_Name}</td>
                    <td>{notice.Journal_Number}</td>
                    <td>{notice.Journal_Issue_Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },

      {
        id: "petitions",
        title: "Petitions Details",
        content: (
          <>
            <h5>Petitions</h5>
            <table>
              <thead>
                <tr>
                  {caseData.Petitions?.header?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseData.Petitions?.body?.map((petition, index) => (
                  <tr key={index}>
                    <td>{petition.Petition_Number}</td>
                    <td>{petition.Subject}</td>
                    <td>{petition.Petition_Date}</td>
                    <td>{petition.Petition_Details}</td>
                    <td>{petition.Applicant}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: "effsahPlatformOrders",
        title: "Effsah Platform Orders Details",
        content: (
          <>
            <h5>Effsah Platform Orders</h5>
            <table>
              <thead>
                <tr>
                  {caseData.Effsah_Platform_Orders?.header?.map(
                    (header, index) => (
                      <th key={index}>{header}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {caseData.Effsah_Platform_Orders?.body?.map((order, index) => (
                  <tr key={index}>
                    <td>{order.Request_Number}</td>
                    <td>{order.Case_Number}</td>
                    <td>{order.Service_Name}</td>
                    <td>{order.Request_Date}</td>
                    <td>{order.Judge_Name}</td>
                    <td>{order.Request_Status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: "experienceReports",
        title: "Experience Reports Details",
        content: (
          <>
            <h5>Experience Reports</h5>
            <table>
              <thead>
                <tr>
                  {caseData.Experience_Reports?.header?.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caseData.Experience_Reports?.body?.map((report, index) => (
                  <tr key={index}>
                    <td>{report.Decision_Number}</td>
                    <td>{report.Expert_Name}</td>
                    <td>{report.Mission_Ascription_Date}</td>
                    <td>{report.Expected_Submission_Date}</td>
                    <td>{report.Actual_Submission_Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: "publicProsecutionReports",
        title: "Public Prosecution Reports Details",
        content: generateReportContent("Public_Prosecution_Reports"),
      },
      {
        id: "socialResearcherReports",
        title: "Social Researcher Reports Details",
        content: generateReportContent("Social_Researcher_Reports"),
      },
      {
        id: "relatedCases",
        title: "Related Cases Details",
        content: generateReportContent("Related_Cases"),
      },
      {
        id: "joinedCases",
        title: "Joined Cases Details",
        content: generateReportContent("Joined_Cases"),
      },

      {
        id: "Settlements_Legal_Reasoned_Decisions",
        title: "Settlements & Legal Reasoned Decisions",
        content: generateReportContent("Settlements_Legal_Reasoned_Decisions"),
      },
      {
        id: "Related_Claims_And_SubClaims",
        title: "Related Claims And SubClaims",
        content: generateReportContent("Related_Claims_And_SubClaims"),
      },
      {
        id: "Arrest_Orders",
        title: "Arrest Orders",
        content: generateReportContent("Arrest_Orders"),
      },
      {
        id: "Detentions",
        title: "Detentions",
        content: generateReportContent("Detentions"),
      },
      {
        id: "Bans",
        title: "Bans",
        content: generateReportContent("Bans"),
      },
      {
        id: "Seizures",
        title: "Seizures",
        content: generateReportContent("Seizures"),
      },
      {
        id: "auctions",
        title: "Auctions",
        content: generateReportContent("Auctions"),
      },
      {
        id: "seizedDocuments",
        title: "Seized Documents",
        content: generateReportContent("Seized_Documents"),
      },
      {
        id: "caseLetters",
        title: "Case Letters",
        content: generateReportContent("Case_Letters"),
      },
      {
        id: "mrletters",
        title: "Mr Letters",
        content: generateReportContent("Mr_Letters"),
      },
      {
        id: "payments",
        title: "Payments",
        content: generateReportContent("Payments"),
      },
      {
        id: "depositvouchers",
        title: "Deposit Vouchers",
        content: generateReportContent("Deposit_Vouchers"),
      },
      {
        id: "claims",
        title: "Claims",
        content: generateReportContent("Claims"),
      },
      {
        id: "relatedcaseregapps",
        title: "Related Case Reg Apps",
        content: generateReportContent("Related_Case_Reg_Apps"),
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
          className="col-8"
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
                  height: 200,
                  marginLeft: 15,
                  fontSize: 12,
                  color: "white",
                }}
              >
                {/* <h8 style={{ textAlign: 'end' }}> {caseData.case_detail.subject}</h8> */}
                <div className="datatextcolor">
                  caseNumber : {global.CaseId.CaseNumber}
                  <br />
                  status : {global.CaseId.Status} etc.
                </div>
              </div>
            </div>

            <div
              className="important-points datatextcolor col-4"
              style={{
                height: 270,
                width: "27%",
                boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div
                className=" d-flex m-0"
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
                <div style={{}}>
                  <div>claimedAmount: {caseData.ClaimedAmount}</div>
                </div>
                <div style={{}}>
                  <div>litigationStage: {caseData.CasePreparationDetails}</div>
                </div>
                <div style={{}}>
                  <div>totalClaimedAmount: {caseData.TotalClaimedAmount}</div>
                </div>

                <div style={{}}>
                  <div>caseBalance: {caseData.CaseBalance}</div>
                </div>
              </div>
            </div>

            <div className="row gap-3 pb-2" style={{}}>
              <div
                className="grid-item col-4 datatextcolor"
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
                  <div style={{ overflow: "hidden" }}>
                    <div>requestDate: {caseData.RequestDate}</div>
                  </div>
                  <div style={{}}>
                    <div>eSubmitDate: {caseData.ESubmitDate}</div>
                  </div>
                  <div style={{}}>
                    <div>
                      startPreparationDate: {caseData.StartPreparationDate}
                    </div>
                  </div>
                  <div style={{}}>
                    <div>nextSessionDate: {caseData.NextSessionDate}</div>
                  </div>
                  <div style={{}}>
                    <div>lastSessionDate: {caseData.LastSessionDate}</div>
                  </div>
                </div>
              </div>
              <div
                className="grid-item datatextcolor col-4"
                style={{
                  marginTop: -70,
                  boxShadow: "6px 6px 6px rgba(0, 0, 0, 0.2)",
                }}
              >
                <div
                  className=" d-flex mb-2 p-0"
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
                  <div style={{}}>
                    <div>
                      ascriptionDescription: {caseData.AscriptionDescription}
                    </div>
                  </div>
                  <div style={{}}>
                    <div>requestNumber: {caseData.RequestNumber}</div>
                  </div>
                  <div style={{}}>
                    <div>caseCurrentDetails: {caseData.CaseCurrentDetails}</div>
                  </div>
                  <div style={{}}>
                    <div>rootCaseNumber: {caseData.RootCaseNumber}</div>
                  </div>
                  <div style={{}}>
                    <div>rootDecision: {caseData.RootDecision}</div>
                  </div>
                  <div style={{}}>
                    <div>litigationStage: {caseData.LitigationStage}</div>
                  </div>
                </div>
              </div>
              <div
                className="grid-item col-3"
                style={{
                  width: "28%",
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
                  className="datatextcolor textpositions text-wrap-1"
                  style={{ fontSize: 12, overflow: "hidden" }}
                >
                  {caseData.LastDecisions}
                </div>
                {/* ))} */}
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
                        {section.title}
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
