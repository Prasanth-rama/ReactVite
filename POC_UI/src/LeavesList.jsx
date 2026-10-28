import React, { useState, useEffect, Component } from 'react'
import {
    Button, Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Box,
    MenuItem,
    Typography
} from '@mui/material'
import { DataGrid, GridActionsCellItem, GridToolbarQuickFilter, getGridStringOperators, Toolbar, QuickFilter, QuickFilterControl, QuickFilterClear } from '@mui/x-data-grid'
import { getLeaves, updateLeave, createLeave } from './LeavesApi'
import DeleteIcon from "@mui/icons-material/Delete";
import CreateLeaveDialog from './CreateLeaveDialog';

const LeavesList = () => {
    const [rows, setRows] = useState([])
    const [rowCount, setRowCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
    const [filterModel, setFilterModel] = useState({ items: [] })
    const [reloadKey, setReloadKey] = useState(0)
    const [error, setError] = useState("")
    const [comments, setComments] = useState("")
    const [updateLeaves, setUpdateLeaves] = useState(null);
    const [deleting, setDeleting] = useState(0)
    const [approving, setApproving] = useState(0)
    const [rejecting, setRejecting] = useState(0)
    const emptyLeave = { employeeId: "", startDate: "", endDate: "", comments: "" };
    const [newLeave, setNewLeave] = useState(null);   // null = dialog closed
    const [createError, setCreateError] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    useEffect(() => {
        let cancelled = false
        setLoading(true)

        const search = (filterModel.quickFilterValues ?? []).join(' ').trim()
        getLeaves({
            page: paginationModel.page + 1,   // grid is 0-based, your API is 1-based
            pageSize: paginationModel.pageSize,
            employeeId: search,
            status: search
        }).then(data => {
            if (cancelled) return
            setRows(data.items)
            setRowCount(data.totalCount)

        })
            .finally(() => !cancelled && setLoading(false))

        return () => { cancelled = true }
    }, [paginationModel, filterModel, reloadKey])

    const columns = [
        { field: 'Id', headerName: 'Leave Id', flex: 1, rowHeader: true, filterable: false },
        { field: 'EmployeeId', headerName: 'Employee Id', flex: 1, rowHeader: true, filterable: false },
        { field: 'EmployeeName', headerName: 'Employee Name', flex: 1, filterable: false },
        {
            field: 'StartDate', headerName: 'Start Date', flex: 1, filterable: false, valueFormatter: (value) => {
                if (!value) return '';
                return new Date(value).toLocaleDateString('en-IN');
            }
        },
        {
            field: 'EndDate', headerName: 'End Date', flex: 1, filterable: false, valueFormatter: (value) => {
                if (!value) return '';
                return new Date(value).toLocaleDateString('en-IN');
            }
        },
        { field: 'NoOfDays', headerName: 'No of Days', flex: 1, filterable: false },
        { field: 'Status', headerName: 'Status', flex: 1, filterable: false },
        { field: 'Comments', headerName: 'Comments', flex: 1, filterable: false },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => (
                <>
                    <Button size="small" onClick={() => {
                        setUpdateLeaves({
                            id: row.Id,
                            status: "Approved",
                            comments: "",
                            deleted: 0
                        }); confirmUpdate()
                    }} disabled={row.Status === "Approved"}>Approve</Button>
                    <Button size="small" color="error" onClick={() => {
                        setUpdateLeaves({
                            id: row.Id,
                            status: "Rejected",
                            comments: "",
                            deleted: 0
                        }); setRejecting(1)
                    }} disabled={row.Status === "Approved"}>Reject</Button>

                </>
            ),
        },
        {
            field: "actions1",
            type: "actions",
            headerName: "Delete",
            width: 100,
            getActions: ({
                row }) => [
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => {

                            setUpdateLeaves({
                                id: row.Id,
                                status: "",
                                comments: "",
                                deleted: 1
                            });
                            setDeleting(1)
                        }}
                        disabled={row.Status === "Approved"}
                    />,
                ],
        },
    ]


    const closeDialog = () => {
        setDeleting(0);
        setRejecting(0)
        setApproving(0);
        setUpdateLeaves(null);
        setComments(null);
    };

    const confirmUpdate = async () => {
        let ok

        ok = await updateLeave(updateLeaves);

        if (ok == "ok") {
            closeDialog();
            setReloadKey(reloadKey + 1)

        }

    };
    return (
        <div>
            <h2>Leaves</h2>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 ,gap:2}}>
                <Typography variant="h6">Leave Requests</Typography>
                <Button variant="contained" onClick={() => setCreateOpen(true)}>Create Leave Request</Button>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(r) => r.Id}
                rowCount={rowCount}
                loading={loading}
                disableColumnFilter
                pagination
                paginationMode="server"
                filterMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                pageSizeOptions={[5, 10, 20, 50]}
                showToolbar
                localeText={{ toolbarQuickFilterPlaceholder: 'Search by Employee Id  or Status...' }}
                // slotProps={{ toolbar: { onClearFilters: clearFilters } }}

                slotProps={{
                    toolbar: {
                        quickFilterProps: { debounceMs: 400 },   // optional: wait for a pause before filtering
                    },
                }}

            />
            <Dialog open={deleting === 1} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>Delete Leave Request</DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to delete this leave request?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmUpdate}
                    >
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={rejecting === 1} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>Reject Leave Request</DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Are you sure you want to Reject this leave request? If yes, please enter
                        rejection comments.
                    </DialogContentText>

                    <TextField
                        autoFocus
                        fullWidth
                        multiline
                        minRows={3}
                        name="comments"
                        label="Rejection comments"
                        value={comments}
                        onChange={(e) => { setComments(e.target.value); setUpdateLeaves({ ...updateLeaves, [e.target.name]: e.target.value }) }}
                        required
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmUpdate}
                    >
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>




            <CreateLeaveDialog
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={async (leave) => {
                    await createLeave(leave);
                    setReloadKey(reloadKey + 1)
                }}
            />

        </div>
    )
}

export default LeavesList
