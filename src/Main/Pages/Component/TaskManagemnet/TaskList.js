
// import './TaskList.css';
// import React, { useEffect, useRef, useState } from 'react';
// import { Form, Modal } from 'react-bootstrap';
// import { useSelector } from 'react-redux';
// import SocketService from '../../../../SocketService';
// import ErrorModal from '../../AlertModels/ErrorModal';
// import ConfirmModal from '../../AlertModels/ConfirmModal';
// import SuccessModal from '../../AlertModels/SuccessModal';
// import axios from 'axios';
// import { ApiEndPoint } from '../utils/utlis';
// import Button from '@mui/material/Button';
// import { Grid } from '@mui/material';
// import ExpandMore from '@mui/icons-material/ExpandMore';
// import PersonOutline from '@mui/icons-material/PersonOutline';
// import Group from '@mui/icons-material/Group';
// import { MdPersonOutline, MdGroup } from 'react-icons/md';
// import Autocomplete from '@mui/material/Autocomplete';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';

// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// // import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// // import dayjs from 'dayjs';

// //import { addColumn } from "./yourHelperFile"; // Adjust or define it in this file

// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   IconButton,
//   TextField,
//   Select,
//   MenuItem,
//   Switch,
//   FormControl,
//   InputLabel,
//   Checkbox,
//   Avatar,
//   Chip,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Menu,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Badge,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import { FaPlus, FaChevronDown, FaChevronRight, FaTrash, FaChevronUp, FaTasks } from 'react-icons/fa';
// import {
//   ExpandMore as ExpandMoreIcon,
//   Delete as DeleteIcon,
//   Person as PersonIcon,
//   MoreVert,
//   PersonAdd,
//   CalendarToday,
//   Description,
// } from '@mui/icons-material';
// import { useAlert } from '../../../../Component/AlertContext';


// export default function TaskList({ token }) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   const [todos, setTodos] = useState([]);
//   const [openTasks, setOpenTasks] = useState([]);
//   const [addingSubtaskFor, setAddingSubtaskFor] = useState(null);
//   const [newSubtaskName, setNewSubtaskName] = useState('');
//   const caseInfo = useSelector((state) => state.screen.Caseinfo);

//   const [addingColumn, setAddingColumn] = useState(false);
//   const [newColumnName, setNewColumnName] = useState('');
//   const [newColumnType, setNewColumnType] = useState('text');
//   const [newColumnOptions, setNewColumnOptions] = useState('');
//   const [isSubtask, setIsSubtask] = useState(false);
//   const [openTaskId, setOpenTaskId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCaseId, setSelectedCaseId] = useState(null);
//   const [expandedUserId, setExpandedUserId] = useState(null);
//   const [assignedUserId, setAssignedUserId] = useState([]);
//   const [parentId, setParentId] = useState();
//   const [users, setUsers] = useState([]);
//   const [allCases, setAllCases] = useState([]);
//   const isclient = token?.Role === 'client';
//   const [showTaskModal, setShowTaskModal] = useState(false);
//   const [newTaskName, setNewTaskName] = useState('');
//   const [newAssignedTaskCase, setNewAssignedTaskCase] = useState(caseInfo ? caseInfo?._id : '');
//   const [assignedUsersForCase, setAssignedUsersForCase] = useState([]);
//   const [editingAssignedUser, setEditingAssignedUser] = useState(null);
//   const [hoveredTaskId, setHoveredTaskId] = useState(null);
//   const [editingAssignedSubtaskId, setEditingAssignedSubtaskId] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedTodo, setSelectedTodo] = useState(null);
//   const [isCaseInvalid, setIsCaseInvalid] = useState(false);
//   const [isUserInvalid, setIsUserInvalid] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [showError, setShowError] = useState(false);
//   const [message, setMessage] = useState('');
//   const [openSubtasksId, setOpenSubtasksId] = useState(null);
//   const [editingField, setEditingField] = useState(null); // { taskId, subtaskId, key }
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const { showDataLoading } = useAlert();

//   const toggleSubtasks = (id) => {
//     setOpenSubtasksId(openSubtasksId === id ? null : id);
//   };

//   const dropdownRef = useRef();
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//         setEditingAssignedUser(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
//   const showSuccess = (msg) => {
//     setSuccessMessage(msg);
//     setShowSuccessModal(true);
//   };

//   useEffect(() => {
//     if (!SocketService.socket || !SocketService.socket.connected) {
//       console.log('🔌 Connecting to socket...');
//       SocketService.socket.connect();
//     }

//     const handleMessagesDelivered = (data) => {
//       fetchtask();
//     };

//     SocketService.socket.off('TaskManagement', handleMessagesDelivered);
//     SocketService.onTaskManagement(handleMessagesDelivered);
//   }, []);

//   useEffect(() => {
//     setNewAssignedTaskCase(caseInfo?._id)
//     fetchtask();
//     fetchUsers(caseInfo?._id);
//   }, [caseInfo]);

//   useEffect(() => {
//     fetchCases();
//   }, []);

//   const handleMenuOpen = (event, todo) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//     setSelectedTodo(todo);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedTodo(null);
//   };

//   const fetchUsers = async (taskdetails) => {
//     let id = taskdetails?.caseId?.value?._id;
//     try {
//       const response = await axios.get(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${taskdetails}`);
//       const allUsers = response.data.AssignedUsers || [];
//       console.log('users= ', allUsers);
//       setUsers(allUsers);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       return [];
//     }
//   };

//   const fetchCases = async () => {
//     try {
//       const response = await axios.get(`${ApiEndPoint}getcase`);
//       const allCases = response.data.data;
//       setAllCases(allCases);
//       return allCases;
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       return [];
//     }
//   };

//   const fetchtask = async () => {
//     try {
//       // showDataLoading(true)
//       const response = await fetch(
//         caseInfo === null
//           ? token?.Role === 'admin'
//             ? `${ApiEndPoint}getAllTasksWithDetails`
//             : `${ApiEndPoint}getTasksByUser/${token?._id}`
//           : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}/${token?._id}/${token?.Role}`
//       );

//       if (!response.ok) {
//         // showDataLoading(false)

//         throw new Error('Error fetching folders');
//       }

//       const data = await response.json();
//       setTodos(data.todos);
//     } catch (err) {
//       // showDataLoading(false)
//       setMessage(err.response?.data?.message || 'Error deleting task.');
//       setShowError(true);
//     }
//   };

//   const [columns, setColumns] = useState([
//     { id: 'task', label: 'Task', type: 'text' },
//     {
//       id: 'status',
//       label: 'Status',
//       type: 'dropdown',
//       options: ['Not Started', 'In Progress', 'Completed', 'Blocked'],
//     },
//     {
//       id: 'priority',
//       label: 'Priority',
//       type: 'dropdown',
//       options: ['High', 'Medium', 'Low'],
//     },
//   ]);

//   const handleAddNewTask = async (name, caseId, userid) => {
//     try {
//       const subtask = {
//         caseId: caseId,
//         createdBy: token?._id,
//         assignedUsers: userid,
//       };
//       const response = await createSubtaskApi(selectedCaseId, subtask);
//       const newSubtask = response.data;
//       SocketService.TaskManagement(newSubtask);

//       const previousOpenTaskId = openTaskId;
//       await fetchtask();
//       await setOpenTaskId(previousOpenTaskId);
//     } catch (error) {
//       setMessage('⚠️ Task not assign please select users or task ');
//       setShowError(true);
//       console.error('Failed to add subtask:', error);
//     }
//   };

//   const openModal = (Caseinfo) => {
//     setParentId(Caseinfo?._id?.value);
//     setSelectedCaseId(Caseinfo?.caseId?.value?._id);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setNewSubtaskName('');
//     setAssignedUserId('');
//   };

//   const toggleTask = (taskId) => {
//     setOpenTaskId((prevId) => (prevId === taskId ? null : taskId));
//   };

//   const saveSubtask = (taskId) => {
//     if (!newSubtaskName.trim()) return;
//     const newSubtask = {
//       id: Date.now(),
//       task: newSubtaskName,
//       status: 'Not Started',
//       priority: 'Medium',
//     };

//     columns.forEach((col) => {
//       if (!newSubtask[col.id]) {
//         newSubtask[col.id] = col.type === 'checkbox' ? false : '';
//       }
//     });

//     setTodos((prev) =>
//       prev.map((todo) => (todo.id === taskId ? { ...todo, subtasks: [...todo.subtasks, newSubtask] } : todo))
//     );

//     setAddingSubtaskFor(null);
//     setNewSubtaskName('');
//   };

//   const handleFieldChange = (taskId, key, newValue, isSubtask = false, subtaskId = null) => {
//     setTodos((prevTodos) =>
//       prevTodos.map((task) => {
//         if (task?._id?.value !== taskId) return task;

//         if (isSubtask && subtaskId) {
//           return {
//             ...task,
//             subtasks: task.subtasks.map((subtask) => {
//               if (subtask?._id?.value !== subtaskId) return subtask;
//               return {
//                 ...subtask,
//                 [key]: {
//                   ...subtask[key],
//                   value: newValue,
//                 },
//               };
//             }),
//           };
//         }

//         return {
//           ...task,
//           [key]: {
//             ...task[key],
//             value: newValue,
//           },
//         };
//       })
//     );
//   };

//   const handleSubtaskFieldChange = (parentTaskId, key, newValue, subtaskId) => {
//     setTodos((prevTasks) => {
//       return prevTasks.map((task) => {
//         if (task.id !== parentTaskId && task?._id?.value !== parentTaskId) return task;

//         const updatedSubtasks = task.subtasks.map((subtask) => {
//           if (subtask?._id?.value !== subtaskId) return subtask;

//           return {
//             ...subtask,
//             [key]: {
//               ...subtask[key],
//               value: newValue,
//             },
//           };
//         });

//         return {
//           ...task,
//           subtasks: updatedSubtasks,
//         };
//       });
//     });
//   };

//   const [showConfirm, setShowConfirm] = useState(false);
//   const [pendingColumn, setPendingColumn] = useState(null);

//   const deleteColumn = async (columnName) => {
//     setPendingColumn(columnName);
//     setShowConfirm(true);
//   };

//   const formatHeaderLabel = (key) => {
//     return key
//       .split(/(?=[A-Z])/)
//       .join(' ')
//       .replace(/^./, (str) => str.toUpperCase());
//   };

//   const handleConfirmDelete = async () => {
//     setShowConfirm(false);
//     try {
//       const response = await axios.delete(`${ApiEndPoint}DeleteColumnByName/${pendingColumn}`);

//       if (response.status === 200) {
//         showSuccess(`🗑️ ${response.data.message}`);
//         SocketService.TaskManagement(response);
//         setColumns((prev) => prev.filter((col) => col.id !== pendingColumn.toLowerCase().replace(/\s+/g, '-')));
//         const previousOpenTaskId = openTaskId;
//         await fetchtask();
//         setOpenTaskId(previousOpenTaskId);
//       } else {
//         setMessage('⚠️ Column deletion failed.');
//         setShowError(true);
//       }
//     } catch (error) {
//       console.error('❌ Error deleting column:', error);
//       setMessage('❌ Failed to delete the column.');
//       setShowError(true);
//     }
//   };

//   const createSubtaskApi = async (taskId, subtaskData) => {
//     return await axios.post(`${ApiEndPoint}createTask`, subtaskData);
//   };

//   const handleAddEmptySubtask = async (Taskinfo) => {
//     setSelectedCaseId(Taskinfo?.caseId?.value?._id);
//     try {
//       const subtask = {
//         caseId: Taskinfo?.caseId?.value?._id,
//         createdBy: token?._id,
//         parentId: Taskinfo?._id?.value,
//       };
//       const response = await createSubtaskApi(selectedCaseId, subtask);
//       const newSubtask = response.data;
//       SocketService.TaskManagement(newSubtask);

//       const previousOpenTaskId = openTaskId;
//       await fetchtask();
//       await setOpenTaskId(previousOpenTaskId);
//     } catch (error) {
//       console.error('Failed to add subtask:', error);
//     }
//   };

//   const capitalizeFirst = (str) => {
//     if (!str) return '';
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   const keys =
//     todos?.length > 0
//       ? Object.keys(todos[0]).filter(
//         (key) => key !== '_id' && key !== '__v' && key !== 'subtasks' && key !== 'parentId'
//       )
//       : [];

//   const handleFieldBlur = async (taskId, key, value, isSubtask, subtaskId) => {
//     try {
//       const response = await axios.post(`${ApiEndPoint}updateTaskField`, {
//         taskId,
//         key,
//         value,
//       });
//       setAssignedUserId([]);
//       SocketService.TaskManagement(response);

//       fetchtask();
//     } catch (error) {
//       console.error('Failed to update task:', error);
//     }
//   };

//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmData, setConfirmData] = useState({ taskId: null, message: '' });

//   const handleDelete = (taskId) => {
//     setConfirmData({
//       taskId,
//       message: 'Are you sure you want to delete this task?',
//     });
//     setShowConfirmModal(true);
//   };

//   const confirmDeleteTask = async () => {
//     const { taskId } = confirmData;
//     setShowConfirmModal(false);

//     try {
//       const response = await fetch(`${ApiEndPoint}deleteTask/${taskId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete task');
//       }

//       SocketService.TaskManagement(response);
//       showSuccess('🗑️ Task deleted successfully');
//       fetchtask();
//     } catch (error) {
//       console.error('Error deleting task:', error);
//       setMessage('❌ Error deleting task');
//       setShowError(true);
//     }
//   };

//   const handleSubtaskFieldBlur = async (taskId, key, value, subtaskId) => {
//     taskId = subtaskId;
//     try {
//       const response = await axios.post(`${ApiEndPoint}updateTaskField`, {
//         taskId,
//         key,
//         value,
//       });

//       SocketService.TaskManagement(response);
//       const previousOpenTaskId = openTaskId;
//       await fetchtask();
//       setOpenTaskId(previousOpenTaskId);
//     } catch (error) {
//       console.error('Failed to update task:', error);
//     }
//   };

//   const handleToggleExpand = (userId) => {
//     setExpandedUserId(expandedUserId === userId ? null : userId);
//   };

//   return (
//     <div
//       className="container-fluid card p-1"
//       style={{
//         overflow: 'hidden',
//         maxWidth: 'calc(100vw - 250px)',
//         height: '86vh',
//         display: 'flex',
//         minWidth: '280px',
//         flexDirection: 'column',
//       }}
//     >
//       <div className="p-1" style={{ flexShrink: 0 }}>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setShowTaskModal(true)}
//           startIcon={<FaPlus />}
//           sx={{
//             bgcolor: '#D4AF37',
//             '&:hover': {
//               bgcolor: '#E6C050',
//             },
//           }}
//         >
//           New Task
//         </Button>
//       </div>
//       {todos.length > 0 ?
//         (
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box
//               sx={{
//                 flex: 1,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 p: 1,
//                 width: '100%',
//                 height: '100%',
//                 overflow: 'hidden',
//               }}
//             >
//               <TableContainer component={Paper} className="table-container">
//                 <Table stickyHeader size="small" aria-label="desktop table view" className="table-main">
//                   <TableHead>
//                     <TableRow className="table-header-row">
//                       <TableCell className="table-pad-header"></TableCell>
//                       <TableCell className="sticky-cell header-cell case-id">
//                         <Box className="header-box">
//                           <Box className="header-label">{formatHeaderLabel('caseId')}</Box>
//                         </Box>
//                       </TableCell>
//                       {keys
//                         ?.filter((key) => key !== 'caseId')
//                         .map((key, index) => (
//                           <TableCell key={key} className={`header-cell ${key}-col`}>
//                             <Box className="header-box">
//                               <Box className="header-label">{formatHeaderLabel(key)}</Box>
//                               {!isclient &&
//                                 ![
//                                   'caseId',
//                                   'title',
//                                   'description',
//                                   'assignedUsers',
//                                   'createdBy',
//                                   'status',
//                                   'dueDate',
//                                   'clientEmail',
//                                   'nationality',
//                                   'nextHearing',
//                                 ].includes(key) && (
//                                   <Box className="icon-box">
//                                     {token?.Role === 'admin' && (
//                                       <IconButton
//                                         size="small"
//                                         onClick={() => deleteColumn(key)}
//                                         title="Delete column"
//                                         className="delete-btn"
//                                       >
//                                         <DeleteIcon fontSize="small" />
//                                       </IconButton>
//                                     )}
//                                   </Box>
//                                 )}
//                             </Box>
//                           </TableCell>
//                         ))}
//                       <TableCell className="add-column-cell">
//                         {token?.Role === 'admin' && (
//                           <IconButton size="small" onClick={() => setAddingColumn(true)} className="add-column-btn">
//                             <FaPlus style={{ color: 'var(--accent-gold)' }} />
//                           </IconButton>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>

