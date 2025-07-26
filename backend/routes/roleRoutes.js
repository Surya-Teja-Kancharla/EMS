import express from 'express';
import {
  getAllRoles,
  getRolesByDepartment,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/roleController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllRoles);
router.get('/department/:departmentId', getRolesByDepartment);
router.post('/', authorizeRoles('admin'), createRole);
router.put('/:id', authorizeRoles('admin'), updateRole);
router.delete('/:id', authorizeRoles('admin'), deleteRole);

export default router;