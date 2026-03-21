import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InternshipSearchPage from './pages/InternshipSearchPage/InternshipSearchPage';
import InternshipResultsPage from './pages/InternshipResultsPage/InternshipResultsPage';
import SavedInternshipsPage from './pages/SavedInternshipsPage/SavedInternshipsPage';
import InternshipDetailsPage from './pages/InternshipDetailsPage/InternshipDetailsPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InternshipSearchPage />} />
        <Route path="/results" element={<InternshipResultsPage />} />
        <Route path="/saved" element={<SavedInternshipsPage />} />
        <Route path="/details/:id" element={<InternshipDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;