import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';

interface Salary {
  _id: string;
  employee: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    meal: number;
    medical: number;
    other: number;
  };
  deductions: {
    pf: number;
    tax: number;
    insurance: number;
    other: number;
  };
  month: number;
  year: number;
  workingDays: number;
  attendedDays: number;
  overtime: {
    hours: number;
    rate: number;
  };
  bonus: number;
  netSalary: number;
  status: 'draft' | 'processed' | 'paid';
  processedDate?: string;
  createdAt: string;
}

const Payroll: React.FC = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    fetchSalaries();
  }, [filterMonth, filterYear]);

  const fetchSalaries = async () => {
    try {
      let url = 'http://localhost:5000/api/salary';
      
      // If employee role, fetch only their salary
      if (user?.role === 'employee') {
        url = 'http://localhost:5000/api/salary/my-salary';
      } else {
        // Add month/year filters for admin/HR
        const params = new URLSearchParams();
        if (filterMonth) params.append('month', filterMonth);
        if (filterYear) params.append('year', filterYear);
        if (params.toString()) url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSalary = async (salaryId: string) => {
    try {
      await axios.put(`http://localhost:5000/api/salary/${salaryId}/process`);
      fetchSalaries();
    } catch (error: any) {
      console.error('Error processing salary:', error);
      alert(error.response?.data?.message || 'Error processing salary');
    }
  };

  const filteredSalaries = salaries.filter(salary => {
    const matchesSearch = 
      salary.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salary.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || salary.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalAllowances = (allowances: Salary['allowances']) => {
    return Object.values(allowances).reduce((sum, val) => sum + val, 0);
  };

  const getTotalDeductions = (deductions: Salary['deductions']) => {
    return Object.values(deductions).reduce((sum, val) => sum + val, 0);
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
          <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600">
            {user?.role === 'employee' 
              ? 'View your salary details and payslips'
              : 'Manage employee salaries and payroll processing'
            }
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'hr') && (
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Salary Record
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">{salaries.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {salaries.filter(s => s.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {salaries.filter(s => s.status === 'processed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                {salaries.filter(s => s.status === 'paid').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="processed">Processed</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            
            {user?.role !== 'employee' && (
              <>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Months</option>
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>{month}</option>
                  ))}
                </select>
                
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Salary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSalaries.map((salary) => (
          <div key={salary._id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {salary.employee.firstName[0]}{salary.employee.lastName[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {salary.employee.firstName} {salary.employee.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{salary.employee.employeeId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(salary.status)}`}>
                  {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  {months[salary.month - 1]} {salary.year}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Basic Salary</p>
                  <p className="text-lg font-bold text-gray-900">₹{salary.basicSalary.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Net Salary</p>
                  <p className="text-lg font-bold text-green-600">₹{salary.netSalary.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Allowances:</span>
                  <p className="font-medium text-green-600">+₹{getTotalAllowances(salary.allowances).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Deductions:</span>
                  <p className="font-medium text-red-600">-₹{getTotalDeductions(salary.deductions).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Bonus:</span>
                  <p className="font-medium text-blue-600">+₹{salary.bonus.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Working Days:</span>
                  <span className="ml-2 font-medium">{salary.workingDays}</span>
                </div>
                <div>
                  <span className="text-gray-600">Attended:</span>
                  <span className="ml-2 font-medium">{salary.attendedDays}</span>
                </div>
              </div>

              {salary.overtime.hours > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600">Overtime:</span>
                  <span className="ml-2 font-medium">
                    {salary.overtime.hours}h @ ₹{salary.overtime.rate}/h
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
              <span className="text-xs text-gray-500">
                Created: {new Date(salary.createdAt).toLocaleDateString()}
              </span>
              
              <div className="flex space-x-2">
                <button className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                
                <button className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
                
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <>
                    <button className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    
                    {salary.status === 'draft' && (
                      <button
                        onClick={() => handleProcessSalary(salary._id)}
                        className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Process
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSalaries.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No salary records found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first salary record.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Payroll;