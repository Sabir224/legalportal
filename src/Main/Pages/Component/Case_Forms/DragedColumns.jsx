import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TextField,
  FormControl,
  Select,
  Checkbox,
  Button,
} from "@mui/material";
import { Delete, MoreVert, PersonAdd } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";

const DraggableHeader = ({ id, index, moveColumn, children, isClientName }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <TableCell
      ref={ref}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        minWidth: 120,
        whiteSpace: "nowrap",
        fontWeight: "bold",

        color: "#D4AF37",
        position: "sticky",
        top: 0,
        left: isClientName ? 0 : undefined,
        zIndex: isClientName ? 3 : 1,
        borderBottom: "2px solid #D4AF37",
      }}
    >
      {children}
    </TableCell>
  );
};

const DraggableTable = ({
  keys,
  todos,
  isSubtask,
  isclient,
  handleFieldBlur,
  handleFieldChange,
  handleUserClick,
  handleClientClick,
  handleMenuOpen,
  handleMenuClose,
  handleSignup,
  handleDelete,
  anchorEl,
  selectedTodo,
  formatHeaderLabel,
}) => {
  const [columns, setColumns] = useState(
    keys.filter((key) => key !== "userId" && key !== "userName")
  );

  // Load saved column order from localStorage
  useEffect(() => {
    const savedColumns = localStorage.getItem("tableColumns");
    if (savedColumns) setColumns(JSON.parse(savedColumns));
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem("tableColumns", JSON.stringify(columns));
  }, [columns]);

  const moveColumn = (dragIndex, hoverIndex) => {
    const draggedColumn = columns[dragIndex];
    const newColumns = [...columns];
    newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, draggedColumn);
    setColumns(newColumns);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 1,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            flex: 1,
            display: "flex",
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
              tableLayout: "fixed",
              width: "fit-content",
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    backgroundColor: "#001f3f !important",
                    color: "#D4AF37 !important",
                    borderBottom: "2px solid #D4AF37",
                  },
                }}
              >
                {columns.map((key, index) => (
                  <DraggableHeader
                    key={key}
                    id={key}
                    index={index}
                    moveColumn={moveColumn}
                    isClientName={key === "clientName"}
                  >
                    {formatHeaderLabel(key)}
                  </DraggableHeader>
                ))}
                <TableCell
                  sx={{
                    width: "120px",
                    backgroundColor: "#001f3f",
                    color: "#D4AF37",
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    fontWeight: "bold",
                    borderBottom: "2px solid #D4AF37",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {todos?.map((todo) => (
                <TableRow key={todo._id?.value || todo.id}>
                  {columns.map((key) => {
                    if (key === "userId" || key === "userName") return null;

                    const field = todo[key];
                    if (!field) return <TableCell key={key}></TableCell>;

                    const {
                      value,
                      type,
                      enum: enumOptions,
                      editable = true,
                    } = field;
                    const taskId = todo._id?.value || todo.id;
                    const subtaskId = isSubtask ? taskId : null;
                    const normalizedType = type?.toLowerCase();

                    const handleBlur = (e) => {
                      const newValue =
                        normalizedType === "boolean"
                          ? e.target.checked
                          : e.target.value;
                      handleFieldBlur(
                        taskId,
                        key,
                        newValue,
                        isSubtask,
                        subtaskId
                      );
                    };

                    let content;
                    if (key === "documents") {
                      const userId = todo.userId?.value;
                      const userName = todo.userName?.value;
                      const clientName = todo.clientName?.value || "Client";
                      const email = todo?._id?.value;
                      content =
                        userId && userName ? (
                          <Button
                            sx={{
                              textTransform: "none",
                              textDecoration: "underline",
                              p: 0,
                              minWidth: "auto",
                              color: "#D4AF37",
                              "&:hover": {
                                color: "#E6C050",
                                backgroundColor: "transparent",
                              },
                            }}
                            onClick={() => handleUserClick(userId, userName)}
                          >
                            {userName}
                          </Button>
                        ) : (
                          <Button
                            sx={{
                              textTransform: "none",
                              textDecoration: "underline",
                              p: 0,
                              minWidth: "auto",
                              color: "#D4AF37",
                              "&:hover": {
                                color: "#E6C050",
                                backgroundColor: "transparent",
                              },
                            }}
                            onClick={() => handleClientClick(email)}
                          >
                            {clientName}
                          </Button>
                        );
                    } else if (key === "caseId") {
                      content = (
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: "#676a6e" }}
                        >
                          {value?.CaseNumber || ""}
                        </Typography>
                      );
                    } else if (key === "createdBy") {
                      content = (
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: "#676a6e" }}
                        >
                          {value?.UserName || ""}
                        </Typography>
                      );
                    } else if (key === "createdAt") {
                      content = (
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: "#676a6e" }}
                        >
                          {(value || "").split("T")[0]}
                        </Typography>
                      );
                    } else if (!editable) {
                      content = (
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ color: "#676a6e" }}
                        >
                          {String(value)}
                        </Typography>
                      );
                    } else if (enumOptions) {
                      content = (
                        <FormControl
                          fullWidth
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          <Select
                            value={value}
                            onChange={(e) =>
                              handleFieldChange(
                                taskId,
                                key,
                                e.target.value,
                                isSubtask,
                                subtaskId
                              )
                            }
                            onBlur={handleBlur}
                            disabled={isclient}
                            sx={{
                              "& .MuiSelect-select": {
                                py: 1,
                                color: "#676a6e",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(212, 175, 55, 0.5)",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#D4AF37",
                              },
                              "& .MuiSvgIcon-root": {
                                color: "rgba(212, 175, 55, 0.7)",
                              },
                            }}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  bgcolor: "#0a2d56",
                                  color: "white",
                                  "& .MuiMenuItem-root": {
                                    "&:hover": {
                                      bgcolor: "rgba(212, 175, 55, 0.2)",
                                    },
                                  },
                                },
                              },
                            }}
                          >
                            {enumOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    } else if (normalizedType === "boolean") {
                      content = (
                        <Checkbox
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
                          sx={{
                            p: 0.5,
                            color: "#D4AF37",
                            "&.Mui-checked": {
                              color: "#D4AF37",
                            },
                          }}
                        />
                      );
                    } else if (normalizedType === "date") {
                      content = (
                        <DatePicker
                          value={value ? new Date(value) : null}
                          onChange={(date) =>
                            handleFieldChange(
                              taskId,
                              key,
                              date,
                              isSubtask,
                              subtaskId
                            )
                          }
                          disabled={isclient}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              onBlur={() =>
                                handleFieldBlur(
                                  taskId,
                                  key,
                                  value,
                                  isSubtask,
                                  subtaskId
                                )
                              }
                              sx={{
                                minWidth: 140,
                                "& .MuiInputBase-input": {
                                  py: 1,
                                  color: "#676a6e",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "rgba(212, 175, 55, 0.5)",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#D4AF37",
                                },
                                "& .MuiInputLabel-root": {
                                  color: "rgba(212, 175, 55, 0.7)",
                                },
                              }}
                            />
                          )}
                        />
                      );
                    } else {
                      content = (
                        <TextField
                          type="text"
                          size="small"
                          fullWidth
                          value={value || ""}
                          onChange={(e) =>
                            handleFieldChange(
                              taskId,
                              key,
                              e.target.value,
                              isSubtask,
                              subtaskId
                            )
                          }
                          onBlur={handleBlur}
                          disabled={key === "email" || key === "phone"}
                          sx={{
                            minWidth: 120,
                            "& .MuiInputBase-input": {
                              py: 1,
                              color: "#676a6e",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "rgba(212, 175, 55, 0.5)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#D4AF37",
                            },
                            "& .MuiInputLabel-root": {
                              color: "rgba(212, 175, 55, 0.7)",
                            },
                          }}
                        />
                      );
                    }

                    return (
                      <TableCell
                        key={key}
                        sx={{
                          overflow: "auto", // Changed to auto for scroll
                          textOverflow: "ellipsis",
                          whiteSpace: "normal", // Allow text wrapping
                          position: key === "clientName" ? "sticky" : "static",
                          left: key === "clientName" ? 0 : undefined,
                          backgroundColor:
                            key === "clientName" ? "#0a2d56" : undefined,
                          zIndex: key === "clientName" ? 2 : 1,
                          color: "#676a6e",
                          maxHeight: "120px", // Added max height
                        }}
                      >
                        {content}
                      </TableCell>
                    );
                  })}
                  <TableCell sx={{ color: "" }}>
                    <Box sx={{ position: "relative" }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, todo)}
                        disabled={isclient && !todo.userName?.value}
                        sx={{
                          "&:hover": {
                            backgroundColor: "rgba(212, 175, 55, 0.2)",
                          },
                          color: "#D4AF37",
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        PaperProps={{
                          elevation: 2,
                          sx: {
                            borderRadius: "8px",
                            minWidth: "180px",
                            bgcolor: "#0a2d56",
                            color: "white",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
                            "& .MuiMenuItem-root": {
                              fontSize: "0.875rem",
                              padding: "8px 16px",
                              "&:hover": {
                                backgroundColor: "rgba(212, 175, 55, 0.2)",
                              },
                            },
                          },
                        }}
                        MenuListProps={{
                          sx: {
                            padding: "4px 0",
                          },
                        }}
                      >
                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedTodo) {
                              handleSignup(selectedTodo);
                            }
                            handleMenuClose();
                          }}
                          disabled={selectedTodo?.userName?.value}
                        >
                          <ListItemIcon>
                            <PersonAdd
                              fontSize="small"
                              sx={{ color: "#D4AF37" }}
                            />
                          </ListItemIcon>
                          <ListItemText primary="Create Account" />
                        </MenuItem>

                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            if (selectedTodo) {
                              handleDelete(
                                selectedTodo._id?.value || selectedTodo.id
                              );
                            }
                            handleMenuClose();
                          }}
                          disabled={isclient}
                          sx={{ color: "error.main" }}
                        >
                          <ListItemIcon>
                            <Delete fontSize="small" color="error" />
                          </ListItemIcon>
                          <ListItemText primary="Delete" />
                        </MenuItem>
                      </Menu>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </DndProvider>
  );
};

export default DraggableTable;
