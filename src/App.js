import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Form from "./scenes/form";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import LoginForm from "./scenes/form/LoginForm";
import RegisterForm from "./scenes/form/RegisterForm";
import AdminDashboard from "./scenes/dashboard/AdminDashboard";
import ClientDashboard from "./scenes/dashboard/ClientDashboard";
import FolderManagement from "./scenes/Folder/FolderManagement";
import ClientFolderManagement from "./scenes/Folder/ClientFolderManagement";
import CreateFolder from "./scenes/Folder/CreateFolder";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // Define routes where Sidebar and Topbar should not be visible
  const excludedRoutes = ["/", "/register"];
  const isExcludedRoute = excludedRoutes.includes(location.pathname);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isExcludedRoute && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isExcludedRoute && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/form" element={<Form />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/folders" element={<FolderManagement />} />
              <Route path="/create-folders" element={<CreateFolder />} />
              <Route path="/client-folders" element={<ClientFolderManagement />} />
              <Route path="/" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/calendar" element={<Calendar />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
