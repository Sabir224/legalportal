import React from "react";
import { Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FaCalendar } from "react-icons/fa";

const MeetingsSection = ({
  prevMonth,
  nextMonth,
  currentDate,
  calendarDates,
  ExistSlotsMap,
  selectedDate,
  selectedSlot,
  setslotbookuserid,
  setNewStartTime,
  setNewEndTime,
  setEditingSlotIndex,
  handleBookTimeClick,
  handleTimeClick,
  setupdateslot,
  setSelectedSlot,
}) => {
  return (
    <Row
      className="g-3"
      style={{
        height: "100%",
        overflow: "auto",
      }}
    >
      <div
        style={{
          boxShadow: "0px 0px 0px gray",
          overflowY: "auto",
          maxHeight: "400px",
          scrollbarWidth: "thin",
          scrollbarColor: "#d2a85a #16213e",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          <button className="calender-button simple-text" onClick={prevMonth}>
            <FontAwesomeIcon icon={faArrowLeft} size="1x" />
          </button>
          <h3 style={{ fontSize: "1.2rem", textAlign: "center" }}>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="simple-text calender-button">
            <FontAwesomeIcon icon={faArrowRight} size="1x" />
          </button>
        </div>
        {/* List View */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {calendarDates
            .map((d) => (d instanceof Date ? d : new Date(d)))
            .filter((date) => {
              const slots = ExistSlotsMap[date.toDateString()] || [];
              return slots.some((slot) => slot.isBooked);
            })
            .map((date, index) => {
              const slots = ExistSlotsMap[date.toDateString()] || [];

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth < 576 ? "column" : "row", // smaller cutoff
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "10px",
                    background:
                      selectedDate?.toDateString() === date.toDateString()
                        ? "#d2a85a"
                        : "#16213e",
                    borderRadius: "8px",
                    color: "white",
                    gap: "10px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Date Column */}
                  <div
                    style={{
                      fontWeight: "bold",
                      width: window.innerWidth < 576 ? "100%" : "120px",
                      marginBottom: window.innerWidth < 576 ? "5px" : "0",
                    }}
                  >
                    {date.toDateString()}
                  </div>

                  {/* Slots Column */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      flexGrow: 1,
                      width: "100%",
                    }}
                  >
                    {slots.map((slot) =>
                      slot.isBooked ? (
                        <button
                          key={slot._id}
                          onClick={() => {
                            setslotbookuserid(slot);
                            setNewStartTime(
                              new Date(
                                `${date.toDateString()} ${slot.startTime}`
                              )
                            );
                            setNewEndTime(
                              new Date(`${date.toDateString()} ${slot.endTime}`)
                            );
                            setEditingSlotIndex(index);
                            handleBookTimeClick(slot);
                            handleTimeClick(slot.startTime);
                            setupdateslot(slot);
                            setSelectedSlot({
                              date: date.toDateString(),
                              time: slot.startTime,
                            });
                          }}
                          className="time-button"
                          style={{
                            flex:
                              window.innerWidth < 576
                                ? "1 1 100%"
                                : "1 1 130px",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #d4af37",
                            background:
                              selectedSlot?.date === date.toDateString() &&
                              selectedSlot?.time === slot.startTime
                                ? "#d2a85a"
                                : "green",
                            color: "white",
                            fontSize: "12px",
                            textAlign: "center",
                            cursor: "pointer",
                            boxSizing: "border-box",
                          }}
                        >
                          {slot.startTime} - {slot.endTime}
                        </button>
                      ) : null
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </Row>
  );
};

export default MeetingsSection;
