// File: src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Components and Pages
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Departments from './components/Departments';
import Performance from './components/Performance';
import Leave from './components/Leave';
import Jobs from './components/Jobs';
import Payroll from './components/Payroll';
import Layout from './components/Layout';
import './index.css';

/**
 * A wrapper for routes that require authentication.
 * It checks if a user is logged in. If not, it redirects to the /login page.
 * It also shows a loading spinner while authentication status is being checked.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }
  
  // If loading is finished and there is no user, redirect to login.
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

/**
 * Defines all the application routes.
 */
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes (no sidebar) - accessible only when not logged in */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

      {/* Protected routes (with sidebar) - wrapped in Layout and ProtectedRoute */}
      <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/employees" element={<ProtectedRoute><Layout><Employees /></Layout></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><Layout><Departments /></Layout></ProtectedRoute>} />
      <Route path="/performance" element={<ProtectedRoute><Layout><Performance /></Layout></ProtectedRoute>} />
      <Route path="/leave" element={<ProtectedRoute><Layout><Leave /></Layout></ProtectedRoute>} />
      <Route path="/payroll" element={<ProtectedRoute><Layout><Payroll /></Layout></ProtectedRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>} />

      {/* Fallback route for any other path */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

/**
 * The main App component that sets up the AuthProvider and Router.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
