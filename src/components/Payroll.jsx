import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  CheckCircle
} from 'lucide-react';
import api from '../api';

const Payroll = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterMonth, setFilterMonth] = React.useState('');
  const [filterYear, setFilterYear] = React.useState('');

  React.useEffect(() => {
    if (user) {
      fetchSalaries();
    }
  }, [user, filterMonth, filterYear]);

  const fetchSalaries = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/salary';
      const params = new URLSearchParams();

      if (user.role === 'employee') {
        url = '/salary/my-salary';
      } else {
        if (filterMonth) params.append('month', filterMonth);
        if (filterYear) params.append('year', filterYear);
      }
      
      const response = await api.get(url, { params });
      setSalaries(response.data);
    } catch (err) {
      setError('Failed to fetch payroll data.');
      console.error('Error fetching salaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSalary = async (salaryId) => {
    try {
      await api.put(`/salary/${salaryId}/process`);
      fetchSalaries(); // Re-fetch to update the status
    } catch (error) {
      console.error('Error processing salary:', error);
      alert('Failed to process salary.');
    }
  };

  const filteredSalaries = salaries.filter(salary => {
    const fullName = `${salary.employee.firstName} ${salary.employee.lastName}`;
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || salary.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1">
            {user?.role === 'employee' 
              ? 'View your salary details and payslips'
              : 'Manage employee salaries and payroll processing'
            }
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'hr') && (
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus className="h-5 w-5 mr-2" />
            Add Salary Record
          </button>
        )}
      </div>

      {/* Filters */}
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
              <option value="draft">Draft</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pay Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalaries.map(salary => (
                    <tr key={salary._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{salary.employee.firstName} {salary.employee.lastName}</div>
                            <div className="text-sm text-gray-500">{salary.employee.employeeId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{months[salary.month - 1]} {salary.year}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{salary.netSalary.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(salary.status)}`}>
                                {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button className="p-2 rounded-full hover:bg-gray-100"><Eye className="h-5 w-5 text-gray-500"/></button>
                            <button className="p-2 rounded-full hover:bg-gray-100"><Download className="h-5 w-5 text-gray-500"/></button>
                            {(user?.role === 'admin' || user?.role === 'hr') && salary.status === 'draft' && (
                                <button onClick={() => handleProcessSalary(salary._id)} className="p-2 rounded-full hover:bg-blue-100"><CheckCircle className="h-5 w-5 text-blue-500"/></button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payroll;
