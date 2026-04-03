const CV = require('../Models/CVModel');
const User = require('../Models/UserModel');
const Internship = require('../Models/InternshipModel');

// Get CV for logged-in user
const getMyCV = async (req, res) => {
    try {
        const userId = req.user._id;
        const cv = await CV.findOne({ userId });

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found. Please create one.'
            });
        }

        res.status(200).json({
            success: true,
            data: cv
        });
    } catch (error) {
        console.error('Error fetching CV:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching CV',
            error: error.message
        });
    }
};

// Create or Update CV for logged-in user
const saveCV = async (req, res) => {
    try {
        const userId = req.user._id;
        const {
            fullName,
            email,
            phone,
            address,
            linkedin,
            github,
            portfolio,
            profileImage,
            summary,
            skills,
            education,
            experience,
            projects,
            certifications,
            languages,
            hobbies,
            references
        } = req.body;

        // Validate required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and phone are required'
            });
        }

        // Validate phone format (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be exactly 10 digits'
            });
        }

        // Check if CV exists for user
        const existingCV = await CV.findOne({ userId });

        const cvData = {
            userId,
            fullName: fullName.trim(),
            email: email.trim(),
            phone,
            address: address || '',
            linkedin: linkedin || '',
            github: github || '',
            portfolio: portfolio || '',
            profileImage: profileImage || '',
            summary: summary || '',
            skills: skills || '',
            education: education || '',
            experience: experience || '',
            projects: projects || '',
            certifications: certifications || '',
            languages: languages || '',
            hobbies: hobbies || '',
            references: references || ''
        };

        let cv;
        if (existingCV) {
            // Update existing CV
            cv = await CV.findOneAndUpdate(
                { userId },
                cvData,
                { new: true, runValidators: true }
            );
            
            // Update user database with all relevant CV data for real-time sync
            const userUpdateData = {};
            if (skills && skills.trim()) userUpdateData.skills = skills.trim();
            if (cvData.personalInfo?.phone) userUpdateData.phoneNo = cvData.personalInfo.phone;
            if (cvData.personalInfo?.address) userUpdateData.address = cvData.personalInfo.address;
            if (cvData.personalInfo?.age) userUpdateData.age = cvData.personalInfo.age;
            
            if (Object.keys(userUpdateData).length > 0) {
                await User.findByIdAndUpdate(
                    userId,
                    userUpdateData
                );
            }
            
            res.status(200).json({
                success: true,
                message: 'CV updated successfully',
                data: cv,
                userUpdated: Object.keys(userUpdateData).length > 0,
                dataFreshness: 'real-time'
            });
        } else {
            // Create new CV
            cv = new CV(cvData);
            await cv.save();
            
            // Update user database with all relevant CV data for real-time sync
            const userUpdateData = {};
            if (skills && skills.trim()) userUpdateData.skills = skills.trim();
            if (cvData.personalInfo?.phone) userUpdateData.phoneNo = cvData.personalInfo.phone;
            if (cvData.personalInfo?.address) userUpdateData.address = cvData.personalInfo.address;
            if (cvData.personalInfo?.age) userUpdateData.age = cvData.personalInfo.age;
            
            if (Object.keys(userUpdateData).length > 0) {
                await User.findByIdAndUpdate(
                    userId,
                    userUpdateData
                );
            }
            
            res.status(201).json({
                success: true,
                message: 'CV created successfully',
                data: cv,
                userUpdated: Object.keys(userUpdateData).length > 0,
                dataFreshness: 'real-time'
            });
        }
    } catch (error) {
        console.error('Error saving CV:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A CV already exists for this user'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while saving CV',
            error: error.message
        });
    }
};

// Update specific fields of CV
const updateCV = async (req, res) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        // Remove any attempt to change userId
        delete updates.userId;
        delete updates._id;

        // Validate phone if being updated
        if (updates.phone) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(updates.phone)) {
                return res.status(400).json({
                    success: false,
                    message: 'Phone number must be exactly 10 digits'
                });
            }
        }

        const cv = await CV.findOneAndUpdate(
            { userId },
            updates,
            { new: true, runValidators: true }
        );

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found. Please create one first.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CV updated successfully',
            data: cv
        });
    } catch (error) {
        console.error('Error updating CV:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating CV',
            error: error.message
        });
    }
};

