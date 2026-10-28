import React, { useState } from 'react'
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
import { createDepartment,updateDepartment } from './DepartmentApi'
const DepartmentForm = ({ initialData, onCancel }) => {
    const [departmentData, setDepartmentData] = useState(initialData)
    const [error, setError] = useState("");
    console.log('Initital Data', initialData)
    const isEdit = initialData.Id !== null
    console.log('is Edit', isEdit)
    // props shared by every field
    const fieldProps = (name, label) => ({
        name,
        label,
        required: true,
        fullWidth: true,
        size: 'small',
        value: departmentData[name] ?? '',
        onChange: (e) => { setDepartmentData ({ ...departmentData, [e.target.name]: e.target.value }) },
        // error: !!errors[name],
        //helperText: errors[name] || ' ', // ' ' keeps height stable so the form doesn't jump
    })
    const handleSubmit = async (e) => {
         e.preventDefault();
        if (!departmentData.DepartmentName ) {
            return setError("Department Name is required.");
        }
        try {
            var ok = false
            if (departmentData.Id === null) {
                ok = await createDepartment({DepartmentName:departmentData.DepartmentName})
            } else {
               
                ok = await updateDepartment(departmentData)
            }
            if (ok) {
                onCancel()
            }

            onCancel();
        } catch (err) {
            setError(err.message || "Failed to create leave request.");
        }
    };
    return (
        <div>
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
                            {isEdit ? <TextField {...fieldProps("Id", "Department Id")} slotProps={{ input: { readOnly: true } }} sx={
                                isEdit
                                    ? {
                                        "& .MuiInputBase-root": { backgroundColor: "#f5f5f5" },
                                        "& .MuiInputBase-input": { color: "text.secondary", cursor: "default" },
                                        "& .MuiOutlinedInput-notchedOutline": { borderStyle: "dashed" },
                                    }
                                    : undefined
                            } /> : ''}
                            <TextField {...fieldProps('DepartmentName', 'Department Name')} />


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
        </div>
    )
}

export default DepartmentForm
