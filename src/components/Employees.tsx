import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Clock,
  Award,
  DollarSign,
  FileText,
  Briefcase
} from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  departmentStats: Array<{ name: string; count: number }>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'System Overview',
          description: 'Complete control over the Employee Management System'
        };
      case 'hr':
        return {
          title: 'HR Dashboard',
          description: 'Manage employees, payroll, and organizational data'
        };
      case 'department_head':
        return {
          title: 'Department Management',
          description: 'Oversee your team performance and assignments'
        };
      default:
        return {
          title: 'Employee Portal',
          description: 'Access your personal information and company resources'
        };
    }
  };

  const roleContent = getRoleBasedContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.employee?.firstName}!
            </h1>
            <p className="text-xl mb-1">{roleContent.title}</p>
            <p className="text-blue-100">{roleContent.description}</p>
          </div>
          <div className="hidden md:block">
            <div className="h-24 w-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Building2 className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Only for Admin and HR */}
      {(user?.role === 'admin' || user?.role === 'hr') && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.departmentStats.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short' })}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {user?.role === 'admin' || user?.role === 'hr' ? (
              <>
                <button className="flex flex-col items-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Add Employee</span>
                </button>
                <button className="flex flex-col items-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <Building2 className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Manage Departments</span>
                </button>
                <button className="flex flex-col items-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Process Payroll</span>
                </button>
                <button className="flex flex-col items-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <FileText className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Generate Reports</span>
                </button>
              </>
            ) : (
              <>
                <button className="flex flex-col items-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <Clock className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Apply Leave</span>
                </button>
                <button className="flex flex-col items-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <Award className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">View Performance</span>
                </button>
                <button className="flex flex-col items-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">View Payslips</span>
                </button>
                <button className="flex flex-col items-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                  <Briefcase className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Browse Jobs</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Department Distribution - Only for Admin and HR */}
        {(user?.role === 'admin' || user?.role === 'hr') && stats && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
            <div className="space-y-3">
              {stats.departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(dept.count / stats.totalEmployees) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employee Info - For Employees */}
        {user?.role === 'employee' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employee ID:</span>
                <span className="text-sm font-medium text-gray-900">{user.employee?.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Department:</span>
                <span className="text-sm font-medium text-gray-900">{user.employee?.department.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Role:</span>
                <span className="text-sm font-medium text-gray-900">{user.employee?.role.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">System updated successfully</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="h-2 w-2 bg-green-600 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Welcome to Tech Solutions EMS</p>
              <p className="text-xs text-gray-500">Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;