import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "./api/client";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^[6-9]\d{9}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$!%*?&]{6,}$/;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.fullname.trim().length < 3) {
      setError("Full name must be at least 3 characters");
      return;
    }

    if (!emailRegex.test(form.email)) {
      setError("Enter a valid email address");
      return;
    }

    if (!phoneRegex.test(form.phonenumber)) {
      setError("Enter valid 10 digit phone number");
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError("Password must be at least 6 characters and contain letters & numbers");
      return;
    }

    if (form.role === "user" && !resume) {
      setError("Resume is required for user account");
      return;
    }

    if (resume) {
      const allowedTypes = new Set([
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]);
      if (!allowedTypes.has(resume.type)) {
        setError("Resume must be PDF, DOC, or DOCX");
        return;
      }
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("email", form.email);
      formData.append("phonenumber", form.phonenumber);
      formData.append("password", form.password);
      formData.append("role", form.role);
      if (resume) {
        formData.append("resume", resume);
      }

      const response = await apiRequest("/api/v1/user/register", {
        method: "POST",
        body: formData,
      });
      setSuccess(response.message || "Registration successful");
      setForm({
        fullname: "",
        email: "",
        phonenumber: "",
        password: "",
        role: "user",
      });
      setResume(null);
      setTimeout(() => navigate("/login"), 800);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-600">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200"
          />

          <input
            type="tel"
            name="phonenumber"
            placeholder="Phone Number"
            value={form.phonenumber}
            onChange={handleChange}
            className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="user"
                checked={form.role === "user"}
                onChange={handleChange}
              />
              User
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={form.role === "recruiter"}
                onChange={handleChange}
              />
              Recruiter
            </label>
          </div>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setResume(event.target.files?.[0] || null)}
            className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200"
          />
          {form.role === "user" && (
            <p className="text-xs text-slate-600">Resume is mandatory for user role</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
