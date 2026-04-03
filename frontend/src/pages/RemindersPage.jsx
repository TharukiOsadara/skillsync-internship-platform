/**
 * RemindersPage Component
 * =======================
 * Dedicated page for viewing and managing reminders.
 *
 * Features:
 * - Full view of upcoming reminders
 * - Overview statistics
 * - Quick navigation to events
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReminderPanel from '../components/ReminderPanel'
import { eventAPI } from '../services/api'
import { formatDateLocal } from '../utils/validation'

function RemindersPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

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

  // Calculate stats
  const today = formatDateLocal(new Date())
  const upcomingEvents = events.filter(e => {
    const eventDate = e.date
    return eventDate >= today
  })
  const todayEvents = events.filter(e => {
    const eventDate = e.date
    return eventDate === today
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading reminders...</p>
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
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              Notifications
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Upcoming
              <span className="block bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">
                Reminders
              </span>
            </h2>
            <p className="mt-2 max-w-xl text-slate-400">
              Stay on top of your schedule with timely notifications and reminders.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-400">{todayEvents.length}</p>
              <p className="text-xs text-slate-400">Today</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-cyan-400">{upcomingEvents.length}</p>
              <p className="text-xs text-slate-400">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reminder Panel */}
        <div className="lg:col-span-1">
          <ReminderPanel events={events} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6 lg:col-span-1">
          {/* Tips Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white">Reminder Tips</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 rounded-lg bg-red-400/20 p-2">
                  <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Overdue Events</p>
                  <p className="text-xs text-slate-400">Red items need immediate attention</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 rounded-lg bg-green-400/20 p-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Today's Events</p>
                  <p className="text-xs text-slate-400">Green items are scheduled for today</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 rounded-lg bg-amber-400/20 p-2">
                  <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Tomorrow</p>
                  <p className="text-xs text-slate-400">Amber items are coming up tomorrow</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 rounded-lg bg-cyan-400/20 p-2">
                  <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Upcoming</p>
                  <p className="text-xs text-slate-400">Cyan items are within your reminder window</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/events"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10"
              >
                <div className="rounded-lg bg-green-400/20 p-2">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Add New Event</p>
                  <p className="text-xs text-slate-400">Create a new interview, deadline, or follow-up</p>
                </div>
              </Link>

              <Link
                to="/calendar"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10"
              >
                <div className="rounded-lg bg-cyan-400/20 p-2">
                  <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">View Calendar</p>
                  <p className="text-xs text-slate-400">See your events on the calendar</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RemindersPage
