import React, { useState, useEffect, Component } from 'react'
import {
    Button, Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Box,
    Alert,
    MenuItem,
    Typography,
    CircularProgress
} from '@mui/material'
import { DataGrid, GridActionsCellItem, useGridApiRef, GridToolbarQuickFilter, getGridStringOperators, Toolbar, QuickFilter, QuickFilterControl, QuickFilterClear } from '@mui/x-data-grid'
import { getDepartments } from './EmpoyeeApi'
import { deleteDepartment } from './DepartmentApi'

import DepartmentForm from './DepartmentForm'
const DepartmentList = () => {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [deleting, setDeleting] = useState(null)
    const [editing, setEditing] = useState(null)
    const [reloadKey, setReloadKey] = useState(0)
    const apiRef = useGridApiRef();
    useEffect(() => {
        let cancelled = false
        setLoading(true)
        getDepartments().then(data => {
            if (cancelled) return
            setRows(data)

        }).finally(() => !cancelled && setLoading(false))
        if (rows.length) {
            apiRef.current?.autosizeColumns({ includeHeaders: true, expand: true });
        }

        return () => { cancelled = true }
    }, [reloadKey])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditing({ ...editing, [name]: value });
    };
    const handleDelete = async (dep) => {
        try {
            const ok = await deleteDepartment(dep.Id)
            console.log("deletion Done")
            if (ok == "ok") {
                setDeleting(null)
                setReloadKey(reloadKey + 1)
            }
        }
        catch (err) {
            setError("Failed to delete Department request.");
            setDeleting(null)

        }
    }
    const columns = [
        { field: 'Id', headerName: 'Department Id', flex: 1, width: 90 },
        { field: 'DepartmentName', headerName: 'Department Name', flex: 1, rowHeader: true },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => (
                <>

                    <Button size="small" onClick={() => setEditing({ ...row })}>Edit</Button>
                    <Button size="small" color="error" onClick={() => setDeleting({ ...row })}>Delete</Button>
                </>
            ),
        }
    ]



    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        )
    }
    return (
        <div>
            <h2>Departments </h2>
            {error && (
                <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ display: "flex", justifyContent: 'flex-end', mb: 2, gap: 2 }}>
                <Button variant="contained" onClick={() => setEditing({ Id: null, DepartmentName: "" })}> + Add Department</Button>
            </Box>
            <DataGrid
                apiRef={apiRef}
                rows={rows}
                getRowId={(r) => r.Id}
                columns={columns}
                autosizeOnMount
                autosizeOptions={{
                    includeHeaders: true,
                    includeOutliers: true,
                    expand: true,
                }}

                disableRowSelectionOnClick
                hideFooter
            />
            <Dialog open={deleting} onClose={() => { setDeleting(null) }} fullWidth maxWidth="sm">
                <DialogTitle>Delete Department Request</DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to delete this Department?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => { setDeleting(null) }}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(deleting)}
                    >
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {
                editing && (
                    <DepartmentForm
                        initialData={editing}
                        onCancel={() => { setEditing(null); setReloadKey(reloadKey + 1) }}
                    />
                )
            }
        </div>
    )
}

export default DepartmentList
