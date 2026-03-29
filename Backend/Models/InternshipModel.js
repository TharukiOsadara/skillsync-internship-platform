const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: (v) => !/^\d/.test(String(v).trim()),
            message: 'Title cannot start with a number'
        }
    },
    company: {
        type: String,
        required: true,
        validate: {
            validator: (v) => !/^\d/.test(String(v).trim()),
            message: 'Company cannot start with a number'
        }
    },
    location: {
        type: String,
        required: true,
        validate: {
            validator: (v) => !/^\d/.test(String(v).trim()),
            message: 'Location cannot start with a number'
        }
    },
    duration: {
        type: String,
        required: true,
    },
    skillsRequired: {
        type: String,
        required: true,
        validate: {
            validator: (v) => !/^\d/.test(String(v).trim()),
            message: 'Skills cannot start with a number'
        }
    },
    deadline: {
        type: Date,
        required: true,
    },
    mode: {
        type: String,
        required: true,
        enum: ['Online/Remote', 'Physical/On-site', 'Hybrid']
    },
    timePreference: {
        type: String,
        required: true,
        enum: ['Day', 'Night']
    },
    description: {
        type: String,
        required: true,
        minlength: 10
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