import React, { useEffect, useState } from "react";
import TaskViewModal from "./TaskViewModal";
import TaskEditModal from "./TaskEditModal";
import { ApiEndPoint } from "../utils/utlis";
import {
  Button,
  Card,
  Col,
  Modal,
  Form,
  Row,
  Dropdown,
} from "react-bootstrap";
import axios from "axios";
import ErrorModal from "../../AlertModels/ErrorModal";
import SuccessModal from "../../AlertModels/SuccessModal";

const TaskList = ({ token }) => {
  const [taskList, setTaskList] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [IsDeleteTask, setIsDeleteTask] = useState(false);
  const [deleteTask, setDeteleTask] = useState(null);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [message, setMessage] = useState("");


  useEffect(() => {
    fetchtask()
  }, []);

  const fetchtask = async () => {
    try {
      const response = await fetch(`${ApiEndPoint}getAllTasksWithDetails`);

      if (!response.ok) {
        throw new Error('Error fetching folders');
      }

      const data = await response.json();
      console.log("fetch Task", data.tasks);
      setTaskList(data.tasks)

    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting task.");
      setShowError(true);

    }
  };

  const editTask = (task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };
  const deletemodal = (task) => {
    setDeteleTask(task)
    setIsDeleteTask(true);
  };

  const saveTaskEdits = (updatedTask) => {
    const updatedList = taskList.map((t) =>
      t === selectedTask ? updatedTask : t
    );
    setTaskList(updatedList);
  };

  const viewTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };
  // Action handlers
  //const viewTask = (task) => alert(`Viewing Task: ${task.title}`);
  // const editTask = (task) => alert(`Editing Task: ${task.title}`);
  const handleDeleteTask = async () => {
    console.log("deleteTask", deleteTask)
    try {
      const response = await axios.delete(`${ApiEndPoint}deleteTask/${deleteTask?._id}`);
      setDeteleTask(null)
      setIsDeleteTask(false)
      setMessage("Task Detele successfully");
      setShowSuccess(true);
      fetchtask()
      return response.data;
    } catch (error) {
      setShowSuccess(true);
      console.error("Failed to delete task:", error);
      setShowError(true)
      //throw error;
    }

  };
  const markCompleted = (task) => {
    const updated = taskList.map((t) =>
      t === task ? { ...t, status: "Completed" } : t
    );
    setTaskList(updated);
  };

  return (
    // <div
    //   className="container-fluid m-0 p-0"
    //   style={{ height: "84vh", overflowY: "auto" }}
    // >
    <div className="" style={{ height: "84vh", overflowY: "auto" }}>
      <div className="card mb-3 shadow">
        <div
          className="card-header d-flex justify-content-between align-items-center px-3"
          style={{ height: "8vh" }}
        >
          <span className="col text-start fw-bold">Status</span>
          <span className="col text-start fw-bold">Task Title</span>
          <span className="col text-start fw-bold">Due Date</span>
          <span className="col text-end fw-bold">Actions</span>
        </div>

        <div className="card-list p-0">
          {taskList.map((task, index) => (
            <div key={index}>
              <div
                className="d-flex justify-content-between align-items-center p-3 border-bottom"
                style={{ cursor: "pointer" }}
              >
                <span className="col d-flex align-items-center text-start">
                  <span
                    className={`me-2 rounded-circle ${task.status.toLowerCase() === "completed"
                      ? "bg-success"
                      : task.status.toLowerCase() === "overdue"
                        ? "bg-danger"
                        : "bg-warning"
                      }`}
                    style={{
                      width: "10px",
                      height: "10px",
                      display: "inline-block",
                    }}
                  ></span>
                  {task.status}
                </span>

                <span className="col text-start">{task.title}</span>
                <span className="col text-start">{task.dueDate.split("T")[0]}</span>

                <div className="col text-end">
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => viewTask(task)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => deletemodal(task)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => markCompleted(task)}
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TaskViewModal
          show={modalOpen}
          handleClose={() => setModalOpen(false)}
          task={selectedTask}
        />
        <TaskEditModal
          show={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          task={selectedTask}
          handleSave={saveTaskEdits}
        />


        <Modal show={IsDeleteTask} onHide={() => setIsDeleteTask(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Task Delete</Modal.Title>
          </Modal.Header>

          <Modal.Body className="text-center">
            <p className="fs-5">Are you sure you want to delete this Task?</p>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-end">
            <Button variant="secondary" onClick={() => setIsDeleteTask(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDeleteTask()}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>


        <SuccessModal
          show={showSuccess}
          handleClose={() => setShowSuccess(false)}
          message={message}
        />
        <ErrorModal
          show={showError}
          handleClose={() => setShowError(false)}
          message={message}
        />

      </div>
    </div>
  );
};

export default TaskList;
