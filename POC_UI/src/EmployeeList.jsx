import React, { useState, useEffect, Component } from 'react'
import EmployeeForm from './EmployeeForm'
import { departments, employmentTypes, onboardingOptions, statusOptions } from './constants'

import { Button, CircularProgress, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbarQuickFilter, getGridStringOperators, Toolbar, QuickFilter, QuickFilterControl, QuickFilterClear } from '@mui/x-data-grid'
import { getEmployees } from './EmpoyeeApi'
import { Chip } from "@mui/material"
import { deleteEmployee, createEmployee, updateEmployee } from './EmpoyeeApi'
import { grey } from '@mui/material/colors'



const EmployeeList = () => {

    const emptyEmployee = {
        Id: null,
        FullName: '',
        Email: '',
        Role: '',
        Department: '',
        JoiningDate: '',
        EmploymentType: '',
        OnboardingStatus: '',
        Status: '',
    }
    const [editing, setEditing] = useState(null) // holds a copy of the employee being edited
    const [deleting, setDeleting] = useState(null)
    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value })
    }
    const clearFilters = () => {
        setFilterModel({ items: [], quickFilterValues: [] })   // clears column filters and the search box
        setPaginationModel(m => ({ ...m, page: 0 }))
    }
    const handleDelete = async (emp) => {
        const ok = await deleteEmployee(emp.Id)
        console.log("deletion Done")
        if (ok == "ok") {
            setDeleting(null)
            setReloadKey(reloadKey + 1)
        }

    }
    const handleSave = async (employee) => {
        try {
            var ok = false
            if (employee.Id === null) {
                ok = await createEmployee(employee)
            } else {
                console.log("Employee:", employee)
                ok = await updateEmployee(employee.Id, employee)
            }
            if (ok) {
                setEditing(null)
                setReloadKey(reloadKey + 1)
            }
        }
        catch (err) {
            console.log("Error Status", err.status)
            if (err.status === 409) {
                return { ok: false, errorlist: { Email: err.message } };   // under the Email field
            }
            return { ok: false, errorlist: { general: err.message } };
        }
    }
    const [rows, setRows] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    const [filterModel, setFilterModel] = useState({ items: [] })
    const [reloadKey, setReloadKey] = useState(0)
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        // turn grid filter items into your API params: { FullName: 'ann', Status: 'Active' }
        const filterParams = {}

        filterModel.items.forEach(({ field, value }) => {
            if (value === undefined || value === '') return
            filterParams[field] = value
        })
        const search = (filterModel.quickFilterValues ?? []).join(' ').trim()

        try {
            getEmployees({
                page: paginationModel.page + 1,   // grid is 0-based, your API is 1-based
                pageSize: paginationModel.pageSize,
                FullName: search,
                Email: search,
                ...filterParams,

            })
                .then(data => {
                    if (cancelled) return
                    setRows(data.data)
                    setRowCount(data.totalCount)
                    console.log("row Count:", data.totalCount)
                })
                .finally(() => !cancelled && setLoading(false))
            setError("");
        }
        catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

        return () => { cancelled = true }
    }, [paginationModel, filterModel, reloadKey])
    function SearchToolbar() {
        return (
            <Toolbar>
                <QuickFilter>
                    <QuickFilterControl placeholder="Search by name or email..." />
                    <QuickFilterClear />
                </QuickFilter>
            </Toolbar>
        )
    }
    const statusColor = {
        Active: "success",
        Exited: "default",
        Terminated: "error",
        "On Leave": "warning",
    };
    const containsOnly = getGridStringOperators().filter(
        (op) => op.value === "contains"
    );
    const columns = [
        { field: 'Id', headerName: 'Emp Id', width: 90, filterable: false },
        { field: 'FullName', headerName: 'Full Name', flex: 1, rowHeader: true, filterable: false },
        { field: 'Email', headerName: 'Email', flex: 1, filterable: false },
        { field: 'Role', headerName: 'Role', flex: 1, filterable: false },
        { field: 'DepartmentName', headerName: 'Department', flex: 1, filterOperators: containsOnly },
        { field: 'EmploymentType', headerName: 'Employment Type', flex: 1, filterOperators: containsOnly },
        {
            field: 'JoiningDate', headerName: 'Joining Date', flex: 1, rable: false, valueFormatter: (value) => {
                if (!value) return '';
                return new Date(value).toLocaleDateString('en-IN');
            }
        },
        {
            field: "Status",
            headerName: "Status",
            width: 130,
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={statusColor[params.value] || "default"}
                    size="small"
                    variant="outlined"
                />
            ),
        },
        { field: 'ManagerName', headerName: 'Manager', flex: 1, filterOperators: containsOnly },
        { field: 'OnboardingStatus', headerName: 'On Boarding Status', flex: 1, filterOperators: containsOnly },
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
        );
    }
    return (
        <div>
            <h2>Employees </h2>
            {error && (
                <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Box sx={{ display: "flex", mb: 2, gap: 2 }}>

                <Button sx={{ backgroundColor: 'grey.500' }} variant="contained" onClick={clearFilters}>Clear Filters</Button>
                <Button variant="contained" onClick={() => setEditing({ ...emptyEmployee })}> + Add Employee</Button>
            </Box>

            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(r) => r.Id}
                rowCount={rowCount}
                loading={loading}
                pagination
                paginationMode="server"
                filterMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                pageSizeOptions={[5, 10, 20, 50]}
                showToolbar
                localeText={{ toolbarQuickFilterPlaceholder: 'Search by name or email...' }}
                // slotProps={{ toolbar: { onClearFilters: clearFilters } }}

                slotProps={{
                    toolbar: {
                        quickFilterProps: { debounceMs: 400 },   // optional: wait for a pause before filtering
                    },
                }}

            />
            {/* {deleting &&
                <div className="modal-overlay">
                    <div className="modal-actions">
                        <div className='modal'>
                            <h6>Are you Sure you want to delete employee?</h6>
                            <button className="btn delete" onClick={() => handleDelete(deleting)}>Yes</button>
                            <button type="button" className="btn cancel" onClick={() => { setDeleting(null); }}>Cancel</button>
                        </div>
                    </div>
                </div>
            } */}
            <Dialog open={deleting} onClose={() => { setDeleting(null) }} fullWidth maxWidth="sm">
                <DialogTitle>Delete Employee Request</DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to delete this Employee?
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
                    <EmployeeForm
                        initialData={editing}
                        onSave={handleSave}
                        onCancel={() => setEditing(null)}
                    />
                )
            }
        </div >
    )
}

export default EmployeeList