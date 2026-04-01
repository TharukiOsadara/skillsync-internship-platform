/**
 * CalendarPage Component
 * ======================
 * Calendar view page for viewing events on a calendar.
 *
 * Features:
 * - Interactive calendar view
 * - Click on dates to filter events
 * - View events in a list format
 * - Quick navigation to Events page for editing
 */

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import CalendarView from '../components/CalendarView'
import EventList from '../components/EventList'
import { eventAPI } from '../services/api'
import { formatDateLocal } from '../utils/validation'

function CalendarPage() {
  // State for all events loaded from backend
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for selected date filter from calendar
  const [selectedDate, setSelectedDate] = useState(null)

  /**
   * Load events from backend on component mount
   */
  useEffect(() => {
    loadEvents()
  }, [])

  /**
   * Fetch events from backend API
   */
  async function loadEvents() {
    try {
      setLoading(true)
      setError(null)
      const data = await eventAPI.getAll()
      setEvents(data)
    } catch (err) {
      setError(err.message || 'Failed to load events')
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle date click from calendar
   */
  const handleDateClick = useCallback((dateString) => {
    setSelectedDate(dateString)
  }, [])

  /**
   * Clear date filter
   */
  const handleClearDateFilter = useCallback(() => {
    setSelectedDate(null)
  }, [])

  // Calculate stats
  const today = formatDateLocal(new Date())
  const upcomingEvents = events.filter(e => {
    const eventDate = e.date
    return eventDate >= today
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-red-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Page Header */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Calendar View
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your
              <span className="block bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                Schedule
              </span>
            </h2>
            <p className="mt-2 max-w-xl text-slate-400">
              View your internship events on the calendar. Click on a date to filter events.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-cyan-400">{events.length}</p>
              <p className="text-xs text-slate-400">Total Events</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{upcomingEvents.length}</p>
              <p className="text-xs text-slate-400">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CalendarView
            events={events}
            onDateClick={handleDateClick}
            selectedDate={selectedDate}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          {/* Event List */}
          <EventList
            events={events}
            onEdit={null}
            onDelete={null}
            selectedDate={selectedDate}
            onClearDateFilter={handleClearDateFilter}
          />

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/events"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-green-500/25 transition-all duration-200 hover:shadow-green-400/40"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Event
              </Link>

              <Link
                to="/reminders"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-white/30 hover:bg-white/5"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                View Reminders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h3 className="mb-4 text-lg font-semibold text-white">Quick Tips</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 rounded-lg bg-cyan-400/20 p-2">
              <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Click Dates</p>
              <p className="text-xs text-slate-400">Click on a date to filter events for that day</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 rounded-lg bg-green-400/20 p-2">
              <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Add Events</p>
              <p className="text-xs text-slate-400">Go to the Events page to add or edit events</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 rounded-lg bg-amber-400/20 p-2">
              <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Reminders</p>
              <p className="text-xs text-slate-400">Check the Reminders page for upcoming notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
