import express from 'express';
import {
  getAllPerformances,
  getPerformanceById,
  createPerformance,
  updatePerformance,
  getEmployeePerformances,
  getEmployeesForReview,
  deletePerformance // Ensure this is imported
} from '../controllers/performanceController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorizeRoles('admin', 'hr', 'manager'), getAllPerformances);
router.get('/review-employees', authorizeRoles('manager'), getEmployeesForReview);
router.get('/:id', getPerformanceById);
router.post('/', authorizeRoles('admin', 'hr', 'manager'), createPerformance);
router.put('/:id', authorizeRoles('admin', 'hr', 'manager'), updatePerformance);
router.get('/employee/:employeeId', getEmployeePerformances);

// CORRECTED: Added the missing DELETE route
router.delete('/:id', authorizeRoles('admin', 'hr'), deletePerformance);

export default router;
