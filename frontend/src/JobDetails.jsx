import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "./api/client";
import { useAuth } from "./context/AuthContext";
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

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiRequest(`/api/v1/job/get/${jobId}`);
        setJob(response.job || null);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "user") {
      showError("Only job seeker accounts can apply to jobs.");
      return;
    }

    try {
      setApplyLoading(true);
      const response = await apiRequest(`/api/v1/application/apply/${jobId}`, { method: "POST" });
      showSuccess(response.message || "Application submitted successfully.");
    } catch (apiError) {
      showError(apiError.message);
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="skeuo-page">
        <div className="page-wrap pt-28">
          <div className="skeuo-surface p-8 text-center text-slate-600">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="skeuo-page">
        <div className="page-wrap pt-28">
          <div className="skeuo-surface p-8 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Job not found</h1>
            <p className="mt-3 text-slate-600">{error || "The selected job is unavailable."}</p>
            <Link to="/jobs" className="skeuo-btn skeuo-btn-primary mt-6 inline-flex px-6 py-3 text-sm text-white">
              Back to jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const companyName = job.company?.name || "Unknown Company";

  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <section className="page-hero px-6 py-8 md:px-10 md:py-12">
          <Link to="/jobs" className="page-kicker">
            Back to jobs
          </Link>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.25em] text-slate-500">{companyName}</p>
          <h1 className="section-title mt-4 max-w-4xl">{job.title}</h1>
          <p className="section-subtitle mt-5">
            {job.location} · {job.jobtype || "Full Time"} · {job.experience || 0}+ years experience · {job.position || 1} open positions
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="metric-card p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Salary</p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">{formatSalary(job.salary)}</p>
            </div>
            <div className="metric-card p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Location</p>
              <p className="mt-2 text-xl font-extrabold text-slate-900">{job.location}</p>
            </div>
            <div className="metric-card p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Company</p>
              <p className="mt-2 text-xl font-extrabold text-slate-900">{companyName}</p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="skeuo-surface p-7">
            <h2 className="text-2xl font-extrabold text-slate-900">About this role</h2>
            <p className="mt-4 text-sm leading-8 text-slate-600">{job.description}</p>

            <div className="mt-8">
              <h3 className="text-xl font-extrabold text-slate-900">Core requirements</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {(job.requirements || []).map((tag) => (
                  <span key={tag} className="skeuo-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["Job Type", job.jobtype || "Full Time"],
                ["Experience", `${job.experience || 0}+ years`],
                ["Open Positions", String(job.position || 1)],
                ["Company", companyName],
              ].map(([label, value]) => (
                <div key={label} className="skeuo-card-inset p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-extrabold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="skeuo-surface p-6">
              <p className="page-kicker">Apply Now</p>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Ready to move?</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                If this role matches your direction, you can apply directly from here using your account and saved resume.
              </p>
              <button onClick={handleApply} disabled={applyLoading} className="skeuo-btn skeuo-btn-primary mt-6 w-full px-5 py-3.5 text-sm text-white">
                {applyLoading ? "Applying..." : "Apply for this role"}
              </button>
            </div>

            <div className="skeuo-surface p-6">
              <h3 className="text-xl font-extrabold text-slate-900">Role snapshot</h3>
              <div className="mt-5 grid gap-3">
                {[
                  ["Compensation", formatSalary(job.salary)],
                  ["Location", job.location],
                  ["Company", companyName],
                ].map(([label, value]) => (
                  <div key={label} className="skeuo-card-inset p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">{label}</p>
                    <p className="mt-2 text-base font-extrabold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

export default JobDetails;
