// // import React, { useEffect, useState } from "react";
// // import TaskViewModal from "./TaskViewModal";
// // import TaskEditModal from "./TaskEditModal";
import { ApiEndPoint } from "../utils/utlis";
import axios from 'axios'
// // import {
// //   Button,
// //   Card,
// //   Col,
// //   Modal,
// //   Form,
// //   Row,
// //   Dropdown,
// // } from "react-bootstrap";
// // import axios from "axios";
// // import ErrorModal from "../../AlertModels/ErrorModal";
// // import SuccessModal from "../../AlertModels/SuccessModal";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// // import { faCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// // const TaskList = ({ token }) => {
// //   const [taskList, setTaskList] = useState([]);

// //   const [modalOpen, setModalOpen] = useState(false);
// //   const [selectedTask, setSelectedTask] = useState(null);
// //   const [editModalOpen, setEditModalOpen] = useState(false);
// //   const [IsDeleteTask, setIsDeleteTask] = useState(false);
// //   const [deleteTask, setDeteleTask] = useState(null);

// //   const [showSuccess, setShowSuccess] = useState(false);
// //   const [showError, setShowError] = useState(false);
// //   const [message, setMessage] = useState("");

// //   useEffect(() => {
// //     fetchtask()
// //   }, []);

// //   const fetchtask = async () => {
// //     try {
// //       const response = await fetch(`${ApiEndPoint}getAllTasksWithDetails`);

// //       if (!response.ok) {
// //         throw new Error('Error fetching folders');
// //       }

// //       const data = await response.json();
// //       console.log("fetch Task", data.tasks);
// //       setTaskList(data.tasks)

// //     } catch (err) {
// //       setMessage(err.response?.data?.message || "Error deleting task.");
// //       //  setShowError(true);

// //     }
// //   };

// //   const editTask = (task) => {
// //     setSelectedTask(task);
// //     setEditModalOpen(true);
// //   };
// //   const deletemodal = (task) => {
// //     setDeteleTask(task)
// //     setIsDeleteTask(true);
// //   };

// //   const saveTaskEdits = (updatedTask) => {
// //     const updatedList = taskList.map((t) =>
// //       t === selectedTask ? updatedTask : t
// //     );
// //     setTaskList(updatedList);
// //   };

// //   const viewTask = (task) => {
// //     setSelectedTask(task);
// //     setModalOpen(true);
// //   };
// //   // Action handlers
// //   //const viewTask = (task) => alert(`Viewing Task: ${task.title}`);
// //   // const editTask = (task) => alert(`Editing Task: ${task.title}`);
// //   const handleDeleteTask = async () => {
// //     console.log("deleteTask", deleteTask)
// //     try {
// //       const response = await axios.delete(`${ApiEndPoint}deleteTask/${deleteTask?._id}`);
// //       setDeteleTask(null)
// //       setIsDeleteTask(false)
// //       setMessage("Task Detele successfully");
// //       setShowSuccess(true);
// //       fetchtask()
// //       return response.data;
// //     } catch (error) {
// //       setShowSuccess(true);
// //       console.error("Failed to delete task:", error);
// //       setShowError(true)
// //       //throw error;
// //     }

// //   };
// //   const markCompleted = (task) => {
// //     const updated = taskList.map((t) =>
// //       t === task ? { ...t, status: "Completed" } : t
// //     );
// //     setTaskList(updated);
// //   };

// //   const [activeTask, setActiveTask] = useState(null);

// //   const handleRowClick = (task) => {
// //     // If the task clicked is already active, hide it (set activeTask to null)
// //     if (activeTask && activeTask.id === task.id) {
// //       setActiveTask(null);
// //     } else {
// //       // Otherwise, set the clicked task as active
// //       setActiveTask(task);
// //     }

// //     // Trigger task view action (optional)
// //     viewTask(task);
// //   };

// //   return (
// //     <div className="" style={{ height: "84vh", overflowY: "auto" }}>
// //       <div className="card mb-3 shadow">
// //         <div
// //           className="card-header d-flex justify-content-between align-items-center px-3"
// //           style={{ height: "8vh" }}
// //         >
// //           <span className="col text-start fw-bold">Status</span>
// //           <span className="col text-start fw-bold">Task Title</span>
// //           <span className="col text-start fw-bold">Due Date</span>
// //           <span className="col text-end fw-bold">Actions</span>
// //         </div>

// //         <div className="card-list p-0">
// //           {taskList.map((task, index) => (
// //             <div key={index}>
// //               <div
// //                 className="d-flex justify-content-between align-items-center p-3 border-bottom"
// //                 style={{ cursor: "pointer" }}
// //                 onClick={() => viewTask(task)} // Ensure that each row click triggers the task to open
// //               >
// //                 <span className="col d-flex align-items-center text-start">
// //                   <span
// //                     className={`me-2 rounded-circle ${task.status.toLowerCase() === "completed"
// //                         ? "bg-success"
// //                         : task.status.toLowerCase() === "overdue"
// //                           ? "bg-danger"
// //                           : "bg-warning"
// //                       }`}
// //                     style={{
// //                       width: "10px",
// //                       height: "10px",
// //                       display: "inline-block",
// //                     }}
// //                   ></span>
// //                   {task.status}
// //                 </span>

// //                 <span className="col text-start">{task.title}</span>
// //                 <span className="col text-start">
// //                   {task.dueDate?.split("T")[0]}
// //                 </span>

