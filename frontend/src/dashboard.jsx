import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, buildAssetUrl } from "./api/client";
import { useAuth } from "./context/AuthContext";

const formatSalary = (salary) => {
  if (!salary || typeof salary !== 'object') return "Salary not specified";
  const min = Number(salary.min);
  const max = Number(salary.max);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0) return "Salary not specified";
  if (min === max) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(min);
  }
  return `${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(min)} - ${new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(max)}`;
};

const StatCard = ({ label, value, note }) => (
  <div className="skeuo-card p-5 flex flex-col justify-between h-full">
    <div>
      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
    <p className="mt-4 text-sm text-slate-600 border-t border-slate-100 pt-3">{note}</p>
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [userApplications, setUserApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [postingJob, setPostingJob] = useState(false);
  const [registeringCompany, setRegisteringCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({ companyname: "" });
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobtype: "Full Time",
    experience: "0",
    position: "1",
    company: "",
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) {
        setPageLoading(false);
        return;
      }

      try {
        setPageLoading(true);
        setError("");
        if (user.role === "user") {
          const [applicationsResponse, jobsResponse] = await Promise.all([
            apiRequest("/api/v1/application/my"),
            apiRequest("/api/v1/job/get"),
          ]);
          setUserApplications(applicationsResponse.applications || []);
          setRecommendedJobs((jobsResponse.jobs || []).slice(0, 4));
        } else {
          const recruiterJobsResponse = await apiRequest("/api/v1/job/getadminjobs");
          setRecruiterJobs(recruiterJobsResponse.jobs || []);
        }
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setPageLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      setRegisteringCompany(true);
      const response = await apiRequest("/api/v1/company/register", {
        method: "POST",
        body: JSON.stringify(companyForm),
      });
      setStatusMessage(response.message || "Company registered successfully.");
      setCompanyForm({ companyname: "" });
    } catch (apiError) {
      setStatusMessage(apiError.message);
    } finally {
      setRegisteringCompany(false);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      setPostingJob(true);
      const response = await apiRequest("/api/v1/job/post", {
        method: "POST",
        body: JSON.stringify(jobForm),
      });
      setStatusMessage(response.message || "Job posted successfully.");
      setJobForm({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobtype: "Full Time",
        experience: "0",
        position: "1",
        company: "",
      });
      const recruiterJobsResponse = await apiRequest("/api/v1/job/getadminjobs");
      setRecruiterJobs(recruiterJobsResponse.jobs || []);
      setActiveTab("my-jobs");
    } catch (apiError) {
      setStatusMessage(apiError.message);
    } finally {
      setPostingJob(false);
      setTimeout(() => setStatusMessage(""), 4000);
    }
  };

  const loadApplicants = async (jobId) => {
    try {
      const response = await apiRequest(`/api/v1/application/job/${jobId}`);
      setJobApplicants((current) => ({
        ...current,
        [jobId]: response.applications || [],
      }));
    } catch (apiError) {
      setStatusMessage(apiError.message);
    }
  };

  const updateApplicationStatus = async (applicationId, status, jobId) => {
    try {
      const response = await apiRequest(`/api/v1/application/status/${applicationId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setStatusMessage(response.message || "Status updated.");
      await loadApplicants(jobId);
    } catch (apiError) {
      setStatusMessage(apiError.message);
    } finally {
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="skeuo-page">
        <div className="page-wrap pt-28">
          <div className="skeuo-surface p-8 text-center text-slate-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="skeuo-page">
        <div className="page-wrap pt-28">
          <div className="skeuo-surface p-8 text-center">
            <h1 className="text-2xl font-extrabold text-slate-900">Please log in to access your dashboard.</h1>
            <Link to="/login" className="skeuo-btn skeuo-btn-primary mt-6 inline-flex px-6 py-3 text-sm text-white">
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isUser = user.role === "user";

  const userTabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'applications', label: 'My Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { id: 'recommendations', label: 'Recommended Jobs', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { id: 'profile', label: 'Profile Summary', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
  ];

  const recruiterTabs = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'my-jobs', label: 'My Job Listings', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { id: 'post-job', label: 'Post a New Job', icon: 'M12 4v16m8-8H4' },
    { id: 'register-company', label: 'Register Company', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
  ];

  const activeTabsList = isUser ? userTabs : recruiterTabs;

  return (
    <div className="skeuo-page min-h-screen pb-16">
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-72 shrink-0 md:sticky md:top-28 md:h-[calc(100vh-140px)] flex flex-col gap-4 z-10">
          <div className="skeuo-surface p-6 flex flex-col h-full rounded-[28px]">
            <div className="flex items-center justify-between md:mb-8">
              <div className="hidden md:block">
                <p className="text-sm font-extrabold text-slate-900 truncate">{user.fullname}</p>
                <p className="text-xs font-bold text-brand uppercase tracking-widest mt-1">{isUser ? "Candidate" : "Recruiter"}</p>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 md:hidden">Dashboard Menu</h2>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="skeuo-btn skeuo-btn-secondary p-2.5 md:hidden"
                aria-label="Toggle Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>
            </div>
            
            <nav className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2 flex-1 overflow-y-auto mt-6 md:mt-0 pr-2`}>
              {activeTabsList.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                    activeTab === tab.id 
                      ? "bg-slate-900 text-white shadow-[0_8px_16px_rgba(15,39,65,0.2)]" 
                      : "text-slate-600 hover:bg-[rgba(255,255,255,0.6)] hover:text-slate-900"
                  }`}
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
            
            <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col gap-2 mt-6 pt-6 border-t border-[rgba(16,32,51,0.08)]`}>
              <button type="button" onClick={refreshUser} className="flex items-center gap-3 text-left px-4 py-3 text-sm font-extrabold text-slate-600 hover:bg-[rgba(255,255,255,0.6)] hover:text-slate-900 rounded-2xl transition-all">
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Refresh Data
              </button>
              <button type="button" onClick={handleLogout} className="flex items-center gap-3 text-left px-4 py-3 text-sm font-extrabold text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          <section className="page-hero px-6 py-10 md:px-12 md:py-12 rounded-[32px]">
            <div className="max-w-3xl relative z-10">
              <span className="page-kicker bg-white/80 backdrop-blur shadow-sm">
                {activeTabsList.find(t => t.id === activeTab)?.label || "Dashboard"}
              </span>
              <h1 className="section-title mt-5 text-4xl md:text-5xl leading-tight">
                {activeTab === 'overview' ? `Welcome back, ${user.fullname.split(' ')[0]}.` : activeTabsList.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="section-subtitle mt-4 text-slate-700/80 font-medium">
                {activeTab === 'overview' 
                  ? (isUser ? "Track your applications, keep your resume handy, and move through active opportunities." : "Run hiring from one command center: companies, live roles, and applicants.")
                  : "Manage this section below to keep your portal up-to-date and organized."}
              </p>
            </div>
          </section>

          {/* Status Notifications */}
          <div className="relative z-20">
            {statusMessage && (
              <div className="mb-6 rounded-2xl bg-[#daf5e8] border border-[#a3e3c6] px-5 py-4 text-sm font-bold text-[#15573b] shadow-sm flex items-center justify-between">
                <span>{statusMessage}</span>
                <button onClick={() => setStatusMessage("")} className="p-1 hover:bg-[#a3e3c6]/40 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            )}
            {error && (
              <div className="mb-6 rounded-2xl bg-[#ffe2dc] border border-[#ffb6a8] px-5 py-4 text-sm font-bold text-[#9b3323] shadow-sm flex items-center justify-between">
                <span>{error}</span>
                <button onClick={() => setError("")} className="p-1 hover:bg-[#ffb6a8]/40 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            )}
          </div>

          {/* User Sections Rendering */}
          {isUser && (
            <div className="flex flex-col gap-6">
              {activeTab === 'overview' && (
                <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard label="Applications Sent" value={userApplications.length} note="Roles you’ve applied to so far." />
                  <StatCard label="Resume Status" value={user.resumeUrl ? "Uploaded" : "Missing"} note="Ensure your resume is current." />
                  <StatCard label="Account Type" value="Candidate" note="Access to job seeking features." />
                </section>
              )}

              {(activeTab === 'overview' || activeTab === 'applications') && (
                <div className="skeuo-surface p-6 md:p-8 rounded-[32px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-900">My applications</h2>
                    {activeTab === 'overview' && userApplications.length > 0 && (
                      <button onClick={() => setActiveTab('applications')} className="text-sm font-bold text-brand hover:underline">View all</button>
                    )}
                  </div>
                  <div className="grid gap-4">
                    {userApplications.length > 0 ? (
                      (activeTab === 'overview' ? userApplications.slice(0, 3) : userApplications).map((application) => (
                        <div key={application._id} className="skeuo-card-inset p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-[24px]">
                          <div>
                            <p className="text-xl font-extrabold text-slate-900">{application.jobId?.title || "Untitled Job"}</p>
                            <p className="mt-1.5 text-sm font-bold text-slate-500">{application.jobId?.company?.name || "Unknown Company"}</p>
                          </div>
                          <span className={`shrink-0 px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-widest border ${
                            application.status === 'Accepted' ? 'bg-[#daf5e8] text-[#15573b] border-[#a3e3c6]' :
                            application.status === 'Rejected' ? 'bg-[#ffe2dc] text-[#9b3323] border-[#ffb6a8]' :
                            'bg-[#fff4d1] text-[#997300] border-[#ffe082]'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="skeuo-card-inset p-8 text-center rounded-[24px]">
                        <p className="text-slate-500 font-bold mb-4">No applications yet.</p>
                        <Link to="/jobs" className="skeuo-btn skeuo-btn-primary px-6 py-2.5 text-sm inline-block">Explore Jobs</Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(activeTab === 'overview' || activeTab === 'recommendations') && (
                <div className="skeuo-surface p-6 md:p-8 rounded-[32px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-900">Recommended roles</h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    {recommendedJobs.length > 0 ? (
                      recommendedJobs.map((job) => (
                        <div key={job._id} className="skeuo-card-inset p-6 flex flex-col justify-between h-full rounded-[24px]">
                          <div>
                            <p className="text-lg font-extrabold text-slate-900 line-clamp-1">{job.title}</p>
                            <p className="mt-1.5 text-sm font-bold text-slate-500">{job.company?.name || "Unknown Company"}</p>
                            <div className="mt-4 inline-flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-lg border border-[rgba(16,32,51,0.06)]">
                              <span className="text-sm font-extrabold text-brand">{formatSalary(job.salary)}</span>
                            </div>
                          </div>
                          <Link to={`/jobs/${job._id}`} className="mt-6 skeuo-btn skeuo-btn-secondary py-3 text-center text-sm font-extrabold w-full block rounded-xl">
                            View Details
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="skeuo-card-inset p-8 text-slate-500 font-bold col-span-full text-center rounded-[24px]">
                        No recommendations available yet based on your profile.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(activeTab === 'profile') && (
                <div className="skeuo-surface p-6 md:p-8 rounded-[32px]">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Profile Details</h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="skeuo-card-inset p-6 rounded-[24px]">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Full Name</p>
                      <p className="mt-3 text-lg font-extrabold text-slate-900 truncate">{user.fullname}</p>
                    </div>
                    <div className="skeuo-card-inset p-6 rounded-[24px]">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Email Address</p>
                      <p className="mt-3 text-lg font-extrabold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <div className="skeuo-card-inset p-6 rounded-[24px]">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Phone Number</p>
                      <p className="mt-3 text-lg font-extrabold text-slate-900">{user.phonenumber || "Not provided"}</p>
                    </div>
                    <div className="skeuo-card-inset p-6 rounded-[24px] sm:col-span-2 lg:col-span-3">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Resume Document</p>
                      {user.resumeUrl ? (
                        <div className="mt-4 flex items-center gap-4">
                          <a href={buildAssetUrl(user.resumeUrl)} target="_blank" rel="noreferrer" className="skeuo-btn skeuo-btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={ "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"} /></svg>
                            View / Download Resume
                          </a>
                          <span className="text-sm font-bold text-slate-500">{user.resumeOriginalName || "resume.pdf"}</span>
                        </div>
                      ) : (
                        <p className="mt-3 text-sm font-bold text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200 inline-block">No resume uploaded to your profile.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recruiter Sections Rendering */}
          {!isUser && (
            <div className="flex flex-col gap-6">
              {activeTab === 'overview' && (
                <section className="grid gap-5 sm:grid-cols-3">
                  <StatCard label="Active Listings" value={recruiterJobs.length} note="Jobs currently posted." />
                  <StatCard label="Loaded Applicants" value={Object.values(jobApplicants).reduce((total, list) => total + list.length, 0)} note="Applicants tracking in this session." />
                  <StatCard label="Account Type" value="Recruiter" note="Hiring dashboard enabled." />
                </section>
              )}

              {(activeTab === 'overview' || activeTab === 'register-company') && (
                <div className="skeuo-surface p-6 md:p-8 rounded-[32px]">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Register Company</h2>
                  <p className="text-slate-500 text-sm mb-6">Add a new company profile to associate jobs with.</p>
                  <form onSubmit={handleCompanySubmit} className="flex flex-col sm:flex-row gap-4">
                    <input 
                      name="companyname" 
                      value={companyForm.companyname} 
                      onChange={(e) => setCompanyForm({ companyname: e.target.value })} 
                      placeholder="Enter company name..." 
                      className="skeuo-input flex-1 text-base py-3.5" 
                      required 
                    />
                    <button type="submit" disabled={registeringCompany} className="skeuo-btn skeuo-btn-primary px-8 py-3.5 text-sm font-extrabold whitespace-nowrap">
                      {registeringCompany ? "Registering..." : "Register Company"}
                    </button>
                  </form>
                </div>
              )}

              {(activeTab === 'overview' || activeTab === 'post-job') && (
                <div className="skeuo-surface p-6 md:p-8 rounded-[32px]">
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Post a New Job</h2>
                  <p className="text-slate-500 text-sm mb-6">Create a new job listing to attract candidates.</p>
                  
                  <form onSubmit={handleJobSubmit} className="space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Job Title</label>
                        <input name="title" value={jobForm.title} onChange={(e) => setJobForm((c) => ({ ...c, title: e.target.value }))} placeholder="e.g. Senior Frontend Developer" className="skeuo-input" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Company ID</label>
                        <input name="company" value={jobForm.company} onChange={(e) => setJobForm((c) => ({ ...c, company: e.target.value }))} placeholder="Paste company ID here" className="skeuo-input" required />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Job Description</label>
                      <textarea name="description" value={jobForm.description} onChange={(e) => setJobForm((c) => ({ ...c, description: e.target.value }))} placeholder="Describe the role, responsibilities, and perks..." rows={4} className="skeuo-input resize-y" required />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Requirements</label>
                      <input name="requirements" value={jobForm.requirements} onChange={(e) => setJobForm((c) => ({ ...c, requirements: e.target.value }))} placeholder="React, Node.js, TypeScript (Comma separated)" className="skeuo-input" required />
                    </div>
                    
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Salary (Annual)</label>
                        <input name="salary" value={jobForm.salary} onChange={(e) => setJobForm((c) => ({ ...c, salary: e.target.value }))} placeholder="e.g. 1200000" type="number" className="skeuo-input" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Location</label>
                        <input name="location" value={jobForm.location} onChange={(e) => setJobForm((c) => ({ ...c, location: e.target.value }))} placeholder="e.g. Remote, Bangalore" className="skeuo-input" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Job Type</label>
                        <select name="jobtype" value={jobForm.jobtype} onChange={(e) => setJobForm((c) => ({ ...c, jobtype: e.target.value }))} className="skeuo-input bg-white" required>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Experience Required (Years)</label>
                        <input name="experience" value={jobForm.experience} onChange={(e) => setJobForm((c) => ({ ...c, experience: e.target.value }))} placeholder="e.g. 3" type="number" className="skeuo-input" required />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold uppercase tracking-widest text-slate-500 ml-1">Open Positions</label>
                        <input name="position" value={jobForm.position} onChange={(e) => setJobForm((c) => ({ ...c, position: e.target.value }))} placeholder="e.g. 2" type="number" className="skeuo-input" required />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <button type="submit" disabled={postingJob} className="skeuo-btn skeuo-btn-primary px-8 py-4 text-sm font-extrabold w-full sm:w-auto shadow-lg">
                        {postingJob ? "Publishing Job..." : "Publish Job Listing"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {(activeTab === 'my-jobs') && (
                <div className="skeuo-surface p-6 md:p-8 rounded-[32px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-900">My Job Listings</h2>
                    <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">{recruiterJobs.length} Jobs</span>
                  </div>
                  <div className="grid gap-6">
                    {recruiterJobs.length > 0 ? (
                      recruiterJobs.map((job) => (
                        <div key={job._id} className="skeuo-card-inset p-6 rounded-[24px]">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                            <div>
                              <h3 className="text-xl font-extrabold text-slate-900">{job.title}</h3>
                              <p className="mt-1 text-sm font-bold text-slate-500">{job.company?.name || "Unknown Company"}</p>
                              
                              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                                <span className="bg-white border border-[rgba(16,32,51,0.08)] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                  {job.location}
                                </span>
                                <span className="bg-white border border-[rgba(16,32,51,0.08)] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                  {job.jobtype || "Full Time"}
                                </span>
                                <span className="bg-white border border-[rgba(16,32,51,0.08)] px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-brand">
                                  <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  {formatSalary(job.salary)}
                                </span>
                              </div>
                            </div>
                            
                            <button 
                              type="button" 
                              onClick={() => loadApplicants(job._id)} 
                              className={`skeuo-btn shrink-0 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                                jobApplicants[job._id] 
                                  ? "bg-brand text-white shadow-md hover:bg-brand-soft" 
                                  : "skeuo-btn-secondary"
                              }`}
                            >
                              {jobApplicants[job._id] ? "Refresh Applicants" : "View Applicants"}
                            </button>
                          </div>

                          {jobApplicants[job._id] && (
                            <div className="mt-6 pt-6 border-t border-[rgba(16,32,51,0.08)]">
                              <h4 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
                                Applicants List 
                                <span className="bg-slate-200 text-slate-800 py-0.5 px-2 rounded-md text-[10px]">{jobApplicants[job._id].length}</span>
                              </h4>
                              
                              <div className="grid gap-3">
                                {jobApplicants[job._id].length > 0 ? (
                                  jobApplicants[job._id].map((application) => (
                                    <div key={application._id} className="rounded-2xl border border-[rgba(16,32,51,0.08)] bg-white/60 p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-white transition-colors">
                                      <div>
                                        <p className="text-base font-extrabold text-slate-900">{application.userId?.fullname || "Unknown Applicant"}</p>
                                        <p className="mt-0.5 text-sm font-bold text-slate-500">{application.userId?.email || "No email provided"}</p>
                                        
                                        <div className="mt-3 flex items-center gap-3">
                                          <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                            Status: 
                                            <span className={`px-2 py-0.5 rounded-md ${
                                              application.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                              application.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                              'bg-amber-100 text-amber-700'
                                            }`}>{application.status}</span>
                                          </p>
                                          
                                          {application.userId?.resumeUrl && (
                                            <>
                                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                              <a href={buildAssetUrl(application.userId.resumeUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-extrabold text-brand hover:underline">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                Resume
                                              </a>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 shrink-0 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                        {["Accepted", "Rejected", "Pending"].map((status) => (
                                          <button 
                                            key={status} 
                                            type="button" 
                                            onClick={() => updateApplicationStatus(application._id, status, job._id)} 
                                            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                                              application.status === status
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-200'
                                            }`}
                                          >
                                            {status}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center p-6 border border-dashed border-[rgba(16,32,51,0.15)] rounded-2xl bg-white/30">
                                    <p className="text-sm font-bold text-slate-500">No applications received yet.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="skeuo-card-inset p-10 text-center rounded-[24px]">
                        <p className="text-slate-500 font-bold mb-4">No jobs posted yet.</p>
                        <button onClick={() => setActiveTab('post-job')} className="skeuo-btn skeuo-btn-primary px-6 py-2.5 text-sm inline-block">Post Your First Job</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