// Delete CV
const deleteCV = async (req, res) => {
    try {
        const userId = req.user._id;

        const cv = await CV.findOneAndDelete({ userId });

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'CV deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting CV:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting CV',
            error: error.message
        });
    }
};

// Get CV by user ID (Admin only)
const getCVByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const cv = await CV.findOne({ userId }).populate('userId', 'fullName gmail');

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: cv
        });
    } catch (error) {
        console.error('Error fetching CV by user ID:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching CV',
            error: error.message
        });
    }
};

// Update CV by email (for CV builder save functionality)
const updateCVByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const cvData = req.body;

        // Find user by email
        const user = await User.findOne({ gmail: email.trim().toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Validate required fields
        if (!cvData.fullName || !cvData.email || !cvData.phone) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and phone are required'
            });
        }

        // Validate phone format (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(cvData.phone)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be exactly 10 digits'
            });
        }

        // Ensure email in CV data matches user's email
        if (cvData.email.trim().toLowerCase() !== user.gmail) {
            return res.status(400).json({
                success: false,
                message: 'Email in CV data does not match user email'
            });
        }

        // Prepare CV data with user ID
        const updatedCVData = {
            userId: user._id,
            fullName: cvData.fullName.trim(),
            email: cvData.email.trim().toLowerCase(),
            phone: cvData.phone,
            address: cvData.address || '',
            linkedin: cvData.linkedin || '',
            github: cvData.github || '',
            portfolio: cvData.portfolio || '',
            profileImage: cvData.profileImage || '',
            summary: cvData.summary || '',
            skills: cvData.skills || '',
            education: cvData.education || '',
            experience: cvData.experience || '',
            projects: cvData.projects || '',
            certifications: cvData.certifications || '',
            languages: cvData.languages || '',
            hobbies: cvData.hobbies || '',
            references: cvData.references || ''
        };

        // Check if CV exists for user
        const existingCV = await CV.findOne({ userId: user._id });

        let cv;
        if (existingCV) {
            // Update existing CV
            cv = await CV.findOneAndUpdate(
                { userId: user._id },
                updatedCVData,
                { new: true, runValidators: true }
            );
            
            // Update user database with all relevant CV data for real-time sync
            const userUpdateData = {};
            if (cvData.skills && cvData.skills.trim()) userUpdateData.skills = cvData.skills.trim();
            if (cvData.phone) userUpdateData.phoneNo = cvData.phone;
            if (cvData.address) userUpdateData.address = cvData.address;
            if (cvData.age) userUpdateData.age = cvData.age;
            
            if (Object.keys(userUpdateData).length > 0) {
                await User.findByIdAndUpdate(
                    user._id,
                    userUpdateData
                );
            }
            
            res.status(200).json({
                success: true,
                message: 'CV updated successfully via email',
                data: cv,
                userUpdated: Object.keys(userUpdateData).length > 0,
                dataFreshness: 'real-time'
            });
        } else {
            // Create new CV
            cv = new CV(updatedCVData);
            await cv.save();
            
            // Update user database with all relevant CV data for real-time sync
            const userUpdateData = {};
            if (cvData.skills && cvData.skills.trim()) userUpdateData.skills = cvData.skills.trim();
            if (cvData.phone) userUpdateData.phoneNo = cvData.phone;
            if (cvData.address) userUpdateData.address = cvData.address;
            if (cvData.age) userUpdateData.age = cvData.age;
            
            if (Object.keys(userUpdateData).length > 0) {
                await User.findByIdAndUpdate(
                    user._id,
                    userUpdateData
                );
            }
            
            res.status(201).json({
                success: true,
                message: 'CV created successfully via email',
                data: cv,
                userUpdated: Object.keys(userUpdateData).length > 0,
                dataFreshness: 'real-time'
            });
        }
    } catch (error) {
        console.error('Error updating CV by email:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A CV already exists for this user'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while updating CV by email',
            error: error.message
        });
    }
};