//                   <TableBody>
//                     {todos?.map((todo, rowIndex) => (
//                       <React.Fragment key={todo?._id?.value || todo.id}>
//                         <TableRow className="main-row">
//                           <TableCell className="table-pad-header">
//                             <IconButton
//                               size="small"
//                               onClick={() => toggleTask(todo?._id?.value || todo.id)}
//                               className="expand-icon"
//                             >
//                               {openTaskId === (todo?._id?.value || todo.id) ? <FaChevronDown /> : <FaChevronRight />}
//                             </IconButton>
//                           </TableCell>
//                           <TableCell className="sticky-cell data-cell case-id">
//                             <Typography variant="inherit" noWrap>
//                               {todo.caseId?.value?.CaseNumber || ''}
//                             </Typography>
//                           </TableCell>
//                           {keys
//                             ?.filter((key) => key !== 'caseId')
//                             .map((key) => {
//                               let field = todo[key] || { value: '', type: 'string', editable: true };
//                               const { value, type, enum: enumOptions, editable = true } = field;
//                               const normalizedType = type?.toLowerCase();
//                               const taskId = todo?._id?.value || todo.id;
//                               const subtaskId = null;
//                               const handleBlur = (e) => {
//                                 const newValue = e.target.textContent;
//                                 handleFieldBlur(taskId, key, newValue, false, subtaskId);
//                               };

//                               let content;

//                               const isExcluded = ['assignedUsers', 'dueDate', 'caseId'].includes(key);
//                               const isEditing =
//                                 editingField?.taskId === taskId &&
//                                 editingField?.subtaskId === subtaskId &&
//                                 editingField?.key === key;

//                               if (!isExcluded && editable) {
//                                 content = isEditing ? (
//                                   <textarea
//                                     autoFocus
//                                     defaultValue={value}
//                                     placeholder={`Enter ${formatHeaderLabel(key)}`}
//                                     onBlur={(e) => {
//                                       const val = e.target.value;
//                                       handleFieldBlur(taskId, key, val, false, subtaskId);
//                                       setEditingField(null);
//                                     }}
//                                     onKeyDown={(e) => {
//                                       if (e.key === 'Enter' && !e.shiftKey) {
//                                         e.preventDefault();
//                                         e.target.blur();
//                                       }
//                                     }}
//                                     onMouseOver={(e) => {
//                                       if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.8)';
//                                     }}
//                                     onMouseOut={(e) => {
//                                       if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
//                                     }}
//                                     style={{
//                                       width: '100%',
//                                       minHeight: '70px',
//                                       maxHeight: '200px',
//                                       padding: '8px 12px',
//                                       fontSize: '0.875rem',
//                                       lineHeight: '20px',
//                                       backgroundColor: '#fff',
//                                       border: '1px solid rgba(212, 175, 55, 0.5)',
//                                       borderRadius: '4px',
//                                       resize: 'none',
//                                       overflowY: 'auto',
//                                       outline: 'none',
//                                       boxShadow: isEditing ? '0 0 0 2px rgba(212, 175, 55, 0.3)' : 'none',
//                                     }}
//                                   />
//                                 ) : (
//                                   <div
//                                     onClick={() => setEditingField({ taskId, subtaskId, key })}
//                                     style={{
//                                       width: '100%',
//                                       height: '70px', // Fixed 3-line display
//                                       padding: '8px 0',
//                                       lineHeight: '20px',
//                                       fontSize: '0.875rem',
//                                       whiteSpace: 'pre-wrap',
//                                       wordBreak: 'break-word',
//                                       cursor: 'pointer',
//                                       overflowY: 'auto', // Show thin scrollbar on hover
//                                     }}
//                                   >
//                                     {value || (
//                                       <span style={{ color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
//                                         Enter {formatHeaderLabel(key)}
//                                       </span>
//                                     )}
//                                   </div>
//                                 );
//                               }

//                               if (key === 'createdBy') {
//                                 content = (
//                                   <Typography variant="inherit" noWrap>
//                                     {todo.createdBy?.value?.UserName || ''}
//                                   </Typography>
//                                 );
//                               } else if (key === 'assignedUsers') {
//                                 //copy
//                                 const usersList = todo?.assignedUsers?.value || [];
//                                 const defaultSelectedId = usersList[0]?.id || '';
//                                 const currentSelectedId = assignedUserId || defaultSelectedId;
//                                 if (editingAssignedUser === taskId) {
//                                   content = (
//                                     <FormControl fullWidth size="small">

//                                       <Autocomplete
//                                         disableClearable
//                                         options={users || []}
//                                         value={
//                                           users.find(
//                                             (u) => u.id === (assignedUserId || todo?.assignedUsers?.value?.[0]?.id)
//                                           ) || null
//                                         }
//                                         onFocus={() => fetchUsers(todo?.caseId?.value?._id)} // ✅ single click fetch
//                                         onChange={(event, newValue) => {
//                                           if (newValue && newValue.id !== assignedUserId) {
//                                             setAssignedUserId(newValue.id);
//                                             handleFieldBlur(
//                                               todo._id?.value || todo.id,
//                                               'assignedUsers',
//                                               newValue.id,
//                                               false,
//                                               null
//                                             );
//                                           }
//                                           setEditingAssignedUser(null); // ✅ close
//                                         }}
//                                         onBlur={() => {
//                                           setEditingAssignedUser(null); // ✅ value stays if not changed
//                                         }}
//                                         isOptionEqualToValue={(option, value) => option?.id === value?.id}
//                                         getOptionLabel={(option) =>
//                                           option?.UserName ? `${option.UserName} (${capitalizeFirst(option.Role)})` : ''
//                                         }
//                                         renderInput={(params) => (
//                                           <TextField
//                                             {...params}
//                                             placeholder="Assign User"
//                                             autoFocus
//                                             sx={{
//                                               '& .MuiInputBase-root': {
//                                                 py: 1,
//                                                 backgroundColor: '#fff',
//                                                 border: '1px solid rgba(212, 175, 55, 0.5)',
//                                                 borderRadius: '4px',
//                                                 paddingRight: '32px !important',
//                                               },
//                                               '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
//                                               '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
//                                               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                 border: 'none',
//                                                 boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.3)',
//                                               },
//                                               '& input': { padding: '8px 0 8px 8px' },
//                                             }}
//                                             InputProps={{
//                                               ...params.InputProps,
//                                               endAdornment: (
//                                                 <ExpandMore sx={{ color: '#D4AF37', position: 'absolute', right: 8 }} />
//                                               ),
//                                             }}
//                                           />
//                                         )}
//                                         popupIcon={null} // because we're injecting custom icon
//                                         componentsProps={{
//                                           paper: {
//                                             sx: {
//                                               backgroundColor: '#001f3f',
//                                               color: '#D4AF37',
//                                               border: '1px solid #D4AF37',
//                                               mt: 1,
//                                               '& .MuiAutocomplete-option': {
//                                                 '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
//                                                 '&[aria-selected="true"]': {
//                                                   backgroundColor: 'rgba(212, 175, 55, 0.2)',
//                                                 },
//                                               },
//                                             },
//                                           },
//                                         }}
//                                       />
//                                     </FormControl>
//                                   );
//                                 } else {
//                                   const isHovered = hoveredTaskId === taskId;
//                                   content = (
//                                     <Box
//                                       sx={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         cursor: 'pointer',
//                                         width: '100%',
//                                         minHeight: '36px',
//                                         border: '1px solid rgba(212, 175, 55, 0.3)',
//                                         borderRadius: '4px',
//                                         padding: '8px',
//                                         '&:hover': {
//                                           borderColor: '#D4AF37',
//                                         },
//                                       }}
//                                       onMouseEnter={() => setHoveredTaskId(taskId)}
//                                       onMouseLeave={() => setHoveredTaskId(null)}
//                                       onClick={() => !isclient && setEditingAssignedUser(taskId)}
//                                     >
//                                       <Typography variant="inherit" noWrap sx={{ flex: 1 }}>
//                                         {usersList.length > 0 ? usersList.map((u) => u.UserName).join(', ') : 'Assign User'}
//                                       </Typography>
//                                       <ExpandMore
//                                         sx={{
//                                           color: '#D4AF37',
//                                           opacity: isHovered ? 1 : 0.5,
//                                           transition: 'opacity 0.2s ease',
//                                           fontSize: '20px',
//                                         }}
//                                       />
//                                     </Box>
//                                   );
//                                 }
//                               } else if (key === 'dueDate' || key === 'nextHearing') {
//                                 content = (
//                                   <DatePicker
//                                     value={value ? new Date(value) : null}
//                                     onChange={(date, e) => {

//                                       console.log("onBlur triggered");
//                                       // const newValue =
//                                       //   normalizedType === "boolean"
//                                       //     ? e.target.checked
//                                       //     : e.target.value;
//                                       handleFieldBlur(taskId, key, date, isSubtask, subtaskId);
//                                       handleFieldChange(taskId, key, date, isSubtask, subtaskId)
//                                     }
//                                     }
//                                     format="dd/MM/yyyy"
//                                     disabled={isclient}
//                                     slotProps={{
//                                       textField: {
//                                         size: "small",
//                                         fullWidth: true,
//                                         onBlur: (e) => {
//                                           console.log("onBlur triggered");
//                                           const newValue =
//                                             normalizedType === "boolean"
//                                               ? e.target.checked
//                                               : e.target.value;
//                                           handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
//                                         },
//                                         sx: {
//                                           mt: 0.5,
//                                           "& .MuiInputBase-input": {
//                                             color: "#333",
//                                           },
//                                           "& .MuiInputLabel-root": {
//                                             color: "rgba(0, 0, 0, 0.6)",
//                                           },
//                                           "& .MuiOutlinedInput-notchedOutline": {
//                                             borderColor: "rgba(0, 0, 0, 0.23)",
//                                           },
//                                           "&:hover .MuiOutlinedInput-notchedOutline": {
//                                             borderColor: "#D4AF37",
//                                           },
//                                           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                                             borderColor: "#D4AF37",
//                                             borderWidth: "2px",
//                                           },
//                                         },
//                                       },
//                                     }}
//                                   />

//                                 );
//                               }

//                               return (
//                                 <TableCell key={key} className={`data-cell ${key}-col`}>
//                                   <Box className="cell-box">{content}</Box>
//                                 </TableCell>
//                               );
//                             })}
//                           <TableCell className="action-cell">
//                             <IconButton
//                               size="small"
//                               onClick={() => handleDelete(todo?._id?.value || todo.id)}
//                               disabled={isclient}
//                               className="delete-btn"
//                             >
//                               <DeleteIcon fontSize="small" />
//                             </IconButton>
//                           </TableCell>
//                         </TableRow>

//                         {openTaskId === (todo?._id?.value || todo.id) && (
//                           <>
//                             {/* Subtask Header Row */}
//                             <TableRow className="subtask-header-row">
//                               <TableCell>
//                                 <Typography></Typography>
//                               </TableCell>
//                               <TableCell className="sticky-cell case-id subtask-header-cell">
//                                 <Typography variant="subtitle2" className="subtask-header-text">
//                                   🔽 Subtasks
//                                 </Typography>
//                               </TableCell>
//                             </TableRow>

//                             {/* Subtask Rows */}
//                             {todo?.subtasks?.map((subtask) => (
//                               <TableRow key={subtask?._id?.value} className="subtask-row">
//                                 <TableCell className="table-pad-header"></TableCell>
//                                 <TableCell className="sticky-cell data-cell case-id">
//                                   <Typography variant="inherit" noWrap>
//                                     {subtask.caseId?.value?.CaseNumber || ''}
//                                   </Typography>
//                                 </TableCell>
//                                 {keys
//                                   ?.filter((k) => k !== 'caseId')
//                                   .map((key) => {
//                                     let field = subtask[key] || { value: '', type: 'string', editable: true };
//                                     const { value, type, enum: enumOptions, editable = true } = field;
//                                     const taskId = todo?._id?.value || todo.id;
//                                     const subtaskId = subtask?._id?.value;

//                                     const isExcluded = ['assignedUsers', 'dueDate', 'caseId'].includes(key);
//                                     const isEditing =
//                                       editingField?.taskId === taskId &&
//                                       editingField?.subtaskId === subtaskId &&
//                                       editingField?.key === key;

//                                     let content;

//                                     if (!isExcluded && editable) {
//                                       content = isEditing ? (
//                                         <textarea
//                                           autoFocus
//                                           defaultValue={value}
//                                           placeholder={`Enter ${formatHeaderLabel(key)}`}
//                                           onBlur={(e) => {
//                                             const val = e.target.value;
//                                             handleSubtaskFieldBlur(taskId, key, val, subtaskId);
//                                             setEditingField(null);
//                                           }}
//                                           onKeyDown={(e) => {
//                                             if (e.key === 'Enter' && !e.shiftKey) {
//                                               e.preventDefault();
//                                               e.target.blur();
//                                             }
//                                           }}
//                                           onMouseOver={(e) => {
//                                             if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.8)';
//                                           }}
//                                           onMouseOut={(e) => {
//                                             if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
//                                           }}
//                                           style={{
//                                             width: '100%',
//                                             minHeight: '70px',
//                                             maxHeight: '200px',
//                                             padding: '8px 12px',
//                                             fontSize: '0.875rem',
//                                             lineHeight: '20px',
//                                             backgroundColor: '#fff',
//                                             border: '1px solid rgba(212, 175, 55, 0.5)',
//                                             borderRadius: '4px',
//                                             resize: 'none',
//                                             overflowY: 'auto',
//                                             outline: 'none',
//                                             boxShadow: isEditing ? '0 0 0 2px rgba(212, 175, 55, 0.3)' : 'none',
//                                           }}
//                                         ></textarea>
//                                       ) : (
//                                         <div
//                                           onClick={() => setEditingField({ taskId, subtaskId, key })}
//                                           style={{
//                                             width: '100%',
//                                             height: '70px', // Fixed 3-line display
//                                             // overflow: 'hidden', // Hide overflow initially
//                                             padding: '8px 0',
//                                             lineHeight: '20px',
//                                             fontSize: '0.875rem',
//                                             whiteSpace: 'pre-wrap',
//                                             wordBreak: 'break-word',
//                                             cursor: 'pointer',
//                                             border: '2px',

//                                             overflowY: 'auto', // Show thin scrollbar on hover
//                                           }}
//                                         >
//                                           {value || (
//                                             <span style={{ color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
//                                               Enter {formatHeaderLabel(key)}
//                                             </span>
//                                           )}
//                                         </div>
//                                       );
//                                     }

