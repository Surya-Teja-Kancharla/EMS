import React, { useState, useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import api from '../api'; // Import the centralized api client

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/jobs'); // API call to your backend
        setJobs(response.data);
      } catch (err) {
        setError('Failed to fetch job openings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-blue-600" />
            Job Openings
          </h1>
          <p className="text-gray-500 mt-1">Browse and apply for open positions within the company.</p>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid gap-6 md:grid-cols-2">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div
              key={job._id} // Use _id from MongoDB
              className="bg-white shadow-sm rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                {/* Use populated department data */}
                <span><strong>Department:</strong> {job.department?.name || 'N/A'}</span>
                <span>|</span>
                <span><strong>Location:</strong> {job.location}</span>
              </div>
              <p className="text-gray-700 mb-4">{job.description}</p>
              <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Posted on {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                      Apply Now
                  </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 md:col-span-2 text-center py-10">No open job positions at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Jobs;
