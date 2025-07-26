// File: backend/models/User.js
// WARNING: This version stores passwords in plain text and is NOT secure.
// For educational/debugging purposes only.

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'department_head', 'employee'],
    default: 'employee'
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// REMOVED: The pre-save hook that hashes the password is gone.

// UPDATED: This method now does a simple, insecure string comparison.
userSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

export default mongoose.model('User', userSchema);
