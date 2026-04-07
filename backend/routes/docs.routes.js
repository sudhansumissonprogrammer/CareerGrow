import express from "express";
import { getApiDocs } from "../controllers/docs.controller.js";

const docsRouter = express.Router();

docsRouter.get("/", getApiDocs);

export default docsRouter;