// //                 <div
// //                   className="col text-end"
// //                   onClick={(e) => e.stopPropagation()} // Prevent row click from triggering modal
// //                 >
// //                   <button
// //                     className="btn btn-outline-secondary btn-sm me-2"
// //                     onClick={() => editTask(task)}
// //                     title="Edit"
// //                   >
// //                     <FontAwesomeIcon icon={faEdit} />
// //                   </button>
// //                   <button
// //                     className="btn btn-outline-danger btn-sm me-2"
// //                     onClick={() => deletemodal(task)}
// //                     title="Delete"
// //                   >
// //                     <FontAwesomeIcon icon={faTrash} />
// //                   </button>
// //                   <button
// //                     className="btn btn-success btn-sm"
// //                     onClick={() => markCompleted(task)}
// //                     title="Mark Completed"
// //                   >
// //                     <FontAwesomeIcon icon={faCheck} />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <TaskViewModal
// //           show={modalOpen}
// //           handleClose={() => setModalOpen(false)} // This will close the modal
// //           task={selectedTask} // Make sure selectedTask is passed as prop
// //         />
// //         <TaskEditModal
// //           show={editModalOpen}
// //           handleClose={() => setEditModalOpen(false)}
// //           task={selectedTask}
// //           handleSave={saveTaskEdits}
// //         />

// //         <Modal show={IsDeleteTask} onHide={() => setIsDeleteTask(false)} centered>
// //           <Modal.Header closeButton>
// //             <Modal.Title>Task Delete</Modal.Title>
// //           </Modal.Header>

// //           <Modal.Body className="text-center">
// //             <p className="fs-5">Are you sure you want to delete this Task?</p>
// //           </Modal.Body>

// //           <Modal.Footer className="d-flex justify-content-end">
// //             <Button variant="secondary" onClick={() => setIsDeleteTask(false)}>
// //               Cancel
// //             </Button>
// //             <Button variant="danger" onClick={() => handleDeleteTask()}>
// //               Delete
// //             </Button>
// //           </Modal.Footer>
// //         </Modal>

// //         <SuccessModal
// //           show={showSuccess}
// //           handleClose={() => setShowSuccess(false)}
// //           message={message}
// //         />
// //         <ErrorModal
// //           show={showError}
// //           handleClose={() => setShowError(false)}
// //           message={message}
// //         />
// //       </div>
// //     </div>
// //   );

// // };

// // export default TaskList;

// import React, { useEffect, useState } from "react";
// import TaskViewModal from "./TaskViewModal";
// import TaskEditModal from "./TaskEditModal";
// import { ApiEndPoint } from "../utils/utlis";
// import {
//   Button,
//   Card,
//   Col,
//   Modal,
//   Form,
//   Row,
//   Dropdown,
//   Container,
// } from "react-bootstrap";
// import axios from "axios";
// import ErrorModal from "../../AlertModels/ErrorModal";
// import SuccessModal from "../../AlertModels/SuccessModal";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

// const TaskList = ({ token }) => {
//   const [taskList, setTaskList] = useState([]);
//   const [expandedTask, setExpandedTask] = useState(null); // Track expanded task
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [IsDeleteTask, setIsDeleteTask] = useState(false);
//   const [deleteTask, setDeteleTask] = useState(null);

//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     fetchtask()
//   }, []);

//   const fetchtask = async () => {
//     try {
//       const response = await fetch(`${ApiEndPoint}getAllTasksWithDetails`);

//       if (!response.ok) {
//         throw new Error('Error fetching folders');
//       }

//       const data = await response.json();
//       console.log("fetch Task", data.tasks);
//       setTaskList(data.tasks)

//     } catch (err) {
//       setMessage(err.response?.data?.message || "Error deleting task.");
//     }
//   };

//   const editTask = (task) => {
//     setSelectedTask(task);
//     setEditModalOpen(true);
//   };

//   const deletemodal = (task) => {
//     setDeteleTask(task)
//     setIsDeleteTask(true);
//   };

//   const saveTaskEdits = (updatedTask) => {
//     const updatedList = taskList.map((t) =>
//       t === selectedTask ? updatedTask : t
//     );
//     setTaskList(updatedList);
//   };

//   const viewTask = (task) => {
//     setSelectedTask(task);
//     setModalOpen(true);
//   };

//   const handleDeleteTask = async () => {
//     try {
//       const response = await axios.delete(`${ApiEndPoint}deleteTask/${deleteTask?._id}`);
//       setDeteleTask(null)
//       setIsDeleteTask(false)
//       setMessage("Task Detele successfully");
//       setShowSuccess(true);
//       fetchtask()
//       return response.data;
//     } catch (error) {
//       setShowSuccess(true);
//       console.error("Failed to delete task:", error);
//       setShowError(true)
//     }
//   };

//   const markCompleted = (task) => {
//     const updated = taskList.map((t) =>
//       t === task ? { ...t, status: "Completed" } : t
//     );
//     setTaskList(updated);
//   };

//   // Toggle the expanded task when a row is clicked
//   const handleRowClick = (task) => {
//     setIsEditMode(false)
//     setTask(task)
//     if (expandedTask && expandedTask._id === task._id) {
//       setExpandedTask(null); // If the same row is clicked, collapse it
//     } else {
//       setExpandedTask(task); // Otherwise, set this row as expanded
//     }
//   };

