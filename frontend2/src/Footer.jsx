import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Career<span className="text-blue-500">Grow</span>
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Connecting talent with opportunity. We help you find the perfect job or the perfect candidate with ease and speed.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><a href="#" className="hover:text-blue-400 transition">Find Jobs</a></li>
            <li><a href="#" className="hover:text-blue-400 transition">Companies</a></li>
            <li><Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/resources" className="hover:text-blue-400 transition">Career Advice</Link></li>
            <li><a href="#" className="hover:text-blue-400 transition">Resume Builder</a></li>
            <li><Link to="/contact" className="hover:text-blue-400 transition">Contact Support</Link></li>
            <li><a href="#" className="hover:text-blue-400 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
          <p className="text-sm mb-4 text-slate-400">Subscribe to our newsletter for the latest job openings and career tips.</p>
          <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-slate-800 border-2 border-slate-900 text-white px-4 py-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all duration-200 text-sm"
            />
            <button className="bg-blue-600 text-white px-4 py-2 font-bold rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>© 2026 CareerGrow. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition">Twitter</a>
          <a href="#" className="hover:text-white transition">LinkedIn</a>
          <a href="#" className="hover:text-white transition">Facebook</a>
          <a href="#" className="hover:text-white transition">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;