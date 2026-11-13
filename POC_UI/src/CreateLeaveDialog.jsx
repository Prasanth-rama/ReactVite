// CreateLeaveDialog.jsx  (a separate file, or at least defined OUTSIDE LeaveList)
import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box, Typography, Slide
} from "@mui/material";
import EmployeeSearch from "./EmployeeSearch";

const emptyLeave = { employeeId: "", startDate: "", endDate: "", comments: "" };

export default function CreateLeaveDialog({ open, onClose, onSubmit }) {
  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState(emptyLeave);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm(emptyLeave);
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (!employee || !form.startDate || !form.endDate || !form.comments.trim()) {
      return setError("All fields are required.");
    }
    if (form.startDate < today) return setError("Start date must not be before  today.");
    if (form.endDate <= form.startDate) return setError("End date must be after start date.");

    try {
      await onSubmit({
        employeeId: Number(employee.Id),
        startDate: form.startDate,
        endDate: form.endDate,
        comments: form.comments.trim(),
        status: "Pending",
      });
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create leave request.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{
      "& .MuiDialog-container": {
        justifyContent: "flex-end",   // push to the right edge
        alignItems: "stretch",        // full height

      },
    }}
      direction="left"
      slotProps={{
        paper: {
          sx: {
            m: 0,
            width: { xs: "100%", sm: 420 },
            maxWidth: "100%",
            height: "100%",
            maxHeight: "100%",
            borderRadius: 0,
          },
        },
      }}

    >
      <DialogTitle>Create Leave Request</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <EmployeeSearch
              value={employee}
              onChange={setEmployee}
            />
          <TextField type="date" name="startDate" label="Start Date" value={form.startDate}
            onChange={handleChange} />
          <TextField type="date" name="endDate" label="End Date" value={form.endDate}
            onChange={handleChange} />
          <TextField name="comments" label="Comments" multiline minRows={3}
            value={form.comments} onChange={handleChange} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}