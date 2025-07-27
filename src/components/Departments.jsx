// File: src/components/Departments.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { Edit, Trash2, Plus, Building2, AlertTriangle } from 'lucide-react';
import api from '../api';

// Modal for adding/editing a department
const DepartmentModal = ({ department, onClose, onSave, eligibleEmployees }) => {
  const [formData, setFormData] = useState(
    department ? { ...department, head: department.head?._id || '' } : { name: '', description: '', head: '' }
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
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description (Motto)" rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          
          <label htmlFor="head" className="block text-sm font-medium text-gray-700">Manager</label>
          <select id="head" name="head" value={formData.head} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Manager</option>
            {eligibleEmployees.map(e => <option key={e._id} value={e._id}>{e.firstName} {e.lastName}</option>)}
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

// Confirmation dialog for deletion
const ConfirmationDialog = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
      <div className="flex items-center">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="ml-4 text-left">
          <h3 className="text-lg font-medium text-gray-900">Delete Department</h3>
          <p className="text-sm text-gray-500 mt-1">Are you sure? This action is permanent and cannot be undone.</p>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button onClick={onConfirm} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">
          Delete
        </button>
        <button onClick={onCancel} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm">
          Cancel
        </button>
      </div>
    </div>
  </div>
);


const Departments = () => {
  const { user } = useAuth(); // Get the current user
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  // CORRECTED: Determine if the user has admin privileges
  const isAdmin = user?.role === 'admin';

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        api.get('/departments'),
        api.get('/employees')
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

  const eligibleForManager = useMemo(() => {
    const managerialRoles = ['Manager', 'HR Manager', 'System Administrator'];
    return employees.filter(emp => !managerialRoles.includes(emp.role?.title));
  }, [employees]);

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

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;
    try {
      await api.delete(`/departments/${departmentToDelete._id}`);
      fetchAllData();
    } catch (error) {
      console.error("Failed to delete department:", error);
      setError(error.response?.data?.message || "Failed to delete department.");
    } finally {
      setShowDeleteConfirm(false);
      setDepartmentToDelete(null);
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
        {/* CORRECTED: "Add Department" button is now only visible to admins */}
        {isAdmin && (
            <button onClick={() => { setEditingDepartment(null); setShowModal(true); }} className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                <Plus className="h-5 w-5 mr-2" />
                Add Department
            </button>
        )}
      </div>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Employees</th>
              {/* CORRECTED: Actions column is now only visible to admins */}
              {isAdmin && <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                    <div className="text-sm text-gray-500">{dept.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.head ? `${dept.head.firstName} ${dept.head.lastName}` : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.employeeCount}</td>
                {/* CORRECTED: Action buttons are now only visible to admins */}
                {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => { setEditingDepartment(dept); setShowModal(true); }} className="p-2 rounded-full hover:bg-gray-200 mr-2"><Edit className="h-5 w-5 text-gray-500" /></button>
                        <button onClick={() => handleDeleteClick(dept)} className="p-2 rounded-full hover:bg-gray-200"><Trash2 className="h-5 w-5 text-red-500" /></button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && <DepartmentModal department={editingDepartment} onClose={() => setShowModal(false)} onSave={handleSave} eligibleEmployees={eligibleForManager} />}
      {showDeleteConfirm && <ConfirmationDialog onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />}
    </div>
  );
};

export default Departments;
