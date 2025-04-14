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
const clientPermissionList = ["view_cases"];

const permissionLabels = {
  manage_cases: "Manage Cases",
  message_clients: "Message Clients",
  manage_documents: "Manage Documents",
};
const ClientpermissionLabels = {
  view_cases: "View Cases",
};

const CaseAssignmentForm = ({ selectedCase, casedetails }) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [userPermissions, setUserPermissions] = useState({});
  const [clientdetails, setClientDetails] = useState();
  const [clientname, setclientname] = useState(null);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.cases);

  // useEffect(() => {
  //   axios
  //     .get(`${ApiEndPoint}/legalUsers`)
  //     .then((res) => setUsers(res.data))
  //     .catch((err) => console.error("Error fetching users:", err));
  // }, []);
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${ApiEndPoint}getAllUser`);
      const allUsers = response.data.users || [];

      let filteredUsers = allUsers;
      let clientUser = null;

      if (casedetails?.ClientId) {
        clientUser = allUsers.find((user) => user._id === casedetails.ClientId);

        filteredUsers = allUsers.filter(
          (user) => user.Role !== "client" || user._id === casedetails.ClientId
        );

        if (clientUser) {
          setSelectedUsers([
            {
              value: clientUser,
              label: `${clientUser.UserName} (${capitalizeFirst(clientUser.Role)})`,
              isClient: true,
            },
          ]);
          setclientname(clientUser.UserName);
        }
      }

      setUsers(filteredUsers);
      return allUsers;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };


  useEffect(() => {
    if (!selectedCase || !casedetails || users.length === 0) return;

    const caseData = casedetails; // directly use the object

    const selected = [];

    caseData.AssignedUsers?.forEach((assigned) => {
      const user = users.find((u) => u._id === assigned.UserId);
      if (user) {
        selected.push({
          value: user,
          label: `${user.UserName} (${capitalizeFirst(user.Role)})`,
        });

        if (user.Role.toLowerCase() === "client") {
          setClientPermissions((prev) => ({
            ...prev,
            [user._id]: caseData.ClientPermissions || [],
          }));
          setclientname(user.UserName);
        } else {
          setUserPermissions((prev) => ({
            ...prev,
            [user._id]: assigned.Permissions || [],
          }));
        }
      }
    });

    // Add client explicitly if not in AssignedUsers
    if (caseData.ClientId) {
      const client = users.find((u) => u._id === caseData.ClientId);
      if (client && !selected.some((s) => s.value._id === client._id)) {
        selected.unshift({
          value: client,
          label: `${client.UserName} (${capitalizeFirst(client.Role)})`,
        });

        setClientPermissions((prev) => ({
          ...prev,
          [client._id]: caseData.ClientPermissions || [],
        }));
        setclientname(client.UserName);
      }
    }

    setSelectedUsers(selected);
  }, [selectedCase, casedetails, users]);

  // const handleAssign = async (e) => {
  //   e.preventDefault();

  //   if (!selectedCase || selectedUsers.length === 0) {
  //     alert("Please select a case and users.");
  //     return;
  //   }
  //   // const usersData = selectedUsers.map((user) => ({
  //   //   userId: user.value, // Ensure this is correct
  //   //   permissions: userPermissions[user.value] || [], // Ensure permissions exist
  //   // }));

  //   const usersData = selectedUsers
  //     .filter((user) => user.value.Role.toLowerCase() !== "client")
  //     .map((user) => ({
  //       userId: user.value._id,
  //       permissions: userPermissions[user.value._id] || [],
  //     }));

  //   console.log("usersData", usersData)
  //   // const CaseClientId = selectedUsers
  //   // .filter((user) => user.value.Role.toLowerCase() === "client")
  //   // .map((user) => user.value._id);

  //   const CaseClient = selectedUsers.find(
  //     (user) => user.value.Role.toLowerCase() === "client"
  //   )?.value._id;

  //   console.log("Users to Assign:", usersData); // Debugging users
  //   console.log("Selected Case ID:", selectedCase);
  //   console.log("Permissions List:", userPermissions); // Check permissions
  //   console.log("CaseClientId :", CaseClient); // Check permissions

  //   // try {
  //   //   const response = await dispatch(
  //   //     assignCase({
  //   //       caseId: selectedCase,
  //   //       users: usersData,
  //   //       permissionList: userPermissions,
  //   //       CaseClientId: CaseClient,// Check if permissionsList is correct
  //   //     })
  //   //   ).unwrap();

  //   //   console.log("Assignment Successful:", response);
  //   //   alert("Users assigned successfully!");
  //   //   setSelectedUsers([]);
  //   //   setUserPermissions({});
  //   // } catch (err) {
  //   //   console.error("Error assigning case:", err);
  //   //   alert(`Failed to assign users: ${err.message || err}`);
  //   // }
  // };

  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedCase || selectedUsers.length === 0) {
      alert("Please select a case and users.");
      return;
    }

    // Separate legal users and the client
    const legalUsers = selectedUsers.filter(
      (user) => user.value.Role?.toLowerCase() !== "client"
    );

    const CaseClient = selectedUsers.find(
      (user) => user.value.Role?.toLowerCase() === "client"
    )?.value._id;

    // Build users data for legal users
    const usersData = legalUsers.map((user) => ({
      userId: user.value._id,
      permissions: userPermissions[user.value._id] || [],
    }));

    // Build client permissions as a map (even if the client exists)
    const clientPermissionMap = CaseClient
      ? {
        [CaseClient]: clientPermissions[CaseClient] || [],
      }
      : {};

    console.log("Users to Assign:", usersData);
    console.log("Selected Case ID:", selectedCase);
    console.log("CaseClientId:", CaseClient);
    console.log("Client Permissions:", clientPermissionMap);

    try {
      const response = await dispatch(
        assignCase({
          caseId: selectedCase,
          users: usersData,
          permissionList: userPermissions,
          clientPermissions: clientPermissionMap,  // Sending client permissions as a map
          CaseClientId: CaseClient || null,
        })
      ).unwrap();

      console.log("Assignment Successful:", response);
      alert("Users assigned successfully!");

      // Reset the form state
      setSelectedUsers([]);
      setUserPermissions({});
      setClientPermissions({});
      setclientname(null);
    } catch (err) {
      console.error("Error assigning case:", err);
      alert(`Failed to assign users: ${err.message || err}`);
    }
  };


  const capitalizeFirst = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // const [selectedUsers, setSelectedUsers] = useState([]);
  // const [userPermissions, setUserPermissions] = useState({});
  const [clientPermissions, setClientPermissions] = useState({});
  return (
    <div className="container mt-1 p-4 rounded shadow main-bgcolor">
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAssign}>
        {/* <div className="mb-4">
          <label className="form-label fw-bold" style={{ color: "#c0a262" }}>
            Select Users
          </label>
          <Select
            options={users.map((user) => ({
              value: user,
              label: `${user.UserName}   (${capitalizeFirst(user.Role)})`,
            }))}
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            value={selectedUsers}
            onChange={(selected) => setSelectedUsers(selected || [])}
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
        </div> */}
        {/* <Select
          options={users.map((user) => ({
            value: user,
            label: `${user.UserName} (${capitalizeFirst(user.Role)})`,
          }))}
          isMulti
          className="basic-multi-select"
          classNamePrefix="select"
          value={selectedUsers}
          onChange={(selected) => {
            if (!selected) {
              setSelectedUsers([]);
              return;
            }

            // Separate clients and others
            const clients = selected.filter((s) => s.value.Role.toLowerCase() === "client");
            const others = selected.filter((s) => s.value.Role.toLowerCase() !== "client");

            // Only allow one client, keep latest selected client if multiple
            const latestClient = clients.length > 0 ? [clients[clients.length - 1]] : [];

            // Combine into final selection
            setSelectedUsers([...latestClient, ...others]);
          }}
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

           
              {clientname !== null &&
                <div
                  className="p-3 mb-3 rounded shadow-sm"
                  style={{
                    backgroundColor: "#1A2B4A",
                    border: "1px solid #c0a262",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="m-0" style={{ color: "#FFFFFF" }}>
                      {clientname} (Client)
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
                  disabled={true} 
                    >
                      <FontAwesomeIcon icon={faTimes} size={16} />
                    </button>
                  </div>
                </div>
              }
            

            {selectedUsers.map((user) => (
              <div
                key={user.value._id}
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
                        selectedUsers.filter((u) => u.value._id !== user.value._id)
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} size={16} />
                  </button>
                </div>
                {user.value.Role !== 'client' ? (
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
                          checked={(userPermissions[user.value._id] || []).includes(
                            perm
                          )}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUserPermissions((prev) => ({
                              ...prev,
                              [user.value._id]: checked
                                ? [...(prev[user.value._id] || []), perm]
                                : prev[user.value._id].filter((p) => p !== perm),
                            }));
                          }}
                        />
                        <label
                          className="form-check-label"
                          style={{ color: "#FFFFFF" }}
                        >
                          {permissionLabels[perm] || perm}{" "}
                        </label>
                      </div>
                    ))}
                  </div>
                )
                  :
                  (

                    <div>

                    </div>
                  )}
              </div>

            ))}
          </div>
        )} */}

        <Select
          isMulti
          value={selectedUsers}
          onChange={(selectedOptions) => {
            if (!selectedOptions) return;
          
            const sanitizedOptions = selectedOptions.map((opt) => {
              const user = opt?.value || opt;
              return {
                value: user,
                label: `${user.UserName} (${capitalizeFirst(user.Role)})`,
                isClient: user.Role === "client",
              };
            });
          
            // Separate clients and non-clients
            const clients = sanitizedOptions.filter((opt) => opt.isClient);
            const nonClients = sanitizedOptions.filter((opt) => !opt.isClient);
          
            let finalSelection = [];
          
            if (clients.length > 0) {
              // If there's at least one client, only pick the last one (override others)
              const latestClient = clients[clients.length - 1];
              finalSelection = [latestClient, ...nonClients];
            } else {
              finalSelection = nonClients;
            }
          
            setSelectedUsers(finalSelection);
          }}
          
          options={[
            ...(!casedetails?.ClientId
              ? users
              : users.filter((u) => u.Role !== "client")
            ).map((user) => ({
              value: user,
              label: `${user.UserName} (${capitalizeFirst(user.Role)})`,
              isClient: user.Role === "client",
            })),
          ]}
          isOptionDisabled={(option) =>
            option.value?.Role === "client" && !!casedetails?.ClientId
          }
        />

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

            {/* {selectedUsers.map((user) => (
              <div
                key={user?.value?._id}
                className="p-3 mb-3 rounded shadow-sm"
                style={{
                  backgroundColor: "#1A2B4A",
                  border: "1px solid #c0a262",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0" style={{ color: "#FFFFFF" }}>
                    {user?.label || "Unknown"}
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
                    disabled={clientname !== null}
                    onClick={() => {
                      const newList = selectedUsers.filter(
                        (u) => u?.value?._id !== user?.value?._id
                      );
                      setSelectedUsers(newList);
                      setUserPermissions((prev) => {
                        const updated = { ...prev };
                        delete updated[user?.value?._id];
                        return updated;
                      });
                      setClientPermissions((prev) => {
                        const updated = { ...prev };
                        delete updated[user?.value?._id];
                        return updated;
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} size={16} />
                  </button>
                </div>

                {user?.value?.Role?.toLowerCase() !== "client" ? (
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
                          checked={
                            (userPermissions[user?.value?._id] || []).includes(perm)
                          }
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUserPermissions((prev) => ({
                              ...prev,
                              [user?.value?._id]: checked
                                ? [...(prev[user?.value?._id] || []), perm]
                                : (prev[user?.value?._id] || []).filter(
                                  (p) => p !== perm
                                ),
                            }));
                          }}
                        />
                        <label
                          className="form-check-label"
                          style={{ color: "#FFFFFF" }}
                        >
                          {permissionLabels[perm] || perm}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {clientname === null && (
                      <div>
                        {user?.value?.Role?.toLowerCase() === "client" && (
                          <div className="mt-3">
                            <label
                              className="form-label fw-bold"
                              style={{ color: "#c0a262" }}
                            >
                              Client Permissions
                            </label>

                            {clientPermissionList.map((perm) => (
                              <div key={perm} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={perm}
                                  checked={
                                    (clientPermissions[user?.value?._id] || []).includes(perm)
                                  }
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setClientPermissions((prev) => ({
                                      ...prev,
                                      [user?.value?._id]: checked
                                        ? [...(prev[user?.value?._id] || []), perm]
                                        : (prev[user?.value?._id] || []).filter(
                                          (p) => p !== perm
                                        ),
                                    }));
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  style={{ color: "#FFFFFF" }}
                                >
                                  {ClientpermissionLabels[perm] || perm}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))} */}

            {selectedUsers.map((user) => (
              <div
                key={user?.value?._id}
                className="p-3 mb-3 rounded shadow-sm"
                style={{
                  backgroundColor: "#1A2B4A",
                  border: "1px solid #c0a262",
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="m-0" style={{ color: "#FFFFFF" }}>
                    {user?.label || "Unknown"}
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
                    disabled={user?.isClient}
                    onClick={() => {
                      const newList = selectedUsers.filter(
                        (u) => u?.value?._id !== user?.value?._id
                      );
                      setSelectedUsers(newList);
                      setUserPermissions((prev) => {
                        const updated = { ...prev };
                        delete updated[user?.value?._id];
                        return updated;
                      });
                      setClientPermissions((prev) => {
                        const updated = { ...prev };
                        delete updated[user?.value?._id];
                        return updated;
                      });
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} size={16} />
                  </button>
                </div>

                {user?.value?.Role?.toLowerCase() !== "client" ? (
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
                          checked={
                            (userPermissions[user?.value?._id] || []).includes(perm)
                          }
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUserPermissions((prev) => ({
                              ...prev,
                              [user?.value?._id]: checked
                                ? [...(prev[user?.value?._id] || []), perm]
                                : (prev[user?.value?._id] || []).filter(
                                  (p) => p !== perm
                                ),
                            }));
                          }}
                        />
                        <label
                          className="form-check-label"
                          style={{ color: "#FFFFFF" }}
                        >
                          {permissionLabels[perm] || perm}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3">
                    <label
                      className="form-label fw-bold"
                      style={{ color: "#c0a262" }}
                    >
                      Client Permissions
                    </label>

                    {clientPermissionList.map((perm) => (
                      <div key={perm} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={perm}
                          checked={
                            (clientPermissions[user?.value?._id] || casedetails.ClientPermissions || []).includes(perm)
                          }
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setClientPermissions((prev) => ({
                              ...prev,
                              [user?.value?._id]: checked
                                ? [...(prev[user?.value?._id] || []), perm]
                                : (prev[user?.value?._id] || []).filter(
                                  (p) => p !== perm
                                ),
                            }));
                          }}
                        />
                        <label
                          className="form-check-label"
                          style={{ color: "#FFFFFF" }}
                        >
                          {ClientpermissionLabels[perm] || perm}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
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