// Get CV by email (for CV builder load functionality) - Real-time data fetch
const getCVByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Find user by email (fresh data) - real-time update
        const user = await User.findOne({ gmail: email.trim().toLowerCase() }).lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Find CV by user ID (fresh data) - real-time update
        const cv = await CV.findOne({ userId: user._id }).lean();

        if (!cv) {
            return res.status(404).json({
                success: false,
                message: 'CV not found for this user'
            });
        }

        res.status(200).json({
            success: true,
            data: cv,
            user: { // Include user data for real-time updates
                fullName: user.fullName,
                gmail: user.gmail,
                skills: user.skills,
                mode: user.mode,
                timePreference: user.timePreference,
                address: user.address,
                age: user.age,
                phoneNo: user.phoneNo,
                education: user.education,
                experience: user.experience
            },
            dataFreshness: 'real-time'
        });
    } catch (error) {
        console.error('Error fetching CV by email:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching CV by email',
            error: error.message
        });
    }
};

// Save CV and Get Matching Internships (for CV builder save + navigate to matches)
const saveCVAndGetMatches = async (req, res) => {
    try {
        const { email } = req.params;
        const cvData = req.body;

        // Find user by email
        const user = await User.findOne({ gmail: email.trim().toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        // Validate required fields
        if (!cvData.fullName || !cvData.email || !cvData.phone) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, and phone are required'
            });
        }

        // Validate phone format (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(cvData.phone)) {
            return res.status(400).json({
                success: false,
                message: 'Phone number must be exactly 10 digits'
            });
        }

        // Ensure email in CV data matches user's email
        if (cvData.email.trim().toLowerCase() !== user.gmail) {
            return res.status(400).json({
                success: false,
                message: 'Email in CV data does not match user email'
            });
        }

        // Prepare CV data with user ID
        const updatedCVData = {
            userId: user._id,
            fullName: cvData.fullName.trim(),
            email: cvData.email.trim().toLowerCase(),
            phone: cvData.phone,
            address: cvData.address || '',
            linkedin: cvData.linkedin || '',
            github: cvData.github || '',
            portfolio: cvData.portfolio || '',
            profileImage: cvData.profileImage || '',
            summary: cvData.summary || '',
            skills: cvData.skills || '',
            education: cvData.education || '',
            experience: cvData.experience || '',
            projects: cvData.projects || '',
            certifications: cvData.certifications || '',
            languages: cvData.languages || '',
            hobbies: cvData.hobbies || '',
            references: cvData.references || ''
        };

        // Save/Update CV
        const existingCV = await CV.findOne({ userId: user._id });
        let cv;
        if (existingCV) {
            cv = await CV.findOneAndUpdate(
                { userId: user._id },
                updatedCVData,
                { new: true, runValidators: true }
            );
        } else {
            cv = new CV(updatedCVData);
            await cv.save();
        }

        // Update user database skills from CV (NEW: sync skills to user profile)
        if (cvData.skills && cvData.skills.trim()) {
            await User.findByIdAndUpdate(
                user._id,
                { skills: cvData.skills.trim() }
            );
        }

        // Get skill-based internship matches FROM CV DATABASE ONLY
        const skillList = (cvData.skills || "")
            .split(",")
            .map(s => s.trim())
            .filter(Boolean);

        let suggestions = [];
        if (skillList.length > 0) {
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

            // Add user preference filters
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

            const internships = await Internship.find(query)
                .sort({ createdAt: -1 })
                .limit(20);

            // Calculate match score and percentage for each suggestion
            suggestions = internships.map(internship => {
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
            suggestions = suggestions
                .filter(suggestion => suggestion.matchPercentage > 0)
                .sort((a, b) => b.matchScore - a.matchScore);
        }

        res.status(200).json({
            success: true,
            message: 'CV saved successfully and matches generated',
            data: {
                cv: cv,
                matches: {
                    suggestions: suggestions,
                    totalFound: suggestions.length,
                    userSkills: skillList,
                    matchingCriteria: {
                        skillWeight: '10 points per matched skill',
                        workModeWeight: '3 points',
                        timePreferenceWeight: '2 points',
                        locationWeight: '2 points'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error saving CV and getting matches:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A CV already exists for this user'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while saving CV and getting matches',
            error: error.message
        });
    }
};

module.exports = {
    getMyCV,
    saveCV,
    updateCV,
    deleteCV,
    getCVByUserId,
    updateCVByEmail,
    getCVByEmail,
    saveCVAndGetMatches
};
