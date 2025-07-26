import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  period: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  goals: [{
    title: String,
    description: String,
    targetDate: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'overdue'],
      default: 'pending'
    },
    weight: { type: Number, default: 1 }
  }],
  ratings: {
    technical: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    teamwork: { type: Number, min: 1, max: 5 },
    leadership: { type: Number, min: 1, max: 5 },
    innovation: { type: Number, min: 1, max: 5 }
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: {
    strengths: String,
    improvements: String,
    comments: String
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Auto-calculate overall rating before saving
performanceSchema.pre('save', function(next) {
  const ratings = Object.values(this.ratings).filter(r => r != null);
  if (ratings.length > 0) {
    this.overallRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }
  next();
});

export default mongoose.model('Performance', performanceSchema);
