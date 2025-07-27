// File: src/components/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api';

const JobModal = ({ job, onClose, onSave, departments }) => {
    const [formData, setFormData] = useState(
        job ? { ...job, requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '', department: job.department?._id || '' } 
            : { title: '', department: '', description: '', requirements: '', deadline: new Date().toISOString().split('T')[0] }
    );

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, requirements: formData.requirements.split(',').map(r => r.trim()) });
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
                <h3 className="text-lg font-medium mb-4">{job ? 'Edit Job Posting' : 'Add New Job Posting'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required className="w-full px-3 py-2 border rounded-lg" />
                    <select name="department" value={formData.department} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg">
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                    </select>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="4" required className="w-full px-3 py-2 border rounded-lg"></textarea>
                    <input name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements (comma-separated)" required className="w-full px-3 py-2 border rounded-lg" />
                    <input name="deadline" type="date" value={new Date(formData.deadline).toISOString().split('T')[0]} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg" />
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const canManage = user?.role === 'admin' || user?.role === 'hr';
  const canApply = user?.role === 'employee';

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
          const [jobsRes, deptsRes] = await Promise.all([
            api.get('/jobs'),
            canManage ? api.get('/departments') : Promise.resolve({ data: [] })
          ]);
          setJobs(jobsRes.data);
          setDepartments(deptsRes.data);
        } finally {
          setLoading(false);
        }
      };
    fetchData();
  }, [user, canManage]);

  const handleSave = async (jobData) => {
    try {
        if (editingJob) await api.put(`/jobs/${editingJob._id}`, jobData);
        else await api.post('/jobs', jobData);
        setShowModal(false);
        setEditingJob(null);
        const jobsRes = await api.get('/jobs'); setJobs(jobsRes.data);
    } catch (error) {
        console.error("Failed to save job posting:", error);
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure?")) {
        try {
            await api.delete(`/jobs/${jobId}`);
            const jobsRes = await api.get('/jobs'); setJobs(jobsRes.data);
        } catch (error) {
            console.error("Failed to delete job posting:", error);
        }
    }
  };

  if (loading) return <div className="flex justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold flex items-center"><Briefcase className="h-8 w-8 mr-3 text-blue-600" /> Job Openings</h1></div>
        {canManage && <button onClick={() => { setEditingJob(null); setShowModal(true); }} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="h-5 w-5 mr-2" /> Add Job</button>}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.map(job => (
            <div key={job._id} className="bg-white shadow-sm rounded-lg p-6 border-l-4 border-blue-500 flex flex-col">
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div><h2 className="text-xl font-semibold mb-1">{job.title}</h2><p className="text-sm text-gray-600 mb-3"><strong>Department:</strong> {job.department?.name}</p></div>
                    {canManage && <div className="flex-shrink-0 space-x-2"><button onClick={() => { setEditingJob(job); setShowModal(true); }} className="p-2 rounded-full hover:bg-gray-200"><Edit className="h-5 w-5 text-gray-500" /></button><button onClick={() => handleDelete(job._id)} className="p-2 rounded-full hover:bg-gray-200"><Trash2 className="h-5 w-5 text-red-500" /></button></div>}
                </div>
                <p className="text-gray-700 mb-4">{job.description}</p>
                
                {/* MODIFIED: Added section to display job requirements */}
                {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Requirements:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t">
                  <p className="text-xs text-gray-500">Apply by: {new Date(job.deadline).toLocaleDateString()}</p>
                  {canApply && <button onClick={() => window.open("https://docs.google.com/forms/d/1D69sQ0Xv3syekftGsWRcZRBv3thUfzW23ctEzZWcUMQ/edit", "_blank")} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg">Apply Now</button>}
              </div>
            </div>
        ))}
      </div>
      {showModal && canManage && <JobModal job={editingJob} onClose={() => setShowModal(false)} onSave={handleSave} departments={departments} />}
    </div>
  );
};

export default Jobs;
