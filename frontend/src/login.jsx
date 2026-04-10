import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "./api/client";
import { useAuth } from "./context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const nextErrors = {};
    if (!emailRegex.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!passwordRegex.test(form.password)) nextErrors.password = "Password must be at least 6 characters and include letters and numbers.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      const response = await apiRequest("/api/v1/user/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      login(response.user);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <div className="auth-grid items-start">
          <section className="page-hero px-6 py-8 md:px-10 md:py-12">
            <span className="page-kicker">Member Access</span>
            <h1 className="section-title mt-5 max-w-2xl">Welcome back to a calmer hiring workflow.</h1>
            <p className="section-subtitle mt-5">
              Sign in as a job seeker or recruiter to continue with live jobs, applications, applicant review, and account activity.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["Job Seeker", "Track applications, open your resume, and keep recommended roles close."],
                ["Recruiter", "Post openings, manage applicant pipelines, and review responses faster."],
              ].map(([title, text]) => (
                <div key={title} className="skeuo-card p-5">
                  <p className="text-lg font-extrabold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="skeuo-surface p-6 md:p-8">
            <p className="page-kicker">Sign In</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Access your dashboard</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Choose the account type you created and continue where you left off.</p>

            {errorMessage && <div className="status-error mt-6 rounded-2xl px-4 py-3 text-sm">{errorMessage}</div>}

            <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
              <input type="text" name="prevent_autofill" autoComplete="off" style={{ display: "none" }} />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required autoComplete="email" className="skeuo-input" />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
                <input type="password" name="password" placeholder="Enter password" value={form.password} onChange={handleChange} required autoComplete="current-password" className="skeuo-input" />
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

              <button type="submit" disabled={loading} className="skeuo-btn skeuo-btn-primary w-full px-6 py-3.5 text-sm text-white">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="skeuo-divider mt-6 pt-5 text-sm text-slate-600">
              New here?{" "}
              <Link to="/register" className="font-extrabold text-slate-900 hover:underline">
                Create your account
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Login;
