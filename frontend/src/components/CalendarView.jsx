/**
 * CalendarView Component
 * ======================
 * A custom monthly calendar UI that displays events and highlights important dates.
 *
 * Features:
 * - Navigate between months (previous/next)
 * - Display current month and year
 * - Highlight today's date
 * - Show event indicators on dates with events
 * - Click on a date to filter/view events for that date
 * - Color-coded event type indicators
 */

import { useState, useMemo } from 'react'

function CalendarView({ events, onDateClick, selectedDate }) {
  // State for the currently displayed month/year
  const [currentDate, setCurrentDate] = useState(new Date())

  // Days of the week labels
  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Month names for display
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  /**
   * Calculate calendar grid data for the current month
   * Returns an array of week arrays, each containing day objects
   */
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Calculate days to show from previous month
    const startingDayOfWeek = firstDay.getDay()
    // Total days in current month
    const totalDays = lastDay.getDate()

    // Build calendar grid
    const days = []
    let dayCount = 1 - startingDayOfWeek

    // Create 6 weeks (rows) to ensure we cover all possible month layouts
    for (let week = 0; week < 6; week++) {
      const weekDays = []

      for (let day = 0; day < 7; day++) {
        if (dayCount < 1 || dayCount > totalDays) {
          // Day is outside current month
          weekDays.push({
            date: null,
            dayNumber: null,
            isCurrentMonth: false,
          })
        } else {
          // Day is in current month
          const dateObj = new Date(year, month, dayCount)
          weekDays.push({
            date: dateObj,
            dayNumber: dayCount,
            isCurrentMonth: true,
            dateString: formatDateString(dateObj),
          })
        }
        dayCount++
      }

      // Only add row if it has at least one day from current month
      if (weekDays.some(d => d.isCurrentMonth)) {
        days.push(weekDays)
      }
    }

    return days
  }, [currentDate])

  /**
   * Format a date object to YYYY-MM-DD string for comparison
  * Uses local timezone instead of UTC to avoid date shifting
  */
  function formatDateString(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  /**
   * Check if a date is today
   */
  function isToday(date) {
    if (!date) return false
    const today = new Date()
    return formatDateString(date) === formatDateString(today)
  }

  /**
   * Get events for a specific date
   */
  function getEventsForDate(dateString) {
    if (!dateString || !events) return []
    return events.filter(event => event.date === dateString)
  }

  /**
   * Get event type color for the indicator dot
   */
  function getEventTypeColor(type) {
    switch (type) {
      case 'Interview':
        return 'bg-cyan-400'
      case 'Deadline':
        return 'bg-red-400'
      case 'Follow-up':
        return 'bg-amber-400'
      default:
        return 'bg-slate-400'
    }
  }

  /**
   * Navigate to previous month
   */
  function goToPreviousMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  /**
   * Navigate to next month
   */
  function goToNextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  /**
   * Go to today's month
   */
  function goToToday() {
    setCurrentDate(new Date())
  }

  /**
   * Handle date cell click
   */
  function handleDateClick(dateString) {
    if (dateString && onDateClick) {
      onDateClick(dateString)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
      {/* Calendar Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>

        <div className="flex items-center gap-2">
          {/* Today Button */}
          <button
            onClick={goToToday}
            className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white"
          >
            Today
          </button>

          {/* Previous Month Button */}
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg bg-white/5 p-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            aria-label="Previous month"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Month Button */}
          <button
            onClick={goToNextMonth}
            className="rounded-lg bg-white/5 p-2 text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            aria-label="Next month"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid gap-1">
        {calendarDays.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDate(day.dateString)
              const isSelected = selectedDate === day.dateString
              const isTodayDate = isToday(day.date)

              return (
                <button
                  key={dayIndex}
                  onClick={() => handleDateClick(day.dateString)}
                  disabled={!day.isCurrentMonth}
                  className={`
                    relative flex min-h-[60px] sm:min-h-[70px] flex-col items-center justify-start rounded-lg p-1 sm:p-2
                    transition-all duration-200
                    ${day.isCurrentMonth
                      ? 'cursor-pointer hover:bg-white/10'
                      : 'cursor-default opacity-30'
                    }
                    ${isTodayDate
                      ? 'bg-gradient-to-br from-cyan-400/20 to-cyan-400/5 ring-1 ring-cyan-400/50'
                      : 'bg-white/5'
                    }
                    ${isSelected
                      ? 'ring-2 ring-cyan-400 bg-cyan-400/10'
                      : ''
                    }
                  `}
                >
                  {/* Day Number */}
                  {day.dayNumber && (
                    <>
                      <span
                        className={`
                          text-xs sm:text-sm font-medium
                          ${isTodayDate ? 'text-cyan-400 font-bold' : 'text-slate-200'}
                        `}
                      >
                        {day.dayNumber}
                      </span>

                      {/* Event Indicators */}
                      {dayEvents.length > 0 && (
                        <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                          {dayEvents.slice(0, 3).map((event, idx) => (
                            <span
                              key={idx}
                              className={`h-1.5 w-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                              title={event.title}
                            />
                          ))}
                          {dayEvents.length > 3 && (
                            <span className="text-[10px] text-slate-400">+{dayEvents.length - 3}</span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
          <span className="text-xs text-slate-400">Interview</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
          <span className="text-xs text-slate-400">Deadline</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
          <span className="text-xs text-slate-400">Follow-up</span>
        </div>
      </div>
    </div>
  )
}

export default CalendarView
