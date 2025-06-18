import React, { useEffect, useState } from "react";
import {  Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import SocketService from "../../../../SocketService";
import ErrorModal from "../../AlertModels/ErrorModal";
import ConfirmModal from "../../AlertModels/ConfirmModal";
import SuccessModal from "../../AlertModels/SuccessModal";
import axios from "axios";
import { ApiEndPoint } from "../utils/utlis";
import Button from '@mui/material/Button';
import { Grid } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Group from '@mui/icons-material/Group';
import { MdPersonOutline, MdGroup } from 'react-icons/md';




//import { addColumn } from "./yourHelperFile"; // Adjust or define it in this file

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
  useMediaQuery
} from "@mui/material";
import {
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaTrash,
  FaChevronUp,
  FaTasks 
} from "react-icons/fa";
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  MoreVert,
  PersonAdd,
  CalendarToday,
  Description
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";


export default function TaskList({ token }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
  const [assignedUserId, setAssignedUserId] = useState([]);
  const [parentId, setParentId] = useState();
  const [users, setUsers] = useState([]);
  const [allCases, setAllCases] = useState([]);
  const isclient = token?.Role === "client";
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newAssignedTaskCase, setNewAssignedTaskCase] = useState("");
  const [assignedUsersForCase, setAssignedUsersForCase] = useState([]);
  const [editingAssignedUser, setEditingAssignedUser] = useState(null);
  const [hoveredTaskId, setHoveredTaskId] = useState(null);
  const [editingAssignedSubtaskId, setEditingAssignedSubtaskId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isCaseInvalid, setIsCaseInvalid] = useState(false);
  const [isUserInvalid, setIsUserInvalid] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");
  const [openSubtasksId, setOpenSubtasksId] = useState(null);

  const toggleSubtasks = (id) => {
    setOpenSubtasksId(openSubtasksId === id ? null : id);
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
    fetchCases();
  }, []);

  const handleMenuOpen = (event, todo) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTodo(todo);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTodo(null);
  };

  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const fetchUsers = async (taskdetails) => {
    let id = taskdetails?.caseId?.value?._id;
    try {
      const response = await axios.get(
        `${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${taskdetails}`
      );
      const allUsers = response.data.AssignedUsers || [];
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
    try {
      const response = await fetch(
        caseInfo === null
          ? token?.Role === "admin"
            ? `${ApiEndPoint}getAllTasksWithDetails`
            : `${ApiEndPoint}getTasksByUser/${token?._id}`
          : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}`
      );

      if (!response.ok) {
        throw new Error("Error fetching folders");
      }

      const data = await response.json();
      setTodos(data.todos);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting task.");
      setShowError(true);
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
    try {
      const subtask = {
        caseId: caseId,
        createdBy: token._id,
        assignedUsers: [userid],
      };
      const response = await createSubtaskApi(selectedCaseId, subtask);
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      const previousOpenTaskId = openTaskId;
      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
    } catch (error) {
      console.error("Failed to add subtask:", error);
    }
  };

  const openModal = (Caseinfo) => {
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
    setOpenTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const saveSubtask = (taskId) => {
    if (!newSubtaskName.trim()) return;
    const newSubtask = {
      id: Date.now(),
      task: newSubtaskName,
      status: "Not Started",
      priority: "Medium",
    };

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

  const handleFieldChange = (taskId, key, newValue, isSubtask = false, subtaskId = null) => {
    setTodos((prevTodos) =>
      prevTodos.map((task) => {
        if (task._id?.value !== taskId) return task;

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

  const createSubtaskApi = async (taskId, subtaskData) => {
    return await axios.post(`${ApiEndPoint}createTask`, subtaskData);
  };

  const handleAddEmptySubtask = async (Taskinfo) => {
    setSelectedCaseId(Taskinfo?.caseId?.value?._id);
    try {
      const subtask = {
        caseId: Taskinfo?.caseId?.value?._id,
        createdBy: token._id,
        parentId: Taskinfo?._id?.value,
      };
      const response = await createSubtaskApi(selectedCaseId, subtask);
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      const previousOpenTaskId = openTaskId;
      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
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
      console.error("Failed to update task:", error);
    }
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState({ taskId: null, message: "" });

  const handleDelete = (taskId) => {
    setConfirmData({
      taskId,
      message: "Are you sure you want to delete this task?",
    });
    setShowConfirmModal(true);
  };

  const confirmDeleteTask = async () => {
    const { taskId } = confirmData;
    setShowConfirmModal(false);

    try {
      const response = await fetch(`${ApiEndPoint}deleteTask/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      SocketService.TaskManagement(response);
      showSuccess("🗑️ Task deleted successfully");
      fetchtask();
    } catch (error) {
      console.error("Error deleting task:", error);
      setMessage("❌ Error deleting task");
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
      console.error("Failed to update task:", error);
    }
  };

  const handleToggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div
      className="container-fluid card p-1"
      style={{
        overflow: "hidden",
        maxWidth: "calc(100vw - 250px)",
        height: "86vh",
        display: "flex",
        minWidth: "280px",
        flexDirection: "column",
      }}
    >
      <div className="p-1" style={{ flexShrink: 0 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowTaskModal(true)}
          startIcon={<FaPlus />}
          sx={{
            bgcolor: "#D4AF37",
            "&:hover": {
              bgcolor: "#E6C050",
            },
          }}
        >
          New Task
        </Button>
      </div>
<LocalizationProvider dateAdapter={AdapterDateFns}>

<TableContainer
  component={Paper}
  sx={{
    flex: 1,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    overflowY: "auto",
    overflowX: "auto",
    maxHeight: "100%",
    borderRadius: "12px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "rgba(0, 31, 63, 0.5)",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#D4AF37",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#E6C050",
    },
  }}
>
  <Table
    stickyHeader
    size="small"
    aria-label="desktop table view"
    sx={{
      minWidth: "max-content",
      tableLayout: "fixed", // Ensures consistent column widths
      width: "100%",
      "& .MuiTableRow-root": {
        height: "80px",
      },
      "& .MuiTableCell-root": {
        padding: "16px",
        borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
        fontSize: "0.95rem",
      },
    }}
  >
    <TableHead>
      <TableRow
        sx={{
          "& .MuiTableCell-root": {
            backgroundColor: "#001f3f !important",
            color: "#D4AF37 !important",
            borderBottom: "2px solid #D4AF37",
            height: "80px",
            fontSize: "1rem",
            padding: "16px",
          },
        }}
      >
        <TableCell
          sx={{
            width: "50px",
            minWidth: "50px",
            fontWeight: "bold",
            borderTopLeftRadius: "8px",
            position: "sticky",
            left: 0,
            zIndex: 3,
            backgroundColor: "#001f3f !important",
          }}
        ></TableCell>
        <TableCell
          sx={{
            whiteSpace: "nowrap",
            fontWeight: "bold",
            backgroundColor: "#001f3f",
            color: "#D4AF37",
            position: "sticky",
            left: "50px",
            zIndex: 3,
            minWidth: "150px",
            width: "150px",
            borderRight: "2px solid rgba(212, 175, 55, 0.3)",
          }}
        >
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}>
            <Box sx={{ 
              whiteSpace: "nowrap",
              overflow: "visible",
              textOverflow: "clip",
              flex: 1
            }}>
              {formatHeaderLabel("caseId")}
            </Box>
          </Box>
        </TableCell>
        {keys?.filter(key => key !== "caseId").map((key, index) => (
          <TableCell
            key={key}
            sx={{
              whiteSpace: "nowrap",
              fontWeight: "bold",
              backgroundColor: "#001f3f",
              color: "#D4AF37",
              position: "sticky",
              top: 0,
              zIndex: 1,
              ...(index === keys.length - 2 ? {
                borderTopRightRadius: "8px",
              } : {}),
              ...(key === "title" || key === "description" ? {
                minWidth: "250px",
                width: "250px",
              } : {}),
              ...(key === "dueDate" || key === "nextHearing" ? { 
                minWidth: "180px",
                width: "180px",
              } : {}),
              ...(key === "nationality" || key === "clientEmail" ? { 
                minWidth: "200px",
                width: "200px",
              } : {}),
              ...(key === "assignedUsers" || key === "createdBy" || key === "status" ? {
                minWidth: "150px",
                width: "150px",
              } : {}),
            }}
          >
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
            }}>
              <Box sx={{ 
                whiteSpace: "nowrap",
                overflow: "visible",
                textOverflow: "clip",
                flex: 1
              }}>
                {formatHeaderLabel(key)}
              </Box>
              {(!isclient &&
                key !== "caseId" &&
                key !== "title" &&
                key !== "description" &&
                key !== "assignedUsers" &&
                key !== "createdBy" &&
                key !== "status" &&
                key !== "dueDate" &&
                key !== "clientEmail" &&
                key !== "nationality" &&
                key !== "nextHearing") && (
                  <Box sx={{ flexShrink: 0 }}>
                    {token?.Role === "admin" && (
                      <IconButton
                        size="small"
                        onClick={() => deleteColumn(key)}
                        title="Delete column"
                        sx={{ color: "error.main", ml: 1 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}
            </Box>
          </TableCell>
        ))}
        <TableCell
          sx={{
            width: "50px",
            minWidth: "50px",
            fontWeight: "bold",
            borderTopRightRadius: "8px",
            position: "sticky",
            right: 0,
            zIndex: 3,
            backgroundColor: "#001f3f !important",
          }}
        >
          {token?.Role === "admin" && (
            <IconButton
              size="small"
              onClick={() => setAddingColumn(true)}
              sx={{ color: "#D4AF37" }}
            >
              <FaPlus />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {todos?.map((todo, rowIndex) => (
        <React.Fragment key={todo._id?.value || todo.id}>
          <TableRow>
            <TableCell
              sx={{
                borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                position: "sticky",
                left: 0,
                zIndex: 2,
                backgroundColor: "background.paper",
                ...(rowIndex === todos.length - 1 ? {
                  borderBottomLeftRadius: "8px",
                } : {}),
              }}
            >
              <IconButton
                size="small"
                onClick={() => toggleTask(todo._id?.value || todo.id)}
                sx={{ color: "#D4AF37" }}
              >
                {openTaskId === (todo._id?.value || todo.id) ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </IconButton>
            </TableCell>
            <TableCell
              sx={{
                borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                position: "sticky",
                left: "50px",
                zIndex: 2,
                backgroundColor: "background.paper",
                minWidth: "150px",
                width: "150px",
                borderRight: "2px solid rgba(212, 175, 55, 0.3)",
              }}
            >
              <Typography variant="inherit" noWrap>
                {todo.caseId?.value?.CaseNumber || ""}
              </Typography>
            </TableCell>
            {keys?.filter(key => key !== "caseId").map((key, colIndex) => {
              let field = todo[key];
              if (!field) {
                field = { 
                  value: "", 
                  type: "string", 
                  editable: true 
                };
              }
              const { value, type, enum: enumOptions, editable = true } = field;
              let content;
              const normalizedType = type?.toLowerCase();
              const taskId = todo._id?.value || todo.id;
              const subtaskId = isSubtask ? taskId : null;
              const handleBlur = (e) => {
                const newValue = e.target.textContent;
                handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
              };
              if (key === "createdBy") {
                content = (
                  <Typography variant="inherit" noWrap>
                    {todo.createdBy?.value?.UserName || ""}
                  </Typography>
                );
              } else if (key === "assignedUsers") {
                const usersList = todo?.assignedUsers?.value || [];
                const defaultSelectedId = usersList[0]?.id || "";
                const currentSelectedId = assignedUserId || defaultSelectedId;
                if (editingAssignedUser === taskId) {
                  content = (
                    <FormControl fullWidth size="small" sx={{ maxWidth: '100%' }}>
                      <Select
                        value={currentSelectedId}
                        disabled={isclient}
                        autoFocus
                        onFocus={() => fetchUsers(todo?.caseId?.value?._id)}
                        onChange={(e) => {
                          setAssignedUserId(e.target.value);
                        }}
                        onBlur={(e) => {
                          const newValue = e.target.value;
                          handleFieldBlur(
                            taskId,
                            key,
                            newValue,
                            isSubtask,
                            subtaskId
                          );
                          setEditingAssignedUser(null);
                        }}
                        sx={{
                          "& .MuiSelect-select": {
                            py: 1,
                            color: "#676a6e",
                            maxWidth: '100%',
                            fontSize: "0.95rem",
                            border: "1px solid rgba(212, 175, 55, 0.5)",
                            borderRadius: "4px",
                            padding: "8px 24px 8px 12px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                            boxShadow: "0 0 0 2px rgba(212, 175, 55, 0.3)",
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              backgroundColor: "#001f3f",
                              color: "#D4AF37",
                              border: "1px solid #D4AF37",
                              marginTop: "4px",
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                              "& .MuiMenuItem-root": {
                                "&:hover": {
                                  backgroundColor: "rgba(212, 175, 55, 0.1)",
                                },
                                "&.Mui-selected": {
                                  backgroundColor: "rgba(212, 175, 55, 0.2)",
                                },
                              },
                            },
                          },
                        }}
                        IconComponent={(props) => (
                          <ExpandMore
                            {...props}
                            sx={{
                              color: "#D4AF37",
                              right: "8px",
                            }}
                          />
                        )}
                      >
                        <MenuItem value="">Assign User</MenuItem>
                        {users?.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.UserName} ({capitalizeFirst(user.Role)})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                } else {
                  const isHovered = hoveredTaskId === taskId;
                  content = (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "100%",
                        minHeight: "36px",
                        border: "1px solid rgba(212, 175, 55, 0.3)",
                        borderRadius: "4px",
                        padding: "8px",
                        "&:hover": {
                          borderColor: "#D4AF37",
                        },
                      }}
                      onMouseEnter={() => setHoveredTaskId(taskId)}
                      onMouseLeave={() => setHoveredTaskId(null)}
                      onClick={() =>
                        !isclient && setEditingAssignedUser(taskId)
                      }
                    >
                      <Typography variant="inherit" noWrap sx={{ flex: 1 }}>
                        {usersList.length > 0
                          ? usersList.map((u) => u.UserName).join(", ")
                          : "Assign User"}
                      </Typography>
                      <ExpandMore
                        sx={{
                          color: "#D4AF37",
                          opacity: isHovered ? 1 : 0.5,
                          transition: "opacity 0.2s ease",
                          fontSize: "20px",
                        }}
                      />
                    </Box>
                  );
                }
              } else if (key === "createdAt") {
                content = (
                  <Typography variant="inherit" noWrap>
                    {(todo.createdAt?.value || "").split("T")[0]}
                  </Typography>
                );
              } else if (!editable) {
                content = (
                  <Typography variant="inherit" noWrap>
                    {String(value)}
                  </Typography>
                );
              } else if (enumOptions) {
                content = (
                  <Typography 
                    variant="inherit" 
                    noWrap
                    contentEditable={!isclient}
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    sx={{ 
                      minHeight: "24px",
                      outline: "none",
                      "&:empty:before": {
                        content: "'Enter value'",
                        color: "rgba(255, 255, 255, 0.5)",
                      },
                      "&:focus": {
                        borderBottom: "1px solid #D4AF37",
                      }
                    }}
                  >
                    {String(value)}
                  </Typography>
                );
              } else if (normalizedType === "boolean") {
                content = (
                  <Checkbox
                    checked={Boolean(value)}
                    onChange={(e) => {
                      handleFieldChange(
                        taskId,
                        key,
                        e.target.checked,
                        isSubtask,
                        subtaskId
                      );
                    }}
                    onBlur={handleBlur}
                    disabled={isclient}
                    sx={{
                      color: "#D4AF37",
                      "&.Mui-checked": {
                        color: "#D4AF37",
                      },
                    }}
                  />
                );
              } else if (normalizedType === "date") {
                content = (
                  <Typography 
                    variant="inherit" 
                    noWrap
                    contentEditable={!isclient}
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    sx={{ 
                      minHeight: "24px",
                      outline: "none",
                      "&:empty:before": {
                        content: "'Enter date'",
                        color: "rgba(255, 255, 255, 0.5)",
                      },
                      "&:focus": {
                        borderBottom: "1px solid #D4AF37",
                      }
                    }}
                  >
                    {value ? new Date(value).toLocaleDateString() : ""}
                  </Typography>
                );
              } else {
                content = (
                  <Typography 
                    variant="inherit" 
                    noWrap
                    contentEditable={!isclient}
                    suppressContentEditableWarning
                    onBlur={handleBlur}
                    sx={{ 
                      minHeight: "24px",
                      outline: "none",
                      "&:empty:before": {
                        content: "'Enter value'",
                        color: "rgba(255, 255, 255, 0.5)",
                      },
                      "&:focus": {
                        borderBottom: "1px solid #D4AF37",
                      }
                    }}
                  >
                    {String(value)}
                  </Typography>
                );
              }
              return (
                <TableCell
                  key={key}
                  sx={{
                    borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                    position: 'relative',
                    ...(key === "title" || key === "description" ? {
                      minWidth: "250px",
                      width: "250px",
                    } : {}),
                    ...(key === "dueDate" || key === "nextHearing" ? { 
                      minWidth: "180px",
                      width: "180px",
                    } : {}),
                    ...(key === "nationality" || key === "clientEmail" ? { 
                      minWidth: "200px",
                      width: "200px",
                    } : {}),
                    ...(key === "assignedUsers" || key === "createdBy" || key === "status" ? {
                      minWidth: "150px",
                      width: "150px",
                    } : {}),
                  }}
                >
                  <Box sx={{ 
                    width: "100%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    minHeight: "48px"
                  }}>
                    {content}
                  </Box>
                </TableCell>
              );
            })}
            <TableCell
              sx={{
                borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                position: "sticky",
                right: 0,
                zIndex: 2,
                backgroundColor: "background.paper",
                ...(rowIndex === todos.length - 1 ? {
                  borderBottomRightRadius: "8px",
                } : {}),
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleDelete(todo._id?.value || todo.id)}
                disabled={isclient}
                sx={{
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
          {openTaskId === (todo._id?.value || todo.id) && (
            <TableRow>
              <TableCell 
                colSpan={keys.length + 2} 
                sx={{ 
                  border: "none", 
                  p: 0,
                  backgroundColor: "transparent",
                  position: "relative",
                  padding:"40px"
                }}
              >
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    // flex: 1,
                    // position: "sticky",
                    // display: "flex",
                    width: "calc(100vw - 300px)",
                    flexDirection: "column",
                    overflowY: "auto",
                    overflowX: "auto",
                    margin:0,
                    padding:0,
                    maxHeight: "100%",
                    borderRadius: "12px",
                    // marginTop:"-14px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    "&::-webkit-scrollbar": {
                      width: "4px",
                      height: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "rgba(0, 31, 63, 0.5)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#D4AF37",
                      borderRadius: "4px",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "#E6C050",
                    },
                    "& .MuiTableRow-root": {
                      height: "80px",
                    },
                    "& .MuiTableCell-root": {
                      borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                      fontSize: "0.95rem",
                      padding: "10px !important",
                    },
                  }}
                >
                  <Table 
                    size="small" 
                    sx={{ 
                      width: "100%",
                      tableLayout: "fixed", // Ensures consistent column widths
                      backgroundColor: "transparent",
                    }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          height: "80px",
                          "& .MuiTableCell-root": {
                            backgroundColor: "#001f3f !important",
                            color: "#D4AF37 !important",
                            borderBottom: "2px solid #D4AF37",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            padding: "16px",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            width: "50px",
                            minWidth: "50px",
                            maxWidth: "50px",
                            borderLeft: "2px solid rgba(212, 175, 55, 0.3)",
                            backgroundColor: "#001f3f !important",
                            position: "sticky",
                            left: 0,
                            zIndex: 3,
                          }}
                        ></TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: "nowrap",
                            fontWeight: "bold",
                            backgroundColor: "#001f3f",
                            color: "#D4AF37",
                            minWidth: "150px",
                            width: "150px",
                            borderRight: "2px solid rgba(212, 175, 55, 0.3)",
                            position: "sticky",
                            left: "50px",
                            zIndex: 3,
                          }}
                        >
                          {formatHeaderLabel("caseId")}
                        </TableCell>
                        {keys?.filter(key => key !== "caseId").map((key, index) => (
                          <TableCell
                            key={key}
                            sx={{
                              whiteSpace: "nowrap",
                              fontWeight: "bold",
                              backgroundColor: "#001f3f",
                              color: "#D4AF37",
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              ...(key === "title" || key === "description" ? {
                                minWidth: "250px",
                                width: "250px",
                              } : {}),
                              ...(key === "dueDate" || key === "nextHearing" ? { 
                                minWidth: "180px",
                                width: "180px",
                              } : {}),
                              ...(key === "nationality" || key === "clientEmail" ? { 
                                minWidth: "200px",
                                width: "200px",
                              } : {}),
                              ...(key === "assignedUsers" || key === "createdBy" || key === "status" ? {
                                minWidth: "150px",
                                width: "150px",
                              } : {}),
                            }}
                          >
                            {formatHeaderLabel(key)}
                          </TableCell>
                        ))}
                        <TableCell
                          sx={{
                            width: "90px",
                            minWidth: "50px",
                            textAlign: "center",
                            borderRight: "2px solid rgba(212, 175, 55, 0.3)",
                            backgroundColor: "#001f3f !important",
                            position: "sticky",
                            right: 0,
                            zIndex: 3,
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todo?.subtasks?.map((subtask, subRowIndex) => (
                        <TableRow key={subtask._id?.value}>
                          <TableCell
                            sx={{
                              borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                              borderLeft: "2px solid rgba(212, 175, 55, 0.3)",
                              position: "sticky",
                              left: 0,
                              zIndex: 2,
                              backgroundColor: "background.paper",
                              ...(subRowIndex === todo.subtasks.length - 1 ? {
                                borderBottomLeftRadius: "8px",
                              } : {}),
                            }}
                          ></TableCell>
                          <TableCell
                            sx={{
                              borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                              position: "sticky",
                              left: "50px",
                              zIndex: 2,
                              backgroundColor: "background.paper",
                              minWidth: "150px",
                              width: "150px",
                              borderRight: "2px solid rgba(212, 175, 55, 0.3)",
                            }}
                          >
                            <Typography variant="inherit" noWrap>
                              {subtask.caseId?.value?.CaseNumber || ""}
                            </Typography>
                          </TableCell>
                          {keys?.filter(key => key !== "caseId").map((key, colIndex) => {
                            let field = subtask[key];
                            if (!field) {
                              field = { 
                                value: "", 
                                type: "string", 
                                editable: true 
                              };
                            }
                            const {
                              value,
                              type,
                              enum: enumOptions,
                              editable = true,
                            } = field;
                            let content;
                            const taskId = todo._id?.value || todo.id;
                            const subtaskId = subtask._id?.value;
                            const normalizedType = type?.toLowerCase();
                            const handleBlur = (e) => {
                              const newValue = e.target.textContent;
                              handleSubtaskFieldBlur(
                                taskId,
                                key,
                                newValue,
                                subtaskId
                              );
                            };
                            if (key === "createdBy") {
                              content = (
                                <Typography variant="inherit" noWrap>
                                  {subtask.createdBy?.value?.UserName || ""}
                                </Typography>
                              );
                            } else if (key === "assignedUsers") {
                              const usersList = subtask.assignedUsers?.value || [];
                              const defaultSelectedId = usersList[0]?.id || "";
                              const currentSelectedId = assignedUserId || defaultSelectedId;
                              if (editingAssignedSubtaskId === subtaskId) {
                                content = (
                                  <FormControl fullWidth size="small" sx={{ maxWidth: '100%' }}>
                                    <Select
                                      value={currentSelectedId}
                                      disabled={isclient}
                                      autoFocus
                                      onFocus={() =>
                                        fetchUsers(todo?.caseId?.value?._id)
                                      }
                                      onChange={(e) => {
                                        setAssignedUserId(e.target.value);
                                      }}
                                      onBlur={(e) => {
                                        handleSubtaskFieldBlur(
                                          taskId,
                                          key,
                                          [e.target.value],
                                          subtaskId
                                        );
                                        setEditingAssignedSubtaskId(null);
                                      }}
                                      sx={{
                                        "& .MuiSelect-select": {
                                          py: 1,
                                          color: "#676a6e",
                                          maxWidth: '100%',
                                          fontSize: "0.95rem",
                                          border: "1px solid rgba(212, 175, 55, 0.5)",
                                          borderRadius: "4px",
                                          padding: "8px 24px 8px 12px",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                          border: "none",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                          border: "none",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                          border: "none",
                                          boxShadow: "0 0 0 2px rgba(212, 175, 55, 0.3)",
                                        },
                                      }}
                                      MenuProps={{
                                        PaperProps: {
                                          sx: {
                                            backgroundColor: "#001f3f",
                                            color: "#D4AF37",
                                            border: "1px solid #D4AF37",
                                            marginTop: "4px",
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                                            "& .MuiMenuItem-root": {
                                              "&:hover": {
                                                backgroundColor: "rgba(212, 175, 55, 0.1)",
                                              },
                                              "&.Mui-selected": {
                                                backgroundColor: "rgba(212, 175, 55, 0.2)",
                                              },
                                            },
                                          },
                                        },
                                      }}
                                      IconComponent={(props) => (
                                        <ExpandMore
                                          {...props}
                                          sx={{
                                            color: "#D4AF37",
                                            right: "8px",
                                          }}
                                        />
                                      )}
                                    >
                                      <MenuItem value="">Assign User</MenuItem>
                                      {users?.map((user) => (
                                        <MenuItem key={user?.id} value={user?.id}>
                                          {user?.UserName} ({capitalizeFirst(user?.Role)})
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                );
                              } else {
                                content = (
                                  <Box
                                    onDoubleClick={() =>
                                      !isclient &&
                                      setEditingAssignedSubtaskId(subtaskId)
                                    }
                                    sx={{
                                      cursor: !isclient ? "pointer" : "default",
                                      width: "100%",
                                      display: "flex",
                                      alignItems: "center",
                                      height: "100%",
                                      minHeight: "36px",
                                      border: "1px solid rgba(212, 175, 55, 0.3)",
                                      borderRadius: "4px",
                                      padding: "8px",
                                      "&:hover": {
                                        borderColor: "#D4AF37",
                                      },
                                    }}
                                  >
                                    <Typography variant="inherit" noWrap sx={{ flex: 1 }}>
                                      {usersList.length > 0
                                        ? usersList.map((u) => u.UserName).join(", ")
                                        : "Assign User"}
                                    </Typography>
                                    {!isclient && (
                                      <ExpandMore
                                        sx={{
                                          color: "#D4AF37",
                                          opacity: 0.5,
                                          fontSize: "20px",
                                        }}
                                      />
                                    )}
                                  </Box>
                                );
                              }
                            } else if (key === "createdAt") {
                              content = (
                                <Typography variant="inherit" noWrap>
                                  {(subtask.createdAt?.value || "").split("T")[0]}
                                </Typography>
                              );
                            } else if (!editable) {
                              content = (
                                <Typography variant="inherit" noWrap>
                                  {String(value)}
                                </Typography>
                              );
                            } else if (enumOptions) {
                              content = (
                                <Box
                                  contentEditable={!isclient}
                                  suppressContentEditableWarning
                                  onBlur={handleBlur}
                                  sx={{
                                    width: "100%",
                                    outline: "none",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    minHeight: "24px",
                                    "&:empty:before": {
                                      content: "'Enter value'",
                                      color: "rgba(255, 255, 255, 0.5)",
                                    },
                                    "&:focus": {
                                      borderBottom: "1px solid #D4AF37",
                                    }
                                  }}
                                >
                                  {String(value)}
                                </Box>
                              );
                            } else if (normalizedType === "boolean") {
                              content = (
                                <Checkbox
                                  checked={Boolean(value)}
                                  disabled={isclient}
                                  onChange={(e) =>
                                    handleSubtaskFieldChange(
                                      taskId,
                                      key,
                                      e.target.checked,
                                      subtaskId
                                    )
                                  }
                                  onBlur={handleBlur}
                                  sx={{
                                    color: "#D4AF37",
                                    "&.Mui-checked": {
                                      color: "#D4AF37",
                                    },
                                  }}
                                />
                              );
                            } else if (normalizedType === "date") {
                              content = (
                                <Box
                                  contentEditable={!isclient}
                                  suppressContentEditableWarning
                                  onBlur={handleBlur}
                                  sx={{
                                    width: "100%",
                                    outline: "none",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    minHeight: "24px",
                                    "&:empty:before": {
                                      content: "'Enter date'",
                                      color: "rgba(255, 255, 255, 0.5)",
                                    },
                                    "&:focus": {
                                      borderBottom: "1px solid #D4AF37",
                                    }
                                  }}
                                >
                                  {value ? new Date(value).toLocaleDateString() : ""}
                                </Box>
                              );
                            } else {
                              content = (
                                <Box
                                  contentEditable={!isclient}
                                  suppressContentEditableWarning
                                  onBlur={handleBlur}
                                  sx={{
                                    width: "100%",
                                    outline: "none",
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    minHeight: "24px",
                                    "&:empty:before": {
                                      content: "'Enter value'",
                                      color: "rgba(255, 255, 255, 0.5)",
                                    },
                                    "&:focus": {
                                      borderBottom: "1px solid #D4AF37",
                                    }
                                  }}
                                >
                                  {String(value)}
                                </Box>
                              );
                            }
                            return (
                              <TableCell
                                key={key}
                                sx={{
                                  borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                                  position: 'relative',
                                  ...(key === "title" || key === "description" ? {
                                    minWidth: "250px",
                                    width: "250px",
                                  } : {}),
                                  ...(key === "dueDate" || key === "nextHearing" ? { 
                                    minWidth: "180px",
                                    width: "180px",
                                  } : {}),
                                  ...(key === "nationality" || key === "clientEmail" ? { 
                                    minWidth: "200px",
                                    width: "200px",
                                  } : {}),
                                  ...(key === "assignedUsers" || key === "createdBy" || key === "status" ? {
                                    minWidth: "150px",
                                    width: "150px",
                                  } : {}),
                                }}
                              >
                                <Box sx={{ 
                                  width: "100%",
                                  overflow: "hidden",
                                  display: "flex",
                                  alignItems: "center",
                                  height: "100%",
                                  minHeight: "48px"
                                }}>
                                  {content}
                                </Box>
                              </TableCell>
                            );
                          })}
                          <TableCell
                            sx={{
                              borderBottom: "2px solid rgba(212, 175, 55, 0.3)",
                              borderRight: "2px solid rgba(212, 175, 55, 0.3)",
                              position: "sticky",
                              right: 0,
                              zIndex: 2,
                              backgroundColor: "background.paper",
                              ...(subRowIndex === todo.subtasks.length - 1 ? {
                                borderBottomRightRadius: "8px",
                              } : {}),
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(subtask._id?.value)}
                              disabled={isclient}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!isclient && (
                        <TableRow>
                          <TableCell
                            colSpan={keys.length + 2}
                            sx={{ 
                              border: "none", 
                              pt: 1,
                              borderLeft: "2px solid rgba(212, 175, 55, 0.3)",
                              borderRight: "2px solid rgba(212, 175, 55, 0.3)",
                              borderBottomLeftRadius: "8px",
                              borderBottomRightRadius: "8px",
                              position: "sticky",
                              left: 0,
                              right: 0,
                              backgroundColor: "background.paper",
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleAddEmptySubtask(todo)}
                              sx={{
                                borderColor: "#D4AF37",
                                color: "#D4AF37",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                borderRadius: "6px",
                                padding: "4px 10px",
                                "&:hover": {
                                  backgroundColor: "#fff8e1",
                                  borderColor: "#D4AF37",
                                  color: "#C29D29",
                                },
                              }}
                            >
                              + Add Subtask
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>




{/* Mobile View */}
<Box
  sx={{
    display: {  lg: "none" },
    height: "calc(86vh - 48px)",
    backgroundColor: "#f5f7fa",
    overflow: "auto",
    color: "#333",
     minWidth: "calc(100vw - 300px)",
    
  }}
>
  <Box
    sx={{
      // height: "100%",
      // display: "flex",
  
      flexDirection: "column",
      overflow: "hidden",
    }}
  >
    {/* Scrollable content for mobile */}
    <Box
      sx={{
        flexGrow: 1,
        minWidth: "calc(100vw - 300px)",
        // overflow: "auto",
        p: 1,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "3px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "rgba(0, 0, 0, 0.05)",
        },
      }}
    >
      <List sx={{ py: 0 }}>
        {todos?.map((todo) => {
          const taskId = todo._id?.value || todo.id;
          const title = todo.title?.value || "Untitled Task";
          const caseNumber = todo.caseId?.value?.CaseNumber || "N/A";
          const isExpanded = expandedUserId === taskId;
          const hasSubtasks = todo.subtasks?.length > 0;
          const showSubtasks = openSubtasksId === taskId;
          const status = todo.status?.value || "No Status";

          return (
            <Paper
              key={taskId}
              elevation={isExpanded ? 4 : 2}
              sx={{
                 width: '100%', 
                mb: 1,
                overflow: "hidden",
                borderRadius: 2,
                transition: "all 0.2s ease",
                borderLeft: isExpanded ? "4px solid" : "none",
                borderColor: "#D4AF37",
                backgroundColor: "white",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(212, 175, 55, 0.1)",
                },
              }}
            >
              <Accordion
                expanded={isExpanded}
                onChange={() => handleToggleExpand(taskId)}
                sx={{
                  "&:before": { display: "none" },
                  backgroundColor: "transparent",
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: isExpanded ? "#D4AF37" : "rgba(0, 0, 0, 0.54)",
                      }}
                    />
                  }
                  aria-controls={`${taskId}-content`}
                  id={`${taskId}-header`}
                  sx={{
                    bgcolor: isExpanded ? "rgba(212, 175, 55, 0.05)" : "white",
                    minHeight: "56px !important",
                   "& .MuiAccordionSummary-content": {
  alignItems: "center",
  margin: 0,
  py: 1, // Use consistent vertical padding instead of `my`
},
                    "&:hover": {
                      bgcolor: isExpanded
                        ? "rgba(212, 175, 55, 0.08)"
                        : "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 1,
                      overflow: "hidden",
                      gap: 1.5,
                    }}
                  >
                   <Avatar
  sx={{
    width: 32,
    height: 32,
    bgcolor: "#D4AF37",
    color: "white",
    fontSize: "0.875rem",
    fontWeight: "bold",
    flexShrink: 0,        // Prevents shrinking
    alignSelf: "center",  // Ensures vertical alignment in flex
  }}
>
  {title.charAt(0).toUpperCase()}
</Avatar>

                     

                    <Box
                      sx={{
                        minWidth: "50px",
                        mr: 0,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "medium",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: isExpanded ? "#D4AF37" : "#333",
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={isExpanded ? "#D4AF37" : "rgba(0, 0, 0, 0.6)"}
                        sx={{ display: "block" }}
                      >
                        {todo.createdAt?.value
                          ? new Date(todo.createdAt.value).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </Box>

                    {caseNumber && (
                      <Chip
                        label={`Case #${caseNumber}`}
                        size="small"
                        sx={{
                          ml: "auto",
                          fontSize: "0.7rem",
                          height: 20,
                          bgcolor: isExpanded ? "#D4AF37" : "#e0e0e0",
                          color: isExpanded ? "white" : "#333",
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
                    bgcolor: "white",
                  }}
                >
                  <List sx={{ py: 0 }}>
                    {keys?.map((key) => {
                      const field = todo[key];
                      if (!field || key === 'subtasks' || key === '_id' || key === 'title' || key === 'caseId') return null;
                      
                      const { value, type, enum: enumOptions, editable = true } = field;
                      const label = formatHeaderLabel(key);
                      const normalizedType = type?.toLowerCase();
                      const taskId = todo._id?.value || todo.id;
                      const subtaskId = isSubtask ? taskId : null;

                      const handleBlur = (e) => {
                        const newValue =
                          normalizedType === "boolean"
                            ? e.target.checked
                            : e.target.value;
                        handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
                      };

                      let content;
                      
                      if (key === "createdBy") {
                        content = (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              px: 1,
                              py: 0.5,
                            }}
                          >
                            <PersonOutline sx={{ mr: 1, color: "#D4AF37" }} />
                            <Typography variant="body2">
                              {todo.createdBy?.value?.UserName || "System"}
                            </Typography>
                          </Box>
                        );
                      } else if (key === "assignedUsers") {
                        const usersList = todo?.assignedUsers?.value || [];
                        const defaultSelectedId = usersList[0]?.id || "";
                        const currentSelectedId = assignedUserId || defaultSelectedId;

                        if (editingAssignedUser === taskId) {
                          content = (
                            <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                              <InputLabel shrink sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                {label}
                              </InputLabel>
                              <Select
                                value={currentSelectedId}
                                disabled={isclient}
                                autoFocus
                                onFocus={() => fetchUsers(todo?.caseId?.value?._id)}
                                onChange={(e) => {
                                  setAssignedUserId(e.target.value);
                                }}
                                onBlur={(e) => {
                                  const newValue = e.target.value;
                                  handleFieldBlur(
                                    taskId,
                                    key,
                                    newValue,
                                    isSubtask,
                                    subtaskId
                                  );
                                  setEditingAssignedUser(null);
                                }}
                                sx={{
                                  "& .MuiSelect-select": {
                                    py: 1.25,
                                    color: "#333",
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
                                }}
                                MenuProps={{
                                  PaperProps: {
                                    sx: {
                                      bgcolor: "white",
                                      color: "#333",
                                      "& .MuiMenuItem-root": {
                                        "&:hover": {
                                          bgcolor: "rgba(212, 175, 55, 0.1)",
                                        },
                                        "&.Mui-selected": {
                                          bgcolor: "rgba(212, 175, 55, 0.2)",
                                        },
                                      },
                                    },
                                  },
                                }}
                              >
                                <MenuItem value="">Assign User</MenuItem>
                                {users?.map((user) => (
                                  <MenuItem key={user.id} value={user.id}>
                                    {user.UserName} ({capitalizeFirst(user.Role)})
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          );
                        } else {
                          content = (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                px: 1,
                                py: 0.5,
                                cursor: !isclient ? "pointer" : "default",
                              }}
                              onClick={() => !isclient && setEditingAssignedUser(taskId)}
                            >
                              <Group sx={{ mr: 1, color: "#D4AF37" }} />
                              <Typography variant="body2">
                                {usersList.length > 0
                                  ? usersList.map((u) => u.UserName).join(", ")
                                  : "Assign User"}
                              </Typography>
                            </Box>
                          );
                        }
                      } else if (key === "createdAt") {
                        content = (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              px: 1,
                              py: 0.5,
                            }}
                          >
                            <CalendarToday
                              sx={{
                                mr: 1,
                                fontSize: "1rem",
                                color: "#D4AF37",
                              }}
                            />
                            <Typography variant="body2">
                              {value
                                ? new Date(value).toLocaleDateString()
                                : "N/A"}
                            </Typography>
                          </Box>
                        );
                      } else if (!editable) {
                        content = (
                          <Typography
                            variant="body2"
                            sx={{ px: 1, py: 0.5 }}
                          >
                            {String(value || "N/A")}
                          </Typography>
                        );
                      } else if (enumOptions) {
                        content = (
                          <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                            <InputLabel shrink sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                              {label}
                            </InputLabel>
                            <Select
                              value={value}
                              onChange={(e) => {
                                handleFieldChange(
                                  taskId,
                                  key,
                                  e.target.value,
                                  isSubtask,
                                  subtaskId
                                );
                              }}
                              onBlur={handleBlur}
                              disabled={isclient}
                              sx={{
                                "& .MuiSelect-select": {
                                  py: 1.25,
                                  color: "#333",
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
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    bgcolor: "white",
                                    color: "#333",
                                    "& .MuiMenuItem-root": {
                                      "&:hover": {
                                        bgcolor: "rgba(212, 175, 55, 0.1)",
                                      },
                                      "&.Mui-selected": {
                                        bgcolor: "rgba(212, 175, 55, 0.2)",
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
                      } else if (normalizedType === "boolean") {
                        content = (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: 1,
                              py: 0.5,
                            }}
                          >
                            <Typography variant="body2">
                              {label}
                            </Typography>
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
                              size="small"
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#D4AF37",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: "#D4AF37",
                                  },
                              }}
                            />
                          </Box>
                        );
                      } else if (normalizedType === "date") {
                        content = (
                          <DatePicker
                            label={label}
                            value={value ? new Date(value) : null}
                            onChange={(date) =>
                              handleFieldChange(taskId, key, date, isSubtask, subtaskId)
                            }
                            format="dd/MM/yyyy"
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
                      } else {
                        content = (
                          <TextField
                            label={label}
                            type="text"
                            size="small"
                            fullWidth
                            value={value || ""}
                            onChange={(e) => {
                              handleFieldChange(
                                taskId,
                                key,
                                e.target.value,
                                isSubtask,
                                subtaskId
                              );
                            }}
                            onBlur={handleBlur}
                            disabled={isclient}
                            sx={{
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
                            <ListItemText
                              primary={content}
                              sx={{ my: 0 }}
                            />
                          </ListItem>
                          {key !== keys[keys.length - 1] && (
                            <Divider
                              sx={{
                                my: 0.5,
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                              }}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </List>

                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    mt: 2,
                    gap: 1
                  }}>
                    {!isclient && (
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(taskId)}
                        sx={{
                          border: "1px solid",
                          borderColor: "error.main",
                          flexShrink: 0,
                          color: "error.main",
                          "&:hover": {
                            bgcolor: "rgba(244, 67, 54, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    
                   {/* {!isclient && hasSubtasks && (*/}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleAddEmptySubtask(todo)}
                        sx={{
                          textTransform: "none",
                          borderColor: "#D4AF37",
                          color: "#D4AF37",
                          "&:hover": {
                            backgroundColor: "rgba(212, 175, 55, 0.1)",
                            borderColor: "#D4AF37",
                          },
                        }}
                        startIcon={<FaPlus fontSize="small" />}
                      >
                        Add Subtask
                      </Button>
                   {/* )}*/}
                    
                   {/* {hasSubtasks && (*/}
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => toggleSubtasks(taskId)}
                        sx={{
                          textTransform: "none",
                          borderColor: "#D4AF37",
                          color: "#D4AF37",
                          "&:hover": {
                            backgroundColor: "rgba(212, 175, 55, 0.1)",
                            borderColor: "#D4AF37",
                          },
                        }}
                        startIcon={
                          showSubtasks ? (
                            <FaChevronUp fontSize="small" />
                          ) : (
                            <FaChevronDown fontSize="small" />
                          )
                        }
                      >
                        {showSubtasks ? "Hide" : `View (${todo.subtasks.length})`}
                      </Button>
                   {/*  )}*/}
                  </Box>

                  {showSubtasks && hasSubtasks && (
                    <Box sx={{ 
                      mt: 2,
                      borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                      pt: 2
                    }}>
                      <Typography variant="subtitle2" sx={{ 
                        color: "#D4AF37",
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5
                      }}>
                        <FaTasks style={{ marginRight: 8 }} />
                        Subtasks
                      </Typography>
                      
                      {todo.subtasks.map((subtask) => (
                        <Paper
                          key={subtask._id?.value}
                          sx={{
                            mb: 2,
                            p: 2,
                            borderLeft: "2px solid #D4AF37",
                            position: 'relative',
                            borderRadius: 1
                          }}
                        >
                          <List sx={{ py: 0 }}>
                            {keys?.map((key) => {
                              const field = subtask[key];
                              if (!field || key === 'subtasks' || key === '_id') return null;
                              
                              const { value, type, enum: enumOptions, editable = true } = field;
                              const label = formatHeaderLabel(key);
                              const normalizedType = type?.toLowerCase();
                              const taskId = todo._id?.value || todo.id;
                              const subtaskId = subtask._id?.value;

                              const handleBlur = (e) => {
                                const newValue =
                                  normalizedType === "boolean"
                                    ? e.target.checked
                                    : e.target.value;
                                handleSubtaskFieldBlur(
                                  taskId,
                                  key,
                                  newValue,
                                  subtaskId
                                );
                              };

                              let content;
                              
                              if (key === "createdBy") {
                                content = (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      px: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <PersonOutline sx={{ mr: 1, color: "#D4AF37" }} />
                                    <Typography variant="body2">
                                      {subtask.createdBy?.value?.UserName || "System"}
                                    </Typography>
                                  </Box>
                                );
                              } else if (key === "assignedUsers") {
                                const usersList = subtask.assignedUsers?.value || [];
                                const defaultSelectedId = usersList[0]?.id || "";
                                const currentSelectedId = assignedUserId || defaultSelectedId;

                                if (editingAssignedSubtaskId === subtaskId) {
                                  content = (
                                    <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                                      <InputLabel shrink sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                        {label}
                                      </InputLabel>
                                      <Select
                                        value={currentSelectedId}
                                        disabled={isclient}
                                        autoFocus
                                        onFocus={() =>
                                          fetchUsers(todo?.caseId?.value?._id)
                                        }
                                        onChange={(e) => {
                                          setAssignedUserId(e.target.value);
                                        }}
                                        onBlur={(e) => {
                                          handleSubtaskFieldBlur(
                                            taskId,
                                            key,
                                            [e.target.value],
                                            subtaskId
                                          );
                                          setEditingAssignedSubtaskId(null);
                                        }}
                                        sx={{
                                          "& .MuiSelect-select": {
                                            py: 1.25,
                                            color: "#333",
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
                                        }}
                                        MenuProps={{
                                          PaperProps: {
                                            sx: {
                                              bgcolor: "white",
                                              color: "#333",
                                              "& .MuiMenuItem-root": {
                                                "&:hover": {
                                                  bgcolor: "rgba(212, 175, 55, 0.1)",
                                                },
                                                "&.Mui-selected": {
                                                  bgcolor: "rgba(212, 175, 55, 0.2)",
                                                },
                                              },
                                            },
                                          },
                                        }}
                                      >
                                        <MenuItem value="">Assign User</MenuItem>
                                        {users?.map((user) => (
                                          <MenuItem key={user?.id} value={user?.id}>
                                            {user?.UserName} ({capitalizeFirst(user?.Role)})
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  );
                                } else {
                                  content = (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        px: 1,
                                        py: 0.5,
                                        cursor: !isclient ? "pointer" : "default",
                                      }}
                                      onDoubleClick={() =>
                                        !isclient &&
                                        setEditingAssignedSubtaskId(subtaskId)
                                      }
                                    >
                                      <Group sx={{ mr: 1, color: "#D4AF37" }} />
                                      <Typography variant="body2">
                                        {usersList.length > 0
                                          ? usersList.map((u) => u.UserName).join(", ")
                                          : "Assign User"}
                                      </Typography>
                                    </Box>
                                  );
                                }
                              } else if (key === "createdAt") {
                                content = (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      px: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <CalendarToday
                                      sx={{
                                        mr: 1,
                                        fontSize: "1rem",
                                        color: "#D4AF37",
                                      }}
                                    />
                                    <Typography variant="body2">
                                      {(subtask.createdAt?.value || "").split("T")[0]}
                                    </Typography>
                                  </Box>
                                );
                              } else if (!editable) {
                                content = (
                                  <Typography
                                    variant="body2"
                                    sx={{ px: 1, py: 0.5 }}
                                  >
                                    {String(value)}
                                  </Typography>
                                );
                              } else if (enumOptions) {
                                content = (
                                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                                    <InputLabel shrink sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                                      {label}
                                    </InputLabel>
                                    <Select
                                      value={value}
                                      disabled={isclient}
                                      onChange={(e) =>
                                        handleSubtaskFieldChange(
                                          taskId,
                                          key,
                                          e.target.value,
                                          subtaskId
                                        )
                                      }
                                      onBlur={handleBlur}
                                      sx={{
                                        "& .MuiSelect-select": {
                                          py: 1.25,
                                          color: "#333",
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
                                      }}
                                      MenuProps={{
                                        PaperProps: {
                                          sx: {
                                            bgcolor: "white",
                                            color: "#333",
                                            "& .MuiMenuItem-root": {
                                              "&:hover": {
                                                bgcolor: "rgba(212, 175, 55, 0.1)",
                                              },
                                              "&.Mui-selected": {
                                                bgcolor: "rgba(212, 175, 55, 0.2)",
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
                              } else if (normalizedType === "boolean") {
                                content = (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      px: 1,
                                      py: 0.5,
                                    }}
                                  >
                                    <Typography variant="body2">
                                      {label}
                                    </Typography>
                                    <Switch
                                      checked={Boolean(value)}
                                      disabled={isclient}
                                      onChange={(e) =>
                                        handleSubtaskFieldChange(
                                          taskId,
                                          key,
                                          e.target.checked,
                                          subtaskId
                                        )
                                      }
                                      onBlur={handleBlur}
                                      size="small"
                                      sx={{
                                        "& .MuiSwitch-switchBase.Mui-checked": {
                                          color: "#D4AF37",
                                        },
                                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                          {
                                            backgroundColor: "#D4AF37",
                                          },
                                      }}
                                    />
                                  </Box>
                                );
                              } else if (normalizedType === "date") {
                                const today = new Date();
                                content = (
                                  <DatePicker
                                    label={label}
                                    value={value ? new Date(value) : null}
                                    onChange={(date) => {
                                      if (date) {
                                        handleSubtaskFieldChange(
                                          taskId,
                                          key,
                                          date,
                                          subtaskId
                                        );
                                      }
                                    }}
                                    onBlur={() => handleSubtaskFieldBlur(
                                      taskId,
                                      key,
                                      value,
                                      subtaskId
                                    )}
                                    minDate={today}
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
                              } else {
                                content = (
                                  <TextField
                                    label={label}
                                    type="text"
                                    size="small"
                                    fullWidth
                                    disabled={isclient}
                                    value={value || ""}
                                    onChange={(e) =>
                                      handleSubtaskFieldChange(
                                        taskId,
                                        key,
                                        e.target.value,
                                        subtaskId
                                      )
                                    }
                                    onBlur={handleBlur}
                                    sx={{
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
                                    <ListItemText
                                      primary={content}
                                      sx={{ my: 0 }}
                                    />
                                  </ListItem>
                                  {key !== keys[keys.length - 1] && (
                                    <Divider
                                      sx={{
                                        my: 0.5,
                                        backgroundColor: "rgba(0, 0, 0, 0.08)",
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
                              onClick={() => handleDelete(subtask._id?.value)}
                              sx={{
                                color: "error.main",
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                "&:hover": {
                                  backgroundColor: "rgba(244, 67, 54, 0.1)",
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
</Box>
      </LocalizationProvider>

      {/* Column Add Modal */}
      <Modal show={addingColumn} onHide={() => setAddingColumn(false)} centered>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
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
            <Select
              value={newColumnType}
              onChange={(e) => setNewColumnType(e.target.value)}
              label="Column Type"
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="dropdown">Dropdown</MenuItem>
              <MenuItem value="checkbox">Checkbox</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </Select>
          </FormControl>

          {newColumnType === "dropdown" && (
            <TextField
              label="Options (comma separated)"
              fullWidth
              value={newColumnOptions}
              onChange={(e) => setNewColumnOptions(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={() => setAddingColumn(false)}
              sx={{ mr: 1, color: "text.secondary" }}
            >
              Cancel
            </Button>
           {/* <Button
              variant="contained"
              onClick={addColumn}
              sx={{ bgcolor: "#D4AF37", "&:hover": { bgcolor: "#E6C050" } }}
            >
              Add Column
            </Button>*/}
          </Box>
        </Box>
      </Modal>

      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} centered>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
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
              value={newAssignedTaskCase}
              onChange={(e) => {
                fetchUsers(e.target.value);
                setNewAssignedTaskCase(e.target.value);
              }}
              error={isCaseInvalid}
              label="Assign Case"
            >
              <MenuItem value="">Select a Case</MenuItem>
              {allCases?.map((user) => (
                <MenuItem key={user?._id} value={user?._id}>
                  {user?.CaseNumber}
                </MenuItem>
              ))}
            </Select>
            {isCaseInvalid && (
              <Typography variant="caption" color="error">
                Please select a case.
              </Typography>
            )}
          </FormControl>

          {users?.length > 0 && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assigned Users</InputLabel>
              <Select
                value={assignedUsersForCase || ""}
                error={isUserInvalid}
                onChange={(e) => {
                  setAssignedUsersForCase(e.target.value);
                  if (e.target.value) {
                    setIsUserInvalid(false);
                  }
                }}
                label="Assigned Users"
              >
                <MenuItem value="">Select Assigned User</MenuItem>
                {users?.map((user) => (
                  <MenuItem key={user?.id} value={user?.id}>
                    {user?.UserName} ({user?.Role})
                  </MenuItem>
                ))}
              </Select>
              {isUserInvalid && (
                <Typography variant="caption" color="error">
                  Please select an assigned user.
                </Typography>
              )}
            </FormControl>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
            <Button
            variant="contained"
              onClick={() => setShowTaskModal(false)}
              sx={{ bgcolor: "#D4AF37", "&:hover": { bgcolor: "#E6C050" } }}
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

                if (!valid) return;

                handleAddNewTask(newTaskName, newAssignedTaskCase, assignedUsersForCase);
                setShowTaskModal(false);
                setNewTaskName("");
                setNewAssignedTaskCase("");
                setAssignedUsersForCase(null);
                setUsers([]);
                setIsCaseInvalid(false);
                setIsUserInvalid(false);
              }}
             sx={{ bgcolor: "#D4AF37", "&:hover": { bgcolor: "#E6C050" } }}
            >
              Save Task
            </Button>
          </Box>
        </Box>
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
  );
}