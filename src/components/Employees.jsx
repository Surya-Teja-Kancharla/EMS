// File: src/components/Employees/Employees.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import api from '../api';

const EmployeeModal = ({ employee, onClose, onSave, departments, roles }) => {
  const [formData, setFormData] = useState(
    employee || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
    }
  );

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
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes, roleRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
        api.get('/roles')
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

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSave = async (employeeData) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee._id}`, employeeData);
      } else {
        await api.post('/employees', employeeData);
      }
      setShowModal(false);
      setEditingEmployee(null);
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error("Failed to save employee:", error);
      setError("Failed to save employee.");
    }
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
        try {
            await api.delete(`/employees/${employeeId}`);
            fetchAllData(); // Refresh data
        } catch (error) {
            console.error("Failed to delete employee:", error);
            setError("Failed to delete employee.");
        }
    }
  };
  
  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusChipClass = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
       <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 mt-1">View, search, and manage all employees.</p>
        </div>
        <button onClick={() => { setEditingEmployee(null); setShowModal(true); }} className="mt-4 sm:mt-0 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors w-full sm:w-auto">
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{employee.firstName} {employee.lastName}</div>
                  <div className="text-sm text-gray-500">{employee.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.department?.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{employee.role?.title || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusChipClass(employee.status)}`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => { setEditingEmployee(employee); setShowModal(true); }} className="p-2 rounded-full hover:bg-gray-200"><Edit className="h-5 w-5 text-gray-500" /></button>
                  <button onClick={() => handleDelete(employee._id)} className="p-2 rounded-full hover:bg-gray-200"><Trash2 className="h-5 w-5 text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <EmployeeModal employee={editingEmployee} onClose={() => setShowModal(false)} onSave={handleSave} departments={departments} roles={roles} />}
    </div>
  );
};

export default Employees;
