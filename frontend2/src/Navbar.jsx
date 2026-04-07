import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const [jobsMenuOpen, setJobsMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const jobsMenuItems = [
    { title: "IT Jobs", path: "/jobs/it" },
    { title: "Sales Jobs", path: "/jobs/sales" },
    { title: "Marketing Jobs", path: "/jobs/marketing" },
    { title: "Data Science Jobs", path: "/jobs/data-science" },
    { title: "Engineering Jobs", path: "/jobs/engineering" },
  ];

  const companyMenuItems = [
    { title: "Unicorn", path: "/companies/unicorn" },
    { title: "Startup", path: "/companies/startup" },
    { title: "Service-Based", path: "/companies/service-based" },
    { title: "Product-Based", path: "/companies/product-based" },
    { title: "MNC", path: "/companies/mnc" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-4 z-50 w-[95%] max-w-7xl mx-auto backdrop-blur-md bg-white/70 border border-slate-100 shadow-xl rounded-2xl">
      <div className="px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
            C
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Career<span className="text-blue-600">Grow</span>
          </h2>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <div
            className="relative"
            onMouseEnter={() => setJobsMenuOpen(true)}
            onMouseLeave={() => setJobsMenuOpen(false)}
          >
            <Link to="/jobs" className="hover:text-blue-600 transition cursor-pointer py-2 block">
              Jobs
            </Link>
            {jobsMenuOpen && (
              <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-lg rounded-lg py-2 flex flex-col">
                {jobsMenuItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => setCompanyMenuOpen(true)}
            onMouseLeave={() => setCompanyMenuOpen(false)}
          >
            <Link to="/companies" className="hover:text-blue-600 transition cursor-pointer py-2 block">
              Companies
            </Link>
            {companyMenuOpen && (
              <div className="absolute top-full left-0 w-48 bg-white border border-slate-100 shadow-lg rounded-lg py-2 flex flex-col">
                {companyMenuItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path}
                    className="px-4 py-2 hover:bg-slate-50 hover:text-blue-600 transition"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-blue-600 transition">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
          <Link to="/resources" className="hover:text-blue-600 transition">
            Resources
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="px-6 py-2 text-sm font-bold rounded-xl bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-6 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-6 py-2 text-sm font-bold rounded-xl bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-2 border-t border-slate-100">
          <Link to="/jobs" className="block py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
            Jobs
          </Link>
          <Link
            to="/companies"
            className="block py-2 text-slate-600 font-medium hover:text-blue-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            Companies
          </Link>
          <Link to="/about" className="block py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="block py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </Link>
          <Link to="/resources" className="block py-2 text-slate-600 font-medium hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
            Resources
          </Link>
          <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-slate-100">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full text-center px-6 py-2 text-sm font-bold rounded-xl bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-6 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-center px-6 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center px-6 py-2 text-sm font-bold rounded-xl bg-white text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