//   const [editableTask, setEditableTask] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [task, setTask] = useState(false);

//   useEffect(() => {
//     if (task) {
//       setEditableTask({ ...task });
//     }
//   }, [task]);

//   const handleChange = (field, value) => {
//     setEditableTask((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSave = (field, value) => {

//   };
//   const handleClose = () => {
//     setExpandedTask(null)
//   };

//   const handleEditClick = () => setIsEditMode(true);
//   const handleCancelClick = () => setIsEditMode(false);

//   const handleSubmit = () => {
//     if (handleSave && editableTask) {
//       handleSave(editableTask);
//       setIsEditMode(false);
//     }
//   };

//   return (
//     <div className="" style={{ height: "84vh", overflowY: "auto" }}>
//       <div className="card mb-3 shadow">
//         <div
//           className="card-header d-flex justify-content-between align-items-center px-3"
//           style={{ height: "8vh" }}
//         >
//           <span className="col text-start fw-bold">Status</span>
//           <span className="col text-start fw-bold">Task Title</span>
//           <span className="col text-start fw-bold">Due Date</span>
//           <span className="col text-end fw-bold">Actions</span>
//         </div>

//         <div className="card-list p-0">
//           {taskList.map((task, index) => (
//             <div key={index}>
//               <div
//                 className="d-flex justify-content-between align-items-center p-3 border-bottom"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => handleRowClick(task)} // Handle row click
//               >
//                 <span className="col d-flex align-items-center text-start">
//                   <span
//                     className={`me-2 rounded-circle ${task.status.toLowerCase() === "completed"
//                       ? "bg-success"
//                       : task.status.toLowerCase() === "overdue"
//                         ? "bg-danger"
//                         : "bg-warning"
//                       }`}
//                     style={{
//                       width: "10px",
//                       height: "10px",
//                       display: "inline-block",
//                     }}
//                   ></span>
//                   {task.status}
//                 </span>

//                 <span className="col text-start">{task.title}</span>
//                 <span className="col text-start">
//                   {task.dueDate?.split("T")[0]}
//                 </span>

//                 <div
//                   className="col text-end"
//                   onClick={(e) => e.stopPropagation()} // Prevent row click from triggering modal
//                 >
//                   <button
//                     className="btn btn-outline-secondary btn-sm me-2"
//                     onClick={() => editTask(task)}
//                     title="Edit"
//                   >
//                     <FontAwesomeIcon icon={faEdit} />
//                   </button>
//                   <button
//                     className="btn btn-outline-danger btn-sm me-2"
//                     onClick={() => deletemodal(task)}
//                     title="Delete"
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                   <button
//                     className="btn btn-success btn-sm"
//                     onClick={() => markCompleted(task)}
//                     title="Mark Completed"
//                   >
//                     <FontAwesomeIcon icon={faCheck} />
//                   </button>
//                 </div>
//               </div>

//               {/* Show task details if the task is expanded */}
//               {expandedTask && expandedTask?._id === task?._id && (
//                 <Container className="mt-4 mb-4">
//                   <Card >
//                     <Card.Header className="d-flex justify-content-between align-items-center">
//                       <h4 className="mb-0">Task {isEditMode ? "Edit" : "Details"}</h4>
//                       <div>
//                         {!isEditMode && (
//                           <Button variant="warning" onClick={handleEditClick} className="me-2">
//                             Edit
//                           </Button>
//                         )}
//                         {isEditMode && (
//                           <Button variant="secondary" onClick={handleCancelClick} className="me-2">
//                             Cancel
//                           </Button>
//                         )}
//                         <Button variant="dark" onClick={handleClose}>
//                           Close
//                         </Button>

//                       </div>
//                     </Card.Header>
//                     <Card.Body>
//                       <Form>
//                         <Row>
//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Case Number</Form.Label>
//                               <Form.Control
//                                 type="text"
//                                 value={editableTask?.caseId?.CaseNumber || ""}
//                                 readOnly
//                               />
//                             </Form.Group>
//                           </Col>

//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Title</Form.Label>
//                               <Form.Control
//                                 type="text"
//                                 value={editableTask?.title || ""}
//                                 readOnly={!isEditMode}
//                                 onChange={(e) => handleChange("title", e.target.value)}
//                               />
//                             </Form.Group>
//                           </Col>

//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Due Date</Form.Label>
//                               <Form.Control
//                                 type="date"
//                                 value={editableTask?.dueDate?.split("T")[0] || ""}
//                                 readOnly={!isEditMode}
//                                 onChange={(e) => handleChange("dueDate", e.target.value)}
//                               />
//                             </Form.Group>
//                           </Col>

//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Status</Form.Label>
//                               {isEditMode ? (
//                                 <Form.Select
//                                   value={editableTask?.status || ""}
//                                   onChange={(e) => handleChange("status", e.target.value)}
//                                 >
//                                   <option value="">Select Status</option>
//                                   <option value="Pending">Pending</option>
//                                   <option value="Completed">Completed</option>
//                                   <option value="Overdue">Overdue</option>
//                                 </Form.Select>
//                               ) : (
//                                 <Form.Control type="text" value={editableTask?.status} readOnly />
//                               )}
//                             </Form.Group>
//                           </Col>

