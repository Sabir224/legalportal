import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select"; // Import react-select

import axios from "axios";
import { assignCase } from "../../../REDUX/CaseSice";
import { ApiEndPoint } from "../Component/utils/utlis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const permissionList = {
  admin: "ALL",
  legal: ["manage_cases", "message_clients", "manage_documents"],
};
const permissionLabels = {
  manage_cases: "Manage Cases",
  message_clients: "Message Clients",
  manage_documents: "Manage Documents",
};

const CaseAssignmentForm = ({ selectedCase }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.cases);

  useEffect(() => {
    axios
      .get(`${ApiEndPoint}/legalUsers`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedCase?._id || selectedUsers.length === 0) {
      alert("Please select a case and users.");
      return;
    }

    const usersData = selectedUsers.map((user) => ({
      userId: user.value, // Ensure this is correct
      permissions: userPermissions[user.value] || [], // Ensure permissions exist
    }));

    console.log("Users to Assign:", usersData); // Debugging users
    console.log("Selected Case ID:", selectedCase._id);
    console.log("Permissions List:", userPermissions); // Check permissions

    try {
      const response = await dispatch(
        assignCase({
          caseId: selectedCase._id,
          users: usersData,
          permissionList: userPermissions, // Check if permissionsList is correct
        })
      ).unwrap();

      console.log("Assignment Successful:", response);
      alert("Users assigned successfully!");
      setSelectedUsers([]);
      setUserPermissions({});
    } catch (err) {
      console.error("Error assigning case:", err);
      alert(`Failed to assign users: ${err.message || err}`);
    }
  };

  return (
    <div className="container mt-1 p-4 rounded shadow main-bgcolor">
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAssign}>
        <div className="mb-4">
          <label className="form-label fw-bold" style={{ color: "#c0a262" }}>
            Select Users
          </label>
          <Select
            options={users.map((user) => ({
              value: user._id,
              label: `${user.UserName}`,
            }))}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedUsers}
            onChange={setSelectedUsers}
            placeholder="Search & Select Users..."
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#0E1833",
                color: "#FFFFFF",
                border: "1px solid #c0a262",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#0E1833",
              }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: isFocused ? "#c0a262" : "#0E1833",
                color: "#FFFFFF",
              }),
            }}
          />
        </div>

        {selectedUsers.length > 0 && (
          <div
            className="mt-4"
            style={{
              maxHeight: "340px",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            <h5 style={{ color: "#c0a262" }}>Assigned Users</h5>
            {selectedUsers.map((user) => (
              <div
                key={user.value}
                className="p-3 mb-3 rounded shadow-sm"
                style={{
                  backgroundColor: "#1A2B4A",
                  border: "1px solid #c0a262",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0" style={{ color: "#FFFFFF" }}>
                    {user.label}
                  </h6>
                  <button
                    className="btn btn-sm d-flex align-items-center justify-content-center"
                    style={{
                      color: "white",
                      border: "none",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                    onClick={() =>
                      setSelectedUsers(
                        selectedUsers.filter((u) => u.value !== user.value)
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} size={16} />
                  </button>
                </div>

                <div className="mt-3">
                  <label
                    className="form-label fw-bold"
                    style={{ color: "#c0a262" }}
                  >
                    Case Permissions
                  </label>

                  {permissionList?.legal?.map((perm) => (
                    <div key={perm} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={perm}
                        checked={(userPermissions[user.value] || []).includes(
                          perm
                        )}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setUserPermissions((prev) => ({
                            ...prev,
                            [user.value]: checked
                              ? [...(prev[user.value] || []), perm]
                              : prev[user.value].filter((p) => p !== perm),
                          }));
                        }}
                      />
                      <label
                        className="form-check-label"
                        style={{ color: "#FFFFFF" }}
                      >
                        {permissionLabels[perm] || perm}{" "}
                        {/* Use human-readable text */}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn mt-4 w-20"
            disabled={loading}
            style={{
              backgroundColor: "#c0a262",
              color: "white",
              fontWeight: "bold",
              border: "2px solid #c0a262",
            }}
          >
            {loading ? "Assigning..." : "Assign Users"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaseAssignmentForm;
