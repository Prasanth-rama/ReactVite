import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { employmentTypes, onboardingOptions, statusOptions } from './constants'
import { getDepartments, getmangersOfdepartments } from './EmpoyeeApi'
  const EmployeeForm = ({ initialData, otherEmails, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departments, setDepartments] = useState([]);
  const [mangersOfdepartments, setmangersOfdepartments] = useState([]);

  const isEdit = initialData.Id !== null
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
        console.log("departments: ", departments)
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      const data = await getmangersOfdepartments(formData['DepartmentId']);
      setmangersOfdepartments(data);
    };
    load();
  }, []);


  // runs on every keystroke / selection
  const handleChange = async (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' }) // clear this field's error
    if (e.target.name == "DepartmentId") {
      try {
        const data = await getmangersOfdepartments(e.target.value);
        setmangersOfdepartments(data);
        console.log("managers: ", mangersOfdepartments)
        setError("");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    }
  }

  // checks every field and returns an object of error messages
  const validate = () => {
    const newErrors = {}

    const name = formData.FullName.trim()
    if (!name) newErrors.FullName = 'Full name is required'
    else if (name.length < 2) newErrors.FullName = 'Full name must be at least 2 characters'

    const email = formData.Email.trim().toLowerCase()
    if (!email) newErrors.Email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      newErrors.Email = 'Enter a valid email, e.g. name@company.com'
    if (!formData.Role.trim()) newErrors.Role = 'Role is required'
    if (!formData.DepartmentId) newErrors.DepartmentId = 'Please select a Department'
    if (!formData.JoiningDate) newErrors.JoiningDate = 'Joining date is required'
    if (!formData.EmploymentType) newErrors.EmploymentType = 'Please select an employment type'
    if (!formData.OnboardingStatus) newErrors.OnboardingStatus = 'Please select an onboarding status'
    if (!formData.Status) newErrors.Status = 'Please select a status'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // stop the page from reloading
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors) // show the messages and stop
      return
    }

    const result =await onSave({
      ...formData,
      FullName: formData.FullName.trim(),
      Email: formData.Email.trim(),
      Role: formData.Role.trim(),
    })
    if (!result.ok) 
    {
      console.log("Error List:",result.errorlist)
      if(result.errorlist.Email)
        setErrors(result.errorlist); 
      else
        setError(result.errorlist.general)
    }  // renders in the <Alert>
  }

  // props shared by every field
  const fieldProps = (name, label) => ({
    name,
    label,
    required: true,
    fullWidth: true,
    size: 'small',
    value: formData[name] ?? '',
    onChange: handleChange,
    error: !!errors[name],
    helperText: errors[name] || ' ', // ' ' keeps height stable so the form doesn't jump
  })

  // dropdown field built from an options array
  const selectField = (
    name,
    label,
    options,
    getValue = (o) => o,   // default: the option itself
    getLabel = (o) => o
  ) => (

    <TextField select {...fieldProps(name, label)}>
      {console.log("Managers", options)}
      <MenuItem value={null}>
        <em>Select</em>
      </MenuItem>
      {options.map((o) => (
        <MenuItem key={getValue(o)} value={getValue(o)}>
          {getLabel(o)}
        </MenuItem>
      ))}
    </TextField>
  )
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>{isEdit ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogContent dividers>
          <Stack spacing={0.5} sx={{ pt: 1 }}>
            {isEdit ? <TextField {...fieldProps("Id", "Employee Id")} slotProps={{ input: { readOnly: true } }} sx={
              isEdit
                ? {
                  "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" },
                  "& .MuiInputBase-input": { color: "text.secondary", cursor: "default" },
                  "& .MuiOutlinedInput-notchedOutline": { borderStyle: "dashed" },
                }
                : undefined
            } /> : ''}
            <TextField {...fieldProps('FullName', 'Full Name')} />
            <TextField {...fieldProps('Email', 'Email')} type="email" />
            <TextField {...fieldProps('Role', 'Role')} />

            {selectField(
              'DepartmentId',
              'Department',
              departments,
              (d) => d.Id,     // value stored in formData
              (d) => d.DepartmentName    // text the user sees
            )}

            {selectField(
              'ManagerId',
              'Manager',
              mangersOfdepartments,
              (m) => m.ManagerId,     // value stored in formData
              (m) => m.ManagerName    // text the user sees
            )}

            <TextField
              {...fieldProps('JoiningDate', 'Joining Date')}
              type="date"
              value={formData.JoiningDate ? formData.JoiningDate.slice(0, 10) : ''}
            //InputLabelProps={{ shrink: true }} // keeps the label above the date input
            />

            {selectField('EmploymentType', 'Employment Type', employmentTypes)}
            {selectField('OnboardingStatus', 'Onboarding Status', onboardingOptions)}
            {selectField('Status', 'Status', statusOptions)}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EmployeeForm


