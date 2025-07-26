// File: src/components/Departments/Departments.jsx
import React, { useState, useEffect } from 'react';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api';

const DepartmentModal = ({ department, onClose, onSave, employees }) => {
  const [formData, setFormData] = useState(
    department || { name: '', description: '', head: '' }
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {department ? 'Edit Department' : 'Add New Department'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Department Name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          <select name="head" value={formData.head} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Department Head</option>
            {employees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}
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

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        api.get('/departments'),
        api.get('/employees') // Fetch employees for the dropdown
      ]);
      setDepartments(deptRes.data);
      setEmployees(empRes.data);
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

  const handleSave = async (departmentData) => {
    try {
      if (editingDepartment) {
        await api.put(`/departments/${editingDepartment._id}`, departmentData);
      } else {
        await api.post('/departments', departmentData);
      }
      setShowModal(false);
      setEditingDepartment(null);
      fetchAllData();
    } catch (error) {
      console.error("Failed to save department:", error);
      setError(error.response?.data?.message || "Failed to save department.");
    }
  };

  const handleDelete = async (departmentId) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/departments/${departmentId}`);
        fetchAllData();
      } catch (error) {
        console.error("Failed to delete department:", error);
        setError(error.response?.data?.message || "Failed to delete department.");
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">Manage all the departments in your organization.</p>
        </div>
        <button onClick={() => { setEditingDepartment(null); setShowModal(true); }} className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Add Department
        </button>
      </div>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Head</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Employees</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-gray-900">{dept.name}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.head ? `${dept.head.firstName} ${dept.head.lastName}` : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.employeeCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => { setEditingDepartment(dept); setShowModal(true); }} className="p-2 rounded-full hover:bg-gray-200"><Edit className="h-5 w-5 text-gray-500" /></button>
                  <button onClick={() => handleDelete(dept._id)} className="p-2 rounded-full hover:bg-gray-200"><Trash2 className="h-5 w-5 text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <DepartmentModal department={editingDepartment} onClose={() => setShowModal(false)} onSave={handleSave} employees={employees} />}
    </div>
  );
};

export default Departments;
