import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "../../Dashboard.css"

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { screenChange } from "../../../REDUX/sliece";




const BasicCase = () => {
    const [caseNumber, setCaseNumber] = useState("");
    const [caseName, setCaseName] = useState("");
    const navigate = useNavigate();
    const [check, setcheck] = useState(true)
    const screen = useSelector((state) => state.screen.value);
    console.log("change screen value", screen)
    const dispatch = useDispatch();

    const handleViewDetails = () => {
        console.log("View details for:", caseNumber, caseName);
    };

    const handleClick = async (scr, item) => {
        dispatch(screenChange(1));

        await setcheck(!check)
        //alert(`Clicked: ${item.name}`);
    };

    const data = [
        { status: 'Active', name: 'ABC', number: '1234' },
        { status: 'Inactive', name: 'DEF', number: '5678' },
        { status: 'Pending', name: 'GHI', number: '9101' },
    ];

    return (
        <div className="card" id="maincontent">
            <div className="card-header">
                <span className="status">Status</span>
                <span className="name">Name</span>
                <span className="number">Number</span>
            </div>

            <div className="card-list" style={{ marginBottom: 50, overflow: 'auto' }}>

                {data.map((item, index) => (
                    <div >
                        <div
                            key={index}
                            className="card-row clickable"
                            onClick={() => handleClick(1, item)}
                        >
                            <span className="status">

                                <span
                                    className={`status-dot ${item.status.toLowerCase() === 'active' ? 'active' : 'inactive'
                                        }`}
                                ></span>
                                {item.status}
                            </span>
                            <span className="name">{item.name}</span>
                            <span className="number">{item.number}</span>
                        </div>
                        <hr style={{ border: '1px solid #dcdcdc', width: '90%', justifySelf: 'center' }} />
                        <div
                            key={index}
                            className="card-row clickable"
                            onClick={() => handleClick(1, item)}
                        >
                            <span className="status">

                                <span
                                    className={`status-dot ${item.status.toLowerCase() === 'active' ? 'active' : 'inactive'
                                        }`}
                                ></span>
                                {item.status}
                            </span>
                            <span className="name">{item.name}</span>
                            <span className="number">{item.number}</span>
                        </div>
                        <hr style={{ border: '1px solid #dcdcdc', width: '90%', justifySelf: 'center' }} />

                    </div>
                ))}
            </div>
        </div>
    );
};

export default BasicCase;

