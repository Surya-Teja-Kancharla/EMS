import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getEmployeesByDepartment // New import
} from '../controllers/employeeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// All routes below are protected by the authentication middleware
router.use(authenticateToken);

// GET all employees
router.get('/', getAllEmployees);

// GET employee statistics (admin and HR only)
router.get('/stats', authorizeRoles('admin', 'hr'), getEmployeeStats);

// GET employees by department ID (for filtering dropdowns)
router.get('/department/:departmentId', getEmployeesByDepartment);

// GET a single employee by ID
router.get('/:id', getEmployeeById);

// POST (create) a new employee (admin and HR only)
router.post('/', authorizeRoles('admin', 'hr'), createEmployee);

// PUT (update) an employee by ID (admin and HR only)
router.put('/:id', authorizeRoles('admin', 'hr'), updateEmployee);

// DELETE an employee by ID (admin only)
router.delete('/:id', authorizeRoles('admin'), deleteEmployee);

export default router;
