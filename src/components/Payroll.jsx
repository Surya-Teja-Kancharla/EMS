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

// Mock data for demonstration
const mockSalaries = [
  {
    _id: '1',
    employee: { _id: 'e1', firstName: 'Aarav', lastName: 'Sharma', employeeId: 'TS-001' },
    basicSalary: 60000,
    allowances: { hra: 12000, transport: 2000, meal: 1500, medical: 1000, other: 500 },
    deductions: { pf: 4000, tax: 2500, insurance: 1000, other: 500 },
    month: 7,
    year: 2025,
    workingDays: 22,
    attendedDays: 22,
    overtime: { hours: 0, rate: 0 },
    bonus: 2000,
    netSalary: 68000,
    status: 'paid',
    processedDate: '2025-07-25',
    createdAt: '2025-07-01'
  },
  {
    _id: '2',
    employee: { _id: 'e2', firstName: 'Priya', lastName: 'Patel', employeeId: 'TS-002' },
    basicSalary: 80000,
    allowances: { hra: 15000, transport: 2500, meal: 2000, medical: 1500, other: 0 },
    deductions: { pf: 5000, tax: 4500, insurance: 1500, other: 500 },
    month: 7,
    year: 2025,
    workingDays: 22,
    attendedDays: 21,
    overtime: { hours: 5, rate: 300 },
    bonus: 0,
    netSalary: 89500,
    status: 'processed',
    processedDate: '2025-07-26',
    createdAt: '2025-07-01'
  },
  {
    _id: '3',
    employee: { _id: 'e3', firstName: 'Rohan', lastName: 'Kumar', employeeId: 'TS-003' },
    basicSalary: 50000,
    allowances: { hra: 10000, transport: 1500, meal: 1000, medical: 1000, other: 0 },
    deductions: { pf: 3000, tax: 2000, insurance: 800, other: 200 },
    month: 7,
    year: 2025,
    workingDays: 22,
    attendedDays: 22,
    overtime: { hours: 0, rate: 0 },
    bonus: 1500,
    netSalary: 56000,
    status: 'draft',
    createdAt: '2025-07-01'
  }
];

const Payroll = () => {
  const { user } = useAuth();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    fetchSalaries();
  }, [filterMonth, filterYear]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      // Using mock data for demonstration
      setSalaries(mockSalaries);
      // In a real app, you would use axios like this:
      // let url = 'http://localhost:5000/api/salary';
      // ... (rest of the API call logic)
      // const response = await axios.get(url);
      // setSalaries(response.data);
    } catch (error) {
      console.error('Error fetching salaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSalary = async (salaryId) => {
    console.log(`Processing salary with ID: ${salaryId}`);
    // try {
    //   await axios.put(`http://localhost:5000/api/salary/${salaryId}/process`);
    //   fetchSalaries();
    // } catch (error) {
    //   console.error('Error processing salary:', error);
    //   alert(error.response?.data?.message || 'Error processing salary');
    // }
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

  const getTotalAllowances = (allowances) => {
    return Object.values(allowances).reduce((sum, val) => sum + val, 0);
  };

  const getTotalDeductions = (deductions) => {
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
