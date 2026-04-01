/**
 * App Component
 * =============
 * Root component of the Internship Matcher Calendar application.
 * Sets up the React Router with all routes and layouts.
 *
 * Routes:
 * - "/" - Home page with welcome message and quick navigation
 * - "/calendar" - Calendar view page for viewing schedule
 * - "/events" - Event management page for adding/editing/deleting events
 * - "/reminders" - Reminders page for viewing upcoming notifications
 *
 * Features:
 * - Uses BrowserRouter for client-side routing
 * - Layout component wraps all routes for consistent UI
 * - All data is stored in localStorage (no backend)
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CalendarPage from './pages/CalendarPage'
import EventsPage from './pages/EventsPage'
import RemindersPage from './pages/RemindersPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper for all routes */}
        <Route path="/" element={<Layout />}>
          {/* Home Page - Landing page with welcome message */}
          <Route index element={<HomePage />} />

          {/* Calendar Page - Calendar view for viewing schedule */}
          <Route path="calendar" element={<CalendarPage />} />

          {/* Events Page - Event management (add, edit, delete) */}
          <Route path="events" element={<EventsPage />} />

          {/* Reminders Page - View upcoming reminders */}
          <Route path="reminders" element={<RemindersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
