import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="py-16 px-6 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
              Find Your Next Career Move
            </h1>
            <p className="text-slate-600 text-lg mb-8">
              Explore jobs, connect with top companies, and build your future with CareerGrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/jobs"
                className="px-7 py-3 bg-blue-600 text-white font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 text-center"
              >
                Explore Jobs
              </Link>
              <Link
                to="/companies"
                className="px-7 py-3 bg-white text-slate-900 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 text-center"
              >
                Explore Companies
              </Link>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
              alt="Team working together"
              className="w-full h-[320px] md:h-[420px] object-cover rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
            />
          </div>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xl font-black mb-2">Smart Job Search</h3>
            <p className="text-slate-600">Find roles by category and apply quickly.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xl font-black mb-2">Trusted Companies</h3>
            <p className="text-slate-600">Explore startups, MNCs, and product companies.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="text-xl font-black mb-2">Career Growth</h3>
            <p className="text-slate-600">Use resources to improve and stand out.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
