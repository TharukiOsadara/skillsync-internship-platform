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
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid gmail'
        ]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // This hides the password by default when fetching user data
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
        type:Number,
        required: true,
    },
    role: {
        type: String,
        enum: ['Student', 'Admin'], // Only these two roles allowed
        default: 'Student'
    },
    // For your matching engine, we store skills here
    skills: {
        type: String, 
        default: []
    },
    education: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);