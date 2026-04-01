const express = require("express");
const router = express.Router();

const {
  getAllInternships,
  searchInternships
} = require("../Controllers/StudentInternshipController");

router.get("/", getAllInternships);
router.get("/search", searchInternships);

module.exports = router;