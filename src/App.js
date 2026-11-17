// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

/* 🌐 Auth Context Provider */
import { AuthProvider } from "./components/auth/AuthContext";

/* 🔐 Auth Components */
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

/* 👤 User Components */
import UserHome from "./pages/UserHome";
import UserEmergency from "./pages/UserEmergency";
import RideActive from "./pages/RideActive";
import Complaints from './pages/Complaints';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintsHistory from './pages/ComplaintsHistory';
import ComplaintDetail from './pages/ComplaintDetail';
import ComplaintEdit from "./pages/ComplaintEdit";
import NotificationsPage from "./pages/NotificationsPage";

/* 🧑‍🔧 REAL STAFF COMPONENTS */
import StaffPanel from "./components/staff/StaffPanel";
import StaffProfile from "./components/staff/StaffProfile";
import StaffTasks from "./components/staff/StaffTasks";
import StaffEmergencies from "./components/staff/StaffEmergencies";
import StaffVehicles from "./components/staff/StaffVehicles";
import StaffNotifications from "./components/staff/StaffNotifications";
import StaffRebalancing from "./components/staff/StaffRebalancing";
import StaffAnalytics from "./components/staff/StaffAnalytics";

/* ⚙️ Future: Admin & Staff (temporary placeholders) */
const AdminDashboard = () => (
  <div className="text-center mt-5 text-light">
    <h2>🚀 Admin Dashboard</h2>
    <p>Analytics & Management Portal (Coming Soon)</p>
  </div>
);

/* ❌ 404 */
const NotFound = () => (
  <div className="text-center mt-5 text-danger">
    <h2>404 - Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

/* 🛡️ Simple Staff Route Protection */
const StaffProtectedRoute = ({ children }) => {
  const userStr = localStorage.getItem("user");
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    // Check if user is staff
    if (user.user_type !== "staff") {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
};

/* 🧭 MAIN APPLICATION ROUTER */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🌍 Default → Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 🔐 Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 👤 User Routes */}
          <Route path="/user/home" element={<UserHome />} />
          <Route path="/user/emergency" element={<UserEmergency />} />
          <Route path="/ride/active" element={<RideActive />} />
          <Route path="/complaints/new" element={<ComplaintForm />} />
          <Route path="/complaints/history" element={<ComplaintsHistory />} />
          <Route path="/complaints/:id" element={<ComplaintDetail />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaints/:id/edit" element={<ComplaintEdit />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* 🧑‍💼 Admin & Staff */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* ✅ REAL STAFF PANEL & MODULES */}
          <Route 
            path="/staff/panel" 
            element={
              <StaffProtectedRoute>
                <StaffPanel />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/profile" 
            element={
              <StaffProtectedRoute>
                <StaffProfile />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/tasks" 
            element={
              <StaffProtectedRoute>
                <StaffTasks />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/tasks/create" 
            element={
              <StaffProtectedRoute>
                <StaffTasks mode="create" />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/emergencies" 
            element={
              <StaffProtectedRoute>
                <StaffEmergencies />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/emergencies/report" 
            element={
              <StaffProtectedRoute>
                <StaffEmergencies mode="report" />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/vehicles" 
            element={
              <StaffProtectedRoute>
                <StaffVehicles />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/notifications" 
            element={
              <StaffProtectedRoute>
                <StaffNotifications />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/rebalancing" 
            element={
              <StaffProtectedRoute>
                <StaffRebalancing />
              </StaffProtectedRoute>
            } 
          />
          
          <Route 
            path="/staff/analytics" 
            element={
              <StaffProtectedRoute>
                <StaffAnalytics />
              </StaffProtectedRoute>
            } 
          />

          {/* ❌ Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;