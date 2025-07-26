import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Clock,
  Award,
  DollarSign,
  FileText,
  Briefcase,
  Settings,
  UserCheck
} from 'lucide-react';
import api from '../api';

const Dashboard = () => { 
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch stats only if the user is an admin or HR
        if (user.role === 'admin' || user.role === 'hr') {
          const statsRes = await api.get('/employees/stats');
          setStats(statsRes.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        return { title: 'System Overview', description: 'Complete control over the Employee Management System' };
      case 'hr':
        return { title: 'HR Dashboard', description: 'Manage employees, payroll, and organizational data' };
      case 'department_head':
        return { title: 'Department Management', description: 'Oversee your team performance and assignments' };
      default:
        return { title: 'Employee Portal', description: 'Access your personal information and company resources' };
    }
  };

  const roleContent = getRoleBasedContent();

  const renderQuickActions = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <>
            <button onClick={() => navigate('/employees')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Users className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Manage Users</span></button>
            <button onClick={() => navigate('/departments')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Building2 className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Departments</span></button>
            <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><Calendar className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">View Leaves</span></button>
            <button className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><Settings className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">System Settings</span></button>
          </>
        );
      case 'hr':
        return (
          <>
            <button onClick={() => navigate('/employees')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Users className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Add Employee</span></button>
            <button onClick={() => navigate('/payroll')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><DollarSign className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">Process Payroll</span></button>
            <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Calendar className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Manage Leaves</span></button>
            <button className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><FileText className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Reports</span></button>
          </>
        );
      case 'department_head':
       return (
        <>
          <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><UserCheck className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Approve Leaves</span></button>
          <button onClick={() => navigate('/performance')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Award className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Team Performance</span></button>
          <button onClick={() => navigate('/employees')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><Users className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">View Team</span></button>
          <button className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><FileText className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Team Reports</span></button>
        </>
      );
      default: // Employee
        return (
          <>
            <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Clock className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Apply Leave</span></button>
            <button onClick={() => navigate('/performance')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Award className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Performance</span></button>
            <button onClick={() => navigate('/payroll')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><DollarSign className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">View Payslips</span></button>
            <button onClick={() => navigate('/jobs')} className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><Briefcase className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Browse Jobs</span></button>
          </>
        );
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {user?.employee?.firstName || 'User'}!
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

      {/* Stats Cards */}
      {(user?.role === 'admin' || user?.role === 'hr') && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-blue-100 rounded-lg"><Users className="h-6 w-6 text-blue-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Total Employees</p><p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p></div></div></div>
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="h-6 w-6 text-green-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Active Employees</p><p className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</p></div></div></div>
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-orange-100 rounded-lg"><Building2 className="h-6 w-6 text-orange-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Departments</p><p className="text-2xl font-bold text-gray-900">{stats.departmentStats.length}</p></div></div></div>
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-purple-100 rounded-lg"><Calendar className="h-6 w-6 text-purple-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">This Month</p><p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short' })}</p></div></div></div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(user?.role === 'admin' || user?.role === 'hr') ? (
            <>
              <button className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Users className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Add Employee</span></button>
              <button className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Building2 className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Departments</span></button>
              <button className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><DollarSign className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">Process Payroll</span></button>
              <button className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><FileText className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Reports</span></button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Clock className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Apply Leave</span></button>
              <button onClick={() => navigate('/performance')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Award className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Performance</span></button>
              <button onClick={() => navigate('/payroll')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><DollarSign className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">View Payslips</span></button>
              <button onClick={() => navigate('/jobs')} className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><Briefcase className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Browse Jobs</span></button>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"><div className="h-2 w-2 bg-blue-600 rounded-full"></div><div className="flex-1"><p className="text-sm font-medium text-gray-900">System updated successfully</p><p className="text-xs text-gray-500">2 hours ago</p></div></div>
          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"><div className="h-2 w-2 bg-green-600 rounded-full"></div><div className="flex-1"><p className="text-sm font-medium text-gray-900">Welcome to Tech Solutions EMS</p><p className="text-xs text-gray-500">Today</p></div></div>
        </div>
      </div>

      {/* Department Distribution */}
      {(user?.role === 'admin' || user?.role === 'hr') && stats && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h3>
          <div className="space-y-3">
            {stats.departmentStats.map((dept, index) => (
              <div key={index} className="flex items-center justify-between"><span className="text-sm font-medium text-gray-700">{dept.name}</span><div className="flex items-center space-x-2"><div className="w-20 bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(dept.count / stats.totalEmployees) * 100}%` }}></div></div><span className="text-sm text-gray-900 font-medium">{dept.count}</span></div></div>
            ))}
          </div>
        </div>
      )}

      {/* Employee Info */}
      {user?.role === 'employee' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-gray-600">Employee ID:</span><span className="text-sm font-medium text-gray-900">{user.employee?.employeeId}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Department:</span><span className="text-sm font-medium text-gray-900">{user.employee?.department.name}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Role:</span><span className="text-sm font-medium text-gray-900">{user.employee?.role.title}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-600">Status:</span><span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
