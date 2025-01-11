import React, { useState } from 'react';

const AvailableSlots = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

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
  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const timeSlots = ['02:00', '03:00', '04:00', '05:00']; // Example time slots
  const calendarDates = generateCalendarDates();

  return (
    <div style={{ padding: '20px', background: '#1a1a40', color: 'white', borderRadius: '10px', maxWidth: '400px' }}>
      <h2>Available Slots</h2>

      {/* Calendar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <button
          onClick={prevMonth}
          style={{
            background: 'none',
            border: '1px solid white',
            color: 'white',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Prev
        </button>
        <h3>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          style={{
            background: 'none',
            border: '1px solid white',
            color: 'white',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          Next
        </button>
      </div>

      {/* Days of the Week */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}>
        {daysOfWeek.map((day) => (
          <div key={day} style={{ width: 'calc(100% / 7)', textAlign: 'center' }}>
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
            style={{
              width: 'calc(100% / 7)',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '5px 0',
              cursor: date ? 'pointer' : 'default',
              background: selectedDate?.getTime() === date?.getTime() ? '#5656e6' : 'none',
              borderRadius: '5px',
              color: date ? 'white' : 'gray',
            }}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>

      {/* Selected Date */}
      <div style={{ marginTop: '20px' }}>
        {selectedDate ? (
          <h4>Selected Date: {selectedDate.toDateString()}</h4>
        ) : (
          <h4>Please select a date</h4>
        )}
      </div>

      {/* Available Time Slots */}
      <div>
        <h4>Available Times:</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              disabled={!selectedDate}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                border: selectedTime === time ? '2px solid white' : '1px solid gray',
                background: selectedTime === time ? '#5656e6' : '#1a1a40',
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
  );
};

export default AvailableSlots;
