import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./api/client";
import { useAuth } from "./context/AuthContext";

const statusColorClass = {
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const normalizeStatus = (status) => {
  const map = {
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
  };
  return map[String(status || "").toLowerCase()] || "Pending";
};

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  const role = user?.role || "user";
  const [activeTab, setActiveTab] = useState(role === "recruiter" ? "postJob" : "appliedJobs");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [myApplications, setMyApplications] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobApplicants, setJobApplicants] = useState([]);
  const [formMessage, setFormMessage] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    skills: "",
  });

  const sidebarItems =
    role === "recruiter"
      ? [
          { key: "postJob", label: "Post Job" },
          { key: "myJobs", label: "My Jobs" },
          { key: "applicants", label: "Applicants" },
        ]
      : [
          { key: "appliedJobs", label: "Applied Jobs" },
          { key: "updateResume", label: "Update Resume" },
        ];

  useEffect(() => {
    setActiveTab(role === "recruiter" ? "postJob" : "appliedJobs");
  }, [role]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      if (role === "recruiter") {
        const jobsResponse = await apiRequest("/api/v1/job/getadminjobs");
        const jobs = jobsResponse.jobs || [];
        setMyJobs(jobs);
        if (!selectedJobId && jobs.length > 0) {
          setSelectedJobId(jobs[0]._id);
        }
      } else {
        const applicationsResponse = await apiRequest("/api/v1/applications/my");
        setMyApplications(applicationsResponse.applications || []);
      }
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user?.role]);

  useEffect(() => {
    const loadApplicants = async () => {
      if (role !== "recruiter" || !selectedJobId) return;
      try {
        const response = await apiRequest(`/api/v1/applications/job/${selectedJobId}`);
        setJobApplicants(response.applications || []);
      } catch (apiError) {
        setError(apiError.message);
      }
    };
    loadApplicants();
  }, [role, selectedJobId]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handlePostJob = async (event) => {
    event.preventDefault();
    setFormMessage("");
    try {
      await apiRequest("/api/v1/jobs", {
        method: "POST",
        body: JSON.stringify(jobForm),
      });
      setFormMessage("Job posted successfully");
      setJobForm({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
        skills: "",
      });
      await loadDashboardData();
    } catch (apiError) {
      setFormMessage(apiError.message);
    }
  };

  const handleResumeUpdate = async (event) => {
    event.preventDefault();
    if (!resumeFile) {
      setFormMessage("Please choose a resume file");
      return;
    }
    setFormMessage("");
    try {
      setResumeLoading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);
      await apiRequest("/api/v1/user/update-resume", {
        method: "PUT",
        body: formData,
      });
      await refreshUser();
      setFormMessage("Resume updated successfully");
      setResumeFile(null);
    } catch (apiError) {
      setFormMessage(apiError.message);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleApplicantStatus = async (applicationId, status) => {
    try {
      await apiRequest(`/api/v1/applications/status/${applicationId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      const response = await apiRequest(`/api/v1/applications/job/${selectedJobId}`);
      setJobApplicants(response.applications || []);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const recruiterStats = useMemo(
    () => ({
      totalJobs: myJobs.length,
      totalApplicants: myJobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0),
    }),
    [myJobs]
  );

  if (authLoading || loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900">{role === "recruiter" ? "Recruiter Dashboard" : "User Dashboard"}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 text-red-700 border border-red-200 rounded-xl px-4 py-3">{error}</div>
        )}
        {formMessage && (
          <div className="mb-6 bg-blue-100 text-blue-700 border border-blue-200 rounded-xl px-4 py-3">{formMessage}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
          <aside className="bg-white rounded-xl border border-slate-100 p-4 h-fit">
            <h2 className="text-sm font-bold uppercase text-slate-500 mb-3">Dashboard</h2>
            <div className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-semibold ${
                    activeTab === item.key ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-6">
            {role === "recruiter" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                  <h3 className="text-slate-500 text-sm font-medium uppercase">Total Jobs</h3>
                  <p className="text-3xl font-black text-slate-900 mt-1">{recruiterStats.totalJobs}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                  <h3 className="text-slate-500 text-sm font-medium uppercase">Total Applicants</h3>
                  <p className="text-3xl font-black text-slate-900 mt-1">{recruiterStats.totalApplicants}</p>
                </div>
              </div>
            )}

            {role !== "recruiter" && activeTab === "appliedJobs" && (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">Applied Jobs</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {myApplications.length === 0 ? (
                    <div className="px-6 py-8 text-slate-500">No applications yet.</div>
                  ) : (
                    myApplications.map((application) => {
                      const displayStatus = normalizeStatus(application.status);
                      return (
                        <div key={application._id} className="px-6 py-4 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-900">{application.jobId?.title || "Unknown Job"}</h4>
                            <p className="text-sm text-slate-600">{application.jobId?.company?.name || "Unknown Company"}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColorClass[displayStatus]}`}>{displayStatus}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {role !== "recruiter" && activeTab === "updateResume" && (
              <form
                onSubmit={handleResumeUpdate}
                className="bg-white rounded-xl border border-slate-100 p-6 space-y-4"
              >
                <h2 className="text-lg font-bold text-slate-900">Update Resume</h2>
                {user?.resumeUrl && (
                  <a
                    href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${user.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm inline-block"
                  >
                    View Current Resume
                  </a>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                  className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900"
                />
                <button
                  type="submit"
                  disabled={resumeLoading}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl border-2 border-slate-900"
                >
                  {resumeLoading ? "Updating..." : "Update Resume"}
                </button>
              </form>
            )}

            {role === "recruiter" && activeTab === "postJob" && (
              <form onSubmit={handlePostJob} className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Post Job</h2>
                <input
                  placeholder="Title"
                  value={jobForm.title}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900"
                  required
                />
                <input
                  placeholder="Company"
                  value={jobForm.company}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, company: event.target.value }))}
                  className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900"
                  required
                />
                <input
                  placeholder="Location"
                  value={jobForm.location}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, location: event.target.value }))}
                  className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900"
                  required
                />
                <input
                  placeholder="Salary"
                  type="number"
                  value={jobForm.salary}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, salary: event.target.value }))}
                  className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={jobForm.description}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 min-h-28"
                  required
                />
                <input
                  placeholder="Skills (comma separated)"
                  value={jobForm.skills}
                  onChange={(event) => setJobForm((prev) => ({ ...prev, skills: event.target.value }))}
                  className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900"
                  required
                />
                <button type="submit" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl border-2 border-slate-900">
                  Post Job
                </button>
              </form>
            )}

            {role === "recruiter" && activeTab === "myJobs" && (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900">My Jobs</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {myJobs.length === 0 ? (
                    <div className="px-6 py-8 text-slate-500">No jobs posted yet.</div>
                  ) : (
                    myJobs.map((job) => (
                      <div key={job._id} className="px-6 py-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900">{job.title}</h4>
                          <p className="text-sm text-slate-600">{job.company?.name || "Unknown Company"}</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                          {(job.applications || []).length} Applicants
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {role === "recruiter" && activeTab === "applicants" && (
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Applicants</h2>
                  <select
                    value={selectedJobId}
                    onChange={(event) => setSelectedJobId(event.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300"
                  >
                    {myJobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="divide-y divide-slate-100">
                  {jobApplicants.length === 0 ? (
                    <div className="px-6 py-8 text-slate-500">No applicants yet.</div>
                  ) : (
                    jobApplicants.map((application) => {
                      const displayStatus = normalizeStatus(application.status);
                      const resumeLink = application.resumeUrl
                        ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${application.resumeUrl}`
                        : "";
                      return (
                        <div key={application._id} className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-slate-900">{application.userId?.fullname || "Unknown Applicant"}</h4>
                            <p className="text-sm text-slate-600">{application.userId?.email || "No email"}</p>
                            {resumeLink && (
                              <a href={resumeLink} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                                Resume Link
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColorClass[displayStatus]}`}>{displayStatus}</span>
                            <button
                              onClick={() => handleApplicantStatus(application._id, "Accepted")}
                              className="px-3 py-1 text-xs font-bold rounded-md bg-green-600 text-white"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicantStatus(application._id, "Rejected")}
                              className="px-3 py-1 text-xs font-bold rounded-md bg-red-600 text-white"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
