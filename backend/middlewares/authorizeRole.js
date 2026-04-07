import { User } from "../models/user.model.js";

const normalizeRole = (role) => {
  if (!role) return "";
  if (role === "student") return "user";
  return role;
};

export const authorizeRole = (...allowedRoles) => async (req, res, next) => {
  try {
    const normalizedAllowedRoles = allowedRoles.map(normalizeRole);
    let currentRole = normalizeRole(req.role);

    if (!currentRole && req.id) {
      const currentUser = await User.findById(req.id).select("role");
      currentRole = normalizeRole(currentUser?.role);
      req.role = currentRole;
    }

    if (!normalizedAllowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized for this action",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Role authorization failed",
    });
  }
};
