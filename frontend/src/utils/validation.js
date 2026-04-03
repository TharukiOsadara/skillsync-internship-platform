/**
 * Validation Utility Functions
 * ============================
 * This file contains all validation logic for the event form.
 * Each function validates a specific field and returns an error message if invalid.
 *
 * Validation Rules:
 * - Event title: Required, cannot be empty
 * - Event type: Required, must be one of the valid types
 * - Date: Required, cannot be in the past (only today or future)
 * - Time: Required, cannot be in the past if date is today
 * - Notes: Optional, but max 200 characters
 * - Reminder: Required, must be a valid option
 */

// Valid event types for the dropdown
export const EVENT_TYPES = ['Interview', 'Deadline', 'Follow-up']

// Valid reminder options
export const REMINDER_OPTIONS = [
  { value: 'same-day', label: 'Same day' },
  { value: '1-day', label: '1 day before' },
  { value: '2-days', label: '2 days before' },
  { value: '3-days', label: '3 days before' },
  { value: '1-week', label: '1 week before' },
]

/**
 * Validates the event title
 * @param {string} title - The event title to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
export function validateTitle(title) {
  // Check if title is empty or only whitespace
  if (!title || title.trim() === '') {
    return 'Event title is required'
  }
  // Check minimum length
  if (title.trim().length < 3) {
    return 'Title must be at least 3 characters'
  }
  // Check maximum length
  if (title.trim().length > 100) {
    return 'Title must not exceed 100 characters'
  }
  return '' // No error
}

/**
 * Validates the event type
 * @param {string} type - The event type to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
export function validateType(type) {
  if (!type || type.trim() === '') {
    return 'Event type is required'
  }
  if (!EVENT_TYPES.includes(type)) {
    return 'Please select a valid event type'
  }
  return ''
}

/**
 * Validates the event date
 * @param {string} date - The date string in YYYY-MM-DD format
 * @returns {string} Error message if invalid, empty string if valid
 */
export function validateDate(date) {
  if (!date || date.trim() === '') {
    return 'Date is required'
  }

  // Parse the selected date
  const selectedDate = new Date(date)

  // Get today's date at midnight for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if date is in the past
  if (selectedDate < today) {
    return 'Date cannot be in the past'
  }

  return ''
}

/**
 * Validates the event time
 * @param {string} time - The time string in HH:MM format
 * @param {string} date - The date string in YYYY-MM-DD format (optional)
 * @returns {string} Error message if invalid, empty string if valid
 */
export function validateTime(time, date = null) {
  if (!time || time.trim() === '') {
    return 'Time is required'
  }

  // Basic time format validation (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(time)) {
    return 'Please enter a valid time'
  }

  // If date is provided and it's today, check if time is not in the past
  if (date) {
    const selectedDate = new Date(date)
    const today = new Date()

    // Check if selected date is today
    const isToday = selectedDate.toDateString() === today.toDateString()

    if (isToday) {
      // Parse selected time
      const [hours, minutes] = time.split(':').map(Number)
      const selectedDateTime = new Date()
      selectedDateTime.setHours(hours, minutes, 0, 0)

      // Get current time
      const now = new Date()

      // Check if selected time is in the past
      if (selectedDateTime <= now) {
        return 'Time cannot be in the past for today\'s events'
      }
    }
  }

  return ''
}

/**
 * Validates the notes field
 * @param {string} notes - The notes text to validate
 * @returns {string} Error message if invalid, empty string if valid
 */
export function validateNotes(notes) {
  // Notes are optional, but if provided, must not exceed 200 characters
  if (notes && notes.length > 200) {
    return 'Notes must not exceed 200 characters'
  }
  return ''
}

/**
 * Validates the reminder option
 * @param {string} reminder - The reminder option value
 * @returns {string} Error message if invalid, empty string if valid
 */
export function validateReminder(reminder) {
  if (!reminder || reminder.trim() === '') {
    return 'Please select a reminder option'
  }

  const validOptions = REMINDER_OPTIONS.map(opt => opt.value)
  if (!validOptions.includes(reminder)) {
    return 'Please select a valid reminder option'
  }

  return ''
}

/**
 * Validates the entire form and returns all errors
 * @param {Object} formData - The form data object
 * @returns {Object} Object containing field names as keys and error messages as values
 */
export function validateForm(formData) {
  const errors = {}

  // Validate each field
  const titleError = validateTitle(formData.title)
  if (titleError) errors.title = titleError

  const typeError = validateType(formData.type)
  if (typeError) errors.type = typeError

  const dateError = validateDate(formData.date)
  if (dateError) errors.date = dateError

  // Pass the date to time validation for context-aware validation
  const timeError = validateTime(formData.time, formData.date)
  if (timeError) errors.time = timeError

  const notesError = validateNotes(formData.notes)
  if (notesError) errors.notes = notesError

  const reminderError = validateReminder(formData.reminder)
  if (reminderError) errors.reminder = reminderError

  return errors
}

/**
 * Checks if the form is valid (no errors)
 * @param {Object} errors - The errors object from validateForm
 * @returns {boolean} True if form is valid, false otherwise
 */
export function isFormValid(errors) {
  return Object.keys(errors).length === 0
}

/**
 * Gets the minimum time for the time input based on selected date
 * @param {string} selectedDate - The selected date in YYYY-MM-DD format
 * @returns {string} Minimum time string in HH:MM format, or empty string if not today
 */
export function getMinTimeForDate(selectedDate) {
  if (!selectedDate) return ''

  const today = new Date()
  const selected = new Date(selectedDate)

  // Check if selected date is today
  if (selected.toDateString() === today.toDateString()) {
    // Add a few minutes buffer to current time
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5) // 5 minute buffer

    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')

    return `${hours}:${minutes}`
  }

  return '' // No minimum time for future dates
}

/**
 * Format a Date object to YYYY-MM-DD string using local timezone
 * Avoids timezone issues that occur with toISOString()
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
export function formatDateLocal(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
