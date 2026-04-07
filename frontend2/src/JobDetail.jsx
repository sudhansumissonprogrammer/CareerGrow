import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "./api/client";

function JobDetail() {
  const { category, id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`/api/v1/job/get/${id}`);
        setJob(response.job);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplyLoading(true);
      setApplyMessage("");
      const response = await apiRequest(`/api/v1/applications/apply/${id}`, { method: "POST" });
      setApplyMessage(response.message || "Applied successfully");
    } catch (apiError) {
      setApplyMessage(apiError.message);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading job...</div>;
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Job not found</h2>
          <p className="text-red-600 mt-2">{error || "No data"}</p>
          <Link to="/jobs" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-8">
        <Link to={`/jobs/${category}`} className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          &larr; Back to {category} Jobs
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{job.title}</h1>
            <p className="text-xl text-slate-700 font-bold">{job.company?.name || "Unknown Company"}</p>
          </div>
          <div className="h-16 w-16 bg-slate-100 border-2 border-slate-900 rounded-lg flex items-center justify-center text-3xl font-bold shrink-0">
            {(job.company?.name || "C").charAt(0)}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold border border-blue-200">{job.jobtype}</span>
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-200">Salary: {job.salary}</span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-bold border border-purple-200">{job.location}</span>
        </div>

        <div className="prose max-w-none text-slate-600 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Job Description</h3>
          <p className="mb-4 leading-relaxed">{job.description}</p>

          <h4 className="text-lg font-bold text-slate-900">Requirements</h4>
          <ul className="list-disc pl-6">
            {(job.requirements || []).map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>

          <button
            onClick={handleApply}
            disabled={applyLoading}
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg mt-4 disabled:opacity-70"
          >
            {applyLoading ? "Applying..." : "Apply for this Position"}
          </button>
          {applyMessage && <p className="mt-3 text-sm text-slate-700">{applyMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
