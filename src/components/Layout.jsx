import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  Users,
  BarChart3,
  Calendar,
  Briefcase,
  DollarSign,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Navigation items with role-based access control
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'hr', 'manager', 'employee'] },
    { name: 'Employees', href: '/employees', icon: Users, roles: ['admin', 'hr', 'manager'] },
    { name: 'Departments', href: '/departments', icon: Building2, roles: ['admin', 'hr'] },
    { name: 'Performance', href: '/performance', icon: BarChart3, roles: ['admin', 'hr', 'manager', 'employee'] },
    { name: 'Leave', href: '/leave', icon: Calendar, roles: ['admin', 'hr', 'manager', 'employee'] },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, roles: ['admin', 'hr', 'manager', 'employee'] },
    { name: 'Payroll', href: '/payroll', icon: DollarSign, roles: ['admin', 'hr', 'employee'] },
  ];

  // Role name display mapping
  const roleDisplayNames = {
    admin: 'System Admin',
    hr: 'HR',
    manager: 'Manager',
    employee: 'Employee',
  };

  // Filter navigation based on the current user's role
  const filteredNavigation = navigationItems.filter(item =>
    item.roles.includes(user?.role || 'employee')
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static`}>
        
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Tech Solutions</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-4 flex-1">
          <ul className="space-y-2">
            {filteredNavigation.map(item => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.employee?.firstName?.[0]}
                {user?.employee?.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.employee?.firstName} {user?.employee?.lastName}
              </p>
              {/* Replaced capitalize with mapped display name */}
              <p className="text-xs text-gray-500">
                {roleDisplayNames[user?.role] || user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1"></div>
            <span className="text-sm text-gray-500">
              Welcome back, {user?.employee?.firstName}!
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
