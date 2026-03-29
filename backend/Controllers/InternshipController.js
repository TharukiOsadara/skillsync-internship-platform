const Internship = require("../Models/InternshipModel");

// GET ALL INTERNSHIPS
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find();

    res.status(200).json({ internships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SEARCH INTERNSHIPS
exports.searchInternships = async (req, res) => {
  try {
    const { location, duration, keyword } = req.query;

    let query = {};

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (duration) {
      query.duration = duration;
    }

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    const internships = await Internship.find(query);

    res.status(200).json({ internships });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};