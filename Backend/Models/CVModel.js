const mongoose = require('mongoose');

const CVSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // One CV per user
    },
    // ─── Personal Information ─────────────────────────────────────────────────
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    portfolio: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String, // Base64 encoded image
        default: ''
    },

    // ─── Professional Summary ─────────────────────────────────────────────────
    summary: {
        type: String,
        default: ''
    },

    // ─── Skills ───────────────────────────────────────────────────────────────
    skills: {
        type: String, // Comma-separated skills
        default: ''
    },

    // ─── Education ────────────────────────────────────────────────────────────
    education: {
        type: String,
        default: ''
    },

    // ─── Experience ───────────────────────────────────────────────────────────
    experience: {
        type: String,
        default: ''
    },

    // ─── Projects ─────────────────────────────────────────────────────────────
    projects: {
        type: String,
        default: ''
    },

    // ─── Certifications ───────────────────────────────────────────────────────
    certifications: {
        type: String,
        default: ''
    },

    // ─── Languages ────────────────────────────────────────────────────────────
    languages: {
        type: String, // Comma-separated languages
        default: ''
    },

    // ─── Hobbies & Interests ──────────────────────────────────────────────────
    hobbies: {
        type: String,
        default: ''
    },

    // ─── References ───────────────────────────────────────────────────────────
    references: {
        type: String,
        default: ''
    }
}, {
    // Use Mongoose built-in timestamps instead of manual hooks
    timestamps: true
});

module.exports = mongoose.model('CV', CVSchema);