//                                     if (key === 'createdBy') {
//                                       content = (
//                                         <Typography variant="inherit" noWrap>
//                                           {subtask.createdBy?.value?.UserName || ''}
//                                         </Typography>
//                                       );
//                                     } else if (key === 'assignedUsers') {
//                                       const usersList = subtask.assignedUsers?.value || [];
//                                       const defaultSelectedId = usersList[0]?.id || '';
//                                       const currentSelectedId = assignedUserId || defaultSelectedId;
//                                       //Copy
//                                       if (editingAssignedSubtaskId === subtaskId) {
//                                         content = (
//                                           <FormControl fullWidth size="small">
//                                             {/* <Select
//                                           value={currentSelectedId}
//                                           disabled={isclient}
//                                           autoFocus
//                                           onClick={() => {
//                                             // Called on single click
//                                             fetchUsers(todo?.caseId?.value?._id);
//                                           }}
//                                           onChange={(e) => {
//                                             const newValue = e.target.value;
//                                             if (newValue !== currentSelectedId) {
//                                               setAssignedUserId(newValue);
//                                               handleSubtaskFieldBlur(taskId, key, [newValue], subtaskId);
//                                             }
//                                             setEditingAssignedSubtaskId(null);
//                                           }}
//                                           onBlur={() => {
//                                             setEditingAssignedSubtaskId(null);
//                                           }}
//                                           className="select-field"
//                                           MenuProps={{
//                                             PaperProps: { className: 'dropdown-paper' },
//                                           }}
//                                           IconComponent={(props) => <ExpandMore {...props} className="dropdown-icon" />}
//                                         >
//                                           <MenuItem value="">Assign User</MenuItem>
//                                           {users?.map((user) => (
//                                             <MenuItem key={user?.id} value={user?.id}>
//                                               {user?.UserName} ({capitalizeFirst(user?.Role)})
//                                             </MenuItem>
//                                           ))}
//                                         </Select> */}
//                                             <Autocomplete
//                                               disableClearable
//                                               options={users || []}
//                                               getOptionLabel={(option) =>
//                                                 `${option?.UserName} (${capitalizeFirst(option?.Role)})`
//                                               }
//                                               isOptionEqualToValue={(option, value) => option?.id === value?.id}
//                                               value={users?.find((user) => user?.id === currentSelectedId) || null}
//                                               onFocus={() => fetchUsers(todo?.caseId?.value?._id)}
//                                               onChange={(event, newValue) => {
//                                                 if (newValue && newValue.id !== currentSelectedId) {
//                                                   setAssignedUserId(newValue.id);
//                                                   handleSubtaskFieldBlur(taskId, key, [newValue.id], subtaskId);
//                                                 }
//                                                 setEditingAssignedSubtaskId(null);
//                                               }}
//                                               onBlur={() => setEditingAssignedSubtaskId(null)}
//                                               popupIcon={<ExpandMore sx={{ color: '#D4AF37' }} />} // Custom golden icon
//                                               renderInput={(params) => (
//                                                 <TextField
//                                                   {...params}
//                                                   autoFocus
//                                                   placeholder="Assign User"
//                                                   className="select-field"
//                                                   sx={{
//                                                     '& .MuiInputBase-root': {
//                                                       py: 1,
//                                                       backgroundColor: '#fff',
//                                                       border: '1px solid rgba(212, 175, 55, 0.5)',
//                                                       borderRadius: '4px',
//                                                       paddingRight: '32px !important',
//                                                     },
//                                                     '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
//                                                     '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
//                                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                       border: 'none',
//                                                       boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.3)',
//                                                     },
//                                                     '& input': {
//                                                       padding: '8px 0 8px 8px',
//                                                     },
//                                                   }}
//                                                 />
//                                               )}
//                                               componentsProps={{
//                                                 paper: {
//                                                   sx: {
//                                                     backgroundColor: '#001f3f',
//                                                     color: '#D4AF37',
//                                                     border: '1px solid #D4AF37',
//                                                     mt: 1,
//                                                     '& .MuiAutocomplete-option': {
//                                                       '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' },
//                                                       '&[aria-selected="true"]': {
//                                                         backgroundColor: 'rgba(212, 175, 55, 0.2)',
//                                                       },
//                                                     },
//                                                   },
//                                                 },
//                                               }}
//                                             />
//                                           </FormControl>
//                                         );
//                                       } else {
//                                         content = (
//                                           <Box
//                                             className="select-box"
//                                             onClick={() => !isclient && setEditingAssignedSubtaskId(subtaskId)}
//                                           >
//                                             <Typography variant="inherit" noWrap>
//                                               {usersList.length > 0
//                                                 ? usersList.map((u) => u.UserName).join(', ')
//                                                 : 'Assign User'}
//                                             </Typography>
//                                             {!isclient && <ExpandMore className="dropdown-icon" />}
//                                           </Box>
//                                         );
//                                       }
//                                     } else if (key === 'dueDate' || key === 'nextHearing') {
//                                       content = (
//                                         <DatePicker
//                                           //       label={label}
//                                           value={value ? new Date(value) : null}
//                                           format="dd/MM/yyyy"

//                                           onChange={(date) => {
//                                             if (date) {
//                                               handleSubtaskFieldChange(
//                                                 taskId,
//                                                 key,
//                                                 date,
//                                                 subtaskId
//                                               );
//                                               handleSubtaskFieldBlur(
//                                                 taskId,
//                                                 key,
//                                                 date,
//                                                 subtaskId
//                                               )
//                                             }
//                                           }}
//                                           onBlur={() => handleSubtaskFieldBlur(
//                                             taskId,
//                                             key,
//                                             value,
//                                             subtaskId
//                                           )}
//                                           // minDate={today}
//                                           disabled={isclient}
//                                           slotProps={{
//                                             textField: {
//                                               size: "small",
//                                               fullWidth: true,
//                                               sx: {
//                                                 mt: 0.5,
//                                                 "& .MuiInputBase-input": {
//                                                   color: "#333",
//                                                 },
//                                                 "& .MuiInputLabel-root": {
//                                                   color: "rgba(0, 0, 0, 0.6)",
//                                                 },
//                                                 "& .MuiOutlinedInput-notchedOutline":
//                                                 {
//                                                   borderColor: "rgba(0, 0, 0, 0.23)",
//                                                 },
//                                                 "&:hover .MuiOutlinedInput-notchedOutline":
//                                                 {
//                                                   borderColor: "#D4AF37",
//                                                 },
//                                                 "&.Mui-focused .MuiOutlinedInput-notchedOutline":
//                                                 {
//                                                   borderColor: "#D4AF37",
//                                                   borderWidth: "2px",
//                                                 },
//                                               },
//                                             },
//                                           }}

//                                         />
//                                       );
//                                     }

//                                     return (
//                                       <TableCell key={key} className={`data-cell ${key}-col`}>
//                                         <Box className="cell-box">{content}</Box>
//                                       </TableCell>
//                                     );
//                                   })}
//                                 <TableCell className="action-cell">
//                                   <IconButton
//                                     size="small"
//                                     onClick={() => handleDelete(subtask?._id?.value)}
//                                     disabled={isclient}
//                                     className="delete-btn"
//                                   >
//                                     <DeleteIcon fontSize="small" />
//                                   </IconButton>
//                                 </TableCell>
//                               </TableRow>
//                             ))}

//                             {/* Add Subtask Button Row */}
//                             {!isclient && (
//                               <TableRow className="subtask-header-row">
//                                 <TableCell>
//                                   <Typography />
//                                 </TableCell>
//                                 <TableCell className="sticky-cell case-id subtask-header-cell">
//                                   <Button
//                                     variant="outlined"
//                                     size="small"
//                                     onClick={() => handleAddEmptySubtask(todo)}
//                                     className="add-subtask-btn"
//                                   >
//                                     + Add Subtask
//                                   </Button>
//                                 </TableCell>
//                               </TableRow>
//                             )}
//                           </>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Box>

//             {/* Mobile View */}
//             <div
//               className="d-lg-none h-100"
//               style={{
//                 overflow: 'hidden',
//                 backgroundColor: '#f5f7fa', // Light gray background
//               }}
//             >
//               <Box
//                 sx={{
//                   height: '100%',
//                   display: 'flex',
//                   flexDirection: 'column',
//                   overflow: 'hidden',
//                   backgroundColor: '#f5f7fa', // Light gray background
//                   color: '#333', // Dark text
//                 }}
//               >
//                 {/* Scrollable content for mobile */}
//                 <Box
//                   sx={{
//                     flexGrow: 1,
//                     overflow: 'auto',
//                     p: 1,
//                     '&::-webkit-scrollbar': {
//                       width: '6px',
//                     },
//                     '&::-webkit-scrollbar-thumb': {
//                       backgroundColor: 'rgba(0, 0, 0, 0.2)', // Darker scrollbar
//                       borderRadius: '3px',
//                     },
//                     '&::-webkit-scrollbar-track': {
//                       backgroundColor: 'rgba(0, 0, 0, 0.05)', // Light track
//                     },
//                   }}
//                 >
//                   <List sx={{ py: 0 }}>
//                     {todos?.map((todo) => {
//                       const taskId = todo?._id?.value || todo.id;
//                       const title = todo.title?.value || 'Untitled Task';
//                       const caseNumber = todo.caseId?.value?.CaseNumber || 'N/A';
//                       const isExpanded = expandedUserId === taskId;
//                       const hasSubtasks = todo.subtasks?.length > 0;
//                       const showSubtasks = openSubtasksId === taskId;
//                       const status = todo.status?.value || 'No Status';

//                       return (
//                         <Paper
//                           key={taskId}
//                           elevation={isExpanded ? 4 : 2}
//                           sx={{
//                             mb: 2,
//                             overflow: 'hidden',
//                             borderRadius: 2,
//                             transition: 'all 0.2s ease',
//                             borderLeft: isExpanded ? '4px solid' : 'none',
//                             borderColor: '#D4AF37', // Blue border for selected
//                             backgroundColor: 'white', // White cards
//                             color: '#333',
//                             '&:hover': {
//                               boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)', // Soft blue glow
//                             },
//                           }}
//                         >
//                           <Accordion
//                             expanded={isExpanded}
//                             onChange={() => handleToggleExpand(taskId)}
//                             sx={{
//                               '&:before': { display: 'none' },
//                               backgroundColor: 'transparent',
//                             }}
//                           >
//                             <AccordionSummary
//                               expandIcon={
//                                 <ExpandMoreIcon
//                                   sx={{
//                                     color: isExpanded ? '#D4AF37' : 'rgba(0, 0, 0, 0.54)',
//                                   }}
//                                 />
//                               }
//                               aria-controls={`${taskId}-content`}
//                               id={`${taskId}-header`}
//                               sx={{
//                                 bgcolor: isExpanded ? 'rgba(212, 175, 55, 0.05)' : 'white',
//                                 minHeight: '56px !important',
//                                 '& .MuiAccordionSummary-content': {
//                                   alignItems: 'center',
//                                   my: 1, // Use consistent vertical padding instead of `my`
//                                 },
//                                 '&:hover': {
//                                   bgcolor: isExpanded ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 0, 0, 0.02)',
//                                 },
//                               }}
//                             >
//                               <Box
//                                 sx={{
//                                   display: 'flex',
//                                   alignItems: 'center',
//                                   flexGrow: 1,
//                                   overflow: 'hidden',
//                                   gap: 1.5,
//                                 }}
//                               >
//                                 <Avatar
//                                   sx={{
//                                     width: 32,
//                                     height: 32,
//                                     mr: 1.5,
//                                     bgcolor: isExpanded ? '#D4AF37' : '#D4AF37', // Blue when expanded
//                                     color: isExpanded ? 'white' : '#333',
//                                     fontSize: '0.875rem',
//                                     fontWeight: 'bold',
//                                   }}
//                                 >
//                                   {title.charAt(0).toUpperCase()}
//                                 </Avatar>

//                                 <Box
//                                   sx={{
//                                     minWidth: 0,
//                                     mr: 1,
//                                   }}
//                                 >
//                                   <Typography
//                                     variant="subtitle1"
//                                     sx={{
//                                       fontWeight: 'medium',
//                                       whiteSpace: 'nowrap',
//                                       overflow: 'hidden',
//                                       textOverflow: 'ellipsis',
//                                       color: isExpanded ? '#D4AF37' : '#333',
//                                     }}
//                                   >
//                                     {title.length > 5 ? `${title.substring(0, 5)}...` : title}
//                                   </Typography>
//                                   <Typography
//                                     variant="caption"
//                                     color={isExpanded ? '#D4AF37' : 'rgba(0, 0, 0, 0.6)'}
//                                     sx={{ display: 'block' }}
//                                   >
//                                     {todo.createdAt?.value ? new Date(todo.createdAt.value).toLocaleDateString() : 'N/A'}
//                                   </Typography>
//                                 </Box>

//                                 {caseNumber && (
//                                   <Chip
//                                     label={
//                                       <Box
//                                         component="span"
//                                         sx={{
//                                           overflow: 'hidden',
//                                           textOverflow: 'ellipsis',
//                                           whiteSpace: 'nowrap',
//                                           display: 'block',
//                                           width: '100%', // fill chip width
//                                         }}
//                                       >
//                                         {`Case #${caseNumber}`}
//                                       </Box>
//                                     }
//                                     size="small"
//                                     sx={{
//                                       ml: 'auto',
//                                       fontSize: '0.7rem',
//                                       height: 20,
//                                       bgcolor: isExpanded ? '#D4AF37' : '#e0e0e0',
//                                       color: isExpanded ? 'white' : '#333',
//                                       width: 80, // ✅ fixed chip size (adjust as needed)
//                                       px: 1, // horizontal padding for inner text
//                                     }}
//                                   />
//                                 )}
//                               </Box>
//                             </AccordionSummary>

//                             <AccordionDetails
//                               sx={{
//                                 pt: 0,
//                                 pb: 2,
//                                 px: 1.5,
//                                 bgcolor: 'white',
//                               }}
//                             >
//                               <List sx={{ py: 0 }}>
//                                 {keys?.map((key) => {
//                                   const field = todo[key];
//                                   if (!field || key === 'subtasks' || key === '_id' || key === 'title' || key === 'caseId')
//                                     return null;

//                                   const { value, type, enum: enumOptions, editable = true } = field;
//                                   const label = formatHeaderLabel(key);
//                                   const normalizedType = type?.toLowerCase();
//                                   const taskId = todo?._id?.value || todo.id;
//                                   const subtaskId = isSubtask ? taskId : null;

//                                   const handleBlur = (e) => {
//                                     const newValue = normalizedType === 'boolean' ? e.target.checked : e.target.value;
//                                     handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
//                                   };

//                                   let content;

//                                   if (key === 'createdBy') {
//                                     content = (
//                                       <Box
//                                         sx={{
//                                           display: 'flex',
//                                           alignItems: 'center',
//                                           px: 1,
//                                           py: 0.5,
//                                         }}
//                                       >
//                                         <PersonOutline sx={{ mr: 1, color: '#D4AF37' }} />
//                                         <Typography variant="body2">
//                                           {todo.createdBy?.value?.UserName || 'System'}
//                                         </Typography>
//                                       </Box>
//                                     );
//                                   } else if (key === 'assignedUsers') {
//                                     const usersList = todo?.assignedUsers?.value || [];
//                                     const defaultSelectedId = todo?.assignedUsers?.value[0]?._id || '';
//                                     const currentSelectedId = !assignedUserId ? assignedUserId : defaultSelectedId;

