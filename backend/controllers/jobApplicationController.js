// This is a placeholder controller. You will need to implement the actual logic.
import JobApplication from '../models/JobApplication.js';
import JobPosting from '../models/JobPosting.js';

export const applyForJob = async (req, res) => {
  try {
    const { jobPostingId, coverLetter } = req.body;
    const applicationData = {
      jobPosting: jobPostingId,
      applicant: req.user.employee._id,
      coverLetter
    };
    
    const application = new JobApplication(applicationData);
    await application.save();

    // Increment the applications count on the job posting
    await JobPosting.findByIdAndUpdate(jobPostingId, { $inc: { applicationsCount: 1 } });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const applications = await JobApplication.find({ jobPosting: req.params.jobId }).populate('applicant', 'firstName lastName employeeId');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEmployeeApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ applicant: req.user.employee._id }).populate('jobPosting', 'title status');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, reviewComments } = req.body;
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status, reviewComments, reviewedBy: req.user.employee._id },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
