const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[A-Za-z][A-Za-z0-9._-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            'Gmail must start with a letter and be valid'
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    age: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    role: {
        type: String,
        enum: ['Student', 'Admin'],
        default: 'Student'
    },
    skills: {
        type: String,
        default: ''
    },
    education: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        enum: ['Online/Remote', 'Physical/On-site', 'Hybrid', ''],
        default: ''
    },
    timePreference: {
        type: String,
        enum: ['Day', 'Night', ''],
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date,
        default: null
    }
});


module.exports = mongoose.model('User', UserSchema);