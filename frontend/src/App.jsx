import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { isLoggedIn, getUser, isTokenExpired, logout } from "./Utils/auth";

import Layout from "./Components/Layout";
import HomePage from "./Pages/Home/HomePage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import UsersDashboard from "./Pages/Admin/UsersDashboard";
import AddInternship from "./Pages/Admin/AddInternship";
import ManageInternships from "./Pages/Admin/ManageInternships";
import MatchingEngine from "./Pages/Admin/MatchingEngine";
import ApplicationsDashboard from "./Pages/Admin/ApplicationsDashboard";
import StudentMatches from "./Pages/Student/StudentDashboard";
import StudentCvUpload from "./Pages/Student/StudentCvUpload";
import StudentNotifications from "./Pages/Student/StudentNotifications";
import StudentSuggestions from "./Pages/Student/StudentSuggesstions";
import StudentProfile from "./Pages/Student/StudentProfilePage";
import StudentApplyInternship from "./Pages/Student/StudentApplyInternship";
import CVBuilderPage from "./Pages/CVbuilder/CVBuilderPage";

function ProtectedRoute({ children, role }) {
  if (isTokenExpired()) { logout(); return <Navigate to="/login" replace />; }
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "Admin" ? "/admin/dashboard" : "/student/matches"} replace />;
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
          <Route path="/admin/applications"       element={<ProtectedRoute role="Admin"><ApplicationsDashboard /></ProtectedRoute>} />
          <Route path="/student"                  element={<ProtectedRoute role="Student"><Navigate to="/student/matches" replace /></ProtectedRoute>} />
          <Route path="/student/dashboard"        element={<ProtectedRoute role="Student"><Navigate to="/student/matches" replace /></ProtectedRoute>} />
          <Route path="/student/matches"          element={<ProtectedRoute role="Student"><StudentMatches /></ProtectedRoute>} />
          <Route path="/student/apply/:internshipId" element={<ProtectedRoute role="Student"><StudentApplyInternship /></ProtectedRoute>} />
          <Route path="/student/cv-upload"        element={<ProtectedRoute role="Student"><StudentCvUpload /></ProtectedRoute>} />
          <Route path="/student/cv-builder"       element={<ProtectedRoute role="Student"><CVBuilderPage /></ProtectedRoute>} />
          <Route path="/student/suggestions"      element={<ProtectedRoute role="Student"><StudentSuggestions /></ProtectedRoute>} />
          <Route path="/student/notifications"    element={<ProtectedRoute role="Student"><StudentNotifications /></ProtectedRoute>} />
          <Route path="/student/profile"          element={<ProtectedRoute role="Student"><StudentProfile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/homepage" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}