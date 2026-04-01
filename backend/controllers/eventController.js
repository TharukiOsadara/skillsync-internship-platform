const Event = require('../models/Event');

/**
 * Validate date format (YYYY-MM-DD)
 */
const isValidDateFormat = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validate time format (HH:MM)
 */
const isValidTimeFormat = (timeString) => {
  const regex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(timeString);
};

/**
 * Validate MongoDB ObjectId format
 */
const isValidObjectId = (id) => {
  return id.match(/^[0-9a-fA-F]{24}$/);
};

/**
 * GET /api/events
 * Retrieve all events sorted by date and time
 */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, time: 1 });
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};

/**
 * GET /api/events/:id
 * Retrieve a single event by ID
 */
exports.getEventById = async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
};

/**
 * POST /api/events
 * Create a new event
 * Body: { title, type, date (YYYY-MM-DD), time (HH:MM), notes, reminder }
 */
exports.createEvent = async (req, res) => {
  try {
    const { title, type, date, time, notes, reminder } = req.body;

    // Validate required fields
    if (!title || !type || !date || !time || !reminder) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, type, date, time, reminder',
      });
    }

    // Validate date format
    if (!isValidDateFormat(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format',
        error: 'Invalid date format',
      });
    }

    // Validate time format
    if (!isValidTimeFormat(time)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Please use HH:MM format (24-hour)',
        error: 'Invalid time format',
      });
    }

    // Create new event
    const event = new Event({
      title: title.trim(),
      type,
      date,
      time,
      notes: (notes || '').trim(),
      reminder,
    });

    const savedEvent = await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: savedEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: messages.join(', '),
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
};

/**
 * PUT /api/events/:id
 * Update an existing event
 */
exports.updateEvent = async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const { title, type, date, time, notes, reminder } = req.body;

    // Validate required fields
    if (!title || !type || !date || !time || !reminder) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, type, date, time, reminder',
      });
    }

    // Validate date format
    if (!isValidDateFormat(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format',
        error: 'Invalid date format',
      });
    }

    // Validate time format
    if (!isValidTimeFormat(time)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid time format. Please use HH:MM format (24-hour)',
        error: 'Invalid time format',
      });
    }

    // Find and update event
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        type,
        date,
        time,
        notes: (notes || '').trim(),
        reminder,
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    console.error('Error updating event:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: messages.join(', '),
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/events/:id
 * Delete an event
 */
exports.deleteEvent = async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: event,
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};
