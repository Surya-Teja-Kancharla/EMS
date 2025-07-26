import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import axios from 'axios';

// Mock data to use since we are not connected to a backend
const mockLeaves = [
    {
        _id: '1',
        employee: { _id: 'e1', firstName: 'Priya', lastName: 'Patel', employeeId: 'TS-002' },
        type: 'annual',
        startDate: '2025-08-01',
        endDate: '2025-08-05',
        days: 5,
        reason: 'Family vacation.',
        status: 'approved',
        approver: { _id: 'a1', firstName: 'Admin', lastName: 'User' },
        approvalDate: '2025-07-20',
        createdAt: '2025-07-18'
    },
    {
        _id: '2',
        employee: { _id: 'e3', firstName: 'Rohan', lastName: 'Kumar', employeeId: 'TS-003' },
        type: 'sick',
        startDate: '2025-07-28',
        endDate: '2025-07-28',
        days: 1,
        reason: 'Feeling unwell.',
        status: 'pending',
        createdAt: '2025-07-25'
    },
    {
        _id: '3',
        employee: { _id: 'e4', firstName: 'Sneha', lastName: 'Reddy', employeeId: 'TS-004' },
        type: 'personal',
        startDate: '2025-09-10',
        endDate: '2025-09-12',
        days: 3,
        reason: 'Personal appointment.',
        status: 'rejected',
        approver: { _id: 'a1', firstName: 'Admin', lastName: 'User' },
        approvalDate: '2025-07-22',
        approvalComments: 'Please provide more details.',
        createdAt: '2025-07-21'
    }
];


const Leave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration.
      // In a real app, you would uncomment the axios calls.
      setLeaves(mockLeaves);
      // let url = 'http://localhost:5000/api/leaves';
      // if (user?.role === 'employee') {
      //   url = 'http://localhost:5000/api/leaves/my-leaves';
      // }
      // const response = await axios.get(url);
      // setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting new leave request:', formData);
    // In a real app, you would make the API call here.
    // try {
    //   await axios.post('http://localhost:5000/api/leaves', formData);
    //   fetchLeaves();
    //   resetForm();
    // } catch (error) {
    //   console.error('Error creating leave:', error);
    //   alert(error.response?.data?.message || 'Error creating leave request');
    // }
    resetForm(); // For demonstration
  };

  const handleStatusUpdate = async (leaveId, status, comments = '') => {
    console.log(`Updating leave ${leaveId} to ${status}`);
    // try {
    //   await axios.put(`http://localhost:5000/api/leaves/${leaveId}/status`, {
    //     status,
    //     approvalComments: comments
    //   });
    //   fetchLeaves();
    // } catch (error) {
    //   console.error('Error updating leave status:', error);
    //   alert(error.response?.data?.message || 'Error updating leave status');
    // }
  };

  const resetForm = () => {
    setFormData({
      type: 'annual',
      startDate: '',
      endDate: '',
      reason: ''
    });
    setShowAddModal(false);
  };

  const filteredLeaves = leaves.filter(leave => {
    const employeeName = `${leave.employee.firstName} ${leave.employee.lastName}`;
    const matchesSearch = 
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
    const matchesType = filterType === 'all' || leave.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'employee' 
              ? 'Apply for leave and track your requests'
              : 'Manage employee leave requests and approvals'
            }
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Apply for Leave
        </button>
      </div>

      {/* Stats Cards and Filters can be added here as needed */}

      {/* Leave Table */}
       <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeaves.map((leave) => (
              <tr key={leave._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{leave.employee.firstName} {leave.employee.lastName}</div>
                    <div className="text-sm text-gray-500">{leave.employee.employeeId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{leave.days}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(leave.type)}`}>
                        {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Add Leave Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide a reason for your leave request"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Apply Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
