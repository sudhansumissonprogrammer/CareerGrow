import express from "express";
import {
  deleteJob,
  getadminjob,
  getalljobs,
  getjobbyid,
  postjob,
} from "../controllers/job.controllers.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const jobRouter = express.Router();

jobRouter.route("/post").post(isAuthenticated, authorizeRole("recruiter"), postjob);
jobRouter.route("/").post(isAuthenticated, authorizeRole("recruiter"), postjob);
jobRouter.route("/").get(getalljobs);
jobRouter.route("/get").get(getalljobs);
jobRouter.route("/get/:id").get(getjobbyid);
jobRouter.route("/getadminjobs").get(isAuthenticated, authorizeRole("recruiter"), getadminjob);
jobRouter.route("/delete/:id").delete(isAuthenticated, authorizeRole("recruiter"), deleteJob);
jobRouter.route("/:id").delete(isAuthenticated, authorizeRole("recruiter"), deleteJob);

export default jobRouter;
