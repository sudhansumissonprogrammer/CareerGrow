import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "./api/client";

const detectCompanyType = (company) => {
  const text = `${company.name || ""} ${company.description || ""} ${company.location || ""}`.toLowerCase();
  if (text.includes("remote")) return "Remote-First";
  if (text.includes("startup")) return "Startup";
  if (text.includes("enterprise")) return "Enterprise";
  if (text.includes("product")) return "Product";
  return "Product";
};

function Companies() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "All";
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const [companyResponse, jobsResponse] = await Promise.all([
          apiRequest("/api/v1/company/get"),
          apiRequest("/api/v1/job/get"),
        ]);
        setCompanies(companyResponse.companies || []);
        setJobs(jobsResponse.jobs || []);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const availableCategories = useMemo(() => ["All", ...new Set(companies.map((company) => detectCompanyType(company)))], [companies]);

  const jobsByCompanyId = useMemo(() => {
    return jobs.reduce((acc, job) => {
      const companyId = job.company?._id;
      if (!companyId) return acc;
      acc[companyId] = (acc[companyId] || 0) + 1;
      return acc;
    }, {});
  }, [jobs]);

  const filteredCompanies = companies.filter((company) => selectedCategory === "All" || detectCompanyType(company) === selectedCategory);

  const handleCategoryChange = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === "All") nextParams.delete("category");
    else nextParams.set("category", category);
    setSearchParams(nextParams);
  };

  return (
    <div className="skeuo-page">
      <div className="page-wrap pt-28">
        <section className="page-hero px-6 py-8 md:px-10 md:py-12">
          <span className="page-kicker">Teams & Brands</span>
          <h1 className="section-title mt-5 max-w-3xl">Explore the companies behind the live roles.</h1>
          <p className="section-subtitle mt-5">
            Browse the teams hiring through the platform, filter by company type, and jump straight into the roles that match your goals.
          </p>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex flex-wrap gap-3">
            {availableCategories.map((category) => (
              <button key={category} onClick={() => handleCategoryChange(category)} data-active={selectedCategory === category} className="skeuo-chip px-4 py-2 text-sm">
                {category}
              </button>
            ))}
          </div>

          {loading && <div className="skeuo-surface p-8 text-center text-slate-600">Loading companies...</div>}
          {error && <div className="skeuo-surface p-8 text-center text-red-600">{error}</div>}

          {!loading && !error && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCompanies.map((company) => {
                const type = detectCompanyType(company);
                const openRoles = jobsByCompanyId[company._id] || 0;

                return (
                  <article key={company._id} className="skeuo-card p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="page-kicker">{type}</p>
                        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">{company.name}</h2>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#f8d8c2,#fff1e4)] text-sm font-extrabold text-slate-900">
                        {(company.name || "C")
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-slate-600">{company.description || "Company profile coming soon with more details about the team and hiring direction."}</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="skeuo-card-inset p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Open Roles</p>
                        <p className="mt-2 text-2xl font-extrabold text-slate-900">{openRoles}</p>
                      </div>
                      <div className="skeuo-card-inset p-4">
                        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-500">Location</p>
                        <p className="mt-2 text-base font-bold text-slate-900">{company.location || "Flexible"}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {[type, company.location || "Flexible"].map((tag) => (
                        <span key={tag} className="skeuo-chip">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex gap-3">
                      <Link to={`/jobs${company.location?.toLowerCase().includes("remote") ? "?category=Remote" : ""}`} className="skeuo-btn skeuo-btn-primary px-5 py-3 text-sm text-white">
                        View jobs
                      </Link>
                      <Link to="/contact" className="skeuo-btn skeuo-btn-secondary px-5 py-3 text-sm">
                        Contact
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!loading && !error && filteredCompanies.length === 0 && (
            <div className="skeuo-surface p-8 text-center text-slate-600">No companies found for this category.</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Companies;
