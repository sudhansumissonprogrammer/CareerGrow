import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <section className="page-hero px-6 py-8 md:px-10 md:py-12">
          <span className="page-kicker">About CareerGrow</span>
          <h1 className="section-title mt-5 max-w-3xl">A job platform redesigned to feel serious, useful, and fast.</h1>
          <p className="section-subtitle mt-5">
            CareerGrow connects candidates and companies through a cleaner hiring journey: clearer job discovery, better application tracking, and
            a recruiter workspace that actually helps move work forward.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            ["Clarity first", "We want every action to feel obvious, fast, and grounded in real information."],
            ["Respect for users", "Candidates should feel supported, and recruiters should stay focused without noise."],
            ["Progress over friction", "The product should help both sides move forward with less confusion and fewer repeated steps."],
          ].map(([title, text]) => (
            <div key={title} className="skeuo-card p-6">
              <p className="page-kicker">Principle</p>
              <h2 className="mt-4 text-2xl font-extrabold text-slate-900">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="skeuo-surface p-8">
            <h2 className="text-3xl font-extrabold text-slate-900">What this platform is built to do</h2>
            <div className="mt-6 grid gap-4">
              {[
                "Help job seekers discover verified roles and apply with confidence.",
                "Give recruiters a focused dashboard for companies, listings, and applicant updates.",
                "Keep the full experience connected to live backend data instead of demo-only UI.",
              ].map((item) => (
                <div key={item} className="skeuo-card-inset p-4 text-sm leading-7 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="skeuo-surface p-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Talk to us</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              If you want to collaborate, share feedback, or improve the hiring experience further, we want to hear from you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="skeuo-btn skeuo-btn-primary px-6 py-3 text-sm text-white">
                Contact Us
              </Link>
              <Link to="/jobs" className="skeuo-btn skeuo-btn-secondary px-6 py-3 text-sm">
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
