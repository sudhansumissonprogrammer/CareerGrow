import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./home";
import Register from "./register";
import Login from "./login";
import Dashboard from "./dashboard";
import Contact from "./contact";
import About from "./about";
import Jobs from "./Jobs";
import JobDetails from "./JobDetails";
import Companies from "./Companies";
import Resources from "./Resources";
import ResourcesIndex from "./ResourcesIndex";
import ResourcesArticles from "./ResourcesArticles";
import ResourcesVideos from "./ResourcesVideos";
import Header from "./Header"; 
import { JobSearchProvider } from "./JobSearchContext";
import { ThemeProvider } from "./theme/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <JobSearchProvider>
        <BrowserRouter>
          <Header />
          <div className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:jobId" element={<JobDetails />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/resources" element={<Resources />}>
                <Route index element={<ResourcesIndex />} />
                <Route path="articles" element={<ResourcesArticles />} />
                <Route path="videos" element={<ResourcesVideos />} />
              </Route>
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </BrowserRouter>
      </JobSearchProvider>
    </ThemeProvider>
  );
}

export default App;
