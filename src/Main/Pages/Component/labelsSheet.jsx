import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { FaTrash, FaUndo } from "react-icons/fa";
import axios from "axios";
import { ApiEndPoint } from "./utils/utlis";

function LabelSheet() {
  const [groupedLabels, setGroupedLabels] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLabels();
  }, []);

  const fetchLabels = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${ApiEndPoint}/stages/getTrashLabel`);
      groupLabelsByStage(response.data);
    } catch (error) {
      console.error("Error fetching labels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupLabelsByStage = (labels) => {
    const grouped = labels.reduce((acc, label) => {
      const { stage_name } = label;
      if (!acc[stage_name]) {
        acc[stage_name] = [];
      }
      acc[stage_name].push(label);
      return acc;
    }, {});
    setGroupedLabels(grouped);
  };

  const updateLabelState = (labelId, action) => {
    setGroupedLabels((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((stage) => {
        updated[stage] = updated[stage].filter((label) => {
          if (label.label_id === labelId) {
            if (action === "delete") return false; // Remove deleted label
            if (action === "undo") return false; // Remove undone label
          }
          return true;
        });
      });

      // Remove empty stages if all labels are deleted/undone
      Object.keys(updated).forEach((stage) => {
        if (updated[stage].length === 0) {
          delete updated[stage];
        }
      });

      return updated;
    });
  };

  const handleDeleteLabel = async (labelId) => {
    try {
      await axios.delete(`${ApiEndPoint}/label/${labelId}`);
      updateLabelState(labelId, "delete"); // Remove the label from state
    } catch (error) {
      console.error("Error deleting label:", error);
    }
  };

  const handleUndoLabel = async (labelId) => {
    try {
      await axios.put(`${ApiEndPoint}/label/${labelId}/undo`);
      updateLabelState(labelId, "undo"); // Remove the label from state
    } catch (error) {
      console.error("Error undoing label:", error);
    }
  };

  return (
    <div className="p-3">
      {isLoading ? (
        <div className="text-center py-2">
          <Spinner animation="border" size="sm" />
          <p>Loading labels...</p>
        </div>
      ) : Object.keys(groupedLabels).length > 0 ? (
        Object.keys(groupedLabels).map((stage) => (
          <div key={stage} className="mb-4">
            <h4 className="mb-3">{stage}</h4>
            <Row>
              {groupedLabels[stage].map((label) => (
                <Col
                  key={label.label_id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-3"
                >
                  <Card
                    style={{
                      backgroundColor: label.label_color,
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                    }}
                    className="p-3 d-flex justify-content-between"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ fontSize: "1rem", fontWeight: "500" }}>
                        {label.label_text}
                      </span>
                      <div className="d-flex flex-column gap-2">
                        {" "}
                        {/* Stack icons vertically with spacing */}
                        <FaTrash
                          className="fs-6" // Smaller font size for icons
                          style={{ cursor: "pointer" }}
                          title="Delete"
                          onClick={() => handleDeleteLabel(label.label_id)}
                        />
                        <FaUndo
                          className="fs-6"
                          style={{ cursor: "pointer" }}
                          title="Undo"
                          onClick={() => handleUndoLabel(label.label_id)}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))
      ) : (
        <p>No labels available.</p>
      )}
    </div>
  );
}

export default LabelSheet;
