import React from "react";

const resources = [
  {
    id: 1,
    title: "Resume Building Guide",
    category: "Career Advice",
    description: "Learn how to craft a resume that gets you hired. Tips on formatting, content, and keywords.",
    link: "#"
  },
  {
    id: 2,
    title: "Interview Preparation",
    category: "Interview",
    description: "Common interview questions and how to answer them. Mock interview tools and strategies.",
    link: "#"
  },
  {
    id: 3,
    title: "Salary Negotiation",
    category: "Salary",
    description: "Don't leave money on the table. Strategies for negotiating your salary and benefits.",
    link: "#"
  },
  {
    id: 4,
    title: "Remote Work Tools",
    category: "Tools",
    description: "Essential tools for working remotely effectively. Communication, project management, and productivity.",
    link: "#"
  },
  {
    id: 5,
    title: "Networking 101",
    category: "Networking",
    description: "How to build and maintain a professional network. LinkedIn tips and cold outreach templates.",
    link: "#"
  },
  {
    id: 6,
    title: "Tech Skills Roadmap",
    category: "Skills",
    description: "A roadmap for learning the most in-demand tech skills in 2026. Frontend, Backend, and DevOps.",
    link: "#"
  }
];

function Resources() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Career Resources</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Curated articles, guides, and tools to help you navigate your career path and land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-slate-100 flex flex-col">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                {resource.category}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{resource.title}</h3>
              <p className="text-slate-600 mb-6 flex-grow">{resource.description}</p>
              <a href={resource.link} className="text-blue-600 font-medium hover:text-blue-700 inline-flex items-center gap-1">
                Read More <span>&rarr;</span>
              </a>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Want more personalized advice?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">Join our community to connect with mentors and get feedback on your resume.</p>
            <button className="bg-white text-slate-900 px-8 py-3 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200">
                Join Community
            </button>
        </div>
      </div>
    </div>
  );
}

export default Resources;