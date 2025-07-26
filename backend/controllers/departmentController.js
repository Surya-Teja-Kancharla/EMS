import Department from '../models/Department.js';
import Employee from '../models/Employee.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('head', 'firstName lastName')
      .sort({ name: 1 });

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();

    const populatedDepartment = await Department.findById(department._id)
      .populate('head', 'firstName lastName');

    res.status(201).json(populatedDepartment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('head', 'firstName lastName');

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    // Check if department has employees
    const employeesCount = await Employee.countDocuments({ department: req.params.id });
    
    if (employeesCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with existing employees' 
      });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};