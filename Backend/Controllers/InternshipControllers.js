const Internship = require('../Models/InternshipModel');
const User = require('../Models/UserModel');

// @desc    Get all Internships
const getInternships = async (req, res) => {
    let internships;
    try {
        internships = await Internship.find();
        return res.status(200).json({ internships });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Add new Internship (Admin Input)
const addInternship = async (req, res) => {
    const { title, company, location, duration, skillsRequired, deadline } = req.body;
    let internship;
    try {
        internship = new Internship({ title, company, location, duration, skillsRequired, deadline });
        await internship.save();
    } catch (err) {
        return res.status(400).json({ message: 'Unable to add Internship', error: err.message });
    }
    return res.status(201).json({ internship });
};

// @desc    Delete Internship
const deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findByIdAndDelete(req.params.id);
        if (!internship) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ message: 'Internship deleted successfully' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Skill-Based Suggestions (Your Component's Special Feature)
const getSuggestions = async (req, res) => {
    const id = req.params.userId;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Logic: Find internships where skillsRequired matches user skills
        // We use a regex to see if any user skill exists in the internship requirement
        const suggestions = await Internship.find({
            skillsRequired: { $regex: user.skills, $options: 'i' }
        });

        return res.status(200).json({ suggestions });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

exports.getInternships = getInternships;
exports.addInternship = addInternship;
exports.deleteInternship = deleteInternship;
exports.getSuggestions = getSuggestions;