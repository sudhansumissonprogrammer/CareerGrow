import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home";
import Register from "./register";
import Login from "./login";
import Dashboard from "./dashboard";
import Contact from "./Contact";
import Resources from "./Resources";
import Layout from "./Layout";
import Jobs from "./Jobs";
import Companies from "./Companies";
import JobList from "./JobList";
import About from "./About";
import CompanyList from "./CompanyList";
import JobDetail from "./JobDetail";
import CompanyDetail from "./CompanyDetail";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:category" element={<JobList />} />
        <Route path="/jobs/:category/:id" element={<JobDetail />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:category" element={<CompanyList />} />
        <Route path="/companies/:category/:id" element={<CompanyDetail />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
