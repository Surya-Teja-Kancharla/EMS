import Performance from '../models/Performance.js';
import Employee from '../models/Employee.js';

export const getAllPerformances = async (req, res) => {
  try {
    const performances = await Performance.find()
      .populate('employee', 'firstName lastName employeeId')
      .populate('reviewer', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPerformanceById = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id)
      .populate('employee', 'firstName lastName employeeId')
      .populate('reviewer', 'firstName lastName');

    if (!performance) {
      return res.status(404).json({ message: 'Performance record not found' });
    }

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPerformance = async (req, res) => {
  try {
    const performanceData = {
      ...req.body,
      reviewer: req.user.employee._id
    };

    const performance = new Performance(performanceData);
    await performance.save();

    const populatedPerformance = await Performance.findById(performance._id)
      .populate('employee', 'firstName lastName employeeId')
      .populate('reviewer', 'firstName lastName');

    res.status(201).json(populatedPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('employee', 'firstName lastName employeeId')
      .populate('reviewer', 'firstName lastName');

    if (!performance) {
      return res.status(404).json({ message: 'Performance record not found' });
    }

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEmployeePerformances = async (req, res) => {
  try {
    const performances = await Performance.find({ employee: req.params.employeeId })
      .populate('reviewer', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(performances);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};