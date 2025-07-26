import express from 'express';
import {
  applyForJob,
  getApplicationsForJob,
  getEmployeeApplications,
  updateApplicationStatus
} from '../controllers/jobApplicationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Employee can apply for a job
router.post('/', authorizeRoles('employee'), applyForJob);

// Employee can view their own applications
router.get('/my-applications', authorizeRoles('employee'), getEmployeeApplications);

// Admin/HR can view all applications for a specific job
router.get('/job/:jobId', authorizeRoles('admin', 'hr'), getApplicationsForJob);

// Admin/HR can update the status of an application
router.put('/:id/status', authorizeRoles('admin', 'hr'), updateApplicationStatus);

export default router;
