import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InternshipSearchPage from './pages/InternshipSearchPage/InternshipSearchPage';
import InternshipResultsPage from './pages/InternshipResultsPage/InternshipResultsPage';
import SavedInternshipsPage from './pages/SavedInternshipsPage/SavedInternshipsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InternshipSearchPage />} />
        <Route path="/results" element={<InternshipResultsPage />} />
        <Route path="/saved" element={<SavedInternshipsPage />} />
      </Routes>
    </Router>
  );
}

export default App;