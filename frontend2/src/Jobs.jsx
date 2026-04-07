import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "./api/client";

const CATEGORY_CONFIG = [
  { key: "it", title: "IT Jobs", path: "/jobs/it", color: "bg-blue-100", icon: "??" },
  { key: "sales", title: "Sales Jobs", path: "/jobs/sales", color: "bg-green-100", icon: "??" },
  { key: "marketing", title: "Marketing Jobs", path: "/jobs/marketing", color: "bg-yellow-100", icon: "??" },
  { key: "data-science", title: "Data Science Jobs", path: "/jobs/data-science", color: "bg-purple-100", icon: "??" },
  { key: "engineering", title: "Engineering Jobs", path: "/jobs/engineering", color: "bg-pink-100", icon: "??" },
];

const detectCategory = (job) => {
  const text = `${job.title || ""} ${job.description || ""} ${job.jobtype || ""}`.toLowerCase();
  if (text.includes("sales")) return "sales";
  if (text.includes("marketing")) return "marketing";
  if (text.includes("data") || text.includes("ml") || text.includes("ai")) return "data-science";
  if (text.includes("engineer") || text.includes("mechanical") || text.includes("electrical")) return "engineering";
  return "it";
};

function Jobs() {
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
  }, []);

  const categoryCounts = useMemo(() => {
    return jobs.reduce((acc, job) => {
      const key = detectCategory(job);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [jobs]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Explore Jobs by Category</h1>
          <p className="text-slate-600 font-medium">Find the perfect role for you from live backend data.</p>
        </div>

        {loading && <p className="text-center text-slate-600">Loading jobs...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORY_CONFIG.map((category) => (
              <Link
                key={category.key}
                to={category.path}
                className={`${category.color} p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200 group flex flex-col rounded-xl`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 bg-white/50 border-2 border-slate-900 flex items-center justify-center text-3xl rounded-lg">
                    {category.icon}
                  </div>
                  <span className="bg-white/50 border-2 border-slate-900 text-slate-900 text-xs px-3 py-1 rounded-md font-bold">
                    {categoryCounts[category.key] || 0} Jobs
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition flex-grow">
                  {category.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Jobs;
