const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const {
    getMyCV,
    saveCV,
    updateCV,
    deleteCV,
    getCVByUserId
} = require('../Controllers/CVController');

// ───────────────────────────────────────────────────────────────────────────────
// CV Builder Routes
// Base path: /cv
// ───────────────────────────────────────────────────────────────────────────────

// GET /cv - Get logged-in user's CV
router.get('/', protect, getMyCV);

// POST /cv - Create or update CV for logged-in user
router.post('/', protect, saveCV);

// PATCH /cv - Update specific fields of CV
router.patch('/', protect, updateCV);

// DELETE /cv - Delete logged-in user's CV
router.delete('/', protect, deleteCV);

// GET /cv/user/:userId - Get CV by user ID (Admin only)
router.get('/user/:userId', protect, adminOnly, getCVByUserId);

module.exports = router;
