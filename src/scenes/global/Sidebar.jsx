import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";  // Icon for 'Create Folder'

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  // Get the user's name and role from localStorage
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("role");  // Assuming role is stored as "Admin" or "Client"

  // Extract the first letter of the user's name
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "G";

  // Set the target route based on the user's role
  const dashboardRoute = userRole === "Admin" ? "/admin-dashboard" : "/client-dashboard";

  // Conditionally set the folder route based on user role
  const folderRoute = userRole === "Admin" ? "/folders" : "/client-folders";

  // Conditionally render the 'create-folders' link for Admins only
  const createFolderRoute = userRole === "Admin" ? "/create-folders" : null;

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMINIS
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {/* Display First Letter of User's Name in a Circle */}
                <Box
                  sx={{
                    backgroundColor: colors.primary[500], // Background color of circle
                    color: colors.grey[100], // Text color
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "36px", // Font size of the letter
                    fontWeight: "bold",
                  }}
                >
                  {firstLetter}
                </Box>
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userName || "Guest"}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {/* Conditionally render the Dashboard route */}
            <Item
              title="Dashboard"
              to={dashboardRoute} // Dynamic route based on the role
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Folders"
              to={folderRoute} // Dynamic route for folders based on user role
              icon={<FolderOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* Only show the 'Create Folders' option for Admin */}
            {createFolderRoute && (
              <Item
                title="Create Folders"
                to={createFolderRoute}
                icon={<AddBoxIcon />} // Icon for 'Create Folder'
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
