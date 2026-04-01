/**
 * EventForm Component
 * ===================
 * A form for adding and editing internship-related events.
 *
 * Features:
 * - Input fields for all event details
 * - Real-time validation with inline error messages
 * - Red border styling for invalid inputs
 * - Disabled submit button when form is invalid
 * - Edit mode for updating existing events
 * - Clear form functionality
 */

import { useState, useEffect } from 'react'
import {
  validateTitle,
  validateType,
  validateDate,
  validateTime,
  validateNotes,
  validateReminder,
  validateForm,
  isFormValid,
  getMinTimeForDate,
  EVENT_TYPES,
  REMINDER_OPTIONS,
  formatDateLocal,
} from '../utils/validation'

// Initial empty form state
const INITIAL_FORM_STATE = {
  title: '',
  type: '',
  date: '',
  time: '',
  notes: '',
  reminder: '',
}

function EventForm({ onSubmit, editingEvent, onCancelEdit }) {
  // Form data state
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)

  // Validation errors state
  const [errors, setErrors] = useState({})

  // Track which fields have been touched (for showing errors only after interaction)
  const [touched, setTouched] = useState({})

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Effect: Populate form when editing an existing event
   */
  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title || '',
        type: editingEvent.type || '',
        date: editingEvent.date || '',
        time: editingEvent.time || '',
        notes: editingEvent.notes || '',
        reminder: editingEvent.reminder || '',
      })
      // Mark all fields as touched when editing
      setTouched({
        title: true,
        type: true,
        date: true,
        time: true,
        notes: true,
        reminder: true,
      })
    } else {
      // Reset form when not editing
      resetForm()
    }
  }, [editingEvent])

  /**
   * Handle input field changes
   */
  function handleChange(e) {
    const { name, value } = e.target

    // Update form data
    const newFormData = {
      ...formData,
      [name]: value,
    }
    setFormData(newFormData)

    // Validate the specific field
    const fieldError = validateField(name, value, newFormData)
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }))

    // If date changes, re-validate time (in case it becomes invalid due to past time)
    if (name === 'date' && formData.time && touched.time) {
      const timeError = validateField('time', formData.time, newFormData)
      setErrors(prev => ({
        ...prev,
        time: timeError,
      }))
    }
  }

  /**
   * Handle field blur (mark as touched)
   */
  function handleBlur(e) {
    const { name, value } = e.target

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))

    // Validate the field
    const fieldError = validateField(name, value, formData)
    setErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }))
  }

  /**
   * Validate a specific field
   */
  function validateField(name, value, currentFormData = formData) {
    switch (name) {
      case 'title':
        return validateTitle(value)
      case 'type':
        return validateType(value)
      case 'date':
        return validateDate(value)
      case 'time':
        // Pass the date for time validation
        return validateTime(value, currentFormData.date)
      case 'notes':
        return validateNotes(value)
      case 'reminder':
        return validateReminder(value)
      default:
        return ''
    }
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)

    // Mark all fields as touched
    setTouched({
      title: true,
      type: true,
      date: true,
      time: true,
      notes: true,
      reminder: true,
    })

    // Validate entire form
    const formErrors = validateForm(formData)
    setErrors(formErrors)

    // If form is valid, submit
    if (isFormValid(formErrors)) {
      // Call the onSubmit callback
      await onSubmit(formData)
      // Reset form after successful submission
      resetForm()
    }

    setIsSubmitting(false)
  }

  /**
   * Reset the form to initial state
   */
  function resetForm() {
    setFormData(INITIAL_FORM_STATE)
    setErrors({})
    setTouched({})
  }

  /**
   * Handle cancel edit
   */
  function handleCancelEdit() {
    resetForm()
    if (onCancelEdit) {
      onCancelEdit()
    }
  }

  /**
   * Get input field class names based on error state
   */
  function getInputClassName(fieldName) {
    const baseClasses =
      'w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-2'
    const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
    const normalClasses = 'border-white/10 focus:border-cyan-400 focus:ring-cyan-400/30'

    const hasError = touched[fieldName] && errors[fieldName]
    return `${baseClasses} ${hasError ? errorClasses : normalClasses}`
  }

  /**
   * Get minimum date (today) for date input
   */
  function getMinDate() {
    return formatDateLocal(new Date())
  }

  /**
   * Calculate remaining characters for notes
   */
  function getNotesRemaining() {
    return 200 - (formData.notes?.length || 0)
  }

  /**
   * Check if submit button should be disabled
   */
  function isSubmitDisabled() {
    // Check if any required field is empty
    const hasEmptyRequired =
      !formData.title || !formData.type || !formData.date || !formData.time || !formData.reminder

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(error => error !== '')

    return hasEmptyRequired || hasErrors || isSubmitting
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-xl">
      {/* Form Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">
          {editingEvent ? 'Edit Event' : 'Add New Event'}
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          {editingEvent
            ? 'Update the event details below'
            : 'Fill in the details for your internship event'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Event Title */}
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-300">
            Event Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Google Technical Interview"
            className={getInputClassName('title')}
          />
          {touched.title && errors.title && (
            <p className="mt-1.5 text-xs text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-slate-300">
            Event Type <span className="text-red-400">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('type')}
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {touched.type && errors.type && (
            <p className="mt-1.5 text-xs text-red-400">{errors.type}</p>
          )}
        </div>

        {/* Date and Time Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Date */}
          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-300">
              Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              onBlur={handleBlur}
              min={getMinDate()}
              className={getInputClassName('date')}
            />
            {touched.date && errors.date && (
              <p className="mt-1.5 text-xs text-red-400">{errors.date}</p>
            )}
          </div>

          {/* Time */}
          <div>
            <label htmlFor="time" className="mb-1.5 block text-sm font-medium text-slate-300">
              Time <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              onBlur={handleBlur}
              min={getMinTimeForDate(formData.date)}
              className={getInputClassName('time')}
            />
            {touched.time && errors.time && (
              <p className="mt-1.5 text-xs text-red-400">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-slate-300">
            Notes{' '}
            <span className="text-slate-500">(optional, {getNotesRemaining()} characters left)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Add any additional notes or preparation tips..."
            rows={3}
            maxLength={200}
            className={getInputClassName('notes')}
          />
          {touched.notes && errors.notes && (
            <p className="mt-1.5 text-xs text-red-400">{errors.notes}</p>
          )}
        </div>

        {/* Reminder Option */}
        <div>
          <label htmlFor="reminder" className="mb-1.5 block text-sm font-medium text-slate-300">
            Reminder <span className="text-red-400">*</span>
          </label>
          <select
            id="reminder"
            name="reminder"
            value={formData.reminder}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputClassName('reminder')}
          >
            <option value="">Select reminder time</option>
            {REMINDER_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {touched.reminder && errors.reminder && (
            <p className="mt-1.5 text-xs text-red-400">{errors.reminder}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitDisabled()}
            className={`
              flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200
              ${isSubmitDisabled()
                ? 'cursor-not-allowed bg-slate-700 text-slate-400'
                : 'bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40'
              }
            `}
          >
            {isSubmitting
              ? 'Saving...'
              : editingEvent
              ? 'Update Event'
              : 'Add Event'}
          </button>

          {editingEvent && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-white/30 hover:bg-white/5"
            >
              Cancel
            </button>
          )}

          {!editingEvent && (formData.title || formData.type || formData.date) && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-slate-300 transition-all duration-200 hover:border-white/30 hover:bg-white/5"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default EventForm
