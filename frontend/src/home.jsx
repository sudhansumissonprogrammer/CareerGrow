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

const formatMetric = (value) => {
  if (!value || value <= 0) return "0";
  if (value >= 1000) return `${Math.floor(value / 1000)}k+`;
  return `${value}+`;
};

function Home() {
  const navigate = useNavigate();
  const { keyword, setKeyword, location, setLocation } = useJobSearch();
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [siteStats, setSiteStats] = useState({ companies: 0, students: 0, jobSeekers: 0 });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsResponse, companiesResponse, statsResponse] = await Promise.all([
          apiRequest("/api/v1/job/get"),
          apiRequest("/api/v1/company/get"),
          apiRequest("/api/v1/stats"),
        ]);

        setJobs(jobsResponse.jobs || []);
        setCompanies(companiesResponse.companies || []);
        setSiteStats({
          companies: Number(statsResponse.companies) || 0,
          students: Number(statsResponse.students) || 0,
          jobSeekers: Number(statsResponse.jobSeekers) || 0,
        });
      } catch {
        setJobs([]);
        setCompanies([]);
        setSiteStats({ companies: 0, students: 0, jobSeekers: 0 });
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
      <div className="page-wrap">
        <section 
          className="page-hero relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80")',
            backgroundAttachment: 'fixed'
          }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 w-full text-center px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 max-w-4xl mx-auto leading-tight">
              Find Jobs That Match Your Skills
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Apply to verified jobs from startups to top companies – faster and smarter.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto mb-12">
              <input
                className="flex-1 px-6 py-4 rounded-lg bg-white/95 placeholder-slate-400 text-slate-900 font-medium focus:outline-none"
                placeholder="Job title or keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <input
                className="flex-1 px-6 py-4 rounded-lg bg-white/95 placeholder-slate-400 text-slate-900 font-medium focus:outline-none"
                placeholder="Location or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button 
                className="px-8 py-4 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition whitespace-nowrap"
                onClick={() => navigate("/jobs")}
              >
                Search Jobs
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/90 backdrop-blur rounded-lg p-8">
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900">{formatMetric(siteStats.jobSeekers)}</p>
                <p className="text-slate-600 font-medium mt-2">Active Job Seekers</p>
              </div>
              <div className="bg-white/90 backdrop-blur rounded-lg p-8">
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900">{formatMetric(siteStats.companies)}</p>
                <p className="text-slate-600 font-medium mt-2">Hiring Companies</p>
              </div>
              <div className="bg-white/90 backdrop-blur rounded-lg p-8">
                <p className="text-3xl md:text-4xl font-extrabold text-slate-900">Fast</p>
                <p className="text-slate-600 font-medium mt-2">Hiring Process</p>
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
