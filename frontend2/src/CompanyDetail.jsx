import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "./api/client";

function CompanyDetail() {
  const { category, id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        const response = await apiRequest(`/api/v1/company/get/${id}`);
        setCompany(response.company);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading company...</div>;
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Company not found</h2>
          <p className="text-red-600 mt-2">{error || "No data"}</p>
          <Link to="/companies" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border-2 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] p-8">
        <Link to={`/companies/${category}`} className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          &larr; Back to {category} Companies
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 bg-slate-100 border-2 border-slate-900 rounded-xl flex items-center justify-center text-5xl font-bold shrink-0">
              {(company.name || "C").charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{company.name}</h1>
              {company.website && (
                <a href={company.website} className="inline-block text-sm text-blue-600 underline">
                  {company.website}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-1">Location</h3>
            <p className="text-lg font-bold text-slate-900">{company.location || "Not specified"}</p>
          </div>
        </div>

        <div className="prose max-w-none text-slate-600 mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-3">About {company.name}</h3>
          <p className="mb-6 leading-relaxed text-lg">{company.description || "No company description available."}</p>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetail;
