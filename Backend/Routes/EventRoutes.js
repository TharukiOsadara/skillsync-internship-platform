const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');

// GET all events
router.get('/', eventController.getAllEvents);

// GET single event by ID
router.get('/:id', eventController.getEventById);

// POST create new event
router.post('/', eventController.createEvent);

// PUT update event
router.put('/:id', eventController.updateEvent);

// DELETE event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;
