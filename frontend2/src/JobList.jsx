import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "./api/client";

const matchCategory = (job, category) => {
  const text = `${job.title || ""} ${job.description || ""} ${job.jobtype || ""}`.toLowerCase();
  const rules = {
    sales: ["sales", "account", "business development"],
    marketing: ["marketing", "seo", "content"],
    "data-science": ["data", "machine learning", "ai", "analytics"],
    engineering: ["engineer", "mechanical", "electrical", "civil", "robotics"],
    it: ["developer", "frontend", "backend", "full stack", "software", "devops", "it"],
  };

  const terms = rules[category] || [];
  if (terms.length === 0) return true;
  return terms.some((term) => text.includes(term));
};

function JobList() {
  const { category } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/api/v1/job/get");
        setJobs(response.jobs || []);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [category]);

  const filteredJobs = useMemo(() => jobs.filter((job) => matchCategory(job, category)), [jobs, category]);

  const formatCategory = (value) => {
    if (!value) return "";
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const colors = ["bg-blue-50", "bg-green-50", "bg-yellow-50", "bg-purple-50", "bg-pink-50"];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
            &larr; Back to Categories
          </Link>
          <h1 className="text-4xl font-black text-slate-900">{formatCategory(category)} Jobs</h1>
          <p className="text-slate-600 font-medium mt-2">Showing live jobs from backend API.</p>
        </div>

        {loading && <p className="text-slate-600">Loading jobs...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="space-y-6">
          {!loading && !error && filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <Link to={`/jobs/${category}/${job._id}`} key={job._id} className="block">
                <div
                  className={`group ${colors[index % colors.length]} p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 rounded-xl`}
                >
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-white border-2 border-slate-900 rounded-lg flex items-center justify-center text-2xl font-bold shadow-sm">
                          {(job.company?.name || "C").charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{job.title}</h3>
                          <p className="text-slate-700 font-semibold text-sm">{job.company?.name || "Unknown Company"}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-white border-2 border-slate-900 text-slate-900 text-xs px-3 py-1 rounded-full font-bold">
                          {job.jobtype}
                        </span>
                        <span className="text-xs text-slate-600 font-medium">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700 mb-2 font-medium">
                      <span>{job.location}</span>
                      <span>Salary: {job.salary}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            !loading &&
            !error && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
                <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
                <p className="text-slate-500 mt-1">No jobs available for this category right now.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default JobList;
