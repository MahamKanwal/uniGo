import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import { Footer } from "antd/es/layout/layout";
import AuthForm from "./pages/auth/AuthForm";
import SideBar from "./components/layout/SideBar";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/auth/dashboard/Dashboard";



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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidbar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }
  return (
    <>
      {
        !isAuthenticated && <Navbar />
      }
      <div className="flex">
        {
          isAuthenticated && <SideBar sidebarCollapsed={sidebarCollapsed} toggleSidbar={toggleSidbar } />
        }
        <div className={`flex-1 ${sidebarCollapsed ? "ml-5" : "ml-5"} bg-gray-100`}>
          <Routes>
            <Route path="/:formName" element={<PublicRoute><AuthForm /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
      {
        !isAuthenticated && <Footer />
      }

    </>
  );
};
export default App;
