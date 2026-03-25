import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn, getUser, isTokenExpired, logout } from "./Utils/auth";

import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import UsersDashboard from "./Pages/Admin/UsersDashboard";
import AddInternship from "./Pages/Admin/AddInternship";
import ManageInternships from "./Pages/Admin/ManageInternships";
import MatchingEngine from "./Pages/Admin/MatchingEngine";
import StudentDashboard from "./Pages/Student/StudentMatchers";

function ProtectedRoute({ children, role }) {
  if (isTokenExpired()) { logout(); return <Navigate to="/login" replace />; }
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "Admin" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes wrapped in Layout — gradient background applied globally */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard"          element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"              element={<ProtectedRoute role="Admin"><UsersDashboard /></ProtectedRoute>} />
          <Route path="/admin/add-internship"     element={<ProtectedRoute role="Admin"><AddInternship /></ProtectedRoute>} />
          <Route path="/admin/manage-internships" element={<ProtectedRoute role="Admin"><ManageInternships /></ProtectedRoute>} />
          <Route path="/admin/matching-engine"    element={<ProtectedRoute role="Admin"><MatchingEngine /></ProtectedRoute>} />
          <Route path="/student/dashboard"        element={<ProtectedRoute role="Student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/homepage" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}