//                           <Col md={12}>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Description</Form.Label>
//                               <Form.Control
//                                 as="textarea"
//                                 rows={4}
//                                 value={editableTask?.description || ""}
//                                 readOnly={!isEditMode}
//                                 onChange={(e) => handleChange("description", e.target.value)}
//                               />
//                             </Form.Group>
//                           </Col>

//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Assigned To</Form.Label>
//                               <Form.Control
//                                 type="text"
//                                 value={editableTask?.assignedUsers?.[0]?.UserName || ""}
//                                 readOnly
//                               />
//                             </Form.Group>
//                           </Col>

//                           <Col md={6}>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Created By</Form.Label>
//                               <Form.Control
//                                 type="text"
//                                 value={editableTask?.createdBy?.UserName || ""}
//                                 readOnly
//                               />
//                             </Form.Group>
//                           </Col>
//                         </Row>

//                         {isEditMode && (
//                           <div className="text-end">
//                             <Button variant="primary" onClick={handleSubmit}>
//                               Save Changes
//                             </Button>
//                           </div>
//                         )}
//                       </Form>
//                     </Card.Body>
//                   </Card>
//                 </Container>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskList;

// import React, { useState } from "react";
// import { FaPlus } from "react-icons/fa"; // Plus icon

// export default function TaskList() {
//   const [todos, setTodos] = useState([
//     {
//       id: 1,
//       task: "Learn React",
//       status: "In Progress",
//       priority: "High",
//       subtasks: [
//         { id: 11, task: "Learn useState", status: "Completed", priority: "High" },
//         { id: 12, task: "Learn useEffect", status: "In Progress", priority: "Medium" },
//       ],
//     },
//     {
//       id: 2,
//       task: "Build Project",
//       status: "Not Started",
//       priority: "Medium",
//       subtasks: [],
//     },
//     {
//       id: 3,
//       task: "Deploy App",
//       status: "Completed",
//       priority: "Low",
//       subtasks: [
//         { id: 31, task: "Setup hosting", status: "Not Started", priority: "High" },
//       ],
//     },
//   ]);

//   const [columns, setColumns] = useState([
//     { id: "task", label: "Task", type: "text" },
//     { id: "status", label: "Status", type: "text" },
//     { id: "priority", label: "Priority", type: "text" },
//   ]);

//   const [draggedRowIndex, setDraggedRowIndex] = useState(null);
//   const [draggedColumnIndex, setDraggedColumnIndex] = useState(null);
//   const [newColumnName, setNewColumnName] = useState("");
//   const [newColumnType, setNewColumnType] = useState("text");
//   const [undoStack, setUndoStack] = useState([]);
//   const [isAddingColumn, setIsAddingColumn] = useState(false);
//   const [openTasks, setOpenTasks] = useState([]);

//   // Handlers
//   const handleDragStartRow = (index) => {
//     setDraggedRowIndex(index);
//   };
//   const handleDragOverRow = (e) => {
//     e.preventDefault();
//   };
//   const handleDropRow = (index) => {
//     if (draggedRowIndex === null) return;
//     const newTodos = [...todos];
//     const draggedRow = newTodos.splice(draggedRowIndex, 1)[0];
//     newTodos.splice(index, 0, draggedRow);

//     setUndoStack((prev) => [...prev, { todos, columns }]);
//     setTodos(newTodos);
//     setDraggedRowIndex(null);
//   };
//   const handleDragStartColumn = (index) => {
//     setDraggedColumnIndex(index);
//   };
//   const handleDragOverColumn = (e) => {
//     e.preventDefault();
//   };
//   const handleDropColumn = (index) => {
//     if (draggedColumnIndex === null) return;
//     const newColumns = [...columns];
//     const draggedCol = newColumns.splice(draggedColumnIndex, 1)[0];
//     newColumns.splice(index, 0, draggedCol);

//     setUndoStack((prev) => [...prev, { todos, columns }]);
//     setColumns(newColumns);
//     setDraggedColumnIndex(null);
//   };
//   const handleInputChange = (taskId, columnId, value) => {
//     setTodos((prev) =>
//       prev.map((todo) =>
//         todo.id === taskId ? { ...todo, [columnId]: value } : todo
//       )
//     );
//   };
//   const addColumn = () => {
//     if (!newColumnName) return;
//     const newColId = newColumnName.toLowerCase().replace(/\s+/g, "-");
//     const newCol = { id: newColId, label: newColumnName, type: newColumnType };

//     setUndoStack((prev) => [...prev, { todos, columns }]);
//     setColumns((prev) => [...prev, newCol]);
//     setNewColumnName("");
//     setIsAddingColumn(false);
//   };
//   const undoLastAction = () => {
//     if (undoStack.length > 0) {
//       const last = undoStack[undoStack.length - 1];
//       setTodos(last.todos);
//       setColumns(last.columns);
//       setUndoStack((prev) => prev.slice(0, -1));
//     }
//   };
//   const toggleSubtasks = (taskId) => {
//     setOpenTasks((prev) =>
//       prev.includes(taskId)
//         ? prev.filter((id) => id !== taskId)
//         : [...prev, taskId]
//     );
//   };

