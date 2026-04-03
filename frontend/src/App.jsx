import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn, getUser, isTokenExpired, logout } from "./Utils/auth";
import { useEffect, useState } from "react";

import MainLayout from "./Components/Layout";
import LayoutNotification from "./Components/LayoutNotification";

import LoaderPage from "./Pages/Loader/LoaderPage";
import HomePage from "./Pages/Home/HomePage";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";
import ForgotPassword from "./Pages/Auth/ForgotPassword";

// Admin pages
import AdminDashboard        from "./Pages/Admin/AdminDashboard";
import UserDashboard from "./Pages/Admin/UserDashboard";
import AddInternship         from "./Pages/Admin/AddInternship";
import ManageInternships     from "./Pages/Admin/ManageInternships";
import MatchingEngine        from "./Pages/Admin/MatchingEngine";
import ApplicationsDashboard from "./Pages/Admin/ApplicationsDashboard";
import AdminProfilePage      from "./Pages/Admin/AdminProfilePage";

// Student pages
import StudentMatches         from "./Pages/Student/StudentDashboard";
import StudentCvUpload        from "./Pages/Student/StudentCvUpload";
import StudentNotifications   from "./Pages/Student/StudentNotifications";
import StudentProfile         from "./Pages/Student/StudentProfilePage";
import StudentApplyInternship from "./Pages/Student/StudentApplyInternship";
import CVBuilder from "./Pages/CVbuilder/CVBuilderPage";
import InternshipSearch from "./Pages/Student/StudentInternshipSearch";
import StudentInternshipSearch from "./Pages/Student/StudentInternshipSearch";
import StudentInternshipResults from "./Pages/Student/StudentInternshipResults";
import StudentInternshipDetails from "./Pages/Student/StudentInternshipDetails";
import StudentSavedInternships from "./Pages/Student/StudentSavedInternships";

// Notification & Calendar pages
import NotificationHome from "./Pages/Notification/NotificationHome";
import CalendarPage from "./Pages/Notification/CalendarPage";
import EventsPage from "./Pages/Notification/EventsPage";
import RemindersPage from "./Pages/Notification/RemindersPage";



function ProtectedRoute({ children, role }) {
  if (isTokenExpired()) { logout(); return <Navigate to="/login" replace />; }
  if (!isLoggedIn())    return <Navigate to="/login" replace />;

  const user = getUser();
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "Admin" ? "/admin/dashboard" : "/student/matches"} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ── LoaderPage at /loaderpage ── */}
      <Route path="/loaderpage" element={<LoaderPage />} />

      {/* ── Forgot password — standalone, no Layout (has its own bg) ── */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── All other routes inside gradient Layout ── */}
      <Route element={<MainLayout />}>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin/dashboard"          element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users"              element={<ProtectedRoute role="Admin"><UserDashboard /></ProtectedRoute>} />
        <Route path="/admin/add-internship"     element={<ProtectedRoute role="Admin"><AddInternship /></ProtectedRoute>} />
        <Route path="/admin/manage-internships" element={<ProtectedRoute role="Admin"><ManageInternships /></ProtectedRoute>} />
        <Route path="/admin/matching-engine"    element={<ProtectedRoute role="Admin"><MatchingEngine /></ProtectedRoute>} />
        <Route path="/admin/applications"       element={<ProtectedRoute role="Admin"><ApplicationsDashboard /></ProtectedRoute>} />
        <Route path="/admin/profile"            element={<ProtectedRoute role="Admin"><AdminProfilePage /></ProtectedRoute>} />
        {/* Student */}
        <Route path="/student"           element={<ProtectedRoute role="Student"><Navigate to="/student/matches" replace /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute role="Student"><Navigate to="/student/matches" replace /></ProtectedRoute>} />
        <Route path="/student/matches"             element={<ProtectedRoute role="Student"><StudentMatches /></ProtectedRoute>} />
        <Route path="/student/apply/:internshipId" element={<ProtectedRoute role="Student"><StudentApplyInternship /></ProtectedRoute>} />
        <Route path="/student/cv-upload"           element={<ProtectedRoute role="Student"><StudentCvUpload /></ProtectedRoute>} />
        <Route path="/student/notifications"       element={<ProtectedRoute role="Student"><StudentNotifications /></ProtectedRoute>} />
        <Route path="/student/profile"             element={<ProtectedRoute role="Student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/cv-builder"         element={<ProtectedRoute role="Student"><CVBuilder /></ProtectedRoute>} />
        <Route path="/student/internship-search"  element={<ProtectedRoute role="Student"><InternshipSearch /></ProtectedRoute>} />
        <Route path="/student/internship-search" element={<StudentInternshipSearch />} />
        <Route path="/student/internship-results" element={<StudentInternshipResults />} />
        <Route path="/student/internship-details" element={<StudentInternshipDetails />} />
        <Route path="/student/saved-internships" element={<StudentSavedInternships />} />


        <Route path="/notifications" element={<ProtectedRoute><NotificationHome /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><RemindersPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/homepage" replace />} />
      </Route>

        
      

    </Routes>
  );
}



function SplashLoader({ onFinish }) {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
      navigate("/homepage", { replace: true });
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate, onFinish]);
  return <LoaderPage />;
}

function App() {
  const [showLoader, setShowLoader] = useState(true);

  // Force navigation to /loaderpage on first load
  function ForceLoaderRedirect() {
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      if (location.pathname !== "/loaderpage") {
        navigate("/loaderpage", { replace: true });
      }
    }, [location, navigate]);
    return null;
  }

  return (
    <BrowserRouter>
      {showLoader ? (
        <>
          <ForceLoaderRedirect />
          {/* Only show LoaderPage at /loaderpage */}
          <Routes>
            <Route path="/loaderpage" element={<SplashLoader onFinish={() => setShowLoader(false)} />} />
            {/* Fallback: if not at /loaderpage, blank page (redirect will happen) */}
            <Route path="*" element={null} />
          </Routes>
        </>
      ) : (
        <AppRoutes />
      )}
    </BrowserRouter>
  );
}

export default App;
