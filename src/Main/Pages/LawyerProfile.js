import React, { useState } from "react";
import "../../style/LawyerProfile.css";
import { Alert } from "bootstrap";

const LawyerProfile = () => {
  // const [selectedMonth, setSelectedMonth] = useState("January");

  // const handleMonthChange = (e) => {
  //   setSelectedMonth(e.target.value);
  // };

  // const [selectedDay, setSelectedDay] = useState(null);
  // const [selectedTime, setSelectedTime] = useState(null);

  // const months = ["January", "February", "March", "April"];
  // const days = [
  //   { date: "08", day: "Mon" },
  //   { date: "09", day: "Tue" },
  //   { date: "10", day: "Wed" },
  //   { date: "11", day: "Thu" },
  // ];
  // const hours = ["02:00", "03:00", "04:00", "05:00"];

  // const handleDayClick = (day) => {
  //   setSelectedDay(day);
  //   setSelectedTime(null); // Reset time when a new day is selected
  // };

  // const handleTimeClick = (time) => {
  //   setSelectedTime(time);
  // };

  // const handleSchedule = () => {
  //   if (selectedDay && selectedTime) {
  //     alert(`Meeting scheduled on ${selectedDay.date} ${selectedDay.day} at ${selectedTime}`);
  //   } else {
  //     alert("Please select a day and time to schedule a meeting.");
  //   }
  // };







  const [date, setdate] = useState(null);
  const [getDay, setDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const months = ["January", "February", "March", "April"];
  const days = [
    { date: "08", day: "Mon" },
    { date: "09", day: "Tue" },
    { date: "10", day: "Wed" },
    { date: "11", day: "Thu" },
  ];
  const hours = ["02:00", "03:00", "04:00", "05:00"];

  const handleDayClick = (day) => {
    setdate(day.date)
    setDay(day.day)
    setSelectedTime();
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleSchedule = () => {
    if (getDay && date && selectedTime) {
      alert(`Meeting scheduled on ${date} ${getDay} at ${selectedTime}`);
    } else {
      alert("Please select both a day and time to schedule a meeting.");
    }
  };

  return (
    <div className="border rounded" style={{ width: "92%", padding: 10, boxShadow: "5px 5px 5px gray" }}>
      <div className="row gap-5 justify-content-center " >
        <div className="slots-section col-5" style={{ boxShadow: "5px 5px 5px gray" }}>
          <div className="profile-section"  >
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
        </div>
        <div
          className="slots-section col-5 "
          style={{ boxShadow: "5px 5px 5px gray" }}
        >



          {/* Month Selector */}
          <div className="d-flex " style={{ marginBottom: "2px", justifyContent: 'space-between' }}>
            <div>
              <h4>Available Slots</h4>
            </div>
            <select className="monthselector"
              style={{
                // padding: "5px",
                // borderRadius: "5px",
                // border: "1px solid #d2a85a",
                // backgroundColor: "#1a2a43",
                // color: "#d2a85a",
              }}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Day Selection */}
          <h4>Days</h4>
          <div className="days button" style={{
            //display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px"
          }}>
            {days.map((day) => (
              <button
                key={day.date}
                style={{
                  backgroundColor: getDay === day.day ? "white" : "transparent",
                  color: getDay === day.day ? "#1a2a43" : "white",
                  border: "1px solid white",
                  borderRadius: "5px",
                  padding: "10px",
                  cursor: "pointer",
                  minWidth: "70px",
                }}
                onClick={() => handleDayClick(day)}
              >
                {day.date} <br /> {day.day}
              </button>
            ))}
          </div>

          {/* Hour Selection */}
          <h4>Hours</h4>
          <div className="hours button" style={{
            //display: "flex", gap: "10px", flexWrap: "wrap"
          }}>
            {hours.map((hour) => (
              <button
                key={hour}
                style={{
                  backgroundColor: selectedTime === hour ? "white" : "transparent",
                  color: selectedTime === hour ? "#1a2a43" : "white",
                  border: "1px solid white",
                  borderRadius: "5px",
                  padding: "10px",
                  cursor: "pointer",
                  minWidth: "70px",
                }}
                onClick={() => handleTimeClick(hour)}
              >
                {hour}
              </button>
            ))}
          </div>

          {/* Schedule Button */}

        </div>
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button className="schedule-button"
            style={{ boxShadow: "5px 5px 5px gray" }}
            onClick={handleSchedule}
          >
            Schedule Meeting
          </button>
        </div>
      </div>
    </div>
  );

};

export default LawyerProfile;
