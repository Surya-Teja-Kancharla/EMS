import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Star,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  Edit
} from 'lucide-react';
import axios from 'axios';

// Mock data for demonstration
const mockPerformances = [
  {
    _id: '1',
    employee: { _id: 'e1', firstName: 'Aarav', lastName: 'Sharma', employeeId: 'TS-001' },
    reviewer: { _id: 'r1', firstName: 'Admin', lastName: 'User' },
    period: { startDate: '2025-01-01', endDate: '2025-06-30' },
    ratings: { technical: 5, communication: 4, teamwork: 5, leadership: 4, innovation: 4 },
    overallRating: 4.4,
    status: 'approved',
    createdAt: '2025-07-10'
  },
  {
    _id: '2',
    employee: { _id: 'e2', firstName: 'Priya', lastName: 'Patel', employeeId: 'TS-002' },
    reviewer: { _id: 'r1', firstName: 'Admin', lastName: 'User' },
    period: { startDate: '2025-01-01', endDate: '2025-06-30' },
    ratings: { technical: 4, communication: 5, teamwork: 4, leadership: 5, innovation: 5 },
    overallRating: 4.6,
    status: 'submitted',
    createdAt: '2025-07-15'
  },
  {
    _id: '3',
    employee: { _id: 'e5', firstName: 'Vikram', lastName: 'Singh', employeeId: 'TS-005' },
    reviewer: { _id: 'r1', firstName: 'Admin', lastName: 'User' },
    period: { startDate: '2025-01-01', endDate: '2025-06-30' },
    ratings: { technical: 3, communication: 4, teamwork: 3, leadership: 2, innovation: 3 },
    overallRating: 3.0,
    status: 'draft',
    createdAt: '2025-07-20'
  }
];

const Performance = () => {
  const { user } = useAuth();
  const [performances, setPerformances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPerformances();
  }, []);

  const fetchPerformances = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      setPerformances(mockPerformances);
      // In a real app, you would fetch data like this:
      // let url = 'http://localhost:5000/api/performance';
      // if (user?.role === 'employee') {
      //   url = `http://localhost:5000/api/performance/employee/${user.employee?._id}`;
      // }
      // const response = await axios.get(url);
      // setPerformances(response.data);
    } catch (error) {
      console.error('Error fetching performances:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPerformances = performances.filter(performance => {
    const fullName = `${performance.employee.firstName} ${performance.employee.lastName}`;
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      performance.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || performance.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
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
          <h1 className="text-3xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'employee' 
              ? 'View your performance reviews and feedback'
              : 'Manage employee performance reviews and ratings'
            }
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'department_head') && (
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            New Review
          </button>
        )}
      </div>

      {/* Filters */}
      {user?.role !== 'employee' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="submitted">Submitted</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Review Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overall Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPerformances.map((performance) => (
              <tr key={performance._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{performance.employee.firstName} {performance.employee.lastName}</div>
                  <div className="text-sm text-gray-500">{performance.employee.employeeId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(performance.period.startDate).toLocaleDateString()} - {new Date(performance.period.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex mr-2">{renderStars(performance.overallRating)}</div>
                    <span className={`font-bold ${getRatingColor(performance.overallRating)}`}>{performance.overallRating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(performance.status)}`}>
                    {performance.status.charAt(0).toUpperCase() + performance.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button className="p-2 rounded-full hover:bg-gray-100"><Eye className="h-5 w-5 text-gray-500"/></button>
                  {(user?.role !== 'employee') && <button className="p-2 rounded-full hover:bg-gray-100"><Edit className="h-5 w-5 text-gray-500"/></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Performance;
