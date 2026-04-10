import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "./api/client";
import { useJobSearch } from "./JobSearchContext";

const formatSalary = (salary) => {
  const amount = Number(salary);
  if (!Number.isFinite(amount) || amount <= 0) return "Salary not specified";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const detectCategory = (job) => {
  const text = `${job.title || ""} ${job.description || ""} ${job.location || ""}`.toLowerCase();
  if (text.includes("design")) return "Design";
  if (text.includes("frontend")) return "Frontend";
  if (text.includes("backend")) return "Backend";
  if (text.includes("marketing")) return "Marketing";
  if (text.includes("data")) return "Data";
  if (text.includes("remote")) return "Remote";
  return "General";
};

function Home() {
  const navigate = useNavigate();
  const { keyword, setKeyword, location, setLocation } = useJobSearch();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsResponse, companiesResponse] = await Promise.all([
          apiRequest("/api/v1/job/get"),
          apiRequest("/api/v1/company/get"),
        ]);
        setJobs(jobsResponse.jobs || []);
        setCompanies(companiesResponse.companies || []);
      } catch {
        setJobs([]);
        setCompanies([]);
      }
    };

    loadHomeData();
  }, []);

  const popularCategories = useMemo(() => {
    const categoryMap = jobs.reduce((acc, job) => {
      const category = detectCategory(job);
      if (category !== "General") acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryMap)
      .slice(0, 6)
      .map(([name, count]) => ({ name, jobs: `${count} live roles` }));
  }, [jobs]);

  const featuredRoles = jobs.slice(0, 3).map((job) => ({
    id: job._id,
    title: job.title,
    company: job.company?.name || "Unknown Company",
    salary: formatSalary(job.salary),
    location: job.location,
  }));

  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <section className="page-hero px-6 py-8 md:px-10 md:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <span className="page-kicker">Live Career Network</span>
              <h1 className="section-title mt-5 max-w-3xl">
                Designed for ambitious candidates and fast-moving teams.
              </h1>
              <p className="section-subtitle mt-5">
                Discover verified openings, apply in minutes, and manage your progress in one refined workspace built around
                real backend data.
              </p>

              <div className="skeuo-banner mt-8 flex flex-col gap-3 p-4 md:flex-row md:items-center">
                <input
                  className="skeuo-input w-full"
                  placeholder="Search job title or keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <input
                  className="skeuo-input w-full md:max-w-xs"
                  placeholder="Location or Remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button className="skeuo-btn skeuo-btn-primary px-6 py-3 text-sm text-white" onClick={() => navigate("/jobs")}>
                  Explore Jobs
                </button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="metric-card p-4">
                  <p className="text-3xl font-extrabold">{jobs.length}</p>
                  <p className="mt-1 text-sm text-slate-600">Open roles synced from backend</p>
                </div>
                <div className="metric-card p-4">
                  <p className="text-3xl font-extrabold">{companies.length}</p>
                  <p className="mt-1 text-sm text-slate-600">Companies hiring right now</p>
                </div>
                <div className="metric-card p-4">
                  <p className="text-3xl font-extrabold">24h</p>
                  <p className="mt-1 text-sm text-slate-600">A typical recruiter reply window</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="skeuo-card p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-500">Weekly Momentum</p>
                <div className="mt-5 grid gap-3">
                  {[
                    ["Applications sent", "128"],
                    ["Interviews scheduled", "34"],
                    ["Recruiters active", "72"],
                  ].map(([label, value]) => (
                    <div key={label} className="skeuo-card-inset flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-slate-600">{label}</span>
                      <span className="text-lg font-extrabold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="skeuo-card p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-500">Why It Feels Better</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                  <li>Applications, jobs, companies, and recruiter actions are all connected to the backend.</li>
                  <li>The interface is optimized for scanning, focus, and quick decision-making.</li>
                  <li>Both job seekers and recruiters get role-specific dashboards and flows.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Create a profile", "Register once and keep your account, resume, and applications in one place."],
            ["Search smarter", "Use keywords, category filters, and location input to narrow the right roles."],
            ["Move faster", "Recruiters can post roles, review applicants, and update statuses from the dashboard."],
          ].map(([title, text]) => (
            <div key={title} className="skeuo-card p-6">
              <p className="page-kicker">Step</p>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="page-kicker">Browse Focus Areas</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Popular categories</h2>
            </div>
            <Link to="/jobs" className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {popularCategories.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(`/jobs?category=${item.name}`)}
                className="skeuo-card skeuo-card-hover flex items-center justify-between p-6 text-left"
              >
                <div>
                  <p className="text-xl font-extrabold text-slate-900">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.jobs}</p>
                </div>
                <span className="rounded-full bg-[rgba(15,39,65,0.08)] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-700">
                  Open
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="skeuo-surface p-7">
            <p className="page-kicker">Featured Openings</p>
            <div className="mt-5 grid gap-4">
              {featuredRoles.length > 0 ? (
                featuredRoles.map((job) => (
                  <div key={job.id} className="skeuo-card-inset flex flex-wrap items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-500">{job.company}</p>
                      <h3 className="mt-2 text-xl font-extrabold text-slate-900">{job.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {job.location} · {job.salary}
                      </p>
                    </div>
                    <button className="skeuo-btn skeuo-btn-primary px-5 py-2.5 text-sm text-white" onClick={() => navigate(`/jobs/${job.id}`)}>
                      View Role
                    </button>
                  </div>
                ))
              ) : (
                <div className="skeuo-card p-6 text-slate-600">No featured roles yet.</div>
              )}
            </div>
          </div>

          <div className="skeuo-surface p-7">
            <p className="page-kicker">Trusted Teams</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Companies hiring on CareerGrow</h2>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {companies.slice(0, 6).map((company) => (
                <div key={company._id} className="skeuo-card-inset p-4">
                  <p className="text-base font-extrabold text-slate-900">{company.name}</p>
                  <p className="mt-2 text-sm text-slate-500">{company.location || "Location flexible"}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="skeuo-surface p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="page-kicker">Ready To Move</p>
                <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Start with a profile that looks serious.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Build momentum from the first screen with a frontend that now feels premium, organized, and built for real hiring activity.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="skeuo-btn skeuo-btn-primary px-6 py-3 text-sm text-white">
                  Create Account
                </Link>
                <Link to="/dashboard" className="skeuo-btn skeuo-btn-secondary px-6 py-3 text-sm">
                  Open Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
