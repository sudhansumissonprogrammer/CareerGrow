import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "./api/client";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    password: "",
    role: "user",
  });
  const [resume, setResume] = useState(null);
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fullnameRegex = /^[a-zA-Z\s]{3,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?\d{10}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!fullnameRegex.test(form.fullname)) nextErrors.fullname = "Full name must be 3-30 letters and spaces.";
    if (!emailRegex.test(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (!phoneRegex.test(String(form.phonenumber))) nextErrors.phonenumber = "Phone number must be 10 digits with optional leading +.";
    if (!passwordRegex.test(form.password)) nextErrors.password = "Password must be at least 6 characters and include letters and numbers.";
    if (form.role === "user" && !resume) nextErrors.resume = "Resume is required for job seeker accounts.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("fullname", form.fullname.trim());
      formData.append("email", form.email.trim());
      formData.append("phonenumber", form.phonenumber.trim());
      formData.append("password", form.password);
      formData.append("role", form.role);
      if (resume) formData.append("resume", resume);

      const response = await apiRequest("/api/v1/user/register", {
        method: "POST",
        body: formData,
      });

      setStatusMessage(response.message || "Registration successful.");
      setErrors({});
      setForm({
        fullname: "",
        email: "",
        phonenumber: "",
        password: "",
        role: "user",
      });
      setResume(null);
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setErrors({ api: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <div className="auth-grid items-start">
          <section className="page-hero px-6 py-8 md:px-10 md:py-12">
            <span className="page-kicker">Create Account</span>
            <h1 className="section-title mt-5 max-w-2xl">Join a sharper, more premium job platform.</h1>
            <p className="section-subtitle mt-5">
              Register as a job seeker to apply with your resume, or as a recruiter to post live roles and manage applicants from one dashboard.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                ["For job seekers", "Upload your resume once, then apply and track progress from your own dashboard."],
                ["For recruiters", "Set up your company, publish openings, and review applicant status in real time."],
              ].map(([title, text]) => (
                <div key={title} className="skeuo-card p-5">
                  <p className="text-lg font-extrabold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="skeuo-surface p-6 md:p-8">
            <p className="page-kicker">Get Started</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Build your account</h2>

            {statusMessage && <p className="mt-5 rounded-2xl bg-emerald-100 px-4 py-3 text-sm text-emerald-700">{statusMessage}</p>}
            {errors.api && <p className="mt-5 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-700">{errors.api}</p>}

            <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
              <input type="text" name="prevent_autofill" autoComplete="off" style={{ display: "none" }} />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Full name</label>
                <input type="text" name="fullname" placeholder="Your full name" value={form.fullname} onChange={handleChange} required autoComplete="name" className="skeuo-input" />
                {errors.fullname && <p className="mt-2 text-sm text-red-600">{errors.fullname}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                  <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" className="skeuo-input" />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">Phone</label>
                  <input type="tel" name="phonenumber" placeholder="+91..." value={form.phonenumber} onChange={handleChange} required autoComplete="tel" className="skeuo-input" />
                  {errors.phonenumber && <p className="mt-2 text-sm text-red-600">{errors.phonenumber}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
                <input type="password" name="password" placeholder="Create password" value={form.password} onChange={handleChange} required autoComplete="new-password" className="skeuo-input" />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <p className="mb-3 text-sm font-bold text-slate-700">Account type</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["user", "Job Seeker"],
                    ["recruiter", "Recruiter"],
                  ].map(([value, label]) => (
                    <label key={value} className="skeuo-card-inset flex cursor-pointer items-center gap-3 px-4 py-4">
                      <input type="radio" name="role" value={value} checked={form.role === value} onChange={handleChange} className="skeuo-radio h-4 w-4" />
                      <span className="text-sm font-bold text-slate-800">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Resume upload</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] || null)} className="skeuo-input" />
                {errors.resume && <p className="mt-2 text-sm text-red-600">{errors.resume}</p>}
                <p className="mt-2 text-xs text-slate-500">Required for job seekers. Recruiters can leave it empty.</p>
              </div>

              <button type="submit" disabled={submitting} className="skeuo-btn skeuo-btn-primary w-full px-6 py-3.5 text-sm text-white">
                {submitting ? "Registering..." : "Create account"}
              </button>
            </form>

            <div className="skeuo-divider mt-6 pt-5 text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-extrabold text-slate-900 hover:underline">
                Login instead
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Register;
