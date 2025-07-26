import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats
} from '../controllers/employeeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllEmployees);
router.get('/stats', authorizeRoles('admin', 'hr'), getEmployeeStats);
router.get('/:id', getEmployeeById);
router.post('/', authorizeRoles('admin', 'hr'), createEmployee);
router.put('/:id', authorizeRoles('admin', 'hr'), updateEmployee);
router.delete('/:id', authorizeRoles('admin'), deleteEmployee);

export default router;