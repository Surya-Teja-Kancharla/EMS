import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'under_review', 'shortlisted', 'interviewed', 'selected', 'rejected'],
    default: 'applied'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  reviewComments: {
    type: String
  },
  interviewDate: {
    type: Date
  },
  interviewFeedback: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('JobApplication', jobApplicationSchema);