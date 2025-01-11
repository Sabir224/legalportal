import React, { useState } from "react";
import "../../style/LawyerProfile.css";
import { Alert } from "bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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











  const [currentDate, setCurrentDate] = useState(new Date());
  //const [selectedDate, setSelectedDate] = useState(null);
  //const [selectedTime, setSelectedTime] = useState(null);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate dates for the current month
  const generateCalendarDates = () => {
    const dates = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill the first week with empty slots until the first day
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    // Add all the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    return dates;
  };

  // Move to the previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Move to the next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateClick = (date) => {
    if (date) setSelectedDate(date);
    setSelectedTime(null); // Reset selected time when the date changes
  };

  // Handle time selection
  // const handleTimeClick = (time) => {
  //   setSelectedTime(time);
  // };

  //const timeSlots = ['02:00', '03:00', '04:00', '05:00']; // Example time slots
  const calendarDates = generateCalendarDates();









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


  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selectedTime, setSelectedTime] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset the time when the date changes
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const timeSlots = ['02:00', '03:00', '04:00', '05:00']; // Example time slots


  const handleDayClick = (day) => {
    setdate(day.date)
    setDay(day.day)
    setSelectedTime();
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handleSchedule = () => {
    // if (selectedDate && selectedTime) {
    alert(`Meeting scheduled on  ${selectedDate} at ${selectedTime}`);
    // } else {
    //   alert("Please select both a day and time to schedule a meeting.");
    // }
  };

  return (
    <div className="border rounded" style={{ width: "92%", padding: 10, boxShadow: "5px 5px 5px gray" }}>
      <div className="row gap-5 justify-content-center " >
        <div className="slots-section col-5" style={{ boxShadow: "5px 5px 5px gray" }}>
          <div className="profile-section"  >
            <div className="lawyer-picture" style={{ alignSelf: 'center', textAlign: 'center' }}>Lawyer's Picture</div>
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


            {/* <select className="monthselector"
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
            </select> */}
            {/* 
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()} // Prevent selecting past dates
            className="react-calendar "
            style={{ borderRadius:6 }}
            />
            </div>

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
            */}
            {/* Calendar Header */}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="calender-button"
              onClick={prevMonth}
              style={{
                // background: 'none',
                // border: '1px solid white',
                // color: 'white',
                // padding: '5px 10px',
                // cursor: 'pointer',
                // borderRadius: '5px',
              }}
            >
              Prev
            </button>
            <h3>
              {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={nextMonth}
              className="calender-button"
            // style={{
            //   background: 'none',
            //   border: '1px solid white',
            //   color: 'white',
            //   padding: '5px 10px',
            //   cursor: 'pointer',
            //   borderRadius: '5px',
            // }}
            >
              Next
            </button>
          </div>

          {/* Days of the Week */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}>
            {daysOfWeek.map((day) => (
              <div key={day} className="Calendarday" style={{ width: 'calc(100% / 7)', textAlign: 'center' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {calendarDates.map((date, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className="calendarDates"
                style={{
                  // width: 'calc(100% / 7)',
                  // // height: '40px',
                  // display: 'flex',
                  // justifyContent: 'center',
                  // alignItems: 'center',
                  // margin: '2px 0',
                  cursor: date ? 'pointer' : 'default',
                  background: selectedDate?.getTime() === date?.getTime() ? '#001f3f' : 'none',
                  borderRadius: '5px',
                  color: date ? 'white' : '#001f3f',
                  border: selectedDate?.getTime() === date?.getTime() ? '2px solid #d2a85a' : '1px solid #001f3f',
                }}
              >
                {date ? date.getDate() : ''}
              </div>
            ))}
          </div>

          {/* Selected Date */}
          <div style={{ marginTop: '8px' }}>
            {selectedDate ? (
              <h5>Selected Date: {selectedDate.toDateString()}</h5>
            ) : (
              <h6>Please select a date</h6>
            )}
          </div>

          {/* Available Time Slots */}
          <div>
            <h5>Available Times:</h5>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className="time-button"
                  disabled={!selectedDate}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: selectedTime === time ? '2px solid white' : '1px solid #d4af37',
                    background: selectedTime === time ? '#d2a85a' : '#16213e',
                    color: selectedDate ? 'white' : 'gray',
                    cursor: selectedDate ? 'pointer' : 'not-allowed',
                  }}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "1px", textAlign: "center" }}>
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
