/**
 * LocalStorage Utility Functions
 * ===============================
 * This file handles all localStorage operations for persisting events.
 * Events are stored as a JSON array under the key 'internship_events'.
 *
 * Features:
 * - Save events to localStorage
 * - Load events from localStorage
 * - Add new event with auto-generated ID
 * - Update existing event
 * - Delete event
 * - Get sample dummy data for testing
 */

// Key used for storing events in localStorage
const STORAGE_KEY = 'internship_events'

/**
 * Generates a unique ID for new events
 * Uses timestamp + random string for uniqueness
 * @returns {string} Unique event ID
 */
export function generateId() {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Loads all events from localStorage
 * @returns {Array} Array of event objects
 */
export function loadEvents() {
  try {
    // Get the stored JSON string
    const storedData = localStorage.getItem(STORAGE_KEY)

    // If no data exists, return empty array
    if (!storedData) {
      return []
    }

    // Parse and return the events array
    const events = JSON.parse(storedData)

    // Validate that it's an array
    if (!Array.isArray(events)) {
      console.warn('Stored data is not an array, returning empty array')
      return []
    }

    return events
  } catch (error) {
    // If parsing fails, log error and return empty array
    console.error('Error loading events from localStorage:', error)
    return []
  }
}

/**
 * Saves all events to localStorage
 * @param {Array} events - Array of event objects to save
 * @returns {boolean} True if successful, false otherwise
 */
export function saveEvents(events) {
  try {
    // Convert events array to JSON string and save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    return true
  } catch (error) {
    console.error('Error saving events to localStorage:', error)
    return false
  }
}

/**
 * Adds a new event to localStorage
 * @param {Object} eventData - The event data (without ID)
 * @returns {Object|null} The saved event with ID, or null if failed
 */
export function addEvent(eventData) {
  try {
    // Load existing events
    const events = loadEvents()

    // Create new event with generated ID and timestamp
    const newEvent = {
      ...eventData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add to events array
    events.push(newEvent)

    // Save updated array
    saveEvents(events)

    return newEvent
  } catch (error) {
    console.error('Error adding event:', error)
    return null
  }
}

/**
 * Updates an existing event in localStorage
 * @param {string} eventId - The ID of the event to update
 * @param {Object} updatedData - The updated event data
 * @returns {Object|null} The updated event, or null if not found
 */
export function updateEvent(eventId, updatedData) {
  try {
    // Load existing events
    const events = loadEvents()

    // Find the index of the event to update
    const eventIndex = events.findIndex(event => event.id === eventId)

    // If event not found, return null
    if (eventIndex === -1) {
      console.warn(`Event with ID ${eventId} not found`)
      return null
    }

    // Update the event while preserving ID and createdAt
    events[eventIndex] = {
      ...events[eventIndex],
      ...updatedData,
      id: eventId, // Ensure ID is not changed
      createdAt: events[eventIndex].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString(), // Update the timestamp
    }

    // Save updated array
    saveEvents(events)

    return events[eventIndex]
  } catch (error) {
    console.error('Error updating event:', error)
    return null
  }
}

/**
 * Deletes an event from localStorage
 * @param {string} eventId - The ID of the event to delete
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteEvent(eventId) {
  try {
    // Load existing events
    const events = loadEvents()

    // Filter out the event to delete
    const filteredEvents = events.filter(event => event.id !== eventId)

    // Check if an event was actually removed
    if (filteredEvents.length === events.length) {
      console.warn(`Event with ID ${eventId} not found`)
      return false
    }

    // Save the filtered array
    saveEvents(filteredEvents)

    return true
  } catch (error) {
    console.error('Error deleting event:', error)
    return false
  }
}

/**
 * Gets a single event by ID
 * @param {string} eventId - The ID of the event to retrieve
 * @returns {Object|null} The event object, or null if not found
 */
export function getEventById(eventId) {
  const events = loadEvents()
  return events.find(event => event.id === eventId) || null
}

/**
 * Clears all events from localStorage
 * Useful for testing or reset functionality
 * @returns {boolean} True if successful
 */
export function clearAllEvents() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing events:', error)
    return false
  }
}

/**
 * Returns sample dummy events for testing
 * These can be used to populate the app with initial data
 * @returns {Array} Array of sample event objects
 */
export function getSampleEvents() {
  // Get today's date for relative date calculations
  const today = new Date()

  // Helper function to format date as YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  // Helper function to add days to a date
  const addDays = (date, days) => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  return [
    {
      id: generateId(),
      title: 'Google Software Engineer Interview',
      type: 'Interview',
      date: formatDate(addDays(today, 2)),
      time: '10:00',
      notes: 'Prepare system design questions and coding practice on LeetCode',
      reminder: '1-day',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Microsoft Internship Application Deadline',
      type: 'Deadline',
      date: formatDate(addDays(today, 5)),
      time: '23:59',
      notes: 'Submit resume and cover letter through the portal',
      reminder: '2-days',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Follow up with Amazon Recruiter',
      type: 'Follow-up',
      date: formatDate(addDays(today, 1)),
      time: '14:00',
      notes: 'Send thank you email after phone screen',
      reminder: 'same-day',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Meta Technical Phone Screen',
      type: 'Interview',
      date: formatDate(addDays(today, 7)),
      time: '15:30',
      notes: 'Review data structures and algorithms',
      reminder: '2-days',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      title: 'Startup Internship Application',
      type: 'Deadline',
      date: formatDate(today),
      time: '18:00',
      notes: 'Finalize portfolio and submit application',
      reminder: 'same-day',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

/**
 * Initializes localStorage with sample events if empty
 * Call this on app startup to have demo data available
 * @returns {Array} The events array (either existing or newly created)
 */
export function initializeWithSampleData() {
  const existingEvents = loadEvents()

  // If there are no events, add sample data
  if (existingEvents.length === 0) {
    const sampleEvents = getSampleEvents()
    saveEvents(sampleEvents)
    return sampleEvents
  }

  return existingEvents
}
