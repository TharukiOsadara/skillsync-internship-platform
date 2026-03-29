import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import StudentInternshipSearch from "./Pages/Student/StudentInternshipSearch";
import StudentInternshipResults from "./Pages/Student/StudentInternshipResults";
import StudentInternshipDetails from "./Pages/Student/StudentInternshipDetails";
import StudentSavedInternships from "./Pages/Student/StudentSavedInternships";

function App() {
  return (
    <Router>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/student/internship-search" />} />

        {/* Your 4 pages */}
        <Route path="/student/internship-search" element={<StudentInternshipSearch />} />
        <Route path="/student/internship-results" element={<StudentInternshipResults />} />
        <Route path="/student/internship-details" element={<StudentInternshipDetails />} />
        <Route path="/student/saved-internships" element={<StudentSavedInternships />} />

      </Routes>
    </Router>
  );
}

export default App;