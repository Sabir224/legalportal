import React, { useState } from "react";
import "./LawyerChat.css";

const LawyerChat = () => {
    const [selectedLawyer, setSelectedLawyer] = useState(null);

    const lawyers = ["Lawyer 1", "Lawyer 2"];

    return (
           <div className="lawyer-chat-container gap-2 ms-1">
                {/* Sidebar */}
                <div className="sidebar">
                    <h3>Search Lawyer</h3>
                    <div className="lawyer-list">
                        {lawyers.map((lawyer, index) => (
                            <button
                                key={index}
                                className={`lawyer-item ${selectedLawyer === lawyer ? "active" : ""
                                    }`}
                                onClick={() => setSelectedLawyer(lawyer)}
                            >
                                <span role="img" aria-label="lawyer-icon">👤</span> {lawyer}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="chat-section">
                    {selectedLawyer ? (
                        <>
                            <h4 className="chat-title">{selectedLawyer}</h4>
                            <div className="chat-box">
                                <div className="chat-header">Client Lawyer Chat</div>
                                <div className="chat-body">
                                    <p>For chat follow the AWS CRM design format</p>
                                    <p>And same for lawyer and client chat</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="select-prompt">Select a lawyer to start chatting.</p>
                    )}
                </div>
            </div>
       
    );
};

export default LawyerChat;
