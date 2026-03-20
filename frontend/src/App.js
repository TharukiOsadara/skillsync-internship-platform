import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import InternshipSearchPage from './pages/InternshipSearchPage/InternshipSearchPage';
import InternshipResultsPage from './pages/InternshipResultsPage/InternshipResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InternshipSearchPage />} />
        <Route path="/results" element={<InternshipResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;