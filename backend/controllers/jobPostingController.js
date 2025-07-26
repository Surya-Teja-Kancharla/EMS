// This is a placeholder controller. You will need to implement the actual logic.
import JobPosting from '../models/JobPosting.js';

export const getAllJobPostings = async (req, res) => {
  try {
    const postings = await JobPosting.find({ status: 'active' }).populate('department', 'name').sort({ createdAt: -1 });
    res.json(postings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getJobPostingById = async (req, res) => {
  try {
    const posting = await JobPosting.findById(req.params.id).populate('department', 'name');
    if (!posting) return res.status(404).json({ message: 'Job posting not found' });
    res.json(posting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createJobPosting = async (req, res) => {
  try {
    const postingData = { ...req.body, postedBy: req.user.employee._id };
    const posting = new JobPosting(postingData);
    await posting.save();
    res.status(201).json(posting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateJobPosting = async (req, res) => {
  try {
    const posting = await JobPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!posting) return res.status(404).json({ message: 'Job posting not found' });
    res.json(posting);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteJobPosting = async (req, res) => {
  try {
    const posting = await JobPosting.findByIdAndDelete(req.params.id);
    if (!posting) return res.status(404).json({ message: 'Job posting not found' });
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
