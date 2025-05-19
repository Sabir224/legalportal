import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaPlus, FaChevronDown, FaChevronRight, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { ApiEndPoint } from "../utils/utlis";
import axios from "axios";
import SocketService from "../../../../SocketService";
import ErrorModal from "../../AlertModels/ErrorModal";
import ConfirmModal from "../../AlertModels/ConfirmModal";
import SuccessModal from "../../AlertModels/SuccessModal";
import { Caseinfo, screenChange, FormCDetails } from "../../../../REDUX/sliece";


export default function ViewFormC({ token }) {
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
  // const [newSubtaskName, setNewSubtaskName] = useState('');
  const [assignedUserId, setAssignedUserId] = useState([]);
  const [parentId, setParentId] = useState();
  const [users, setUsers] = useState([]); // Fill this from API or props
  const [allCases, setAllCases] = useState([]); // Fill this from API or props
  const isclient = token?.Role === "client"
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
    fetchCases()
  }, []);


  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const fetchUsers = async (taskdetails) => {
    let id = taskdetails?.caseId?.value?._id
    console.log("taskdetails", taskdetails)
    try {
      const response = await axios.get(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${taskdetails}`);
      const allUsers = response.data.AssignedUsers || [];
      console.log("taskdetails", allUsers)

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
    console.log("caseInfo=", caseInfo)
    try {
      const response = await fetch(`${ApiEndPoint}getAllConsultationsWithDetails`
        //  caseInfo === null ? (token?.Role === "admin" ? `${ApiEndPoint}getAllTasksWithDetails` : `${ApiEndPoint}getTasksByUser/${token?._id}`) : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}`
      );

      if (!response.ok) {
        throw new Error("Error fetching folders");
      }

      const data = await response.json();
      console.log("fetch Task", data.consultations[0]);
      setTodos(data.consultations)

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


    console.log(userid)
    try {
      const subtask = {
        caseId: caseId,
        createdBy: token._id,
        assignedUsers: [userid]
      };
      console.log("empty sub task", subtask)
      //  const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      const response = await createSubtaskApi(selectedCaseId, subtask);
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);

      // backend default fields set kare

      const previousOpenTaskId = openTaskId;
      console.log("previousOpenTaskId=", previousOpenTaskId)

      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
      console.log("openTaskId=", openTaskId)
    } catch (error) {
      console.error("Failed to add subtask:", error);
    }
    // Update state with new task
    // setTodos((prev) => [...prev, newTask]);
  };

  const openModal = (Caseinfo) => {
    console.log("caseId", Caseinfo?._id?.value)
    setParentId(Caseinfo?._id?.value)
    setSelectedCaseId(Caseinfo?.caseId?.value?._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewSubtaskName('');
    setAssignedUserId('');
  };

  const handleSaveSubtask = async () => {
    // Validate fields
    if (!newSubtaskName || !assignedUserId) {
      setMessage("Please fill all fields");
      setShowError(true)
      return;
    }

    const subtask = {
      title: newSubtaskName,
      caseId: selectedCaseId,
      assignedUsers: assignedUserId,
      createdBy: token._id,
      parentId: parentId
    };

    try {
      const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      console.log('Task added successfully:', response.data);

      // const data = await response.json();
      // console.log('Subtask saved:', data);
      const previousOpenTaskId = openTaskId;
      await fetchtask()
      setOpenTaskId(previousOpenTaskId);

      closeModal();
    } catch (error) {
      console.error('Error saving subtask:', error);
      setMessage('Something went wrong while saving the subtask.');
      setShowError(true)
    }
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


  const addColumn = async () => {
    const trimmedColumnName = newColumnName.trim(); // Remove both leading and trailing spaces
    if (!trimmedColumnName) return;

    const newId = trimmedColumnName.toLowerCase().replace(/\s+/g, "-");

    // Check if the column already exists in UI
    const existingColumn = columns.find((column) => column.id === newId);
    if (existingColumn) {
      setMessage("⚠️ Column already exists in UI!");
      setShowError(true)
      return;
    }

    try {
      // Check if the column exists in backend
      const checkRes = await axios.get(`${ApiEndPoint}CheckColumnExists/${trimmedColumnName}`);
      if (checkRes.data.exists) {
        setMessage("⚠️ Column name already exists in the database!");
        setShowError(true)
        return;
      }

      const encodedEnum = newColumnType === "dropdown" ? encodeURIComponent(newColumnOptions) : '';
      const url = `${ApiEndPoint}AddColumnInSchema/${trimmedColumnName}/${newColumnType}/${encodedEnum}`;
      const response = await axios.put(url);

      if (response.status === 200) {
        showSuccess(`✅ ${response.data.message}`);
        SocketService.TaskManagement(response);

        const newColumn = {
          id: newId,
          label: trimmedColumnName,
          type: newColumnType,
        };

        if (newColumnType === "dropdown") {
          newColumn.options = newColumnOptions.split(',').map(opt => opt.trim());
        }

        setNewColumnName("");
        setNewColumnType("text");
        setNewColumnOptions("");
        setAddingColumn(false);
        const previousOpenTaskId = openTaskId;
        await fetchtask();
        setOpenTaskId(previousOpenTaskId);
      } else {
        setMessage('⚠️ Something went wrong while adding the column.');
        setShowError(true)
      }
    } catch (error) {
      console.error('❌ Error adding column:', error);
      setMessage('❌ Failed to add the column.');
      setShowError(true)
    }
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
    setTodos(prevTasks => {
      return prevTasks.map(task => {
        if (task.id !== parentTaskId && task._id?.value !== parentTaskId) return task;

        const updatedSubtasks = task.subtasks.map(subtask => {
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

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    try {
      const response = await axios.delete(`${ApiEndPoint}DeleteColumnByName/${pendingColumn}`);

      if (response.status === 200) {
        showSuccess(`🗑️ ${response.data.message}`);
        SocketService.TaskManagement(response);
        setColumns(prev =>
          prev.filter(col => col.id !== pendingColumn.toLowerCase().replace(/\s+/g, "-"))
        );
        const previousOpenTaskId = openTaskId;
        await fetchtask();
        setOpenTaskId(previousOpenTaskId);
      } else {
        setMessage('⚠️ Column deletion failed.');
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
    console.log("taskId?.caseId?.value?._id", Taskinfo?.caseId?.value?._id)
    try {
      const subtask = {
        caseId: Taskinfo?.caseId?.value?._id,
        createdBy: token._id,
        parentId: Taskinfo?._id?.value
      };
      console.log("empty sub task", subtask)
      //  const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      const response = await createSubtaskApi(selectedCaseId, subtask); // backend default fields set kare
      const newSubtask = response.data;
      SocketService.TaskManagement(newSubtask);


      const previousOpenTaskId = openTaskId;
      console.log("previousOpenTaskId=", previousOpenTaskId)
      await fetchtask();
      await setOpenTaskId(previousOpenTaskId);
      console.log("openTaskId=", openTaskId)
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
    console.log("Blurred & API Call:", { taskId, key, value, isSubtask, subtaskId });
    console.log("Blurred & API Call value:", { value });

    try {
      const response = await axios.post(`${ApiEndPoint}updateConsultationField`, {
        formId: taskId,
        key,
        value
      });
      setAssignedUserId([])
      SocketService.TaskManagement(response);

      fetchtask()
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
    console.log("id of form c", taskId)
    setConfirmData({
      taskId,
      message: "Are you sure you want to delete this Form C?",
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
        setShowConfirmModal(false)
        showSuccess("Form Delete Successfully")
        fetchtask()
      } else {
        console.error('Delete failed:', data.message);
      }
    } catch (err) {
      console.error('Error:', err);
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
          dateObj = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
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
      const response = await axios.post(`${ApiEndPoint}updateConsultationField`, {
        taskId,
        key,
        value,
      });

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
    let item = { ClientId: userId }
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

  return (
    <div className="tasklist-body">
      <style>{`
      .tasklist-body {
        padding: 20px;
        background: #f0f2f5;
      }
      .tasklist-table-container {
        max-height: 500px;
        overflow: auto;
        background: white;
        border-radius: 10px;
        border: 1px solid #ddd;
      }
      .tasklist-todo-table {
        width: 100%;
        min-width: 900px;
        border-collapse: separate;
        border-spacing: 0;
      }
      .tasklist-todo-table th, .tasklist-todo-table td {
        padding: 10px 14px;
        border-bottom: 1px solid #eee;
        text-align: left;
        white-space: nowrap;
      }
      .tasklist-todo-table th {
        background: #fafafa;
        position: sticky;
        top: 0;
        z-index: 10;
        font-weight: bold;
      }
      .expand-icon {
        cursor: pointer;
        width:10px,
        margin-right: 5px;
      }
      .subtask-table {
        margin-left: 30px;
        margin-top: 10px;
      }
      .add-subtask-button, .save-subtask-button, .add-column-button {
        margin-top: 10px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 6px 12px;
        cursor: pointer;
      }
      .add-subtask-button:hover, .save-subtask-button:hover, .add-column-button:hover {
        background: #0056b3;
      }
      .subtask-input, .column-input, .column-type-select, .column-options-input {
        margin-top: 10px;
        padding: 6px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .subtask-input, .column-input {
        width: 300px;
      }
      .column-options-input {
        width: 200px;
        margin-left: 10px;
      }
      .plus-icon {
        cursor: pointer;
        font-size: 18px;
        color: #007bff;
      }
      .plus-icon:hover {
        color: #0056b3;
      }
      .delete-column-icon {
        cursor: pointer;
        color: #ff4d4f;
        margin-left: 8px;
      }
      .column-type-container {
        margin-top: 10px;
        display: flex;
        align-items: center;
      }
      .column-options-container {
        margin-top: 10px;
        display: flex;
        align-items: center;
      }
      /* Modal styles */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        width: 400px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }
      .modal-title {
        font-size: 18px;
        font-weight: bold;
      }
      .close-button {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }
      .modal-footer {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .cancel-button {
        background: #f0f0f0;
        color: #333;
        border: none;
        border-radius: 5px;
        padding: 6px 12px;
        cursor: pointer;
      }
    `}</style>


      <div className="mb-1">
        <button className="btn btn-success" onClick={() => dispatch(screenChange(16))}>
          + New form
        </button>
      </div>

      <div className="tasklist-table-container">
        <table className="tasklist-todo-table ">
          <thead>
            <tr>
              <th style={{ width: "10px" }}></th>
              {keys?.map((key) => (
                <th key={key}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {(key != "userId" && key != "userName") && (
                      <div>
                        {key
                          .split(/(?=[A-Z])/)
                          .join(" ") // Add space before capital letters
                          .replace(/^./, (str) => str.toUpperCase())} {/* Format key */}
                      </div>
                    )}
                    {(!isclient && key !== "caseId" && key !== "title" && key !== "description" && key !== "assignedUsers" && key !== "createdBy" && key !== "status" && key !== "dueDate" && key !== "clientEmail" && key !== "nationality" && key !== "nextHearing") &&
                      <div>
                        {/* {token?.Role === "admin" &&
                          <FaTrash
                            className="delete-column-icon"
                            onClick={() => deleteColumn(key)}
                            title="Delete column"
                          />
                        } */}
                      </div>
                    }
                  </div>
                </th>
              ))}

              <th>
                {/* {token?.Role === "admin" &&
                  <FaPlus
                    className="plus-icon"
                    onClick={() => setAddingColumn(true)}
                  />
                } */}

              </th>
            </tr>
          </thead>


          <tbody>
            {todos?.map((todo) => (
              <React.Fragment key={todo.id}>

                <tr>
                  <td>
                    <span className="expand-icon" onClick={() => toggleTask(todo._id)}>
                      {/* {openTaskId?.value === todo._id?.value ? <FaChevronDown /> : <FaChevronRight />} */}
                    </span>
                  </td>
                  {keys?.map((key) => {
                    const field = todo[key];
                    if (!field) return <td key={key} />;

                    const { value, type, enum: enumOptions, editable = true } = field;
                    let content;
                    const normalizedType = type?.toLowerCase();

                    const taskId = todo._id?.value || todo.id;
                    const subtaskId = isSubtask ? taskId : null;

                    const handleBlur = (e) => {
                      const newValue =
                        normalizedType === "boolean" ? e.target.checked : e.target.value;
                      handleFieldBlur(taskId, key, newValue, isSubtask, subtaskId);
                    };

                    if (key === "documents") {
                      const userId = todo.userId?.value;
                      const userName = todo.userName?.value;
                      const clientName = todo.clientName?.value || "Client";
                      const email = todo.email?.value;

                      content = userId && userName ? (
                        <span
                          style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => handleUserClick(userId, userName)}
                        >
                          {userName}
                        </span>
                      ) : (
                        <span
                          style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => handleClientClick(email)}
                        >
                          {clientName}
                        </span>
                      );
                    }

                    else if (key === "caseId") {
                      content = <span>{todo.caseId?.value?.CaseNumber || ""}</span>;
                    } else if (key === "createdBy") {
                      content = <span>{todo.createdBy?.value?.UserName || ""}</span>;
                    } else if (key === "assignedUsers") {
                      // ... (unchanged logic for assignedUsers)
                    } else if (key === "createdAt") {
                      content = <span>{(todo.createdAt?.value || "").split("T")[0]}</span>;
                    } else if (!editable) {
                      content = <span>{String(value)}</span>;
                    } else if (enumOptions) {
                      content = (
                        <select
                          value={value}
                          onChange={(e) => {
                            handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);
                          }}
                          onBlur={handleBlur}
                          disabled={isclient}
                        >
                          {enumOptions?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      );
                    } else if (normalizedType === "boolean") {
                      content = (
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          onChange={(e) => {
                            handleFieldChange(taskId, key, e.target.checked, isSubtask, subtaskId);
                          }}
                          onBlur={handleBlur}
                          disabled={isclient}
                        />
                      );
                    } else if (normalizedType === "date") {
                      const dateValue = value ? new Date(value).toISOString().split("T")[0] : "";
                      content = (
                        <DatePicker
                          selected={value ? new Date(value) : null}
                          onChange={(date) => handleFieldChange(taskId, key, date, isSubtask, subtaskId)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/mm/yyyy"
                          onBlur={() => handleFieldBlur(taskId, key, value, isSubtask, subtaskId)}
                          disabled={isclient}
                        />
                      );
                    } else {
                      if (key === "userId" || key === "userName") {
                        content = <></>; // Or use: return <td key={key} />; if you want to skip the cell entirely
                      } else {
                        content = (
                          <input
                            type="text"
                            value={value || ""}
                            onChange={(e) => {
                              handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);
                            }}
                            onBlur={handleBlur}
                            disabled={isclient || key == "email" ? true : false}
                          />
                        );
                      }
                    }


                    return <td key={key}>{content}</td>;
                  })}


                  {/* Delete button column */}
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(todo._id?.value || todo.id)}
                      disabled={isclient}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}


          </tbody>
        </table>
      </div>

      {/* Column Add Modal */}
      {addingColumn && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">Add New Column</div>
              <button
                className="close-button"
                onClick={() => setAddingColumn(false)}
              >
                &times;
              </button>
            </div>
            <div>
              <input
                type="text"
                className="column-input"
                placeholder="Enter New Column Name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />

              <div className="column-type-container">
                <select
                  className="column-type-select"
                  value={newColumnType}
                  onChange={(e) => setNewColumnType(e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="checkbox">Checkbox</option>
                </select>

                {newColumnType === "dropdown" && (
                  <input
                    type="text"
                    className="column-options-input"
                    placeholder="Options (comma separated)"
                    value={newColumnOptions}
                    onChange={(e) => setNewColumnOptions(e.target.value)}
                  />
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-button"
                  onClick={() => setAddingColumn(false)}
                >
                  Cancel
                </button>
                <button className="add-column-button" onClick={addColumn}>
                  Add Column
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

              handleAddNewTask(newTaskName, newAssignedTaskCase, assignedUsersForCase);
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
  );
}
