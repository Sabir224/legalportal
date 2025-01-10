import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faHome, faMessage } from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import Case_details from "../Component/Case_details";
import { useDispatch, useSelector } from "react-redux";
import BasicCase from "./Pages/Component/BasicCase";
import { screenChange } from "../REDUX/sliece";




const Dashboard = () => {
  const screen = useSelector((state) => state.screen.value);
  const [currenScreen, setCurrentScreen] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (screen === 0) {
      setCurrentScreen(<BasicCase />);
    } else if (screen === 1) {
      setCurrentScreen(<Case_details />);
    }
  }, [screen]);
  // if (screen === 0) {
  //   setCurrentScreen(<BasicCase />)

  // }
  // if (screen === 1) {
  //   setCurrentScreen(<Case_details />)
  // }




  const data = [
    { status: 'Active', name: 'ABC', number: '1234' },
    { status: 'Inactive', name: 'DEF', number: '5678' },
    { status: 'Pending', name: 'GHI', number: '9101' },
  ];

  return (
    <div className="m-0 px-0 pt-2" style={{ overflow: "hidden", height: '93%' }}>
      <div
        className="position-fixed d-flex flex-column align-items-center text-white"
        style={{
          width: "80px",
          height: "95%",
          borderRadius: "10px",
          padding: "10px 0",
          zIndex: 1000,
          marginLeft: "10px",
          backgroundColor: "#18273e",
        }}
        id="sidebar"
      >
        <FontAwesomeIcon icon={faHome} size="2x" color="white" style={{ margin: 10 }} className="clickable" onClick={() => dispatch(screenChange(0))} />
        <FontAwesomeIcon icon={faMessage} size="2x" color="white" style={{ margin: 10 }} />
        <FontAwesomeIcon icon={faCalendar} size="2x" color="white" style={{ margin: 10 }} />
        <FontAwesomeIcon icon={faWhatsapp} size="2x" color="white" style={{ margin: 10 }} />
        <FontAwesomeIcon icon={faFacebook} size="2x" color="white" style={{ margin: 10 }} />

      </div>


      <div
        className="container-fluid"
        style={{ marginLeft: "90px" }} // Increased paddingTop for spacing
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-2 ms-1 col-11" id="case-header">
          <h2>Case</h2>
          <div id="notification-profile">
            <button className="btn  me-2">🔔</button>
            <button className="btn ">👤</button>
          </div>
        </div>




        {/* Main Form */}

        <div className="ms-1 " >
          <div style={{ padding: 1 }}>
            {currenScreen}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
