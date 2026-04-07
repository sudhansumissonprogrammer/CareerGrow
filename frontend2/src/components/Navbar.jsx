import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropDown from './DropDown';

const Navbar = () => {
  const [jobsMenuOpen, setJobsMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);

  const jobsMenuItems = [
    { title: 'IT Jobs', path: '/jobs/it' },
    { title: 'Sales Jobs', path: '/jobs/sales' },
    { title: 'Marketing Jobs', path: '/jobs/marketing' },
    { title: 'Data Science Jobs', path: '/jobs/data-science' },
    { title: 'Engineering Jobs', path: '/jobs/engineering' },
  ];

  const companyMenuItems = [
    { title: 'Unicorn', path: '/companies/unicorn' },
    { title: 'Startup', path: '/companies/startup' },
    { title: 'Service-Based', path: '/companies/service-based' },
    { title: 'Product-Based', path: '/companies/product-based' },
    { title: 'MNC', path: '/companies/mnc' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Job Portal
        </Link>
      </div>
      <div className="navbar-center">
        <ul className="navbar-nav">
          <li
            className="nav-item"
            onMouseEnter={() => setJobsMenuOpen(true)}
            onMouseLeave={() => setJobsMenuOpen(false)}
          >
            <Link to="/jobs" className="nav-link">
              Jobs
            </Link>
            <DropDown isOpen={jobsMenuOpen} menuItems={jobsMenuItems} />
          </li>
          <li
            className="nav-item"
            onMouseEnter={() => setCompanyMenuOpen(true)}
            onMouseLeave={() => setCompanyMenuOpen(false)}
          >
            <Link to="/companies" className="nav-link">
              Companies
            </Link>
            <DropDown isOpen={companyMenuOpen} menuItems={companyMenuItems} />
          </li>
          <li className="nav-item">
            <Link to="/resources" className="nav-link">
              Resources
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