//                                     // if (editingAssignedUser === taskId) {
//                                     content = (
//                                       <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
//                                         <InputLabel shrink sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
//                                           {label}
//                                         </InputLabel>
//                                         <Select
//                                           value={currentSelectedId}
//                                           disabled={isclient}
//                                           autoFocus
//                                           onFocus={() => fetchUsers(todo?.caseId?.value?._id)}
//                                           onChange={(e) => {
//                                             const newValue = e.target.value;
//                                             if (newValue !== currentSelectedId) {
//                                               setAssignedUserId(newValue); // update only if value changed
//                                               handleFieldBlur(taskId, key, newValue, false, subtaskId);
//                                             }
//                                             setEditingAssignedUser(null);
//                                             setDropdownOpen(false); // close manually
//                                           }}
//                                           onBlur={() => {
//                                             setDropdownOpen(false); // ensure dropdown closes
//                                             setEditingAssignedUser(null); // revert to normal view
//                                           }}
//                                           // onChange={(e) => {
//                                           //   setAssignedUserId(e.target.value);
//                                           // }}
//                                           // onBlur={(e) => {
//                                           //   const newValue = e.target.value;
//                                           //   handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
//                                           //   setEditingAssignedUser(null);
//                                           // }}
//                                           sx={{
//                                             '& .MuiSelect-select': {
//                                               py: 1.25,
//                                               color: '#333',
//                                             },
//                                             '& .MuiOutlinedInput-notchedOutline': {
//                                               borderColor: 'rgba(0, 0, 0, 0.23)',
//                                             },
//                                             '&:hover .MuiOutlinedInput-notchedOutline': {
//                                               borderColor: '#D4AF37',
//                                             },
//                                             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                               borderColor: '#D4AF37',
//                                               borderWidth: '2px',
//                                             },
//                                           }}
//                                           MenuProps={{
//                                             PaperProps: {
//                                               sx: {
//                                                 bgcolor: 'white',
//                                                 color: '#333',
//                                                 '& .MuiMenuItem-root': {
//                                                   '&:hover': {
//                                                     bgcolor: 'rgba(212, 175, 55, 0.1)',
//                                                   },
//                                                   '&.Mui-selected': {
//                                                     bgcolor: 'rgba(212, 175, 55, 0.2)',
//                                                   },
//                                                 },
//                                               },
//                                             },
//                                           }}
//                                         >
//                                           <MenuItem value="">Assign User</MenuItem>
//                                           {users?.map((user) => (
//                                             <MenuItem key={user.id} value={user.id}>
//                                               {user.UserName} ({capitalizeFirst(user.Role)})
//                                             </MenuItem>
//                                           ))}
//                                         </Select>
//                                       </FormControl>
//                                     );
//                                     // } else {
//                                     //   content = (
//                                     //     <Box
//                                     //       sx={{
//                                     //         display: 'flex',
//                                     //         alignItems: 'center',
//                                     //         px: 1,
//                                     //         py: 0.5,
//                                     //         cursor: !isclient ? 'pointer' : 'default',
//                                     //       }}
//                                     //       onClick={() => !isclient && setEditingAssignedUser(taskId)}
//                                     //     >
//                                     //       <Group sx={{ mr: 1, color: '#D4AF37' }} />
//                                     //       <Typography variant="body2">
//                                     //         {usersList.length > 0
//                                     //           ? usersList.map((u) => u.UserName).join(', ')
//                                     //           : 'Assign User'}
//                                     //       </Typography>
//                                     //     </Box>
//                                     //   );
//                                     // }
//                                   } else if (key === 'createdAt') {
//                                     content = (
//                                       <Box
//                                         sx={{
//                                           display: 'flex',
//                                           alignItems: 'center',
//                                           px: 1,
//                                           py: 0.5,
//                                         }}
//                                       >
//                                         <CalendarToday
//                                           sx={{
//                                             mr: 1,
//                                             fontSize: '1rem',
//                                             color: '#D4AF37',
//                                           }}
//                                         />
//                                         <Typography variant="body2">
//                                           {value ? new Date(value).toLocaleDateString() : 'N/A'}
//                                         </Typography>
//                                       </Box>
//                                     );
//                                   } else if (!editable) {
//                                     content = (
//                                       <Typography variant="body2" sx={{ px: 1, py: 0.5 }}>
//                                         {String(value || 'N/A')}
//                                       </Typography>
//                                     );
//                                   } else if (enumOptions) {
//                                     content = (
//                                       <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
//                                         <InputLabel shrink sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
//                                           {label}
//                                         </InputLabel>
//                                         <Select
//                                           value={value}
//                                           onChange={(e) => {
//                                             handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);
//                                           }}
//                                           onBlur={handleBlur}
//                                           disabled={isclient}
//                                           sx={{
//                                             '& .MuiSelect-select': {
//                                               py: 1.25,
//                                               color: '#333',
//                                             },
//                                             '& .MuiOutlinedInput-notchedOutline': {
//                                               borderColor: 'rgba(0, 0, 0, 0.23)',
//                                             },
//                                             '&:hover .MuiOutlinedInput-notchedOutline': {
//                                               borderColor: '#D4AF37',
//                                             },
//                                             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                               borderColor: '#D4AF37',
//                                               borderWidth: '2px',
//                                             },
//                                           }}
//                                           MenuProps={{
//                                             PaperProps: {
//                                               sx: {
//                                                 bgcolor: 'white',
//                                                 color: '#333',
//                                                 '& .MuiMenuItem-root': {
//                                                   '&:hover': {
//                                                     bgcolor: 'rgba(212, 175, 55, 0.1)',
//                                                   },
//                                                   '&.Mui-selected': {
//                                                     bgcolor: 'rgba(212, 175, 55, 0.2)',
//                                                   },
//                                                 },
//                                               },
//                                             },
//                                           }}
//                                         >
//                                           {enumOptions?.map((option) => (
//                                             <MenuItem key={option} value={option}>
//                                               {option}
//                                             </MenuItem>
//                                           ))}
//                                         </Select>
//                                       </FormControl>
//                                     );
//                                   } else if (normalizedType === 'boolean') {
//                                     content = (
//                                       <Box
//                                         sx={{
//                                           display: 'flex',
//                                           alignItems: 'center',
//                                           justifyContent: 'space-between',
//                                           px: 1,
//                                           py: 0.5,
//                                         }}
//                                       >
//                                         <Typography variant="body2">{label}</Typography>
//                                         <Switch
//                                           checked={Boolean(value)}
//                                           onChange={(e) =>
//                                             handleFieldChange(taskId, key, e.target.checked, isSubtask, subtaskId)
//                                           }
//                                           onBlur={handleBlur}
//                                           disabled={isclient}
//                                           size="small"
//                                           sx={{
//                                             '& .MuiSwitch-switchBase.Mui-checked': {
//                                               color: '#D4AF37',
//                                             },
//                                             '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                                               backgroundColor: '#D4AF37',
//                                             },
//                                           }}
//                                         />
//                                       </Box>
//                                     );
//                                   } else if (normalizedType === 'date') {
//                                     content = (
//                                       <DatePicker
//                                         label={label}
//                                         value={value ? new Date(value) : null}
//                                         onChange={(date) => handleFieldChange(taskId, key, date, isSubtask, subtaskId)}
//                                         format="dd/MM/yyyy"
//                                         disabled={isclient}
//                                         slotProps={{
//                                           textField: {
//                                             size: 'small',
//                                             fullWidth: true,
//                                             sx: {
//                                               mt: 0.5,
//                                               '& .MuiInputBase-input': {
//                                                 color: '#333',
//                                               },
//                                               '& .MuiInputLabel-root': {
//                                                 color: 'rgba(0, 0, 0, 0.6)',
//                                               },
//                                               '& .MuiOutlinedInput-notchedOutline': {
//                                                 borderColor: 'rgba(0, 0, 0, 0.23)',
//                                               },
//                                               '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                 borderColor: '#D4AF37',
//                                               },
//                                               '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                 borderColor: '#D4AF37',
//                                                 borderWidth: '2px',
//                                               },
//                                             },
//                                           },
//                                         }}
//                                       />
//                                     );
//                                   } else {
//                                     content = (
//                                       <TextField
//                                         label={label}
//                                         type="text"
//                                         size="small"
//                                         fullWidth
//                                         value={value || ''}
//                                         onChange={(e) => {
//                                           handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);
//                                         }}
//                                         onBlur={handleBlur}
//                                         disabled={isclient}
//                                         sx={{
//                                           mt: 0.5,
//                                           '& .MuiInputBase-input': {
//                                             color: '#333',
//                                           },
//                                           '& .MuiInputLabel-root': {
//                                             color: 'rgba(0, 0, 0, 0.6)',
//                                           },
//                                           '& .MuiOutlinedInput-notchedOutline': {
//                                             borderColor: 'rgba(0, 0, 0, 0.23)',
//                                           },
//                                           '&:hover .MuiOutlinedInput-notchedOutline': {
//                                             borderColor: '#D4AF37',
//                                           },
//                                           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                             borderColor: '#D4AF37',
//                                             borderWidth: '2px',
//                                           },
//                                         }}
//                                         InputLabelProps={{ shrink: true }}
//                                       />
//                                     );
//                                   }

//                                   return (
//                                     <React.Fragment key={key}>
//                                       <ListItem
//                                         sx={{
//                                           px: 0,
//                                           py: 0.5,
//                                         }}
//                                       >
//                                         <ListItemText primary={content} sx={{ my: 0 }} />
//                                       </ListItem>
//                                       {key !== keys[keys.length - 1] && (
//                                         <Divider
//                                           sx={{
//                                             my: 0.5,
//                                             backgroundColor: 'rgba(0, 0, 0, 0.08)',
//                                           }}
//                                         />
//                                       )}
//                                     </React.Fragment>
//                                   );
//                                 })}
//                               </List>

//                               <Box
//                                 sx={{
//                                   display: 'flex',
//                                   justifyContent: 'flex-end',
//                                   alignItems: 'center',
//                                   mt: 2,
//                                   gap: 1,
//                                 }}
//                               >
//                                 {!isclient && (
//                                   <IconButton
//                                     color="error"
//                                     onClick={() => handleDelete(taskId)}
//                                     sx={{
//                                       border: '1px solid',
//                                       borderColor: 'error.main',
//                                       flexShrink: 0,
//                                       color: 'error.main',
//                                       '&:hover': {
//                                         bgcolor: 'rgba(244, 67, 54, 0.1)',
//                                       },
//                                     }}
//                                   >
//                                     <DeleteIcon fontSize="small" />
//                                   </IconButton>
//                                 )}

//                                 {/* {!isclient && hasSubtasks && (*/}
//                                 <Button
//                                   variant="outlined"
//                                   size="small"
//                                   onClick={() => handleAddEmptySubtask(todo)}
//                                   sx={{
//                                     textTransform: 'none',
//                                     borderColor: '#D4AF37',
//                                     color: '#D4AF37',
//                                     '&:hover': {
//                                       backgroundColor: 'rgba(212, 175, 55, 0.1)',
//                                       borderColor: '#D4AF37',
//                                     },
//                                   }}
//                                   startIcon={<FaPlus fontSize="small" />}
//                                 >
//                                   Add Subtask
//                                 </Button>
//                                 {/* )}*/}

//                                 {/* {hasSubtasks && (*/}
//                                 <Button
//                                   variant="outlined"
//                                   size="small"
//                                   onClick={() => toggleSubtasks(taskId)}
//                                   sx={{
//                                     textTransform: 'none',
//                                     borderColor: '#D4AF37',
//                                     color: '#D4AF37',
//                                     '&:hover': {
//                                       backgroundColor: 'rgba(212, 175, 55, 0.1)',
//                                       borderColor: '#D4AF37',
//                                     },
//                                   }}
//                                   startIcon={
//                                     showSubtasks ? <FaChevronUp fontSize="small" /> : <FaChevronDown fontSize="small" />
//                                   }
//                                 >
//                                   {showSubtasks ? 'Hide' : `View (${todo.subtasks.length})`}
//                                 </Button>
//                                 {/*  )}*/}
//                               </Box>

//                               {showSubtasks && hasSubtasks && (
//                                 <Box
//                                   sx={{
//                                     mt: 2,
//                                     borderTop: '1px solid rgba(0, 0, 0, 0.12)',
//                                     pt: 2,
//                                   }}
//                                 >
//                                   <Typography
//                                     variant="subtitle2"
//                                     sx={{
//                                       color: '#D4AF37',
//                                       display: 'flex',
//                                       alignItems: 'center',
//                                       mb: 1.5,
//                                     }}
//                                   >
//                                     <FaTasks style={{ marginRight: 8 }} />
//                                     Subtasks
//                                   </Typography>

//                                   {todo.subtasks.map((subtask) => (
//                                     <Paper
//                                       key={subtask?._id?.value}
//                                       sx={{
//                                         mb: 2,
//                                         p: 2,
//                                         borderLeft: '2px solid #D4AF37',
//                                         position: 'relative',
//                                         borderRadius: 1,
//                                       }}
//                                     >
//                                       <List sx={{ py: 0 }}>
//                                         {keys?.map((key) => {
//                                           const field = subtask[key];
//                                           if (!field || key === 'subtasks' || key === '_id') return null;

//                                           const { value, type, enum: enumOptions, editable = true } = field;
//                                           const label = formatHeaderLabel(key);
//                                           const normalizedType = type?.toLowerCase();
//                                           const taskId = todo?._id?.value || todo.id;
//                                           const subtaskId = subtask?._id?.value;

//                                           const handleBlur = (e) => {
//                                             const newValue =
//                                               normalizedType === 'boolean' ? e.target.checked : e.target.value;
//                                             handleSubtaskFieldBlur(taskId, key, newValue, subtaskId);
//                                           };

//                                           let content;

//                                           if (key === 'createdBy') {
//                                             content = (
//                                               <Box
//                                                 sx={{
//                                                   display: 'flex',
//                                                   alignItems: 'center',
//                                                   px: 1,
//                                                   py: 0.5,
//                                                 }}
//                                               >
//                                                 <PersonOutline sx={{ mr: 1, color: '#D4AF37' }} />
//                                                 <Typography variant="body2">
//                                                   {subtask.createdBy?.value?.UserName || 'System'}
//                                                 </Typography>
//                                               </Box>
//                                             );
//                                           } else if (key === 'assignedUsers') {
//                                             const usersList = subtask.assignedUsers?.value || [];
//                                             const defaultSelectedId = usersList[0]?.id || '';
//                                             const currentSelectedId = assignedUserId || defaultSelectedId;

