import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "./api/client";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nameRegex = /^[a-zA-Z\s]{3,30}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!nameRegex.test(form.name)) nextErrors.name = "Enter a valid name with 3-30 letters.";
    if (!emailRegex.test(form.email)) nextErrors.email = "Enter a valid email.";
    if (!form.message || form.message.trim().length < 10) nextErrors.message = "Message must be at least 10 characters.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      const response = await apiRequest("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.subject ? `${form.subject}\n\n${form.message}` : form.message,
        }),
      });

      setStatus(response.message || "Thanks! Your message has been sent.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setErrors({});
    } catch (error) {
      setStatus(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="page-hero px-6 py-8 md:px-10 md:py-12">
            <span className="page-kicker">Contact</span>
            <h1 className="section-title mt-5 max-w-2xl">Let’s make the product sharper together.</h1>
            <p className="section-subtitle mt-5">
              Whether you want to report an issue, suggest a feature, or talk about hiring experience improvements, send a message and we’ll review it.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                ["Product feedback", "Share the parts that feel strong or still need work."],
                ["Hiring workflow questions", "Ask about recruiter actions, job applications, or dashboard behavior."],
                ["General contact", "Use this form for support, collaboration, or future ideas."],
              ].map(([title, text]) => (
                <div key={title} className="skeuo-card p-5">
                  <p className="text-lg font-extrabold text-slate-900">{title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="skeuo-surface p-6 md:p-8">
            <p className="page-kicker">Send Message</p>
            <h2 className="mt-4 text-3xl font-extrabold text-slate-900">We’re listening</h2>
            {status && <div className="status-success mt-6 rounded-2xl px-4 py-3 text-sm">{status}</div>}

            <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
              <input type="text" name="prevent_autofill" autoComplete="off" style={{ display: "none" }} />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Your name</label>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="skeuo-input" />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Email address</label>
                <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} className="skeuo-input" />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Subject</label>
                <input name="subject" placeholder="Subject (optional)" value={form.subject} onChange={handleChange} className="skeuo-input" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">Message</label>
                <textarea name="message" placeholder="Tell us what you need" value={form.message} onChange={handleChange} rows={6} className="skeuo-input" />
                {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={submitting} className="skeuo-btn skeuo-btn-primary px-6 py-3 text-sm text-white">
                  {submitting ? "Sending..." : "Send Message"}
                </button>
                <Link to="/" className="skeuo-btn skeuo-btn-secondary px-6 py-3 text-sm">
                  Back Home
                </Link>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Contact;
