const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: String,
  duration: String,
  mode: String,
  timePreference: String,
  description: String,
  skillsRequired: String,
  deadline: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Internship", InternshipSchema);