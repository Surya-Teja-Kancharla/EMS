// components/Jobs.tsx
import React from 'react';
import { Briefcase } from 'lucide-react';

const jobData = [
  {
    id: 1,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Hyderabad',
    postedDate: '2025-07-15',
    description: 'Work on React-based front-end development using modern UI libraries.'
  },
  {
    id: 2,
    title: 'HR Executive',
    department: 'Human Resources',
    location: 'Bangalore',
    postedDate: '2025-07-18',
    description: 'Responsible for recruitment, onboarding, and employee engagement activities.'
  }
];

const Jobs: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6 text-blue-600" />
        Job Openings
      </h1>

      <div className="grid gap-6">
        {jobData.map(job => (
          <div
            key={job.id}
            className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Department:</strong> {job.department} | <strong>Location:</strong> {job.location}
            </p>
            <p className="text-gray-700 mb-2">{job.description}</p>
            <p className="text-xs text-gray-500">Posted on {job.postedDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
