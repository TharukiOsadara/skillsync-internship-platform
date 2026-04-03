import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import ReminderPanel from '../../Components/ReminderPanel'
import { eventAPI } from '../../services/api'
import { formatDateLocal } from '../../Utils/validation'

function RemindersPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { loadEvents() }, [])

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

  const today          = formatDateLocal(new Date())
  const upcomingEvents = events.filter(e => e.date >= today)
  const todayEvents    = events.filter(e => e.date === today)

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <div
        className="mx-auto flex w-full max-w-[96rem] flex-col px-3 py-6 sm:px-5 lg:px-6"
        style={{ height: '100%', overflow: 'hidden' }}
      >
        {/* ── Navbar ── */}
        <header className="mb-8 flex-shrink-0 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.8)] backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Left: Back button + Title */}
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <button
                onClick={() => navigate('/student/matches')}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {/* Title */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">SkillSync Internships</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">Calendar & Notification Management</h1>
              </div>
            </div>

            {/* Right: Nav links */}
            <nav className="flex flex-wrap gap-2">
              <NavLink to="/notifications" className={({ isActive }) => `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}>Home</NavLink>
              <NavLink to="/calendar"      className={({ isActive }) => `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}>Calendar</NavLink>
              <NavLink to="/events"        className={({ isActive }) => `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-slate-950 shadow-lg shadow-green-500/25' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}>Events</NavLink>
              <NavLink to="/reminders"     className={({ isActive }) => `rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25' : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'}`}>Reminders</NavLink>
            </nav>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 flex flex-col" style={{ overflowY: 'auto' }}>
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-slate-300">Loading reminders...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
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
                      <span className="block bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">Reminders</span>
                    </h2>
                    <p className="mt-2 max-w-xl text-slate-400">Stay on top of your schedule with timely notifications and reminders.</p>
                  </div>
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
                <div className="lg:col-span-1">
                  <ReminderPanel events={events} />
                </div>
                <div className="space-y-6 lg:col-span-1">
                  {/* Tips Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h3 className="mb-4 text-lg font-semibold text-white">Reminder Tips</h3>
                    <div className="space-y-4">
                      {[
                        { color: 'red',   icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', title: 'Overdue Events', desc: 'Red items need immediate attention' },
                        { color: 'green', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                   title: "Today's Events", desc: 'Green items are scheduled for today' },
                        { color: 'amber', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                    title: 'Tomorrow',       desc: 'Amber items are coming up tomorrow' },
                        { color: 'cyan',  icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',                                       title: 'Upcoming',       desc: 'Cyan items are within your reminder window' },
                      ].map(t => (
                        <div key={t.title} className="flex gap-3">
                          <div className={`flex-shrink-0 rounded-lg bg-${t.color}-400/20 p-2`}>
                            <svg className={`h-4 w-4 text-${t.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{t.title}</p>
                            <p className="text-xs text-slate-400">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                    <h3 className="mb-4 text-lg font-semibold text-white">Quick Actions</h3>
                    <div className="flex flex-col gap-3">
                      <Link to="/events" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10">
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
                      <Link to="/calendar" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:bg-white/10">
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
          )}
        </main>
      </div>
    </div>
  )
}

export default RemindersPage