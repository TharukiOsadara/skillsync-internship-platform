const express = require('express');
const router = express.Router();
const InternshipControllers = require('../Controllers/InternshipControllers');
const { protect, adminOnly } = require('../Middleware/authMiddleware');

router.get('/', InternshipControllers.getInternships);
router.get('/search', InternshipControllers.searchInternships);
router.get('/stats', InternshipControllers.getStats);
router.get('/suggestions/:userId', InternshipControllers.getSuggestions);

router.post('/', protect, adminOnly, InternshipControllers.addInternship);
router.put('/:id', protect, adminOnly, InternshipControllers.updateInternship);
router.delete('/:id', protect, adminOnly, InternshipControllers.deleteInternship);

router.post('/:id/apply', protect, InternshipControllers.applyToInternship);
router.get('/applications', protect, adminOnly, InternshipControllers.getApplications);
router.patch('/applications/:id/read', protect, adminOnly, InternshipControllers.markApplicationRead);

module.exports = router;