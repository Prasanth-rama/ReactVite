import { NavLink, Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import ApartmentIcon from "@mui/icons-material/Apartment";

const DRAWER_WIDTH = 230;

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Employees", path: "/employee", icon: <PeopleIcon /> },
  { label: "Leaves", path: "/leaves", icon: <EventBusyIcon /> },
  { label: "Departments", path: "/departments", icon: <ApartmentIcon /> },
];

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Fixed top heading, sits above the sidebar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Employee Management System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <Toolbar /> {/* spacer so the list starts below the AppBar */}
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              component={NavLink}
              to={item.path}
              sx={{
                // NavLink adds the "active" class for the current route
                "&.active": {
                  bgcolor: "action.selected",
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* Page content: the selected page renders here */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>
        <Toolbar /> {/* spacer so content starts below the AppBar */}
        <Outlet />
      </Box>
    </Box>
  );
}