//   return (
//     <div className="tasklist-body">
//       <style>{`
//         .tasklist-body {
//           padding: 20px;
//           background: #f0f2f5;
//         }
//         .tasklist-table-container {
//           max-height: 600px;
//           overflow: auto;
//           scroll-behavior: smooth;
//           background: white;
//           border-radius: 10px;
//           border: 1px solid #ddd;
//         }
//         .tasklist-todo-table {
//           width: 100%;
//           min-width: 900px;
//           border-collapse: separate;
//           border-spacing: 0;
//         }
//         .tasklist-todo-table th, .tasklist-todo-table td {
//           padding: 10px 14px;
//           border-bottom: 1px solid #eee;
//           background: #fff;
//           text-align: left;
//           white-space: nowrap;
//         }
//         .tasklist-todo-table th {
//           background: #fafafa;
//           position: sticky;
//           top: 0;
//           z-index: 10;
//           font-weight: bold;
//           cursor: move;
//         }
//         .tasklist-todo-table tbody tr:hover {
//           background: #f9f9f9;
//           cursor: move;
//         }
//         .tasklist-controls {
//           margin: 10px 0;
//           display: flex;
//           gap: 10px;
//         }
//         .tasklist-controls input, .tasklist-controls select {
//           padding: 6px;
//           border: 1px solid #ccc;
//           border-radius: 5px;
//         }
//         .tasklist-controls button {
//           padding: 6px 12px;
//           background: #007bff;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//         }
//         .tasklist-controls button:hover {
//           background: #0056b3;
//         }
//         .undo-button {
//           margin-top: 10px;
//           background: #28a745;
//           color: white;
//           padding: 6px 12px;
//           border: none;
//           border-radius: 4px;
//           cursor: pointer;
//         }
//         .undo-button:hover {
//           background: #218838;
//         }
//         .plus-icon {
//           cursor: pointer;
//           color: #007bff;
//           font-size: 24px;
//         }
//         .plus-icon:hover {
//           color: #0056b3;
//         }
//         .column-name-input {
//           margin: 10px 0;
//           display: flex;
//           gap: 10px;
//         }
//         .column-name-input input {
//           padding: 6px;
//           border: 1px solid #ccc;
//           border-radius: 5px;
//         }
//         .column-name-input button {
//           padding: 6px 12px;
//           background: #007bff;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//         }
//       `}</style>

