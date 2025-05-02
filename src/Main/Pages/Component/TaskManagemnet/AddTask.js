import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaTasks,
  FaAudioDescription,
  FaCalendarAlt
} from "react-icons/fa";
import { Bs123 } from "react-icons/bs";
import axios from "axios";
import { ApiEndPoint } from "../utils/utlis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";

const AddTask = ({ token }) => {
  const dispatch = useDispatch();
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState("");
  const [usersList, setUsersList] = useState([]);
  const caseInfo = useSelector((state) => state.screen.Caseinfo);

  const [casenumber, setCaseNumber] = useState("");
  const [TaskTitle, setTaskTitle] = useState("");
  const [discription, setDiscription] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiEndPoint}getAllUser`);
      setUsersList(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddTask = async () => {
    const caseData = {
      caseId: caseInfo?._id,
      title: TaskTitle,
      description: discription,
      assignedUsers: [selectedUser],
      createdBy: token?._id,
      dueDate
    };

    try {
      await axios.post(`${ApiEndPoint}createTask`, caseData);
      alert("✅ Task Added Successfully!");
      setCaseNumber("");
      setTaskTitle("");
      setDiscription("");
      setDueDate(new Date());
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
      type="text"
      className="form-control"
      onClick={onClick}
      ref={ref}
      value={value}
      readOnly
    />
  ));

  return (
    <div className="container py-4">
      <div className="card shadow p-4">
        <h4 className="text-center mb-4">Add Task</h4>
        <div className="row">
        {[{
    label: "Case Number",
    icon: <Bs123 style={{ color: "#d3b386" }} />, value: casenumber, setter: setCaseNumber
  }, {
    label: "Task Title",
    icon: <FaTasks style={{ color: "#d3b386" }} />, value: TaskTitle, setter: setTaskTitle
  }, {
    label: "Task Description",
    icon: <FaAudioDescription style={{ color: "#d3b386" }} />, value: discription, setter: setDiscription
}].map(({ label, icon, value, setter }, idx) => (
  <div className="col-12 col-md-6 mb-3" key={idx}>
    <label className="form-label">{label}</label>
    <div className="input-group">
      <span className="input-group-text">{icon}</span>
      <input
        type="text"
        className="form-control"
        placeholder={label}
        value={value}
        onChange={(e) => setter(e.target.value)}
      />
    </div>
  </div>
))}

           {/* Date Picker */}
           <div className="col-12 col-md-6 mb-3">
  <label className="form-label">Due Date</label>
  <div className="input-group">
    <span className="input-group-text" style={{ color: "#d3b386" }}>
      <FaCalendarAlt />
    </span>
    <div className="form-control p-0">
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        dateFormat="dd/MM/yyyy"
        className="w-100 border-0 px-2 py-1"
      />
    </div>
  </div>
</div>



        {/* User Dropdown */}
<div className="col-12 col-md-6 mb-3">
  <label className="form-label">Select User</label>
  <div className="input-group">
    <span className="input-group-text">
      <FaUser style={{ color: "#d3b386" }} />
    </span>
    <select
      className="form-select"
      value={selectedUser}
      onChange={(e) => setSelectedUser(e.target.value)}
    >
      <option value="">Select a User</option>
      {usersList.map((user) => (
        <option key={user._id} value={user._id}>
          {user.UserName} ({capitalizeFirst(user.Role)})
        </option>
      ))}
    </select>
  </div>
</div>
          {/* Submit Button */}
          <div className="col-12 text-center mt-3">
            <button
              className="btn btn-primary px-4 py-2"
              style={{ backgroundColor: "#d3b386" }}
              onClick={handleAddTask}
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
