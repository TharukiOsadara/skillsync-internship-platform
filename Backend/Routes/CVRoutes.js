const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../Middleware/authMiddleware');
const {
    getMyCV,
    saveCV,
    updateCV,
    deleteCV,
    getCVByUserId,
    updateCVByEmail,
    getCVByEmail,
    saveCVAndGetMatches
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

// ───────────────────────────────────────────────────────────────────────────────
// CV Builder Email-based Routes (for CV builder save/load functionality)
// ───────────────────────────────────────────────────────────────────────────────

// GET /cv/email/:email - Get CV by email (for CV builder load)
router.get('/email/:email', getCVByEmail);

// PUT /cv/email/:email - Update CV by email (for CV builder save)
router.put('/email/:email', updateCVByEmail);

// POST /cv/email/:email - Create or update CV by email (alternative for CV builder save)
router.post('/email/:email', updateCVByEmail);

// POST /cv/email/:email/matches - Save CV and get matching internships (for CV builder save + navigate to matches)
router.post('/email/:email/matches', saveCVAndGetMatches);

module.exports = router;