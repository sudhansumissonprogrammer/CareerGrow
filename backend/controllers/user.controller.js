import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const sanitizeUser = (userDoc) => ({
  _id: userDoc._id,
  fullname: userDoc.fullname,
  email: userDoc.email,
  phonenumber: userDoc.phonenumber,
  role: normalizeRole(userDoc.role),
  resumeUrl: userDoc.resumeUrl || "",
  profile: userDoc.profile,
});

function normalizeRole(role) {
  if (!role) return "";
  if (role === "student") return "user";
  return role;
}

const getFriendlyErrorMessage = (error, fallback = "Server error") => {
  if (!error) return fallback;

  if (error.code === 11000) {
    if (error.keyPattern?.email) return "Email is already registered";
    if (error.keyPattern?.phonenumber) return "Phone number is already registered";
    return "Duplicate value already exists";
  }

  if (error.name === "ValidationError") {
    const firstMessage = Object.values(error.errors || {})[0]?.message;
    return firstMessage || "Invalid input data";
  }

  return fallback;
};

const buildResumeUrl = (file) => {
  if (!file?.filename) return "";
  return `/uploads/resume/${file.filename}`;
};

const removeLocalResumeIfExists = async (resumeUrl) => {
  if (!resumeUrl) return;
  const relative = resumeUrl.startsWith("/") ? resumeUrl.slice(1) : resumeUrl;
  const absolutePath = path.resolve(process.cwd(), relative);
  try {
    await fs.unlink(absolutePath);
  } catch (_error) {
    // Ignore missing file errors.
  }
};

export const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password } = req.body;
    const role = normalizeRole(req.body.role);
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phonenumber || "").trim();

    if (!fullname || !normalizedEmail || !normalizedPhone || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    if (!["user", "recruiter"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Allowed values: user or recruiter",
        success: false,
      });
    }

    if (role === "user" && !req.file) {
      return res.status(400).json({
        message: "Resume upload is mandatory for user accounts",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
        success: false,
      });
    }

    const existingPhone = await User.findOne({ phonenumber: normalizedPhone });
    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number is already registered",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const resumeUrl = buildResumeUrl(req.file);

    await User.create({
      fullname,
      email: normalizedEmail,
      phonenumber: normalizedPhone,
      password: hashedPassword,
      role,
      resumeUrl,
      profile: {
        resume: resumeUrl,
        resumeoriginalname: req.file?.originalname || "",
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: getFriendlyErrorMessage(error, "Server error"),
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const role = normalizeRole(req.body.role);
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (!existingUser) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const normalizedStoredRole = normalizeRole(existingUser.role);
    if (role !== normalizedStoredRole) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: existingUser._id, role: normalizedStoredRole },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: `welcome back ${existingUser.fullname}`,
        success: true,
        user: sanitizeUser(existingUser),
      });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logout = async (_req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
      })
      .json({
        message: "logout successfully",
        success: true,
      });
  } catch (_error) {
    return res.status(500).json({
      message: "server error",
      success: false,
    });
  }
};

export const updateprofile = async (req, res) => {
  try {
    const { fullname, email, phonenumber, bio, skills } = req.body;
    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!user.profile) {
      user.profile = {};
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = String(email).trim().toLowerCase();
    if (phonenumber) user.phonenumber = String(phonenumber).trim();
    if (bio) user.profile.bio = bio;

    if (skills) {
      const parsedSkills = Array.isArray(skills)
        ? skills
        : String(skills)
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);
      user.profile.skills = parsedSkills;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: sanitizeUser(user),
    });
  } catch (_error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (normalizeRole(user.role) !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only user accounts can update resume",
      });
    }

    await removeLocalResumeIfExists(user.resumeUrl);

    const resumeUrl = buildResumeUrl(req.file);
    user.resumeUrl = resumeUrl;
    if (!user.profile) {
      user.profile = {};
    }
    user.profile.resume = resumeUrl;
    user.profile.resumeoriginalname = req.file.originalname;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      user: sanitizeUser(user),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
