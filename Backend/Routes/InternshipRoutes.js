const express = require('express');
const router = express.Router();
const {
    getInternships,
    searchInternships,
    addInternship,
    updateInternship,
    deleteInternship,
    getSuggestions,
    refreshMatches, // NEW: real-time refresh endpoint
    getStats,
    applyToInternship,
    getApplications,
    markApplicationRead
} = require('../Controllers/InternshipControllers');
const { protect, adminOnly } = require('../Middleware/authMiddleware');

router.get("/", getInternships);
router.get("/search", searchInternships);
router.post("/", addInternship);
router.put("/:id", updateInternship);
router.delete("/:id", deleteInternship);
router.get('/stats',getStats);
// This is the route for your "Suggestion Module"
router.get("/suggestions/:userId", getSuggestions);
// NEW: Real-time refresh endpoint for immediate updates
router.get("/refresh-matches/:userId", refreshMatches);
router.post('/:id/apply', protect, applyToInternship);
router.get('/applications', protect, adminOnly, getApplications);
router.patch('/applications/:id/read', protect, adminOnly, markApplicationRead);

module.exports = router;