//       <div className="tasklist-table-container">
//         <table className="tasklist-todo-table">
//           <thead>
//             <tr>
//               {columns.map((col, index) => (
//                 <th
//                   key={col.id}
//                   draggable
//                   onDragStart={() => handleDragStartColumn(index)}
//                   onDragOver={handleDragOverColumn}
//                   onDrop={() => handleDropColumn(index)}
//                 >
//                   {col.label}
//                 </th>
//               ))}
//               <th>
//                 <FaPlus className="plus-icon" onClick={() => setIsAddingColumn(true)} />
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {todos.map((todo, index) => (
//               <React.Fragment key={todo.id}>
//                 <tr
//                   draggable
//                   onDragStart={() => handleDragStartRow(index)}
//                   onDragOver={handleDragOverRow}
//                   onDrop={() => handleDropRow(index)}
//                 >
//                   {columns.map((col, colIndex) => (
//                     <td key={col.id}>
//                       {colIndex === 0 && todo.subtasks.length > 0 && (
//                         <span
//                           onClick={() => toggleSubtasks(todo.id)}
//                           style={{ cursor: "pointer", marginRight: 8 }}
//                         >
//                           {openTasks.includes(todo.id) ? "🔽" : "▶️"}
//                         </span>
//                       )}
//                       {col.type === "dropdown" ? (
//                         <select
//                           value={todo[col.id] || ""}
//                           onChange={(e) =>
//                             handleInputChange(todo.id, col.id, e.target.value)
//                           }
//                         >
//                           <option value="">Select</option>
//                           <option value="High">High</option>
//                           <option value="Medium">Medium</option>
//                           <option value="Low">Low</option>
//                         </select>
//                       ) : (
//                         <input
//                           type="text"
//                           value={todo[col.id] || ""}
//                           onChange={(e) =>
//                             handleInputChange(todo.id, col.id, e.target.value)
//                           }
//                         />
//                       )}
//                     </td>
//                   ))}
//                 </tr>

//                 {/* Subtasks */}
//                 {openTasks.includes(todo.id) && todo.subtasks.length > 0 && (
//                   <tr>
//                     <td colSpan={columns.length + 1}>
//                       <table className="tasklist-todo-table" style={{ marginLeft: 20, marginTop: 10 }}>
//                         <thead>
//                           <tr>
//                             {columns.map((col) => (
//                               <th key={col.id}>{col.label}</th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {todo.subtasks.map((subtask) => (
//                             <tr key={subtask.id}>
//                               {columns.map((col) => (
//                                 <td key={col.id}>
//                                   <input
//                                     type="text"
//                                     value={subtask[col.id] || ""}
//                                     readOnly
//                                   />
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Column Input */}
//       {isAddingColumn && (
//         <div className="column-name-input">
//           <input
//             type="text"
//             value={newColumnName}
//             onChange={(e) => setNewColumnName(e.target.value)}
//             placeholder="New Column Name"
//           />
//           <button onClick={addColumn}>Add Column</button>
//         </div>
//       )}

//       {/* Undo Button */}
//       <button className="undo-button" onClick={undoLastAction}>
//         Undo Last Action
//       </button>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaPlus, FaChevronDown, FaChevronRight, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function TaskList({ token }) {
  const [todos, setTodos] = useState([]);




  useEffect(() => {
    fetchtask();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);
  // useEffect(() => {
  //   const taskExists = todos.some(todo => todo._id === openTaskId);
  //   if (!taskExists) {
  //     setOpenTaskId(null); // Close only if task is removed
  //   }
  // }, [todos]); // Run this only when `todos` update

  const caseInfo = useSelector((state) => state.screen.Caseinfo);
  const fetchUsers = async (taskdetails) => {
    let id = taskdetails?.caseId?.value?._id
    console.log("taskdetails", taskdetails?.caseId?.value?._id)
    try {
      const response = await axios.get(`${ApiEndPoint}getCaseAssignedUsersIdsAndUserName/${id}`);
      const allUsers = response.data.AssignedUsers || [];
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
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
      const response = await fetch(
        caseInfo === null ? (token?.Role === "admin" ? `${ApiEndPoint}getAllTasksWithDetails` : `${ApiEndPoint}getTasksByUser/${token?._id}`) : `${ApiEndPoint}getTasksByCase/${caseInfo?._id}`
      );

      if (!response.ok) {
        throw new Error("Error fetching folders");
      }

      const data = await response.json();
      console.log("fetch Task", data.todos);
      setTodos(data.todos)

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
  const [newAssignedUserId, setNewAssignedUserId] = useState("");



  const handleAddNewTask = async (name, caseId) => {
    if (!caseId) return alert("Please fill all fields");

    // const newTask = {
    //   taskName: { value: name },
    //   assignedUsers: { value: [{ _id: userId, UserName: users.find(u => u._id === userId)?.UserName }] },
    //   createdAt: { value: new Date().toISOString() },
    //   // add other default fields here
    //   _id: { value: Date.now().toString() },
    //   subtasks: [],
    // };

    try {
      const subtask = {
        caseId: caseId,
        createdBy: token._id,
      };
      console.log("empty sub task", subtask)
      //  const response = await axios.post(`${ApiEndPoint}createTask`, subtask);
      const response = await createSubtaskApi(selectedCaseId, subtask); // backend default fields set kare
      const newSubtask = response.data;

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
      alert("Please fill all fields");
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
      alert('Something went wrong while saving the subtask.');
    }
  };



  const toggleTask = (taskId) => {
    // setOpenTaskId(taskId);
    setOpenTaskId((prevId) => (prevId === taskId ? null : taskId));


    // setOpenTasks((prev) =>
    //   prev.includes(taskId)
    //     ? prev.filter((id) => id !== taskId)
    //     : [...prev, taskId]
    // );
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
    if (!newColumnName.trim()) return;

    const newId = newColumnName.toLowerCase().replace(/\s+/g, "-");

    // Check if the column already exists in UI
    const existingColumn = columns.find((column) => column.id === newId);
    if (existingColumn) {
      alert("⚠️ Column already exists in UI!");
      return;
    }

    try {
      // Check if the column exists in backend
      const checkRes = await axios.get(`${ApiEndPoint}CheckColumnExists/${newColumnName}`);
      if (checkRes.data.exists) {
        alert("⚠️ Column name already exists in the database!");
        return;
      }

      const encodedEnum = newColumnType === "dropdown" ? encodeURIComponent(newColumnOptions) : '';
      const url = `${ApiEndPoint}AddColumnInSchema/${newColumnName}/${newColumnType}/${encodedEnum}`;
      const response = await axios.put(url);

      if (response.status === 200) {
        alert(`✅ ${response.data.message}`);

        const newColumn = {
          id: newId,
          label: newColumnName,
          type: newColumnType,
        };

        if (newColumnType === "dropdown") {
          newColumn.options = newColumnOptions.split(',').map(opt => opt.trim());
        }

        // setColumns((prev) => [...prev, newColumn]);
        setNewColumnName("");
        setNewColumnType("text");
        setNewColumnOptions("");
        setAddingColumn(false);
        const previousOpenTaskId = openTaskId;
        await fetchtask()
        setOpenTaskId(previousOpenTaskId);
      } else {
        alert('⚠️ Something went wrong while adding the column.');
      }
    } catch (error) {
      console.error('❌ Error adding column:', error);
      alert('❌ Failed to add the column.');
    }
  };




  // const handleFieldChange = (taskId, field, newValue, isSubtask = false, subtaskId = null) => {
  //   setTodos(prev => {
  //     return prev.map(todo => {
  //       // If task id doesn't match, return the current task as is
  //       if (todo.id !== taskId) return todo;

  //       // If it's a subtask update
  //       if (isSubtask && subtaskId) {
  //         return {
  //           ...todo,
  //           subtasks: todo.subtasks.map(subtask => {
  //             // If subtask id doesn't match, return subtask as is
  //             if (subtask._id?.value !== subtaskId) return subtask;

  //             // Update the field for the specific subtask
  //             return {
  //               ...subtask,
  //               [field]: {
  //                 ...subtask[field],
  //                 value: newValue // Update the value of the field
  //               }
  //             };
  //           })
  //         };
  //       }

  //       // If it's a task update, update the field for the task
  //       return {
  //         ...todo,
  //         [field]: {
  //           ...todo[field],
  //           value: newValue
  //         }
  //       };
  //     });
  //   });
  // };

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





  const deleteColumn = async (columnName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete column "${columnName}" from all tasks?`);

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${ApiEndPoint}DeleteColumnByName/${columnName}`);

      if (response.status === 200) {
        alert(`🗑️ ${response.data.message}`);

        // Optionally remove it from local UI too
        setColumns(prev => prev.filter(col => col.id !== columnName.toLowerCase().replace(/\s+/g, "-")));

        const previousOpenTaskId = openTaskId;
        await fetchtask()
        setOpenTaskId(previousOpenTaskId); // Refresh task list
      } else {
        alert('⚠️ Column deletion failed.');
      }
    } catch (error) {
      console.error("❌ Error deleting column:", error);
      alert("❌ Failed to delete the column.");
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
      const response = await axios.post(`${ApiEndPoint}updateTaskField`, {
        taskId,
        key,
        value
      });
      setAssignedUserId([])
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


  const handleDelete = async (taskId) => {
    // Show confirmation
    if (!window.confirm("Are you sure you want to delete this task?")) return;



    try {
      const response = await fetch(`${ApiEndPoint}deleteTask/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Optionally: Show success message
      alert("Task deleted successfully");

      fetchtask()
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
    // Then trigger delete logic
    // e.g., API call and state update
    // deleteTask(taskId); // Your logic here
  };


  const handleSubtaskFieldBlur = async (taskId, key, value, subtaskId) => {
    console.log("Subtask API call on blur", { taskId, key, value, subtaskId });
    taskId = subtaskId

    try {
      const response = await axios.post(`${ApiEndPoint}updateTaskField`, {
        taskId,
        key,
        value
      });
      const previousOpenTaskId = openTaskId;
      await fetchtask()
      setOpenTaskId(previousOpenTaskId);
      console.log("Task updated:", response.data);
    } catch (error) {
      console.error("Failed to update task:", error);

    }

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
        <button className="btn btn-success" onClick={() => setShowTaskModal(true)}>
          + New Task
        </button>
      </div>

      <div className="tasklist-table-container">
        <table className="tasklist-todo-table ">
          <thead>
            <tr>
              <th style={{ width: "10px" }}></th>
              {keys.map((key) => (
                <th key={key}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div>{key}</div>
                    {(!isclient && key !== "caseId" && key !== "title" && key !== "description" && key !== "assignedUsers" && key !== "createdBy" && key !== "status" && key !== "dueDate") &&
                      <div>
                        <FaTrash
                          className="delete-column-icon"
                          onClick={() => deleteColumn(key)}
                          title="Delete column"
                        />
                      </div>
                    }
                  </div>
                </th>
              ))}
              {!isclient &&
                <th>
                  <FaPlus
                    className="plus-icon"
                    onClick={() => setAddingColumn(true)}
                  />
                </th>
              }
            </tr>
          </thead>


          <tbody>
            {todos.map((todo) => (
              <React.Fragment key={todo.id}>

                <tr>
                  <td>
                    <span className="expand-icon" onClick={() => toggleTask(todo._id)}>
                      {openTaskId?.value === todo._id?.value ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  </td>

                  {keys.map((key) => {
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

                    if (key === "caseId") {
                      content = <span>{todo.caseId?.value?.CaseNumber || ""}</span>;
                    } else if (key === "createdBy") {
                      content = <span>{todo.createdBy?.value?.UserName || ""}</span>;
                    } else if (key === "assignedUsers") {
                      const usersList = todo?.assignedUsers?.value || [];
                      if (usersList?.length === 0) {
                        content = (
                          <select
                            className="form-select"
                            defaultValue=""
                            value={assignedUserId?.UserName}
                            disabled={isclient}
                            onFocus={() => fetchUsers(todo)}
                            onChange={(e) => {
                              setAssignedUserId(e.target.value)
                              //   handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);

                            }}
                            onBlur={handleBlur}
                          >
                            <option value="">Assign User</option>
                            {users.map((user) => (
                              <option key={user?._id} value={user?.id}>
                                {user?.UserName} ({capitalizeFirst(user?.Role)})
                              </option>
                            ))}
                          </select>
                        );
                      } else {
                        content = <span>{usersList?.map((u) => u.UserName).join(", ")}</span>;
                      }
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
                          {enumOptions.map((option) => (
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
                      const today = new Date().toISOString().split("T")[0];

                      content = (
                        <input
                          type="date"
                          placeholder="dd-mm-yyyy"
                          value={dateValue}
                          min={today}
                          onChange={(e) => {
                            handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);
                          }}
                          onBlur={handleBlur}
                          disabled={isclient}
                        />
                      );
                    } else {
                      content = (
                        <input
                          type="text"
                          value={value || ""}
                          onChange={(e) => {
                            handleFieldChange(taskId, key, e.target.value, isSubtask, subtaskId);
                          }}
                          onBlur={handleBlur}
                          disabled={isclient}
                        />
                      );
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


                {openTaskId?.value === todo._id?.value && (
                  <tr>
                    <td colSpan={columns.length + 2}>
                      <table className="tasklist-todo-table subtask-table">
                        <thead>
                          <tr>
                            {keys.map((key) => (
                              <th key={key}>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <div>{key}</div>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {todo.subtasks.map((subtask) => (
                            <tr key={subtask._id?.value}>
                              {keys.map((key) => {
                                const field = subtask[key];
                                if (!field) return <td key={key} />;

                                const { value, type, enum: enumOptions, editable = true } = field;
                                let content;

                                const taskId = todo.id;
                                const subtaskId = subtask._id?.value;
                                const normalizedType = type?.toLowerCase();

                                const handleBlur = (e) => {
                                  const newValue = normalizedType === "boolean" ? e.target.checked : e.target.value;
                                  handleSubtaskFieldBlur(taskId, key, newValue, subtaskId);
                                };

                                if (key === "caseId") {
                                  content = <span>{subtask.caseId?.value?.CaseNumber || ""}</span>;
                                } else if (key === "createdBy") {
                                  content = <span>{subtask.createdBy?.value?.UserName || ""}</span>;
                                } else if (key === "assignedUsers") {
                                  const usersList = subtask.assignedUsers?.value || [];
                                  if (usersList?.length === 0) {
                                    content = (
                                      <select
                                        className="form-select"
                                        defaultValue=""
                                        value={assignedUserId?.UserName}
                                        disabled={isclient}

                                        onChange={(e) => {
                                          setAssignedUserId(e.target.value)
                                          //  handleSubtaskFieldChange(taskId, key, [e.target.value], subtaskId)
                                        }}
                                        onBlur={(e) =>
                                          handleSubtaskFieldBlur(taskId, key, [e.target.value], subtaskId)
                                        }
                                      >
                                        <option value="">Assign User</option>
                                        {users.map((user) => (
                                          <option key={user?._id} value={user._id}>
                                            {user?.UserName} ({capitalizeFirst(user?.Role)})
                                          </option>
                                        ))}
                                      </select>
                                    );
                                  } else {
                                    content = <span>{usersList?.map((u) => u.UserName).join(", ")}</span>;
                                  }
                                } else if (key === "createdAt") {
                                  content = <span>{(subtask.createdAt?.value || "").split("T")[0]}</span>;
                                } else if (!editable) {
                                  content = <span>{String(value)}</span>;
                                } else if (enumOptions) {
                                  content = (
                                    <select
                                      value={value}
                                      disabled={isclient}

                                      onChange={(e) =>
                                        handleSubtaskFieldChange(taskId, key, e.target.value, subtaskId)
                                      }
                                      onBlur={handleBlur}
                                    >
                                      {enumOptions.map((option) => (
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
                                      disabled={isclient}
                                      checked={Boolean(value)}
                                      onChange={(e) =>
                                        handleSubtaskFieldChange(taskId, key, e.target.checked, subtaskId)
                                      }
                                      onBlur={handleBlur}
                                    />
                                  );
                                } else if (normalizedType === "date") {
                                  const dateValue = value ? new Date(value).toISOString().split("T")[0] : "";
                                  const today = new Date().toISOString().split("T")[0];

                                  content = (
                                    <input
                                      type="date"
                                      disabled={isclient}

                                      value={dateValue}
                                      min={today}
                                      onChange={(e) =>
                                        handleSubtaskFieldChange(taskId, key, e.target.value, subtaskId)
                                      }
                                      onBlur={handleBlur}
                                    />
                                  );
                                } else {
                                  content = (
                                    <input
                                      type="text"
                                      disabled={isclient}

                                      value={value || ""}
                                      onChange={(e) =>
                                        handleSubtaskFieldChange(taskId, key, e.target.value, subtaskId)
                                      }
                                      onBlur={handleBlur}
                                    />
                                  );
                                }

                                return <td key={key}>{content}</td>;
                              })}

                              <td>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleDelete(subtask._id?.value)}
                                  disabled={isclient}
                                >
                                  <FaTrash />
                                </button>
                              </td>

                            </tr>
                          ))}

                          {!isclient &&

                            <tr>
                              <td colSpan={keys.length}>
                                <button
                                  className="add-subtask-button btn btn-sm btn-outline-primary"
                                  onClick={() => handleAddEmptySubtask(todo)}
                                >
                                  + Add Subtask
                                </button>
                              </td>
                            </tr>
                          }


                        </tbody>

                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {showModal && (
              <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Add Subtask</h5>
                      <button type="button" className="btn-close" onClick={closeModal}></button>
                    </div>
                    <div className="modal-body">
                      {/* <div className="mb-3">
                        <label>Case ID</label>
                        <input type="text" className="form-control" value={selectedCaseId} readOnly />
                      </div> */}
                      <div className="mb-3">
                        <label>Subtask Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newSubtaskName}
                          onChange={(e) => setNewSubtaskName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label>Assign User</label>
                        <select
                          className="form-select"
                          value={assignedUserId.UserName}
                          onChange={(e) => setAssignedUserId(e.target.value)}
                        >
                          <option value="">Select a user</option>
                          {users.map((user, index) => (
                            <option key={index} value={user?._id}>
                              {user?.UserName} ({capitalizeFirst(user?.Role)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary" onClick={closeModal}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleSaveSubtask}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
            {/* <Form.Group className="mb-3">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
            </Form.Group> */}

            <Form.Group className="mb-3">
              <Form.Label>Assign Case</Form.Label>
              <Form.Select
                value={newAssignedUserId}
                onChange={(e) => setNewAssignedUserId(e.target.value)}
              >
                <option value="">Select a Case</option>
                {allCases.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.CaseNumber}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTaskModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleAddNewTask(newTaskName, newAssignedUserId);
              setShowTaskModal(false);
              setNewTaskName("");
              setNewAssignedUserId("");
            }}
          >
            Save Task
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
