import express from "express";
import { getSiteStats } from "../controllers/stats.controller.js";

const statsRouter = express.Router();

statsRouter.route("/").get(getSiteStats);

export default statsRouter;
