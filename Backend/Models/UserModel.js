<<<<<<< HEAD
    // ...existing fields...
=======
>>>>>>> origin/CV-Builder
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
<<<<<<< HEAD
        select: false,
=======
        select: false // This hides the password by default when fetching user data
>>>>>>> origin/CV-Builder
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
<<<<<<< HEAD
        enum: ['Student', 'Admin'],
        default: 'Student'
    },
    skills: {
        type: String,
=======
        enum: ['Student', 'Admin'], // Only these two roles allowed
        default: 'Student'
    },
    // For your matching engine, we store skills here
    skills: {
        type: String, 
>>>>>>> origin/CV-Builder
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
<<<<<<< HEAD
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
=======
>>>>>>> origin/CV-Builder
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

<<<<<<< HEAD

=======
>>>>>>> origin/CV-Builder
module.exports = mongoose.model('User', UserSchema);