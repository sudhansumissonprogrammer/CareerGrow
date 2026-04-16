import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

export const getSiteStats = async (_req, res) => {
  try {
    const [companyCount, studentCount, jobSeekerCount] = await Promise.all([
      Company.countDocuments({}),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: { $in: ["user", "student"] } }),
    ]);

    return res.status(200).json({
      success: true,
      companies: companyCount,
      students: studentCount,
      jobSeekers: jobSeekerCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
