import React, { useEffect, useState } from 'react';
import { Form, Modal, Table } from 'react-bootstrap';

import { FaPlus, FaChevronDown, FaChevronRight, FaTrash, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ApiEndPoint } from '../utils/utlis';
import axios from 'axios';
import SocketService from '../../../../SocketService';
import ErrorModal from '../../AlertModels/ErrorModal';
import ConfirmModal from '../../AlertModels/ConfirmModal';
import SuccessModal from '../../AlertModels/SuccessModal';
import { Caseinfo, screenChange, FormCDetails } from '../../../../REDUX/sliece';
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
  Menu,
  ListItemIcon,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  MoreVert,
  PersonAdd,
  PersonOutline,
  CalendarToday,
  Description,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAlert } from '../../../../Component/AlertContext';

export default function ViewFormC({ token }) {
  const { showLoading, showSuccess, showError } = useAlert();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();

  const [todos, setTodos] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [addingSubtaskFor, setAddingSubtaskFor] = useState(null);
  const [newSubtaskName, setNewSubtaskName] = useState('');

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('text');
  const [newColumnOptions, setNewColumnOptions] = useState('');
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
  const isclient = token?.Role === 'client';
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newAssignedTaskCase, setNewAssignedTaskCase] = useState('');
  const [assignedUsersForCase, setAssignedUsersForCase] = useState([]);
  const [editingAssignedUser, setEditingAssignedUser] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [editingAssignedSubtaskId, setEditingAssignedSubtaskId] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedTodo, setSelectedTodo] = React.useState(null);
  const [isCaseInvalid, setIsCaseInvalid] = useState(false);
  const [isUserInvalid, setIsUserInvalid] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');
  // const { showLoading, showSuccess, showError } = useAlert();

  const handleToggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };
  // const showSuccess = (msg) => {
  //   setSuccessMessage(msg);
  //   setShowSuccessModal(true);
  // };

  useEffect(() => {
    if (!SocketService.socket || !SocketService.socket.connected) {
      console.log('🔌 Connecting to socket...');
      SocketService.socket.connect();
    }

    const handleMessagesDelivered = (data) => {
      fetchtask();
    };

    SocketService.socket.off('TaskManagement', handleMessagesDelivered);
    SocketService.onTaskManagement(handleMessagesDelivered);
  }, []);

  useEffect(() => {
    fetchtask();
  }, []);

  useEffect(() => {
    // fetchUsers();
    fetchCases();
  }, []);
  const handleMenuOpen = (event, todo) => {
    event.stopPropagation(); // Prevent event bubbling
    setAnchorEl(event.currentTarget);
    setSelectedTodo(todo); // Force update with the latest todo
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTodo(null);
  };
  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const fetchUsers = async (taskdetails) => {
    let id = taskdetails?.caseId?.value?._id;
    console.log('taskdetails', taskdetails);
    try {
      const response = await axios.get(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${taskdetails}`);
      const allUsers = response.data.AssignedUsers || [];
      console.log('taskdetails', allUsers);

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
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
      console.error('Error fetching users:', error);
      return [];
    }
  };

  const fetchtask = async () => {
    console.log('caseInfo=', caseInfo);
    try {
      const response = await fetch(
        `${ApiEndPoint}getAllConsultationsWithDetails`
        //  caseInfo === null ? (token?.Role === "admin" ? `${ApiEndPoint}getAllTasksWithDetails` : `${ApiEndPoint}getTasksByUser/${token?._id}`) : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}`
      );

      if (!response.ok) {
        throw new Error('Error fetching folders');
      }

      const data = await response.json();
      console.log('fetch Task', data.consultations[0]);
      setTodos(data.consultations);
    } catch (err) {
      // setMessage(err.response?.data?.message || "Error deleting task.");
      //  setShowError(true);
    }
  };

  const [columns, setColumns] = useState([
    { id: 'task', label: 'Task', type: 'text' },
    {
      id: 'status',
      label: 'Status',
      type: 'dropdown',
      options: ['Not Started', 'In Progress', 'Completed', 'Blocked'],
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'dropdown',
      options: ['High', 'Medium', 'Low'],
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
      console.log('empty sub task', subtask);
      //  const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      const response = await createSubtaskApi(selectedCaseId, subtask);
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      // backend default fields set kare

      const previousOpenTaskId = openTaskId;
      console.log('previousOpenTaskId=', previousOpenTaskId);

      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
      console.log('openTaskId=', openTaskId);
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
    // Update state with new task
    // setTodos((prev) => [...prev, newTask]);
  };

  const openModal = (Caseinfo) => {
    console.log('caseId', Caseinfo?._id?.value);
    setParentId(Caseinfo?._id?.value);
    setSelectedCaseId(Caseinfo?.caseId?.value?._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSubtaskName('');
    setAssignedUserId('');
  };

  const toggleTask = (taskId) => {
    // setOpenTaskId(taskId);
    setOpenTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const saveSubtask = (taskId) => {
    if (!newSubtaskName.trim()) return;
    console.log('new task add ', taskId);
    const newSubtask = {
      id: Date.now(),
      task: newSubtaskName,
      status: 'Not Started',
      priority: 'Medium',
    };

    // Initialize new column values for the subtask
    columns.forEach((col) => {
      if (!newSubtask[col.id]) {
        newSubtask[col.id] = col.type === 'checkbox' ? false : '';
      }
    });

    setTodos((prev) =>
      prev.map((todo) => (todo.id === taskId ? { ...todo, subtasks: [...todo.subtasks, newSubtask] } : todo))
    );

    setAddingSubtaskFor(null);
    setNewSubtaskName('');
  };

  const handleFieldChange = (taskId, key, newValue, isSubtask = false, subtaskId = null) => {
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
        if (task.id !== parentTaskId && task._id?.value !== parentTaskId) return task;

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
      .join(' ')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      const response = await axios.delete(`${ApiEndPoint}DeleteColumnByName/${pendingColumn}`);

      if (response.status === 200) {
        showSuccess(`🗑️ ${response.data.message}`);
        SocketService.TaskManagement(response);
        setColumns((prev) => prev.filter((col) => col.id !== pendingColumn.toLowerCase().replace(/\s+/g, '-')));
        const previousOpenTaskId = openTaskId;
        await fetchtask();
        setOpenTaskId(previousOpenTaskId);
      } else {
        showError('⚠️ Column deletion failed.');
        // showError('⚠️ Column deletion failed.');
      }
    } catch (error) {
      console.error('❌ Error deleting column:', error);
      showError('❌ Failed to delete the column.');
      // showError(true);
    }
  };

  const renderFieldInput = (item, column, onChange) => {
    switch (column.type) {
      case 'dropdown':
        return (
          <select value={item[column.id] || ''} onChange={(e) => onChange(e.target.value)}>
            {column.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input type="checkbox" checked={item[column.id] || false} onChange={(e) => onChange(e.target.checked)} />
        );
      default:
        return <input type="text" value={item[column.id] || ''} onChange={(e) => onChange(e.target.value)} />;
    }
  };

  const createSubtaskApi = async (taskId, subtaskData) => {
    return await axios.post(`${ApiEndPoint}createTask`, subtaskData);
  };
  const handleAddEmptySubtask = async (Taskinfo) => {
    setSelectedCaseId(Taskinfo?.caseId?.value?._id);
    console.log('taskId?.caseId?.value?._id', Taskinfo?.caseId?.value?._id);
    try {
      const subtask = {
        caseId: Taskinfo?.caseId?.value?._id,
        createdBy: token._id,
        parentId: Taskinfo?._id?.value,
      };
      console.log('empty sub task', subtask);
      //  const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      const response = await createSubtaskApi(selectedCaseId, subtask); // backend default fields set kare
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      const previousOpenTaskId = openTaskId;
      console.log('previousOpenTaskId=', previousOpenTaskId);
      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
      console.log('openTaskId=', openTaskId);
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  };

  const capitalizeFirst = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const keys =
    todos?.length > 0
      ? Object.keys(todos[0]).filter(
          (key) => key !== '_id' && key !== '__v' && key !== 'subtasks' && key !== 'parentId'
        )
      : [];

  const handleFieldBlur = async (taskId, key, value, isSubtask, subtaskId) => {
    // Replace this with your actual API call logic
    console.log('Blurred & API Call:', {
      taskId,
      key,
      value,
      isSubtask,
      subtaskId,
    });
    console.log('Blurred & API Call value:', { value });

    try {
      const response = await axios.post(`${ApiEndPoint}updateConsultationField`, {
        formId: taskId,
        key,
        value,
      });
      setAssignedUserId([]);
      SocketService.TaskManagement(response);

      fetchtask();
      console.log('Task updated:', response.data);
    } catch (error) {
      console.error('Failed to update task:', error);
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
  const [confirmData, setConfirmData] = useState({ taskId: null, message: '' });

  const handleDelete = (taskId) => {
    console.log('id of form c', taskId);
    setConfirmData({
      taskId,
      message: 'Are you sure you want to delete this Form C?',
    });
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    try {
      const res = await fetch(`${ApiEndPoint}deleteConsultation/${confirmData.taskId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Deleted:', data.message);
        setShowConfirmModal(false);
        showSuccess('Form Delete Successfully');
        fetchtask();
      } else {
        console.error('Delete failed:', data.message);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleSubtaskFieldBlur = async (taskId, key, value, subtaskId) => {
    console.log('Subtask API call on blur', { taskId, key, value, subtaskId });

    taskId = subtaskId;

    if (key === 'date') {
      try {
        let dateObj;

        if (typeof value === 'string') {
          // Parse only yyyy-MM-dd format to date with no time
          const [year, month, day] = value.split('-');
          dateObj = new Date(Date.UTC(+year, +month - 1, +day)); // UTC midnight
        } else if (value instanceof Date && !isNaN(value)) {
          // If already a Date, reset time to midnight
          dateObj = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
        }

        if (!dateObj || isNaN(dateObj)) {
          console.error('Invalid date value:', value);
          return;
        }

        // Send full ISO string to MongoDB (e.g. 2025-05-06T00:00:00.000Z)
        value = dateObj.toISOString();
      } catch (e) {
        console.error('Error parsing date:', e);
        return;
      }
    }

    console.log('API function value:', value);

    try {
      const response = await axios.post(`${ApiEndPoint}updateConsultationField`, {
        taskId,
        key,
        value,
      });

      SocketService.TaskManagement(response);

      const previousOpenTaskId = openTaskId;
      await fetchtask();
      setOpenTaskId(previousOpenTaskId);

      console.log('Task updated:', response.data);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleUserClick = (userId, userName) => {
    console.log('User Clicked:', userId, userName);
    let item = { ClientId: userId };
    dispatch(FormCDetails(null));
    dispatch(Caseinfo(item));

    dispatch(screenChange(12));

    // Navigate or fetch user details, etc.
  };

  const handleClientClick = (email) => {
    console.log('Client Clicked:', email);
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
    console.log('Signup clicked for:', todo);
    try {
      showLoading()
      const formData = new FormData();
      formData.append('UserName', todo?.clientName?.value);
      formData.append('Email', todo?.email?.value);
      formData.append('Password', `${todo?.clientName?.value}@12345`);
      formData.append('Role', 'client');
      formData.append('Contact', todo?.phone?.value);
      formData.append('Bio', '');
      formData.append('Address', '');
      formData.append('Position', '');

      const response = await fetch(`${ApiEndPoint}users`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      showSuccess('✅ Account Created sucessfully.');
      fetchtask();
      // alert("✅ User Added Successfully!");
    } catch (error) {
      showError('⚠️ Account Creation failed.');
      // setShowError(true);
      // alert("❌ Failed to Add User! Check Console.");
      console.error('Error adding user:', error);
    }
  };

  return (
    <div
      className="container-fluid card p-1"
      style={{
        overflow: 'hidden', // Prevent double scrollbars
        maxWidth: 'calc(100vw - 250px)', // subtract sidebar
        height: '86vh', // Set a fixed height to contain everything
        display: 'flex',
        minWidth: '280px',
        flexDirection: 'column',
      }}
    >
      <div className="p-0" style={{ flexShrink: 0 }}>
        <button
          className="btn btn-success"
          onClick={() => {
            dispatch(FormCDetails(null));
            dispatch(screenChange(16));
          }}
        >
          + New form
        </button>
      </div>

      {/* Desktop Table View (lg and up) */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Desktop View - shows on lg and up */}

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 1,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              overflowX: 'auto',
              maxHeight: '100%',
              borderRadius: '12px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              '&::-webkit-scrollbar': {
                width: '8px',
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 31, 63, 0.5)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#D4AF37',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#E6C050',
              },
            }}
          >
            <Table
              stickyHeader
              size="small"
              aria-label="desktop table view"
              sx={{
                minWidth: 'max-content',
                tableLayout: 'fixed',
                width: 'fit-content',
                backgroundColor: '#001f3f',
                borderCollapse: 'collapse',
                '& .MuiTableCell-root': {
                  border: 'none !important',
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    borderBottom: '2px solid #D4AF37',
                    '& .MuiTableCell-root': {
                      backgroundColor: '#001f3f !important',
                      color: '#D4AF37 !important',
                      borderBottom: '2px solid #D4AF37',
                    },
                  }}
                >
                  {/* Client Name Column - First */}
                  <TableCell
                    sx={{
                      minWidth: 120,
                      whiteSpace: 'nowrap',
                      fontWeight: 'bold',
                      backgroundColor: '#001f3f',
                      color: '#D4AF37',
                      position: 'sticky',
                      top: 0,
                      left: 0,
                      zIndex: 3,
                    }}
                  >
                    Client Name
                  </TableCell>

                  {/* Other Columns */}
                  {keys?.map((key) =>
                    key !== 'clientName' && key !== 'caseId' && key !== 'userId' && key !== 'userName' ? (
                      <TableCell
                        key={key}
                        sx={{
                          minWidth: 120,
                          whiteSpace: 'nowrap',
                          fontWeight: 'bold',
                          backgroundColor: '#001f3f',
                          color: '#D4AF37',
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        {formatHeaderLabel(key)}
                      </TableCell>
                    ) : null
                  )}

                  {/* Actions Column */}
                  <TableCell
                    sx={{
                      width: '120px',
                      backgroundColor: '#001f3f',
                      color: '#D4AF37',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      fontWeight: 'bold',
                      borderBottom: '2px solid #D4AF37',
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {todos?.map((todo) => (
                  <TableRow
                    key={todo._id?.value || todo.id}
                    sx={{
                      '& .MuiTableCell-root': {
                        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                      },
                      '&:not(:last-child)': {
                        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                      },
                    }}
                  >
                    {/* Client Name Cell - First */}
                    <TableCell
                      sx={{
                        overflow: 'auto',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal',
                        position: 'sticky',
                        left: 0,
                        backgroundColor: '#0a2d56',
                        zIndex: 2,
                        color: '#676a6e',
                        height: '120px',
                        minWidth: '180px',
                        borderRight: '1px solid rgba(212, 175, 55, 0.3)',
                        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                        borderLeft: 'none',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: '1px',
                          backgroundColor: 'rgba(212, 175, 55, 0.3)',
                        },
                      }}
                    >
                      {todo.clientName?.value || 'Client'}
                    </TableCell>

                    {/* Other Cells */}
                    {keys?.map((key) => {
                      if (key === 'clientName' || key === 'caseId' || key === 'userId' || key === 'userName')
                        return null;

                      const field = todo[key];
                      if (!field) return <TableCell key={key}></TableCell>;

                      const { value, type, enum: enumOptions, editable = true } = field;
                      const taskId = todo._id?.value || todo.id;
                      const subtaskId = isSubtask ? taskId : null;
                      const normalizedType = type?.toLowerCase();

                      const handleBlur = (e) => {
                        const newValue = normalizedType === 'boolean' ? e.target.checked : e.target.value;
                        handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
                      };

                      let content;

                      // Checklist handling
                      if (key === 'checklist') {
                        const checklistKeys = Object.keys(value || {});
                        content = (
                          <FormControl
                            fullWidth
                            size="medium"
                            sx={{
                              minWidth: 140,
                              border: 'none',

                              '& .MuiSelect-select': {
                                maxHeight: '120px',
                                overflowY: 'auto',
                              },
                            }}
                          >
                            <Select
                              multiple
                              value={checklistKeys.filter((k) => value[k])}
                              displayEmpty
                              renderValue={(selected) =>
                                selected.length > 0
                                  ? selected.map((item) => item.toUpperCase()).join(', ')
                                  : 'Checklist Options'
                              }
                              onChange={(e) =>
                                handleFieldChange(
                                  taskId,
                                  key,
                                  Object.fromEntries(checklistKeys.map((k) => [k, e.target.value.includes(k)])),
                                  isSubtask,
                                  subtaskId
                                )
                              }
                              onBlur={handleBlur}
                              disabled={isclient}
                              sx={{
                                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: '4px',
                                height: '100%',
                                '& .MuiSelect-select': {
                                  py: 1.5,
                                  color: '#676a6e',
                                  maxHeight: '100px',
                                  overflowY: 'auto',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none !important',
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                },
                                '&.Mui-focused': {
                                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                },
                                '& .MuiSvgIcon-root': {
                                  color: 'rgba(212, 175, 55, 0.7)',
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    bgcolor: '#0a2d56',
                                    color: 'white',
                                    maxHeight: '200px',
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                    '& .MuiMenuItem-root': {
                                      minHeight: '48px',
                                      '&:hover': {
                                        bgcolor: 'rgba(212, 175, 55, 0.2)',
                                      },
                                    },
                                  },
                                },
                              }}
                            >
                              {checklistKeys.map((optionKey) => (
                                <MenuItem key={optionKey} value={optionKey}>
                                  <Checkbox
                                    checked={!!value[optionKey]}
                                    sx={{
                                      p: 1,
                                      color: '#D4AF37',
                                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                      borderRadius: '4px',
                                      '&.Mui-checked': {
                                        color: '#D4AF37',
                                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                      },
                                    }}
                                  />
                                  <ListItemText primary={optionKey.toUpperCase()} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      } else if (key === 'documents') {
                        const userId = todo.userId?.value;
                        const userName = todo.userName?.value;
                        const email = todo?._id?.value;
                        content =
                          userId && userName ? (
                            <Button
                              sx={{
                                textTransform: 'none',
                                textDecoration: 'underline',
                                p: 0,
                                minWidth: 'auto',
                                color: '#D4AF37',
                                '&:hover': {
                                  color: '#E6C050',
                                  backgroundColor: 'transparent',
                                },
                              }}
                              onClick={() => handleUserClick(userId, userName)}
                            >
                              {userName}
                            </Button>
                          ) : (
                            <Button
                              sx={{
                                textTransform: 'none',
                                textDecoration: 'underline',
                                p: 0,
                                minWidth: 'auto',
                                color: '#D4AF37',
                                '&:hover': {
                                  color: '#E6C050',
                                  backgroundColor: 'transparent',
                                },
                              }}
                              onClick={() => handleClientClick(email)}
                            >
                              {todo.clientName?.value || 'Client'}
                            </Button>
                          );
                      } else if (key === 'createdBy') {
                        content = (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#676a6e',
                              maxHeight: 120,
                              overflowY: 'auto',
                              whiteSpace: 'normal',
                              border: 'none',
                            }}
                          >
                            {value?.UserName || ''}
                          </Typography>
                        );
                      } else if (key === 'createdAt') {
                        content = (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#676a6e',
                              maxHeight: 120,
                              overflowY: 'auto',
                              whiteSpace: 'normal',
                              border: 'none',
                            }}
                          >
                            {(value || '').split('T')[0]}
                          </Typography>
                        );
                      } else if (!editable) {
                        content = (
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#676a6e',
                              maxHeight: 120,
                              overflowY: 'auto',
                              whiteSpace: 'normal',
                              border: 'none',
                            }}
                          >
                            {String(value)}
                          </Typography>
                        );
                      } else if (enumOptions) {
                        content = (
                          <FormControl
                            fullWidth
                            size="medium"
                            sx={{
                              minWidth: 140,
                              border: 'none',
                              maxHeight: 120,
                            }}
                          >
                            <Select
                              value={value}
                              onChange={(e) => handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId)}
                              onBlur={handleBlur}
                              disabled={isclient}
                              sx={{
                                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: '4px',

                                '& .MuiSelect-select': {
                                  py: 1.5,
                                  color: '#676a6e',
                                  maxHeight: '120px',
                                  overflowY: 'auto',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  border: 'none !important',
                                },
                                '&:hover': {
                                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                                },
                                '&.Mui-focused': {
                                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                },
                                '& .MuiSvgIcon-root': {
                                  color: 'rgba(212, 175, 55, 0.7)',
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    bgcolor: '#0a2d56',
                                    color: 'white',
                                    maxHeight: '120px',
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                    '& .MuiMenuItem-root': {
                                      minHeight: '48px',
                                      '&:hover': {
                                        bgcolor: 'rgba(212, 175, 55, 0.2)',
                                      },
                                    },
                                  },
                                },
                              }}
                            >
                              {enumOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        );
                      } else if (normalizedType === 'boolean') {
                        content = (
                          <Checkbox
                            checked={Boolean(value)}
                            onChange={(e) => handleFieldChange(taskId, key, e.target.checked, isSubtask, subtaskId)}
                            onBlur={handleBlur}
                            disabled={isclient}
                            sx={{
                              p: 1,
                              color: '#D4AF37',
                              backgroundColor: 'rgba(212, 175, 55, 0.1)',
                              borderRadius: '4px',
                              '&.Mui-checked': {
                                color: '#D4AF37',
                                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                              },
                            }}
                          />
                        );
                      } else if (normalizedType === 'date') {
                        content = (
                          <DatePicker
                            PopperProps={{
                              sx: {
                                '& .MuiPaper-root': {
                                  boxShadow: 'none',
                                  border: '1px solid rgba(212, 175, 55, 0.3)',
                                },
                              },
                            }}
                            value={value ? new Date(value) : null}
                            onChange={(date) => handleFieldChange(taskId, key, date, isSubtask, subtaskId)}
                            disabled={isclient}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="medium"
                                fullWidth
                                onBlur={() => handleFieldBlur(taskId, key, value, isSubtask, subtaskId)}
                                sx={{
                                  minWidth: 160,
                                  border: 'none',

                                  '& .MuiInputBase-input': {
                                    py: 1.5,
                                    color: '#676a6e',
                                    maxHeight: '120px',
                                    overflowY: 'auto',
                                    border: 'none',
                                  },
                                  '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none !important',
                                  },
                                  '&:hover .MuiOutlinedInput-notchedOutline': {
                                    border: 'none !important',
                                  },
                                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    border: 'none !important',
                                  },
                                }}
                              />
                            )}
                          />
                        );
                      } else {
                        content = (
                          <TextField
                            type="text"
                            size="medium"
                            fullWidth
                            value={value || ''}
                            onChange={(e) => handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId)}
                            onBlur={handleBlur}
                            disabled={key === 'email' || key === 'phone'}
                            multiline
                            maxRows={3}
                            sx={{
                              minWidth: 160,
                              border: 'none',

                              '& .MuiInputBase-input': {
                                py: 1.5,
                                color: '#676a6e',
                                maxHeight: '120px',
                                overflowY: 'auto',
                                border: 'none',
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none !important',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: 'none !important',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 'none !important',
                              },
                            }}
                          />
                        );
                      }

                      return (
                        <TableCell
                          key={key}
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            color: '#676a6e',

                            minWidth: '180px',
                            '& .MuiInputBase-root, & .MuiFormControl-root': {
                              maxHeight: '120px',
                            },
                          }}
                        >
                          {content}
                        </TableCell>
                      );
                    })}

                    {/* Actions Cell */}
                    <TableCell sx={{ color: '' }}>
                      <Box sx={{ position: 'relative' }}>
                        <IconButton
                          size="medium"
                          onClick={(e) => handleMenuOpen(e, todo)}
                          disabled={isclient && !todo.userName?.value}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(212, 175, 55, 0.2)',
                            },
                            color: '#D4AF37',
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          PaperProps={{
                            elevation: 2,
                            sx: {
                              borderRadius: '8px',
                              minWidth: '200px',
                              bgcolor: '#0a2d56',
                              color: 'white',
                              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
                              '& .MuiMenuItem-root': {
                                fontSize: '0.9rem',
                                padding: '10px 16px',
                                minHeight: '48px',
                                '&:hover': {
                                  backgroundColor: 'rgba(212, 175, 55, 0.2)',
                                },
                              },
                            },
                          }}
                          MenuListProps={{
                            sx: {
                              padding: '6px 0',
                            },
                          }}
                        >
                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedTodo) {
                                handleSignup(selectedTodo);
                              }
                              handleMenuClose();
                            }}
                            disabled={selectedTodo?.userName?.value}
                          >
                            <ListItemIcon>
                              <PersonAdd fontSize="medium" sx={{ color: '#D4AF37' }} />
                            </ListItemIcon>
                            <ListItemText primary="Create Account" />
                          </MenuItem>

                          <MenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedTodo) {
                                handleDelete(selectedTodo._id?.value || selectedTodo.id);
                              }
                              handleMenuClose();
                            }}
                            disabled={isclient}
                            sx={{ color: 'error.main' }}
                          >
                            <ListItemIcon>
                              <DeleteIcon fontSize="medium" color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Delete" />
                          </MenuItem>
                        </Menu>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* Mobile View - shows on md and down */}
        <div
          className="d-lg-none h-100"
          style={{
            overflow: 'hidden',
            backgroundColor: '#f5f7fa', // Light gray background
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: '#f5f7fa', // Light gray background
              color: '#333', // Dark text
            }}
          >
            {/* Scrollable content for mobile */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 1,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 0, 0, 0.2)', // Darker scrollbar
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light track
                },
              }}
            >
              <List sx={{ py: 0 }}>
                {todos?.map((todo) => {
                  const userId = todo._id?.value || todo.id;
                  const userName = todo.userName?.value || todo.createdBy?.value?.UserName || todo?.clientName?.value;
                  const isExpanded = expandedUserId === userId;

                  return (
                    <Paper
                      key={userId}
                      elevation={isExpanded ? 4 : 2}
                      sx={{
                        mb: 2,
                        overflow: 'hidden',
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        borderLeft: isExpanded ? '4px solid' : 'none',
                        borderColor: '#D4AF37', // Blue border for selected
                        backgroundColor: 'white', // White cards
                        color: '#333',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)', // Soft blue glow
                        },
                      }}
                    >
                      <Accordion
                        expanded={isExpanded}
                        onChange={() => handleToggleExpand(userId)}
                        sx={{
                          '&:before': {
                            display: 'none',
                          },
                          backgroundColor: 'transparent',
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              sx={{
                                color: isExpanded ? '#D4AF37' : 'rgba(0, 0, 0, 0.54)',
                              }}
                            />
                          }
                          aria-controls={`${userId}-content`}
                          id={`${userId}-header`}
                          sx={{
                            bgcolor: isExpanded
                              ? 'rgba(25, 118, 210, 0.05)' // Light blue tint when expanded
                              : 'white',
                            minHeight: '56px !important',
                            '& .MuiAccordionSummary-content': {
                              alignItems: 'center',
                              my: 1,
                            },
                            '&:hover': {
                              bgcolor: isExpanded ? 'rgba(25, 118, 210, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexGrow: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                mr: 1.5,
                                bgcolor: isExpanded ? '#D4AF37' : '#D4AF37', // Blue when expanded
                                color: isExpanded ? 'white' : '#333',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {userName.charAt(0).toUpperCase()}
                            </Avatar>

                            <Box
                              sx={{
                                minWidth: 0,
                                mr: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: 'medium',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  color: isExpanded ? '#1976d2' : '#333',
                                }}
                              >
                                {userName}
                              </Typography>
                              {todo.createdAt?.value && (
                                <Typography
                                  variant="caption"
                                  color={isExpanded ? '#D4AF37' : 'rgba(0, 0, 0, 0.6)'}
                                  sx={{ display: 'block' }}
                                >
                                  {new Date(todo.createdAt.value).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>

                            {todo.caseId?.value?.CaseNumber && (
                              <Chip
                                label={`Case #${todo.caseId.value.CaseNumber}`}
                                size="small"
                                color="primary"
                                sx={{
                                  ml: 'auto',
                                  fontSize: '0.7rem',
                                  height: 20,
                                  bgcolor: isExpanded ? '#D4AF37' : '#e0e0e0',
                                  color: isExpanded ? 'white' : '#333',
                                }}
                              />
                            )}
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails
                          sx={{
                            pt: 0,
                            pb: 2,
                            px: 1.5,
                            bgcolor: 'white',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mb: 2,
                              gap: 1,
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleSignup(todo)}
                              sx={{
                                textTransform: 'none',
                                flex: 1,
                                fontSize: '0.75rem',
                                py: 0.5,
                                marginTop: '10px',
                                bgcolor: '#D4AF37',
                                color: 'white',
                                '&:hover': {
                                  bgcolor: '#D4AF37',
                                },
                                '&:disabled': {
                                  bgcolor: 'rgba(25, 118, 210, 0.3)',
                                  color: 'rgba(255, 255, 255, 0.5)',
                                },
                              }}
                              disabled={!todo.userName?.value ? false : true}
                              startIcon={<PersonAdd fontSize="small" />}
                            >
                              Create Account
                            </Button>
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(userId)}
                              disabled={isclient}
                              sx={{
                                border: '1px solid',
                                borderColor: 'error.main',
                                flexShrink: 0,
                                marginTop: '10px',
                                color: 'error.main',
                                '&:hover': {
                                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                                },
                                '&:disabled': {
                                  borderColor: 'rgba(244, 67, 54, 0.3)',
                                  color: 'rgba(244, 67, 54, 0.3)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <List sx={{ py: 0 }}>
                            {keys.map((key) => {
                              if (key === 'userId' || key === 'userName' || key === 'id') return null;

                              const field = todo[key];
                              if (!field) return null;

                              const { value, type, enum: enumOptions, editable = true } = field;
                              const taskId = userId;
                              const subtaskId = isSubtask ? taskId : null;
                              const normalizedType = type?.toLowerCase();
                              const label = key
                                .split(/(?=[A-Z])/)
                                .join(' ')
                                .replace(/^./, (str) => str.toUpperCase());

                              const handleBlur = (e) => {
                                const newValue = normalizedType === 'boolean' ? e.target.checked : e.target.value;
                                handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
                              };

                              let content;

                              if (key === 'documents') {
                                const userId = todo.userId?.value;
                                const userName = todo.userName?.value;
                                const clientName = todo.clientName?.value || 'Client';
                                const email = todo?._id?.value;

                                content =
                                  userId && userName ? (
                                    <Button
                                      startIcon={<PersonIcon sx={{ color: '#D4AF37' }} />}
                                      onClick={() => handleUserClick(userId, userName)}
                                      sx={{
                                        textTransform: 'none',
                                        px: 1,
                                        py: 0.5,
                                        color: '#D4AF37',
                                        '&:hover': {
                                          bgcolor: 'rgba(212, 175, 55, 0.1)',
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          textAlign: 'left',
                                          maxWidth: 200,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        }}
                                      >
                                        <Typography variant="body2">{userName}</Typography>
                                        <Typography variant="caption" color="#D4AF37">
                                          View Docs
                                        </Typography>
                                      </Box>
                                    </Button>
                                  ) : (
                                    <Button
                                      startIcon={<BusinessIcon sx={{ color: '#D4AF37' }} />}
                                      onClick={() => handleClientClick(email)}
                                      sx={{
                                        textTransform: 'none',
                                        px: 1,
                                        py: 0.5,
                                        color: '#D4AF37',
                                        '&:hover': {
                                          bgcolor: 'rgba(212, 175, 55, 0.1)',
                                        },
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          textAlign: 'left',
                                          maxWidth: 200,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        }}
                                      >
                                        <Typography variant="body2">{clientName}</Typography>
                                        <Typography variant="caption" color="#D4AF37">
                                          View Docs
                                        </Typography>
                                      </Box>
                                    </Button>
                                  );
                              } else if (key === 'caseId') {
                                content = (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      px: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <Description sx={{ mr: 1, color: '#D4AF37' }} />
                                    <Typography variant="body2">Case #{value?.CaseNumber || 'N/A'}</Typography>
                                  </Box>
                                );
                              } else if (key === 'createdBy') {
                                content = (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      px: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <PersonOutline sx={{ mr: 1, color: '#D4AF37' }} />
                                    <Typography variant="body2">{value?.UserName || 'System'}</Typography>
                                  </Box>
                                );
                              } else if (key === 'createdAt') {
                                content = (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      px: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <CalendarToday
                                      sx={{
                                        mr: 1,
                                        fontSize: '1rem',
                                        color: '#D4AF37',
                                      }}
                                    />
                                    <Typography variant="body2">
                                      {value ? new Date(value).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                  </Box>
                                );
                              } else if (!editable) {
                                content = (
                                  <Typography variant="body2" sx={{ px: 1, py: 0.5 }}>
                                    {String(value || 'N/A')}
                                  </Typography>
                                );
                              } else if (enumOptions) {
                                content = (
                                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                                    <InputLabel shrink sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                                      {label}
                                    </InputLabel>
                                    <Select
                                      value={value || ''}
                                      label={label}
                                      onChange={(e) =>
                                        handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId)
                                      }
                                      onBlur={handleBlur}
                                      disabled={isclient}
                                      variant="outlined"
                                      sx={{
                                        '& .MuiSelect-select': {
                                          py: 1.25,
                                          color: '#333',
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: '#D4AF37',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: '#D4AF37',
                                          borderWidth: '2px',
                                        },
                                        '& .MuiSvgIcon-root': {
                                          color: 'rgba(0, 0, 0, 0.54)',
                                        },
                                      }}
                                      MenuProps={{
                                        PaperProps: {
                                          sx: {
                                            bgcolor: 'white',
                                            color: '#333',
                                            '& .MuiMenuItem-root': {
                                              '&:hover': {
                                                bgcolor: 'rgba(212, 175, 55, 0.1)',
                                              },
                                              '&.Mui-selected': {
                                                bgcolor: 'rgba(212, 175, 55, 0.2)',
                                              },
                                            },
                                          },
                                        },
                                      }}
                                    >
                                      {enumOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                );
                              } else if (normalizedType === 'boolean') {
                                content = (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      px: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <Typography variant="body2">{label}</Typography>
                                    <Switch
                                      checked={Boolean(value)}
                                      onChange={(e) =>
                                        handleFieldChange(taskId, key, e.target.checked, isSubtask, subtaskId)
                                      }
                                      onBlur={handleBlur}
                                      disabled={isclient}
                                      size="small"
                                      color="primary"
                                      sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                          color: '#D4AF37',
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                          backgroundColor: '#D4AF37',
                                        },
                                      }}
                                    />
                                  </Box>
                                );
                              } else if (normalizedType === 'date') {
                                content = (
                                  <DatePicker
                                    label={label}
                                    value={value ? new Date(value) : null}
                                    onChange={(date) => handleFieldChange(taskId, key, date, isSubtask, subtaskId)}
                                    disabled={isclient}
                                    slotProps={{
                                      textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        sx: {
                                          mt: 0.5,
                                          '& .MuiInputBase-input': {
                                            color: '#333',
                                          },
                                          '& .MuiInputLabel-root': {
                                            color: 'rgba(0, 0, 0, 0.6)',
                                          },
                                          '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                          },
                                          '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D4AF37',
                                          },
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#D4AF37',
                                            borderWidth: '2px',
                                          },
                                        },
                                      },
                                    }}
                                  />
                                );
                              } else {
                                content = (
                                  <TextField
                                    label={label}
                                    value={value || ''}
                                    onChange={(e) =>
                                      handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId)
                                    }
                                    onBlur={handleBlur}
                                    disabled={isclient || key === 'email' || key === 'phone'}
                                    size="small"
                                    fullWidth
                                    sx={{
                                      mt: 0.5,
                                      '& .MuiInputBase-input': {
                                        color: '#333',
                                      },
                                      '& .MuiInputLabel-root': {
                                        color: 'rgba(0, 0, 0, 0.6)',
                                      },
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'rgba(0, 0, 0, 0.23)',
                                      },
                                      '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D4AF37',
                                      },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#D4AF37',
                                        borderWidth: '2px',
                                      },
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                );
                              }

                              return (
                                <React.Fragment key={key}>
                                  <ListItem
                                    sx={{
                                      px: 0,
                                      py: 0.5,
                                    }}
                                  >
                                    <ListItemText primary={content} sx={{ my: 0 }} />
                                  </ListItem>
                                  {key !== keys[keys.length - 1] && (
                                    <Divider
                                      sx={{
                                        my: 0.5,
                                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                      }}
                                    />
                                  )}
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
              {isCaseInvalid && <Form.Text className="text-danger">Please select a case.</Form.Text>}
            </Form.Group>

            {users?.length > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>Assigned Users</Form.Label>
                <Form.Select
                  value={assignedUsersForCase || ''}
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
                {isUserInvalid && <Form.Text className="text-danger">Please select an assigned user.</Form.Text>}
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

              handleAddNewTask(newTaskName, newAssignedTaskCase, assignedUsersForCase);
              setShowTaskModal(false);
              setNewTaskName('');
              setNewAssignedTaskCase('');
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

      {/* <ErrorModal show={showError} handleClose={() => setShowError(false)} message={message} /> */}

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

      <SuccessModal show={showSuccessModal} handleClose={() => setShowSuccessModal(false)} message={successMessage} />
    </div>
  );
}
