const express = require('express');
const eventController = require('../controllers/eventController');

const router = express.Router();

/**
 * GET /api/events - Retrieve all events
 */
router.get('/', eventController.getAllEvents);

/**
 * GET /api/events/:id - Retrieve a single event
 */
router.get('/:id', eventController.getEventById);

/**
 * POST /api/events - Create a new event
 */
router.post('/', eventController.createEvent);

/**
 * PUT /api/events/:id - Update an event
 */
router.put('/:id', eventController.updateEvent);

/**
 * DELETE /api/events/:id - Delete an event
 */
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
