import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "./api/client";

const CATEGORY_CONFIG = [
  { key: "unicorn", title: "Unicorn", path: "/companies/unicorn", color: "bg-red-100", icon: "U" },
  { key: "startup", title: "Startup", path: "/companies/startup", color: "bg-orange-100", icon: "S" },
  { key: "service-based", title: "Service-Based", path: "/companies/service-based", color: "bg-teal-100", icon: "SV" },
  { key: "product-based", title: "Product-Based", path: "/companies/product-based", color: "bg-sky-100", icon: "P" },
  { key: "mnc", title: "MNC", path: "/companies/mnc", color: "bg-lime-100", icon: "M" },
];

const detectCategory = (company) => {
  const text = `${company.name || ""} ${company.description || ""}`.toLowerCase();
  if (text.includes("service") || text.includes("consult")) return "service-based";
  if (text.includes("product") || text.includes("platform")) return "product-based";
  if (text.includes("inc") || text.includes("corp") || text.includes("global")) return "mnc";
  if (text.includes("ai") || text.includes("fintech") || text.includes("startup")) return "startup";
  return "unicorn";
};

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoading(true);
        const response = await apiRequest("/api/v1/company/get");
        setCompanies(response.companies || []);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, []);

  const categoryCounts = useMemo(() => {
    return companies.reduce((acc, company) => {
      const key = detectCategory(company);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [companies]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Explore Companies by Category</h1>
          <p className="text-slate-600 font-medium">Discover companies from live backend data.</p>
        </div>

        {loading && <p className="text-center text-slate-600">Loading companies...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORY_CONFIG.map((category) => (
              <Link
                key={category.key}
                to={category.path}
                className={`${category.color} p-8 border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all duration-200 group flex flex-col rounded-xl`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 bg-white/50 border-2 border-slate-900 flex items-center justify-center text-3xl rounded-lg">
                    {category.icon}
                  </div>
                  <span className="bg-white/50 border-2 border-slate-900 text-slate-900 text-xs px-3 py-1 rounded-md font-bold">
                    {categoryCounts[category.key] || 0} Companies
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition flex-grow">{category.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Companies;
