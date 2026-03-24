const Internship = require('../Models/InternshipModel');
const User = require('../Models/UserModel');

const hasLetter = (value = '') => /[A-Za-z]/.test(String(value));
const startsWithDigit = (value = '') => /^\d/.test(String(value).trim());

const validateInternshipPayload = ({ title, company, location, duration, skillsRequired, deadline }) => {
    if (!title || !company || !location || !duration || !skillsRequired || !deadline) {
        return 'All internship fields are required.';
    }

    if (startsWithDigit(title)) return 'Internship title cannot start with a number.';
    if (startsWithDigit(company)) return 'Company name cannot start with a number.';
    if (startsWithDigit(location)) return 'Location cannot start with a number.';
    if (startsWithDigit(skillsRequired)) return 'Skills required cannot start with a number.';

    if (!hasLetter(title)) return 'Internship title must include letters.';
    if (!hasLetter(company)) return 'Company name must include letters.';
    if (!hasLetter(location)) return 'Location must include letters.';
    if (!hasLetter(skillsRequired)) return 'Skills required must include letters.';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(deadline) <= today) return 'Deadline must be a future date.';

    return null;
};

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

    const validationError = validateInternshipPayload({ title, company, location, duration, skillsRequired, deadline });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        internship = new Internship({ title, company, location, duration, skillsRequired, deadline });
        await internship.save();
    } catch (err) {
        return res.status(400).json({ message: 'Unable to add Internship', error: err.message });
    }
    return res.status(201).json({ internship });
};

// @desc    Update Internship
const updateInternship = async (req, res) => {
    const { title, company, location, duration, skillsRequired, deadline } = req.body;

    const validationError = validateInternshipPayload({ title, company, location, duration, skillsRequired, deadline });
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const internship = await Internship.findByIdAndUpdate(
            req.params.id,
            { title, company, location, duration, skillsRequired, deadline },
            { new: true, runValidators: true }
        );

        if (!internship) return res.status(404).json({ message: 'Not found' });
        return res.status(200).json({ internship });
    } catch (err) {
        return res.status(400).json({ message: 'Unable to update Internship', error: err.message });
    }
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

// @desc    Skill-Based Suggestions
// @route   GET /internships/suggestions/:userId
// Splits user.skills by comma and uses $or so ANY individual skill match
// returns that internship — not the whole string at once.
// e.g. "React, Node.js, MongoDB" -> finds internships with React OR Node.js OR MongoDB
const getSuggestions = async (req, res) => {
    const id = req.params.userId;
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const skillList = (user.skills || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        if (skillList.length === 0) {
            return res.status(200).json({ suggestions: [] });
        }

        const orConditions = skillList.map(skill => ({
            skillsRequired: { $regex: skill, $options: 'i' }
        }));

        const suggestions = await Internship.find({ $or: orConditions });

        return res.status(200).json({ suggestions });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Public homepage stats — internship count, student count, unique company count
// @route   GET /internships/stats
// No auth required — this is a public endpoint used by the homepage
const getStats = async (req, res) => {
    try {
        const internships    = await Internship.find({}, 'company');
        const studentCount   = await User.countDocuments({ role: 'Student' });
        const uniqueCompanies = [...new Set(internships.map(i => i.company).filter(Boolean))].length;

        return res.status(200).json({
            internshipCount: internships.length,
            studentCount,
            companyCount: uniqueCompanies,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

exports.getInternships  = getInternships;
exports.addInternship   = addInternship;
exports.updateInternship = updateInternship;
exports.deleteInternship = deleteInternship;
exports.getSuggestions  = getSuggestions;
exports.getStats        = getStats;