const express = require('express');
const router = express.Router();
const InternshipControllers = require('../Controllers/InternshipControllers');
const { protect, adminOnly } = require('../Middleware/authMiddleware');

router.get("/", InternshipControllers.getInternships);
router.post("/", InternshipControllers.addInternship);
router.put("/:id", InternshipControllers.updateInternship);
router.delete("/:id", InternshipControllers.deleteInternship);
router.get('/stats',InternshipControllers.getStats);
// This is the route for your "Suggestion Module"
router.get("/suggestions/:userId", InternshipControllers.getSuggestions);
router.post('/:id/apply', protect, InternshipControllers.applyToInternship);
router.get('/applications', protect, adminOnly, InternshipControllers.getApplications);
router.patch('/applications/:id/read', protect, adminOnly, InternshipControllers.markApplicationRead);

module.exports = router;