//                                             // if (editingAssignedSubtaskId === subtaskId) {
//                                             content = (
//                                               <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
//                                                 <InputLabel shrink sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
//                                                   {label}
//                                                 </InputLabel>
//                                                 <Select
//                                                   value={currentSelectedId}
//                                                   disabled={isclient}
//                                                   autoFocus
//                                                   onFocus={() => fetchUsers(todo?.caseId?.value?._id)}
//                                                   onChange={(e) => {
//                                                     setAssignedUserId(e.target.value);
//                                                   }}
//                                                   onBlur={(e) => {
//                                                     handleSubtaskFieldBlur(taskId, key, [e.target.value], subtaskId);
//                                                     setEditingAssignedSubtaskId(null);
//                                                   }}
//                                                   sx={{
//                                                     '& .MuiSelect-select': {
//                                                       py: 1.25,
//                                                       color: '#333',
//                                                     },
//                                                     '& .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: 'rgba(0, 0, 0, 0.23)',
//                                                     },
//                                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#D4AF37',
//                                                     },
//                                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#D4AF37',
//                                                       borderWidth: '2px',
//                                                     },
//                                                   }}
//                                                   MenuProps={{
//                                                     PaperProps: {
//                                                       sx: {
//                                                         bgcolor: 'white',
//                                                         color: '#333',
//                                                         '& .MuiMenuItem-root': {
//                                                           '&:hover': {
//                                                             bgcolor: 'rgba(212, 175, 55, 0.1)',
//                                                           },
//                                                           '&.Mui-selected': {
//                                                             bgcolor: 'rgba(212, 175, 55, 0.2)',
//                                                           },
//                                                         },
//                                                       },
//                                                     },
//                                                   }}
//                                                 >
//                                                   <MenuItem value="">Assign User</MenuItem>
//                                                   {users?.map((user) => (
//                                                     <MenuItem key={user?.id} value={user?.id}>
//                                                       {user?.UserName} ({capitalizeFirst(user?.Role)})
//                                                     </MenuItem>
//                                                   ))}
//                                                 </Select>
//                                               </FormControl>
//                                             );
//                                             // } else {
//                                             //   content = (
//                                             //     <Box
//                                             //       sx={{
//                                             //         display: 'flex',
//                                             //         alignItems: 'center',
//                                             //         px: 1,
//                                             //         py: 0.5,
//                                             //         cursor: !isclient ? 'pointer' : 'default',
//                                             //       }}
//                                             //       onDoubleClick={() => !isclient && setEditingAssignedSubtaskId(subtaskId)}
//                                             //     >
//                                             //       <Group sx={{ mr: 1, color: '#D4AF37' }} />
//                                             //       <Typography variant="body2">
//                                             //         {usersList.length > 0
//                                             //           ? usersList.map((u) => u.UserName).join(', ')
//                                             //           : 'Assign User'}
//                                             //       </Typography>
//                                             //     </Box>
//                                             //   );
//                                             // }
//                                           } else if (key === 'createdAt') {
//                                             content = (
//                                               <Box
//                                                 sx={{
//                                                   display: 'flex',
//                                                   alignItems: 'center',
//                                                   px: 1,
//                                                   py: 0.5,
//                                                 }}
//                                               >
//                                                 <CalendarToday
//                                                   sx={{
//                                                     mr: 1,
//                                                     fontSize: '1rem',
//                                                     color: '#D4AF37',
//                                                   }}
//                                                 />
//                                                 <Typography variant="body2">
//                                                   {(subtask.createdAt?.value || '').split('T')[0]}
//                                                 </Typography>
//                                               </Box>
//                                             );
//                                           } else if (key === 'caseId') {
//                                             content = (
//                                               <Typography variant="body2" sx={{ px: 1, py: 0.5 }}>
//                                                 {value?.CaseNumber || value?._id || 'N/A'}
//                                               </Typography>
//                                             );
//                                           } else if (enumOptions) {
//                                             content = (
//                                               <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
//                                                 <InputLabel shrink sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
//                                                   {label}
//                                                 </InputLabel>
//                                                 <Select
//                                                   value={value}
//                                                   disabled={isclient}
//                                                   onChange={(e) =>
//                                                     handleSubtaskFieldChange(taskId, key, e.target.value, subtaskId)
//                                                   }
//                                                   onBlur={handleBlur}
//                                                   sx={{
//                                                     '& .MuiSelect-select': {
//                                                       py: 1.25,
//                                                       color: '#333',
//                                                     },
//                                                     '& .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: 'rgba(0, 0, 0, 0.23)',
//                                                     },
//                                                     '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#D4AF37',
//                                                     },
//                                                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                       borderColor: '#D4AF37',
//                                                       borderWidth: '2px',
//                                                     },
//                                                   }}
//                                                   MenuProps={{
//                                                     PaperProps: {
//                                                       sx: {
//                                                         bgcolor: 'white',
//                                                         color: '#333',
//                                                         '& .MuiMenuItem-root': {
//                                                           '&:hover': {
//                                                             bgcolor: 'rgba(212, 175, 55, 0.1)',
//                                                           },
//                                                           '&.Mui-selected': {
//                                                             bgcolor: 'rgba(212, 175, 55, 0.2)',
//                                                           },
//                                                         },
//                                                       },
//                                                     },
//                                                   }}
//                                                 >
//                                                   {enumOptions?.map((option) => (
//                                                     <MenuItem key={option} value={option}>
//                                                       {option}
//                                                     </MenuItem>
//                                                   ))}
//                                                 </Select>
//                                               </FormControl>
//                                             );
//                                           } else if (normalizedType === 'boolean') {
//                                             content = (
//                                               <Box
//                                                 sx={{
//                                                   display: 'flex',
//                                                   alignItems: 'center',
//                                                   justifyContent: 'space-between',
//                                                   px: 1,
//                                                   py: 0.5,
//                                                 }}
//                                               >
//                                                 <Typography variant="body2">{label}</Typography>
//                                                 <Switch
//                                                   checked={Boolean(value)}
//                                                   disabled={isclient}
//                                                   onChange={(e) =>
//                                                     handleSubtaskFieldChange(taskId, key, e.target.checked, subtaskId)
//                                                   }
//                                                   onBlur={handleBlur}
//                                                   size="small"
//                                                   sx={{
//                                                     '& .MuiSwitch-switchBase.Mui-checked': {
//                                                       color: '#D4AF37',
//                                                     },
//                                                     '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
//                                                       backgroundColor: '#D4AF37',
//                                                     },
//                                                   }}
//                                                 />
//                                               </Box>
//                                             );
//                                           } else if (normalizedType === 'date') {
//                                             const today = new Date();
//                                             content = (
//                                               <DatePicker
//                                                 label={label}
//                                                 value={value ? new Date(value) : null}
//                                                 onChange={(date) => {
//                                                   if (date) {
//                                                     handleSubtaskFieldChange(taskId, key, date, subtaskId);
//                                                   }
//                                                 }}
//                                                 onBlur={() => handleSubtaskFieldBlur(taskId, key, value, subtaskId)}
//                                                 minDate={today}
//                                                 disabled={isclient}
//                                                 slotProps={{
//                                                   textField: {
//                                                     size: 'small',
//                                                     fullWidth: true,
//                                                     sx: {
//                                                       mt: 0.5,
//                                                       '& .MuiInputBase-input': {
//                                                         color: '#333',
//                                                       },
//                                                       '& .MuiInputLabel-root': {
//                                                         color: 'rgba(0, 0, 0, 0.6)',
//                                                       },
//                                                       '& .MuiOutlinedInput-notchedOutline': {
//                                                         borderColor: 'rgba(0, 0, 0, 0.23)',
//                                                       },
//                                                       '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                         borderColor: '#D4AF37',
//                                                       },
//                                                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                         borderColor: '#D4AF37',
//                                                         borderWidth: '2px',
//                                                       },
//                                                     },
//                                                   },
//                                                 }}
//                                               />
//                                             );
//                                           } else {
//                                             content = (
//                                               <TextField
//                                                 label={label}
//                                                 type="text"
//                                                 size="small"
//                                                 fullWidth
//                                                 disabled={isclient}
//                                                 value={value || ''}
//                                                 onChange={(e) =>
//                                                   handleSubtaskFieldChange(taskId, key, e.target.value, subtaskId)
//                                                 }
//                                                 onBlur={handleBlur}
//                                                 sx={{
//                                                   mt: 0.5,
//                                                   '& .MuiInputBase-input': {
//                                                     color: '#333',
//                                                   },
//                                                   '& .MuiInputLabel-root': {
//                                                     color: 'rgba(0, 0, 0, 0.6)',
//                                                   },
//                                                   '& .MuiOutlinedInput-notchedOutline': {
//                                                     borderColor: 'rgba(0, 0, 0, 0.23)',
//                                                   },
//                                                   '&:hover .MuiOutlinedInput-notchedOutline': {
//                                                     borderColor: '#D4AF37',
//                                                   },
//                                                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                                                     borderColor: '#D4AF37',
//                                                     borderWidth: '2px',
//                                                   },
//                                                 }}
//                                                 InputLabelProps={{ shrink: true }}
//                                               />
//                                             );
//                                           }

//                                           return (
//                                             <React.Fragment key={key}>
//                                               <ListItem
//                                                 sx={{
//                                                   px: 0,
//                                                   py: 0.5,
//                                                 }}
//                                               >
//                                                 <ListItemText primary={content} sx={{ my: 0 }} />
//                                               </ListItem>
//                                               {key !== keys[keys.length - 1] && (
//                                                 <Divider
//                                                   sx={{
//                                                     my: 0.5,
//                                                     backgroundColor: 'rgba(0, 0, 0, 0.08)',
//                                                   }}
//                                                 />
//                                               )}
//                                             </React.Fragment>
//                                           );
//                                         })}
//                                       </List>

//                                       {!isclient && (
//                                         <IconButton
//                                           size="small"
//                                           onClick={() => handleDelete(subtask?._id?.value)}
//                                           sx={{
//                                             color: 'error.main',
//                                             position: 'absolute',
//                                             top: 8,
//                                             right: 8,
//                                             '&:hover': {
//                                               backgroundColor: 'rgba(244, 67, 54, 0.1)',
//                                             },
//                                           }}
//                                         >
//                                           <DeleteIcon fontSize="small" />
//                                         </IconButton>
//                                       )}
//                                     </Paper>
//                                   ))}
//                                 </Box>
//                               )}
//                             </AccordionDetails>
//                           </Accordion>
//                         </Paper>
//                       );
//                     })}
//                   </List>
//                 </Box>
//               </Box>
//             </div>
//           </LocalizationProvider>
//         ) :
//         (
//           <div className="text-center text-black py-5">
//             No task available.
//           </div>
//         )
//       }
//       {/* Column Add Modal */}
//       <Modal show={addingColumn} onHide={() => setAddingColumn(false)} centered>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
//             Add New Column
//           </Typography>
//           <TextField
//             label="Column Name"
//             fullWidth
//             value={newColumnName}
//             onChange={(e) => setNewColumnName(e.target.value)}
//             sx={{ mb: 2 }}
//           />
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Column Type</InputLabel>
//             <Select value={newColumnType} onChange={(e) => setNewColumnType(e.target.value)} label="Column Type">
//               <MenuItem value="text">Text</MenuItem>
//               <MenuItem value="dropdown">Dropdown</MenuItem>
//               <MenuItem value="checkbox">Checkbox</MenuItem>
//               <MenuItem value="date">Date</MenuItem>
//             </Select>
//           </FormControl>

//           {newColumnType === 'dropdown' && (
//             <TextField
//               label="Options (comma separated)"
//               fullWidth
//               value={newColumnOptions}
//               onChange={(e) => setNewColumnOptions(e.target.value)}
//               sx={{ mb: 2 }}
//             />
//           )}

//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//             <Button onClick={() => setAddingColumn(false)} sx={{ mr: 1, color: 'text.secondary' }}>
//               Cancel
//             </Button>
//             {/* <Button
//               variant="contained"
//               onClick={addColumn}
//               sx={{ bgcolor: "#D4AF37", "&:hover": { bgcolor: "#E6C050" } }}
//             >
//               Add Column
//             </Button>*/}
//           </Box>
//         </Box>
//       </Modal>

//       <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} centered>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             width: 400,
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
//             Add New Task
//           </Typography>
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Assign Case</InputLabel>
//             <Select
//               value={caseInfo ? caseInfo?._id : newAssignedTaskCase}
//               onChange={(e) => {
//                 fetchUsers(e.target.value);
//                 setNewAssignedTaskCase(e.target.value);
//               }}
//               disabled={caseInfo}
//               // error={caseInfo?._id ? "" :isCaseInvalid }
//               label="Assign Case"
//             >
//               <MenuItem value="">Select a Case</MenuItem>
//               {!caseInfo ? allCases
//                 ?.filter((user) => user?.IsActive === true)
//                 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                 .map((user) => (
//                   <MenuItem key={user?._id} value={user?._id}>
//                     {user?.CaseNumber}
//                   </MenuItem>
//                 ))
//                 :
//                 <MenuItem key={caseInfo?._id} value={caseInfo?._id}>
//                   {caseInfo?.CaseNumber}
//                 </MenuItem>
//               }

//             </Select>
//             {/* {isCaseInvalid && (
//               <Typography variant="caption" color="error">
//                 Please select a case.
//               </Typography>
//             )} */}
//           </FormControl>

//           {/* {users?.length > 0 && ( */}
//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Assigned Users</InputLabel>
//             <Select
//               multiple
//               value={assignedUsersForCase || []} // ✅ should be an array
//               onChange={(e) => {
//                 const selectedValues = e.target.value;
//                 setAssignedUsersForCase(selectedValues); // ✅ store multiple users
//                 if (selectedValues.length > 0) {
//                   setIsUserInvalid(false);
//                 }
//               }}
//               label="Assigned Users"
//               renderValue={(selected) =>
//                 users
//                   ?.filter((user) => selected.includes(user.id))
//                   .map((user) => `${user.UserName} (${user.Role})`)
//                   .join(', ')
//               } // ✅ Show names instead of IDs
//             >
//               <MenuItem disabled value="">
//                 Select Assigned Users
//               </MenuItem>
//               {users?.map((user) => (
//                 <MenuItem key={user.id} value={user.id}>
//                   {user.UserName} ({user.Role})
//                 </MenuItem>
//               ))}
//             </Select>

//             {/* {isUserInvalid && (
//               <Typography variant="caption" color="error">
//                 Please select an assigned user.
//               </Typography>
//             )} */}
//           </FormControl>
//           {/* )} */}

//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
//             <Button
//               variant="contained"
//               onClick={() => setShowTaskModal(false)}
//               sx={{ bgcolor: '#D4AF37', '&:hover': { bgcolor: '#E6C050' } }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => {
//                 let valid = true;

//                 if (!newAssignedTaskCase) {
//                   setIsCaseInvalid(true);
//                   valid = false;
//                 }

//                 if (!assignedUsersForCase) {
//                   setIsUserInvalid(true);
//                   valid = false;
//                 }

//                 // if (!valid) return;

//                 handleAddNewTask(newTaskName, newAssignedTaskCase, assignedUsersForCase);
//                 setShowTaskModal(false);
//                 // setNewTaskName('');
//                 // setNewAssignedTaskCase('');
//                 // setAssignedUsersForCase(null);
//                 // setUsers([]);
//                 setIsCaseInvalid(false);
//                 setIsUserInvalid(false);
//                 fetchUsers(caseInfo?._id);

//               }}
//               sx={{ bgcolor: '#D4AF37', '&:hover': { bgcolor: '#E6C050' } }}
//             >
//               Save Task
//             </Button>
//           </Box>
//         </Box>
//       </Modal>

//       <ErrorModal show={showError} handleClose={() => setShowError(false)} message={message} />

//       <ConfirmModal
//         show={showConfirm}
//         title={`Delete Column "${pendingColumn}"`}
//         message={`Are you sure you want to delete column "${pendingColumn}" from all tasks?`}
//         onConfirm={handleConfirmDelete}
//         onCancel={() => setShowConfirm(false)}
//       />

//       <ConfirmModal
//         show={showConfirmModal}
//         title="Delete Task"
//         message={confirmData.message}
//         onConfirm={confirmDeleteTask}
//         onCancel={() => setShowConfirmModal(false)}
//       />

//       <SuccessModal show={showSuccessModal} handleClose={() => setShowSuccessModal(false)} message={successMessage} />
//     </div>
//   );
// }







import './TaskList.css';
import React, { useEffect, useRef, useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import SocketService from '../../../../SocketService';
import ErrorModal from '../../AlertModels/ErrorModal';
import ConfirmModal from '../../AlertModels/ConfirmModal';
import SuccessModal from '../../AlertModels/SuccessModal';
import axios from 'axios';
import { ApiEndPoint } from '../utils/utlis';
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Group from '@mui/icons-material/Group';
import { MdPersonOutline, MdGroup } from 'react-icons/md';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Switch,
  FormControl,
  InputLabel,
  Checkbox,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  useTheme,
  useMediaQuery,
  ListItemButton,
} from '@mui/material';
import { FaPlus, FaChevronDown, FaChevronRight, FaTrash, FaChevronUp, FaTasks } from 'react-icons/fa';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  MoreVert,
  PersonAdd,
  CalendarToday,
  Description,
} from '@mui/icons-material';
import { useAlert } from '../../../../Component/AlertContext';

