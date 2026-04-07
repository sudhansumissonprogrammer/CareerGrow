import express from "express";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controllers.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const companyRouter = express.Router();

companyRouter.route("/register").post(isAuthenticated, registerCompany);
companyRouter.route("/get").get(getCompany);
companyRouter.route("/get/:id").get(getCompanyById);
companyRouter.route("/update/:id").put(isAuthenticated, updateCompany);

export default companyRouter;
