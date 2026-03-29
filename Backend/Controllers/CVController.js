const CV = require('../Models/CVModel');

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
            res.status(200).json({
                success: true,
                message: 'CV updated successfully',
                data: cv
            });
        } else {
            // Create new CV
            cv = new CV(cvData);
            await cv.save();
            res.status(201).json({
                success: true,
                message: 'CV created successfully',
                data: cv
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

module.exports = {
    getMyCV,
    saveCV,
    updateCV,
    deleteCV,
    getCVByUserId
};
