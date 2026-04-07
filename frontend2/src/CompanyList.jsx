import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "./api/client";

const matchCategory = (company, category) => {
  const text = `${company.name || ""} ${company.description || ""}`.toLowerCase();
  const rules = {
    unicorn: ["unicorn", "fintech", "growth"],
    startup: ["startup", "seed", "saas", "ai"],
    "service-based": ["service", "consult", "agency"],
    "product-based": ["product", "platform", "app"],
    mnc: ["global", "corporation", "inc", "ltd"],
  };
  const terms = rules[category] || [];
  if (terms.length === 0) return true;
  return terms.some((term) => text.includes(term));
};

function CompanyList() {
  const { category } = useParams();
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
  }, [category]);

  const filteredCompanies = useMemo(
    () => companies.filter((company) => matchCategory(company, category)),
    [companies, category]
  );

  const formatCategory = (value) => {
    if (!value) return "";
    return value
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const colors = ["bg-red-50", "bg-orange-50", "bg-teal-50", "bg-sky-50", "bg-indigo-50"];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/companies" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-1">
            &larr; Back to Categories
          </Link>
          <h1 className="text-4xl font-black text-slate-900">{formatCategory(category)} Companies</h1>
          <p className="text-slate-600 font-medium mt-2">Showing live companies from backend API.</p>
        </div>

        {loading && <p className="text-slate-600">Loading companies...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!loading && !error && filteredCompanies.length > 0 ? (
            filteredCompanies.map((company, index) => (
              <Link to={`/companies/${category}/${company._id}`} key={company._id} className="block h-full">
                <div
                  className={`group ${colors[index % colors.length]} p-6 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 flex flex-col h-full rounded-xl`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 bg-white border-2 border-slate-900 rounded-lg flex items-center justify-center text-3xl font-bold">
                        {(company.name || "C").charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">{company.name}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-800 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow font-medium">
                    {company.description || "No company description available."}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-700 border-t-2 border-slate-900/10 pt-4 font-bold">
                      <span>{company.location || "Location not set"}</span>
                      <span>{company.website || "No website"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            !loading &&
            !error && (
              <div className="col-span-full text-center py-16 bg-white rounded-xl border border-slate-100">
                <h3 className="text-lg font-medium text-slate-900">No companies found</h3>
                <p className="text-slate-500 mt-1">No companies are available in this category right now.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
