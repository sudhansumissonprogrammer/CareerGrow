import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

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

    const job = await Job.findById(jobId);
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
    const applications = await Application.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "jobId",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
        },
      });

    return res.status(200).json({
      applications,
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
    const job = await Job.findById(jobId).populate("company");

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

    const applications = await Application.find({ jobId })
      .sort({ createdAt: -1 })
      .populate("userId");

    return res.status(200).json({
      job,
      applications,
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

    const job = await Job.findById(application.jobId);
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
