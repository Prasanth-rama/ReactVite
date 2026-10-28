import { useEffect, useState } from "react";
import {
    Alert,
    Box,
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
    TableRow,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import StatCard from "./StatCard";
import { getSummary } from "./EmpoyeeApi";
import QueryStatsSharpIcon from '@mui/icons-material/QueryStatsSharp';
import { BarChart } from "@mui/x-charts/BarChart";


const formatName = (text) => text.replace(/([a-z])([A-Z])/g, "$1 $2");


// Renders { Engineering: 5, HR: 2 } as a list of "name ..... count" rows
function CountList({ data = {} }) {
    return (
        <List dense disablePadding>
            {Object.entries(data).map(([name, count]) => (

                <ListItem
                    key={name}
                    disableGutters
                    secondaryAction={
                        <Typography variant="body2" fontWeight={600}>
                            {count}
                        </Typography>
                    }
                >
                    <ListItemText primary={formatName(name)} />
                </ListItem>
            ))}
        </List>
    );
}

export default function DashboardContent() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({});
    const [error, setError] = useState("");

    const loadSummary = async () => {
        try {
            setSummary(await getSummary());
            console.log("1. res.data:", summary);   
            console.log("Total Employees",summary.TotalEmployees);
            console.log(JSON.stringify(summary, null, 2));
            console.log(Object.keys(summary));
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSummary();
    }, []);
    const departments = Object.keys(summary.ByDepartment ?? {}).map(formatName);
    const departmentCounts = Object.values(summary.ByDepartment ?? {});
    const columns = [
        { label: "Emp Id", key: "Id" },
        { label: "Full Name", key: "FullName" },
        { label: "Email", key: "Email" },
        { label: "Department", key: "DepartmentName" },

    ];


    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Dashboard
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Box
                sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                }}
            >
                <StatCard icon={<PeopleIcon />} title="Total Employees" color="#3b82f6">
                    <Typography variant="h4">{summary.TotalEmployees}</Typography>
                </StatCard>
                <StatCard icon={<QueryStatsSharpIcon />} title="Status" color="#c522a2">
                    <CountList data={summary.ByStatus} />
                </StatCard>

                <StatCard icon={<ApartmentIcon />} title="By Department" color="#8b5cf6" sx={{ gridColumn: "span 2" }}>
                    <BarChart
                        layout="horizontal"
                        yAxis={[{ scaleType: "band", data: departments, width: 150 }]}
                        series={[{ data: departmentCounts, color: "#8b5cf6", barLabel: "value" }]}
                        height={300}
                        sx={{
                            "& .MuiBarChart-label": { fill: "#ffffff !important", fontWeight: 600 },
                        }}
                    />
                </StatCard>

                <StatCard icon={<WorkIcon />} title="By Employment Type" color="#14b8a6">
                    <CountList data={summary.ByEmploymentType} />
                </StatCard>

                <StatCard icon={<AssignmentIcon />} title="Onboarding Status" color="#f59e0b">
                    <CountList data={summary.ByOnboardingStatus} />
                </StatCard>

                <StatCard icon={<PersonAddIcon />} title="Joined This Month" color="#22c55e">
                    <Typography variant="h4">{summary.EmployeeeThisMonth}</Typography>
                </StatCard>
                <StatCard icon={<AssignmentIcon />} title="On Leave this week" color="#117956"  sx={{ gridColumn: "span 2" }}>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell key={col.key} sx={{ fontWeight: 600 }}>
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {!summary?.EmployeesOnLeaveThisWeek?.length ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} align="center">
                                            No employees found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    summary.EmployeesOnLeaveThisWeek.map((emp) => (
                                        <TableRow key={emp.Id} hover>
                                            {columns.map((col) => (
                                                <TableCell key={col.key}>{emp[col.key]}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </StatCard>

            </Box>
        </Box>
    );
}
