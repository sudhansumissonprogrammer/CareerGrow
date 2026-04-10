import React from "react";

const articles = [
  {
    id: 1,
    title: "How to write a resume that gets noticed",
    summary: "Focus on signal, impact, and readability instead of trying to include everything at once.",
  },
  {
    id: 2,
    title: "How to answer interview questions with more clarity",
    summary: "Use short stories, real decisions, and outcomes that show how you think rather than memorized lines.",
  },
  {
    id: 3,
    title: "How to evaluate a job beyond the title",
    summary: "Pay attention to ownership, team maturity, reporting structure, and what success actually looks like.",
  },
];

function ResourcesArticles() {
  return (
    <div>
      <h2 className="text-3xl font-extrabold text-slate-900">Articles</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Longer-form notes for candidates trying to improve the quality of their search, communication, and decision-making.</p>
      <div className="mt-6 grid gap-4">
        {articles.map((article) => (
          <article key={article.id} className="skeuo-card p-5">
            <h3 className="text-xl font-extrabold text-slate-900">{article.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{article.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ResourcesArticles;
