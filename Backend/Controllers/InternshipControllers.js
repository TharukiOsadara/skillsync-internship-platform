const Internship = require('../Models/InternshipModel');
const User = require('../Models/UserModel');
const Application = require('../Models/ApplicationModel');

const hasLetter = (value = '') => /[A-Za-z]/.test(String(value));
const startsWithDigit = (value = '') => /^\d/.test(String(value).trim());


const validateInternshipPayload = ({ title, company, location, duration, skillsRequired, deadline, mode, timePreference, description }) => {
    if (!title || !company || !location || !duration || !skillsRequired || !deadline || !mode || !timePreference || !description) {

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
    if (!mode || !['Online/Remote', 'Physical/On-site', 'Hybrid'].includes(mode)) return 'Please select a valid work mode.';
    if (!timePreference || !['Day', 'Night'].includes(timePreference)) return 'Please select a valid time preference.';
    if (!description || description.trim().length < 10) return 'Description must be at least 10 characters.';
    if (!hasLetter(description)) return 'Description cannot be only numbers.';


    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(deadline) <= today) return 'Deadline must be a future date.';

    return null;
};

// @desc    Search Internships with filters
// @route   GET /internships/search
const searchInternships = async (req, res) => {
    try {
        const { location, duration, keyword, mode, timePreference, skills } = req.query;

        let query = { status: 'Active', deadline: { $gt: new Date() } };

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (duration) {
            query.duration = { $regex: duration, $options: "i" };
        }

        if (mode) {
            query.mode = mode;
        }

        if (timePreference) {
            query.timePreference = timePreference;
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ];
        }

        if (skills) {
            const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);
            const skillConditions = skillList.map(skill => ({
                skillsRequired: { $regex: skill, $options: 'i' }
            }));
            query.$and = query.$and || [];
            query.$and.push({ $or: skillConditions });
        }

        const internships = await Internship.find(query)
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({ internships });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
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
    const { title, company, location, duration, skillsRequired, deadline, mode, timePreference, description } = req.body;
    let internship;

    const validationError = validateInternshipPayload({ title, company, location, duration, skillsRequired, deadline, mode, timePreference, description });

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
  
    try {
        internship = new Internship({ title, company, location, duration, skillsRequired, deadline, mode, timePreference, description });

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
            { title, company, location, duration, skillsRequired, deadline, mode, timePreference, description },

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
// Enhanced matching algorithm that considers:
// 1. Skill matching from CV database (primary) or user profile (fallback)
// 2. Work mode preference
// 3. Time preference
// 4. Location preference
const getSuggestions = async (req, res) => {
    const id = req.params.userId;
    try {
        // Force fresh user data fetch (no caching) - same as refresh endpoint
        const user = await User.findById(id).lean(); // .lean() prevents Mongoose caching
        if (!user) return res.status(404).json({ message: "User not found" });

        // Force fresh CV data fetch (no caching) - same as refresh endpoint
        const cv = await CV.findOne({ userId: user._id }).lean();
        
        let skillList = [];
        let skillSource = 'user profile';
        
        if (cv && cv.skills && cv.skills.trim()) {
            // Use CV database skills if available
            skillList = cv.skills.split(",")
                .map(s => s.trim())
                .filter(Boolean);
            skillSource = 'CV database';
        } else {
            // Fallback to user profile skills (fresh data)
            skillList = (user.skills || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);
            skillSource = 'user profile';
        }

        if (skillList.length === 0) {
            return res.status(200).json({ 
                suggestions: [],
                skillSource,
                message: 'No skills found for matching'
            });
        }

        // Build skill matching conditions
        const skillConditions = skillList.map(skill => ({
            skillsRequired: { $regex: skill, $options: 'i' }
        }));

        // Base query with skill matching
        let query = {
            $and: [
                { $or: skillConditions }, // Must match at least one skill
                { status: 'Active' }, // Only active internships
                { deadline: { $gt: new Date() } } // Only future deadlines
            ]
        };

        // Add optional preference filters
        const preferenceFilters = [];
        
        if (user.mode && user.mode !== 'Any') {
            preferenceFilters.push({ mode: user.mode });
        }
        
        if (user.timePreference && user.timePreference !== 'Any') {
            preferenceFilters.push({ timePreference: user.timePreference });
        }
        
        if (user.address && user.address.trim()) {
            preferenceFilters.push({ 
                location: { $regex: user.address.trim(), $options: 'i' } 
            });
        }

        // If user has preferences, add them to the query
        if (preferenceFilters.length > 0) {
            query.$and.push({ $or: preferenceFilters });
        }

        const suggestions = await Internship.find(query)
            .sort({ createdAt: -1 }) // Most recent first
            .limit(20); // Limit results

        // Calculate match score and percentage for each suggestion
        const suggestionsWithScore = suggestions.map(internship => {
            let score = 0;
            let matchedSkills = [];
            
            // Skill matching score (higher priority)
            const internshipSkills = internship.skillsRequired.toLowerCase();
            skillList.forEach(skill => {
                if (internshipSkills.includes(skill.toLowerCase())) {
                    score += 10;
                    matchedSkills.push(skill);
                }
            });
            
            // Preference matching score
            if (user.mode && internship.mode === user.mode) score += 3;
            if (user.timePreference && internship.timePreference === user.timePreference) score += 2;
            if (user.address && internship.location.toLowerCase().includes(user.address.toLowerCase())) score += 2;
            
            // Calculate maximum possible score for percentage
            const maxSkillScore = skillList.length * 10;
            const maxPreferenceScore = 7; // 3 + 2 + 2 for all preferences
            const maxPossibleScore = maxSkillScore + maxPreferenceScore;
            
            // Calculate match percentage
            const matchPercentage = Math.round((score / maxPossibleScore) * 100);
            
            // Determine match level
            let matchLevel = 'Low';
            if (matchPercentage >= 80) matchLevel = 'Excellent';
            else if (matchPercentage >= 60) matchLevel = 'Good';
            else if (matchPercentage >= 40) matchLevel = 'Fair';
            
            return {
                ...internship.toObject(),
                matchScore: score,
                matchPercentage,
                matchLevel,
                matchedSkills,
                totalSkills: skillList.length,
                whyMatched: {
                    skills: matchedSkills.length > 0 ? `Matches ${matchedSkills.length} of your ${skillList.length} skills` : 'No skill match',
                    preferences: [
                        user.mode && internship.mode === user.mode ? 'Work mode matches' : null,
                        user.timePreference && internship.timePreference === user.timePreference ? 'Time preference matches' : null,
                        user.address && internship.location.toLowerCase().includes(user.address.toLowerCase()) ? 'Location matches' : null
                    ].filter(Boolean)
                }
            };
        });

        // Sort by match score (highest first) and filter out 0% matches
        const filteredSuggestions = suggestionsWithScore
            .filter(suggestion => suggestion.matchPercentage > 0)
            .sort((a, b) => b.matchScore - a.matchScore);

        return res.status(200).json({ 
            suggestions: filteredSuggestions,
            totalFound: filteredSuggestions.length,
            userSkills: skillList,
            skillSource, // NEW: indicates if skills came from CV or user profile
            dataFreshness: 'real-time', // NEW: indicates fresh data fetch
            matchingCriteria: {
                skillWeight: '10 points per matched skill',
                workModeWeight: '3 points',
                timePreferenceWeight: '2 points',
                locationWeight: '2 points'
            }
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

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

// @desc    Refresh User Data and Get Matches (Real-time updates)
// @route   GET /internships/refresh-matches/:userId
// This endpoint forces fresh data fetch and returns updated matches
const refreshMatches = async (req, res) => {
    const id = req.params.userId;
    try {
        // Force fresh user data fetch (no caching)
        const user = await User.findById(id).lean(); // .lean() prevents Mongoose caching
        if (!user) return res.status(404).json({ message: "User not found" });

        // Force fresh CV data fetch (no caching)
        const cv = await CV.findOne({ userId: user._id }).lean();
        
        let skillList = [];
        let skillSource = 'user profile';
        
        if (cv && cv.skills && cv.skills.trim()) {
            // Use CV database skills if available
            skillList = cv.skills.split(",")
                .map(s => s.trim())
                .filter(Boolean);
            skillSource = 'CV database';
        } else {
            // Fallback to user profile skills (fresh data)
            skillList = (user.skills || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);
            skillSource = 'user profile';
        }

        if (skillList.length === 0) {
            return res.status(200).json({ 
                suggestions: [],
                totalFound: 0,
                userSkills: skillList,
                skillSource,
                message: 'No skills found for matching',
                dataFreshness: 'real-time'
            });
        }

        // Build skill matching conditions
        const skillConditions = skillList.map(skill => ({
            skillsRequired: { $regex: skill, $options: 'i' }
        }));

        // Base query with skill matching
        let query = {
            $and: [
                { $or: skillConditions }, // Must match at least one skill
                { status: 'Active' }, // Only active internships
                { deadline: { $gt: new Date() } } // Only future deadlines
            ]
        };

        // Add optional preference filters (using fresh user data)
        const preferenceFilters = [];
        
        if (user.mode && user.mode !== 'Any') {
            preferenceFilters.push({ mode: user.mode });
        }
        
        if (user.timePreference && user.timePreference !== 'Any') {
            preferenceFilters.push({ timePreference: user.timePreference });
        }
        
        if (user.address && user.address.trim()) {
            preferenceFilters.push({ 
                location: { $regex: user.address.trim(), $options: 'i' } 
            });
        }

        // If user has preferences, add them to the query
        if (preferenceFilters.length > 0) {
            query.$and.push({ $or: preferenceFilters });
        }

        const suggestions = await Internship.find(query)
            .sort({ createdAt: -1 }) // Most recent first
            .limit(20);

        // Calculate match score and percentage for each suggestion
        const suggestionsWithScore = suggestions.map(internship => {
            let score = 0;
            let matchedSkills = [];
            
            // Skill matching score (higher priority)
            const internshipSkills = internship.skillsRequired.toLowerCase();
            skillList.forEach(skill => {
                if (internshipSkills.includes(skill.toLowerCase())) {
                    score += 10;
                    matchedSkills.push(skill);
                }
            });
            
            // Preference matching score
            if (user.mode && internship.mode === user.mode) score += 3;
            if (user.timePreference && internship.timePreference === user.timePreference) score += 2;
            if (user.address && internship.location.toLowerCase().includes(user.address.toLowerCase())) score += 2;
            
            // Calculate maximum possible score for percentage
            const maxSkillScore = skillList.length * 10;
            const maxPreferenceScore = 7; // 3 + 2 + 2 for all preferences
            const maxPossibleScore = maxSkillScore + maxPreferenceScore;
            
            // Calculate match percentage
            const matchPercentage = Math.round((score / maxPossibleScore) * 100);
            
            // Determine match level
            let matchLevel = 'Low';
            if (matchPercentage >= 80) matchLevel = 'Excellent';
            else if (matchPercentage >= 60) matchLevel = 'Good';
            else if (matchPercentage >= 40) matchLevel = 'Fair';
            
            return {
                ...internship.toObject(),
                matchScore: score,
                matchPercentage,
                matchLevel,
                matchedSkills,
                totalSkills: skillList.length,
                whyMatched: {
                    skills: matchedSkills.length > 0 ? `Matches ${matchedSkills.length} of your ${skillList.length} skills` : 'No skill match',
                    preferences: [
                        user.mode && internship.mode === user.mode ? 'Work mode matches' : null,
                        user.timePreference && internship.timePreference === user.timePreference ? 'Time preference matches' : null,
                        user.address && internship.location.toLowerCase().includes(user.address.toLowerCase()) ? 'Location matches' : null
                    ].filter(Boolean)
                }
            };
        });

        // Sort by match score (highest first) and filter out 0% matches
        const filteredSuggestions = suggestionsWithScore
            .filter(suggestion => suggestion.matchPercentage > 0)
            .sort((a, b) => b.matchScore - a.matchScore);

        return res.status(200).json({ 
            suggestions: filteredSuggestions,
            totalFound: filteredSuggestions.length,
            userSkills: skillList,
            skillSource,
            dataFreshness: 'real-time', // NEW: indicates this is fresh data
            matchingCriteria: {
                skillWeight: '10 points per matched skill',
                workModeWeight: '3 points',
                timePreferenceWeight: '2 points',
                locationWeight: '2 points'
            }
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};
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
            return res.status(400).json({ success: false, message: 'You have already applied for this internship.' });
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
            return res.status(404).json({ success: false, message: 'Application message not found.' });
        }
        return res.status(200).json({ success: true, application: updated });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

exports.getInternships  = getInternships;
exports.searchInternships = searchInternships;
exports.addInternship   = addInternship;
exports.updateInternship = updateInternship;
exports.deleteInternship = deleteInternship;
exports.getSuggestions  = getSuggestions;
exports.refreshMatches = refreshMatches; // NEW: real-time refresh endpoint
exports.getStats        = getStats;
exports.applyToInternship = applyToInternship;
exports.getApplications = getApplications;
exports.markApplicationRead = markApplicationRead;