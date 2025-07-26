// File: backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const register = async (req, res) => {
  // This function will now save the password in plain text due to User model changes.
  try {
    const { email, password, role, firstName, lastName, phone, department, roleId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const employeeId = `EMP${Date.now()}`;
    const employee = new Employee({
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      role: roleId,
      dateOfJoining: new Date()
    });
    await employee.save();

    const user = new User({
      email,
      password, // Password is saved as-is, without hashing.
      role,
      employee: employee._id
    });
    await user.save();

    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employee: employee
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate({
      path: 'employee',
      populate: [
        { path: 'department', select: 'name' },
        { path: 'role', select: 'title' }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // UPDATED: Check password using the new insecure method
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employee: user.employee
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ // Use req.user._id from authenticateToken middleware
      path: 'employee',
      populate: [
        { path: 'department', select: 'name' },
        { path: 'role', select: 'title baseSalary' }
      ]
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        employee: user.employee
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
