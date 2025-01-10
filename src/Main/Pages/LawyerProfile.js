import React, { useState } from "react";
import "../../style/LawyerProfile.css";

const LawyerProfile = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="lawyer-profile">
      <div className="profile-section">
        <div className="lawyer-picture">Lawyer's Picture</div>
        <div className="lawyer-details">
          <h2>Lawyer's Name</h2>
          <p>Designation</p>
          <p>
            A short brief about professional career. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
      <div className="slots-section">
        <div className="month-selector">
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            {/* Add more months as needed */}
          </select>
        </div>
        <div className="available-slots">
          <h3>Available Slots</h3>
          <div className="days">
            <button>08 Mon</button>
            <button>08 Mon</button>
            <button>08 Mon</button>
            <button>08 Mon</button>
          </div>
          <div className="hours">
            <button>02:00</button>
            <button>02:00</button>
            <button>02:00</button>
            <button>02:00</button>
          </div>
        </div>
      </div>
      <button className="schedule-button">Schedule a meeting</button>
    </div>
  );
};

export default LawyerProfile;
