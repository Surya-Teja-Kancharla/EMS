import Role from '../models/Role.js';
import Employee from '../models/Employee.js';

export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate('department', 'name')
      .sort({ department: 1, level: 1 });

    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRolesByDepartment = async (req, res) => {
  try {
    const roles = await Role.find({ department: req.params.departmentId, isActive: true })
      .populate('department', 'name')
      .sort({ level: 1 });

    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const role = new Role(req.body);
    await role.save();

    const populatedRole = await Role.findById(role._id)
      .populate('department', 'name');

    res.status(201).json(populatedRole);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name');

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    // Check if role is assigned to any employee
    const employeesCount = await Employee.countDocuments({ role: req.params.id });
    
    if (employeesCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete role with existing employees' 
      });
    }

    const role = await Role.findByIdAndDelete(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};