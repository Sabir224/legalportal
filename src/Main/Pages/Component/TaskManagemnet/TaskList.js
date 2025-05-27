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
import DatePicker from "react-datepicker";
import { FaPlus, FaChevronDown, FaChevronRight, FaTrash, FaChevronUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import SocketService from "../../../../SocketService";
import ErrorModal from "../../AlertModels/ErrorModal";
import ConfirmModal from "../../AlertModels/ConfirmModal";
import SuccessModal from "../../AlertModels/SuccessModal";



export default function TaskList({ token }) {

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
    console.log("Blurred & API Call for next:", { taskId, key, value, isSubtask, subtaskId });
    console.log("Blurred & API Call value date :", { value });

    try {
      const response = await axios.post(`${ApiEndPoint}updateTaskField`, {
        taskId,
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
    console.log("Subtask API call on blur", { taskId, key, value, subtaskId });

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

      console.log("Task updated:", response.data);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };


  return (
    <div
      className="card  container-fluid m-6"
      style={{
        overflowX: "auto",
        // width: "calc(100vw - 100px)", // Adjust 250px based on your sidebar width
        transition: "width 0.3s ease",
        minWidth: "82vw",
        maxWidth: "94vw"
      }}
    >      <div className="mb-4">
        <button
          className="btn btn-success"
          onClick={() => setShowTaskModal(true)}
          style={{ minWidth: '120px' }}
        >
          <FaPlus className="me-1" /> New Task
        </button>
      </div>

      {/* Desktop View (Table) */}
      <div className="d-none d-lg-block">
        <div
          style={{
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "calc(100vh - 150px)",
            maxWidth: "calc(100vw-250%)",
            display: "block",
            WebkitOverflowScrolling: "touch", // For mobile
          }}
        >
          <table
            className="table table-bordered table-hover"
            style={{
              // minWidth: "200px", // or larger if needed
              // maxWidth: "300px", // or larger if needed
              width: "max-content",
              whiteSpace: "nowrap",
            }}
          >
            <thead className="thead-light">
              <tr>
                <th style={{ width: "40px" }}></th>
                {keys?.map((key) => (
                  <th key={key} style={{ minWidth: "200px", whiteSpace: "nowrap" }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-truncate">
                        {key
                          .split(/(?=[A-Z])/)
                          .join(" ")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </div>
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
                          <div>
                            {token?.Role === "admin" && (
                              <FaTrash
                                className="ms-2 text-danger"
                                onClick={() => deleteColumn(key)}
                                title="Delete column"
                                style={{ cursor: "pointer", flexShrink: 0 }}
                              />
                            )}
                          </div>
                        )}
                    </div>
                  </th>
                ))}

                <th style={{ width: "50px" }}>
                  {token?.Role === "admin" && (
                    <FaPlus
                      className="text-primary"
                      onClick={() => setAddingColumn(true)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </th>
              </tr>
            </thead>

            <tbody>
              {todos?.map((todo) => (
                <React.Fragment key={todo._id?.value || todo.id}>
                  <tr>
                    <td>
                      <span
                        onClick={() => toggleTask(todo._id?.value || todo.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {openTaskId === (todo._id?.value || todo.id) ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </span>
                    </td>

                    {keys?.map((key) => {
                      const field = todo[key];
                      if (!field) return <td key={key} style={{ minWidth: "200px" }} />;

                      const { value, type, enum: enumOptions, editable = true } = field;
                      let content;
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

                      if (key === "caseId") {
                        content = (
                          <span className="text-truncate d-block">{todo.caseId?.value?.CaseNumber || ""}</span>
                        );
                      } else if (key === "createdBy") {
                        content = (
                          <span className="text-truncate d-block">{todo.createdBy?.value?.UserName || ""}</span>
                        );
                      } else if (key === "assignedUsers") {
                        const usersList = todo?.assignedUsers?.value || [];
                        const defaultSelectedId = usersList[0]?.id || "";
                        const currentSelectedId = assignedUserId || defaultSelectedId;

                        if (editingAssignedUser === taskId) {
                          content = (
                            <div className="dropdown w-100">
                              <select
                                className="form-select form-select-sm dropdown-toggle w-100"
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
                              >
                                <option value="">Assign User</option>
                                {users?.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.UserName} ({capitalizeFirst(user.Role)})
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        } else {
                          const isHovered = hoveredTaskId === taskId;

                          content = (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                cursor: "pointer",
                                width: '100%'
                              }}
                              onMouseEnter={() => setHoveredTaskId(taskId)}
                              onMouseLeave={() => setHoveredTaskId(null)}
                              onClick={() =>
                                !isclient && setEditingAssignedUser(taskId)
                              }
                            >
                              <span className="text-truncate d-block">
                                {usersList.length > 0
                                  ? usersList.map((u) => u.UserName).join(", ")
                                  : "Assign User"}
                              </span>
                              <i
                                className="bi bi-pencil ms-2"
                                style={{
                                  fontSize: "0.9rem",
                                  opacity: isHovered ? 1 : 0,
                                  transition: "opacity 0.2s ease",
                                  pointerEvents: "none",
                                  flexShrink: 0
                                }}
                              />
                            </span>
                          );
                        }
                      } else if (key === "createdAt") {
                        content = (
                          <span className="text-truncate d-block">{(todo.createdAt?.value || "").split("T")[0]}</span>
                        );
                      } else if (!editable) {
                        content = <span className="text-truncate d-block">{String(value)}</span>;
                      } else if (enumOptions) {
                        content = (
                          <div className="dropdown w-100">
                            <select
                              className="form-select form-select-sm w-100"
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
                            >
                              {enumOptions?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      } else if (normalizedType === "boolean") {
                        content = (
                          <div className="form-check d-flex justify-content-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
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
                            />
                          </div>
                        );
                      } else if (normalizedType === "date") {
                        const dateValue = value
                          ? new Date(value).toISOString().split("T")[0]
                          : "";
                        const today = new Date().toISOString().split("T")[0];

                        content = (
                          <DatePicker
                            className="form-control form-control-sm w-100"
                            selected={value ? new Date(value) : null}
                            onChange={(date) =>
                              handleFieldChange(taskId, key, date, isSubtask, subtaskId)
                            }
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/mm/yyyy"
                            onBlur={() =>
                              handleFieldBlur(taskId, key, value, isSubtask, subtaskId)
                            }
                            disabled={isclient}
                            dropdownMode="select"
                          />
                        );
                      } else {
                        content = (
                          <input
                            type="text"
                            className="form-control form-control-sm w-100"
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
                          />
                        );
                      }

                      return <td key={key} style={{ minWidth: "200px" }}>{content}</td>;
                    })}

                    <td style={{ width: "50px" }}>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(todo._id?.value || todo.id)}
                        disabled={isclient}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>

                  {openTaskId === (todo._id?.value || todo.id) && (
                    <tr>
                      <td colSpan={keys.length + 2}>
                        <div className="p-2" >
                          <div className="table-responsive" style={{ overflow: 'visible' }}>

                            <table className="table table-bordered table-sm ms-4" style={{ minWidth: "max-content", width: "100%", overflow: 'visible' }}>
                              <thead className="thead-light">
                                <tr>
                                  {keys?.map((key) => (
                                    <th key={key} style={{ minWidth: "200px" }}>
                                      <div className="d-flex align-items-center">
                                        <div className="text-truncate">
                                          {key
                                            .split(/(?=[A-Z])/)
                                            .join(" ")
                                            .replace(/^./, (str) => str.toUpperCase())}
                                        </div>
                                      </div>
                                    </th>
                                  ))}
                                  <th style={{ width: "50px" }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {todo?.subtasks?.map((subtask) => (
                                  <tr key={subtask._id?.value}>
                                    {keys?.map((key) => {
                                      const field = subtask[key];
                                      if (!field) return <td key={key} style={{ minWidth: "200px" }} />;

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

                                      if (key === "caseId") {
                                        content = (
                                          <span className="text-truncate d-block">{subtask.caseId?.value?.CaseNumber || ""}</span>
                                        );
                                      } else if (key === "createdBy") {
                                        content = (
                                          <span className="text-truncate d-block">{subtask.createdBy?.value?.UserName || ""}</span>
                                        );
                                      } else if (key === "assignedUsers") {
                                        const usersList = subtask.assignedUsers?.value || [];
                                        const defaultSelectedId = usersList[0]?.id || "";
                                        const currentSelectedId =
                                          assignedUserId || defaultSelectedId;

                                        if (editingAssignedSubtaskId === subtaskId) {
                                          content = (
                                            <div className="dropdown w-100">
                                              <select
                                                className="form-select form-select-sm w-100"
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
                                              >
                                                <option value="">Assign User</option>
                                                {users?.map((user) => (
                                                  <option key={user?.id} value={user?.id}>
                                                    {user?.UserName} (
                                                    {capitalizeFirst(user?.Role)})
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          );
                                        } else {
                                          content = (
                                            <span
                                              onDoubleClick={() =>
                                                !isclient &&
                                                setEditingAssignedSubtaskId(subtaskId)
                                              }
                                              style={{
                                                cursor: !isclient ? "pointer" : "default",
                                                width: '100%'
                                              }}
                                              className="text-truncate d-block"
                                            >
                                              {usersList.length > 0
                                                ? usersList.map((u) => u.UserName).join(", ")
                                                : "Assign User"}
                                            </span>
                                          );
                                        }
                                      } else if (key === "createdAt") {
                                        content = (
                                          <span className="text-truncate d-block">
                                            {(subtask.createdAt?.value || "").split("T")[0]}
                                          </span>
                                        );
                                      } else if (!editable) {
                                        content = <span className="text-truncate d-block">{String(value)}</span>;
                                      } else if (enumOptions) {
                                        content = (
                                          <div className="dropdown w-100">
                                            <select
                                              className="form-select form-select-sm w-100"
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
                                            >
                                              {enumOptions?.map((option) => (
                                                <option key={option} value={option}>
                                                  {option}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        );
                                      } else if (normalizedType === "boolean") {
                                        content = (
                                          <div className="form-check d-flex justify-content-center">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              disabled={isclient}
                                              checked={Boolean(value)}
                                              onChange={(e) =>
                                                handleSubtaskFieldChange(
                                                  taskId,
                                                  key,
                                                  e.target.checked,
                                                  subtaskId
                                                )
                                              }
                                              onBlur={handleBlur}
                                            />
                                          </div>
                                        );
                                      } else if (normalizedType === "date") {
                                        const today = new Date();

                                        content = (
                                          <DatePicker
                                            className="form-control form-control-sm w-100"
                                            selected={value ? new Date(value) : null}
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
                                            dateFormat="dd-MM-yyyy"
                                            minDate={today}
                                            disabled={isclient}
                                            placeholderText="dd/mm/yyyy"
                                            dropdownMode="select"
                                          />
                                        );
                                      } else {
                                        content = (
                                          <input
                                            type="text"
                                            className="form-control form-control-sm w-100"
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
                                          />
                                        );
                                      }

                                      return <td key={key} style={{ minWidth: "200px" }}>{content}</td>;
                                    })}
                                    <td style={{ width: "50px" }}>
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

                                {!isclient && (
                                  <tr>
                                    <td colSpan={keys.length + 1}>
                                      <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => handleAddEmptySubtask(todo)}
                                      >
                                        + Add Subtask
                                      </button>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobile View (Collapsible Cards) */}
      <div className="d-block d-lg-none">
        <div className="row" style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
          {todos?.map((todo) => (
            <div key={todo._id?.value || todo.id} className="col-12 mb-3">
              <div className="card shadow-sm">
                {/* Collapsible Card Header */}
                <div
                  className="card-header d-flex justify-content-between align-items-center bg-light p-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleTask(todo._id?.value || todo.id)}
                >
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {openTaskId === (todo._id?.value || todo.id) ? (
                        <FaChevronDown className="text-primary" />
                      ) : (
                        <FaChevronRight className="text-primary" />
                      )}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold text-truncate" style={{ maxWidth: "200px" }}>
                        {todo.title?.value || "No Title"}
                      </h6>
                      <small className="text-muted">
                        Case: {todo.caseId?.value?.CaseNumber || "N/A"}
                      </small>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(todo._id?.value || todo.id);
                    }}
                    disabled={isclient}
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Collapsible Content */}
                {openTaskId === (todo._id?.value || todo.id) && (
                  <div className="card-body">
                    <div className="row g-2">
                      {keys?.map((key) => {
                        const field = todo[key];
                        if (!field || key === "caseId" || key === "title") return null;

                        const { value, type, enum: enumOptions, editable = true } = field;
                        let content;
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

                        if (key === "createdBy") {
                          content = todo.createdBy?.value?.UserName || "";
                        } else if (key === "assignedUsers") {
                          const usersList = todo?.assignedUsers?.value || [];
                          const defaultSelectedId = usersList[0]?.id || "";
                          const currentSelectedId = assignedUserId || defaultSelectedId;

                          if (editingAssignedUser === taskId) {
                            content = (
                              <select
                                className="form-select form-select-sm"
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
                              >
                                <option value="">Assign User</option>
                                {users?.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.UserName} ({capitalizeFirst(user.Role)})
                                  </option>
                                ))}
                              </select>
                            );
                          } else {
                            content = (
                              <div
                                className="border rounded p-2 bg-light"
                                onClick={() => !isclient && setEditingAssignedUser(taskId)}
                                style={{ cursor: !isclient ? "pointer" : "default" }}
                              >
                                {usersList.length > 0
                                  ? usersList.map((u) => u.UserName).join(", ")
                                  : "Assign User"}
                              </div>
                            );
                          }
                        } else if (key === "createdAt") {
                          content = (todo.createdAt?.value || "").split("T")[0];
                        } else if (!editable) {
                          content = String(value);
                        } else if (enumOptions) {
                          content = (
                            <select
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
                              className="form-select form-select-sm"
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
                            <div className="form-check form-switch">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                role="switch"
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
                              />
                            </div>
                          );
                        } else if (normalizedType === "date") {
                          content = (
                            <DatePicker
                              selected={value ? new Date(value) : null}
                              onChange={(date) =>
                                handleFieldChange(taskId, key, date, isSubtask, subtaskId)
                              }
                              dateFormat="dd/MM/yyyy"
                              placeholderText="dd/mm/yyyy"
                              onBlur={() =>
                                handleFieldBlur(taskId, key, value, isSubtask, subtaskId)
                              }
                              disabled={isclient}
                              className="form-control form-control-sm"
                              dropdownMode="select"
                            />
                          );
                        } else {
                          content = (
                            <input
                              type="text"
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
                              className="form-control form-control-sm"
                            />
                          );
                        }

                        return (
                          <div key={key} className="col-12 col-sm-6 mb-2">
                            <label className="form-label small text-muted mb-1">
                              {key
                                .split(/(?=[A-Z])/)
                                .join(" ")
                                .replace(/^./, (str) => str.toUpperCase())}
                            </label>
                            <div className="ms-2">
                              {content}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Buttons - Fixed styling and spacing */}
                    <div className="d-flex flex-wrap justify-content-between gap-3 mt-3">
                      {!isclient && (
                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center flex-grow-1"
                          style={{ minWidth: "120px" }}
                          onClick={() => handleAddEmptySubtask(todo)}
                        >
                          <FaPlus className="me-1" /> Add Subtask
                        </button>
                      )}

                      {todo?.subtasks?.length > 0 && (
                        <button
                          className="btn btn-primary btn-sm d-flex align-items-center flex-grow-1"
                          style={{ minWidth: "120px" }}
                          onClick={() => toggleSubtasks(todo._id?.value || todo.id)}
                        >
                          {openSubtasksId === (todo._id?.value || todo.id) ? (
                            <>
                              <FaChevronUp className="me-1" />
                              Hide Subtasks
                            </>
                          ) : (
                            <>
                              <FaChevronDown className="me-1" />
                              View Subtasks ({todo.subtasks.length})
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subtasks Section - Only shown when expanded */}
                    {openSubtasksId === (todo._id?.value || todo.id) && todo?.subtasks?.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-muted mb-2">Subtasks:</h6>
                        {todo.subtasks.map((subtask) => (
                          <div key={subtask._id?.value} className="card mb-3 border-start border-3"
                            style={{ borderLeft: '3px solid #6c757d' }} // gray-black
                          >
                            <div className="card-header bg-light d-flex justify-content-between align-items-center p-2">
                              <small className="fw-bold">
                                {subtask.title?.value || "Untitled Subtask"}
                              </small>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(subtask._id?.value)}
                                disabled={isclient}
                              >
                                <FaTrash />
                              </button>
                            </div>
                            <div className="card-body p-3">
                              <div className="row g-2">
                                {keys?.map((key) => {
                                  const field = subtask[key];
                                  if (!field) return null;

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

                                  if (key === "caseId") {
                                    content = subtask.caseId?.value?.CaseNumber || "";
                                  } else if (key === "createdBy") {
                                    content = subtask.createdBy?.value?.UserName || "";
                                  } else if (key === "assignedUsers") {
                                    const usersList = subtask.assignedUsers?.value || [];
                                    const defaultSelectedId = usersList[0]?.id || "";
                                    const currentSelectedId = assignedUserId || defaultSelectedId;

                                    if (editingAssignedSubtaskId === subtaskId) {
                                      content = (
                                        <select
                                          className="form-select form-select-sm"
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
                                        >
                                          <option value="">Assign User</option>
                                          {users?.map((user) => (
                                            <option key={user?.id} value={user?.id}>
                                              {user?.UserName} (
                                              {capitalizeFirst(user?.Role)})
                                            </option>
                                          ))}
                                        </select>
                                      );
                                    } else {
                                      content = (
                                        <div
                                          className="border rounded p-2 bg-light"
                                          onClick={() => !isclient && setEditingAssignedSubtaskId(subtaskId)}
                                          style={{ cursor: !isclient ? "pointer" : "default" }}
                                        >
                                          {usersList.length > 0
                                            ? usersList.map((u) => u.UserName).join(", ")
                                            : "Assign User"}
                                        </div>
                                      );
                                    }
                                  } else if (key === "createdAt") {
                                    content = (subtask.createdAt?.value || "").split("T")[0];
                                  } else if (!editable) {
                                    content = String(value);
                                  } else if (enumOptions) {
                                    content = (
                                      <select
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
                                        className="form-select form-select-sm"
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
                                      <div className="form-check form-switch">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          role="switch"
                                          disabled={isclient}
                                          checked={Boolean(value)}
                                          onChange={(e) =>
                                            handleSubtaskFieldChange(
                                              taskId,
                                              key,
                                              e.target.checked,
                                              subtaskId
                                            )
                                          }
                                          onBlur={handleBlur}
                                        />
                                      </div>
                                    );
                                  } else if (normalizedType === "date") {
                                    const today = new Date();
                                    content = (
                                      <DatePicker
                                        selected={value ? new Date(value) : null}
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
                                        dateFormat="dd-MM-yyyy"
                                        minDate={today}
                                        disabled={isclient}
                                        placeholderText="dd/mm/yyyy"
                                        className="form-control form-control-sm"
                                        dropdownMode="select"
                                      />
                                    );
                                  } else {
                                    content = (
                                      <input
                                        type="text"
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
                                        className="form-control form-control-sm"
                                      />
                                    );
                                  }

                                  return (
                                    <div key={key} className="col-12 col-sm-6 mb-2">
                                      <label className="form-label small text-muted mb-1">
                                        {key
                                          .split(/(?=[A-Z])/)
                                          .join(" ")
                                          .replace(/^./, (str) => str.toUpperCase())}
                                      </label>
                                      <div className="ms-2">
                                        {content}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Column Add Modal */}
      {addingColumn && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">Add New Column</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAddingColumn(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Column Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter New Column Name"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Column Type</label>
                  <select
                    className="form-select"
                    value={newColumnType}
                    onChange={(e) => setNewColumnType(e.target.value)}
                  >
                    <option value="text">Text</option>
                    <option value="dropdown">Dropdown</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="date">Date</option>
                  </select>
                </div>

                {newColumnType === "dropdown" && (
                  <div className="mb-3">
                    <label className="form-label">Options (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Option1, Option2, Option3"
                      value={newColumnOptions}
                      onChange={(e) => setNewColumnOptions(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setAddingColumn(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={addColumn}>
                  Add Column
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>Add New Task</Modal.Title>
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
                      setIsUserInvalid(false);
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

        <Modal.Footer className="justify-content-center">
          <div className="d-flex gap-3">
            <Button
              variant="primary"
              onClick={() => setShowTaskModal(false)}
              style={{ minWidth: "120px" }}
            >
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
              style={{ minWidth: "120px" }}
            >
              Save Task
            </Button>
          </div>
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
