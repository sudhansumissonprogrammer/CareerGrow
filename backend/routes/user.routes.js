import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateprofile,
  updateResume,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { resumeUpload } from "../middlewares/uploadResume.js";

const router = express.Router();

router.route("/register").post(resumeUpload.single("resume"), register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticated, getCurrentUser);
router.route("/profile/update").post(isAuthenticated, updateprofile);
router.route("/update-resume").put(isAuthenticated, resumeUpload.single("resume"), updateResume);

export default router;
