import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  applyjob,
  getappliedjobs,
  getadminapplicant,
  updateStatus,
} from "../controllers/application.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";

const applicationRouter = express.Router();

applicationRouter.route("/apply/:jobId").post(isAuthenticated, authorizeRole("user"), applyjob);
applicationRouter.route("/get").get(isAuthenticated, authorizeRole("user"), getappliedjobs);
applicationRouter.route("/:id/applicant").get(isAuthenticated, authorizeRole("recruiter"), getadminapplicant);
applicationRouter.route("/status/:id/update").post(isAuthenticated, authorizeRole("recruiter"), updateStatus);

applicationRouter.route("/my").get(isAuthenticated, authorizeRole("user"), getappliedjobs);
applicationRouter.route("/job/:jobId").get(isAuthenticated, authorizeRole("recruiter"), getadminapplicant);
applicationRouter.route("/status/:id").put(isAuthenticated, authorizeRole("recruiter"), updateStatus);

export default applicationRouter;
