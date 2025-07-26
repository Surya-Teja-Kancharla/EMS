import express from 'express';
import {
  getAllPerformances,
  getPerformanceById,
  createPerformance,
  updatePerformance,
  getEmployeePerformances
} from '../controllers/performanceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorizeRoles('admin', 'hr', 'department_head'), getAllPerformances);
router.get('/:id', getPerformanceById);
router.post('/', authorizeRoles('admin', 'hr', 'department_head'), createPerformance);
router.put('/:id', authorizeRoles('admin', 'hr', 'department_head'), updatePerformance);
router.get('/employee/:employeeId', getEmployeePerformances);

export default router;