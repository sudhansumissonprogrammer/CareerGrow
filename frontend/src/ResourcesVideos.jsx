import React from "react";

const videos = [
  { id: 1, title: "Interview presence and delivery", length: "05:12" },
  { id: 2, title: "Resume walkthrough with examples", length: "03:45" },
  { id: 3, title: "How to prepare for recruiter screens", length: "06:18" },
];

function ResourcesVideos() {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-slate-900">Videos</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Short content for quick practice sessions when you need momentum without reading a long guide.</p>
      <div className="mt-6 grid gap-4">
        {videos.map((video) => (
          <article key={video.id} className="skeuo-card flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-lg font-extrabold text-slate-900">{video.title}</p>
              <p className="mt-1 text-sm text-slate-500">Video lesson</p>
            </div>
            <span className="rounded-full bg-[rgba(15,39,65,0.08)] px-4 py-2 text-xs font-extrabold tracking-[0.2em] text-slate-700">
              {video.length}
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ResourcesVideos;
