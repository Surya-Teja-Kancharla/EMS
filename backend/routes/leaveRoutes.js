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

router.get('/', authorizeRoles('admin', 'hr', 'department_head'), getAllLeaves);
router.get('/my-leaves', getEmployeeLeaves);
router.get('/:id', getLeaveById);
router.post('/', createLeave);
router.put('/:id/status', authorizeRoles('admin', 'hr', 'department_head'), updateLeaveStatus);
router.get('/employee/:employeeId', authorizeRoles('admin', 'hr', 'department_head'), getEmployeeLeaves);

export default router;