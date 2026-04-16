import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { buildPaginationMeta, parsePagination } from "../utils/pagination.js";

const normalizeRole = (role) => (role === "student" ? "user" : role);

const normalizeStatus = (value) => {
  const map = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };
  return map[String(value || "").toLowerCase()] || "";
};

export const applyjob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.jobId || req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "jobId is required",
        success: false,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (normalizeRole(user.role) !== "user") {
      return res.status(403).json({
        message: "Only user accounts can apply to jobs",
        success: false,
      });
    }

    if (!user.resumeUrl) {
      return res.status(400).json({
        message: "Please upload your resume before applying",
        success: false,
      });
    }

    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    const job = await Job.findOne({ _id: jobId, isDeleted: false });
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    const newApplication = await Application.create({
      jobId,
      userId,
      resumeUrl: user.resumeUrl,
      status: "Pending",
      // compatibility
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "job applied successfully",
      success: true,
      application: newApplication,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getappliedjobs = async (req, res) => {
  try {
    const userId = req.id;
    const { page, limit, skip } = parsePagination(req.query);
    const query = { userId };
    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "jobId",
          match: { isDeleted: false },
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "company",
          },
        }),
      Application.countDocuments(query),
    ]);

    return res.status(200).json({
      applications: applications.filter((application) => application.jobId),
      pagination: buildPaginationMeta({ page, limit, total }),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getadminapplicant = async (req, res) => {
  try {
    const jobId = req.params.jobId || req.params.id;
    const { page, limit, skip } = parsePagination(req.query);
    const job = await Job.findOne({ _id: jobId, isDeleted: false }).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "no job found",
        success: false,
      });
    }

    if (String(job.created_by) !== String(req.id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view applicants for this job",
      });
    }

    const query = { jobId };
    const [applications, total] = await Promise.all([
      Application.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId"),
      Application.countDocuments(query),
    ]);

    return res.status(200).json({
      job,
      applications,
      pagination: buildPaginationMeta({ page, limit, total }),
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const status = normalizeStatus(req.body.status);
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status must be one of: Pending, Accepted, Rejected",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    const job = await Job.findOne({ _id: application.jobId, isDeleted: false });
    if (!job || String(job.created_by) !== String(req.id)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this application",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      message: "Status Updated Successfully",
      success: true,
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};