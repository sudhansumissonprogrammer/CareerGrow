import React from 'react';
import { Link } from 'react-router-dom';

function Remote() {
  const remoteJobs = [
    { id: 1, title: 'Frontend Engineer', company: 'RemoteCo', time: 'Full-time' },
    { id: 2, title: 'Backend Developer', company: 'CloudSystems', time: 'Contract' },
  ];

  const handleApply = (job) => {
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
    const isApplied = appliedJobs.some((appliedJob) => appliedJob.id === job.id);

    if (isApplied) {
      alert(`You have already applied for "${job.title}".`);
    } else {
      appliedJobs.push(job);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      alert(`Application for "${job.title}" was successful!`);
    }
  };

  return (
    <div className="skeuo-page p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold">Remote Jobs</h1>

        <div className="grid gap-4">
          {remoteJobs.map((job) => (
            <div key={job.id} className="skeuo-card flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-slate-600">
                  {job.company} | {job.time}
                </p>
              </div>
              <button onClick={() => handleApply(job)} className="skeuo-btn skeuo-btn-primary px-4 py-2 text-sm text-white">
                Apply
              </button>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/jobs" className="skeuo-btn skeuo-btn-secondary px-4 py-2 text-sm">
            Explore all jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Remote;
