import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import EventForm from '../../Components/EventForm'
import EventList from '../../Components/EventList'
import { eventAPI } from '../../services/api'
import StudentSidebar from "../../Components/StudentSidebar";

function EventsPage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingEvent, setEditingEvent] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => { loadEvents() }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      const data = await eventAPI.getAll()
      setEvents(data)
    } catch (err) {
      showError('Failed to load events')
      console.error('Error loading events:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  function showSuccess(text) { setMessage({ type: 'success', text }) }
  function showError(text)   { setMessage({ type: 'error',   text }) }

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      if (editingEvent) {
        await eventAPI.update(editingEvent._id, formData)
        showSuccess('Event updated successfully!')
        setEditingEvent(null)
      } else {
        await eventAPI.create(formData)
        showSuccess('Event added successfully!')
      }
      await loadEvents()
    } catch (err) {
      showError(err.message || 'Failed to save event')
      console.error('Error saving event:', err)
    }
  }, [editingEvent])

  const handleEdit = useCallback((event) => {
    setEditingEvent(event)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleCancelEdit = useCallback(() => { setEditingEvent(null) }, [])

  const handleDelete = useCallback(async (eventId) => {
    try {
      await eventAPI.delete(eventId)
      if (editingEvent && editingEvent._id === eventId) setEditingEvent(null)
      await loadEvents()
      showSuccess('Event deleted successfully!')
    } catch (err) {
      showError(err.message || 'Failed to delete event')
      console.error('Error deleting event:', err)
    }
  }, [editingEvent])

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#0B1220", fontFamily:"'DM Sans',sans-serif" }}>
          <StudentSidebar />
          <main style={{ flex:1, padding:"32px", overflowY:"auto", minWidth:0 }}>
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <div
        className="mx-auto flex w-full max-w-[96rem] flex-col px-3 py-6 sm:px-5 lg:px-6"
        style={{ height: '100%', overflow: 'hidden' }}
      >

        {/* ── Page Content ── */}
        <main className="flex-1 flex flex-col" style={{ overflowY: 'auto' }}>
          {loading ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-400 mx-auto mb-4"></div>
                <p className="text-slate-300">Loading events...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Page Header */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-green-400">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                      Event Management
                    </div>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      Manage Your
                      <span className="block bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">Events</span>
                    </h2>
                    <p className="mt-2 max-w-xl text-slate-400">Add, edit, and manage your internship interviews, deadlines, and follow-ups.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                      <p className="text-2xl font-bold text-green-400">{events.length}</p>
                      <p className="text-xs text-slate-400">Total Events</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success/Error Message */}
              {message.text && (
                <div className={`flex items-center gap-3 rounded-xl border p-4 backdrop-blur-xl transition-all duration-300 ${message.type === 'success' ? 'border-green-400/30 bg-green-400/10 text-green-400' : 'border-red-400/30 bg-red-400/10 text-red-400'}`}>
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  )}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              )}

              {/* Main Content Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <EventForm onSubmit={handleFormSubmit} editingEvent={editingEvent} onCancelEdit={handleCancelEdit} />
                </div>
                <div>
                  <EventList events={events} onEdit={handleEdit} onDelete={handleDelete} selectedDate={null} onClearDateFilter={() => {}} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
    </main>
    </div>
  )
}

export default EventsPage