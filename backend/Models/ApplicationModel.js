const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
    trim: true,
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
  },
  internshipTitle: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  note: {
    type: String,
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Reviewed', 'Rejected'],
    default: 'Submitted',
  },
  isReadByAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ApplicationSchema.index({ internshipId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
