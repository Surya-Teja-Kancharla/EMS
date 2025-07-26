import Leave from '../models/Leave.js';
import Employee from '../models/Employee.js';

export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate('employee', 'firstName lastName employeeId')
      .populate('approver', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'firstName lastName employeeId')
      .populate('approver', 'firstName lastName');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createLeave = async (req, res) => {
  try {
    const leaveData = {
      ...req.body,
      employee: req.user.employee._id
    };

    // Calculate days
    const startDate = new Date(leaveData.startDate);
    const endDate = new Date(leaveData.endDate);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    
    leaveData.days = daysDiff;

    const leave = new Leave(leaveData);
    await leave.save();

    const populatedLeave = await Leave.findById(leave._id)
      .populate('employee', 'firstName lastName employeeId');

    res.status(201).json(populatedLeave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, approvalComments } = req.body;
    
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvalComments,
        approver: req.user.employee._id,
        approvalDate: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('employee', 'firstName lastName employeeId')
      .populate('approver', 'firstName lastName');

    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEmployeeLeaves = async (req, res) => {
  try {
    const employeeId = req.params.employeeId || req.user.employee._id;
    
    const leaves = await Leave.find({ employee: employeeId })
      .populate('approver', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};