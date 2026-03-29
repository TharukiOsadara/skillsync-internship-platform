const express = require("express");
const router = express.Router();

const {
  getAllInternships,
  searchInternships
} = require("../Controllers/InternshipController");

router.get("/", getAllInternships);
router.get("/search", searchInternships);

module.exports = router;