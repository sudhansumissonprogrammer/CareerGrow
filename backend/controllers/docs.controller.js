const docs = {
  name: "Job Portal Backend API",
  baseUrl: "/api/v1",
  authentication: {
    type: "cookie",
    cookieName: "token",
    notes: [
      "JWT is stored in an HTTP-only cookie.",
      "Protected routes require credentials-enabled requests.",
    ],
  },
  endpoints: {
    health: [{ method: "GET", path: "/health", access: "Public" }],
    user: [
      { method: "POST", path: "/user/register", access: "Public" },
      { method: "POST", path: "/user/login", access: "Public" },
      { method: "POST", path: "/user/logout", access: "Authenticated" },
      { method: "GET", path: "/user/me", access: "Authenticated" },
      { method: "POST", path: "/user/profile/update", access: "Authenticated" },
      { method: "PUT", path: "/user/update-resume", access: "User" },
    ],
    company: [
      { method: "POST", path: "/company/register", access: "Authenticated" },
      { method: "GET", path: "/company/get", access: "Public/Authenticated" },
      { method: "GET", path: "/company/get/:id", access: "Public" },
      { method: "PUT", path: "/company/update/:id", access: "Authenticated" },
    ],
    job: [
      { method: "POST", path: "/job/post", access: "Recruiter" },
      { method: "POST", path: "/job", access: "Recruiter" },
      { method: "GET", path: "/job", access: "Public" },
      { method: "GET", path: "/job/get", access: "Public" },
      { method: "GET", path: "/job/get/:id", access: "Public" },
      { method: "GET", path: "/job/getadminjobs", access: "Recruiter" },
      { method: "DELETE", path: "/job/delete/:id", access: "Recruiter" },
      { method: "DELETE", path: "/job/:id", access: "Recruiter" },
    ],
    application: [
      { method: "POST", path: "/application/apply/:jobId", access: "User" },
      { method: "GET", path: "/application/get", access: "User" },
      { method: "GET", path: "/application/my", access: "User" },
      { method: "GET", path: "/application/:id/applicant", access: "Recruiter" },
      { method: "GET", path: "/application/job/:jobId", access: "Recruiter" },
      { method: "POST", path: "/application/status/:id/update", access: "Recruiter" },
      { method: "PUT", path: "/application/status/:id", access: "Recruiter" },
    ],
    contact: [{ method: "POST", path: "/contact", access: "Public" }],
    docs: [{ method: "GET", path: "/docs", access: "Public" }],
  },
  querySupport: {
    jobs: ["keyword", "title", "location", "salary", "page", "limit"],
    applications: ["page", "limit"],
    recruiterJobs: ["page", "limit", "includeDeleted"],
    applicants: ["page", "limit"],
  },
  thoughtfulAdditions: [
    "Cookie-based authentication",
    "Search support for job listing",
    "Pagination support",
    "Soft delete for jobs",
    "Global rate limiting",
    "Node.js test coverage for helpers",
  ],
};

export const getApiDocs = (_req, res) => {
  return res.status(200).json({
    success: true,
    docs,
  });
};
