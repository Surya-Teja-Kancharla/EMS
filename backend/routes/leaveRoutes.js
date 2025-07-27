import express from 'express';
import {
  getAllLeaves,
  getLeaveById,
  createLeave,
  updateLeaveStatus,
  getEmployeeLeaves
} from '../controllers/leaveController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Admin, HR, and Managers can see all leave requests
router.get('/', authorizeRoles('admin', 'hr', 'manager'), getAllLeaves);

// Employees can see their own leave requests
router.get('/my-leaves', getEmployeeLeaves);

// Any authenticated user can get a leave request by its ID (assuming they have the ID)
router.get('/:id', getLeaveById);

// Any authenticated user can create a leave request for themselves
router.post('/', createLeave);

// Admin, HR, and Managers can update the status of a leave request
router.put('/:id/status', authorizeRoles('admin', 'hr', 'manager'), updateLeaveStatus);

// Admin, HR, and Managers can view leaves for a specific employee
router.get('/employee/:employeeId', authorizeRoles('admin', 'hr', 'manager'), getEmployeeLeaves);

export default router;
