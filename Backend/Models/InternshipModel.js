const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: String, // Storing as string to match your User model
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Expired'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Internship', InternshipSchema);