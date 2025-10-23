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
import { useAlert } from "../../../../Component/AlertContext";

// Import Material-UI components
import {
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Box
} from '@mui/material';

const AddTask = ({ token }) => {
  const dispatch = useDispatch();
  const [dueDate, setDueDate] = useState(new Date());
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // ✅ new state
  const caseInfo = useSelector((state) => state.screen.Caseinfo);

  const [casenumber, setCaseNumber] = useState("");
  const [TaskTitle, setTaskTitle] = useState("");
  const [discription, setDiscription] = useState("");
  const { showLoading, showSuccess, showError } = useAlert();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [caseInfo]); // ✅ refetch when case changes

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiEndPoint}getAllUser`);
      const allUsers = response.data.users || [];
      setUsersList(allUsers);

      // ✅ Filter only users assigned to this case
      const caseAssignedIds =
        caseInfo?.AssignedUsers?.map((u) => u.UserId || u._id) || [];
      const filtered = allUsers.filter(
        (user) => caseAssignedIds.includes(user._id.toString()) && user.IsActive
      );


      setFilteredUsers(filtered);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddTask = async () => {
    const caseData = {
      caseId: caseInfo?._id,
      title: TaskTitle,
      description: discription,
      assignedUsers: selectedUsers,
      createdBy: token?._id,
      dueDate
    };

    console.log("selectedUsers= ", selectedUsers)

    try {
      showLoading();
      await axios.post(`${ApiEndPoint}createTask`, caseData);
      showSuccess("✅ Task Added Successfully!");
      setCaseNumber("");
      setTaskTitle("");
      setDiscription("");
      setSelectedUsers([]);
      setDueDate(new Date());
    } catch (error) {
      console.error('Error creating task:', error);
      showError('Error creating task:', error);
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

  const getSelectedUserNames = () => {
    if (!selectedUsers || selectedUsers.length === 0) return 'Select Users';
    const selectedUserObjects = filteredUsers.filter(user =>
      selectedUsers.includes(user._id)
    );
    return selectedUserObjects.map(user =>
      `${user.UserName} (${capitalizeFirst(user.Role)})`
    ).join(', ');
  };

  return (
    <div className="container py-4">
      <div className="card shadow p-4">
        <h4 className="text-center mb-4">Add Task</h4>
        <div className="row">
          {[{
            label: "Case Number",
            icon: <Bs123 style={{ color: "#d3b386" }} />,
            value: caseInfo?.CaseNumber,
            setter: setCaseNumber
          }, {
            label: "Task Title",
            icon: <FaTasks style={{ color: "#d3b386" }} />,
            value: TaskTitle,
            setter: setTaskTitle
          }, {
            label: "Task Description",
            icon: <FaAudioDescription style={{ color: "#d3b386" }} />,
            value: discription,
            setter: setDiscription
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
                  disabled={label === "Case Number"}
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

          {/* ✅ User Dropdown with Case Assigned Users */}
          <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Select Users</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaUser style={{ color: "#d3b386" }} />
              </span>
              <div className="form-control p-0" style={{ borderLeft: 'none' }}>
                <FormControl fullWidth sx={{ m: 0, p: 0 }}>
                  <Select
                    multiple
                    value={selectedUsers}
                    onChange={(e) => setSelectedUsers(e.target.value)}
                    onOpen={() => setDropdownOpen(true)}
                    onClose={() => setDropdownOpen(false)}
                    open={dropdownOpen}
                    displayEmpty
                    renderValue={() => (
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2, py: 0.5 }}>
                        <span style={{
                          color: selectedUsers.length === 0 ? '#6c757d' : '#000',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1
                        }}>
                          {getSelectedUserNames()}
                        </span>
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#fff',
                          maxHeight: 300,
                          '& .MuiMenuItem-root': {
                            '&:hover': {
                              backgroundColor: 'rgba(212, 175, 55, 0.1)',
                            },
                            '&.Mui-selected': {
                              backgroundColor: 'rgba(212, 175, 55, 0.2)',
                            },
                          },
                        }
                      },
                    }}
                    sx={{
                      '& .MuiSelect-select': {
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '38px',
                        boxShadow: 'none',
                        border: 'none',
                        '&:focus': {
                          backgroundColor: 'transparent'
                        }
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <em>Select Users</em>
                    </MenuItem>

                    {filteredUsers.map((user) => (  // ✅ only case assigned users
                      <MenuItem key={user._id} value={user._id}>
                        <Checkbox
                          checked={selectedUsers.includes(user._id)}
                          sx={{
                            color: '#d3b386',
                            '&.Mui-checked': {
                              color: '#d3b386',
                            },
                          }}
                        />
                        <ListItemText
                          primary={`${user.UserName} (${capitalizeFirst(user.Role)})`}
                          sx={{ ml: 1 }}
                        />
                      </MenuItem>
                    ))}

                    {/* Done Button */}
                    {/* <MenuItem 
                      sx={{ 
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: '#f5f5f5',
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        }
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 1 }}>
                        <Button 
                          variant="contained" 
                          size="small"
                          sx={{
                            bgcolor: '#d3b386',
                            '&:hover': {
                              bgcolor: '#c19d6b',
                            },
                          }}
                        >
                          Done
                        </Button>
                      </Box>
                    </MenuItem> */}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center mt-3">
            <button
              className="btn btn-primary px-4 py-2"
              style={{ backgroundColor: "#d3b386", borderColor: "#d3b386" }}
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
