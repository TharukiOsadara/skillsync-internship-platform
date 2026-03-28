const Internship = require('../Models/InternshipModel');
const User = require('../Models/UserModel');
const Application = require('../Models/ApplicationModel');

const hasLetter = (value = '') => /[A-Za-z]/.test(String(value));
const startsWithDigit = (value = '') => /^\d/.test(String(value).trim());

const validateInternshipPayload = ({
    title,
    company,
    location,
    duration,
    skillsRequired,
    deadline,
    mode,
    timePreference,
    description
}) => {
    if (
        !title || !company || !location || !duration ||
        !skillsRequired || !deadline || !mode ||
        !timePreference || !description
    ) {
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

    if (!['Online/Remote', 'Physical/On-site', 'Hybrid'].includes(mode)) {
        return 'Please select a valid work mode.';
    }

    if (!['Day', 'Night'].includes(timePreference)) {
        return 'Please select a valid time preference.';
    }

    if (String(description).trim().length < 10) {
        return 'Description must be at least 10 characters.';
    }

    if (!hasLetter(description)) {
        return 'Description cannot be only numbers.';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(deadline) <= today) return 'Deadline must be a future date.';

    return null;
};

// @desc    Get all Internships
// @route   GET /internships
const getInternships = async (req, res) => {
    try {
        const internships = await Internship.find().sort({ createdAt: -1 });
        return res.status(200).json({ internships });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Search / Filter internships
// @route   GET /internships/search
// Supports:
// keyword  -> title, company, skillsRequired
// location -> partial match
// duration -> partial match
// sort     -> latest | deadline | company
const searchInternships = async (req, res) => {
    try {
        const { keyword, location, duration, sort } = req.query;

        let filter = {};

        if (keyword) {
            filter.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { company: { $regex: keyword, $options: 'i' } },
                { skillsRequired: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (duration) {
            filter.duration = { $regex: duration, $options: 'i' };
        }

        let sortOption = { createdAt: -1 };

        if (sort === 'deadline') {
            sortOption = { deadline: 1 };
        } else if (sort === 'latest') {
            sortOption = { createdAt: -1 };
        } else if (sort === 'company') {
            sortOption = { company: 1 };
        }

        const internships = await Internship.find(filter).sort(sortOption);

        return res.status(200).json({ internships });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Add new Internship (Admin Input)
// @route   POST /internships
const addInternship = async (req, res) => {
    const {
        title,
        company,
        location,
        duration,
        skillsRequired,
        deadline,
        mode,
        timePreference,
        description
    } = req.body;

    const validationError = validateInternshipPayload({
        title,
        company,
        location,
        duration,
        skillsRequired,
        deadline,
        mode,
        timePreference,
        description
    });

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const existingInternship = await Internship.findOne({
            title: { $regex: `^${title.trim()}$`, $options: 'i' },
            company: { $regex: `^${company.trim()}$`, $options: 'i' }
        });

        if (existingInternship) {
            return res.status(400).json({
                message: 'An internship with this title already exists for this company.'
            });
        }

        const internship = new Internship({
            title,
            company,
            location,
            duration,
            skillsRequired,
            deadline,
            mode,
            timePreference,
            description
        });

        await internship.save();

        return res.status(201).json({
            message: 'Internship added successfully',
            internship
        });
    } catch (err) {
        return res.status(400).json({
            message: 'Unable to add Internship',
            error: err.message
        });
    }
};

// @desc    Update Internship
// @route   PUT /internships/:id
const updateInternship = async (req, res) => {
    const {
        title,
        company,
        location,
        duration,
        skillsRequired,
        deadline,
        mode,
        timePreference,
        description
    } = req.body;

    const validationError = validateInternshipPayload({
        title,
        company,
        location,
        duration,
        skillsRequired,
        deadline,
        mode,
        timePreference,
        description
    });

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        const existingInternship = await Internship.findOne({
            _id: { $ne: req.params.id },
            title: { $regex: `^${title.trim()}$`, $options: 'i' },
            company: { $regex: `^${company.trim()}$`, $options: 'i' }
        });

        if (existingInternship) {
            return res.status(400).json({
                message: 'An internship with this title already exists for this company.'
            });
        }

        const internship = await Internship.findByIdAndUpdate(
            req.params.id,
            {
                title,
                company,
                location,
                duration,
                skillsRequired,
                deadline,
                mode,
                timePreference,
                description
            },
            { new: true, runValidators: true }
        );

        if (!internship) {
            return res.status(404).json({ message: 'Not found' });
        }

        return res.status(200).json({
            message: 'Internship updated successfully',
            internship
        });
    } catch (err) {
        return res.status(400).json({
            message: 'Unable to update Internship',
            error: err.message
        });
    }
};

// @desc    Delete Internship
// @route   DELETE /internships/:id
const deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findByIdAndDelete(req.params.id);

        if (!internship) {
            return res.status(404).json({ message: 'Not found' });
        }

        return res.status(200).json({ message: 'Internship deleted successfully' });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Skill-Based Suggestions
// @route   GET /internships/suggestions/:userId
const getSuggestions = async (req, res) => {
    const id = req.params.userId;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const skillList = (user.skills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        if (skillList.length === 0) {
            return res.status(200).json({ suggestions: [] });
        }

        const orConditions = skillList.map((skill) => ({
            skillsRequired: { $regex: skill, $options: 'i' }
        }));

        const suggestions = await Internship.find({ $or: orConditions });

        return res.status(200).json({ suggestions });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Public homepage stats
// @route   GET /internships/stats
const getStats = async (req, res) => {
    try {
        const internships = await Internship.find({}, 'company');
        const studentCount = await User.countDocuments({ role: 'Student' });
        const uniqueCompanies = [...new Set(internships.map((i) => i.company).filter(Boolean))].length;

        return res.status(200).json({
            internshipCount: internships.length,
            studentCount,
            companyCount: uniqueCompanies,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @desc    Student applies to an internship
// @route   POST /internships/:id/apply
const applyToInternship = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Student') {
            return res.status(403).json({ success: false, message: 'Only students can apply.' });
        }

        const internship = await Internship.findById(req.params.id);
        if (!internship) {
            return res.status(404).json({ success: false, message: 'Internship not found.' });
        }

        if (new Date(internship.deadline) < new Date()) {
            return res.status(400).json({ success: false, message: 'This internship has expired.' });
        }

        const note = String(req.body?.note || '').trim();

        const application = await Application.create({
            internshipId: internship._id,
            studentId: req.user._id,
            studentName: req.user.fullName,
            studentEmail: req.user.gmail,
            internshipTitle: internship.title,
            company: internship.company,
            note,
        });

        return res.status(201).json({ success: true, application });
    } catch (err) {
        if (err && err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this internship.'
            });
        }

        return res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Admin sees recent applications
// @route   GET /internships/applications
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 }).limit(100);
        const unreadCount = applications.filter((a) => !a.isReadByAdmin).length;

        return res.status(200).json({ success: true, applications, unreadCount });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Admin marks application message as read
// @route   PATCH /internships/applications/:id/read
const markApplicationRead = async (req, res) => {
    try {
        const updated = await Application.findByIdAndUpdate(
            req.params.id,
            { isReadByAdmin: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Application message not found.'
            });
        }

        return res.status(200).json({ success: true, application: updated });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.getInternships = getInternships;
exports.searchInternships = searchInternships;
exports.addInternship = addInternship;
exports.updateInternship = updateInternship;
exports.deleteInternship = deleteInternship;
exports.getSuggestions = getSuggestions;
exports.getStats = getStats;
exports.applyToInternship = applyToInternship;
exports.getApplications = getApplications;
exports.markApplicationRead = markApplicationRead;