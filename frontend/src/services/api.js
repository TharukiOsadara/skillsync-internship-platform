/**
 * API Service
 * ===========
 * Centralized API service for all backend communication.
 * This provides a clean interface for frontend components to call backend APIs.
 *
 * Usage:
 * import { eventAPI } from './services/api'
 * const events = await eventAPI.getAll()
 */

// Import the comprehensive event API
export { eventAPI, calendarAPI, reminderAPI } from './eventAPI'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/**
 * Handle API response and errors
 */
async function handleResponse(response) {
  const data = await response.json()

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      error: data.error,
    }
  }

  return data
}

/**
 * Legacy Event API Service (for backward compatibility)
 * @deprecated Use eventAPI from eventAPI.js instead
 */
export const legacyEventAPI = {
  /**
   * Get all events
   * @returns {Promise} Array of events
   */
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/events`)
      const result = await handleResponse(response)
      return result.data || []
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  /**
   * Get a single event by ID
   * @param {string} id - Event ID
   * @returns {Promise} Event object
   */
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`)
      const result = await handleResponse(response)
      return result.data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  /**
   * Create a new event
   * @param {Object} eventData - Event data to create
   * @returns {Promise} Created event object
   */
  async create(eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      const result = await handleResponse(response)
      return result.data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  /**
   * Update an existing event
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise} Updated event object
   */
  async update(id, eventData) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      const result = await handleResponse(response)
      return result.data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise} Deleted event object
   */
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
      })
      const result = await handleResponse(response)
      return result.data
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },
}

/**
 * Health check API
 */
export const healthAPI = {
  async check() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`)
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  },
}

// Default export for backward compatibility
export default {
  eventAPI: legacyEventAPI,
  healthAPI
}
