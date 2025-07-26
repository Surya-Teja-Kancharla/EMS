import express from 'express';
import {
  getAllSalaries,
  getSalaryById,
  createSalary,
  updateSalary,
  getEmployeeSalaries,
  processSalary
} from '../controllers/salaryController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', authorizeRoles('admin', 'hr'), getAllSalaries);
router.get('/my-salary', getEmployeeSalaries);
router.get('/:id', getSalaryById);
router.post('/', authorizeRoles('admin', 'hr'), createSalary);
router.put('/:id', authorizeRoles('admin', 'hr'), updateSalary);
router.put('/:id/process', authorizeRoles('admin', 'hr'), processSalary);
router.get('/employee/:employeeId', authorizeRoles('admin', 'hr'), getEmployeeSalaries);

export default router;