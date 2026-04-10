/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const JobSearchContext = createContext(null);

export function JobSearchProvider({ children }) {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const value = {
    keyword,
    setKeyword,
    location,
    setLocation,
  };

  return (
    <JobSearchContext.Provider value={value}>
      {children}
    </JobSearchContext.Provider>
  );
}

export function useJobSearch() {
  const context = useContext(JobSearchContext);
  if (!context) {
    throw new Error("useJobSearch must be used within JobSearchProvider");
  }
  return context;
}
