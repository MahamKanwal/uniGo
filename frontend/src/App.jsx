import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AuthForm from "./pages/auth/AuthForm";
import SideBar from "./components/layout/SideBar";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/dashboard/Dashboard";
import TopBar from "./components/ui/TopBar";
import Footer from "./components/layout/Footer"
import Drivers from "./pages/driver/Drivers";
import Students from "./pages/student/Students";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ConfirmModal from "./components/ui/ConfirmModal";
import { logoutUser } from "./features/user/userSlice";
import StudentForm from "./pages/student/StudentForm";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const App = () => {
  const { isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
   const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully");
    setIsLogoutModalOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <>
      {!isAuthenticated && <Navbar />}
      <div className="flex">
        {isAuthenticated && (<SideBar sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} 
        onLogoutClick={() => setIsLogoutModalOpen(true)}/>)}

        <div className="flex-1">
        {isAuthenticated && (<TopBar onLogoutClick={() => setIsLogoutModalOpen(true)}/>)}

          <div className={`flex-1 ${sidebarCollapsed ? "ml-5" : "ml-5"} bg-gray-100`}>
            <Routes>
              <Route path="/:formName" element={<PublicRoute><AuthForm /></PublicRoute>}/>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
              <Route path="/drivers" element={<ProtectedRoute><Drivers /></ProtectedRoute>}/>
              <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>}>
              {/* <Route path="create" element={<StudentForm />} /> */}
              <Route path="edit/:id" element={<StudentForm />} />
              </Route>
          </Routes>
          </div>
        </div>
      </div>

   {isAuthenticated && ( <ConfirmModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} 
   onConfirm={handleLogout} title="Logout" message="Are you sure you want to logout?" confirmText="Logout"
    cancelText="Cancel"/>)}

    {!isAuthenticated && <Footer />}
    </>
  );
};
export default App;
