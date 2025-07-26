import express from 'express';
import {
  getAllJobPostings,
  getJobPostingById,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting
} from '../controllers/jobPostingController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Public route for all authenticated users to view jobs
router.get('/', getAllJobPostings);
router.get('/:id', getJobPostingById);

// Admin/HR only routes for managing job postings
router.post('/', authorizeRoles('admin', 'hr'), createJobPosting);
router.put('/:id', authorizeRoles('admin', 'hr'), updateJobPosting);
router.delete('/:id', authorizeRoles('admin', 'hr'), deleteJobPosting);

export default router;
