import Salary from '../models/Salary.js';
import Employee from '../models/Employee.js';

export const getAllSalaries = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};
    
    if (month && year) {
      filter = { month: parseInt(month), year: parseInt(year) };
    }

    // CORRECTED: Ensured consistent population of employee details.
    const salaries = await Salary.find(filter)
      .populate('employee', 'firstName lastName employeeId')
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate('employee', 'firstName lastName employeeId');

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createSalary = async (req, res) => {
  try {
    const salary = new Salary(req.body);
    await salary.save();

    const populatedSalary = await Salary.findById(salary._id)
      .populate('employee', 'firstName lastName employeeId');

    res.status(201).json(populatedSalary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('employee', 'firstName lastName employeeId');

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEmployeeSalaries = async (req, res) => {
  try {
    const employeeId = req.params.employeeId || req.user.employee._id;
    
    // CORRECTED: Added populate() to ensure employee details are included for single-employee view.
    const salaries = await Salary.find({ employee: employeeId })
      .populate('employee', 'firstName lastName employeeId')
      .sort({ year: -1, month: -1 });

    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const processSalary = async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'processed',
        processedDate: new Date()
      },
      { new: true }
    ).populate('employee', 'firstName lastName employeeId');

    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
