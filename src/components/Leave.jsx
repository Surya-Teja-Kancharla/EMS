// File: src/components/Leave/Leave.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, CheckCircle, XCircle, Eye } from 'lucide-react';
import api from '../api';

const LeaveDetailsModal = ({ leave, onClose }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Request Details</h3>
            <div className="space-y-3 text-sm">
                <p><strong>Employee:</strong> {leave.employee?.firstName} {leave.employee?.lastName}</p>
                <p><strong>Dates:</strong> {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()} ({leave.days} days)</p>
                <p><strong>Type:</strong> <span className="capitalize">{leave.type}</span></p>
                <p><strong>Status:</strong> <span className="capitalize">{leave.status}</span></p>
                <div>
                    <p><strong>Reason:</strong></p>
                    <p className="p-2 bg-gray-50 rounded-md mt-1">{leave.reason}</p>
                </div>
                {leave.approver && (
                    <div>
                        <p><strong>Reviewed by:</strong> {leave.approver?.firstName} {leave.approver?.lastName}</p>
                        <p><strong>Review Comments:</strong></p>
                        <p className="p-2 bg-gray-50 rounded-md mt-1">{leave.approvalComments || 'N/A'}</p>
                    </div>
                )}
            </div>
            <div className="flex justify-end pt-4">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Close</button>
            </div>
        </div>
    </div>
);

const Leave = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    if (user) fetchLeaves();
  }, [user]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const url = user.role === 'employee' ? '/leaves/my-leaves' : '/leaves';
      const response = await api.get(url);
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', formData);
      fetchLeaves();
      resetForm();
    } catch (error) {
      console.error('Error creating leave:', error);
    }
  };

  const handleStatusUpdate = async (leaveId, status) => {
    const comments = status === 'rejected' ? prompt("Reason for rejection:") : 'Approved';
    if (status === 'rejected' && !comments) return; // Don't proceed if rejection reason is cancelled

    try {
      await api.put(`/leaves/${leaveId}/status`, { status, approvalComments: comments });
      fetchLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  const resetForm = () => {
    setFormData({ type: 'annual', startDate: '', endDate: '', reason: '' });
    setShowAddModal(false);
  };

  const filteredLeaves = leaves.filter(leave => {
    const employeeName = `${leave.employee?.firstName || ''} ${leave.employee?.lastName || ''}`;
    const matchesSearch = user.role !== 'employee' ? 
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesStatus = filterStatus === 'all' || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Apply for leave and manage requests.</p>
        </div>
        {user?.role === 'employee' && (
          <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-5 w-5 mr-2" /> Apply for Leave
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/3 pl-4 pr-4 py-2 border border-gray-300 rounded-lg"/>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
          </div>
      </div>

       <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {user?.role !== 'employee' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeaves.map((leave) => (
              <tr key={leave._id}>
                {user?.role !== 'employee' && (
                    <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{leave.employee?.firstName} {leave.employee?.lastName}</div></td>
                )}
                <td className="px-6 py-4 text-sm text-gray-700">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{leave.days}</td>
                <td className="px-6 py-4"><span className="capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{leave.type}</span></td>
                <td className="px-6 py-4"><span className={`capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(leave.status)}`}>{leave.status}</span></td>
                <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    <button onClick={() => { setSelectedLeave(leave); setShowDetailsModal(true); }} className="p-2 rounded-full hover:bg-gray-100"><Eye className="h-5 w-5 text-gray-500"/></button>
                    {(user?.role !== 'employee') && leave.status === 'pending' && (
                        <>
                            <button onClick={() => handleStatusUpdate(leave._id, 'approved')} className="p-2 rounded-full hover:bg-green-100"><CheckCircle className="h-5 w-5 text-green-500"/></button>
                            <button onClick={() => handleStatusUpdate(leave._id, 'rejected')} className="p-2 rounded-full hover:bg-red-100"><XCircle className="h-5 w-5 text-red-500"/></button>
                        </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDetailsModal && <LeaveDetailsModal leave={selectedLeave} onClose={() => setShowDetailsModal(false)} />}
    </div>
  );
};

export default Leave;
