import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "./api/client";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await apiRequest("/api/v1/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess(response.message || "Your message has been sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Contact Us</h2>
        <p className="text-center text-gray-600 mb-6">We usually respond within 24 hours.</p>

        {success && (
          <div className="mb-4 text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-center">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@email.com"
              className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Tell us how we can help you..."
              className="w-full px-4 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600"
            } text-white`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
          <p className="font-semibold text-gray-900 mb-1">Contact Information</p>
          <p>Email: support@careergrow.com</p>
          <p>Phone: +1 (800) 123-4567</p>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Contact;
