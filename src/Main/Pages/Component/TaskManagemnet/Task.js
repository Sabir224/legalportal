import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    FaUser,
    FaPhone,
    FaEnvelope,
    FaLock,
    FaUpload,
    FaBell,
    FaBars,
    FaTrash,
    FaBriefcase,
    FaInfoCircle,
    FaMapMarkerAlt,
    FaChevronDown,
    FaGlobe,
    FaMapMarkedAlt,
    FaBuilding,
    FaChair,
    FaRegEnvelope,
    FaFilter,
    FaMailBulk,
    FaAudioDescription,
    FaTypo3,
    FaTasks,
    FaCalendarAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bs123, BsPerson, BsType } from "react-icons/bs";
import axios from "axios";
import { ApiEndPoint } from "../utils/utlis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiContactsBookLine } from "react-icons/ri";


const Task = ({ token }) => {

    const dispatch = useDispatch();
    const [Priority, setPriority] = useState("High");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);

    //  const selectedclientdetails = useSelector((state) => state.screen.clientEmail);
    const [dueDate, setDueDate] = useState(new Date());
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersList, setUsersList] = useState([]);
    const caseInfo = useSelector((state) => state.screen.Caseinfo);


    // Form fields
    // console.log("clientEmail", clientEmail)
    const [casenumber, setCaseNumber] = useState("");
    const [TaskTitle, setTaskTitle] = useState("");
    const [casetype, setCaseType] = useState("");
    const [discription, setDiscription] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [clientmail, setclientmail] = useState("");
    const [bio, setBio] = useState("");
    const [language, setLanguage] = useState("");
    const [location, setLocation] = useState("");
    const [expertise, setExpertise] = useState("");
    const [department, setDepartment] = useState("");
    const [position, setPosition] = useState("");
    const [PreviewCaseId, setPreviewCaseId] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${ApiEndPoint}getAllUser`);
            // const allUsers = response.data.users || [];

            const allUsers = response.data.users || [];
            setUsersList(allUsers);

            // ✅ Filter only users assigned to this case
            const caseAssignedIds =
                caseInfo?.AssignedUsers?.map((u) => u.UserId || u._id) || [];
            const filtered = allUsers.filter(
                (user) => caseAssignedIds.includes(user._id.toString()) && user.IsActive
            );
            setUsersList(filtered);
            return allUsers;
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };


    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const handleRoleSelect = (role) => {
        setPriority(role);
        setDropdownOpen(false);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleAddTask = async () => {
        console.log("selectedUser", selectedUser)
        let caseData = {
            "caseId": caseInfo?._id,  // Assuming casenumber is unique for the case
            "title": TaskTitle,  // Title of the task, replace with the actual state
            "description": discription,  // Description from the input field
            "assignedUsers": [selectedUser],  // Assigned user ID
            "createdBy": token?._id,  // Assuming createdBy is the client ID
            "dueDate": dueDate  // Due date from the date picker
        };

        console.log("before Api calling", caseData);

        try {
            const response = await axios.post(`${ApiEndPoint}createTask`, caseData);
            console.log('Task added successfully:', response.data);
            // dispatch(screenChange(9));
            alert("✅ Task Added Successfully!");
            // Reset fields after success
            setCaseNumber("");
            setTaskTitle("");
            setDiscription("");
            setTaskTitle("");
            setDueDate(new Date());
        } catch (error) {
            if (error.response) {
                console.error('API error:', error.response);
            } else {
                console.error('Network or server error:', error.message);
            }
        }
    };


    useEffect(() => {

    }, []);

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreview(null);
    };




    const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
        <input
            type="text"
            className="form-control"
            onClick={onClick}
            ref={ref}
            value={value}
            placeholder={placeholder}
            readOnly
            style={{
                height: '38px',
                border: '1px solid #18273e',
                borderRadius: '0.375rem',
                padding: '0.375rem 0.75rem',
                boxSizing: 'border-box',
                minWidth: '300px',
            }}
        />
    ));


    const capitalizeFirst = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };



    return (
        <div
            className="container card shadow m-0 p-5"
            style={{
                height: "86.6vh",
                overflowY: "auto",
            }}
        >
            <div className="row">
                {[
                    { label: "Case Number", icon: <Bs123 />, state: casenumber, setState: setCaseNumber },
                    { label: "Task Title", icon: <FaTasks />, state: TaskTitle, setState: setTaskTitle },
                    { label: "Task Description", icon: <FaAudioDescription />, state: discription, setState: setDiscription },
                    { label: "Due Date", icon: <FaCalendarAlt />, state: dueDate, setState: setDueDate, type: "date" }
                ]
                    .filter(Boolean)
                    .map(({ label, icon, state, setState, type = "text" }, index) => (
                        <div key={index} className="col-md-6 mb-3">
                            <label className="form-label" style={{ color: '#18273e' }}>{label}</label>
                            <div className="input-group">
                                <span className="input-group-text customIcon" style={{ height: '38px' }}>
                                    {icon}
                                </span>
                                {type === "date" ? (
                                    <div className="flex-grow-1">
                                        <DatePicker
                                            selected={state}
                                            onChange={(date) => setState(date)}
                                            dateFormat="dd/MM/yyyy"
                                            customInput={<CustomDateInput placeholder={label} />}
                                            wrapperClassName="d-block w-100"
                                        />
                                    </div>
                                ) : (
                                    <input
                                        type={type}
                                        className="form-control"
                                        placeholder={label}
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        style={{
                                            height: '38px',
                                            border: '1px solid #18273e',
                                            minWidth: '300px',
                                        }}
                                        disabled={label === "Client Email" || label === 'Client Name' || label === "Case Id"}
                                    />
                                )}
                            </div>
                        </div>
                    ))}

                {/* User Selection Dropdown */}
                <div key="userDropdown" className="col-md-6 mb-3">
                    <label className="form-label" style={{ color: '#18273e' }}>Select User</label>
                    <div className="input-group">
                        <span className="input-group-text customIcon" style={{ height: '38px' }}>
                            <FaUser /> {/* User Icon */}
                        </span>
                        <select
                            className="form-select"
                            value={selectedUser} // State for selected user
                            onChange={(e) => setSelectedUser(e.target.value)} // Handle selection change
                            style={{
                                height: '38px',
                                border: '1px solid #18273e',
                                minWidth: '300px',
                            }}
                        >
                            <option value="">Select a User</option>
                            {usersList.map((user, index) => (
                                <option key={index} value={user?._id}>
                                    {user?.UserName} ({capitalizeFirst(user?.Role)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="text-center mt-3">
                <button
                    className="btn btn-primary"
                    style={{
                        backgroundColor: "#d3b386",
                    }}
                    onClick={() => handleAddTask()}
                >
                    Add Task
                </button>
            </div>
        </div>
    );
};

export default Task;
