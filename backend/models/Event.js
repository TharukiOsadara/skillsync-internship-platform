const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Interview', 'Deadline', 'Follow-up'],
      required: [true, 'Event type is required'],
    },
    // Store date as YYYY-MM-DD string to match frontend expectations
    date: {
      type: String,
      required: [true, 'Event date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Please provide date in YYYY-MM-DD format'],
    },
    // Store time as HH:MM string
    time: {
      type: String,
      required: [true, 'Event time is required'],
      match: [/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:MM format'],
    },
    notes: {
      type: String,
      maxlength: [200, 'Notes cannot exceed 200 characters'],
      default: '',
      trim: true,
    },
    reminder: {
      type: String,
      enum: ['same-day', '1-day', '2-days', '3-days', '1-week'],
      required: [true, 'Reminder option is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
