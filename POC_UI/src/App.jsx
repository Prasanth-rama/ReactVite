import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import EmployeeList from "./EmployeeList"
import DashboardContent from "./DashboardContent"
import LeavesList from "./LeavesList";
import DepartmentList from "./DepartmentList";

export default function App() {
  return (
    <Routes>
      {/* Layout renders the fixed header + sidebar; the matched page appears inside it */}
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardContent/> } />
        <Route path="/employee" element={<EmployeeList/> } />
        <Route path="/leaves" element={<LeavesList/> } />
        <Route path="/departments" element={<DepartmentList/> } />
      </Route>
    </Routes>
  );
}
