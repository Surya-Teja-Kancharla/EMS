// File: src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, Building2 } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tech Solutions EMS</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">{error}</div>}
          {/* Form inputs... */}
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" placeholder="Email address" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" placeholder="Password" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-gray-600 space-y-2">
            <p><strong>Admin:</strong> admin@techsolutions.com / admin123</p>
            <p><strong>HR:</strong> hr@techsolutions.com / hr123</p>
            <p><strong>Manager:</strong> raj.verma@techsolutions.com / manager123</p>
            <p><strong>Employee:</strong> kiran.rao@techsolutions.com / emp123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
