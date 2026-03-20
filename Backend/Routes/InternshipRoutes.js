const express = require('express');
const router = express.Router();
const InternshipControllers = require('../Controllers/InternshipControllers');

router.get("/", InternshipControllers.getInternships);
router.post("/", InternshipControllers.addInternship);
router.delete("/:id", InternshipControllers.deleteInternship);

// This is the route for your "Suggestion Module"
router.get("/suggestions/:userId", InternshipControllers.getSuggestions);

module.exports = router;