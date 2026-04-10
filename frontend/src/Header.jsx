import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const navItems = [
  { label: "Jobs", to: "/jobs" },
  { label: "Companies", to: "/companies" },
  { label: "Resources", to: "/resources" },
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
      <div className="skeuo-nav mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-7">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d97757,#b85a3d)] text-sm font-extrabold text-white shadow-[0_14px_24px_rgba(217,119,87,0.28)]">
            CG
          </div>
          <div>
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.25em] text-slate-500">Talent Platform</p>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">CareerGrow</h2>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `transition ${isActive ? "text-slate-950" : "hover:text-slate-950"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="rounded-full bg-white/60 px-4 py-2 text-sm font-semibold text-slate-700">
                {user?.fullname?.split(" ")[0] || "Dashboard"}
              </Link>
              <button type="button" onClick={handleLogout} className="skeuo-btn skeuo-btn-primary px-5 py-2.5 text-sm text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="skeuo-btn skeuo-btn-secondary px-5 py-2.5 text-sm">
                Login
              </Link>
              <Link to="/register" className="skeuo-btn skeuo-btn-primary px-5 py-2.5 text-sm text-white">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          className="skeuo-btn skeuo-btn-secondary flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="text-lg">{isMenuOpen ? "×" : "≡"}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="skeuo-banner mx-auto mt-3 max-w-7xl p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl bg-white/55 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                {item.label}
              </NavLink>
            ))}

            <div className="skeuo-divider pt-3">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="skeuo-btn skeuo-btn-secondary w-full px-4 py-3 text-center text-sm">
                    Dashboard
                  </Link>
                  <button type="button" onClick={handleLogout} className="skeuo-btn skeuo-btn-primary w-full px-4 py-3 text-sm text-white">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="skeuo-btn skeuo-btn-secondary w-full px-4 py-3 text-center text-sm">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="skeuo-btn skeuo-btn-primary w-full px-4 py-3 text-center text-sm text-white">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
