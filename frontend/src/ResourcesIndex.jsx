import React from "react";

const resources = [
  {
    id: 1,
    title: "Resume Positioning Guide",
    summary: "Learn how to make your experience read clearly, confidently, and with better recruiter signal.",
    meta: "10 min read",
  },
  {
    id: 2,
    title: "Interview Prep Checklist",
    summary: "A simple sequence to prepare stories, technical depth, and role-specific examples before interviews.",
    meta: "7 min read",
  },
  {
    id: 3,
    title: "Career Growth Notes",
    summary: "Practical ways to move from task execution to stronger ownership and decision-making in your next role.",
    meta: "12 min read",
  },
];

function ResourcesIndex() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {resources.map((resource) => (
        <article key={resource.id} className="skeuo-card p-5">
          <p className="page-kicker">Featured</p>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">{resource.title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{resource.summary}</p>
          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">{resource.meta}</p>
        </article>
      ))}
    </div>
  );
}

export default ResourcesIndex;
