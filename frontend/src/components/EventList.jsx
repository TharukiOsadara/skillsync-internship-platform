/**
 * EventList Component
 * ===================
 * Displays a list of all saved events with options to edit and delete.
 *
 * Features:
 * - Show all events in a scrollable list
 * - Display event details (title, type, date, time)
 * - Color-coded event type badges
 * - Edit button to modify event
 * - Delete button with confirmation dialog
 * - Filter events by date
 * - Sort events by date (upcoming first)
 * - Empty state when no events exist
 */

import { useState, useMemo } from 'react'

function EventList({ events, onEdit, onDelete, selectedDate, onClearDateFilter }) {
  // State for delete confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  /**
   * Filter and sort events
   * - If selectedDate is set, show only events for that date
   * - Sort by date and time (ascending)
   */
  const filteredEvents = useMemo(() => {
    let filtered = events

    // Filter by selected date if provided
    if (selectedDate) {
      filtered = events.filter(event => event.date === selectedDate)
    }

    // Sort by date and time
    return [...filtered].sort((a, b) => {
      // First compare by date
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      // Then compare by time
      return a.time.localeCompare(b.time)
    })
  }, [events, selectedDate])

  /**
   * Get badge styling based on event type
   */
  function getTypeBadgeClass(type) {
    switch (type) {
      case 'Interview':
        return 'bg-cyan-400/20 text-cyan-400 border-cyan-400/30'
      case 'Deadline':
        return 'bg-red-400/20 text-red-400 border-red-400/30'
      case 'Follow-up':
        return 'bg-amber-400/20 text-amber-400 border-amber-400/30'
      default:
        return 'bg-slate-400/20 text-slate-400 border-slate-400/30'
    }
  }

  /**
   * Format date for display
   */
  function formatDate(dateString) {
    const date = new Date(dateString)
    const options = { weekday: 'short', month: 'short', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  /**
   * Format time for display (12-hour format)
   */
  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  /**
   * Get status indicator based on event date
   */
  function getEventStatus(dateString) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(dateString)
    eventDate.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { label: 'Overdue', class: 'bg-red-500/20 text-red-400' }
    } else if (diffDays === 0) {
      return { label: 'Today', class: 'bg-green-500/20 text-green-400' }
    } else if (diffDays === 1) {
      return { label: 'Tomorrow', class: 'bg-amber-500/20 text-amber-400' }
    } else if (diffDays <= 7) {
      return { label: `${diffDays} days`, class: 'bg-cyan-500/20 text-cyan-400' }
    }
    return null
  }

  /**
   * Handle delete click - show confirmation
   */
  function handleDeleteClick(event) {
    setDeleteConfirm(event)
  }

  /**
   * Confirm delete
   */
  function confirmDelete() {
    if (deleteConfirm && onDelete) {
      onDelete(deleteConfirm._id)
    }
    setDeleteConfirm(null)
  }

  /**
   * Cancel delete
   */
  function cancelDelete() {
    setDeleteConfirm(null)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {selectedDate ? 'Events for Selected Date' : 'All Events'}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {selectedDate && (
          <button
            onClick={onClearDateFilter}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Show All
          </button>
        )}
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-white/5 p-4">
            <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-slate-400">
            {selectedDate
              ? 'No events for this date'
              : 'No events yet. Add your first event!'}
          </p>
        </div>
      ) : (
        // Event Cards
        <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {filteredEvents.map(event => {
            const status = getEventStatus(event.date)

            return (
              <div
                key={event._id}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/10"
              >
                {/* Top Row: Title and Status */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h4 className="font-medium text-white line-clamp-1">{event.title}</h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {status && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${status.class}`}>
                        {status.label}
                      </span>
                    )}
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${getTypeBadgeClass(event.type)}`}
                    >
                      {event.type}
                    </span>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="mb-2 flex items-center gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(event.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatTime(event.time)}
                  </span>
                </div>

                {/* Notes (if any) */}
                {event.notes && (
                  <p className="mb-3 text-sm text-slate-500 line-clamp-2">{event.notes}</p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 opacity-60 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => onEdit(event)}
                    className="flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-cyan-400/20 hover:text-cyan-400"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(event)}
                    className="flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-red-400/20 hover:text-red-400"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-400/20 p-2">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Delete Event</h4>
            </div>
            <p className="mb-6 text-sm text-slate-400">
              Are you sure you want to delete "{deleteConfirm.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventList
