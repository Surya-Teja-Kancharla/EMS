import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  description: {
    type: String
  },
  baseSalary: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    enum: ['junior', 'mid', 'senior', 'lead', 'manager'],
    default: 'junior'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Role', roleSchema);
