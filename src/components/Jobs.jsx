// File: src/components/Jobs/Jobs.jsx
import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import api from '../api';

const ApplyModal = ({ job, onClose, onApply }) => {
    const [coverLetter, setCoverLetter] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onApply(job._id, coverLetter);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Apply for {job.title}</h3>
                <p className="text-sm text-gray-600 mb-4">Department: {job.department?.name}</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Write your cover letter here..."
                        required
                        rows="6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    ></textarea>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Submit Application</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch job openings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobPostingId, coverLetter) => {
    try {
        await api.post('/applications', { jobPostingId, coverLetter });
        setShowModal(false);
        setSelectedJob(null);
        alert("Application submitted successfully!");
    } catch (error) {
        console.error("Failed to apply for job:", error);
        setError("Failed to submit application.");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-blue-600" /> Job Openings
          </h1>
          <p className="text-gray-500 mt-1">Browse and apply for open positions within the company.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="bg-white shadow-sm rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                <span><strong>Department:</strong> {job.department?.name || 'N/A'}</span>
              </div>
              <p className="text-gray-700 mb-4">{job.description}</p>
              <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                  <button onClick={() => { setSelectedJob(job); setShowModal(true); }} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Apply Now</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 md:col-span-2 text-center py-10">No open job positions at the moment.</p>
        )}
      </div>
      {showModal && <ApplyModal job={selectedJob} onClose={() => setShowModal(false)} onApply={handleApply} />}
    </div>
  );
};

export default Jobs;
