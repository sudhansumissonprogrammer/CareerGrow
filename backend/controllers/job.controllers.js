import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

const normalizeRequirements = (requirements, skills) => {
  const source = requirements ?? skills ?? [];
  if (Array.isArray(source)) {
    return source.map((value) => String(value).trim()).filter(Boolean);
  }
  return String(source)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
};

export const postjob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      skills,
      salary,
      location,
      jobtype,
      experience,
      position,
      companyId,
      company,
    } = req.body;

    const userId = req.id;

    if (!title || !description || !salary || !location || (!companyId && !company)) {
      return res.status(400).json({
        message: "title, company, location, salary and description are required",
        success: false,
      });
    }

    let finalCompanyId = companyId;
    if (!finalCompanyId && company) {
      const companyName = String(company).trim();
      let companyDoc = await Company.findOne({ name: companyName });
      if (!companyDoc) {
        companyDoc = await Company.create({
          name: companyName,
          location,
          userId,
        });
      }
      finalCompanyId = companyDoc._id;
    }

    const job = await Job.create({
      title,
      description,
      requirements: normalizeRequirements(requirements, skills),
      salary: Number(salary),
      location,
      jobtype: jobtype || "Full Time",
      experience: Number(experience || 0),
      position: Number(position || 1),
      company: finalCompanyId,
      created_by: userId,
    });

    return res.status(201).json({
      job,
      message: "job created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getalljobs = async (req, res) => {
  try {
    const { keyword = "", title = "", location = "", salary = "" } = req.query;
    const titleTerm = String(title || keyword).trim();
    const locationTerm = String(location).trim();
    const salaryLimit = Number(salary);

    const andFilters = [];

    if (titleTerm) {
      andFilters.push({
        $or: [
          { title: { $regex: titleTerm, $options: "i" } },
          { description: { $regex: titleTerm, $options: "i" } },
          { requirements: { $elemMatch: { $regex: titleTerm, $options: "i" } } },
        ],
      });
    }

    if (locationTerm) {
      andFilters.push({ location: { $regex: locationTerm, $options: "i" } });
    }

    if (!Number.isNaN(salaryLimit) && salaryLimit > 0) {
      andFilters.push({ salary: { $gte: salaryLimit } });
    }

    const query = andFilters.length > 0 ? { $and: andFilters } : {};

    const jobs = await Job.find(query).populate("company").sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getjobbyid = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("company");

    if (!job) {
      return res.status(404).json({
        message: "no job found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getadminjob = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId })
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
