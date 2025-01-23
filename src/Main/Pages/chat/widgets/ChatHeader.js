import React, { useCallback, useEffect, useRef, useState } from "react";
import "../Chat.module.css";
import Video from "../../Component/images/video call.png";
import Voice from "../../Component/images/dialer.png";
import OPT from "../../Component/images/options.png";
import { ApiEndPoint } from "../../Component/utils/utlis";
import axios from "axios";
import { Button, Dropdown, Form, Modal } from "react-bootstrap";
import { ChromePicker } from "react-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faPlus,
  faTrash,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";

const dropdownData = {
  firstStage: ["Option 1", "Option 2", "Option 3"],
  secondStage: ["Option A", "Option B", "Option C"],
};

function SheetDropdown({
  stageId,
  stageTitle,
  dropdownLabels,
  clientId,
  triggerUpdate,
}) {
  const [showSheet, setShowSheet] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(`Select ${stageTitle}`);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [labelId, setLabelId] = useState(0);
  const [labels, setLabels] = useState(dropdownLabels);
  const [selectedLabels, setSelectedLabels] = useState({});
  const [editingLabel, setEditingLabel] = useState(null);
  const [newLabelText, setNewLabelText] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#000000");
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  // Save current state to history
  const saveToHistory = (action, labelId) => {
    setHistory((prevHistory) => [
      ...prevHistory,
      {
        action,
        labelId,
        selectedLabel,
        selectedColor,
        selectedLabels: { ...selectedLabels },
        labels: [...labels],
      },
    ]);
  };
  const fetchAssignedLabel = async () => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}/client/${clientId}/labels`
      );
      const assignedLabel = response.data.find(
        (label) => label.stage_id === stageId
      );
      if (assignedLabel) {
        setSelectedLabels((prevLabels) => ({
          ...prevLabels,
          [stageId]: {
            labelText: assignedLabel.label_text,
            labelColor: assignedLabel.label_color,
            labelId: assignedLabel.id,
          },
        }));
        setSelectedLabel(assignedLabel.label_text);
        setSelectedColor(assignedLabel.label_color);
      } else {
        // Set default label if no assigned label is found
        const defaultLabel = {
          labelText: "Default Label",
          labelColor: "#818588",
          labelId: 0,
        };
        setSelectedLabels((prevLabels) => ({
          ...prevLabels,
          [stageId]: defaultLabel,
        }));
        setSelectedLabel(defaultLabel.labelText);
        setSelectedColor(defaultLabel.labelColor);
      }
    } catch (err) {
      setError("Failed to fetch assigned label");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignedLabel();
  }, [clientId, stageId]);
  // Undo changes by reverting to the last state in history
  const undo = async () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    const action = lastState.action;
    // Revert to the last saved state
    setSelectedLabel(lastState.selectedLabel);
    setSelectedColor(lastState.selectedColor);
    setSelectedLabels(lastState.selectedLabels);
    setLabels(lastState.labels);
    if (action === "assignLabel") {
      console.log(
        "OLD Label",
        action,
        lastState.selectedLabels[stageId]?.labelId,

        lastState.selectedLabels[stageId]?.labelText
      );
      await assignLabelToClient(
        clientId,
        stageId,
        selectedLabels[stageId]?.labelId
      );
    }
    if (action === "delete") {
      const labelId = lastState.labelId;
      try {
        console.log("Reassigning label during undo:", labelId);

        await handleUndoLabel(labelId);
        fetchAssignedLabel();
      } catch (error) {
        console.error("Error reassigning label during undo:", error);
      }
    }
    // Remove the last state from history
    setHistory((prevHistory) => prevHistory.slice(0, -1));
    // Optional: Reassign the previous label if needed
    const { selectedLabels: revertedLabels } = lastState;
    const revertedLabel = revertedLabels[stageId];
  };
  // Assign a label to a client
  const assignLabelToClient = async (clientId, stageId, labelId) => {
    try {
      const labelAssignmentData = {
        stageId: stageId,
        labelId: labelId,
      };
      console.log("Assigning new label:", labelId);
      const response = await axios.post(
        `${ApiEndPoint}/client/${clientId}/label`,
        labelAssignmentData
      );
      console.log("Label assigned to client:", response.data);
      triggerUpdate();
    } catch (error) {
      console.error("Error assigning label to client:", error);
    }
  };
  // Handle label selection and save to history
  const handleLabelSelect = async (labelId, labelText, labelColor) => {
    const previousLabelId = selectedLabels[stageId]?.labelId;
    saveToHistory("assignLabel", previousLabelId); // Save current state before changing
    setSelectedLabel(labelText);
    setSelectedColor(labelColor);
    setSelectedLabels((prevLabels) => {
      const updatedLabels = {
        ...prevLabels,
        [stageId]: { labelText, labelColor, labelId },
      };
      console.log("Updated Labels:", updatedLabels);
      return updatedLabels;
    });

    try {
      // console.log(
      //   "Old label:",
      //   selectedLabels[stageId]?.labelId,
      //   "New label:",
      //   labelId
      // );
      await assignLabelToClient(clientId, stageId, labelId);
      triggerUpdate();
    } catch (error) {
      console.error("Error assigning label:", error);
    }
  };

  const handleUndoLabel = async (labelId) => {
    try {
      await axios.put(`${ApiEndPoint}/label/${labelId}/undo`);
      triggerUpdate();
    } catch (error) {
      console.error("Error undoing label:", error);
    }
  };
  // Handle label deletion
  const handleDeleteLabel = async (labelId) => {
    saveToHistory("delete", labelId); // Save current state before deletion
    try {
      await axios.put(`${ApiEndPoint}/label/${labelId}/trash`);
      setLabels((prevLabels) =>
        prevLabels.filter((label) => label.labelId !== labelId)
      );
      triggerUpdate();
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  // Handle label addition
  const handleAddLabel = async () => {
    if (!newLabelText.trim()) {
      alert("Label text cannot be empty");
      return;
    }
    saveToHistory(); // Save current state before adding new label
    try {
      const response = await axios.post(`${ApiEndPoint}/label`, {
        stageId: stageId,
        labelText: newLabelText,
        labelColor: newLabelColor,
      });
      if (response.status === 201) {
        const newLabel = {
          labelId: response.data.labelId,
          labelText: newLabelText,
          labelColor: newLabelColor,
        };
        setLabels((prevLabels) => [...prevLabels, newLabel]);
        setNewLabelText("");
        setNewLabelColor("#000000");
      }
      triggerUpdate();
    } catch (error) {
      console.error("Error adding label:", error);
    }
  };

  // Handle label editing
  const handleEditLabel = (labelId, labelText, labelColor) => {
    saveToHistory(); // Save current state before editing
    setEditingLabel({ id: labelId, label: labelText, color: labelColor });
  };

  const handleSaveEdit = async () => {
    if (!editingLabel) return;
    saveToHistory(); // Save current state before saving edit
    try {
      const response = await axios.put(
        `${ApiEndPoint}/label/${editingLabel.id}`,
        {
          labelText: editingLabel.label,
          labelColor: editingLabel.color,
          stageId: stageId,
        }
      );
      if (response.status === 200) {
        setLabels((prevLabels) =>
          prevLabels.map((item) =>
            item.labelId === editingLabel.id
              ? {
                  ...item,
                  labelText: editingLabel.label,
                  labelColor: editingLabel.color,
                }
              : item
          )
        );
        setSelectedLabel(editingLabel.label);
        setSelectedColor(editingLabel.color);
        setEditingLabel(null);
        triggerUpdate();
      }
    } catch (error) {
      console.error("Error updating label:", error);
    }
  };

  const maxRows = 6; // Maximum number of rows
  const labelsPerRow = 4;

  return (
    <div>
      {/* Button to Open the Sheet */}
      <Button
        variant="secondary"
        className="m-1 fs-12 justify-content-start"
        onClick={() => setShowSheet(true)}
        style={{
          minWidth: "100px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "calc(20% - 8px)",
          backgroundColor: selectedColor,
          borderColor: selectedColor,
          color: "#fff",
        }}
      >
        {selectedLabel || "Select Label"}
      </Button>

      {/* Modal Sheet */}
      <Modal
        show={showSheet}
        onHide={() => setShowSheet(false)}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "16px" }}>{stageTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="d-flex flex-wrap"
            style={{
              overflowY: "auto",
              overflowX: "auto",
              maxHeight: `${maxRows * 60}px`,
              whiteSpace: "nowrap",
            }}
          >
            {dropdownLabels.map((label) => (
              <div
                key={label.labelId}
                className="position-relative m-1"
                style={{
                  flex: `0 0 ${100 / labelsPerRow}%`,
                  minWidth: "150px",
                  maxWidth: "calc(25% - 8px)",
                }}
              >
                <Button
                  variant="outline-primary"
                  className="fs-12 justify-content-start"
                  style={{
                    width: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    backgroundColor: label.labelColor,
                    borderColor: label.labelColor,
                    color: "#fff",
                    fontSize: "12px",
                    textAlign: "center",
                    height: "50px",
                    maxHeight: "50px",
                    minHeight: "50px",
                  }}
                  onClick={() =>
                    handleLabelSelect(
                      label.labelId,
                      label.labelText,
                      label.labelColor
                    )
                  }
                >
                  {label.labelText}
                </Button>
                <Button
                  variant="link"
                  className="position-absolute top-0 end-0 p-0"
                  style={{ fontSize: "14px", color: "#000" }}
                  onClick={() =>
                    handleEditLabel(
                      label.labelId,
                      label.labelText,
                      label.labelColor
                    )
                  }
                >
                  <FontAwesomeIcon
                    icon={faPen}
                    color="white"
                    style={{
                      marginRight: "5px",
                    }}
                  />
                </Button>
                <Button
                  variant="link"
                  className="position-absolute bottom-0 end-0 p-0"
                  style={{ fontSize: "14px", color: "red" }}
                  onClick={() => handleDeleteLabel(label.labelId)}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    color="white"
                    style={{
                      marginRight: "5px",
                    }}
                  />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-3 d-flex justify-content-center align-items-center">
            <Button
              variant="success"
              onClick={() => undo()}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#A66CFF",
                transition: "background-color 0.3s ease", // Smooth transition
                outline: "none", // Remove outline
                border: "none", // Remove border
                marginRight: "10px", // Add space between buttons
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FF7640")} // On hover change background to orange
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#A66CFF")} // On leave, reset to original color // Align text and icon
            >
              <FontAwesomeIcon
                icon={faUndo}
                style={{ marginRight: "8px", backgroundColor: "transparent" }}
              />
              {/* Add icon */}
              Undo
            </Button>
            <Button
              variant="success"
              onClick={() => setIsAdding(true)}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#A66CFF",
                transition: "background-color 0.3s ease", // Smooth transition
                outline: "none", // Remove outline
                border: "none", // Remove border
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FF7640")} // On hover change background to orange
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#A66CFF")} // On leave, reset to original color // Align text and icon
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ marginRight: "8px", backgroundColor: "transparent" }}
              />
              {/* Add icon */}
              Add Label
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Editing Modal */}
      {editingLabel && (
        <Modal
          show={true}
          onHide={() => setEditingLabel(null)}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Label</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editLabelText">
                <Form.Label>Label Text</Form.Label>
                <Form.Control
                  type="text"
                  value={editingLabel.label}
                  onChange={(e) =>
                    setEditingLabel((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group controlId="editLabelColor" className="mt-3">
                <Form.Label>Label Color</Form.Label>
                <div
                  className="color-picker-wrapper"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ChromePicker
                    color={editingLabel.color}
                    onChangeComplete={(color) =>
                      setEditingLabel((prev) => ({ ...prev, color: color.hex }))
                    }
                  />
                </div>
              </Form.Group>
              <div className="mt-3 d-flex justify-content-center align-items-center">
                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={handleSaveEdit}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#A66CFF",
                    border: "none", // Remove border
                    transition: "background-color 0.3s ease", // Smooth transition
                    outline: "none", // Remove outline
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#FF7640")
                  } // On hover change background to orange
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#A66CFF")
                  } // On leave, reset to original color
                >
                  Save
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      {/* Adding Modal */}
      {isAdding && (
        <Modal
          show={true}
          onHide={() => setIsAdding(false)}
          backdrop="static"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Label</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* Label Text Input */}
              <Form.Group controlId="newLabelText">
                <Form.Label>Label Text</Form.Label>
                <Form.Control
                  type="text"
                  value={newLabelText}
                  onChange={(e) => setNewLabelText(e.target.value)}
                />
              </Form.Group>

              {/* Color Picker */}
              <Form.Group controlId="newLabelColor" className="mt-3">
                <Form.Label>Label Color</Form.Label>
                <div
                  className="color-picker-wrapper"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ChromePicker
                    color={newLabelColor}
                    onChangeComplete={(color) => setNewLabelColor(color.hex)}
                  />
                </div>
              </Form.Group>

              {/* Add Button */}
              <div className="mt-3 d-flex justify-content-center align-items-center">
                <Button
                  variant="success"
                  className="mt-3"
                  onClick={handleAddLabel}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#A66CFF",
                    border: "none",
                    transition: "background-color 0.3s ease",
                    outline: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#FF7640")
                  } // Hover background color
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#A66CFF")
                  } // Reset on mouse leave
                >
                  Add
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default function ChatHeader({
  refresh,
  clientId,
  name,
  phone,
  profilePic,
  color_code,
  triggerEffect,
}) {
  const [isHumanActive, setIsHumanActive] = useState(false);
  const [isClientSessionExpired, setClientSession] = useState(false);
  const [selectedFirstStage, setSelectedFirstStage] =
    useState("Select First Stage");
  const [selectedSecondStage, setSelectedSecondStage] = useState(
    "Select Second Stage"
  );
  const [showSheet, setShowSheet] = useState(false);
  const [sheetPosition, setSheetPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const [isArchived, setArchived] = useState(false);
  const firstStageLabels = [
    { label: "-7: Closed No Immediate Response", color: "#FF5733" },
    { label: "-6: Closed Duplicate", color: "#33FF57" },
    { label: "-5: Closed Free Advice", color: "#5733FF" },
    { label: "-4: Closed No Response", color: "#FF33A1" },
    { label: "-3: Closed Low Value", color: "#FFC300" },
    { label: "-2: Closed Irrelevant", color: "#6C3483" },
    { label: "-1: Closed Unsuccessful", color: "#FF6347" },
    { label: "0: Inquiry", color: "#2E8B57" },
    { label: "1: Follow up Client", color: "#20B2AA" },
    { label: "2: Follow up Lawyer", color: "#FF4500" },
    { label: "3: Free Consultation", color: "#8A2BE2" },
    { label: "3: Consultation Booked", color: "#D2691E" },
    { label: "4: Closed as Consultation", color: "#A52A2A" },
    { label: "5: Attestation", color: "#BDB76B" },
    { label: "6: Closed as Attested", color: "#8B0000" },
    { label: "7: Legal Service Booked", color: "#0000FF" },
    { label: "8: Closed as Legal Service", color: "#4682B4" },
    { label: "9: Business Setup", color: "#9ACD32" },
    { label: "10: Closed Business Setup", color: "#FF1493" },
    { label: "11: Case-Waiting for Closure", color: "#FF6347" },
    { label: "12: Converted to Client", color: "#FFD700" },
    { label: "13: Closed as Retainer", color: "#2F4F4F" },
  ];
  const [refreshKey, setRefreshKey] = useState(0);
  const secondStageLabels = [
    { label: "Incorrect Number", color: "#5D4037" },
    { label: "Email Follow Up", color: "#3F51B5" },
    { label: "Office Meeting", color: "#FFCA28" },
    { label: "Confirming Fees", color: "#FF5722" },
    { label: "Sending LFP", color: "#7E57C2" },
    { label: "Drafting a Letter", color: "#0288D1" },
    { label: "Missed Call", color: "#E91E63" },
    { label: "Send C Form", color: "#FF7043" },
    { label: "Online Meeting", color: "#3949AB" },
    { label: "Sent Case Strategy", color: "#80DEEA" },
    { label: "Sending a Quotation", color: "#8BC34A" },
    { label: "Awaiting Signature", color: "#3E2723" },
    // Add all other labels shown in your image
  ];
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isBlocked, setBlocked] = useState(false);
  // The empty dependency array ensures this only runs once on mount
  const handleButtonClick = (e) => {
    const buttonRect = e.target.getBoundingClientRect();
    setSheetPosition({
      top: buttonRect.bottom + window.scrollY, // Position just below the button
      left: buttonRect.left + window.scrollX - "150px", // Adjust to the left (150 is the approximate sheet width)
    });
    setShowSheet(!showSheet); // Toggle sheet visibility
  };

  const handleArchive = async (archive) => {
    console.log("ARchived:", archive);
    try {
      const endpoint = archive
        ? `${ApiEndPoint}/archive/${clientId}`
        : `${ApiEndPoint}/unArchive/${clientId}`;
      const response = await axios.put(endpoint);
      if (archive && response.status === 200) {
        setArchived(true);
      } else if (!archive && response.status === 200) {
        setArchived(false);
      }

      setShowSheet(false); // Close the sheet after action
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handlBlock = async (block) => {
    try {
      const endpoint = block
        ? `${ApiEndPoint}/block/${clientId}`
        : `${ApiEndPoint}/unblock/${clientId}`;
      const response = await axios.put(endpoint);

      if (block && response.status === 200) {
        setBlocked(true); // Directly use the `block` parameter to set the state
      } else if (!block && response.status === 200) {
        setBlocked(false);
      }
      setShowSheet(false); // Close the sheet after the action
    } catch (error) {
      console.error("Error blocking/unblocking client:", error);
    }
  };

  useEffect(() => {
    const getArchived = async () => {
      try {
        const response = await axios.get(
          `${ApiEndPoint}/getArchived/${clientId}`
        );

        // Ensure result is not empty before accessing properties
        if (response.data.result.length > 0) {
          const { isArchive, isBlock } = response.data.result[0]; // Access the first item in the array
          setArchived(isArchive === 1); // Set `isArchived` state based on `isArchive` value
          setBlocked(isBlock === 1);
        } else {
          setArchived(false); // Default to false if no data is returned
        }
      } catch (error) {
        console.error("Error fetching archived data:", error); // Added error handling
      }
    };

    getArchived();
  }, [clientId]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${ApiEndPoint}/stages`);
        const groupedStages = response.data.reduce((acc, item) => {
          if (!acc[item.stage_id]) {
            acc[item.stage_id] = {
              stageId: item.stage_id,
              stageName: item.stage_name,
              labels: [],
            };
          }
          acc[item.stage_id].labels.push({
            labelId: item.label_id,
            labelText: item.label_text,
            labelColor: item.label_color,
          });

          return acc;
        }, {});

        setStages(Object.values(groupedStages));
      } catch (err) {
        setError("Failed to fetch stages and labels");
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [refreshKey]);
  // Function to allow children to trigger updates
  const triggerUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };
  // useEffect(() => {
  //   const fetchInitialValue = async () => {
  //     try {
  //       const response = await axios.post(`${ApiEndPoint}/getHandOver`, {
  //         phone,
  //       });

  //       if (response.data.isHumanActive !== undefined) {
  //         setIsHumanActive(response.data.isHumanActive);
  //         // console.log("status code", response.data.isHumanActive);
  //       }
  //     } catch (error) {
  //       console.log("Failed to fetch initial value:", error);
  //       if (error.response && error.response.status === 404) {
  //         setIsHumanActive(false);
  //       }
  //     }
  //   };

  //   // Fetch the initial value immediately
  //   fetchInitialValue();

  //   // Set up the interval to fetch every 5 seconds
  //   const intervalId = setInterval(fetchInitialValue, 5000);

  //   // Clean up the interval on unmount or when dependencies change
  //   return () => clearInterval(intervalId);
  // }, [phone, triggerEffect]);
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          `${ApiEndPoint}/lastMessageTimestamp/${phone}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch timestamp");
        }

        const data = await response.json();
        const currentTime = new Date().getTime();
        const timestampTime = new Date(data.timestamp).getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        // Check if the timestamp is older than 24 hours
        // Calculate the time difference
        const timeDifference = Math.abs(currentTime - timestampTime);

        // Check if the timestamp is older than 24 hours
        if (timeDifference > twentyFourHours) {
          setClientSession(true); // Set as expired if over 24 hours
        } else {
          setClientSession(false); // Not expired if within 24 hours
        }
      } catch (error) {
        console.error("Error fetching timestamp:", error);
      }
    };

    // Call the function
    checkSession();
  }, [phone, refresh]); // Re-run the effect when the `phone` prop changes
  const toggleSwitch = async () => {
    const newIsHumanActive = !isHumanActive;
    setIsHumanActive(newIsHumanActive);

    const response = await axios.post(`${ApiEndPoint}/handOvertoHuman`, {
      phone,
      isHumanActive: newIsHumanActive,
    });
  };

  return (
    <div
      className="py-0 px-0 d-none d-lg-block mt-1 mb-1"
      style={{
        maxHeight: "9vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        className="d-flex align-items-center"
        style={{ height: "100%", marginLeft: "10px", marginRight: "10px" }}
      >
        <div
          className="position-relative"
          style={{ marginLeft: "5px", marginRight: "10px" }}
        >
          <div
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              backgroundImage: profilePic
                ? // Check if the profilePic is a valid Base64 string for JPEG, PNG, or SVG
                  profilePic.startsWith("data:image/svg+xml;base64,") // For SVG
                  ? `url(${profilePic})`
                  : profilePic.startsWith("data:image/jpeg;base64,") ||
                    profilePic.startsWith("data:image/png;base64,") // For PNG or JPEG
                  ? `url(${profilePic})`
                  : "none"
                : "none", // Default to none if no profilePic
              backgroundColor: profilePic ? "transparent" : color_code, // Use color_code if no profilePic
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              width: "30px",
              height: "30px",
              border: "1px solid #FFF",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                margin: "auto",
                textAlign: "center",
                color: "#FFF",
                fontSize: "10px",
              }}
            >
              {/* Show initials if no profilePic */}
              {!profilePic && name && name.length > 0
                ? name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : ""}
            </div>
          </div>
        </div>
        {/* Name and phone */}
        <div className="flex-grow-1 d-flex flex-column align-items-start pl-2">
          <strong className="text-start w-100">{name || "Name"}</strong>
          <div
            className="text-muted fs-30 text-start w-100"
            style={{ fontSize: "10px" }}
          >
            {phone ? `+${phone}` : ""}
            {isClientSessionExpired && (
              <div
                className="Session-Expired"
                style={{
                  color: "red",
                }}
              >
                Session Expired
              </div>
            )}
          </div>
        </div>
        <div className="d-flex align-items-center">
          {/* Dropdowns for First Stage and Second Stage */}
          <div
            className="d-flex align-items-start" // Flexbox container for horizontal alignment
            style={{
              height: "100%",
              marginLeft: "5px",
              marginRight: "5px",
              justifyContent: "space-between", // Distribute dropdowns horizontally
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              {loading && <p>Loading stages...</p>}
              {error && <p>{error}</p>}
              {!loading && !error && stages.length === 0 && (
                <p>No stages available.</p>
              )}
              {stages.map((stage) => (
                <div key={stage.stageId}>
                  <h3>{stage.stageName}</h3>
                  <SheetDropdown
                    key={stage.stageId}
                    stageId={stage.stageId}
                    stageTitle={stage.stageName}
                    dropdownLabels={stage.labels}
                    clientId={clientId}
                    triggerUpdate={triggerUpdate} // Pass triggerUpdate to child
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginRight: "15px",
            }}
          >
            <span style={{ color: isHumanActive ? "#ccc" : "#24D366" }}>
              Switch to Bot
            </span>
            <label
              style={{ position: "relative", width: "40px", height: "20px" }}
            >
              <input
                type="checkbox"
                style={{ opacity: 0, width: 0, height: 0 }}
                checked={isHumanActive}
                onChange={toggleSwitch}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isHumanActive ? "#24D366" : "#ccc",
                  transition: ".4s",
                  borderRadius: "15px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    content: '""',
                    height: "14px",
                    width: "14px",
                    left: "3px",
                    bottom: "3px",
                    backgroundColor: "white",
                    transition: ".4s",
                    borderRadius: "50%",
                    transform: isHumanActive
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                ></span>
              </span>
            </label>
            <span style={{ color: isHumanActive ? "#24D366" : "#ccc" }}>
              Switch to Agent
            </span>
          </div>
          <button
            className="mr-1"
            style={{
              marginRight: "10px",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <img src={Voice} width={25} height={25} alt="Voice" />
          </button>
          <button
            className="mr-1"
            style={{
              marginRight: "10px",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <img src={Video} width={25} height={25} alt="Video" />
          </button>
          <div>
            <button
              style={{ background: "none", border: "none", padding: 0 }}
              onClick={handleButtonClick}
            >
              <img src={OPT} width={25} height={25} alt="Options" />
            </button>
            {showSheet && (
              <div
                style={{
                  position: "absolute",
                  top: sheetPosition.top,
                  right: "60px",
                  background: "#fff",
                  border: "1px solid #ddd",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  zIndex: 1000,
                  padding: "10px",
                  width: "200px", // Adjust width for better tile appearance
                }}
              >
                {/* Archive Client Button */}
                {!isArchived && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handleArchive(true)}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Archive Client
                  </h5>
                )}

                {/* Unarchive Client Button */}
                {isArchived && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handleArchive(false)} // Corrected to unarchive
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Unarchive Client
                  </h5>
                )}

                {/* Block Client Button */}
                {!isBlocked && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handlBlock(true)} // Block
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Block
                  </h5>
                )}

                {/* Unblock Client Button */}
                {isBlocked && (
                  <h5
                    style={{
                      display: "block",
                      background: "#a66cff",
                      color: "white",
                      border: "none",
                      padding: "10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      marginBottom: "10px",
                      textAlign: "center",
                      width: "100%",
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => handlBlock(false)} // Unblock
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#FF7640")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#a66cff")
                    }
                  >
                    Unblock
                  </h5>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