export default function TaskList({ token }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [todos, setTodos] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [addingSubtaskFor, setAddingSubtaskFor] = useState(null);
  const [newSubtaskName, setNewSubtaskName] = useState('');
  const caseInfo = useSelector((state) => state.screen.Caseinfo);

  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('text');
  const [newColumnOptions, setNewColumnOptions] = useState('');
  const [isSubtask, setIsSubtask] = useState(false);
  const [openTaskId, setOpenTaskId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [assignedUserId, setAssignedUserId] = useState([]);
  const [parentId, setParentId] = useState();
  const [users, setUsers] = useState([]);
  const [allCases, setAllCases] = useState([]);
  const isclient = token?.Role === 'client';
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newAssignedTaskCase, setNewAssignedTaskCase] = useState(caseInfo ? caseInfo?._id : '');
  const [assignedUsersForCase, setAssignedUsersForCase] = useState([]);
  const [editingAssignedUser, setEditingAssignedUser] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [editingAssignedSubtaskId, setEditingAssignedSubtaskId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isCaseInvalid, setIsCaseInvalid] = useState(false);
  const [isUserInvalid, setIsUserInvalid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState('');
  const [openSubtasksId, setOpenSubtasksId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Add these state declarations with your other useState calls
const [tempSelectedUsers, setTempSelectedUsers] = useState({});
const [tempSubtaskSelectedUsers, setTempSubtaskSelectedUsers] = useState({});
const [editingAssignedUserMobile, setEditingAssignedUserMobile] = useState(null);
const [editingAssignedSubtaskIdMobile, setEditingAssignedSubtaskIdMobile] = useState(null);
const [tempSelectedUsersMobile, setTempSelectedUsersMobile] = useState({});
const [tempSubtaskSelectedUsersMobile, setTempSubtaskSelectedUsersMobile] = useState({});
// Add these helper functions before the return statement
const initializeTempUsers = (taskId, selectedUserIds) => {
  setTempSelectedUsers(prev => ({
    ...prev,
    [taskId]: [...selectedUserIds] // Create a copy to avoid reference issues
  }));
};

const initializeTempSubtaskUsers = (subtaskId, selectedUserIds) => {
  setTempSubtaskSelectedUsers(prev => ({
    ...prev,
    [subtaskId]: [...selectedUserIds]
  }));
};

const initializeTempUsersMobile = (taskId, selectedUserIds) => {
  setTempSelectedUsersMobile(prev => ({
    ...prev,
    [taskId]: [...selectedUserIds]
  }));
};

const initializeTempSubtaskUsersMobile = (subtaskId, selectedUserIds) => {
  setTempSubtaskSelectedUsersMobile(prev => ({
    ...prev,
    [subtaskId]: [...selectedUserIds]
  }));
};

const cleanupTempUsers = (taskId) => {
  setTempSelectedUsers(prev => {
    const newState = { ...prev };
    delete newState[taskId];
    return newState;
  });
};

const cleanupTempSubtaskUsers = (subtaskId) => {
  setTempSubtaskSelectedUsers(prev => {
    const newState = { ...prev };
    delete newState[subtaskId];
    return newState;
  });
};

const cleanupTempUsersMobile = (taskId) => {
  setTempSelectedUsersMobile(prev => {
    const newState = { ...prev };
    delete newState[taskId];
    return newState;
  });
};

const cleanupTempSubtaskUsersMobile = (subtaskId) => {
  setTempSubtaskSelectedUsersMobile(prev => {
    const newState = { ...prev };
    delete newState[subtaskId];
    return newState;
  });
};
  const { showDataLoading } = useAlert();

  const toggleSubtasks = (id) => {
    setOpenSubtasksId(openSubtasksId === id ? null : id);
  };

  const dropdownRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setEditingAssignedUser(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setShowSuccessModal(true);
  };

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
    setNewAssignedTaskCase(caseInfo?._id)
    fetchtask();
    fetchUsers(caseInfo?._id);
  }, [caseInfo]);

  useEffect(() => {
    fetchCases();
  }, []);
// Add this custom hook at the top of your component (after the imports)
const useTempUserSelection = (initialUsers = []) => {
  const [tempSelectedUsers, setTempSelectedUsers] = useState(initialUsers);
  
  const updateTempSelection = (userId, checked) => {
    if (checked) {
      setTempSelectedUsers(prev => [...prev, userId]);
    } else {
      setTempSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const resetTempSelection = (newUsers) => {
    setTempSelectedUsers(newUsers);
  };

  return {
    tempSelectedUsers,
    updateTempSelection,
    resetTempSelection,
    setTempSelectedUsers
  };
};
  const handleMenuOpen = (event, todo) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTodo(todo);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTodo(null);
  };

  const fetchUsers = async (taskdetails) => {
    let id = taskdetails?.caseId?.value?._id;
    try {
      const response = await axios.get(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${taskdetails}`);
      const allUsers = response.data.AssignedUsers || [];
      console.log('users= ', allUsers);
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
    try {
      const response = await fetch(
        caseInfo === null
          ? token?.Role === 'admin'
            ? `${ApiEndPoint}getAllTasksWithDetails`
            : `${ApiEndPoint}getTasksByUser/${token?._id}`
          : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}/${token?._id}/${token?.Role}`
      );

      if (!response.ok) {
        throw new Error('Error fetching folders');
      }

      const data = await response.json();
      setTodos(data.todos);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting task.');
      setShowError(true);
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
    try {
      const subtask = {
        caseId: caseId,
        createdBy: token?._id,
        assignedUsers: userid,
      };
      const response = await createSubtaskApi(selectedCaseId, subtask);
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      const previousOpenTaskId = openTaskId;
      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
    } catch (error) {
      setMessage('⚠️ Task not assign please select users or task ');
      setShowError(true);
      console.error('Failed to add subtask:', error);
    }
  };

  const openModal = (Caseinfo) => {
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
    setOpenTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const saveSubtask = (taskId) => {
    if (!newSubtaskName.trim()) return;
    const newSubtask = {
      id: Date.now(),
      task: newSubtaskName,
      status: 'Not Started',
      priority: 'Medium',
    };

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
        if (task?._id?.value !== taskId) return task;

        if (isSubtask && subtaskId) {
          return {
            ...task,
            subtasks: task.subtasks.map((subtask) => {
              if (subtask?._id?.value !== subtaskId) return subtask;
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
        if (task.id !== parentTaskId && task?._id?.value !== parentTaskId) return task;

        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtask?._id?.value !== subtaskId) return subtask;

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
        setMessage('⚠️ Column deletion failed.');
        setShowError(true);
      }
    } catch (error) {
      console.error('❌ Error deleting column:', error);
      setMessage('❌ Failed to delete the column.');
      setShowError(true);
    }
  };

  const createSubtaskApi = async (taskId, subtaskData) => {
    return await axios.post(`${ApiEndPoint}createTask`, subtaskData);
  };

  const handleAddEmptySubtask = async (Taskinfo) => {
    setSelectedCaseId(Taskinfo?.caseId?.value?._id);
    try {
      const subtask = {
        caseId: Taskinfo?.caseId?.value?._id,
        createdBy: token?._id,
        parentId: Taskinfo?._id?.value,
      };
      const response = await createSubtaskApi(selectedCaseId, subtask);
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      const previousOpenTaskId = openTaskId;
      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
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
    try {
      const response = await axios.post(`${ApiEndPoint}updateTaskField`, {
        taskId,
        key,
        value,
      });
      setAssignedUserId([]);
      SocketService.TaskManagement(response);

      fetchtask();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ taskId: null, message: '' });

  const handleDelete = (taskId) => {
    setConfirmData({
      taskId,
      message: 'Are you sure you want to delete this task?',
    });
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    const { taskId } = confirmData;
    setShowConfirmModal(false);

    try {
      const response = await fetch(`${ApiEndPoint}deleteTask/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      SocketService.TaskManagement(response);
      showSuccess('🗑️ Task deleted successfully');
      fetchtask();
    } catch (error) {
      console.error('Error deleting task:', error);
      setMessage('❌ Error deleting task');
      setShowError(true);
    }
  };

  const handleSubtaskFieldBlur = async (taskId, key, value, subtaskId) => {
    taskId = subtaskId;
    try {
      const response = await axios.post(`${ApiEndPoint}updateTaskField`, {
        taskId,
        key,
        value,
      });

      SocketService.TaskManagement(response);
      const previousOpenTaskId = openTaskId;
      await fetchtask();
      setOpenTaskId(previousOpenTaskId);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleToggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  // Helper function to get selected user names for display
  const getSelectedUserNames = (usersList) => {
    if (!usersList || usersList.length === 0) return 'Assign User';
    return usersList.map(u => u.UserName).join(', ');
  };

  return (
    <div
      className="container-fluid card p-1"
      style={{
        overflow: 'hidden',
        maxWidth: 'calc(100vw - 250px)',
        height: '86vh',
        display: 'flex',
        minWidth: '280px',
        flexDirection: 'column',
      }}
    >
      <div className="p-1" style={{ flexShrink: 0 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowTaskModal(true)}
          startIcon={<FaPlus />}
          sx={{
            bgcolor: '#D4AF37',
            '&:hover': {
              bgcolor: '#E6C050',
            },
          }}
        >
          New Task
        </Button>
      </div>
      {todos.length > 0 ?
        (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              <TableContainer component={Paper} className="table-container">
                <Table stickyHeader size="small" aria-label="desktop table view" className="table-main">
                  <TableHead>
                    <TableRow className="table-header-row">
                      <TableCell className="table-pad-header"></TableCell>
                      <TableCell className="sticky-cell header-cell case-id">
                        <Box className="header-box">
                          <Box className="header-label">{formatHeaderLabel('caseId')}</Box>
                        </Box>
                      </TableCell>
                      {keys
                        ?.filter((key) => key !== 'caseId')
                        .map((key, index) => (
                          <TableCell key={key} className={`header-cell ${key}-col`}>
                            <Box className="header-box">
                              <Box className="header-label">{formatHeaderLabel(key)}</Box>
                              {!isclient &&
                                ![
                                  'caseId',
                                  'title',
                                  'description',
                                  'assignedUsers',
                                  'createdBy',
                                  'status',
                                  'dueDate',
                                  'clientEmail',
                                  'nationality',
                                  'nextHearing',
                                ].includes(key) && (
                                  <Box className="icon-box">
                                    {token?.Role === 'admin' && (
                                      <IconButton
                                        size="small"
                                        onClick={() => deleteColumn(key)}
                                        title="Delete column"
                                        className="delete-btn"
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </Box>
                                )}
                            </Box>
                          </TableCell>
                        ))}
                      <TableCell className="add-column-cell">
                        {token?.Role === 'admin' && (
                          <IconButton size="small" onClick={() => setAddingColumn(true)} className="add-column-btn">
                            <FaPlus style={{ color: 'var(--accent-gold)' }} />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {todos?.map((todo, rowIndex) => (
                      <React.Fragment key={todo?._id?.value || todo.id}>
                        <TableRow className="main-row">
                          <TableCell className="table-pad-header">
                            <IconButton
                              size="small"
                              onClick={() => toggleTask(todo?._id?.value || todo.id)}
                              className="expand-icon"
                            >
                              {openTaskId === (todo?._id?.value || todo.id) ? <FaChevronDown /> : <FaChevronRight />}
                            </IconButton>
                          </TableCell>
                          <TableCell className="sticky-cell data-cell case-id">
                            <Typography variant="inherit" noWrap>
                              {todo.caseId?.value?.CaseNumber || ''}
                            </Typography>
                          </TableCell>
                          {keys
                            ?.filter((key) => key !== 'caseId')
                            .map((key) => {
                              let field = todo[key] || { value: '', type: 'string', editable: true };
                              const { value, type, enum: enumOptions, editable = true } = field;
                              const normalizedType = type?.toLowerCase();
                              const taskId = todo?._id?.value || todo.id;
                              const subtaskId = null;
                              const handleBlur = (e) => {
                                const newValue = e.target.textContent;
                                handleFieldBlur(taskId, key, newValue, false, subtaskId);
                              };

                              let content;

                              const isExcluded = ['assignedUsers', 'dueDate', 'caseId'].includes(key);
                              const isEditing =
                                editingField?.taskId === taskId &&
                                editingField?.subtaskId === subtaskId &&
                                editingField?.key === key;

                              if (!isExcluded && editable) {
                                content = isEditing ? (
                                  <textarea
                                    autoFocus
                                    defaultValue={value}
                                    placeholder={`Enter ${formatHeaderLabel(key)}`}
                                    onBlur={(e) => {
                                      const val = e.target.value;
                                      handleFieldBlur(taskId, key, val, false, subtaskId);
                                      setEditingField(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        e.target.blur();
                                      }
                                    }}
                                    onMouseOver={(e) => {
                                      if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.8)';
                                    }}
                                    onMouseOut={(e) => {
                                      if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                                    }}
                                    style={{
                                      width: '100%',
                                      minHeight: '70px',
                                      maxHeight: '200px',
                                      padding: '8px 12px',
                                      fontSize: '0.875rem',
                                      lineHeight: '20px',
                                      backgroundColor: '#fff',
                                      border: '1px solid rgba(212, 175, 55, 0.5)',
                                      borderRadius: '4px',
                                      resize: 'none',
                                      overflowY: 'auto',
                                      outline: 'none',
                                      boxShadow: isEditing ? '0 0 0 2px rgba(212, 175, 55, 0.3)' : 'none',
                                    }}
                                  />
                                ) : (
                                  <div
                                    onClick={() => setEditingField({ taskId, subtaskId, key })}
                                    style={{
                                      width: '100%',
                                      height: '70px',
                                      padding: '8px 0',
                                      lineHeight: '20px',
                                      fontSize: '0.875rem',
                                      whiteSpace: 'pre-wrap',
                                      wordBreak: 'break-word',
                                      cursor: 'pointer',
                                      overflowY: 'auto',
                                    }}
                                  >
                                    {value || (
                                      <span style={{ color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
                                        Enter {formatHeaderLabel(key)}
                                      </span>
                                    )}
                                  </div>
                                );
                              }

                              if (key === 'createdBy') {
                                content = (
                                  <Typography variant="inherit" noWrap>
                                    {todo.createdBy?.value?.UserName || ''}
                                  </Typography>
                                );
                       } else if (key === 'assignedUsers') {
  const usersList = todo?.assignedUsers?.value || [];
  const selectedUserIds = usersList.map(u => u._id) || []; // FIXED: changed u.id to u._id
  
  // Initialize temp state when editing starts
  if (editingAssignedUser === taskId && tempSelectedUsers[taskId] === undefined) {
    setTempSelectedUsers(prev => ({
      ...prev,
      [taskId]: [...selectedUserIds]
    }));
  }

  const currentTempUsers = tempSelectedUsers[taskId] !== undefined 
    ? tempSelectedUsers[taskId] 
    : selectedUserIds;

  if (editingAssignedUser === taskId) {
    content = (
      <Box>
        <FormControl fullWidth size="small">
          <Select
            multiple
            value={currentTempUsers}
            disabled={isclient}
            open={true}
            onOpen={() => {
              fetchUsers(todo?.caseId?.value?._id);
              setTempSelectedUsers(prev => ({
                ...prev,
                [taskId]: [...selectedUserIds]
              }));
            }}
            renderValue={(selected) => {
              const selectedUsers = users.filter(user => selected.includes(user.id));
              return selectedUsers.length > 0 
                ? selectedUsers.map(user => user.UserName).join(', ')
                : 'Assign Users';
            }}
            className="select-field"
            MenuProps={{
              PaperProps: { 
                sx: {
                  backgroundColor: '#fff',
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
            displayEmpty
          >
            {users && users.length > 0 ? (
              users.map((user) => (
                <MenuItem key={user?.id} value={user?.id}>
                  <Checkbox 
                    checked={currentTempUsers.includes(user.id)}
                    onChange={(e) => {
                      const userId = user.id;
                      const isChecked = e.target.checked;
                      
                      setTempSelectedUsers(prev => {
                        const currentUsers = prev[taskId] || [];
                        let newUsers;
                        
                        if (isChecked) {
                          newUsers = [...currentUsers, userId];
                        } else {
                          newUsers = currentUsers.filter(id => id !== userId);
                        }
                        
                        return {
                          ...prev,
                          [taskId]: newUsers
                        };
                      });
                    }}
                    sx={{
                      color: '#D4AF37',
                      '&.Mui-checked': {
                        color: '#D4AF37',
                      },
                    }}
                  />
                  <ListItemText 
                    primary={`${user?.UserName} (${capitalizeFirst(user?.Role)})`}
                    sx={{ ml: 1 }}
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading users...</MenuItem>
            )}
            
            {/* Done Button */}
            <MenuItem 
              sx={{ 
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                }
              }}
              onClick={() => {
                const finalSelectedUsers = tempSelectedUsers[taskId] || selectedUserIds;
                handleFieldBlur(taskId, key, finalSelectedUsers, false, null);
                setEditingAssignedUser(null);
                setTempSelectedUsers(prev => {
                  const newState = { ...prev };
                  delete newState[taskId];
                  return newState;
                });
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 1 }}>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{
                    bgcolor: '#D4AF37',
                    '&:hover': {
                      bgcolor: '#E6C050',
                    },
                  }}
                >
                  Done
                </Button>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  } else {
    const isHovered = hoveredTaskId === taskId;
    content = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          minHeight: '36px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '4px',
          padding: '8px',
          '&:hover': {
            borderColor: '#D4AF37',
          },
        }}
        onMouseEnter={() => setHoveredTaskId(taskId)}
        onMouseLeave={() => setHoveredTaskId(null)}
        onClick={() => {
          if (!isclient) {
            setEditingAssignedUser(taskId);
            setTempSelectedUsers(prev => ({
              ...prev,
              [taskId]: [...selectedUserIds]
            }));
            fetchUsers(todo?.caseId?.value?._id);
          }
        }}
      >
        <Typography variant="inherit" noWrap sx={{ flex: 1 }}>
          {usersList.length > 0 
            ? usersList.map((u) => u.UserName).join(', ')
            : 'Assign Users'
          }
        </Typography>
        <ExpandMore
          sx={{
            color: '#D4AF37',
            opacity: isHovered ? 1 : 0.5,
            transition: 'opacity 0.2s ease',
            fontSize: '20px',
          }}
        />
      </Box>
    );
  }
} else if (key === 'dueDate' || key === 'nextHearing') {
                                content = (
                                  <DatePicker
                                    value={value ? new Date(value) : null}
                                    onChange={(date, e) => {
                                      console.log("onBlur triggered");
                                      handleFieldBlur(taskId, key, date, isSubtask, subtaskId);
                                      handleFieldChange(taskId, key, date, isSubtask, subtaskId)
                                    }}
                                    format="dd/MM/yyyy"
                                    disabled={isclient}
                                    slotProps={{
                                      textField: {
                                        size: "small",
                                        fullWidth: true,
                                        onBlur: (e) => {
                                          console.log("onBlur triggered");
                                          const newValue =
                                            normalizedType === "boolean"
                                              ? e.target.checked
                                              : e.target.value;
                                          handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
                                        },
                                        sx: {
                                          mt: 0.5,
                                          "& .MuiInputBase-input": {
                                            color: "#333",
                                          },
                                          "& .MuiInputLabel-root": {
                                            color: "rgba(0, 0, 0, 0.6)",
                                          },
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(0, 0, 0, 0.23)",
                                          },
                                          "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#D4AF37",
                                          },
                                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#D4AF37",
                                            borderWidth: "2px",
                                          },
                                        },
                                      },
                                    }}
                                  />
                                );
                              }

                              return (
                                <TableCell key={key} className={`data-cell ${key}-col`}>
                                  <Box className="cell-box">{content}</Box>
                                </TableCell>
                              );
                            })}
                          <TableCell className="action-cell">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(todo?._id?.value || todo.id)}
                              disabled={isclient}
                              className="delete-btn"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>

                        {openTaskId === (todo?._id?.value || todo.id) && (
                          <>
                            <TableRow className="subtask-header-row">
                              <TableCell>
                                <Typography></Typography>
                              </TableCell>
                              <TableCell className="sticky-cell case-id subtask-header-cell">
                                <Typography variant="subtitle2" className="subtask-header-text">
                                  🔽 Subtasks
                                </Typography>
                              </TableCell>
                            </TableRow>

                            {todo?.subtasks?.map((subtask) => (
                              <TableRow key={subtask?._id?.value} className="subtask-row">
                                <TableCell className="table-pad-header"></TableCell>
                                <TableCell className="sticky-cell data-cell case-id">
                                  <Typography variant="inherit" noWrap>
                                    {subtask.caseId?.value?.CaseNumber || ''}
                                  </Typography>
                                </TableCell>
                                {keys
                                  ?.filter((k) => k !== 'caseId')
                                  .map((key) => {
                                    let field = subtask[key] || { value: '', type: 'string', editable: true };
                                    const { value, type, enum: enumOptions, editable = true } = field;
                                    const taskId = todo?._id?.value || todo.id;
                                    const subtaskId = subtask?._id?.value;

                                    const isExcluded = ['assignedUsers', 'dueDate', 'caseId'].includes(key);
                                    const isEditing =
                                      editingField?.taskId === taskId &&
                                      editingField?.subtaskId === subtaskId &&
                                      editingField?.key === key;

                                    let content;

                                    if (!isExcluded && editable) {
                                      content = isEditing ? (
                                        <textarea
                                          autoFocus
                                          defaultValue={value}
                                          placeholder={`Enter ${formatHeaderLabel(key)}`}
                                          onBlur={(e) => {
                                            const val = e.target.value;
                                            handleSubtaskFieldBlur(taskId, key, val, subtaskId);
                                            setEditingField(null);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                              e.preventDefault();
                                              e.target.blur();
                                            }
                                          }}
                                          onMouseOver={(e) => {
                                            if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.8)';
                                          }}
                                          onMouseOut={(e) => {
                                            if (isEditing) e.target.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                                          }}
                                          style={{
                                            width: '100%',
                                            minHeight: '70px',
                                            maxHeight: '200px',
                                            padding: '8px 12px',
                                            fontSize: '0.875rem',
                                            lineHeight: '20px',
                                            backgroundColor: '#fff',
                                            border: '1px solid rgba(212, 175, 55, 0.5)',
                                            borderRadius: '4px',
                                            resize: 'none',
                                            overflowY: 'auto',
                                            outline: 'none',
                                            boxShadow: isEditing ? '0 0 0 2px rgba(212, 175, 55, 0.3)' : 'none',
                                          }}
                                        ></textarea>
                                      ) : (
                                        <div
                                          onClick={() => setEditingField({ taskId, subtaskId, key })}
                                          style={{
                                            width: '100%',
                                            height: '70px',
                                            padding: '8px 0',
                                            lineHeight: '20px',
                                            fontSize: '0.875rem',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            cursor: 'pointer',
                                            border: '2px',
                                            overflowY: 'auto',
                                          }}
                                        >
                                          {value || (
                                            <span style={{ color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
                                              Enter {formatHeaderLabel(key)}
                                            </span>
                                          )}
                                        </div>
                                      );
                                    }

                                    if (key === 'createdBy') {
                                      content = (
                                        <Typography variant="inherit" noWrap>
                                          {subtask.createdBy?.value?.UserName || ''}
                                        </Typography>
                                      );
                               } else if (key === 'assignedUsers') {
  const usersList = subtask.assignedUsers?.value || [];
  const selectedUserIds = usersList.map(u => u._id) || [];
  
  // Initialize temp state when editing starts (without useEffect)
  if (editingAssignedSubtaskId === subtaskId && !tempSubtaskSelectedUsers[subtaskId]) {
    setTempSubtaskSelectedUsers(prev => ({
      ...prev,
      [subtaskId]: [...selectedUserIds]
    }));
  }

  if (editingAssignedSubtaskId === subtaskId) {
    const currentTempUsers = tempSubtaskSelectedUsers[subtaskId] || selectedUserIds;
    
    content = (
      <Box>
        <FormControl fullWidth size="small">
          <Select
            multiple
            value={currentTempUsers}
            disabled={isclient}
            open={true}
            onOpen={() => {
              fetchUsers(todo?.caseId?.value?._id);
              // Initialize temp state when opening
              if (!tempSubtaskSelectedUsers[subtaskId]) {
                setTempSubtaskSelectedUsers(prev => ({
                  ...prev,
                  [subtaskId]: [...selectedUserIds]
                }));
              }
            }}
            renderValue={(selected) => {
              const selectedUsers = users.filter(user => selected.includes(user.id));
              return selectedUsers.map(user => user.UserName).join(', ');
            }}
            className="select-field"
            MenuProps={{
              PaperProps: { 
                sx: {
                  backgroundColor: '#fff',
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
            displayEmpty
          >
            {users?.map((user) => (
              <MenuItem key={user?.id} value={user?.id}>
                <Checkbox 
                  checked={currentTempUsers.includes(user.id)}
                  onChange={(e) => {
                    const userId = user.id;
                    const isChecked = e.target.checked;
                    
                    setTempSubtaskSelectedUsers(prev => {
                      const currentUsers = prev[subtaskId] || [];
                      let newUsers;
                      
                      if (isChecked) {
                        newUsers = [...currentUsers, userId];
                      } else {
                        newUsers = currentUsers.filter(id => id !== userId);
                      }
                      
                      return {
                        ...prev,
                        [subtaskId]: newUsers
                      };
                    });
                  }}
                  sx={{
                    color: '#D4AF37',
                    '&.Mui-checked': {
                      color: '#D4AF37',
                    },
                  }}
                />
                <ListItemText 
                  primary={`${user?.UserName} (${capitalizeFirst(user?.Role)})`}
                  sx={{ ml: 1 }}
                />
              </MenuItem>
            ))}
            
            {/* Done Button */}
            <MenuItem 
              sx={{ 
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                }
              }}
              onClick={() => {
                const finalSelectedUsers = tempSubtaskSelectedUsers[subtaskId] || selectedUserIds;
                handleSubtaskFieldBlur(taskId, key, finalSelectedUsers, subtaskId);
                setEditingAssignedSubtaskId(null);
                setTempSubtaskSelectedUsers(prev => {
                  const newState = { ...prev };
                  delete newState[subtaskId];
                  return newState;
                });
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 1 }}>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{
                    bgcolor: '#D4AF37',
                    '&:hover': {
                      bgcolor: '#E6C050',
                    },
                  }}
                >
                  Done
                </Button>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  } else {
    content = (
      <Box
        className="select-box"
        onClick={() => {
          if (!isclient) {
            setEditingAssignedSubtaskId(subtaskId);
            setTempSubtaskSelectedUsers(prev => ({
              ...prev,
              [subtaskId]: [...selectedUserIds]
            }));
          }
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          minHeight: '36px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '4px',
          padding: '8px',
          '&:hover': {
            borderColor: '#D4AF37',
          },
        }}
      >
        <Typography variant="inherit" noWrap sx={{ flex: 1 }}>
          {getSelectedUserNames(usersList)}
        </Typography>
        {!isclient && <ExpandMore className="dropdown-icon" />}
      </Box>
    );
  }
} else if (key === 'dueDate' || key === 'nextHearing') {
                                      content = (
                                        <DatePicker
                                          value={value ? new Date(value) : null}
                                          format="dd/MM/yyyy"
                                          onChange={(date) => {
                                            if (date) {
                                              handleSubtaskFieldChange(
                                                taskId,
                                                key,
                                                date,
                                                subtaskId
                                              );
                                              handleSubtaskFieldBlur(
                                                taskId,
                                                key,
                                                date,
                                                subtaskId
                                              )
                                            }
                                          }}
                                          onBlur={() => handleSubtaskFieldBlur(
                                            taskId,
                                            key,
                                            value,
                                            subtaskId
                                          )}
                                          disabled={isclient}
                                          slotProps={{
                                            textField: {
                                              size: "small",
                                              fullWidth: true,
                                              sx: {
                                                mt: 0.5,
                                                "& .MuiInputBase-input": {
                                                  color: "#333",
                                                },
                                                "& .MuiInputLabel-root": {
                                                  color: "rgba(0, 0, 0, 0.6)",
                                                },
                                                "& .MuiOutlinedInput-notchedOutline":
                                                {
                                                  borderColor: "rgba(0, 0, 0, 0.23)",
                                                },
                                                "&:hover .MuiOutlinedInput-notchedOutline":
                                                {
                                                  borderColor: "#D4AF37",
                                                },
                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                                {
                                                  borderColor: "#D4AF37",
                                                  borderWidth: "2px",
                                                },
                                              },
                                            },
                                          }}
                                        />
                                      );
                                    }

                                    return (
                                      <TableCell key={key} className={`data-cell ${key}-col`}>
                                        <Box className="cell-box">{content}</Box>
                                      </TableCell>
                                    );
                                  })}
                                <TableCell className="action-cell">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(subtask?._id?.value)}
                                    disabled={isclient}
                                    className="delete-btn"
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}

                            {!isclient && (
                              <TableRow className="subtask-header-row">
                                <TableCell>
                                  <Typography />
                                </TableCell>
                                <TableCell className="sticky-cell case-id subtask-header-cell">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleAddEmptySubtask(todo)}
                                    className="add-subtask-btn"
                                  >
                                    + Add Subtask
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Mobile View */}
            <div
              className="d-lg-none h-100"
              style={{
                overflow: 'hidden',
                backgroundColor: '#f5f7fa',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  backgroundColor: '#f5f7fa',
                  color: '#333',
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    p: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <List sx={{ py: 0 }}>
                    {todos?.map((todo) => {
                      const taskId = todo?._id?.value || todo.id;
                      const title = todo.title?.value || 'Untitled Task';
                      const caseNumber = todo.caseId?.value?.CaseNumber || 'N/A';
                      const isExpanded = expandedUserId === taskId;
                      const hasSubtasks = todo.subtasks?.length > 0;
                      const showSubtasks = openSubtasksId === taskId;
                      const status = todo.status?.value || 'No Status';

                      return (
                        <Paper
                          key={taskId}
                          elevation={isExpanded ? 4 : 2}
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            borderLeft: isExpanded ? '4px solid' : 'none',
                            borderColor: '#D4AF37',
                            backgroundColor: 'white',
                            color: '#333',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
                            },
                          }}
                        >
                          <Accordion
                            expanded={isExpanded}
                            onChange={() => handleToggleExpand(taskId)}
                            sx={{
                              '&:before': { display: 'none' },
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
                              aria-controls={`${taskId}-content`}
                              id={`${taskId}-header`}
                              sx={{
                                bgcolor: isExpanded ? 'rgba(212, 175, 55, 0.05)' : 'white',
                                minHeight: '56px !important',
                                '& .MuiAccordionSummary-content': {
                                  alignItems: 'center',
                                  my: 1,
                                },
                                '&:hover': {
                                  bgcolor: isExpanded ? 'rgba(212, 175, 55, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexGrow: 1,
                                  overflow: 'hidden',
                                  gap: 1.5,
                                }}
                              >
                                <Avatar
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    mr: 1.5,
                                    bgcolor: isExpanded ? '#D4AF37' : '#D4AF37',
                                    color: isExpanded ? 'white' : '#333',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {title.charAt(0).toUpperCase()}
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
                                      color: isExpanded ? '#D4AF37' : '#333',
                                    }}
                                  >
                                    {title.length > 5 ? `${title.substring(0, 5)}...` : title}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color={isExpanded ? '#D4AF37' : 'rgba(0, 0, 0, 0.6)'}
                                    sx={{ display: 'block' }}
                                  >
                                    {todo.createdAt?.value ? new Date(todo.createdAt.value).toLocaleDateString() : 'N/A'}
                                  </Typography>
                                </Box>

                                {caseNumber && (
                                  <Chip
                                    label={
                                      <Box
                                        component="span"
                                        sx={{
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          display: 'block',
                                          width: '100%',
                                        }}
                                      >
                                        {`Case #${caseNumber}`}
                                      </Box>
                                    }
                                    size="small"
                                    sx={{
                                      ml: 'auto',
                                      fontSize: '0.7rem',
                                      height: 20,
                                      bgcolor: isExpanded ? '#D4AF37' : '#e0e0e0',
                                      color: isExpanded ? 'white' : '#333',
                                      width: 80,
                                      px: 1,
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
                              <List sx={{ py: 0 }}>
                                {keys?.map((key) => {
                                  const field = todo[key];
                                  if (!field || key === 'subtasks' || key === '_id' || key === 'title' || key === 'caseId')
                                    return null;

                                  const { value, type, enum: enumOptions, editable = true } = field;
                                  const label = formatHeaderLabel(key);
                                  const normalizedType = type?.toLowerCase();
                                  const taskId = todo?._id?.value || todo.id;
                                  const subtaskId = isSubtask ? taskId : null;

                                  const handleBlur = (e) => {
                                    const newValue = normalizedType === 'boolean' ? e.target.checked : e.target.value;
                                    handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
                                  };

                                  let content;

                                  if (key === 'createdBy') {
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
                                        <Typography variant="body2">
                                          {todo.createdBy?.value?.UserName || 'System'}
                                        </Typography>
                                      </Box>
                                    );
                               } else if (key === 'assignedUsers') {
  const usersList = todo?.assignedUsers?.value || [];
 const selectedUserIds = usersList.map(u => u._id) || [];
  const isEditingMobile = editingAssignedUserMobile === taskId;
  
  // Initialize temp state for this task if it doesn't exist
  if (isEditingMobile && !tempSelectedUsersMobile[taskId]) {
    setTempSelectedUsersMobile(prev => ({
      ...prev,
      [taskId]: selectedUserIds
    }));
  }

  if (isEditingMobile) {
    const currentTempUsers = tempSelectedUsersMobile[taskId] || selectedUserIds;
    
    content = (
      <Box>
        <FormControl fullWidth size="small">
          <Select
            multiple
            value={currentTempUsers}
            disabled={isclient}
            open={true}
            onOpen={() => {
              fetchUsers(todo?.caseId?.value?._id);
              // Initialize temp state when opening
              setTempSelectedUsersMobile(prev => ({
                ...prev,
                [taskId]: selectedUserIds
              }));
            }}
            renderValue={(selected) => {
              const selectedUsers = users.filter(user => selected.includes(user.id));
              return selectedUsers.map(user => user.UserName).join(', ');
            }}
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
            }}
            MenuProps={{
              PaperProps: { 
                sx: {
                  backgroundColor: '#fff',
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
            displayEmpty
          >
            {users?.map((user) => (
              <MenuItem key={user?.id} value={user?.id}>
                <Checkbox 
                  checked={currentTempUsers.includes(user.id)}
                  onChange={(e) => {
                    const userId = user.id;
                    const isChecked = e.target.checked;
                    
                    setTempSelectedUsersMobile(prev => {
                      const currentUsers = prev[taskId] || [];
                      let newUsers;
                      
                      if (isChecked) {
                        newUsers = [...currentUsers, userId];
                      } else {
                        newUsers = currentUsers.filter(id => id !== userId);
                      }
                      
                      return {
                        ...prev,
                        [taskId]: newUsers
                      };
                    });
                  }}
                  sx={{
                    color: '#D4AF37',
                    '&.Mui-checked': {
                      color: '#D4AF37',
                    },
                  }}
                />
                <ListItemText 
                  primary={`${user?.UserName} (${capitalizeFirst(user?.Role)})`}
                  sx={{ ml: 1 }}
                />
              </MenuItem>
            ))}
            
            {/* Done Button */}
            <MenuItem 
              sx={{ 
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                }
              }}
              onClick={() => {
                const finalSelectedUsers = tempSelectedUsersMobile[taskId] || selectedUserIds;
                handleFieldBlur(taskId, key, finalSelectedUsers, false, null);
                setEditingAssignedUserMobile(null);
                // Clean up temp state
                setTempSelectedUsersMobile(prev => {
                  const newState = { ...prev };
                  delete newState[taskId];
                  return newState;
                });
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 1 }}>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{
                    bgcolor: '#D4AF37',
                    '&:hover': {
                      bgcolor: '#E6C050',
                    },
                  }}
                >
                  Done
                </Button>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  } else {
    content = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          minHeight: '36px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '4px',
          padding: '8px',
          '&:hover': {
            borderColor: '#D4AF37',
          },
        }}
        onClick={() => !isclient && setEditingAssignedUserMobile(taskId)}
      >
        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
          {usersList.length > 0 
            ? usersList.map((u) => u.UserName).join(', ')
            : 'Assign Users'
          }
        </Typography>
        {!isclient && <ExpandMore sx={{ color: '#D4AF37', fontSize: '20px' }} />}
      </Box>
    );
  }
}else if (normalizedType === 'boolean') {
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
                                        format="dd/MM/yyyy"
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
                                        type="text"
                                        size="small"
                                        fullWidth
                                        value={value || ''}
                                        onChange={(e) => {
                                          handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);
                                        }}
                                        onBlur={handleBlur}
                                        disabled={isclient}
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

                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                  mt: 2,
                                  gap: 1,
                                }}
                              >
                                {!isclient && (
                                  <IconButton
                                    color="error"
                                    onClick={() => handleDelete(taskId)}
                                    sx={{
                                      border: '1px solid',
                                      borderColor: 'error.main',
                                      flexShrink: 0,
                                      color: 'error.main',
                                      '&:hover': {
                                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                )}

                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleAddEmptySubtask(todo)}
                                  sx={{
                                    textTransform: 'none',
                                    borderColor: '#D4AF37',
                                    color: '#D4AF37',
                                    '&:hover': {
                                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                      borderColor: '#D4AF37',
                                    },
                                  }}
                                  startIcon={<FaPlus fontSize="small" />}
                                >
                                  Add Subtask
                                </Button>

                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => toggleSubtasks(taskId)}
                                  sx={{
                                    textTransform: 'none',
                                    borderColor: '#D4AF37',
                                    color: '#D4AF37',
                                    '&:hover': {
                                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                      borderColor: '#D4AF37',
                                    },
                                  }}
                                  startIcon={
                                    showSubtasks ? <FaChevronUp fontSize="small" /> : <FaChevronDown fontSize="small" />
                                  }
                                >
                                  {showSubtasks ? 'Hide' : `View (${todo.subtasks.length})`}
                                </Button>
                              </Box>

                              {showSubtasks && hasSubtasks && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                                    pt: 2,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      color: '#D4AF37',
                                      display: 'flex',
                                      alignItems: 'center',
                                      mb: 1.5,
                                    }}
                                  >
                                    <FaTasks style={{ marginRight: 8 }} />
                                    Subtasks
                                  </Typography>

                                  {todo.subtasks.map((subtask) => (
                                    <Paper
                                      key={subtask?._id?.value}
                                      sx={{
                                        mb: 2,
                                        p: 2,
                                        borderLeft: '2px solid #D4AF37',
                                        position: 'relative',
                                        borderRadius: 1,
                                      }}
                                    >
                                      <List sx={{ py: 0 }}>
                                        {keys?.map((key) => {
                                          const field = subtask[key];
                                          if (!field || key === 'subtasks' || key === '_id') return null;

                                          const { value, type, enum: enumOptions, editable = true } = field;
                                          const label = formatHeaderLabel(key);
                                          const normalizedType = type?.toLowerCase();
                                          const taskId = todo?._id?.value || todo.id;
                                          const subtaskId = subtask?._id?.value;

                                          const handleBlur = (e) => {
                                            const newValue =
                                              normalizedType === 'boolean' ? e.target.checked : e.target.value;
                                            handleSubtaskFieldBlur(taskId, key, newValue, subtaskId);
                                          };

                                          let content;

                                          if (key === 'createdBy') {
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
                                                <Typography variant="body2">
                                                  {subtask.createdBy?.value?.UserName || 'System'}
                                                </Typography>
                                              </Box>
                                            );
                               } else if (key === 'assignedUsers') {
  const usersList = subtask.assignedUsers?.value || [];
  const selectedUserIds = usersList.map(u => u._id) || [];
  const isEditingMobile = editingAssignedSubtaskIdMobile === subtaskId;
  
  // Initialize temp state for this subtask if it doesn't exist
  if (isEditingMobile && !tempSubtaskSelectedUsersMobile[subtaskId]) {
    setTempSubtaskSelectedUsersMobile(prev => ({
      ...prev,
      [subtaskId]: selectedUserIds
    }));
  }

  if (isEditingMobile) {
    const currentTempUsers = tempSubtaskSelectedUsersMobile[subtaskId] || selectedUserIds;
    
    content = (
      <Box>
        <FormControl fullWidth size="small">
          <Select
            multiple
            value={currentTempUsers}
            disabled={isclient}
            open={true}
            onOpen={() => {
              fetchUsers(todo?.caseId?.value?._id);
              // Initialize temp state when opening
              setTempSubtaskSelectedUsersMobile(prev => ({
                ...prev,
                [subtaskId]: selectedUserIds
              }));
            }}
            renderValue={(selected) => {
              const selectedUsers = users.filter(user => selected.includes(user.id));
              return selectedUsers.map(user => user.UserName).join(', ');
            }}
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
            }}
            MenuProps={{
              PaperProps: { 
                sx: {
                  backgroundColor: '#fff',
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
            displayEmpty
          >
            {users?.map((user) => (
              <MenuItem key={user?.id} value={user?.id}>
                <Checkbox 
                  checked={currentTempUsers.includes(user.id)}
                  onChange={(e) => {
                    const userId = user.id;
                    const isChecked = e.target.checked;
                    
                    setTempSubtaskSelectedUsersMobile(prev => {
                      const currentUsers = prev[subtaskId] || [];
                      let newUsers;
                      
                      if (isChecked) {
                        newUsers = [...currentUsers, userId];
                      } else {
                        newUsers = currentUsers.filter(id => id !== userId);
                      }
                      
                      return {
                        ...prev,
                        [subtaskId]: newUsers
                      };
                    });
                  }}
                  sx={{
                    color: '#D4AF37',
                    '&.Mui-checked': {
                      color: '#D4AF37',
                    },
                  }}
                />
                <ListItemText 
                  primary={`${user?.UserName} (${capitalizeFirst(user?.Role)})`}
                  sx={{ ml: 1 }}
                />
              </MenuItem>
            ))}
            
            {/* Done Button */}
            <MenuItem 
              sx={{ 
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                }
              }}
              onClick={() => {
                const finalSelectedUsers = tempSubtaskSelectedUsersMobile[subtaskId] || selectedUserIds;
                handleSubtaskFieldBlur(taskId, key, finalSelectedUsers, subtaskId);
                setEditingAssignedSubtaskIdMobile(null);
                // Clean up temp state
                setTempSubtaskSelectedUsersMobile(prev => {
                  const newState = { ...prev };
                  delete newState[subtaskId];
                  return newState;
                });
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 1 }}>
                <Button 
                  variant="contained" 
                  size="small"
                  sx={{
                    bgcolor: '#D4AF37',
                    '&:hover': {
                      bgcolor: '#E6C050',
                    },
                  }}
                >
                  Done
                </Button>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  } else {
    content = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          width: '100%',
          minHeight: '36px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '4px',
          padding: '8px',
          '&:hover': {
            borderColor: '#D4AF37',
          },
        }}
        onClick={() => !isclient && setEditingAssignedSubtaskIdMobile(subtaskId)}
      >
        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
          {usersList.length > 0 
            ? usersList.map((u) => u.UserName).join(', ')
            : 'Assign Users'
          }
        </Typography>
        {!isclient && <ExpandMore sx={{ color: '#D4AF37', fontSize: '20px' }} />}
      </Box>
    );
  }
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
                                                  {(subtask.createdAt?.value || '').split('T')[0]}
                                                </Typography>
                                              </Box>
                                            );
                                          } else if (key === 'caseId') {
                                            content = (
                                              <Typography variant="body2" sx={{ px: 1, py: 0.5 }}>
                                                {value?.CaseNumber || value?._id || 'N/A'}
                                              </Typography>
                                            );
                                          } else if (enumOptions) {
                                            content = (
                                              <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                                                <InputLabel shrink sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                                                  {label}
                                                </InputLabel>
                                                <Select
                                                  value={value}
                                                  disabled={isclient}
                                                  onChange={(e) =>
                                                    handleSubtaskFieldChange(taskId, key, e.target.value, subtaskId)
                                                  }
                                                  onBlur={handleBlur}
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
                                                  {enumOptions?.map((option) => (
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
                                                  disabled={isclient}
                                                  onChange={(e) =>
                                                    handleSubtaskFieldChange(taskId, key, e.target.checked, subtaskId)
                                                  }
                                                  onBlur={handleBlur}
                                                  size="small"
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
                                            const today = new Date();
                                            content = (
                                              <DatePicker
                                                label={label}
                                                value={value ? new Date(value) : null}
                                                onChange={(date) => {
                                                  if (date) {
                                                    handleSubtaskFieldChange(taskId, key, date, subtaskId);
                                                  }
                                                }}
                                                onBlur={() => handleSubtaskFieldBlur(taskId, key, value, subtaskId)}
                                                minDate={today}
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
                                                type="text"
                                                size="small"
                                                fullWidth
                                                disabled={isclient}
                                                value={value || ''}
                                                onChange={(e) =>
                                                  handleSubtaskFieldChange(taskId, key, e.target.value, subtaskId)
                                                }
                                                onBlur={handleBlur}
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

                                      {!isclient && (
                                        <IconButton
                                          size="small"
                                          onClick={() => handleDelete(subtask?._id?.value)}
                                          sx={{
                                            color: 'error.main',
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            '&:hover': {
                                              backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                            },
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      )}
                                    </Paper>
                                  ))}
                                </Box>
                              )}
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
        ) :
        (
          <div className="text-center text-black py-5">
            No task available.
          </div>
        )
      }

      <Modal show={addingColumn} onHide={() => setAddingColumn(false)} centered>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Add New Column
          </Typography>
          <TextField
            label="Column Name"
            fullWidth
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Column Type</InputLabel>
            <Select value={newColumnType} onChange={(e) => setNewColumnType(e.target.value)} label="Column Type">
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="dropdown">Dropdown</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>

          {newColumnType === 'dropdown' && (
            <TextField
              label="Options (comma separated)"
              fullWidth
              value={newColumnOptions}
              onChange={(e) => setNewColumnOptions(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setAddingColumn(false)} sx={{ mr: 1, color: 'text.secondary' }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} centered>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Add New Task
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assign Case</InputLabel>
            <Select
              value={caseInfo ? caseInfo?._id : newAssignedTaskCase}
              onChange={(e) => {
                fetchUsers(e.target.value);
                setNewAssignedTaskCase(e.target.value);
              }}
              disabled={caseInfo}
              label="Assign Case"
            >
              <MenuItem value="">Select a Case</MenuItem>
              {!caseInfo ? allCases
                ?.filter((user) => user?.IsActive === true)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((user) => (
                  <MenuItem key={user?._id} value={user?._id}>
                    {user?.CaseNumber}
                  </MenuItem>
                ))
                :
                <MenuItem key={caseInfo?._id} value={caseInfo?._id}>
                  {caseInfo?.CaseNumber}
                </MenuItem>
              }
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Assigned Users</InputLabel>
            <Select
              multiple
              value={assignedUsersForCase || []}
              onChange={(e) => {
                const selectedValues = e.target.value;
                setAssignedUsersForCase(selectedValues);
                if (selectedValues.length > 0) {
                  setIsUserInvalid(false);
                }
              }}
              label="Assigned Users"
              renderValue={(selected) =>
                users
                  ?.filter((user) => selected.includes(user.id))
                  .map((user) => `${user.UserName} (${user.Role})`)
                  .join(', ')
              }
            >
              <MenuItem disabled value="">
                Select Assigned Users
              </MenuItem>
              {users?.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  <Checkbox checked={assignedUsersForCase.indexOf(user.id) > -1} />
                  <ListItemText primary={`${user.UserName} (${user.Role})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => setShowTaskModal(false)}
              sx={{ bgcolor: '#D4AF37', '&:hover': { bgcolor: '#E6C050' } }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
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

                handleAddNewTask(newTaskName, newAssignedTaskCase, assignedUsersForCase);
                setShowTaskModal(false);
                setIsCaseInvalid(false);
                setIsUserInvalid(false);
                fetchUsers(caseInfo?._id);
              }}
              sx={{ bgcolor: '#D4AF37', '&:hover': { bgcolor: '#E6C050' } }}
            >
              Save Task
            </Button>
          </Box>
        </Box>
      </Modal>

      <ErrorModal show={showError} handleClose={() => setShowError(false)} message={message} />

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