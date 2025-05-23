import React, { useEffect, useState } from "react";
import { Form, Modal, Table } from "react-bootstrap";

import {
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaTrash,
  FaChevronUp,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ApiEndPoint } from "../utils/utlis";
import axios from "axios";
import SocketService from "../../../../SocketService";
import ErrorModal from "../../AlertModels/ErrorModal";
import ConfirmModal from "../../AlertModels/ConfirmModal";
import SuccessModal from "../../AlertModels/SuccessModal";
import { Caseinfo, screenChange, FormCDetails } from "../../../../REDUX/sliece";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControl,
  InputLabel,
  Badge,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function ViewFormC({ token }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const [todos, setTodos] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [addingSubtaskFor, setAddingSubtaskFor] = useState(null);
  const [newSubtaskName, setNewSubtaskName] = useState("");

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("text");
  const [newColumnOptions, setNewColumnOptions] = useState("");
  const [isSubtask, setIsSubtask] = useState(false);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  // const [newSubtaskName, setNewSubtaskName] = useState('');
  const [assignedUserId, setAssignedUserId] = useState([]);
  const [parentId, setParentId] = useState();
  const [users, setUsers] = useState([]); // Fill this from API or props
  const [allCases, setAllCases] = useState([]); // Fill this from API or props
  const isclient = token?.Role === "client";
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newAssignedTaskCase, setNewAssignedTaskCase] = useState("");
  const [assignedUsersForCase, setAssignedUsersForCase] = useState([]);
  const [editingAssignedUser, setEditingAssignedUser] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [editingAssignedSubtaskId, setEditingAssignedSubtaskId] = useState(null);

  const [isCaseInvalid, setIsCaseInvalid] = useState(false);
  const [isUserInvalid, setIsUserInvalid] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  // const { showLoading, showSuccess, showError } = useAlert();

  const handleToggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccessModal(true);
  };

  useEffect(() => {
    if (!SocketService.socket || !SocketService.socket.connected) {
      console.log("🔌 Connecting to socket...");
      SocketService.socket.connect();
    }

    const handleMessagesDelivered = (data) => {
      fetchtask();
    };

    SocketService.socket.off("TaskManagement", handleMessagesDelivered);
    SocketService.onTaskManagement(handleMessagesDelivered);
  }, []);

  useEffect(() => {
    fetchtask();
  }, []);

  useEffect(() => {
    // fetchUsers();
    fetchCases();
  }, []);

  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const fetchUsers = async (taskdetails) => {
    let id = taskdetails?.caseId?.value?._id;
    console.log("taskdetails", taskdetails);
    try {
      const response = await axios.get(
        `${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${taskdetails}`
      );
      const allUsers = response.data.AssignedUsers || [];
      console.log("taskdetails", allUsers);

      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  const fetchCases = async () => {
    try {
      const response = await axios.get(`${ApiEndPoint}getcase`);
      const allCases = response.data.data;
      setAllCases(allCases);
      return allCases;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchtask = async () => {
    console.log("caseInfo=", caseInfo);
    try {
      const response = await fetch(
        `${ApiEndPoint}getAllConsultationsWithDetails`
        //  caseInfo === null ? (token?.Role === "admin" ? `${ApiEndPoint}getAllTasksWithDetails` : `${ApiEndPoint}getTasksByUser/${token?._id}`) : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}`
      );

      if (!response.ok) {
        throw new Error("Error fetching folders");
      }

      const data = await response.json();
      console.log("fetch Task", data.consultations[0]);
      setTodos(data.consultations);
    } catch (err) {
      // setMessage(err.response?.data?.message || "Error deleting task.");
      //  setShowError(true);
    }
  };

  const [columns, setColumns] = useState([
    { id: "task", label: "Task", type: "text" },
    {
      id: "status",
      label: "Status",
      type: "dropdown",
      options: ["Not Started", "In Progress", "Completed", "Blocked"],
    },
    {
      id: "priority",
      label: "Priority",
      type: "dropdown",
      options: ["High", "Medium", "Low"],
    },
  ]);

  const handleAddNewTask = async (name, caseId, userid) => {
    console.log(userid);
    try {
      const subtask = {
        caseId: caseId,
        createdBy: token._id,
        assignedUsers: [userid],
      };
      console.log("empty sub task", subtask);
      //  const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      const response = await createSubtaskApi(selectedCaseId, subtask);
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      // backend default fields set kare

      const previousOpenTaskId = openTaskId;
      console.log("previousOpenTaskId=", previousOpenTaskId);

      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
      console.log("openTaskId=", openTaskId);
    } catch (error) {
      console.error("Failed to add subtask:", error);
    }
    // Update state with new task
    // setTodos((prev) => [...prev, newTask]);
  };

  const openModal = (Caseinfo) => {
    console.log("caseId", Caseinfo?._id?.value);
    setParentId(Caseinfo?._id?.value);
    setSelectedCaseId(Caseinfo?.caseId?.value?._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSubtaskName("");
    setAssignedUserId("");
  };




  const toggleTask = (taskId) => {
    // setOpenTaskId(taskId);
    setOpenTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const saveSubtask = (taskId) => {
    if (!newSubtaskName.trim()) return;
    console.log("new task add ", taskId);
    const newSubtask = {
      id: Date.now(),
      task: newSubtaskName,
      status: "Not Started",
      priority: "Medium",
    };

    // Initialize new column values for the subtask
    columns.forEach((col) => {
      if (!newSubtask[col.id]) {
        newSubtask[col.id] = col.type === "checkbox" ? false : "";
      }
    });

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === taskId
          ? { ...todo, subtasks: [...todo.subtasks, newSubtask] }
          : todo
      )
    );

    setAddingSubtaskFor(null);
    setNewSubtaskName("");
  };



  const handleFieldChange = (
    taskId,
    key,
    newValue,
    isSubtask = false,
    subtaskId = null
  ) => {
    setTodos((prevTodos) =>
      prevTodos.map((task) => {
        // Check for the task being updated
        if (task._id?.value !== taskId) return task;

        // Subtask update
        if (isSubtask && subtaskId) {
          return {
            ...task,
            subtasks: task.subtasks.map((subtask) => {
              if (subtask._id?.value !== subtaskId) return subtask;
              return {
                ...subtask,
                [key]: {
                  ...subtask[key],
                  value: newValue,
                },
              };
            }),
          };
        }

        // Main task update
        return {
          ...task,
          [key]: {
            ...task[key],
            value: newValue,
          },
        };
      })
    );
  };

  const handleSubtaskFieldChange = (parentTaskId, key, newValue, subtaskId) => {
    setTodos((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id !== parentTaskId && task._id?.value !== parentTaskId)
          return task;

        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtask._id?.value !== subtaskId) return subtask;

          return {
            ...subtask,
            [key]: {
              ...subtask[key],
              value: newValue,
            },
          };
        });

        return {
          ...task,
          subtasks: updatedSubtasks,
        };
      });
    });
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingColumn, setPendingColumn] = useState(null);

  const deleteColumn = async (columnName) => {
    setPendingColumn(columnName);
    setShowConfirm(true);
  };
  const formatHeaderLabel = (key) => {
    return key
      .split(/(?=[A-Z])/)
      .join(" ")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      const response = await axios.delete(
        `${ApiEndPoint}DeleteColumnByName/${pendingColumn}`
      );

      if (response.status === 200) {
        showSuccess(`🗑️ ${response.data.message}`);
        SocketService.TaskManagement(response);
        setColumns((prev) =>
          prev.filter(
            (col) => col.id !== pendingColumn.toLowerCase().replace(/\s+/g, "-")
          )
        );
        const previousOpenTaskId = openTaskId;
        await fetchtask();
        setOpenTaskId(previousOpenTaskId);
      } else {
        setMessage("⚠️ Column deletion failed.");
        setShowError(true);
      }
    } catch (error) {
      console.error("❌ Error deleting column:", error);
      setMessage("❌ Failed to delete the column.");
      setShowError(true);
    }
  };

  const renderFieldInput = (item, column, onChange) => {
    switch (column.type) {
      case "dropdown":
        return (
          <select
            value={item[column.id] || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {column.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={item[column.id] || false}
            onChange={(e) => onChange(e.target.checked)}
          />
        );
      default:
        return (
          <input
            type="text"
            value={item[column.id] || ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  const createSubtaskApi = async (taskId, subtaskData) => {
    return await axios.post(`${ApiEndPoint}createTask`, subtaskData);
  };
  const handleAddEmptySubtask = async (Taskinfo) => {
    setSelectedCaseId(Taskinfo?.caseId?.value?._id);
    console.log("taskId?.caseId?.value?._id", Taskinfo?.caseId?.value?._id);
    try {
      const subtask = {
        caseId: Taskinfo?.caseId?.value?._id,
        createdBy: token._id,
        parentId: Taskinfo?._id?.value,
      };
      console.log("empty sub task", subtask);
      //  const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      const response = await createSubtaskApi(selectedCaseId, subtask); // backend default fields set kare
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      const previousOpenTaskId = openTaskId;
      console.log("previousOpenTaskId=", previousOpenTaskId);
      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
      console.log("openTaskId=", openTaskId);
    } catch (error) {
      console.error("Failed to add subtask:", error);
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const keys =
    todos?.length > 0
      ? Object.keys(todos[0]).filter(
        (key) =>
          key !== "_id" &&
          key !== "__v" &&
          key !== "subtasks" &&
          key !== "parentId"
      )
      : [];

  const handleFieldBlur = async (taskId, key, value, isSubtask, subtaskId) => {
    // Replace this with your actual API call logic
    console.log("Blurred & API Call:", {
      taskId,
      key,
      value,
      isSubtask,
      subtaskId,
    });
    console.log("Blurred & API Call value:", { value });

    try {
      const response = await axios.post(
        `${ApiEndPoint}updateConsultationField`,
        {
          formId: taskId,
          key,
          value,
        }
      );
      setAssignedUserId([]);
      SocketService.TaskManagement(response);

      fetchtask();
      console.log("Task updated:", response.data);
    } catch (error) {
      console.error("Failed to update task:", error);
    }

    // Example API call
    // updateTodoField({
    //   taskId,
    //   fieldKey: key,
    //   newValue: value,
    //   isSubtask,
    //   subtaskId,
    // });
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ taskId: null, message: "" });

  const handleDelete = (taskId) => {
    console.log("id of form c", taskId);
    setConfirmData({
      taskId,
      message: "Are you sure you want to delete this Form C?",
    });
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    try {
      const res = await fetch(
        `${ApiEndPoint}deleteConsultation/${confirmData.taskId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (res.ok) {
        console.log("Deleted:", data.message);
        setShowConfirmModal(false);
        showSuccess("Form Delete Successfully");
        fetchtask();
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleSubtaskFieldBlur = async (taskId, key, value, subtaskId) => {
    console.log("Subtask API call on blur", { taskId, key, value, subtaskId });

    taskId = subtaskId;

    if (key === "date") {
      try {
        let dateObj;

        if (typeof value === "string") {
          // Parse only yyyy-MM-dd format to date with no time
          const [year, month, day] = value.split("-");
          dateObj = new Date(Date.UTC(+year, +month - 1, +day)); // UTC midnight
        } else if (value instanceof Date && !isNaN(value)) {
          // If already a Date, reset time to midnight
          dateObj = new Date(
            Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
          );
        }

        if (!dateObj || isNaN(dateObj)) {
          console.error("Invalid date value:", value);
          return;
        }

        // Send full ISO string to MongoDB (e.g. 2025-05-06T00:00:00.000Z)
        value = dateObj.toISOString();
      } catch (e) {
        console.error("Error parsing date:", e);
        return;
      }
    }

    console.log("API function value:", value);

    try {
      const response = await axios.post(
        `${ApiEndPoint}updateConsultationField`,
        {
          taskId,
          key,
          value,
        }
      );

      SocketService.TaskManagement(response);

      const previousOpenTaskId = openTaskId;
      await fetchtask();
      setOpenTaskId(previousOpenTaskId);

      console.log("Task updated:", response.data);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleUserClick = (userId, userName) => {
    console.log("User Clicked:", userId, userName);
    let item = { ClientId: userId };
    dispatch(FormCDetails(null));
    dispatch(Caseinfo(item));

    dispatch(screenChange(12));

    // Navigate or fetch user details, etc.
  };

  const handleClientClick = (email) => {
    console.log("Client Clicked:", email);
    dispatch(FormCDetails(email));
    dispatch(screenChange(12));

    // Navigate or fetch client info, etc.
  };

  // return (
  //   <div className="container-fluid p-0 m-0" style={{ height: "85vh" }}>
  //     <div
  //       className="d-flex flex-column h-100 bg-white rounded shadow"
  //       style={{ overflowX: "auto" ,flex:1}}
  //     >
  //       <div className="p-3">
  //         <button className="btn btn-success" onClick={() => dispatch(screenChange(16))}>
  //           + New form
  //         </button>
  //       </div>

  //       <div className="flex-grow-1 overflow-auto px-3 pb-3">
  //         <div className="table-responsive">
  //           <table className="table table-bordered table-hover table-sm align-middle">
  //             <thead className="table-light sticky-top">
  //               <tr>
  //                 <th style={{ width: "10px" }}></th>
  //                 {keys?.map((key) => (
  //                   <th key={key}>
  //                     {(key !== "userId" && key !== "userName") &&
  //                       key
  //                         .split(/(?=[A-Z])/)
  //                         .join(" ")
  //                         .replace(/^./, (str) => str.toUpperCase())}
  //                   </th>
  //                 ))}
  //                 <th></th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {todos?.map((todo) => (
  //                 <tr key={todo.id}>
  //                   <td>
  //                     <span
  //                       className="text-primary fw-bold"
  //                       style={{ cursor: "pointer" }}
  //                       onClick={() => toggleTask(todo._id)}
  //                     >
  //                       +
  //                     </span>
  //                   </td>

  //                   {keys?.map((key) => {
  //                     const field = todo[key];
  //                     if (!field) return <td key={key}></td>;

  //                     const { value, type, enum: enumOptions, editable = true } = field;
  //                     const taskId = todo._id?.value || todo.id;
  //                     const subtaskId = isSubtask ? taskId : null;
  //                     const normalizedType = type?.toLowerCase();

  //                     const handleBlur = (e) => {
  //                       const newValue = normalizedType === "boolean" ? e.target.checked : e.target.value;
  //                       handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
  //                     };

  //                     let content;

  //                     if (key === "documents") {
  //                       const userId = todo.userId?.value;
  //                       const userName = todo.userName?.value;
  //                       const clientName = todo.clientName?.value || "Client";
  //                       const email = todo.email?.value;

  //                       content = userId && userName ? (
  //                         <span
  //                           className="text-primary text-decoration-underline"
  //                           style={{ cursor: "pointer" }}
  //                           onClick={() => handleUserClick(userId, userName)}
  //                         >
  //                           {userName}
  //                         </span>
  //                       ) : (
  //                         <span
  //                           className="text-primary text-decoration-underline"
  //                           style={{ cursor: "pointer" }}
  //                           onClick={() => handleClientClick(email)}
  //                         >
  //                           {clientName}
  //                         </span>
  //                       );
  //                     } else if (key === "caseId") {
  //                       content = <span>{todo.caseId?.value?.CaseNumber || ""}</span>;
  //                     } else if (key === "createdBy") {
  //                       content = <span>{todo.createdBy?.value?.UserName || ""}</span>;
  //                     } else if (key === "createdAt") {
  //                       content = <span>{(todo.createdAt?.value || "").split("T")[0]}</span>;
  //                     } else if (!editable) {
  //                       content = <span>{String(value)}</span>;
  //                     } else if (enumOptions) {
  //                       content = (
  //                         <select
  //                           className="form-select form-select-sm"
  //                           value={value}
  //                           onChange={(e) => handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId)}
  //                           onBlur={handleBlur}
  //                           disabled={isclient}
  //                         >
  //                           {enumOptions.map((option) => (
  //                             <option key={option} value={option}>
  //                               {option}
  //                             </option>
  //                           ))}
  //                         </select>
  //                       );
  //                     } else if (normalizedType === "boolean") {
  //                       content = (
  //                         <div className="form-check">
  //                           <input
  //                             className="form-check-input"
  //                             type="checkbox"
  //                             checked={Boolean(value)}
  //                             onChange={(e) => handleFieldChange(taskId, key, e.target.checked, isSubtask, subtaskId)}
  //                             onBlur={handleBlur}
  //                             disabled={isclient}
  //                           />
  //                         </div>
  //                       );
  //                     } else if (normalizedType === "date") {
  //                       content = (
  //                         <DatePicker
  //                           className="form-control form-control-sm"
  //                           selected={value ? new Date(value) : null}
  //                           onChange={(date) => handleFieldChange(taskId, key, date, isSubtask, subtaskId)}
  //                           dateFormat="dd/MM/yyyy"
  //                           placeholderText="dd/mm/yyyy"
  //                           onBlur={() => handleFieldBlur(taskId, key, value, isSubtask, subtaskId)}
  //                           disabled={isclient}
  //                         />
  //                       );
  //                     } else {
  //                       content = (key === "userId" || key === "userName") ? (
  //                         <></>
  //                       ) : (
  //                         <input
  //                           type="text"
  //                           className="form-control form-control-sm"
  //                           value={value || ""}
  //                           onChange={(e) => handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId)}
  //                           onBlur={handleBlur}
  //                           disabled={isclient || key === "email"}
  //                         />
  //                       );
  //                     }

  //                     return <td key={key}>{content}</td>;
  //                   })}

  //                   <td>
  //                     <button
  //                       className="btn btn-sm btn-danger"
  //                       onClick={() => handleDelete(todo._id?.value || todo.id)}
  //                       disabled={isclient}
  //                     >
  //                       <FaTrash />
  //                     </button>
  //                   </td>
  //                 </tr>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Column Add Modal */}
  //     {addingColumn && (
  //       <div className="modal-overlay">
  //         <div className="modal-content">
  //           <div className="modal-header">
  //             <div className="modal-title">Add New Column</div>
  //             <button
  //               className="close-button"
  //               onClick={() => setAddingColumn(false)}
  //             >
  //               &times;
  //             </button>
  //           </div>
  //           <div>
  //             <input
  //               type="text"
  //               className="column-input"
  //               placeholder="Enter New Column Name"
  //               value={newColumnName}
  //               onChange={(e) => setNewColumnName(e.target.value)}
  //             />

  //             <div className="column-type-container">
  //               <select
  //                 className="column-type-select"
  //                 value={newColumnType}
  //                 onChange={(e) => setNewColumnType(e.target.value)}
  //               >
  //                 <option value="text">Text</option>
  //                 <option value="dropdown">Dropdown</option>
  //                 <option value="checkbox">Checkbox</option>
  //               </select>

  //               {newColumnType === "dropdown" && (
  //                 <input
  //                   type="text"
  //                   className="column-options-input"
  //                   placeholder="Options (comma separated)"
  //                   value={newColumnOptions}
  //                   onChange={(e) => setNewColumnOptions(e.target.value)}
  //                 />
  //               )}
  //             </div>

  //             <div className="modal-footer">
  //               <button
  //                 className="cancel-button"
  //                 onClick={() => setAddingColumn(false)}
  //               >
  //                 Cancel
  //               </button>
  //               <button className="add-column-button" onClick={addColumn}>
  //                 Add Column
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}

  //     <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>Add Task</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Form>
  //           <Form.Group className="mb-3">
  //             <Form.Label>Assign Case</Form.Label>
  //             <Form.Select
  //               value={newAssignedTaskCase}
  //               onChange={(e) => {
  //                 fetchUsers(e.target.value);
  //                 setNewAssignedTaskCase(e.target.value);
  //               }}
  //               isInvalid={isCaseInvalid}
  //             >
  //               <option value="">Select a Case</option>
  //               {allCases?.map((user) => (
  //                 <option key={user?._id} value={user?._id}>
  //                   {user?.CaseNumber}
  //                 </option>
  //               ))}
  //             </Form.Select>
  //             {isCaseInvalid && (
  //               <Form.Text className="text-danger">
  //                 Please select a case.
  //               </Form.Text>
  //             )}
  //           </Form.Group>

  //           {users?.length > 0 && (
  //             <Form.Group className="mb-3">
  //               <Form.Label>Assigned Users</Form.Label>
  //               <Form.Select
  //                 value={assignedUsersForCase || ""}
  //                 isInvalid={isUserInvalid}
  //                 onChange={(e) => {
  //                   setAssignedUsersForCase(e.target.value);
  //                   if (e.target.value) {
  //                     setIsUserInvalid(false); // clear error when valid user selected
  //                   }
  //                 }}
  //               >
  //                 <option value="">Select Assigned User</option>
  //                 {users?.map((user) => (
  //                   <option key={user?.id} value={user?.id}>
  //                     {user?.UserName} ({user?.Role})
  //                   </option>
  //                 ))}
  //               </Form.Select>
  //               {isUserInvalid && (
  //                 <Form.Text className="text-danger">
  //                   Please select an assigned user.
  //                 </Form.Text>
  //               )}
  //             </Form.Group>
  //           )}

  //         </Form>
  //       </Modal.Body>

  //       <Modal.Footer className="d-flex justify-content-center">
  //         <Button variant="primary" onClick={() => setShowTaskModal(false)}>
  //           Cancel
  //         </Button>
  //         <Button
  //           variant="primary"
  //           onClick={() => {
  //             let valid = true;

  //             if (!newAssignedTaskCase) {
  //               setIsCaseInvalid(true);
  //               valid = false;
  //             }

  //             if (!assignedUsersForCase) {
  //               setIsUserInvalid(true);
  //               valid = false;
  //             }

  //             if (!valid) return;

  //             handleAddNewTask(newTaskName, newAssignedTaskCase, assignedUsersForCase);
  //             setShowTaskModal(false);
  //             setNewTaskName("");
  //             setNewAssignedTaskCase("");
  //             setAssignedUsersForCase(null);
  //             setUsers([]);
  //             setIsCaseInvalid(false);
  //             setIsUserInvalid(false);
  //           }}
  //         >
  //           Save
  //         </Button>
  //       </Modal.Footer>

  //     </Modal>

  //     <ErrorModal
  //       show={showError}
  //       handleClose={() => setShowError(false)}
  //       message={message}
  //     />

  //     <ConfirmModal
  //       show={showConfirm}
  //       title={`Delete Column "${pendingColumn}"`}
  //       message={`Are you sure you want to delete column "${pendingColumn}" from all tasks?`}
  //       onConfirm={handleConfirmDelete}
  //       onCancel={() => setShowConfirm(false)}
  //     />

  //     <ConfirmModal
  //       show={showConfirmModal}
  //       title="Delete Task"
  //       message={confirmData.message}
  //       onConfirm={confirmDeleteTask}
  //       onCancel={() => setShowConfirmModal(false)}
  //     />

  //     <SuccessModal
  //       show={showSuccessModal}
  //       handleClose={() => setShowSuccessModal(false)}
  //       message={successMessage}
  //     />

  //   </div>
  // );


  const handleSignup = async (todo) => {
    // Replace with your actual logic
    console.log("Signup clicked for:", todo);
    try {
      const formData = new FormData();
      formData.append("UserName", todo?.clientName?.value);
      formData.append("Email", todo?.email?.value);
      formData.append("Password", `${todo?.clientName?.value}@12345`);
      formData.append("Role", "client");
      formData.append("Contact", todo?.phone?.value);
      formData.append("Bio", "");
      formData.append("Address", "");
      formData.append("Position", "");


      const response = await fetch(`${ApiEndPoint}users`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      showSuccess("✅ Account Create sucessfully.")
      fetchtask()
      // alert("✅ User Added Successfully!");
    } catch (error) {
      setMessage("⚠️ Account Creation failed.");
      setShowError(true);
      // alert("❌ Failed to Add User! Check Console.");
      console.error("Error adding user:", error);
    }
  };

  return (
    <div
      className="container-fluid p-0 m-0"
      style={{ height: "85vh", overflow: "hidden" }}
    >
      <div
        className="d-flex flex-column h-100 bg-white rounded shadow"
        style={{
          flex: 1,
          overflow: "hidden",
          width: "100%",
          maxWidth: "100vw", // Ensure it never exceeds viewport width
        }}
      >
        <div className="p-3" style={{ flexShrink: 0 }}>
          <button
            className="btn btn-success"
            onClick={() => dispatch(screenChange(16))}
          >
            + New form
          </button>
        </div>

        {/* Desktop Table View (lg and up) */}
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* Desktop View - shows on lg and up */}
          <div
            className="d-none d-lg-flex flex-column"
            style={{
              flex: 1,
              minHeight: 0, // Crucial for flex children to respect overflow
              overflow: "hidden",
              width: "100%",
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                px: 3,
                pb: 3,
                overflow: "hidden",
                width: "92%%",
              }}
            >
              <TableContainer
                component={Paper}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto", // Changed to auto to enable scrolling
                  padding: "10px",
                  width: "92%",
                  "& .MuiTable-root": {
                    minWidth: "max-content",
                    width: "92%",
                  },
                  "& .MuiTableCell-root": {
                    py: 1.5,
                    minWidth: 120,
                    maxWidth: 300,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                  "& .MuiTableHead-root": {
                    "& .MuiTableCell-root": {
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      backgroundColor: theme.palette.grey[100],
                      fontWeight: "bold",
                    },
                  },
                }}
              >
                <Table
                  stickyHeader
                  size="small"
                  aria-label="desktop table view"
                  sx={{
                    minWidth: "max-content",
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "48px" }}></TableCell>
                      {keys?.map(
                        (key) =>
                          key !== "userId" &&
                          key !== "userName" && (
                            <TableCell
                              key={key}
                              sx={{
                                minWidth: 120,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatHeaderLabel(key)}
                            </TableCell>
                          )
                      )}
                      <TableCell sx={{ width: "48px" }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todos?.map((todo) => (
                      <TableRow
                        key={todo.id}
                        hover
                        sx={{
                          "&:last-child td": { borderBottom: 0 },
                        }}
                      >
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => toggleTask(todo._id)}
                            sx={{
                              p: 0.5,
                            }}
                          >
                            <ExpandMoreIcon fontSize="small" />
                          </IconButton>
                        </TableCell>

                        {keys?.map((key) => {
                          if (key === "userId" || key === "userName")
                            return null;

                          const field = todo[key];
                          if (!field) return <TableCell key={key}></TableCell>;

                          const {
                            value,
                            type,
                            enum: enumOptions,
                            editable = true,
                          } = field;
                          const taskId = todo._id?.value || todo.id;
                          const subtaskId = isSubtask ? taskId : null;
                          const normalizedType = type?.toLowerCase();

                          const handleBlur = (e) => {
                            const newValue =
                              normalizedType === "boolean"
                                ? e.target.checked
                                : e.target.value;
                            handleFieldBlur(
                              taskId,
                              key,
                              newValue,
                              isSubtask,
                              subtaskId
                            );
                          };

                          let content;

                          if (key === "documents") {
                            const userId = todo.userId?.value;
                            const userName = todo.userName?.value;
                            const clientName =
                              todo.clientName?.value || "Client";
                            const email = todo?._id?.value;

                            content =
                              userId && userName ? (
                                <Button
                                  color="primary"
                                  sx={{
                                    textTransform: "none",
                                    textDecoration: "underline",
                                    p: 0,
                                    minWidth: "auto",
                                  }}
                                  onClick={() =>
                                    handleUserClick(userId, userName)
                                  }
                                >
                                  {userName}
                                </Button>
                              ) : (
                                <Button
                                  color="primary"
                                  sx={{
                                    textTransform: "none",
                                    textDecoration: "underline",
                                    p: 0,
                                    minWidth: "auto",
                                  }}
                                  onClick={() => handleClientClick(email)}
                                >
                                  {clientName}
                                </Button>
                              );
                          } else if (key === "caseId") {
                            content = (
                              <Typography variant="body2" noWrap>
                                {value?.CaseNumber || ""}
                              </Typography>
                            );
                          } else if (key === "createdBy") {
                            content = (
                              <Typography variant="body2" noWrap>
                                {value?.UserName || ""}
                              </Typography>
                            );
                          } else if (key === "createdAt") {
                            content = (
                              <Typography variant="body2" noWrap>
                                {(value || "").split("T")[0]}
                              </Typography>
                            );
                          } else if (!editable) {
                            content = (
                              <Typography variant="body2" noWrap>
                                {String(value)}
                              </Typography>
                            );
                          } else if (enumOptions) {
                            content = (
                              <FormControl
                                fullWidth
                                size="small"
                                sx={{ minWidth: 120 }}
                              >
                                <Select
                                  value={value}
                                  onChange={(e) =>
                                    handleFieldChange(
                                      taskId,
                                      key,
                                      e.target.value,
                                      isSubtask,
                                      subtaskId
                                    )
                                  }
                                  onBlur={handleBlur}
                                  disabled={isclient}
                                >
                                  {enumOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            );
                          } else if (normalizedType === "boolean") {
                            content = (
                              <Checkbox
                                checked={Boolean(value)}
                                onChange={(e) =>
                                  handleFieldChange(
                                    taskId,
                                    key,
                                    e.target.checked,
                                    isSubtask,
                                    subtaskId
                                  )
                                }
                                onBlur={handleBlur}
                                disabled={isclient}
                                sx={{ p: 0.5 }}
                              />
                            );
                          } else if (normalizedType === "date") {
                            content = (
                              <DatePicker
                                value={value ? new Date(value) : null}
                                onChange={(date) =>
                                  handleFieldChange(
                                    taskId,
                                    key,
                                    date,
                                    isSubtask,
                                    subtaskId
                                  )
                                }
                                disabled={isclient}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    onBlur={() =>
                                      handleFieldBlur(
                                        taskId,
                                        key,
                                        value,
                                        isSubtask,
                                        subtaskId
                                      )
                                    }
                                    sx={{ minWidth: 140 }}
                                  />
                                )}
                              />
                            );
                          } else {
                            content = (
                              <TextField
                                type="text"
                                size="small"
                                fullWidth
                                value={value || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    taskId,
                                    key,
                                    e.target.value,
                                    isSubtask,
                                    subtaskId
                                  )
                                }
                                onBlur={handleBlur}
                                disabled={isclient || key === "email"}
                                sx={{ minWidth: 120 }}
                              />
                            );
                          }

                          return (
                            <TableCell
                              key={key}
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {content}
                            </TableCell>
                          );
                        })}

                        <TableCell>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() =>
                              handleDelete(todo._id?.value || todo.id)
                            }
                            disabled={isclient}
                            sx={{
                              p: 0.5,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleSignup(todo)}
                            sx={{ textTransform: "none" }}
                            disabled={!todo.userName?.value ? false:true}
                          >
                            Sign Up
                          </Button>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </div>

          {/* Mobile View - shows on md and down */}
          <div className="d-lg-none">
            <Box
              sx={{ height: "85vh", display: "flex", flexDirection: "column" }}
            >
              {/* Fixed header for mobile */}

              {/* Scrollable content for mobile */}
              <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                <List>
                  {todos?.map((todo) => {
                    const userId = todo._id?.value || todo.id;
                    const userName =
                      todo.userName?.value ||
                      todo.createdBy?.value?.UserName ||
                      "Unnamed User";
                    const isExpanded = expandedUserId === userId;

                    return (
                      <Paper
                        key={userId}
                        elevation={2}
                        sx={{ mb: 2, overflow: "hidden" }}
                      >
                        <Accordion
                          expanded={isExpanded}
                          onChange={() => handleToggleExpand(userId)}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`${userId}-content`}
                            id={`${userId}-header`}
                            sx={{
                              bgcolor: isExpanded
                                ? "action.hover"
                                : "background.paper",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                flexGrow: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: "bold" }}
                              >
                                {userName}
                              </Typography>
                              {todo.caseId?.value?.CaseNumber && (
                                <Badge
                                  badgeContent={`Case: ${todo.caseId.value.CaseNumber}`}
                                  color="primary"
                                  sx={{ ml: 2 }}
                                />
                              )}
                            </Box>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mb: 2,
                              }}
                            >
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(userId)}
                                disabled={isclient}
                              >
                                <DeleteIcon />
                              </IconButton>
                              <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => handleSignup(todo)}
                                sx={{ textTransform: "none" }}
                              >

                                SignUp
                              </Button>
                            </Box>

                            <List>
                              {keys.map((key) => {
                                if (
                                  key === "userId" ||
                                  key === "userName" ||
                                  key === "id"
                                )
                                  return null;

                                const field = todo[key];
                                if (!field) return null;

                                const {
                                  value,
                                  type,
                                  enum: enumOptions,
                                  editable = true,
                                } = field;
                                const taskId = userId;
                                const subtaskId = isSubtask ? taskId : null;
                                const normalizedType = type?.toLowerCase();
                                const label = key
                                  .split(/(?=[A-Z])/)
                                  .join(" ")
                                  .replace(/^./, (str) => str.toUpperCase());

                                const handleBlur = (e) => {
                                  const newValue =
                                    normalizedType === "boolean"
                                      ? e.target.checked
                                      : e.target.value;
                                  handleFieldBlur(
                                    taskId,
                                    key,
                                    newValue,
                                    isSubtask,
                                    subtaskId
                                  );
                                };

                                let content;

                                if (key === "documents") {
                                  const userId = todo.userId?.value;
                                  const userName = todo.userName?.value;
                                  const clientName =
                                    todo.clientName?.value || "Client";
                                  const email = todo?._id?.value;

                                  content =
                                    userId && userName ? (
                                      <Button
                                        startIcon={<PersonIcon />}
                                        onClick={() =>
                                          handleUserClick(userId, userName)
                                        }
                                        sx={{ textTransform: "none" }}
                                      >
                                        {userName}
                                      </Button>
                                    ) : (
                                      <Button
                                        startIcon={<BusinessIcon />}
                                        onClick={() => handleClientClick(email)}
                                        sx={{ textTransform: "none" }}
                                      >
                                        {clientName}
                                      </Button>
                                    );
                                } else if (key === "caseId") {
                                  content = (
                                    <Typography>
                                      {value?.CaseNumber || ""}
                                    </Typography>
                                  );
                                } else if (key === "createdBy") {
                                  content = (
                                    <Typography>
                                      {value?.UserName || ""}
                                    </Typography>
                                  );
                                } else if (key === "createdAt") {
                                  content = (
                                    <Typography>
                                      {(value || "").split("T")[0]}
                                    </Typography>
                                  );
                                } else if (!editable) {
                                  content = (
                                    <Typography>{String(value)}</Typography>
                                  );
                                } else if (enumOptions) {
                                  content = (
                                    <FormControl fullWidth size="small">
                                      <InputLabel>{label}</InputLabel>
                                      <Select
                                        value={value || ""}
                                        label={label}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            taskId,
                                            key,
                                            e.target.value,
                                            isSubtask,
                                            subtaskId
                                          )
                                        }
                                        onBlur={handleBlur}
                                        disabled={isclient}
                                      >
                                        {enumOptions.map((option) => (
                                          <MenuItem key={option} value={option}>
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  );
                                } else if (normalizedType === "boolean") {
                                  content = (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Switch
                                        checked={Boolean(value)}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            taskId,
                                            key,
                                            e.target.checked,
                                            isSubtask,
                                            subtaskId
                                          )
                                        }
                                        onBlur={handleBlur}
                                        disabled={isclient}
                                      />
                                      <Typography variant="body2">
                                        {value ? "Yes" : "No"}
                                      </Typography>
                                    </Box>
                                  );
                                } else if (normalizedType === "date") {
                                  content = (
                                    <DatePicker
                                      label={label}
                                      value={value ? new Date(value) : null}
                                      onChange={(date) =>
                                        handleFieldChange(
                                          taskId,
                                          key,
                                          date,
                                          isSubtask,
                                          subtaskId
                                        )
                                      }
                                      disabled={isclient}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
                                          onBlur={() =>
                                            handleFieldBlur(
                                              taskId,
                                              key,
                                              value,
                                              isSubtask,
                                              subtaskId
                                            )
                                          }
                                        />
                                      )}
                                    />
                                  );
                                } else {
                                  content = (
                                    <TextField
                                      label={label}
                                      value={value || ""}
                                      onChange={(e) =>
                                        handleFieldChange(
                                          taskId,
                                          key,
                                          e.target.value,
                                          isSubtask,
                                          subtaskId
                                        )
                                      }
                                      onBlur={handleBlur}
                                      disabled={isclient || key === "email"}
                                      size="small"
                                      fullWidth
                                    />
                                  );
                                }

                                return (
                                  <React.Fragment key={key}>
                                    <ListItem sx={{ px: 0 }}>
                                      <ListItemText primary={content} />
                                    </ListItem>
                                    <Divider />
                                  </React.Fragment>
                                );
                              })}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      </Paper>
                    );
                  })}
                </List>
              </Box>
            </Box>
          </div>
        </LocalizationProvider>


        <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Assign Case</Form.Label>
                <Form.Select
                  value={newAssignedTaskCase}
                  onChange={(e) => {
                    fetchUsers(e.target.value);
                    setNewAssignedTaskCase(e.target.value);
                  }}
                  isInvalid={isCaseInvalid}
                >
                  <option value="">Select a Case</option>
                  {allCases?.map((user) => (
                    <option key={user?._id} value={user?._id}>
                      {user?.CaseNumber}
                    </option>
                  ))}
                </Form.Select>
                {isCaseInvalid && (
                  <Form.Text className="text-danger">
                    Please select a case.
                  </Form.Text>
                )}
              </Form.Group>

              {users?.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Assigned Users</Form.Label>
                  <Form.Select
                    value={assignedUsersForCase || ""}
                    isInvalid={isUserInvalid}
                    onChange={(e) => {
                      setAssignedUsersForCase(e.target.value);
                      if (e.target.value) {
                        setIsUserInvalid(false); // clear error when valid user selected
                      }
                    }}
                  >
                    <option value="">Select Assigned User</option>
                    {users?.map((user) => (
                      <option key={user?.id} value={user?.id}>
                        {user?.UserName} ({user?.Role})
                      </option>
                    ))}
                  </Form.Select>
                  {isUserInvalid && (
                    <Form.Text className="text-danger">
                      Please select an assigned user.
                    </Form.Text>
                  )}
                </Form.Group>
              )}
            </Form>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="primary" onClick={() => setShowTaskModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                let valid = true;

                if (!newAssignedTaskCase) {
                  setIsCaseInvalid(true);
                  valid = false;
                }

                if (!assignedUsersForCase) {
                  setIsUserInvalid(true);
                  valid = false;
                }

                if (!valid) return;

                handleAddNewTask(
                  newTaskName,
                  newAssignedTaskCase,
                  assignedUsersForCase
                );
                setShowTaskModal(false);
                setNewTaskName("");
                setNewAssignedTaskCase("");
                setAssignedUsersForCase(null);
                setUsers([]);
                setIsCaseInvalid(false);
                setIsUserInvalid(false);
              }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <ErrorModal
          show={showError}
          handleClose={() => setShowError(false)}
          message={message}
        />

        <ConfirmModal
          show={showConfirm}
          title={`Delete Column "${pendingColumn}"`}
          message={`Are you sure you want to delete column "${pendingColumn}" from all tasks?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />

        <ConfirmModal
          show={showConfirmModal}
          title="Delete Task"
          message={confirmData.message}
          onConfirm={confirmDeleteTask}
          onCancel={() => setShowConfirmModal(false)}
        />

        <SuccessModal
          show={showSuccessModal}
          handleClose={() => setShowSuccessModal(false)}
          message={successMessage}
        />
      </div>
    </div>
  );
}
