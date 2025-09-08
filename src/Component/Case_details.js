import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Caseinfo, screenChange } from "../REDUX/sliece";
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
import { Spinner } from "react-bootstrap";

const Case_details = ({ token }) => {
  const dispatch = useDispatch();
  const [activeSections, setActiveSections] = useState([]);
  const [buttoncolor, setbuttoncolor] = useState([]);
  const [activeButtons, setActiveButtons] = useState({}); // Track button states by ID
  const [sections, setsections] = useState([]); // Track button states by ID
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [error, setError] = useState("");
  const [caseData, setCaseData] = useState("");
  const [user, setUser] = useState("");
  const [lawyerDetails, setLawyersDetails] = useState([]);

  const [pendingCaseData, setPendingCaseData] = useState(null);
  const [effectiveCaseInfo, setEffectiveCaseInfo] = useState(null);
  const reduxCaseInfo = useSelector((state) => state.screen.Caseinfo);


  const [lastActiveSectionId, setLastActiveSectionId] = useState(null);
  const [isLFQISfilled, setisLFQISfilled] = useState(false);
  const [isclientAssigned, setisclientAssigned] = useState(reduxCaseInfo?.ClientId ? true : (reduxCaseInfo?._id && !reduxCaseInfo?.CaseNumber) ? true : false);
  const sectionRefs = useRef({});
  const previousActiveSections = useRef([]);


  useEffect(() => {
    // Find which section is new
    const newlyAdded = activeSections.find(
      (id) => !previousActiveSections.current.includes(id)
    );

    if (newlyAdded) {
      setLastActiveSectionId(newlyAdded);
    }

    // Update previous for next render
    previousActiveSections.current = activeSections;
  }, [activeSections]);


  useEffect(() => {
    const ref = sectionRefs.current[lastActiveSectionId];
    if (ref && ref.current) {
      // Delay to ensure DOM is painted
      setTimeout(() => {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [lastActiveSectionId]);











  useEffect(() => {
    const pendingCaseId = localStorage.getItem("pendingCaseId");
    const pendingUserId = localStorage.getItem("pendingUserId");
    const pendingScreenIndex = localStorage.getItem("pendingScreenIndex");
    const acknowledgeCaseId = localStorage.getItem("acknowledgeCaseId");
    const acknowledgeUserId = localStorage.getItem("acknowledgeUserId");

    if ((pendingCaseId || acknowledgeCaseId) && (pendingUserId || acknowledgeUserId) && pendingScreenIndex) {
      setPendingCaseData({
        caseId: pendingCaseId || acknowledgeCaseId,
        userId: pendingUserId || acknowledgeUserId,
        screenIndex: pendingScreenIndex,
      });
      setEffectiveCaseInfo({
        _id: pendingCaseId || acknowledgeCaseId,
        ClientId: pendingUserId || acknowledgeUserId,
      });

      console.log("reduxCaseInfo", reduxCaseInfo)
      dispatch(reduxCaseInfo ? Caseinfo(reduxCaseInfo) : Caseinfo({
        _id: pendingCaseId || acknowledgeCaseId,
      }));

    } else {
      setEffectiveCaseInfo(reduxCaseInfo || global.CaseId);
      console.log("reduxCaseInfo else", reduxCaseInfo)

      dispatch(reduxCaseInfo ? Caseinfo(reduxCaseInfo) : Caseinfo({
        _id: pendingCaseId || acknowledgeCaseId,
      }));

    }
  }, []);

  // Sync with Redux when not using pending data
  useEffect(() => {
    if (!pendingCaseData && reduxCaseInfo) {
      setEffectiveCaseInfo(reduxCaseInfo);
    }
  }, [reduxCaseInfo, pendingCaseData]);

  const getCaseId = () => {
    // Only use pending caseId if available
    return (
      reduxCaseInfo?._id || pendingCaseData?.caseId || (global.CaseId ? global.CaseId._id : null)
    );
  };

  const getUserId = () => {
    // Only use pending userId if available
    return pendingCaseData?.userId || (global.User ? global.User._id : null);
  };
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
        content: (
          <EffsahPlatformOrders data={caseData.Effsah_Platform_Orders} />
        ),
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
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Related_Cases"} />
        ),
      },
      {
        id: "joinedCases",
        title: "Joined Cases Details",
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Joined_Cases"} />
        ),
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
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Arrest_Orders"} />
        ),
      },
      {
        id: "Detentions",
        title: "Detentions",
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Detentions"} />
        ),
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
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Seized_Documents"} />
        ),
      },
      {
        id: "caseLetters",
        title: "Case Letters",
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Case_Letters"} />
        ),
      },
      {
        id: "mrletters",
        title: "Mr Letters",
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Mr_Letters"} />
        ),
      },
      {
        id: "payments",
        title: "Payments",
        content: <SubCaseDetails caseData={caseData} reportType={"Payments"} />,
      },
      {
        id: "depositvouchers",
        title: "Deposit Vouchers",
        content: (
          <SubCaseDetails caseData={caseData} reportType={"Deposit_Vouchers"} />
        ),
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
          <SubCaseDetails
            caseData={caseData}
            reportType={"Related_Case_Reg_Apps"}
          />
        ),
      },
      {
        id: "decisionsAndSessionMinutes",
        title: "Decisions and Session Minutes",
        content: (
          <SubCaseDetails
            caseData={caseData}
            reportType={"Decisions_and_Session_Minutes"}
          />
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

  // State to handle errors
  const [loading, setLoading] = useState(true); // State to handle loading
  useEffect(() => {
    if (effectiveCaseInfo?._id) {
      fetchCases();
      fetchLawyerDetails();
    }
  }, [effectiveCaseInfo?._id]);
  // Function to fetch cases
  const fetchCases = async () => {
    setLoading(true);
    setIsDataFetched(false);
    setsections([]);


    try {
      setLoading(true);
      const res = await axios.get(`${ApiEndPoint}getLFQCheckbyCaseId/${reduxCaseInfo?._id}`);
      console.log("res.data.result= ", res.data.result)
      setisLFQISfilled(res.data.result); // true/false backend se
    } catch (err) {
      console.error("Error fetching LFQ form:", err);
      setisLFQISfilled(false); // agar error ho to default false
    } finally {
      setLoading(false);
    }


    try {
      const caseIdToUse = getCaseId();
      if (!caseIdToUse) {
        throw new Error("No case ID available");
      }

      const caseResponse = await axios.get(
        `${ApiEndPoint}getCaseDetail/${caseIdToUse}`,
        { withCredentials: true }
      );
      setCaseData(caseResponse.data.caseDetails);

      const partiesResponse = await axios.get(
        `${ApiEndPoint}getparties/${caseIdToUse}`
      );

      const transformed = transformData(partiesResponse.data);
      setsections(transformed);

      // Clear pending data if we used it successfully
      // if (pendingCaseData) {
      //   localStorage.removeItem("pendingCaseId");
      //   localStorage.removeItem("pendingUserId");
      //   localStorage.removeItem("pendingScreenIndex");
      //   setPendingCaseData(null);
      // }
    } catch (err) {
      console.error("Error fetching case or party data:", err);
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setIsDataFetched(true);
      }, 1000);
    }
  };
  const fetchLawyerDetails = async () => {
    // try {
    //   const response = await axios.get(
    //     `${ApiEndPoint}geLawyerDetails?Email=Lawyer@gmail.com`
    //   ); // API endpoint
    //   // console.log("data of case", response.data.caseDetails);
    //   // Assuming the API returns data in the `data` field
    //   setUser(response.data.user);
    //   // console.log(response.data.lawyerDetails)
    //   setLawyersDetails([response.data.lawyerDetails]);
    //   setLoading(false);
    // } catch (err) {
    //   setError(err.message);
    //   setLoading(false);
    // }
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
  const handleCaseUpdate = async () => {
    global.lawyerDetails = lawyerDetails[0];
    global.User = user;
    console.log(global.User);
    dispatch(screenChange(20));
  };
  const handleViewClientDetails = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(7));
  };
  const handleAddTask = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(15));
  };
  const handleFormH = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(17));
  };
  const handleFormMOM = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(23));
  };
  const handleFormLFA = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(27));
  };
  const handleFormLFQ = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(28));
  };
  const handleViewTask = async () => {
    // global.lawyerDetails = lawyerDetails[0];
    // global.User = user;
    // console.log(global.User);
    dispatch(screenChange(14));
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
  const renderedSections = useMemo(() => {
    return sections.map((section) => (
      <div key={section.id} className="d-flex justify-content-center mb-2">
        <button
          onClick={() => toggleSection(section.id)}
          style={{
            backgroundColor: "#16213e",
            color: "white",
            width: "250px",
            minWidth: "200px",
            maxWidth: "300px",
            padding: "8px 20px",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            textAlign: "center",
            border: activeButtons[section.id]
              ? "2px solid #d4af37"
              : "2px solid #16213e",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
            fontWeight: "500",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = "2px solid white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = activeButtons[section.id]
              ? "2px solid #d4af37"
              : "2px solid rgba(0, 0, 0, 0.2)";
          }}
        >
          {section.title}
        </button>
      </div>
    ));
  }, [sections, activeButtons, toggleSection]);

  function renderSidebarContent() {
    return (
      <>
        {[
          ...(token?.Role !== "lawyer"
            ? [{ label: "View lawyer", onClick: handleViewDetails }]
            : []),
          ...[{ label: "View Folder", onClick: handleViewFolders }],
          ...[{ label: "Case Update", onClick: handleCaseUpdate }],

          ...(token?.Role !== "client"
            ? [{ label: "View Client", onClick: handleViewClientDetails }]
            : []),
          ...(token?.Role !== "client"
            ? [{ label: "View Task", onClick: handleViewTask }]
            : []),
          ...(token?.Role !== "client"
            ? [{ label: "Add Task", onClick: handleAddTask }]
            : []),
          ...((token?.Role !== "client" && isclientAssigned)
            ? [{ label: "Form H", onClick: handleFormH }]
            : []),
          ...((token?.Role !== "client" && isclientAssigned)
            ? [{ label: "Form MOM", onClick: handleFormMOM }]
            : []),

          ...((isclientAssigned)
            ? [{ label: "Form LFQ", onClick: handleFormLFQ }]
            : []),

          ...((isLFQISfilled && isclientAssigned)
            ? [{ label: "Form LFA", onClick: handleFormLFA }]
            : []),

        ].map(({ label, onClick }, index) => (
          <div key={index} className="d-flex justify-content-center mb-2">
            <button
              style={{
                backgroundColor: "#16213e",
                color: "white",
                width: "250px",
                minWidth: "200px",
                maxWidth: "300px",
                padding: "8px 20px",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                textAlign: "center",
                border: "2px solid #16213e",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease",
                fontWeight: "500",
              }}
              onClick={onClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 8px rgba(0, 0, 0, 0.2)";
                e.currentTarget.style.border = "2px solid #c0a262";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.border = "2px solid #16213e";
              }}
            >
              {label}
            </button>
          </div>
        ))}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0">Loading case details...</p>
            </div>
          </div>
        ) : sections && sections.length > 0 ? (
          <div className="d-flex flex-column align-items-center gap-2">
            {renderedSections}
          </div>
        ) : !loading && isDataFetched && sections.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="text-center text-danger">
              <h4>No Sub Details Found</h4>
            </div>
          </div>
        ) : null}
      </>
    );
  }
  const handlePortalCaseClick = async () => {

    try {
      const caseIdToUse = getCaseId();
      if (!caseIdToUse) {
        console.error("No case ID available");
      }

      const caseResponse = await axios.get(
        `${ApiEndPoint}getCaseById/${reduxCaseInfo?.CaseMergeWith}`,
        { withCredentials: true }
      );
      console.log("caseResponse.data.caseDetails", caseResponse.data.clientCase)
      dispatch(Caseinfo(caseResponse.data.clientCase));
      fetchCases()
      // setCaseData(caseResponse.data.caseDetails);

    } catch (err) {
      console.error("Error fetching case or party data:", err);
      setError(err.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setIsDataFetched(true);
      }, 1000);
    }
    // alert("Open portal case with ID: " + caseId);
    // ya koi bhi logic: window.open, modal show, redirect, etc.
  }


  return (
    <div
      className="position-relative container-fluid m-0 p-0"
      style={{
        maxHeight: "86vh", // yeh maximum height set karega
        overflowY: "hidden", // aur yeh scroll enable karega agar content zyada ho
        padding: "0 10px",
      }}
    >

      {/* Main Block (always rendered) */}
      <div
        className="row m-0 w-80"
      // style={
      //   !(reduxCaseInfo?.IsDubiCourts && !reduxCaseInfo?.CaseMergeWith)
      //     ? {
      //       pointerEvents: "none", // disables interaction
      //       opacity: 0.6, // optional: greyed-out appearance
      //     }
      //     : {}
      // }
      >
        {/* Left Sidebar Column */}
        <div className="d-md-none w-100">
          <div
            className="p-4 rounded mt-2"
            style={{
              background: "#d3b386",
              boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.2)",
              height: "20vh", // 30% of viewport height
              overflowY: "auto", // scroll if content exceeds
            }}
          >
            {/* Sidebar content here */}
            {renderSidebarContent()}
          </div>
        </div>

        {/* Sidebar for md and larger */}
        <div className="col-lg-3 col-md-4 d-none d-md-block p-0">
          <div
            className="p-4 rounded"
            style={{
              overflow: "hidden",
              height: "86vh",
              background: "#d3b386",
              boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.2)",
            }}
            onWheel={handleScroll}
            ref={scrollRef}
          >
            {renderSidebarContent()}
          </div>
        </div>

        {/* Main Content Column */}
        <div className="col-lg-9 col-md-8 col-12 p-0">
          <div
            style={{
              height: "86vh",
              maxHeight: "86vh",
              overflowY: "auto",
              padding: "0 10px",
            }}
          >
            <div className="row g-2">
              {/* First Line - Subject (70%) and Amount (30%) */}
              <div className="col-lg-8 col-md-7 col-12">
                <div
                  className="subject-line p-3"
                  style={{
                    height: "100%",
                    boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    background: "#16213e",
                  }}
                >
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ color: "#c0a262" }}
                  >
                    <FontAwesomeIcon icon={faComment} className="me-2" />
                    <h3 className="m-0" style={{ fontSize: "18px" }}>
                      Subject
                    </h3>
                  </div>
                  <div className="text-white" style={{ fontSize: "13px" }}>
                    {fieldMappings
                      .filter((f) =>
                        ["CaseNumber", "CaseStatus"].includes(f.key)
                      )
                      .map(
                        ({ key, label }) =>
                          caseData?.[key] && (
                            <div key={key} className="d-flex mb-1">
                              <span className="fw-bold me-2">{label}:</span>
                              <span>{caseData[key]}</span>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-5 col-12">
                <div
                  className="p-3"
                  style={{
                    height: "100%",
                    boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    background: "#16213e",
                  }}
                >
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ color: "#c0a262" }}
                  >
                    <FontAwesomeIcon icon={faMoneyBills} className="me-2" />
                    <h3 className="m-0" style={{ fontSize: "18px" }}>
                      Amount
                    </h3>
                  </div>
                  <div className="text-white" style={{ fontSize: "13px" }}>
                    {fieldMappings
                      .filter((f) =>
                        [
                          "ClaimedAmount",
                          "LitigationStage",
                          "TotalClaimedAmount",
                          "CaseBalance",
                        ].includes(f.key)
                      )
                      .map(
                        ({ key, label }) =>
                          caseData?.[key] && (
                            <div key={key} className="d-flex mb-1">
                              <span className="fw-bold me-2">{label}:</span>
                              <span>{caseData[key]}</span>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>

              {/* Second Line - Other Details (100%) */}
              <div className="col-12">
                <div
                  className="p-3"
                  style={{
                    boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    background: "#16213e",
                  }}
                >
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ color: "#c0a262" }}
                  >
                    <img
                      src={require(`../Main/Pages/Component/Casedetails/Icons/others.png`)}
                      style={{ height: "20px", marginRight: "10px" }}
                      alt="Other details icon"
                    />
                    <h3 className="m-0" style={{ fontSize: "18px" }}>
                      Other Details
                    </h3>
                  </div>
                  <div
                    className="row g-2 text-white"
                    style={{ fontSize: "13px" }}
                  >
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
                      .map(
                        ({ key, label }) =>
                          caseData?.[key] && (
                            <div key={key} className="col-md-6 col-12">
                              <div className="d-flex mb-1">
                                <span className="fw-bold me-2">{label}:</span>
                                <span>{caseData[key]}</span>
                              </div>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>

              {/* Third Line - Dates (50%) and Last Decisions (50%) */}
              <div className="col-lg-6 col-md-6 col-12">
                <div
                  className="p-3 h-100"
                  style={{
                    boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    background: "#16213e",
                    height: "100%",
                  }}
                >
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ color: "#c0a262" }}
                  >
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    <h3 className="m-0" style={{ fontSize: "18px" }}>
                      Dates
                    </h3>
                  </div>
                  <div className="text-white" style={{ fontSize: "13px" }}>
                    {fieldMappings
                      .filter((f) => f.key.toLowerCase().includes("date"))
                      .map(
                        ({ key, label }) =>
                          caseData?.[key] && (
                            <div key={key} className="d-flex mb-1">
                              <span className="fw-bold me-2">{label}:</span>
                              <span>{caseData[key].split("T")[0]}</span>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 col-12">
                <div
                  className="p-3 h-100"
                  style={{
                    boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    background: "#16213e",
                    height: "100%",
                  }}
                >
                  <div
                    className="d-flex align-items-center mb-2"
                    style={{ color: "#c0a262" }}
                  >
                    <FontAwesomeIcon icon={faGavel} className="me-2" />
                    <h3 className="m-0" style={{ fontSize: "18px" }}>
                      Last Decisions
                    </h3>
                  </div>
                  {caseData?.LastDecisions && (
                    <div className="text-white" style={{ fontSize: "13px" }}>
                      {caseData.LastDecisions}
                    </div>
                  )}
                </div>
              </div>

              {/* Sections */}

              {sections.map((section) => {
                if (!activeSections.includes(section.id)) return null;

                // Assign a ref for each section
                if (!sectionRefs.current[section.id]) {
                  sectionRefs.current[section.id] = React.createRef();
                }

                return (
                  <div className="col-12" key={section.id} ref={sectionRefs.current[section.id]}>
                    <div
                      className="p-3"
                      style={{
                        boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
                        borderRadius: "8px",
                        background: "#16213e",
                      }}
                    >
                      <div className="d-flex align-items-center mb-2" style={{ color: "#c0a262" }}>
                        <img
                          src={require(`../Main/Pages/Component/Casedetails/Icons/${section.id}.png`)}
                          style={{ height: "20px", marginRight: "10px" }}
                          alt={`${section.title} icon`}
                        />
                        <h3 className="m-0" style={{ fontSize: "18px" }}>{section.title}</h3>
                      </div>
                      <div className="text-white" style={{ fontSize: "13px" }}>{section.content}</div>
                    </div>
                  </div>
                );
              })}


              {/* {sections.map(
                (section) =>
                  activeSections.includes(section.id) && (
                    <div className="col-12" key={section.id}>
                      <div
                        className="p-3"
                        style={{
                          boxShadow: "4px 4px 6px rgba(0, 0, 0, 0.1)",
                          borderRadius: "8px",
                          background: "#16213e",
                        }}
                      >
                        <div
                          className="d-flex align-items-center mb-2"
                          style={{ color: "#c0a262" }}
                        >
                          <img
                            src={require(`../Main/Pages/Component/Casedetails/Icons/${section.id}.png`)}
                            style={{ height: "20px", marginRight: "10px" }}
                            alt={`${section.title} icon`}
                          />
                          <h3 className="m-0" style={{ fontSize: "18px" }}>
                            {section.title}
                          </h3>
                        </div>
                        <div
                          className="text-white"
                          style={{ fontSize: "13px" }}
                        >
                          {section.content}
                        </div>
                      </div>
                    </div>
                  )
              )} */}
            </div>

            <style jsx>{`
              .main-content-container {
                height: 100vh;
              }
              @media (min-width: 768px) {
                .main-content-container {
                  height: 86vh;
                  max-height: 86vh;
                }
              }
              @media (max-width: 767px) {
                .main-content-container {
                  height: 86vh;
                  max-height: 86vh;
                }
              }
            `}</style>
          </div>
        </div>
      </div>

      {(
        !reduxCaseInfo?.IsDubiCourts && reduxCaseInfo?.CaseMergeWith
      ) && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)", // translucent white
              zIndex: 10,
            }}
          >
            <div
              className="text-center px-5 py-3 rounded"
              style={{
                fontSize: "1.25rem",
                fontWeight: "500",
                backgroundColor: "#fff",
                color: "#343a40",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
              }}
            >
              <span>
                Case is merged with a Dubai Court Portal Case:{" "}
                <a
                  href="#"
                  onClick={() => handlePortalCaseClick()}
                  style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                >
                  View Case
                </a>
              </span>
            </div>
          </div>
        )}

    </div>
  );
};
export default Case_details;
