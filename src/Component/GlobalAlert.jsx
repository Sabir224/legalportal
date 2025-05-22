import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAlert } from "./AlertContext";

const GlobalAlert = () => {
  const { open, severity, message, loading, closeAlert } = useAlert();

  useEffect(() => {
    if (!loading && open) {
      const timer = setTimeout(() => {
        closeAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, loading, closeAlert]);

  return (
    <Dialog open={open} onClose={closeAlert} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {loading
          ? "Processing..."
          : severity === "success"
          ? "Success"
          : "Error"}
        {!loading && (
          <IconButton onClick={closeAlert}>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Please wait...</Typography>
          </Box>
        ) : (
          <Alert severity={severity} variant="filled">
            {message}
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAlert;
