// File: backend/controllers/departmentController.js
import Department from '../models/Department.js';
import Employee from '../models/Employee.js';

// GET all departments with their head and employee count
export const getAllDepartments = async (req, res) => {
  try {
    // Use aggregation pipeline to efficiently get the employee count for each department
    const departments = await Department.aggregate([
      {
        $lookup: {
          from: 'employees', // The collection to join with
          localField: '_id', // Field from the departments collection
          foreignField: 'department', // Field from the employees collection
          as: 'employees' // The array field name for the joined employees
        }
      },
      {
        $lookup: {
            from: 'employees',
            localField: 'head',
            foreignField: '_id',
            as: 'headInfo'
        }
      },
      {
        $unwind: {
            path: '$headInfo',
            preserveNullAndEmptyArrays: true // Keep departments even if head is not set
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          budget: 1,
          isActive: 1,
          createdAt: 1,
          head: {
            _id: '$headInfo._id',
            firstName: '$headInfo.firstName',
            lastName: '$headInfo.lastName'
          },
          employeeCount: { $size: '$employees' } // Calculate the size of the employees array
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// CREATE a new department
export const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();

    // Fetch the newly created department with populated head info to return to the client
    const populatedDepartment = await Department.findById(department._id)
      .populate('head', 'firstName lastName');

    res.status(201).json(populatedDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a department by ID
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
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a department by ID
export const deleteDepartment = async (req, res) => {
  try {
    // Check if the department has any employees assigned to it
    const employeesCount = await Employee.countDocuments({ department: req.params.id });
    
    if (employeesCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete department with existing employees. Please reassign them first.' 
      });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
