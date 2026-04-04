/**
 * Event API Service
 * =================
 * Complete API service for event management with database integration
 * Handles all CRUD operations for events, calendar, and reminders
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/**
 * Handle API response and errors with proper error handling
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type')
  
  if (!response.ok) {
    let errorMessage = 'An error occurred'
    
    try {
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json()
        errorMessage = errorData.message || errorData.error || errorMessage
      } else {
        errorMessage = await response.text()
      }
    } catch (err) {
      console.error('Error parsing error response:', err)
    }
    
    throw {
      status: response.status,
      message: errorMessage,
      error: errorMessage,
    }
  }

  // Handle successful responses
  try {
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      return data.data || data // Support both { data: [...] } and direct array responses
    }
    return response.text()
  } catch (err) {
    console.error('Error parsing success response:', err)
    throw new Error('Invalid response format')
  }
}

/**
 * Event API Service Object
 */
export const eventAPI = {
  /**
   * Get all events from database
   * @returns {Promise<Array>} Array of events
   */
  async getAll() {
    try {
      console.log('Fetching all events from:', `${API_BASE_URL}/events`)
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await handleResponse(response)
      console.log('Events fetched successfully:', result)
      return result
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  },

  /**
   * Get a single event by ID
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Event object
   */
  async getById(id) {
    try {
      console.log('Fetching event by ID:', id)
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await handleResponse(response)
      console.log('Event fetched successfully:', result)
      return result
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  },

  /**
   * Create a new event in database
   * @param {Object} eventData - Event data to create
   * @param {string} eventData.title - Event title
   * @param {string} eventData.type - Event type (Interview, Deadline, Follow-up)
   * @param {string} eventData.date - Event date (YYYY-MM-DD)
   * @param {string} eventData.time - Event time (HH:MM)
   * @param {string} eventData.notes - Optional notes
   * @param {string} eventData.reminder - Reminder setting
   * @returns {Promise<Object>} Created event object
   */
  async create(eventData) {
    try {
      console.log('Creating new event:', eventData)
      
      // Validate required fields
      const requiredFields = ['title', 'type', 'date', 'time', 'reminder']
      const missingFields = requiredFields.filter(field => !eventData[field])
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      const result = await handleResponse(response)
      console.log('Event created successfully:', result)
      return result
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  /**
   * Update an existing event in database
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Updated event object
   */
  async update(id, eventData) {
    try {
      console.log('Updating event:', id, eventData)
      
      // Validate required fields
      const requiredFields = ['title', 'type', 'date', 'time', 'reminder']
      const missingFields = requiredFields.filter(field => !eventData[field])
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })
      const result = await handleResponse(response)
      console.log('Event updated successfully:', result)
      return result
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  /**
   * Delete an event from database
   * @param {string} id - Event ID
   * @returns {Promise<Object>} Deleted event object
   */
  async delete(id) {
    try {
      console.log('Deleting event:', id)
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const result = await handleResponse(response)
      console.log('Event deleted successfully:', result)
      return result
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  /**
   * Get events by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of events in date range
   */
  async getByDateRange(startDate, endDate) {
    try {
      const allEvents = await this.getAll()
      return allEvents.filter(event => {
        const eventDate = new Date(event.date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        return eventDate >= start && eventDate <= end
      })
    } catch (error) {
      console.error('Error getting events by date range:', error)
      throw error
    }
  },

  /**
   * Get today's events
   * @returns {Promise<Array>} Array of today's events
   */
  async getTodayEvents() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const allEvents = await this.getAll()
      return allEvents.filter(event => event.date === today)
    } catch (error) {
      console.error('Error getting today events:', error)
      throw error
    }
  },

  /**
   * Get upcoming events
   * @param {number} days - Number of days ahead to look
   * @returns {Promise<Array>} Array of upcoming events
   */
  async getUpcomingEvents(days = 7) {
    try {
      const today = new Date().toISOString().split('T')[0]
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)
      const futureDateString = futureDate.toISOString().split('T')[0]
      
      const allEvents = await this.getAll()
      return allEvents.filter(event => 
        event.date >= today && event.date <= futureDateString
      )
    } catch (error) {
      console.error('Error getting upcoming events:', error)
      throw error
    }
  },

  /**
   * Get events by type
   * @param {string} type - Event type (Interview, Deadline, Follow-up)
   * @returns {Promise<Array>} Array of events by type
   */
  async getByType(type) {
    try {
      const allEvents = await this.getAll()
      return allEvents.filter(event => event.type === type)
    } catch (error) {
      console.error('Error getting events by type:', error)
      throw error
    }
  }
}

/**
 * Calendar API Service - Specific calendar operations
 */
export const calendarAPI = {
  /**
   * Get events for calendar view
   * @param {string} year - Year (YYYY)
   * @param {string} month - Month (MM)
   * @returns {Promise<Array>} Array of events for the month
   */
  async getMonthEvents(year, month) {
    try {
      const startDate = `${year}-${month.padStart(2, '0')}-01`
      const endDate = `${year}-${month.padStart(2, '0')}-31`
      return await eventAPI.getByDateRange(startDate, endDate)
    } catch (error) {
      console.error('Error getting month events:', error)
      throw error
    }
  },

  /**
   * Get events for a specific date
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise<Array>} Array of events for the date
   */
  async getDateEvents(date) {
    try {
      const allEvents = await eventAPI.getAll()
      return allEvents.filter(event => event.date === date)
    } catch (error) {
      console.error('Error getting date events:', error)
      throw error
    }
  }
}

/**
 * Reminder API Service - Specific reminder operations
 */
export const reminderAPI = {
  /**
   * Get events that need reminders
   * @returns {Promise<Array>} Array of events with upcoming reminders
   */
  async getUpcomingReminders() {
    try {
      const allEvents = await eventAPI.getAll()
      const today = new Date().toISOString().split('T')[0]
      
      return allEvents.filter(event => {
        const eventDate = new Date(event.date)
        const todayDate = new Date(today)
        
        // Calculate reminder date based on reminder setting
        let reminderDate = new Date(eventDate)
        switch (event.reminder) {
          case 'same-day':
            reminderDate = eventDate
            break
          case '1-day':
            reminderDate.setDate(eventDate.getDate() - 1)
            break
          case '2-days':
            reminderDate.setDate(eventDate.getDate() - 2)
            break
          case '3-days':
            reminderDate.setDate(eventDate.getDate() - 3)
            break
          case '1-week':
            reminderDate.setDate(eventDate.getDate() - 7)
            break
          default:
            return false
        }
        
        return reminderDate <= todayDate && eventDate >= todayDate
      })
    } catch (error) {
      console.error('Error getting upcoming reminders:', error)
      throw error
    }
  },

  /**
   * Get overdue events
   * @returns {Promise<Array>} Array of overdue events
   */
  async getOverdueEvents() {
    try {
      const allEvents = await eventAPI.getAll()
      const today = new Date().toISOString().split('T')[0]
      
      return allEvents.filter(event => {
        const eventDate = new Date(event.date)
        const todayDate = new Date(today)
        return eventDate < todayDate
      })
    } catch (error) {
      console.error('Error getting overdue events:', error)
      throw error
    }
  }
}

// Export default eventAPI for backward compatibility
export default eventAPI
