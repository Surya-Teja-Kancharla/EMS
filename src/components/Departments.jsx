import React, { useState, useEffect } from 'react';
import { Building2, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

// Mock data for initial display
const initialDepartments = [
  { id: 1, name: 'Engineering', head: 'John Doe', employeeCount: 15 },
  { id: 2, name: 'Human Resources', head: 'Jane Smith', employeeCount: 5 },
  { id: 3, name: 'Sales', head: 'Mike Johnson', employeeCount: 10 },
  { id: 4, name: 'Marketing', head: 'Emily White', employeeCount: 8 },
];

const Departments = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        // const response = await axios.get('/api/departments');
        // setDepartments(response.data);
      } catch (err) {
        setError('Failed to fetch departments.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // fetchDepartments(); // Commented out to use mock data
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-500 mt-1">Manage all the departments in your organization.</p>
        </div>
        <button className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Add Department
        </button>
      </div>

      {/* Departments Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department Head
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No. of Employees
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      <Building2 className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.head}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dept.employeeCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block text-left">
                    <button className="p-2 rounded-full hover:bg-gray-200">
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </button>
                    {/* Dropdown for actions can be implemented here */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Departments;
