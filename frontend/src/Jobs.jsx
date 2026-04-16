import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "./api/client";
import { useAuth } from "./context/AuthContext";
import { useJobSearch } from "./JobSearchContext";
import { useToast } from "./ToastContext.jsx";

const formatSalary = (salary) => {
  const amount = Number(salary);
  if (!Number.isFinite(amount) || amount <= 0) return "Salary not specified";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPosted = (value) => {
  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return "Recently posted";
  const diffMs = Date.now() - createdAt.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
};

const detectCategory = (job) => {
  const text = `${job.title || ""} ${job.description || ""} ${job.location || ""} ${job.jobtype || ""}`.toLowerCase();
  if (text.includes("frontend") || text.includes("react")) return "Frontend";
  if (text.includes("backend") || text.includes("node")) return "Backend";
  if (text.includes("intern")) return "Internship";
  if (text.includes("remote")) return "Remote";
  if (text.includes("design")) return "Design";
  if (text.includes("data")) return "Data";
  if (text.includes("marketing")) return "Marketing";
  return "All";
};

function Jobs() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { keyword, location } = useJobSearch();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingJobId, setApplyingJobId] = useState("");
  const selectedCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");
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

  const availableCategories = useMemo(() => {
    const categories = new Set(["All"]);
    jobs.forEach((job) => {
      const detected = detectCategory(job);
      if (detected !== "All") categories.add(detected);
      if (String(job.location || "").toLowerCase().includes("remote")) categories.add("Remote");
    });
    return Array.from(categories);
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const jobCompany = job.company?.name || "Unknown Company";
      const category = detectCategory(job);
      const titleMatches = !normalizedKeyword || String(job.title || "").toLowerCase().includes(normalizedKeyword);
      const companyMatches = !normalizedKeyword || jobCompany.toLowerCase().includes(normalizedKeyword);
      const locationMatches = !normalizedLocation || String(job.location || "").toLowerCase().includes(normalizedLocation);
      const categoryMatches =
        selectedCategory === "All" ||
        category === selectedCategory ||
        (selectedCategory === "Remote" && String(job.location || "").toLowerCase().includes("remote"));

      return (titleMatches || companyMatches) && locationMatches && categoryMatches;
    });
  }, [jobs, keyword, location, selectedCategory]);

  const handleApply = async (jobId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "user") {
      showError("Only job seeker accounts can apply to jobs.");
      return;
    }

    try {
      setApplyingJobId(jobId);
      const response = await apiRequest(`/api/v1/application/apply/${jobId}`, { method: "POST" });
      showSuccess(response.message || "Application submitted successfully.");
    } catch (apiError) {
      showError(apiError.message);
    } finally {
      setApplyingJobId("");
    }
  };

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === "All") nextParams.delete("category");
    else nextParams.set("category", category);
    setSearchParams(nextParams);
  };

  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <section className="page-hero px-6 py-8 md:px-10 md:py-12">
          <span className="page-kicker">Open Roles</span>
          <h1 className="section-title mt-5 max-w-3xl">A sharper browse experience for live jobs.</h1>
          <p className="section-subtitle mt-5">
            Scan the newest openings, filter by category, and jump into role details without losing context.
          </p>
        </section>


        <section className="mt-8">
          <div className="mb-5 flex flex-wrap gap-3">
            {availableCategories.map((category) => (
              <button key={category} onClick={() => handleCategoryChange(category)} data-active={selectedCategory === category} className="skeuo-chip px-4 py-2 text-sm">
                {category}
              </button>
            ))}
          </div>

          {loading && <div className="skeuo-surface p-8 text-center text-slate-600">Loading live jobs...</div>}
          {error && <div className="skeuo-surface p-8 text-center text-red-600">{error}</div>}

          {!loading && !error && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((job) => {
                const companyName = job.company?.name || "Unknown Company";
                return (
                  <article key={job._id} className="skeuo-card skeuo-card-hover flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">{companyName}</p>
                        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900">{job.title}</h2>
                      </div>
                      <span className="rounded-full bg-[rgba(15,39,65,0.08)] px-4 py-2 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-slate-700">
                        {job.jobtype || "Full Time"}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">{job.description?.slice(0, 120) || "Role description coming soon."}</p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="skeuo-card-inset p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Location</p>
                        <p className="mt-2 text-sm font-bold text-slate-900">{job.location}</p>
                      </div>
                      <div className="skeuo-card-inset p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Posted</p>
                        <p className="mt-2 text-sm font-bold text-slate-900">{formatPosted(job.createdAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(job.requirements || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="skeuo-chip">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="skeuo-card-inset p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Compensation</p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatSalary(job.salary)}</p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <button onClick={() => navigate(`/jobs/${job._id}`)} className="skeuo-btn skeuo-btn-secondary px-4 py-3 text-sm">
                          View
                        </button>
                        <button onClick={() => handleApply(job._id)} disabled={applyingJobId === job._id} className="skeuo-btn skeuo-btn-primary px-4 py-3 text-sm text-white">
                          {applyingJobId === job._id ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !error && filteredJobs.length === 0 && <div className="skeuo-surface p-8 text-center text-slate-600">No live jobs found for this search and category.</div>}
        </section>
      </div>
    </div>
  );
}

export default Jobs;
