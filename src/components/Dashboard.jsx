// File: src/components/Dashboard.jsx
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
  Briefcase,
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
      case 'manager':
        return { title: 'Manager Dashboard', description: 'Oversee your team performance and assignments' };
      default:
        return { title: 'Employee Portal', description: 'Access your personal information and company resources' };
    }
  };

  const roleContent = getRoleBasedContent();

  const renderQuickActions = () => {
    switch (user?.role) {
      case 'admin':
      case 'hr':
        return (
          <>
            <button onClick={() => navigate('/employees')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Users className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Manage Employees</span></button>
            <button onClick={() => navigate('/departments')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Building2 className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Departments</span></button>
            <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><Calendar className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">Manage Leaves</span></button>
            <button onClick={() => navigate('/payroll')} className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><DollarSign className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Process Payroll</span></button>
          </>
        );
      case 'manager':
       return (
        <>
          <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><UserCheck className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Approve Leaves</span></button>
          <button onClick={() => navigate('/performance')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Award className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">Team Performance</span></button>
          <button onClick={() => navigate('/employees')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><Users className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">View Team</span></button>
          <button onClick={() => navigate('/jobs')} className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><Briefcase className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Open Jobs</span></button>
        </>
      );
      default: // Employee
        return (
          <>
            <button onClick={() => navigate('/leave')} className="flex flex-col items-center justify-center p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Clock className="h-8 w-8 text-blue-600 mb-2" /><span className="text-sm font-medium text-gray-900">Apply Leave</span></button>
            <button onClick={() => navigate('/performance')} className="flex flex-col items-center justify-center p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors"><Award className="h-8 w-8 text-green-600 mb-2" /><span className="text-sm font-medium text-gray-900">My Performance</span></button>
            <button onClick={() => navigate('/payroll')} className="flex flex-col items-center justify-center p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"><DollarSign className="h-8 w-8 text-purple-600 mb-2" /><span className="text-sm font-medium text-gray-900">View Payslips</span></button>
            <button onClick={() => navigate('/jobs')} className="flex flex-col items-center justify-center p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"><Briefcase className="h-8 w-8 text-orange-600 mb-2" /><span className="text-sm font-medium text-gray-900">Browse Jobs</span></button>
          </>
        );
    }
  };

  if (loading && (user?.role === 'admin' || user?.role === 'hr') && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {(user?.role === 'admin' || user?.role === 'hr') && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-blue-100 rounded-lg"><Users className="h-6 w-6 text-blue-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Total Employees</p><p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p></div></div></div>
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-green-100 rounded-lg"><TrendingUp className="h-6 w-6 text-green-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Active Employees</p><p className="text-2xl font-bold text-gray-900">{stats.activeEmployees}</p></div></div></div>
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-orange-100 rounded-lg"><Building2 className="h-6 w-6 text-orange-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">Departments</p><p className="text-2xl font-bold text-gray-900">{stats.departmentStats.length}</p></div></div></div>
          <div className="bg-white rounded-xl p-6 shadow-sm border"><div className="flex items-center"><div className="p-2 bg-purple-100 rounded-lg"><Calendar className="h-6 w-6 text-purple-600" /></div><div className="ml-4"><p className="text-sm font-medium text-gray-600">This Month</p><p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short' })}</p></div></div></div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {renderQuickActions()}
        </div>
      </div>

      {user?.employee && (
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Information</h3>
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-center">
            <div className="text-sm font-medium text-gray-600">Employee ID:</div>
            <div className="text-sm text-gray-900">{user.employee?.employeeId || 'N/A'}</div>
            
            <div className="text-sm font-medium text-gray-600">Department:</div>
            <div className="text-sm text-gray-900">{user.employee?.department?.name || 'N/A'}</div>

            <div className="text-sm font-medium text-gray-600">Role:</div>
            <div className="text-sm text-gray-900">{user.employee?.role?.title || 'N/A'}</div>

            <div className="text-sm font-medium text-gray-600">Status:</div>
            <div>
                <span className="inline-flex capitalize px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {user.employee?.status || 'N/A'}
                </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
