// File: src/components/Employees.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api';

// Modal component for adding or editing an employee
const EmployeeModal = ({ employee, onClose, onSave, departments, roles }) => {
  // CORRECTED: Initialize form state with employee data if it exists.
  // This ensures the form is pre-filled for editing.
  const [formData, setFormData] = useState({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    department: employee?.department?._id || '', // Use department ID for select value
    role: employee?.role?._id || '',             // Use role ID for select value
    status: employee?.status || 'active',
    dateOfJoining: employee?.dateOfJoining 
      ? new Date(employee.dateOfJoining).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <select name="department" value={formData.department} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Department</option>
            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Role</option>
            {roles.map(r => <option key={r._id} value={r._id}>{r.title}</option>)}
          </select>
          <input name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <select name="status" value={formData.status} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Employees page component
const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const isManager = user?.role === 'manager';
  const canManage = user?.role === 'admin' || user?.role === 'hr';

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [empRes, deptRes, roleRes] = await Promise.all([
          api.get('/employees'),
          canManage ? api.get('/departments') : Promise.resolve({ data: [] }),
          canManage ? api.get('/roles') : Promise.resolve({ data: [] })
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setRoles(roleRes.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [user, canManage]);

  const handleSave = async (employeeData) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, employeeData);
      } else {
        await api.post('/employees', employeeData);
      }
      setShowModal(false);
      setEditingEmployee(null);
      const empRes = await api.get('/employees'); setEmployees(empRes.data);
    } catch (error) {
      console.error("Failed to save employee:", error);
      setError("Failed to save employee.");
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee? This action is permanent.")) {
        try {
            await api.delete(`/employees/${employeeId}`);
            const empRes = await api.get('/employees'); setEmployees(empRes.data);
        } catch (error) {
            console.error("Failed to delete employee:", error);
            setError(error.response?.data?.message || "Failed to delete employee.");
        }
    }
  };
  
  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(emp => {
      switch (searchCategory) {
        case 'name': return `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(query);
        case 'department': return emp.department?.name.toLowerCase().includes(query);
        case 'role': return emp.role?.title.toLowerCase().includes(query);
        case 'status': return emp.status.toLowerCase().includes(query);
        default: return true;
      }
    });
  }, [employees, searchQuery, searchCategory]);
  
  const getStatusChipClass = (status) => ({
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    terminated: 'bg-red-100 text-red-800'
  }[status] || 'bg-gray-100 text-gray-800');

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
       <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isManager ? "My Department" : "Employees"}</h1>
          <p className="text-gray-500 mt-1">{isManager ? "View employees in your department." : "View, search, and manage all employees."}</p>
        </div>
        {canManage && (
          <button onClick={() => { setEditingEmployee(null); setShowModal(true); }} className="mt-4 sm:mt-0 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" /> Add Employee
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} className="w-full md:w-auto h-10 border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="name">Name</option><option value="department">Department</option><option value="role">Role</option><option value="status">Status</option>
          </select>
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" placeholder={`Search by ${searchCategory}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {canManage && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div><div className="text-sm text-gray-500">{employee.email}</div></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.department?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.role?.title || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`capitalize px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(employee.status)}`}>{employee.status}</span></td>
                {canManage && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => { setEditingEmployee(employee); setShowModal(true); }} className="p-2 rounded-full hover:bg-gray-200"><Edit className="h-5 w-5 text-gray-500" /></button>
                    <button onClick={() => handleDelete(employee._id)} className="p-2 rounded-full hover:bg-gray-200"><Trash2 className="h-5 w-5 text-red-500" /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && canManage && <EmployeeModal employee={editingEmployee} onClose={() => setShowModal(false)} onSave={handleSave} departments={departments} roles={roles} />}
    </div>
  );
};

export default Employees;
