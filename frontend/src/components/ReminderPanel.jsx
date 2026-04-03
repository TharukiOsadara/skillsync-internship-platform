/**
 * ReminderPanel Component
 * =======================
 * Displays upcoming reminders with visual indicators for urgency.
 *
 * Features:
 * - Show upcoming events based on their reminder settings
 * - Color-coded badges for urgency (overdue, today, upcoming)
 * - Display reminder text like "Interview in 2 days"
 * - Filter reminders based on notification timing
 * - Compact card design for quick overview
 */

import { useMemo } from 'react'
import { REMINDER_OPTIONS } from '../utils/validation'

function ReminderPanel({ events }) {
  /**
   * Calculate days until an event
   */
  function getDaysUntil(dateString) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(dateString)
    eventDate.setHours(0, 0, 0, 0)
    return Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))
  }

  /**
   * Get reminder threshold in days from reminder option
   */
  function getReminderDays(reminderValue) {
    switch (reminderValue) {
      case 'same-day':
        return 0
      case '1-day':
        return 1
      case '2-days':
        return 2
      case '3-days':
        return 3
      case '1-week':
        return 7
      default:
        return 0
    }
  }

  /**
   * Filter and sort reminders that should be shown
   * Only show reminders that are within their notification window
   */
  const activeReminders = useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    return events
      .map(event => {
        const daysUntil = getDaysUntil(event.date)
        const reminderDays = getReminderDays(event.reminder)

        // Calculate status
        let status
        let statusClass
        let reminderText

        if (daysUntil < 0) {
          status = 'overdue'
          statusClass = 'bg-red-500'
          reminderText = `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} overdue`
        } else if (daysUntil === 0) {
          status = 'today'
          statusClass = 'bg-green-500'
          reminderText = 'Today'
        } else if (daysUntil === 1) {
          status = 'tomorrow'
          statusClass = 'bg-amber-500'
          reminderText = 'Tomorrow'
        } else {
          status = 'upcoming'
          statusClass = 'bg-cyan-500'
          reminderText = `In ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
        }

        return {
          ...event,
          daysUntil,
          reminderDays,
          status,
          statusClass,
          reminderText,
          shouldShow: daysUntil <= reminderDays || daysUntil < 0 || daysUntil <= 7, // Show within reminder window, overdue, or within a week
        }
      })
      .filter(event => event.shouldShow)
      .sort((a, b) => a.daysUntil - b.daysUntil)
  }, [events])

  /**
   * Get event type icon
   */
  function getEventIcon(type) {
    switch (type) {
      case 'Interview':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        )
      case 'Deadline':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      case 'Follow-up':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        )
      default:
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )
    }
  }

  /**
   * Format time for display
   */
  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  /**
   * Get status text color
   */
  function getStatusTextClass(status) {
    switch (status) {
      case 'overdue':
        return 'text-red-400'
      case 'today':
        return 'text-green-400'
      case 'tomorrow':
        return 'text-amber-400'
      default:
        return 'text-cyan-400'
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-cyan-400/20 p-2">
          <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Upcoming Reminders</h3>
          <p className="text-sm text-slate-400">
            {activeReminders.length} active reminder{activeReminders.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Reminders List */}
      {activeReminders.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 rounded-full bg-white/5 p-3">
            <svg className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-400">No upcoming reminders</p>
          <p className="text-xs text-slate-500">You're all caught up!</p>
        </div>
      ) : (
        <div className="max-h-[350px] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          {activeReminders.map((reminder, index) => (
            <div
              key={reminder._id}
              className={`
                relative rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-200 hover:bg-white/10
                ${index === 0 && reminder.status !== 'overdue' ? 'ring-1 ring-cyan-400/30' : ''}
                ${reminder.status === 'overdue' ? 'ring-1 ring-red-400/30' : ''}
              `}
            >
              {/* Status Indicator */}
              <div className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${reminder.statusClass}`} />

              <div className="ml-2 flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Title and Event Type */}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{getEventIcon(reminder.type)}</span>
                    <h4 className="text-sm font-medium text-white truncate">{reminder.title}</h4>
                  </div>

                  {/* Time */}
                  <p className="mt-1 text-xs text-slate-500">
                    {formatTime(reminder.time)}
                  </p>
                </div>

                {/* Reminder Badge */}
                <div className="flex-shrink-0 text-right">
                  <span className={`text-xs font-medium ${getStatusTextClass(reminder.status)}`}>
                    {reminder.reminderText}
                  </span>
                  <p className="mt-0.5 text-[10px] text-slate-500">{reminder.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {activeReminders.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
          <div className="rounded-lg bg-red-400/10 p-2 text-center">
            <p className="text-lg font-bold text-red-400">
              {activeReminders.filter(r => r.status === 'overdue').length}
            </p>
            <p className="text-[10px] text-slate-400">Overdue</p>
          </div>
          <div className="rounded-lg bg-green-400/10 p-2 text-center">
            <p className="text-lg font-bold text-green-400">
              {activeReminders.filter(r => r.status === 'today').length}
            </p>
            <p className="text-[10px] text-slate-400">Today</p>
          </div>
          <div className="rounded-lg bg-cyan-400/10 p-2 text-center">
            <p className="text-lg font-bold text-cyan-400">
              {activeReminders.filter(r => r.status === 'upcoming' || r.status === 'tomorrow').length}
            </p>
            <p className="text-[10px] text-slate-400">Upcoming</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReminderPanel
