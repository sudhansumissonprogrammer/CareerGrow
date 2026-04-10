import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { label: "Overview", to: "/resources", end: true },
  { label: "Articles", to: "/resources/articles" },
  { label: "Videos", to: "/resources/videos" },
];

function Resources() {
  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <section className="page-hero px-6 py-8 md:px-10 md:py-12">
          <span className="page-kicker">Learning Hub</span>
          <h1 className="section-title mt-5 max-w-3xl">Resources for stronger resumes, interviews, and career direction.</h1>
          <p className="section-subtitle mt-5">
            A redesigned content space for practical support, from foundational application advice to short-form learning that keeps candidates moving.
          </p>
        </section>

        <section className="mt-8 skeuo-surface p-5 md:p-7">
          <div className="mb-6 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <NavLink key={tab.to} to={tab.to} end={tab.end}>
                {({ isActive }) => (
                  <span className="skeuo-chip px-4 py-2 text-sm" data-active={isActive}>
                    {tab.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default Resources;
